import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -writeCVEs command', () => {
  const projectRoot = process.cwd();
  const outputFilePathPath = path.join(projectRoot, 'test/test-files/');
  const sbomFilePath = path.join(
    projectRoot,
    'test',
    'test-files',
    'sbom_short.json',
  );
  const outputFile = path.join(projectRoot, 'test/test-files/cveData.json');

  afterAll(() => {
    if (fs.existsSync(outputFile)) {
      try {
        fs.unlinkSync(outputFile);
      } catch (err) {
        throw new Error(`Failed to clean up the cveData file: ${err}`);
      }
    }
  });

  test('writes cves to a specified file', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -writeCves ${sbomFilePath} ${outputFilePathPath}`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('Writing CVE data to cveData.json');
    expect(stdout).toContain('Writing file completed');
    const fileExists = fs.existsSync(outputFile);
    expect(fileExists).toBe(true);
  });
});
