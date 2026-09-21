# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `93ad9a1fc577ffc4ed7fec013e6b2bd2c37be5c5`

Latest release-critical verification:
- authoritative receipt-status lookup + no-store + rate-limit binding;
- reservation-first inventory;
- abandoned order release;
- payment lifecycle regression harness covering verified success, cancellation, provider request rejection, verification failure, duplicate callback and expiry release.

This service remains subordinate to the FATIKHAN Golestan-style canonical frontend.
