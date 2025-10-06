import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('unibom -getCves command', () => {
  test('retrieve CVEs for cpe', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('unibom -getCves cpe:2.3:a:thekelleys:dnsmasq:0.4:*:*:*:*:*:*:*');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('CVE');
  });
});
