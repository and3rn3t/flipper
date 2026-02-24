# AI Instructions (Copilot + Claude)

These instructions optimize prompting, skill use, and tone for GitHub Copilot and Anthropic Claude. They are based on current official documentation and are intended to be a shared, consistent baseline for the team.

Sources (most recent official docs):

- GitHub Copilot docs: <https://docs.github.com/en/copilot>
- Copilot prompt guidance: <https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot>
- Claude docs: <https://platform.claude.com/docs>
- Claude prompt engineering overview: <https://platform.claude.com/docs/claude/docs/prompt-engineering>

## Scope

- Tools: GitHub Copilot (Chat and inline suggestions) and Anthropic Claude.
- Focus: skills (capabilities) and mood (tone).
- Goal: higher quality outputs, fewer iterations, and lower risk of incorrect changes.

## Universal prompting rules

1. Define the task outcome clearly (what a correct result looks like).
2. Provide essential context only: file paths, target components, constraints, and examples.
3. State the expected output format (bullet list, patch, code block, etc.).
4. Call out constraints or policies up front (security, privacy, forbidden changes).
5. When asking for code, specify tests, linting, and target runtime (node version, TS config).

## Skills to emphasize

- Code reasoning: explain tradeoffs and choose a default path unless asked to compare.
- Repo awareness: reference existing components, hooks, and styles in this repo.
- Safety: avoid secrets, personal data, and unvetted third-party code.
- Testing: propose the smallest verification step that proves the change works.
- Documentation: update README or internal docs when behavior changes.

## Mood / tone guidelines

- Professional, direct, and precise.
- Prefer concise outputs, but be explicit about assumptions.
- Avoid marketing tone, hype, or filler.
- Use actionable language: "Change X in file Y because...".

## GitHub Copilot usage guidelines

- Provide file paths and expected changes to reduce guessing.
- Prefer Copilot Chat for reasoning and multi-file changes.
- Use inline suggestions for local edits only.
- Ask for a diff or patch output when you want to review line-by-line.
- If Copilot output looks wrong, request: "Show the minimal change" or "Explain assumptions".

## Claude usage guidelines

- Give Claude a short, explicit rubric for success (for example, "must compile" and "must not change UI layout").
- Provide sample inputs or expected outputs when possible.
- If you need structured output, state the exact schema or headings.
- When asking for refactors, specify boundaries and no-go files.

## Model selection guidance

Use this quick guide to decide which tool to use first:

- Use GitHub Copilot when you are editing files in the repo and want fast, local changes.
- Use Claude when you need deeper reasoning, longer context, or a structured plan before coding.
- For multi-file refactors, start with Claude to outline a plan, then use Copilot to apply edits.
- For UI changes, prefer Copilot so it can see nearby components and styles.
- For ambiguous tasks, ask Claude to clarify assumptions and propose a default path.

Quick decision tree:

- Are you changing UI or styles in a specific file? Use Copilot.
- Do you need a plan, tradeoffs, or multi-file impact? Start with Claude.
- Are you unsure what files to touch? Ask Claude to propose candidate files, then use Copilot.
- Do you need a minimal diff for review? Use Copilot and ask for a patch.

## Workflow templates

Use one of these templates to make requests more reliable.

UI change

"""
Goal:
Constraints: Keep layout stable. No new dependencies. Use existing styles.
Files:
Expected output: Patch only.
Verification: Manual steps to confirm UI.
"""

Bug fix

"""
Goal:
Constraints: Minimal change. No behavior changes outside the bug.
Files:
Expected output: Patch only.
Verification: Add or update a test if available.
"""

Refactor

"""
Goal:
Constraints: No behavior change. Keep public APIs stable.
Files:
Expected output: Patch only.
Verification: Type-check and lint.
"""

Docs update

"""
Goal:
Constraints: Keep tone consistent with existing docs.
Files:
Expected output: Updated markdown only.
Verification: None.
"""

## Repo-specific templates

Screen update (screens)

"""
Goal:
Constraints: Keep layout stable. No new dependencies. Follow existing patterns in src/components/screens.
Files: src/components/screens/<ScreenName>.tsx
Expected output: Patch only.
Verification: Manual UI check in the target screen.
"""

Diagram update (components/diagrams)

"""
Goal:
Constraints: Keep SVG or canvas sizing stable. Match current color tokens. No new libraries.
Files: src/components/diagrams/<DiagramName>.tsx
Expected output: Patch only.
Verification: Visual check of the diagram.
"""

UI kit update (components/ui)

"""
Goal:
Constraints: No breaking API changes. Preserve props and className patterns.
Files: src/components/ui/<Component>.tsx
Expected output: Patch only.
Verification: Type-check and spot-check in at least one screen.
"""

## Context packaging (recommended template)

Use this block at the top of a request for both tools:

"""
Goal:
Constraints:
Files:
Expected output:
Verification:
"""

## Guardrails

- Never commit secrets or tokens.
- Do not include private data in prompts.
- Avoid copying code from unknown sources without checking licenses.
- If a suggestion seems risky or off-scope, request a safer alternative.

## Example prompt

Goal: Add a new Zigbee scan button that triggers the existing handler.
Constraints: Keep layout unchanged. No new dependencies.
Files: src/components/screens/ZigbeeScreen.tsx
Expected output: Patch only.
Verification: Mention any manual steps.

## Maintenance

- Review these instructions quarterly or when Copilot/Claude docs change.
- If a tool adds new capabilities, update the "Skills" and "Guardrails" sections.

## PR-ready AI checklist

- Change is scoped to the requested files and goals.
- No new dependencies unless explicitly approved.
- UI changes keep layout and styling consistent with existing screens.
- Types and lint pass (or a reason is documented).
- Any new behavior is documented in README or DEVELOPMENT when needed.
