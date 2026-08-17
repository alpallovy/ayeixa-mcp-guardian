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

export interface AuditLogRecord {
  index: number;
  timestamp: string;
  toolName: string;
  argumentsDigest: string;
  verdict: 'ALLOWED' | 'DENIED' | 'ERROR';
  reason?: string;
  previousHash: string;
  currentHash: string;
}

export interface ExecutionVerdict<T = unknown> {
  allowed: boolean;
  result?: T;
  rejectionReason?: string;
  auditIndex: number;
}
