# Securing Model Context Protocol Tool Invocations with Runtime Capability Sandboxing

## 1. Introduction & Overview
Model Context Protocol (MCP) empowers language models to interact directly with databases, filesystems, and CLI utilities. However, exposing tool APIs creates security vulnerabilities: unauthorized directory traversal (`../../etc/passwd`), destructive shell commands (`rm -rf`), and untracked actions.

**Ayeixa MCP Guardian** (`@ayeixa/mcp-guardian`) is a runtime capability fence and parameter sanitization middleware for Model Context Protocol servers and client tool invocations.

- **GitHub Repository**: [https://github.com/alpallovy/ayeixa-mcp-guardian](https://github.com/alpallovy/ayeixa-mcp-guardian)
- **Status**: Pre-Release (`v0.1.0-alpha`)
- **License**: Apache-2.0
- **NPM Status**: Public registry publication is pending; evaluate and build locally.

---

## 2. Core Architecture
MCP Guardian operates as an interceptor middleware:

1. **ToolPermissionFence**: Enforces granular Role-Based Access Control (RBAC) and explicit tool allowlists/denylists.
2. **InvocationSanitizer**: Sanitizes parameter arguments, blocking directory traversal patterns (`../`) and dangerous system commands (`sudo`, `rm -rf`, `chmod 777`).
3. **RuntimeAuditLogger**: Records every invocation payload, argument set, and permission verdict into a tamper-evident SHA-256 cryptographic hash chain.
4. **GuardianSandbox**: Permission-gated execution wrapper evaluating authorization rules and logging audit records before dispatching to tool executors.

---

## 3. Implemented Capabilities & Test Verification
Verified with hermetic unit tests:
- **Permission Fencing**: RBAC and denied command enforcement (`tests/permission.test.ts`).
- **Audit Ledger**: Cryptographic hash chain validation (`tests/audit.test.ts`).
- **Execution Wrapper**: Permission-gated dispatch and error containment (`tests/sandbox.test.ts`).

Test Verification Receipt: **6/6 hermetic unit tests passing** (0 failures).

---

## 4. Local Installation & Quick Start
```bash
# Clone & build locally
git clone https://github.com/alpallovy/ayeixa-mcp-guardian.git
cd ayeixa-mcp-guardian
npm ci
npm run build
npm test
```

### Usage Example
```typescript
import { GuardianSandbox, ToolPermissionFence, RuntimeAuditLogger } from './src';

const fence = new ToolPermissionFence({
  allowedTools: ['read_file', 'list_dir'],
  blockedCommands: ['rm -rf', 'sudo', 'chmod 777']
});
const audit = new RuntimeAuditLogger();
const sandbox = new GuardianSandbox(fence, audit);

const verdict = await sandbox.evaluateAndExecute({
  toolName: 'read_file',
  arguments: { path: './src/index.ts' },
  role: 'developer'
}, async (args) => {
  return "File content safely read.";
});

console.log("Allowed:", verdict.allowed);
```

---

## 5. Limitations & Roadmap
- Pre-release `v0.1.0-alpha`.
- Provides application-level permission gating and parameter sanitization; OS/process-level containerization is slated for future milestones.
- Public npm publication is pending.

---

## 6. Contributing
We encourage security researchers and developers to contribute. See open `good first issue` tags on GitHub.
- **License**: Apache-2.0
