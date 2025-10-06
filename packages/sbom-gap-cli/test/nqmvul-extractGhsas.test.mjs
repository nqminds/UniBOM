import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -extractGhsas command', () => {
  const projectRoot = process.cwd();
  const reportPath = path.join(
    projectRoot,
    'test/test-files/vulnerability_report',
  );

  test('Lists Ghsas vulnerabilities', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -extractGhsas ${reportPath}`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('GHSA-93q8-gq69-wqmw');
    expect(stdout).toContain('GHSA-j8xg-fqg3-53r7');
  });
});
