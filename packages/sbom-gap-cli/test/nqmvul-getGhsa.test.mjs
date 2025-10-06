import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('unibom -getGhsa command', () => {
  test('displays getGhsa information', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('unibom -getGhsa GHSA-j8xg-fqg3-53r7');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('schema_version');
    expect(stdout).toContain('id');
    expect(stdout).toContain('modified');
    expect(stdout).toContain('published');
    expect(stdout).toContain('aliases');
    expect(stdout).toContain('summary');
    expect(stdout).toContain('details');
    expect(stdout).toContain('severity');
  });
});
