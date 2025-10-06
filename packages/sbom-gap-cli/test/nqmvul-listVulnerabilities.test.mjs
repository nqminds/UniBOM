import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -listVulnerabilities command', () => {
  const projectRoot = process.cwd();
  const reportPath = path.join(
    projectRoot,
    'test/test-files/vulnerability_report',
  );

  test('Lists vulnerabilities from grype report', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -listVulnerabilities ${reportPath}`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('Creating vulnerability report');
    expect(stdout).toContain("name: 'ansi-regex'");
  });
});
