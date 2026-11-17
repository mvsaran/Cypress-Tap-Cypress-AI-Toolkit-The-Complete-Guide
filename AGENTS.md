# Agent Instructions: Running and Driving Cypress with Cypress Tap

This repository uses **Cypress Tap** to allow AI coding agents (Claude Code, Cursor, Windsurf, Antigravity) to run, watch, debug, and fix Cypress tests autonomously against a live browser session.

---

## 1. Environment & Sandbox Prerequisites

- **Agent Mode Recognition:** Ensure `CYPRESS_AGENT_MODE=1` is exported so Cypress skips onboarding and welcome screens.
- **Electron Variable:** Ensure `ELECTRON_RUN_AS_NODE` is cleared:
  - Linux/macOS/Cloud Containers: `unset ELECTRON_RUN_AS_NODE`
  - Windows PowerShell: `$env:ELECTRON_RUN_AS_NODE = $null`
- **Network Allowlists:** Ensure outbound HTTPS access to `registry.npmjs.org`, `download.cypress.io`, `cdn.cypress.io`, and `https://www.saucedemo.com`.

---

## 2. Start Cypress in the Background (Once per Session)

Start Cypress once per session in interactive open mode with an attached Chromium browser:

### Linux / macOS / Cloud Container:
```bash
CYPRESS_AGENT_MODE=1 nohup npx cypress open --e2e --browser chrome --project . > cypress-open.log 2>&1 &
```

### Windows (PowerShell):
```powershell
$env:ELECTRON_RUN_AS_NODE = $null
$env:CYPRESS_AGENT_MODE = "1"
Start-Process -FilePath "npx" -ArgumentList "cypress open --e2e --browser chrome --project ." -WindowStyle Minimized
```

### Wait for the Browser to Attach:
Poll `npx cypress tap status --json` until `"browserAttached": true`:
```bash
until out=$(npx cypress tap status --json) && echo "$out" | grep -Eq '"browserAttached": *true'; do
  echo "$out" | grep -Eq '"status": *"error"' && { echo "$out"; exit 1; }
  sleep 1
done
```
If status reports `"error"` or times out after 90 seconds, read `cypress-open.log`.

---

## 3. The 9 Golden Rules of Driving Cypress Tap

When driving Cypress tests autonomously, always prefer `--json` output and follow these 9 rules:

1. **Check for a session first:** Run `npx cypress tap status --json`. If it reports `"status": "not connected"`, start a session using the background command above.
2. **List runnable specs:** Run `npx cypress tap specs --json`.
3. **Dispatch & Poll Deterministically:**
   - Run the affected spec: `npx cypress tap run <spec-path>`. This command returns immediately.
   - Record `startedAt` before triggering a re-run.
   - Poll `npx cypress tap status --json` until `status` becomes `"passed"` or `"failed"`, AND `startedAt` differs from the previous run.
   - Add a timeout: a spec that fails to compile stays in `"loading"` indefinitely. Stop and inspect `cypress-open.log` if loading persists.
4. **Guard Against False Passes:** Treat `"status": "passed"` with `results.passed == 0` as an empty or skipped run, NOT a success. Confirm that actual tests executed.
5. **Inspect Failures via Reporter:** On failure, run `npx cypress tap reporter --json` for the spec overview, then run `npx cypress tap reporter --test-id <id> --json` to get the failing test's complete Command Log, assertion errors, and exact code frame.
6. **Drill into Command Details:** To inspect network requests, console properties, or hook sections of a specific command, run:
   ```bash
   npx cypress tap command --test-id <id> --command-id <cmdId> --json
   ```
7. **Time-Travel via Pinning:** To inspect the DOM as it looked at the moment a command executed:
   - Pin the snapshot: `npx cypress tap pin --test-id <id> --command-id <cmdId> --at after`
   - Read the pinned snapshot with `npx cypress tap dom -e "<selector>"`, `npx cypress tap aria`, or `npx cypress tap inspect --selector "<selector>"`
   - Always release the pin when finished: `npx cypress tap pin --clear`
8. **Do NOT Read During Active Execution:** `dom`, `aria`, `inspect`, and `pin` will fail with `SPEC_IN_PROGRESS` if a test is currently running. Always wait for a final verdict before reading the app.
9. **Verify Pin Integrity:** Before reading the page with a pin active, verify that `status --json` reports the pin you expect. If it does not, the Cypress window may have been clicked, invalidating the snapshot.

---

## 4. Common Agent Workflow Recipes

### Recipe A: Fix a Failing Test
1. Run spec: `npx cypress tap run <spec-path>`.
2. Poll `status --json` for `"status": "failed"`.
3. Inspect `reporter --test-id <id> --json` to read the exact error message and code frame.
4. If needed, interrogate live DOM with `npx cypress tap dom -e "<selector>"` or accessibility with `npx cypress tap aria`.
5. Edit the code to fix the issue.
6. Re-run `npx cypress tap run <spec-path>` and confirm `"status": "passed"` with `results.passed > 0`.

### Recipe B: Reproduce a Flaky Test
1. Execute the target spec at least 5–10 times in a loop.
2. In each iteration, poll `status --json` and verify `startedAt` updates.
3. Record pass/fail counts. For any failing attempt, capture `npx cypress tap reporter --test-id <id> --json` to compare timing, network requests, or state differences.

### Recipe C: Explore an Unfamiliar Page
1. Run a spec that navigates to the target page.
2. Once the verdict is reached, run:
   ```bash
   npx cypress tap aria
   ```
3. Read the compact hierarchy of landmarks, forms, headings, buttons, and accessible names to select robust selectors before authoring new tests.
