# ZERO-HANG / MESSAGE-PRESERVATION PROTOCOL

This protocol is mandatory for every FATIKHAN workstream.

## Goal
Prevent long silent runs, lost progress, duplicate work, and apparent “message disappearing” when a tool/session is interrupted.

## Execution rules
- Every atomic stage is limited to 1–2 necessary tool calls.
- No long chained remote command unless it is the only safe option.
- Prefer GitHub/connector operations over remote shell for repository work.
- Remote commands must be bounded and short; never use persistent log-follow or unbounded waits.
- After every write/deploy/test stage, create or preserve a durable checkpoint before continuing.
- Never restart from the beginning after timeout/disconnect; continue from the last verified checkpoint.
- Re-read the live branch head before every write to avoid cross-chat collisions.
- If a tool path times out twice, trip a local circuit breaker and switch strategy.
- Do not repeatedly re-check already verified state without new evidence.

## Chat-output rules
- Do not hold all visible output until the end of a long workflow.
- After a meaningful checkpoint, send a short progress message before the next risky/slow stage.
- If execution is interrupted, the next message must start from the last durable checkpoint, not from memory or a full rescan.
- Never report success before the relevant verification actually finished.

## Durable checkpoint files
For cross-chat work, current state must be recoverable from:
- `00_READ_FIRST_FATIKHAN_GOLESTAN.md`
- `coordination/ACTIVE_WORKSTREAMS.md`
- `coordination/SINGLE_SITE_STATE.md`
- the relevant handoff file
- live Git branch heads

## Anti-conflict rule
Other chats may continue in parallel, but each chat owns only its assigned work lane. Integration happens only through `integration-staging`.

## If the ChatGPT UI drops or hides an in-progress assistant message
That UI event must not invalidate work. The next response resumes from Git/GitHub checkpoints and reports the last verified action.
