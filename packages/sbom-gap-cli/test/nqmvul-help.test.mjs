import { exec } from 'child_process';
import { describe, test, expect } from '@jest/globals';

describe('unibom -help command', () => {
  test('should display the help text', (done) => {
    exec('unibom -help', (error, stdout, stderr) => {
      expect(error).toBeNull();
      expect(stderr).toBe('');
      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('Arguments:');
      expect(stdout).toContain('-getCpes');
      expect(stdout).toContain('-listCpeDetails');
      expect(stdout).toContain('-getCves');
      expect(stdout).toContain('-writeCves');
      expect(stdout).toContain('-getHistoricalCpes');
      expect(stdout).toContain('-getCveInfo');
      expect(stdout).toContain('-getCweInfo');
      expect(stdout).toContain('-listVulnerabilities');
      expect(stdout).toContain('-generateSbom');
      expect(stdout).toContain('-generateConan');
      expect(stdout).toContain('-genDependencies');
      expect(stdout).toContain('-mapCpes');
      expect(stdout).toContain('-generateCSbom');
      expect(stdout).toContain('-getGhsa');
      expect(stdout).toContain('-extractGhsas');
      expect(stdout).toContain('-classifyCwe');
      expect(stdout).toContain('-getHistory');
      expect(stdout).toContain('-generateCCPPReport');
      expect(stdout).toContain('-generateDockerSbom');
      expect(stdout).toContain('-addCpe');
      done();
    });
  });
});
