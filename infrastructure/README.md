# Commerce Infrastructure Lab

This branch is an isolated research/vendor lab for the beauty-store project.

It intentionally does **not** modify the production Cloudflare branch. The goal is to keep proven, large-scale open-source commerce infrastructure available for architecture study, selective reuse, benchmarking, and future migration.

## Included stacks

### Commerce engines / platforms
- Medusa — modular TypeScript/Node commerce platform
- Saleor Core — high-performance Python/GraphQL headless commerce
- Spree — Ruby commerce platform for DTC/B2B/marketplaces
- Solidus — Ruby commerce platform
- Sylius — PHP/Symfony headless commerce
- Bagisto — Laravel commerce platform
- Aimeos — Laravel/PHP scalable commerce framework
- Vendure — TypeScript/NestJS headless commerce
- Magento Open Source — Adobe/Magento PHP commerce platform
- WooCommerce — WordPress commerce platform
- PrestaShop — PHP commerce platform
- Shopware — PHP/Symfony commerce platform
- nopCommerce — ASP.NET Core commerce platform
- OpenCart — PHP commerce platform

### Storefront architecture
- Vercel Commerce — Next.js commerce storefront architecture
- Shopify Hydrogen — React/Remix headless storefront architecture for Shopify

## Why submodules instead of copying millions of files

Each upstream is pinned to an exact audited commit via a Git submodule. This preserves original history, license attribution, and source provenance while preventing the beauty-store repository itself from exploding to multiple gigabytes.

A clone with submodules gives you the full source trees locally:

```bash
git clone --recurse-submodules https://github.com/amirastae/beauty-store.git
cd beauty-store
git checkout commerce-infrastructure-lab
git submodule update --init --recursive
```

Or from an existing clone:

```bash
git checkout commerce-infrastructure-lab
./infrastructure/bootstrap.sh
```

## Production isolation

Cloudflare production should continue tracking `cloudflare-site`.
Do not point Cloudflare at `commerce-infrastructure-lab`; these projects have incompatible runtimes and are intentionally isolated.

## License rule

Do not merge an upstream tree into the production application just because it exists in this lab. Review that upstream's exact license first. Permissive, copyleft and source-available licenses have different obligations. The manifest records the current pinned repository and commit; the upstream repository remains the source of truth for its license.
