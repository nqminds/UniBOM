import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -generateSbom command', () => {
  const projectRoot = process.cwd();
  const testProjectPath = path.join(
    projectRoot,
    'test/test-files/sbom_short.json',
  );
  const outputFilePath = path.join(
    projectRoot,
    'vulnerability-reports',
    'sboms',
    'test_sbom.json',
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

  test('generates SBOM file and saves it to the specified path', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -generateSbom ${testProjectPath} test_sbom`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('SBOM generation completed');
    const fileExists = fs.existsSync(outputFilePath);
    expect(fileExists).toBe(true);
  });
});
