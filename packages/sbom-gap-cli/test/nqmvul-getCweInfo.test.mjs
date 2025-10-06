import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('unibom -getCweInfo command', () => {
  test('displays CWE information single', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('unibom -getCweInfo CWE-476');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('Description');
  });
  test('displays CWE information multiple', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('unibom -getCweInfo CWE-476,CWE-681');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('Description');
  });
});
