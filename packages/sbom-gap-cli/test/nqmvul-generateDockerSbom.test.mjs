import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { expect } from '@jest/globals';

const execAsync = promisify(exec);

describe('unibom -generateSbom command', () => {
  const projectRoot = process.cwd();
  const outputFilePath = path.join(
    projectRoot,
    'vulnerability-reports',
    'sboms',
    'ccscaner.json',
  );
  const grypeOutputFilePath = path.join(
    projectRoot,
    'vulnerability-reports',
    'reports',
    'vulnerability_report_ccscaner',
  );

  afterAll(() => {
    if (fs.existsSync(outputFilePath)) {
      try {
        fs.unlinkSync(outputFilePath);
      } catch (err) {
        throw new Error(
          `Failed to clean up the reports/vulnerability_report file: ${err}`,
        );
      }
    }
  });

  afterAll(() => {
    if (fs.existsSync(grypeOutputFilePath)) {
      try {
        fs.unlinkSync(grypeOutputFilePath);
      } catch (err) {
        throw new Error(`Failed to clean up the Vuln file: ${err}`);
      }
    }
  });

  test('generates SBOM file and saves it to the specified path', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('unibom -generateDockerSbom ionutnqm/depscanner:latest ccscaner');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain(
      'Running syft to generate SBOM for Docker image: ionutnqm/depscanner:latest...',
    );
    expect(stdout).toContain('SBOM generation completed for Docker image.');
    expect(stdout).toContain(
      'Running grype to generate vulnerability report...',
    );
    expect(stdout).toContain('Vulnerability report saved to:');
    const fileExists = fs.existsSync(outputFilePath);
    const vulnFileExists = fs.existsSync(grypeOutputFilePath);
    expect(fileExists).toBe(true);
    expect(vulnFileExists).toBe(true);
  });
});
