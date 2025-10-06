import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -listCpeDetails command', () => {
  const projectRoot = process.cwd();
  const testPath = path.join(projectRoot, 'test/test-files/sbom_short.json');

  test('Lists vulnerabilities', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -listCpeDetails ${testPath}`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('cpe:2.3:a:thekelleys:dnsmasq:0.4:*:*:*:*:*:*:*');
  });
});
