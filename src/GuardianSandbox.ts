import { ToolPermissionFence } from './ToolPermissionFence';
import { RuntimeAuditLogger } from './RuntimeAuditLogger';
import { MCPToolInvocation, ExecutionVerdict } from './types';

export class GuardianSandbox {
  constructor(
    private fence: ToolPermissionFence,
    private audit: RuntimeAuditLogger
  ) {}

  public async evaluateAndExecute<T>(
    invocation: MCPToolInvocation,
    executor: (args: Record<string, unknown>) => Promise<T>
  ): Promise<ExecutionVerdict<T>> {
    const evaluation = this.fence.evaluate(invocation);

    if (!evaluation.allowed) {
      const record = this.audit.log(invocation.toolName, invocation.arguments, 'DENIED', evaluation.reason);
      return {
        allowed: false,
        rejectionReason: evaluation.reason,
        auditIndex: record.index
      };
    }

    try {
      const result = await executor(invocation.arguments);
      const record = this.audit.log(invocation.toolName, invocation.arguments, 'ALLOWED');
      return {
        allowed: true,
        result,
        auditIndex: record.index
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const record = this.audit.log(invocation.toolName, invocation.arguments, 'ERROR', errMsg);
      return {
        allowed: false,
        rejectionReason: errMsg,
        auditIndex: record.index
      };
    }
  }
}
