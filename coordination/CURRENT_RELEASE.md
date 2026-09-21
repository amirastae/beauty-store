# Current Release Train

The project now has one release path:

`workstreams → integration-staging → PR #31 → cloudflare-site`

Current staging commit `5911550f63a67788842f43823544e74982b6e36e` has a successful Integration Staging Verify run and an explicit merge-parent relationship to the current production baseline `a535a06b7a96595a10c9d0b06b4f4e800757932c`. PR #31 is mergeable but intentionally remains draft.

The remaining blocker is authenticated Cloudflare commerce-preview provisioning/verification for D1 and R2, followed by browser checkout and payment-provider tests.

No production merge should occur until those gates are satisfied.
