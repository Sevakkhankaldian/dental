# Local foundation runbook

## Purpose

Start the non-clinical local dependencies for the first foundation slice. The data is deterministic and synthetic.

## Startup

1. Copy `.env.example` to an untracked `.env` and keep the safe local values.
2. Start `postgres`, `redis`, `minio`, and `temporal` with Docker Compose.
3. Start the web preview and open `http://localhost:3000`.
4. Check `GET /api/v1/health`. Dependency states remain `NOT_CONFIGURED` until the API adapter slice is wired.

## Reset and recovery

The named Docker volumes contain only synthetic local data. A reset must be explicitly targeted at the `dentamonitor-local` project. Never reuse these instructions against a production context.

## Current alarms

No production alarm routing exists. A failed web process or unhealthy local container is visible only through local logs and the health endpoint.
