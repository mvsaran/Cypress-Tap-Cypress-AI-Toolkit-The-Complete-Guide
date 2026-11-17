# Claude Code Instructions: Cypress Tap Automation

When working with Cypress tests in this project, use **Cypress Tap** to execute, debug, and verify specs against the live Chromium browser session instead of running slow headless `cypress run` cycles.

For the full 9 Golden Rules and workflow recipes, refer to [AGENTS.md](AGENTS.md).

## Quick Reference
1. **Check session:** `npx cypress tap status --json`
2. **Run spec:** `npx cypress tap run <spec-path>`
3. **Poll status:** Wait until `"status"` is `"passed"` or `"failed"` and `startedAt` is updated.
4. **Inspect failure:** `npx cypress tap reporter --test-id <id> --json`
5. **Inspect DOM:** `npx cypress tap pin --test-id <id> --command-id <cmdId> --at after`, then query with `npx cypress tap dom -e "<selector>"` or `npx cypress tap aria`. Always run `npx cypress tap pin --clear` after.
6. **Verify fix:** Re-run `npx cypress tap run <spec-path>` and confirm `"status": "passed"` with `results.passed > 0`.
