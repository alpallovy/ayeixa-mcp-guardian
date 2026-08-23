import { RuntimeAuditLogger } from '../src/RuntimeAuditLogger';

describe('RuntimeAuditLogger', () => {
  it('maintains tamper-evident hash chain integrity', () => {
    const logger = new RuntimeAuditLogger();
    logger.log('read_file', 'agent', { path: 'a.ts' }, 'ALLOWED');
    logger.log('write_file', 'agent', { path: 'b.ts' }, 'DENIED', 'Unauthorized', 'TOOL_NOT_ALLOWED');
    logger.log('run_command', 'developer', { cmd: 'ls' }, 'ALLOWED');

    expect(logger.getLedger()).toHaveLength(3);
    expect(logger.verifyIntegrity()).toBe(true);
  });
});
