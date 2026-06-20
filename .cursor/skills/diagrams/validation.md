# Diagram Validation Reference

Quick reference for Mermaid and ASCII validation. Load this when generating diagrams for files or deliverables that must parse correctly.

## Mermaid validation

### Node ID rules

```
✅ userService, OrderRepo, step_1
❌ user-service, Order Repo, 1step
```

### Label escaping

```
✅ A["User's \"Profile\""]
✅ B['It\'s valid']
❌ A[User's "Profile"]
```

### Common syntax pitfalls

- Sequence diagrams: use `->>` and `-->>` consistently; declare participants before use
- Flowcharts: wrap labels with special chars in quotes: `A["Step (1)"]`
- ER diagrams: relationship syntax is strict — `||--o{` not free-form arrows
- Subgraphs: `subgraph id [Label]` — keep IDs simple

### Fallback template

When Mermaid fails validation, use this structure:

```markdown
### [Title] — text representation

**Flow:**
1. Step A → Step B
2. Step B → {decision}
   - Yes → Step C
   - No → Step D

**Components:**
- Service A — handles X
- Service B — handles Y
```

## ASCII validation

### Allowed characters

`+` `-` `|` `^` `v` `<` `>` spaces, alphanumeric text

### Forbidden

Unicode box-drawing: `┌` `─` `│` `└` `┐` `┘` `├` `┤` `┬` `┴` `┼` `▼` `▲` `►` `◄`

### Box pattern (all lines same width)

```
+-----------------------------------------------------+
|                                                     |
|              Component Name                         |
|                                                     |
|  Description text here                              |
|                                                     |
+-----------------------------------------------------+
```

### Vertical flow

```
+----------+
|  Input   |
+----------+
     |
     | validates
     v
+----------+
| Process  |
+----------+
     |
     v
+----------+
|  Output  |
+----------+
```

### Pre-creation checklist

- [ ] Basic ASCII only
- [ ] No tabs
- [ ] Count characters per line — widths must match within each box
- [ ] Corners use `+`
- [ ] Test vertical alignment of `+` characters
