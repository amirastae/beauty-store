# Commerce service staging snapshot

Source branch: `commerce-core-v1`
Source commit: `fb1b5a18ce7c971a21a0fd73623adba82d683519`

Payment lifecycle regression now runs on an isolated Worker port (8788), separate from the base commerce integration Worker (8787). This prevents a surviving prior dev process from masking mock-provider configuration.

FATIKHAN/Golestan remains the only canonical storefront; this service is backend support only.
