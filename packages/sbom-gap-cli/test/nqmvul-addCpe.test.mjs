/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import * as fs from 'fs/promises';
import * as fsSync from 'fs'; 
import path from 'path';
import { addCpeToSbom } from '../src/utils.mjs';


const projectRoot = process.cwd();
const testFilePath = path.join(
  projectRoot,
  'test',
  'test-files',
  'test_sbom.json'
);
const grypeOutputFilePath = path.join(
    projectRoot,
    'vulnerability-reports',
    'reports',
    'vulnerability_report_test',
  );

const newCpe = 'cpe:/a:example:product:1.0';

const existingSbomData = {
  bomFormat: "CycloneDX",
  components: [
    {
      cpe: "cpe:/a:thekelleys:dnsmasq:2.85",
      group: "",
      licenses: [
        {
          license: {
            name: "GPL-2.0",
          },
        },
      ],
      name: "dnsmasq",
      supplier: {
        name: "Organization: OpenWrt ()",
      },
      type: "application",
      version: "2.85",
    },
  ],
  serialNumber: "urn:uuid:00000000-0000-0000-0000-000000000000",
  specVersion: "1.4",
  version: 1,
};

describe('unibom -addCpeToSbom command', () => {
    beforeEach(async () => {
      await fs.writeFile(testFilePath, JSON.stringify(existingSbomData, null, 2), 'utf8');
    });
  
    afterEach(async () => {
      if (fsSync.existsSync(testFilePath)) {
        try {
          await fs.unlink(testFilePath);
        } catch (err) {
          throw new Error(`Failed to clean up the test file: ${err}`);
        }
      }

      if (fsSync.existsSync(grypeOutputFilePath)) {
        try {
          await fs.unlink(grypeOutputFilePath);
        } catch (err) {
          throw new Error(`Failed to clean up the test file: ${err}`);
        }
      }
    });
  
    it('adds a CPE to an SBOM file and updates it', async () => {
      await addCpeToSbom(testFilePath, newCpe);
  
      const updatedData = JSON.parse(await fs.readFile(testFilePath, 'utf8'));
      expect(updatedData.components).toHaveLength(2);
      expect(updatedData.components[1].cpe).toEqual(newCpe);
    });
  });