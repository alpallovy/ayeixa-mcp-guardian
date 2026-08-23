export interface MCPToolInvocation {
  toolName: string;
  arguments: Record<string, unknown>;
  role: string;
  timestamp?: string;
}

export interface SecurityPolicy {
  allowedTools: string[];
  blockedCommands: string[];
  allowedPathsRoot?: string;
}

export type DenialReasonCode = 'TOOL_NOT_ALLOWED' | 'PATH_TRAVERSAL' | 'COMMAND_BLOCKED';

export interface PermissionEvaluation {
  allowed: boolean;
  reason?: string;
  reasonCode?: DenialReasonCode;
}

export interface AuditLogRecord {
  index: number;
  timestamp: string;
  toolName: string;
  role: string;
  argumentsDigest: string;
  verdict: 'ALLOWED' | 'DENIED' | 'ERROR';
  reason?: string;
  reasonCode?: DenialReasonCode;
  previousHash: string;
  currentHash: string;
}

export interface ExecutionVerdict<T = unknown> {
  allowed: boolean;
  result?: T;
  rejectionReason?: string;
  auditIndex: number;
}
