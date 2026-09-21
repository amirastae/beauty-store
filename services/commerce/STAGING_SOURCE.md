# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `2d49273fc58562de6d0e355acc32ff80ff7f69f3`

Current regression coverage now includes an explicit local mock-Zarinpal Wrangler config, so provider configuration is deterministic in CI rather than relying on ambient dev vars.

Tracked payment lifecycle cases:
- verified payment success;
- duplicate success callback;
- user cancellation;
- provider request rejection;
- provider verify failure;
- expired reservation release.

All of this supports the single FATIKHAN Golestan-style canonical storefront.
