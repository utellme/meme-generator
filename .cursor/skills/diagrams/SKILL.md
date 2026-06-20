---
name: diagrams
description: >-
  Generate validated Mermaid and ASCII diagrams from code, architecture, or
  concepts. Use when the user asks for diagrams, visualizations, flowcharts,
  sequence diagrams, architecture diagrams, ER diagrams, state machines, or
  mentions /diagrams.
---

# Diagrams

Analyze the provided code, architecture, or concept and generate a clear, well-structured diagram that visualizes relationships, flow, or structure.

## Workflow

1. **Analyze the input** — Understand what to visualize (code flow, architecture, data relationships, state machines, sequences, etc.).
2. **Choose the diagram type** — See [Diagram types](#diagram-types).
3. **Generate the diagram** — Apply style guidelines below.
4. **Validate before output** — Run the [Validation checklist](#validation-checklist). Never write unvalidated diagrams to files.
5. **Deliver** — Mermaid block (or ASCII when appropriate), brief explanation, and a text alternative.

## Diagram types

| Goal | Type |
|------|------|
| Process flows, decision trees, algorithms | `flowchart` |
| API calls, message passing, request/response | `sequenceDiagram` |
| Class structures, inheritance, interfaces | `classDiagram` |
| Database schemas, entity relationships | `erDiagram` |
| State machines, lifecycle flows | `stateDiagram-v2` |
| Dependency graphs, module relationships | `graph TD` / `graph LR` |
| Git branching strategies | `gitgraph` |
| User journeys | `journey` |
| Timelines and schedules | `gantt` |

## Style guidelines

- Clear, descriptive node labels
- Logical grouping with subgraphs where appropriate
- Consistent styling and direction
- Meaningful relationship labels on edges
- Not overly complex — split into multiple diagrams if needed (~15–20 nodes max)
- Descriptive IDs: `userService` not `a1`
- Arrow styles:
  - `-->` solid arrow (main flow)
  - `-.->` dotted arrow (optional/async)
  - `==>` thick arrow (important path)
  - `o-->` circle end (aggregation)
  - `*-->` diamond end (composition)

## Output format

Always wrap Mermaid in a fenced code block:

````markdown
```mermaid
[diagram code here]
```
````

Always include a **text alternative** below the diagram:

```markdown
### Text alternative
Phase 1: INCEPTION
- Stage 1: Workspace Detection
- Stage 2: Requirements Analysis
```

Prefer Mermaid for complex diagrams. Use ASCII only when Mermaid is unsuitable or validation fails.

## Validation checklist

### Mermaid (required before file creation or final output)

- [ ] Node IDs use alphanumeric + underscore only
- [ ] Special characters in labels escaped (`"` → `\"`, `'` → `\'`)
- [ ] Flowchart/sequence connections are syntactically valid
- [ ] Diagram parses without errors
- [ ] Text alternative included

**On validation failure:** switch to text-based representation; do not block the task. Mention that simplified content was used due to parsing constraints.

### ASCII (when used)

Load standards from the first existing path:

- `aidlc-rules/aws-aidlc-rule-details/common/ascii-diagram-standards.md`
- `.aidlc-rule-details/common/ascii-diagram-standards.md`

Rules:

- [ ] ONLY `+` `-` `|` `^` `v` `<` `>` and spaces — no Unicode box-drawing
- [ ] Spaces only (no tabs)
- [ ] All lines in a box have the same character width
- [ ] Corners align vertically in monospace

See [validation.md](validation.md) for quick-reference patterns and examples.

## After generating

- Explain what the diagram shows
- Offer to refine or expand specific sections
- Suggest alternative diagram types if applicable

## Examples

See [examples.md](examples.md) for flowchart, sequence, class, and ER diagram templates.
