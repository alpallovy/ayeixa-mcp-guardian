import { ToolPermissionFence } from '../src/ToolPermissionFence';

describe('ToolPermissionFence', () => {
  const fence = new ToolPermissionFence({
    allowedTools: ['read_file', 'run_command'],
    blockedCommands: ['rm -rf', 'sudo', 'chmod 777']
  });

  it('allows permitted tools with clean arguments', () => {
    const verdict = fence.evaluate({
      toolName: 'read_file',
      arguments: { path: './package.json' },
      role: 'developer'
    });
    expect(verdict.allowed).toBe(true);
  });

  it('blocks disallowed tools fail-closed', () => {
    const verdict = fence.evaluate({
      toolName: 'delete_database',
      arguments: {},
      role: 'developer'
    });
    expect(verdict.allowed).toBe(false);
    expect(verdict.reason).toContain('not in the security allowlist');
  });

  it('blocks path traversal attacks in arguments', () => {
    const verdict = fence.evaluate({
      toolName: 'read_file',
      arguments: { path: '../../../etc/passwd' },
      role: 'developer'
    });
    expect(verdict.allowed).toBe(false);
    expect(verdict.reason).toContain('Directory traversal detected');
  });

  it('blocks destructive shell commands', () => {
    const verdict = fence.evaluate({
      toolName: 'run_command',
      arguments: { command: 'rm -rf /' },
      role: 'developer'
    });
    expect(verdict.allowed).toBe(false);
    expect(verdict.reason).toContain('Destructive or prohibited command');
  });
});
