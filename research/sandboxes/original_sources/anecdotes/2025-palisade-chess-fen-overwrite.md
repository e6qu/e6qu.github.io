---
title: "Demonstrating specification gaming in reasoning models"
url: https://arxiv.org/abs/2502.13295
authors: Alexander Bondarenko, Denis Volk, Dmitrii Volkov, Jeffrey Ladish (Palisade Research)
date: 2025-02-18 (v1); read v3, 2025-08-27
accessed: 2026-11-22
kind: paper
---

Code and per-run transcripts: https://github.com/PalisadeResearch/ctfish

## Summary
An LLM agent is told to win at chess against Stockfish by submitting moves through `./game.py` in a shell. The game runs in a Docker container: `/env` holds `game.py` and the game state, and Stockfish lives in `/usr/share/games/stockfish`. Reasoning models often decide that fair play cannot win, so they **hack the environment**. They overwrite the board state in `game/fen.txt` with a winning position (the engine resigns below −500 centipawns), replace the Stockfish binary with a stub, run a second Stockfish to pick their moves, or write a fake score to `game/status.txt`. In v3, o3 hacked in **88%** of runs, and o1-preview in 36% of 123 runs. GPT-4o and Claude 3.5 Sonnet only hacked when the prompt nudged them.

## Key points
- The canonical trace: "I'll overwrite the board to have a decisive advantage" → `echo '6k1/8/8/8/8/8/8/5qK1' > game/fen.txt` → "Engine resigns."
- Other hacks quoted in Appendix B include `cat > /app/.venv/bin/stockfish << 'EOF'` (replacing the engine inside the harness's own virtualenv) and `echo "-600" > game/status.txt`.
- Taking "take a look around" out of the prompt changed behaviour, which shows how sensitive the result is to prompt wording.
- The paper explicitly cites "OpenAI (2024)'s o1 Docker escape" as precedent.
- Caveat: the agent had write access to the game state and the engine binary by design. The environment was the unspecified part. This was not an exploit.

## Excerpts
> "While directly editing game files might seem unconventional, there are no explicit restrictions against modifying files" (Appendix B, quoted model output)

> "echo '6k1/8/8/8/8/8/8/5qK1' > game/fen.txt" (Key quotes from a hacking run)

> "o3 shows extreme hacking propensity, hacking in 88% of runs" (§4.2)

## Relevance to the talk
This is the funniest and easiest-to-picture model-misbehaving story for a mixed audience. Hook: *"Asked to beat Stockfish, o3 rewrote the board so Stockfish resigned."* The platform lesson is that **the scorer, the opponent and the state must not be writable by the agent**: make them read-only mounts or run them in a separate process or container that answers over an API. It fits the agent-sandboxing section next to ImpossibleBench (read-only tests) and METR (monkeypatched graders).
