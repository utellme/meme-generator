# Vibe Coding Research

## What Is Vibe Coding?

**Vibe coding** is an AI-driven development workflow where you describe what you want in natural language and an AI assistant generates, refines, and debugs the code. The term was popularized by Andrej Karpathy in early 2025.

Instead of writing every line manually, you focus on intent, UX, and outcomes while AI handles implementation details.

## Common Local Setup (2026)

| Tool | Type | Local launch | Requirements |
|------|------|--------------|--------------|
| **Cursor / VS Code + AI** | IDE workflow | Open project in editor | Editor + AI subscription |
| **VibeCoding CLI** | Terminal AI assistant | `vibecoding` | API key (DeepSeek, OpenAI, etc.) |
| **VibeCoder** | Self-hosted IDE platform | `http://localhost:3000` | Node 22+, PostgreSQL, Redis, OpenRouter key |
| **This project: Vibe Coding Studio** | Local web hub | `npm start` in `vibecoding-studio/` | Node.js 18+ |

## Recommended Stack for Local Development

1. **Git** — version control and safe iteration
2. **Node.js** — run web apps and JS tooling locally
3. **Python 3** — scripts and games (e.g. `guess_game.py`)
4. **AI tool** — Cursor, Claude, or VibeCoding CLI with an API key

## This Workspace Implementation

We created **Vibe Coding Studio** — a local web app at `http://localhost:3847` that:

- Explains the vibe coding workflow
- Captures project prompts (saved in browser)
- Lists local projects you can launch
- Provides one-command setup for the VibeCoding CLI

## References

- [Google Cloud — What is Vibe Coding](https://cloud.google.com/discover/what-is-vibe-coding)
- [VibeCoding CLI (GitHub)](https://github.com/startvibecoding/vibecoding)
- [VibeCoder self-hosted platform (GitHub)](https://github.com/dublyo/vibecoder)
