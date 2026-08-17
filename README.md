# Ayeixa MCP Guardian

> Runtime sandboxing, parameter sanitization, and capability fence for Model Context Protocol (MCP).

## Status: Pre-Release (v0.1.0-alpha)
*Note: Public npm registry publication is pending. To use or evaluate this package, clone and build locally.*

## Features
- **Capability-Based Permission Fence**: Granular RBAC and tool allowlists/denylists for MCP servers.
- **Input Sanitization & Attack Prevention**: Hermetic path traversal blockers (`../`, `/etc`) and shell injection filters.
- **Tamper-Evident Hash-Chained Audit Ledger**: Immutable SHA-256 cryptographic chain logging all invocations, payloads, and verdicts.
- **Middleware Boundary Sandbox**: Drop-in MCP interceptor enforcing timeouts, permission checks, and fail-closed isolation.

## Installation & Local Build
```bash
# Clone the repository
git clone https://github.com/alpallovy/ayeixa-mcp-guardian.git
cd ayeixa-mcp-guardian

# Install dependencies and build
npm install
npm run build
npm test
```

## Quick Start
```typescript
import { GuardianSandbox, ToolPermissionFence, RuntimeAuditLogger } from './src';

const fence = new ToolPermissionFence({
  allowedTools: ['read_file', 'grep_search'],
  blockedCommands: ['rm -rf', 'sudo', 'chmod 777']
});
const audit = new RuntimeAuditLogger();
const sandbox = new GuardianSandbox(fence, audit);

const verdict = await sandbox.evaluateAndExecute({
  toolName: 'read_file',
  arguments: { path: './src/index.ts' },
  role: 'developer'
}, async (args) => {
  return "File contents";
});

console.log("Execution Allowed:", verdict.allowed);
```

## License
Distributed under the **Apache-2.0** License. See `LICENSE` for details.
