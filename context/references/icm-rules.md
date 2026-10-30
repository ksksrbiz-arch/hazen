# ICM rules (reference)

Load this before creating or editing any `CONTEXT.md`, router, or reference file.

## Layout

- `AGENTS.md` is the cross-agent entry point; `CLAUDE.md` remains the shared router (at most 80 lines). Keep AGENTS concise and route to the shared instructions rather than duplicating them.
- `context/references/` holds stable detail: one subject per file, at most 200 lines each.
- `context/workflows/<name>/CONTEXT.md` holds one contract per recurring job.
- Some repos name the folder `.ai/` instead of `context/`. Pick one per repo and keep it.

## Rules

- Routers point; they do not duplicate bodies of knowledge.
- Every router and workflow has a Load / Do not load table. Say what to skip, not just what to read.
- Stable knowledge goes in references. Per-run state goes in records or artifacts, never in references.
- Repeatable steps become scripts and tests, not longer prompts.
- Each stage's output is a file the next stage reads. No hidden dependencies between stages.
- A new agent with no conversation memory must be able to orient, find the right workflow, do it, and
  report what remains. That is the walk test. Run it when you change the structure.

## Contract template

Copy `templates/workflow-CONTEXT.md`. Sections: Load / exclude, Input, Process, Output, Stop conditions,
Completion. Completion names the command or the person that verifies the work.
