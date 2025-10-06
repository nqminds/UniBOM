import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'node:path';
import { dirname } from 'path';
import { create } from 'xmlbuilder2';
import { v4 as uuidv4 } from 'uuid';
import { createCPEMapping, processDependencies } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateRandomHex(length) {
  let result = '';
  const characters = '0123456789abcdef';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// create a dummy SBOM file in CycloneDx XML format
function createCycloneDxSBOMXml(cpeMapping) {
  const bom = create({ version: '1.0' })
    .ele('bom', { xmlns: 'http://cyclonedx.org/schema/bom/1.2', version: '1' })
    .ele('components');

  Object.keys(cpeMapping).forEach((dep) => {
    const cpeNames = cpeMapping[dep];
    cpeNames.forEach((cpe) => {
      const parts = cpe.split(':');
      const version = parts[4];
      bom
        .ele('component', { type: 'library' })
        .ele('name')
        .txt(dep)
        .up()
        .ele('version')
        .txt(version)
        .up()
        .ele('cpe')
        .txt(cpe)
        .up();
    });
  });

  return bom.end({ prettyPrint: true });
}

// Create a dummy SBOM file in CycloneDX JSON format
function createCycloneDxSBOMJson(cpeMapping) {
  const ref = generateRandomHex(10);
  const bom = {
    $schema: 'http://cyclonedx.org/schema/bom-1.4.schema.json',
    bomFormat: 'CycloneDX',
    specVersion: '1.4',
    serialNumber: `urn:uuid:${uuidv4()}`,
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [
        {
          vendor: 'nquiringminds',
          name: 'unibom',
          version: '1',
        },
      ],
      component: {
        'bom-ref': `${ref}`,
        type: 'file',
        name: '/home/',
      },
    },
    components: [],
  };

  Object.keys(cpeMapping).forEach((dep) => {
    const cpeNames = cpeMapping[dep];
    cpeNames.forEach((cpe) => {
      const parts = cpe.split(':');
      const version = parts[4];

      const component = {
        'bom-ref': `pkg:${dep}@${version}`,
        type: 'library',
        name: dep,
        version,
        licenses: [
          {
            license: {
              id: '',
            },
          },
        ],
        cpe,
        purl: '',
        properties: [
          {
            name: `${dep}`,
            value: '',
          },
        ],
      };

      bom.components.push(component);
    });
  });

  return JSON.stringify(bom, null, 2);
}

/**
 * Returns a bom from a list of dependencies
 *
 * @param {string} projectName - name of your project
 * @param {string} bomFormat - json or xml
 */
export async function generateDummySBOM(
  projectName,
  bomFormat,
  outputDir = null,
) {
  let cycloneDxSBOM;
  const dirPath = path.resolve(__dirname, '../vulnerability-reports/sboms');
  let sbomFilePath = path.resolve(
    __dirname,
    `../vulnerability-reports/sboms/${projectName}_sbom.${bomFormat}`,
  );
  try {
    const conanFilePath = path.resolve(
      __dirname,
      `../vulnerability-reports/conan-files/${projectName}/conanfile.txt`,
    );
    const csvFilePath = path.resolve(
      __dirname,
      '../vulnerability-reports/cpe_data.csv',
    );
    const dependencies = await processDependencies(conanFilePath);
    const cpeMapping = await createCPEMapping(csvFilePath, dependencies);
    if (bomFormat === 'json') {
      cycloneDxSBOM = createCycloneDxSBOMJson(cpeMapping);
    } else if (bomFormat === 'xml') {
      cycloneDxSBOM = createCycloneDxSBOMXml(cpeMapping);
    } else {
      // default to json
      cycloneDxSBOM = createCycloneDxSBOMJson(cpeMapping);
      sbomFilePath = path.resolve(
        __dirname,
        `../vulnerability-reports/sboms/${projectName}_sbom.json`,
      );
    }
    const sbomDirectory = outputDir
      ? path.resolve(outputDir, `${projectName}_sbom.json`)
      : sbomFilePath;
    fs.mkdirSync(dirPath, { recursive: true }); // create directory if dosen't exist
    fs.writeFileSync(sbomDirectory, cycloneDxSBOM);
  } catch (error) {
    throw new Error(
      `Error trying writing CycloneDX SBOM file: ${error.message}`,
    );
  }
}
