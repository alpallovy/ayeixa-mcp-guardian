# Architecture Specification: Ayeixa MCP Guardian

## System Overview
Architecture overview for Ayeixa MCP Guardian

## Architecture Diagram (Mermaid)
```mermaid
flowchart TD
    Client["Client Application / Runtime"] --> Router["Ayeixa MCP Guardian Core"]
    Router --> Engine["Execution & Boundary Engine"]
    Engine --> Output["Verified Output / State"]
```

## Design Guarantees
- **Permissive & Standalone**: Operates hermetically without proprietary enterprise lock-in.
- **Fail-Closed**: Rejects malformed or untrusted inputs at boundary layer.
