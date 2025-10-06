/* eslint-disable no-console */
import axios from 'axios';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import zlib from 'zlib';
import yauzl from 'yauzl';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import sax from 'sax';
import { EOL } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Downloads data from url
 *
 * @param {string} url - url to .zip, .gz, ..., files
 * @param {string} filePath - where to save the data
 */
async function downloadData(url, filePath) {
  try {
    const response = await axios({
      method: 'get',
      url,
      responseType: 'stream',
    });
    const writer = createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading data:', error);
    throw error;
  }
}

/**
 * Uncompressing .gz files
 *
 * @param {string} filePath - path to the compressed file
 */
async function unzipGzip(filePath) {
  return new Promise((resolve, reject) => {
    const decompressedStream = createWriteStream(filePath.replace('.gz', ''));
    createReadStream(filePath)
      .pipe(zlib.createGunzip())
      .pipe(decompressedStream)
      .on('finish', () => resolve(filePath.replace('.gz', '')))
      .on('error', reject);
  });
}

/**
 * Uncompressing .zip files larger than 512MB using streams
 *
 * @param {string} filePath - path to the compressed file
 * @param {string} outputDir - Where to save the uncompressed data
 */
async function unzipZip(filePath, outputDir) {
  return new Promise((resolve, reject) => {
    yauzl.open(filePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }

      zipfile.readEntry();

      zipfile.on('entry', (entry) => {
        if (/\/$/.test(entry.fileName)) {
          // Directory file names end with '/'
          zipfile.readEntry();
        } else {
          // File entry
          zipfile.openReadStream(entry, (readStreamErr, readStream) => {
            if (readStreamErr) {
              reject(readStreamErr);
              return;
            }

            // Ensure output directory exists, or create it
            const outputPath = path.join(outputDir, entry.fileName);
            const outputDirPath = path.dirname(outputPath);

            // Create directory if it doesn't exist
            mkdirSync(outputDirPath, { recursive: true });

            // Pipe stream to file
            const writeStream = createWriteStream(outputPath);
            readStream.pipe(writeStream);

            writeStream.on('finish', () => {
              resolve(outputPath); // Resolve with the path of the unzipped file
            });
          });
        }
      });

      zipfile.once('end', () => {
        zipfile.close();
      });
    });
  });
}

/**
 * Convert XML files to Json
 *
 * @param {string} xmlFilePath - path to the xml file
 * @param {string} jsonFilePath - path to the json file
 */
async function convertCweXmlToJson(xmlFilePath, jsonFilePath) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(xmlFilePath);
    const parser = sax.createStream(true, { trim: true, normalize: true });
    const output = [];
    let currentWeakness = null;
    let currentElement = '';
    let currentSubElement = '';
    let currentConsequence = null;

    parser.on('opentag', (node) => {
      if (node.name === 'Weakness') {
        currentWeakness = {
          'CWE-ID': node.attributes.ID,
          Name: node.attributes.Name,
          Description: '',
          Extended_Description: '',
          Alternate_Terms: [],
          Likelihood_Of_Exploit: '',
          Common_Consequences: [],
          Related_Weaknesses: [],
        };
      } else if (currentWeakness) {
        currentElement = node.name;
        if (currentElement === 'Consequence') {
          currentConsequence = { Scope: '', Impacts: [] };
        } else if (currentElement === 'Related_Weakness') {
          currentSubElement = {
            Nature: node.attributes.Nature,
            CWE_ID: node.attributes.CWE_ID,
          };
          currentWeakness.Related_Weaknesses.push(currentSubElement);
        }
      }
    });

    parser.on('text', (text) => {
      if (currentWeakness) {
        switch (currentElement) {
          case 'Description':
            currentWeakness.Description += text;
            break;
          case 'Extended_Description':
            currentWeakness.Extended_Description += text;
            break;
          case 'Term':
            currentWeakness.Alternate_Terms.push(text);
            break;
          case 'Likelihood_Of_Exploit':
            currentWeakness.Likelihood_Of_Exploit += text;
            break;
          case 'Related_Weakness':
            break;
          case 'Impact':
            if (currentConsequence) {
              currentConsequence.Impacts.push(text);
            }
            break;
          case 'Scope':
            if (currentConsequence) {
              currentConsequence.Scope += text;
            }
            break;
          default:
            // Do nothing - satisfies ESLint
            break;
        }
      }
    });

    parser.on('closetag', (nodeName) => {
      if (nodeName === 'Weakness') {
        output.push(currentWeakness);
        currentWeakness = null;
      } else if (nodeName === 'Consequence') {
        if (currentWeakness && currentConsequence) {
          currentWeakness.Common_Consequences.push(currentConsequence);
          currentConsequence = null;
        }
      }
    });

    parser.on('end', async () => {
      try {
        // Sort output by CWE-ID in ascending order
        output.sort(
          (a, b) => parseInt(a['CWE-ID'], 10) - parseInt(b['CWE-ID'], 10),
        );
        await writeFile(jsonFilePath, JSON.stringify(output, null, 4));
        resolve(jsonFilePath);
      } catch (err) {
        reject(err);
      }
    });

    parser.on('error', (error) => {
      reject(error);
    });

    stream.pipe(parser);
  });
}

/**
 * Convert XML files to CSV
 *
 * @param {string} xmlFilePath - path to the xml file
 * @param {string} csvFilePath - path to the csv file
 */
async function convertXmlToCsv(xmlFilePath, csvFilePath) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(xmlFilePath);
    const parser = sax.createStream(true);
    const csvStream = createWriteStream(csvFilePath);
    let currentItem = null;
    let currentElement = '';

    // Write CSV header
    csvStream.write(`cpe_name,title,references,cpe23_name${EOL}`);

    parser.on('opentag', (node) => {
      currentElement = node.name; // Keep track of the current element

      if (node.name === 'cpe-item' || node.local === 'cpe-item') {
        currentItem = {
          cpe_name: node.attributes.name,
          title: '',
          references: [],
          cpe23_name: '',
        };
      } else if (
        currentItem &&
        (node.name === 'reference' || node.local === 'reference')
      ) {
        currentItem.references.push({
          href: node.attributes.href || '',
          text: '',
        });
      } else if (
        currentItem &&
        (node.name === 'cpe-23:cpe23-item' || node.local === 'cpe23-item')
      ) {
        currentItem.cpe23_name = node.attributes.name || '';
      }
    });

    parser.on('attribute', (attr) => {
      if (
        currentItem &&
        currentElement === 'cpe-item' &&
        attr.name === 'name'
      ) {
        currentItem.cpe_name = attr.value;
      } else if (
        currentItem &&
        currentElement.startsWith('cpe-23:') &&
        attr.name === 'name'
      ) {
        currentItem.cpe23_name = attr.value;
      }
    });

    parser.on('text', (text) => {
      if (currentItem) {
        if (
          currentElement === 'title' ||
          currentElement === '{http://cpe.mitre.org/dictionary/2.0}title'
        ) {
          currentItem.title += text;
        } else if (
          currentElement === 'reference' ||
          currentElement === '{http://cpe.mitre.org/dictionary/2.0}reference'
        ) {
          const lastRef =
            currentItem.references[currentItem.references.length - 1];
          lastRef.text += text;
        }
      }
    });

    parser.on('closetag', (nodeName) => {
      if (
        nodeName === 'cpe-item' ||
        nodeName === '{http://cpe.mitre.org/dictionary/2.0}cpe-item'
      ) {
        const referencesString = JSON.stringify(currentItem.references).replace(
          /"/g,
          '""',
        );
        const csvLine = `"${currentItem.cpe_name}","${currentItem.title}","${referencesString}","${currentItem.cpe23_name}"`;
        csvStream.write(csvLine + EOL);
        currentItem = null;
      }
      currentElement = ''; // Reset current element
    });

    parser.on('end', () => {
      csvStream.end();
      console.log(`CPE data written to CSV file: ${csvFilePath}`);
      resolve(csvFilePath);
    });

    parser.on('error', (error) => {
      reject(error);
    });

    stream.pipe(parser);
  });
}

async function main() {
  try {
    // Create necessary directories if not existing
    const dataDir = path.resolve(__dirname, '../data');
    const reportsDir = path.resolve(__dirname, '../vulnerability-reports');
    mkdirSync(dataDir, { recursive: true });
    mkdirSync(reportsDir, { recursive: true });

    const cpeUrl =
      'https://drive.google.com/uc?export=download&id=1LE9MBZARgv1p-7rLUQCXgeHdiKMli7uB';
    const cweUrl =
      'https://drive.google.com/uc?export=download&id=1ZHwkip0kua1WBlQsEqMo9Nq4ytBPjlWs';

    // Downloading latest CPE data
    const cpeFilePath = await downloadData(
      cpeUrl,
      path.resolve(__dirname, '../data/cpeData.gz'),
    );
    const cpeXmlPath = await unzipGzip(cpeFilePath);

    // Converting XML to CSV
    await convertXmlToCsv(
      cpeXmlPath,
      path.resolve(__dirname, '../vulnerability-reports/cpe_data.csv'),
    );

    // Downloading latest CWE data
    const cweFilePath = await downloadData(
      cweUrl,
      path.resolve(__dirname, '../data/cweData.zip'),
    );
    const outputDir = path.resolve(__dirname, '../data');

    const cweXmlPath = await unzipZip(cweFilePath, outputDir);
    const cweJsonPath = path.resolve(
      __dirname,
      '../vulnerability-reports/cweData.json',
    );

    // Converting CWE data from XML to json
    await convertCweXmlToJson(cweXmlPath, cweJsonPath);
  } catch (error) {
    console.error('Error in main function', error);
  }
}

main().catch(console.error);
