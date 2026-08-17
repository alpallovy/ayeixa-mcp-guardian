import { RuntimeAuditLogger } from '../src/RuntimeAuditLogger';

describe('RuntimeAuditLogger', () => {
  it('maintains tamper-evident hash chain integrity', () => {
    const logger = new RuntimeAuditLogger();
    logger.log('read_file', { path: 'a.ts' }, 'ALLOWED');
    logger.log('write_file', { path: 'b.ts' }, 'DENIED', 'Unauthorized');
    logger.log('run_command', { cmd: 'ls' }, 'ALLOWED');

    expect(logger.getLedger()).toHaveLength(3);
    expect(logger.verifyIntegrity()).toBe(true);
  });
});
