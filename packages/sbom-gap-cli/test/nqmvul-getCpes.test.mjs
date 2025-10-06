import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

describe('unibom -getCpes command', () => {
  const projectRoot = process.cwd();
  const sbomPath = path.join(projectRoot, 'test/test-files/sbom_short.json');

  test('extracts CPEs from an existing SBOM file', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync(`unibom -getCpes ${sbomPath}`);

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('cpe:2.3:a:thekelleys:dnsmasq:0.4:*:*:*:*:*:*:*');
  });
});
