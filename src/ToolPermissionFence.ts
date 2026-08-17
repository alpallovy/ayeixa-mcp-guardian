import { SecurityPolicy, MCPToolInvocation } from './types';
import { InvocationSanitizer } from './InvocationSanitizer';

export class ToolPermissionFence {
  private sanitizer = new InvocationSanitizer();

  constructor(private policy: SecurityPolicy) {}

  public evaluate(invocation: MCPToolInvocation): { allowed: boolean; reason?: string } {
    // 1. Tool allowlist check
    if (!this.policy.allowedTools.includes(invocation.toolName)) {
      return { allowed: false, reason: `Tool '${invocation.toolName}' is not in the security allowlist.` };
    }

    // 2. Argument inspections
    for (const [key, value] of Object.entries(invocation.arguments || {})) {
      if (typeof value === 'string') {
        if (key.toLowerCase().includes('path') || key.toLowerCase().includes('file')) {
          const pathCheck = this.sanitizer.sanitizePath(value, this.policy.allowedPathsRoot);
          if (!pathCheck.safe) return { allowed: false, reason: pathCheck.reason };
        }

        if (key.toLowerCase().includes('cmd') || key.toLowerCase().includes('command')) {
          const cmdCheck = this.sanitizer.sanitizeCommand(value, this.policy.blockedCommands);
          if (!cmdCheck.safe) return { allowed: false, reason: cmdCheck.reason };
        }
      }
    }

    return { allowed: true };
  }
}
