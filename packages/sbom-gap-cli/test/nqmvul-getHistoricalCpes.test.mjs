import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('unibom -getHistoricalCpes command', () => {
  test('displays historical CPEs', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('unibom -getHistoricalCpes cpe:2.3:a:thekelleys:dnsmasq:2.85');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('Fetching historical CPEs from API');
    expect(stdout).toContain('cpe:2.3:a:thekelleys:dnsmasq');
  });
});
