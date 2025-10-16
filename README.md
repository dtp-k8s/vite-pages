# Vite pages for the DT platform core

**Pages:**

- login page at `login/`
- main page at `/` (currently a placeholder)

## Setup

1. Install Node.js:

    ```sh
    sudo apt-get install -y curl
    curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
    sudo apt-get install -y nodejs
    node -v
    ```

    - This should also install `corepack` automatically; check this with `npm list -g`.

2. Run `yarn dev` from the repository root directory.

## CORS

This frontend has been set up to enable communication between `localhost` (local Vite environment) and `yc.ngrok.dev` (public entrypoint for the Kubernetes cluster).  This allows for local development of the frontend with hot-reload, without the need to push each individual change to the cluster.

Note that any API services used by the frontend must also enable CORS.  For example, in FastAPI:

```py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Authorized-User"],
)
```
