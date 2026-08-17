import { ToolPermissionFence } from '../src/ToolPermissionFence';
import { RuntimeAuditLogger } from '../src/RuntimeAuditLogger';
import { GuardianSandbox } from '../src/GuardianSandbox';

describe('GuardianSandbox', () => {
  it('executes permitted operation and records audit verdict', async () => {
    const fence = new ToolPermissionFence({
      allowedTools: ['test_tool'],
      blockedCommands: []
    });
    const audit = new RuntimeAuditLogger();
    const sandbox = new GuardianSandbox(fence, audit);

    const verdict = await sandbox.evaluateAndExecute({
      toolName: 'test_tool',
      arguments: { val: 42 },
      role: 'agent'
    }, async (args) => {
      return (args.val as number) * 2;
    });

    expect(verdict.allowed).toBe(true);
    expect(verdict.result).toBe(84);
    expect(audit.getLedger()).toHaveLength(1);
    expect(audit.getLedger()[0].verdict).toBe('ALLOWED');
  });
});
