import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -generateCCPPReport command', () => {
  const projectRoot = process.cwd();
  const nodeModulesPath = path.join(projectRoot, 'test/test-files/main.cpp');
  const outputFilePath = path.join(
    projectRoot,
    'vulnerability-reports',
    'sboms',
    'test_ccs_sbom.json',
  );

  afterAll(() => {
    if (fs.existsSync(outputFilePath)) {
      try {
        fs.unlinkSync(outputFilePath);
      } catch (err) {
        throw new Error(`Failed to clean up the SBOM file: ${err}`);
      }
    }
  });

  test('generates SBOM file and saves it to the specified path', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -generateCCPPReport ${nodeModulesPath} test_ccs`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('dependency scanning completed');
    expect(stdout).toContain('CPE mapping completed');
    expect(stdout).toContain('SBOM generation completed');
    expect(stdout).toContain('Running grype to generate vulnerability report');
    const fileExists = fs.existsSync(outputFilePath);
    expect(fileExists).toBe(true);
  });
});
