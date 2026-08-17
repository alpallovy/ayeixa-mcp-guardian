import * as crypto from 'crypto';
import { AuditLogRecord } from './types';

export class RuntimeAuditLogger {
  private ledger: AuditLogRecord[] = [];
  private lastHash = '0000000000000000000000000000000000000000000000000000000000000000';

  public log(
    toolName: string,
    args: Record<string, unknown>,
    verdict: 'ALLOWED' | 'DENIED' | 'ERROR',
    reason?: string
  ): AuditLogRecord {
    const index = this.ledger.length;
    const timestamp = new Date().toISOString();
    const argsDigest = crypto.createHash('sha256').update(JSON.stringify(args || {})).digest('hex');

    const payload = `${index}:${timestamp}:${toolName}:${argsDigest}:${verdict}:${this.lastHash}`;
    const currentHash = crypto.createHash('sha256').update(payload).digest('hex');

    const record: AuditLogRecord = {
      index,
      timestamp,
      toolName,
      argumentsDigest: argsDigest,
      verdict,
      reason,
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
      const payload = `${record.index}:${record.timestamp}:${record.toolName}:${record.argumentsDigest}:${record.verdict}:${prev}`;
      const expected = crypto.createHash('sha256').update(payload).digest('hex');
      if (record.currentHash !== expected) return false;
      prev = record.currentHash;
    }
    return true;
  }
}
