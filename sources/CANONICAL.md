# Canonical staging frontend

The canonical staging frontend is built from:

`sources/polish/veloura-next`

The workflow `build-canonical-staging.yml` typechecks and builds that source, verifies essential routes, then replaces `public/**` atomically on `integration-staging`.

This mechanism prevents generated assets from separate chats/branches being merged together.

The production branch is **not** touched by this workflow.
