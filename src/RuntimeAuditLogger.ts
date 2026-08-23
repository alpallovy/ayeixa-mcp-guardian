import * as crypto from 'crypto';
import { AuditLogRecord } from './types';

export class RuntimeAuditLogger {
  private ledger: AuditLogRecord[] = [];
  private lastHash = '0000000000000000000000000000000000000000000000000000000000000000';

  public log(
    toolName: string,
    role: string,
    args: Record<string, unknown>,
    verdict: 'ALLOWED' | 'DENIED' | 'ERROR',
    reason?: string,
    reasonCode?: AuditLogRecord['reasonCode']
  ): AuditLogRecord {
    const index = this.ledger.length;
    const timestamp = new Date().toISOString();
    const argsDigest = crypto.createHash('sha256').update(JSON.stringify(args || {})).digest('hex');

    const payload = `${index}:${timestamp}:${toolName}:${role}:${argsDigest}:${verdict}:${reasonCode || ''}:${this.lastHash}`;
    const currentHash = crypto.createHash('sha256').update(payload).digest('hex');

    const record: AuditLogRecord = {
      index,
      timestamp,
      toolName,
      role,
      argumentsDigest: argsDigest,
      verdict,
      reason,
      reasonCode,
      previousHash: this.lastHash,
      currentHash
    };

    this.ledger.push(record);
    this.lastHash = currentHash;
    return record;
  }

  public getLedger(): AuditLogRecord[] {
    return [...this.ledger];
  }

  public verifyIntegrity(): boolean {
    let prev = '0000000000000000000000000000000000000000000000000000000000000000';
    for (const record of this.ledger) {
      if (record.previousHash !== prev) return false;
      const payload = `${record.index}:${record.timestamp}:${record.toolName}:${record.role}:${record.argumentsDigest}:${record.verdict}:${record.reasonCode || ''}:${prev}`;
      const expected = crypto.createHash('sha256').update(payload).digest('hex');
      if (record.currentHash !== expected) return false;
      prev = record.currentHash;
    }
    return true;
  }
}
