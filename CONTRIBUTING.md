# Contributing to ayeixa-mcp-guardian

Thank you for your interest in contributing to ayeixa-mcp-guardian!

## Development Workflow
1. **Clone the repository**:
   ```bash
   git clone https://github.com/alpallovy/ayeixa-mcp-guardian.git
   cd ayeixa-mcp-guardian
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run Typecheck & Build**:
   ```bash
   npm run typecheck
   npm run build
   ```
4. **Run Tests**:
   ```bash
   npm test
   ```
5. **Create a Pull Request**: Submit your changes with clear descriptions and passing tests.

## Good first issues

Browse [issues labeled `good first issue`](https://github.com/alpallovy/ayeixa-mcp-guardian/labels/good%20first%20issue). Pick one issue, comment that you are working on it, and open a PR against `main`.

## Pull request review criteria

- `npm test` passes (required)
- `npm run typecheck` passes (required)
- One logical change per PR; link the issue if applicable
- Bug fixes include repro steps or a failing test that the patch fixes
- No unrelated refactors or drive-by formatting

## Standards
- Strict TypeScript with zero type bypassing (`noAny`, full typings).
- 100% passing hermetic unit and integration tests.
- Clear TSDoc comments on exported functions and classes.

## Real-world feedback

If you evaluated this project in a real workflow, share technical feedback (including negative results) in [Discussions](https://github.com/alpallovy/ayeixa-mcp-guardian/discussions/3). Case-study use requires explicit permission.
