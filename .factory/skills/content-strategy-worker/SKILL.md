---
name: content-strategy-worker
description: Builds BETTER content systems, tokenomics/projection logic, and evidence-backed narrative surfaces.
---

# Content Strategy Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use this skill for features dominated by source synthesis, typed content/data models, scenario logic, tokenomics math, roadmap utility definitions, evidence hooks, and data-driven BETTER surfaces where correctness and clarity matter more than bespoke visual effects.

## Required Skills

- `agent-browser` — invoke this whenever the feature changes a rendered page, calculator, or visible user-facing flow so you can verify the result on `http://127.0.0.1:3100`.

## Work Procedure

1. Read `mission.md`, mission `AGENTS.md`, and the relevant `.factory/library/*.md` files before changing anything.
2. Inspect the existing content/data/model files and match the established naming, typing, and status-label patterns.
3. Write failing tests first for any schema, parser, calculator, scenario engine, or rendered content behavior you are changing.
4. Implement the minimum typed models, content modules, and UI wiring needed to make the new tests pass. If implementation edits land before the new failing tests are established, report `followedProcedure=false` in your handoff.
5. Preserve the distinction between canonical current BETTER facts, scenario assumptions, and illustrative roadmap ideas.
6. If you add or change numbers, thresholds, or claims, update the evidence/source or assumption hooks in the same feature.
7. If the feature touches roadmap execution detail, valuation framing, or vault-share modeling, separate clearly between canonical current facts, conservative modeled corridors, external dependencies, and internal build-speed assumptions.
8. For vault or allocation modeling, ensure the UI can explain user stake, total staked BETTER, qualifying pool share, estimated vault-cap share, and deposit-cap rules without collapsing them into one ambiguous number.
9. Run focused tests while iterating, then run the manifest commands for `lint`, `typecheck`, `test`, and `build`.
10. Use `agent-browser` to verify the changed surfaces, especially tier ladders, calculators, scenario switching, execution-plan panels, valuation modules, and evidence hooks.
11. Stop any process you started. In your handoff, call out every changed number/model, every source/assumption surface you touched, and any remaining ambiguity.

## Example Handoff

```json
{
  "salientSummary": "Implemented the whale-first token utility matrix and scenario engine for conservative/base/upside views, with evidence hooks for all threshold and supply values. Ran lint, typecheck, test, and build successfully, then verified scenario switching and tier clarity in the browser.",
  "whatWasImplemented": "Added typed token tier data, scenario assumption models, calculator helpers, and the rendered tokenomics experience for whale access, allocation priority, preview priority, fee advantages, and agent-native utility lines. Updated source/assumption cues for supply math, FDV ratchet examples, and future-facing revenue flows.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      {
        "command": "npm run test",
        "exitCode": 0,
        "observation": "Schema, calculator, and scenario tests passed."
      },
      {
        "command": "npm run lint",
        "exitCode": 0,
        "observation": "No lint errors."
      },
      {
        "command": "npx tsc --noEmit",
        "exitCode": 0,
        "observation": "Typecheck passed."
      },
      {
        "command": "npm run build",
        "exitCode": 0,
        "observation": "Production build completed successfully."
      }
    ],
    "interactiveChecks": [
      {
        "action": "Opened the tokenomics surface at http://127.0.0.1:3100 and switched between Conservative, Base, and Upside scenarios.",
        "observed": "All dependent outputs updated together while the selected tier input persisted."
      },
      {
        "action": "Opened a whale tier card and reviewed the value/source cues for thresholds and fee examples.",
        "observed": "Thresholds, fee examples, and future-state labels were visible and matched the updated data model."
      }
    ]
  },
  "tests": {
    "added": [
      {
        "file": "src/lib/tokenomics/tokenomics.test.ts",
        "cases": [
          {
            "name": "ratchet thresholds retain the lower gate after later FDV decline",
            "verifies": "The FDV ratchet example stays permanently lowered once a new ATH band is reached."
          },
          {
            "name": "scenario outputs preserve user inputs while updating assumptions",
            "verifies": "Scenario switching only changes assumption-driven outputs."
          }
        ]
      }
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- The feature depends on product facts or roadmap numbers that are ambiguous in the mission artifacts
- A required source/evidence hook cannot be supported without contradicting current BETTER source-of-truth guidance
- The requested scenario model or token utility surface needs new mission-level decisions rather than local implementation choices
