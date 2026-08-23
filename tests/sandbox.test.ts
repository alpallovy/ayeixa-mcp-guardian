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

  it.each([
    [
      'allowlist deny',
      { toolName: 'delete_database', arguments: {}, role: 'agent' },
      'TOOL_NOT_ALLOWED'
    ],
    [
      'path traversal',
      { toolName: 'read_file', arguments: { path: '../../secret' }, role: 'developer' },
      'PATH_TRAVERSAL'
    ]
  ])('records structured context for %s', async (_name, invocation, reasonCode) => {
    const audit = new RuntimeAuditLogger();
    const sandbox = new GuardianSandbox(new ToolPermissionFence({
      allowedTools: ['read_file'],
      blockedCommands: []
    }), audit);

    await sandbox.evaluateAndExecute(invocation, async () => 'not run');

    const record = audit.getLedger()[0];
    expect(record).toMatchObject({
      toolName: invocation.toolName,
      role: invocation.role,
      verdict: 'DENIED',
      reasonCode
    });
    expect(record.timestamp).toEqual(expect.any(String));
    expect(record).not.toHaveProperty('arguments');
  });
});
