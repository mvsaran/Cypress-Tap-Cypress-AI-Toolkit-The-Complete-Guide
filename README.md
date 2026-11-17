# Cypress Tap & Cypress AI Toolkit: The Complete Guide

> **A beginner-friendly, SDET-grade guide explaining how AI coding agents (Antigravity, Claude Code, Cursor, Windsurf) autonomously run, diagnose, inspect, and self-heal Cypress tests using the official Cypress AI Toolkit and Cypress Tap.**

---

## Table of Contents

1. [The Big Picture in Plain English](#1-the-big-picture-in-plain-english)
2. [Who Does What? (The Mental Model)](#2-who-does-what-the-mental-model)
3. [Key Concepts: Cypress AI Toolkit vs. Cypress Tap](#3-key-concepts-cypress-ai-toolkit-vs-cypress-tap)
4. [Step-by-Step Setup Guide (From Scratch)](#4-step-by-step-setup-guide-from-scratch)
   - [Step 1: Install Dependencies](#step-1-install-dependencies)
   - [Step 2: Install the Cypress AI Skill](#step-2-install-the-cypress-ai-skill)
   - [Step 3: Agent Configuration (How Any Agent Connects)](#step-3-agent-configuration-how-any-agent-connects)
   - [Step 4: Launch Cypress Open Mode (Once per Session)](#step-4-launch-cypress-open-mode-once-per-session)
5. [The Autonomous Self-Healing Demo (Step-by-Step)](#5-the-autonomous-self-healing-demo-step-by-step)
6. [Cypress Tap CLI Reference (Cheat Sheet)](#6-cypress-tap-cli-reference-cheat-sheet)
7. [Troubleshooting & Solved Gotchas](#7-troubleshooting--solved-gotchas)
   - [Gotcha 1: ELECTRON_RUN_AS_NODE Conflict](#gotcha-1-electron_run_as_node-conflict)
   - [Gotcha 2: Node.js 24 Libuv Async Assertion on Windows](#gotcha-2-nodejs-24-libuv-async-assertion-on-windows)
   - [Gotcha 3: The "False Pass" Trap](#gotcha-3-the-false-pass-trap)
8. [Project Structure & Test Suites](#8-project-structure--test-suites)

---

## 1. The Big Picture in Plain English

### The Problem with Traditional Automated Testing & AI
Until recently, when an AI agent (or a human developer) ran tests from the terminal, they used `npx cypress run`. 
* **It was slow:** Every single run had to boot up a browser from cold storage, taking 15 to 30 seconds.
* **The AI was blind:** If an assertion failed, the AI only got a generic text error in the terminal. It couldn't see the webpage, couldn't inspect what buttons were on the screen, and couldn't travel back in time to the exact moment the error occurred. As a result, AI agents often **hallucinated selectors** and guessed blind fixes.

### The Solution: Cypress Tap + Cypress AI Toolkit
Cypress introduced **`cypress tap`** (available in Cypress v15.21.0+). 
Instead of spinning up a new browser every time, `cypress tap` connects directly to a live, interactive Chromium browser (`cypress open`) already running on your machine.
* **Instant Speed:** Tests run and re-run in **under 1 second**.
* **Real Eyes in the Browser:** The AI agent can query the live DOM, extract the accessibility (ARIA) tree, and freeze time (`pin`) at any command snapshot to see exactly what the page looked like.

---

## 2. Who Does What? (The Mental Model)

To understand how this works, keep this simple division of roles in mind:

```
┌─────────────────────────────────┐
│        You (The Human)          │  ──> Gives goals: "Run bug_demo.cy.js, fix failures, and report."
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     The AI Coding Agent         │
│  (Antigravity / Claude / Cursor)│  ──> [THE BRAIN] Thinks, reads errors, edits code files.
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│       Cypress AI Toolkit        │  ──> [THE SOP MANUAL] Teaches the agent the 9 Golden Rules
│       (cypress-tap skill)       │      of driving Cypress without getting stuck.
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│         Cypress Tap CLI         │  ──> [THE EYES & HANDS] CLI tool that talks to the live browser,
│       (npx cypress tap)         │      dispatches tests, extracts JSON logs, and pins DOM snapshots.
└─────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    Interactive Cypress Browser  │  ──> [THE STAGE] Renders SauceDemo in real-time Chrome,
│          (cypress open)         │      executes clicks, assertions, and network calls.
└─────────────────────────────────┘
```

---

## 3. Key Concepts: Cypress AI Toolkit vs. Cypress Tap

| Component | What is it? | Why do we need it? |
| :--- | :--- | :--- |
| **Cypress Tap** | A built-in CLI feature of Cypress (`npx cypress tap <command>`). | Allows external programs (scripts, terminals, agents) to query and control a running Cypress open session via JSON. |
| **Cypress AI Toolkit** | An open-source collection of AI Agent Skills published by Cypress (`cypress-io/ai-toolkit`). | Teaches AI models (Claude, GPT, Gemini) how to use `cypress tap` properly (polling for verdicts, avoiding false passes, reading snapshots). |

---

## 4. Step-by-Step Setup Guide (From Scratch)

### Step 1: Install Dependencies
Clone this repository and install packages:
```bash
npm install
```
*(Our automated `postinstall` script will automatically apply our Windows libuv patch for clean terminal exits).*

### Step 2: Install the Cypress AI Skill
To give your AI agents the official skills to drive Cypress Tap:
```bash
npx skills add cypress-io/ai-toolkit --skill cypress-tap
```
When prompted:
* **Universal Agents (`.agents/skills`)**: Always included by default (covers Antigravity, Gemini CLI, Codex).
* Select **Claude Code** or **Cursor** if you use those specific agents.
* Press `Enter` to install.

### Step 3: Agent Configuration (How Any Agent Connects)
This repository includes ready-to-use configuration files for every major AI coding assistant:
* **Antigravity / Universal Agents:** Reads [`AGENTS.md`](AGENTS.md) and `.agents/skills/cypress-tap/` automatically.
* **Anthropic Claude Code (`claude`):** Reads [`CLAUDE.md`](CLAUDE.md) upon startup in terminal.
* **Cursor IDE:** Reads [`.cursor/rules/cypress-tap.mdc`](.cursor/rules/cypress-tap.mdc) and [`.cursorrules`](.cursorrules).
* **Windsurf (Cascade):** Reads [`.windsurfrules`](.windsurfrules).

### Step 4: Launch Cypress Open Mode (Once per Session)
Start Cypress in the background with Chrome attached:

#### Windows (PowerShell):
```powershell
$env:ELECTRON_RUN_AS_NODE = $null
$env:CYPRESS_AGENT_MODE = "1"
Start-Process -FilePath "npx" -ArgumentList "cypress open --e2e --browser chrome --project ." -WindowStyle Minimized
```

#### macOS / Linux:
```bash
unset ELECTRON_RUN_AS_NODE
CYPRESS_AGENT_MODE=1 nohup npx cypress open --e2e --browser chrome --project . > cypress-open.log 2>&1 &
```

Verify that the session is reachable:
```bash
npx cypress tap status --json
```
If `"browserAttached": true`, you are ready!

---

## 5. The Autonomous Self-Healing Demo (Step-by-Step)

Here is a walkthrough of what happened in our live self-healing test demonstration:

### 1. The Human Prompts the Agent
In the chat interface, the user says:
> *"Run `cypress/e2e/bug_demo.cy.js`. If it fails, use Cypress Tap to inspect the live DOM, fix the test, verify that it passes, and show me the diff."*

### 2. Agent Dispatches the Spec
The agent executes:
```bash
npx cypress tap run cypress/e2e/bug_demo.cy.js
```
The test runs immediately in the warm Chrome browser.

### 3. Agent Polls for the Verdict
The agent reads status:
```bash
npx cypress tap status --json
```
**Output:**
```json
{
  "status": "failed",
  "spec": "cypress/e2e/bug_demo.cy.js",
  "results": { "passed": 0, "failed": 1 }
}
```

### 4. Agent Diagnoses Failure with Reporter
The agent inspects the failing test attempt (`r3`):
```bash
npx cypress tap reporter --test-id r3
```
**Output:**
```text
TEST BODY · r3
   1  get      [data-test="add-to-cart-sauce-labs-backpack"]
   2  -click
   3  get      [data-test="remove-sauce-labs-backpack"]
   4  -assert  expected <button> to have text 'ADDED', but the text was 'Remove' ✖

✖ AssertionError
  Timed out retrying after 10000ms: expected '<button#remove-sauce-labs-backpack...>' to have text 'ADDED', but the text was 'Remove'
  Location: cypress/e2e/bug_demo.cy.js:16
```

### 5. Agent Inspects the Live Browser DOM
Instead of guessing, the agent queries the live element directly from the browser:
```bash
npx cypress tap dom -e "[data-test='remove-sauce-labs-backpack']"
```
**Output returned from Chrome:**
```html
<button class="btn btn_secondary btn_small btn_inventory" 
        data-test="remove-sauce-labs-backpack" 
        id="remove-sauce-labs-backpack">
  Remove
</button>
```
The agent now has 100% empirical proof: the button text is `"Remove"`.

### 6. Agent Fixes the Code
The agent updates `cypress/e2e/bug_demo.cy.js`:
```diff
- cy.get('[data-test="remove-sauce-labs-backpack"]').should("have.text", "ADDED");
+ cy.get('[data-test="remove-sauce-labs-backpack"]').should("have.text", "Remove");
```

### 7. Agent Proves the Fix
The agent re-runs the spec:
```bash
npx cypress tap run cypress/e2e/bug_demo.cy.js
npx cypress tap reporter
```
**Output:**
```text
cypress/e2e/bug_demo.cy.js
✓ 1  ✖ --  ○ --  00:01

SauceDemo - Live Bug & Fix Demo
   r3  ✓ Should add product to cart and verify button changes state  986ms
```
The test passed in **986 milliseconds**!

---

## 6. Cypress Tap CLI Reference (Cheat Sheet)

Use these commands (add `--json` for machine-readable output):

| Command | Purpose | Example |
| :--- | :--- | :--- |
| `sessions` | Lists reachable Cypress instances | `npx cypress tap sessions --json` |
| `status` | Checks current execution stage & counts | `npx cypress tap status --json` |
| `specs` | Lists all runnable test files | `npx cypress tap specs --json` |
| `run` | Dispatches a spec to run in the browser | `npx cypress tap run cypress/e2e/cart.cy.js` |
| `reporter` | Reads test results, command logs & errors | `npx cypress tap reporter --test-id r3` |
| `command` | Shows deep network/snapshot info for 1 step | `npx cypress tap command --test-id r3 --command-id 3` |
| `pin` | Rewinds the browser DOM to a past step | `npx cypress tap pin --test-id r3 --command-id 3` |
| `dom` | Interrogates HTML of an element | `npx cypress tap dom -e "[data-test='shopping-cart-badge']"` |
| `aria` | Prints the accessibility tree hierarchy | `npx cypress tap aria` |
| `inspect` | Returns element coordinates & attributes | `npx cypress tap inspect --selector "#login-button"` |

---

## 7. Troubleshooting & Solved Gotchas

### Gotcha 1: `ELECTRON_RUN_AS_NODE` Conflict
* **Symptom:** `Cypress.exe: bad option: --smoke-test` or `bad option: --ping`.
* **Cause:** IDEs and terminal environments sometimes set `ELECTRON_RUN_AS_NODE=1`, forcing the Cypress desktop binary to run as Node.js instead of Electron.
* **Fix:** Clear the variable in PowerShell before running Cypress:
  ```powershell
  $env:ELECTRON_RUN_AS_NODE = $null
  ```

### Gotcha 2: Node.js 24 Libuv Async Assertion on Windows
* **Symptom:** `Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94`.
* **Cause:** Node 24 on Windows crashes when an abrupt `process.exit(code)` is called while Chrome Remote Interface WebSocket handles are still closing in the thread pool.
* **Fix (Solved Permanently in this Repo):** 
  We created [`scripts/patch-cypress-exit.js`](scripts/patch-cypress-exit.js) and wired it into `package.json`'s `postinstall` script. It converts abrupt `process.exit(code)` into graceful `process.exitCode = code;`, allowing the event loop to drain cleanly with exit code `0`.

### Gotcha 3: The "False Pass" Trap
* **Symptom:** `status --json` reports `"status": "passed"`, but no tests ran.
* **Cause:** If a spec file has syntax errors or skipped tests, Cypress marks the run as passed with `results.passed == 0`.
* **Rule:** Always assert that `status === 'passed'` AND `results.passed > 0`.

---

## 8. Project Structure & Test Suites

```
CypressTap/
├── .agents/skills/cypress-tap/   # Official Cypress AI Toolkit Skill
├── .cursor/rules/                # Cursor IDE AI Rules
├── .cursorrules                  # Cursor legacy rules
├── .windsurfrules                # Windsurf IDE AI Rules
├── AGENTS.md                     # Universal instructions for AI agents
├── CLAUDE.md                     # Anthropic Claude Code instructions
├── cypress.config.js             # Base configuration (SauceDemo baseUrl)
├── package.json                  # Scripts & dependencies
├── scripts/
│   └── patch-cypress-exit.js    # Node.js 24 Windows libuv compatibility patch
└── cypress/
    ├── e2e/
    │   ├── login.cy.js           # 6 Authentication scenarios
    │   ├── products.cy.js        # 6 Product catalog & sorting scenarios
    │   ├── cart.cy.js            # 5 Cart addition & badge count scenarios
    │   ├── checkout.cy.js        # 4 Order placement & pricing tax scenarios
    │   └── bug_demo.cy.js        # Dedicated self-healing demo test
    ├── fixtures/
    │   └── users.json            # SauceDemo test credentials
    └── support/
        ├── commands.js           # Custom commands (cy.login, addItem, etc.)
        └── e2e.js                # Global setup & exception handling
```

---

## Running the Complete Regression Suite

You can still run the entire suite headlessly in one shot:
```bash
npm run cypress:run:chrome
```

All 21 production scenarios across SauceDemo will execute and pass cleanly.
