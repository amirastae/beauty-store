# Parallel Workstream Dashboard

| Workstream | Branch | Current head | Responsibility | Can deploy? |
|---|---|---|---|---|
| Production | cloudflare-site | 4683bc2fdbfda6e7ded412941eab86283c45c708 | live site only | yes |
| Integration | integration-staging | 4683bc2fdbfda6e7ded412941eab86283c45c708 | conflict resolution + final QA | preview only |
| Foundation | beauty-v2-foundation | 0e1c78f1dfd1a4822a74cced49cc8130b85e4b1f | base storefront | no |
| Polish | veloura-v2.1-polish | 46c6612c85c902de679dcf10cb4a6be1db91434d | visuals/motion/accessibility | no |
| Shop | shop-v1.1.0-work | 12dd4e0624dfb437bf2e405b8e6d6eb3594fab3d | catalog/assets/store UX | no |
| Commerce | commerce-core-v1 | 3dbd71ed196ac61ed62062a7105d33b013706fb6 | API/data/checkout | preview only |
| Lab | commerce-infrastructure-lab | 6878025abbf770a8e1deb47b3542615d8bcf814d | reference architecture | never |

## Single-site policy

All workstreams build one VELOURA site. Branches are work lanes, not separate products.

The final path is always:

`work branch → integration-staging → verified preview → cloudflare-site → production snapshot on main`

No workstream should independently overwrite `cloudflare-site`.
