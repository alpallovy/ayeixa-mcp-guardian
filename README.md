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

## Feedback & real-world use

If you try this project in a real workflow, share technical feedback — including negative results or integration problems — in [Discussions](https://github.com/alpallovy/ayeixa-mcp-guardian/discussions/3). Participation is voluntary; no payment required. With explicit permission, useful experiences may become attributed or anonymized case studies.

## License
Distributed under the **Apache-2.0** License. See `LICENSE` for details.

## Engineering blog

- [MCP Guardian fail-closed design](https://alpallovy.github.io/ayeixa-blog/blog/mcp-guardian-fail-closed-design)
- [Execution receipts in OSS utilities](https://alpallovy.github.io/ayeixa-blog/blog/execution-receipts-runtime-truth-oss)
- [DEV Community intro](https://dev.to/alp_allovi_45214d2d8316a1/introducing-ayeixa-mcp-guardian-capability-fencing-parameter-sanitization-for-mcp-14dj)

## Feedback

After local evaluation (`npm test`), open a [GitHub issue](https://github.com/alpallovy/ayeixa-mcp-guardian/issues) with integration feedback. Case-study participation is not solicited until genuine external use exists.
