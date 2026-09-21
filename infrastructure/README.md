# Commerce Infrastructure Lab

This isolated branch is a large-scale architecture library for the beauty-store project. It keeps production untouched while pinning major open-source commerce engines, storefronts and platform primitives at exact commits.

## Scope

**Commerce engines:** Medusa, Saleor, Spree, Solidus, Sylius, Bagisto, Aimeos, Vendure, Magento Open Source, WooCommerce, PrestaShop, Shopware, nopCommerce and OpenCart.

**Storefront architecture:** Vercel Commerce and Shopify Hydrogen.

**Platform primitives:** Supabase, Strapi, Payload, Meilisearch, Better Auth, Next.js, Cloudflare Workers SDK and Hono.

That gives the repository a broad reference base for catalog, checkout, orders, admin, auth, CMS, search, database, edge runtime, APIs and modern storefront architecture.

## Storage strategy

The upstream projects are pinned as Git submodules instead of copying millions of files into the parent Git object database. A normal recursive clone materializes the full sources locally while preserving upstream history and license provenance.

```bash
git clone --recurse-submodules https://github.com/amirastae/beauty-store.git
cd beauty-store
git checkout commerce-infrastructure-lab
git submodule update --init --recursive
```

Existing clone:

```bash
git checkout commerce-infrastructure-lab
./infrastructure/bootstrap.sh
```

## Isolation

Cloudflare production remains on `cloudflare-site`. Do not deploy this lab branch directly. These stacks use mutually incompatible runtimes and are for selective extraction, benchmarking and future architecture work.

## License safety

Every submodule remains under its upstream license. Before moving any implementation into production, verify the exact license and third-party notices at the pinned commit. This branch deliberately keeps copyleft/source-available projects isolated from the production codebase.
