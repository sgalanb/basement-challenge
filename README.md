<h1 align="center">Basement Challenge | @sgalanb</h1>

<a href="https://basement-challenge-six-rho.vercel.app">
  <p align="center" width="100%">
    <img alt="basement.studio" src="https://basement-challenge-six-rho.vercel.app/opengraph-image.jpg">
  </p>
</a>

# Notes (hand written, no slop)

## Technical Decisions

- Use Oxfmt and Oxlint. Prettier and ESLint defaults with minimal setup and state of the art performance.
- Use shadcn/ui with Base UI primitives to scaffold a customizable, accessible and scalable component library. [^1]
- Import Geist variable fonts from the `geist` package instead of Google Font to support the full glyph set and `font-feature-settings` CSS property.
- Use the [round() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/round) to calculate percentage based text line heights the same way Figma does.
- Don't let the client change the logo on the navigation bar and footer. It's not really content but more of a site design thing, which is handled with code.
- Don't let the client edit posts metadata. Title, description and OG image properties are generated automatically using post content.
- Don't enable Next.js Cache Components. For this project, where everything can be statically generated and revalidated, using Cache Components would not represent any meaningful improvement while [requiring more config and boilerplate code per page](https://www.sanity.io/docs/nextjs/cache-components).
- Use `next-sanity/image` to load images that come from Sanity. It wraps `next/image` and uses a custom loader that prevents re-optimizing the image while maintaining all its niceties.
- Revalidate tags with `profile="max"`. A marketing site can afford to serve stale state for a couple seconds while the revalidation runs. The alternative would be blocking the request until the revalidation is done, not worth it in my opinion.

[^1]: Could be done with vanilla Base UI, but since this is an agency project I think adhering to shadcn patterns and conventions is the right call. Given they are pretty much industry standards by now, it makes future customization easier for the client.

## Design Decisions and Assumptions

- Mono text style is labeled as "GEIST MONO REGULAR" but all intances use medium weight. Used medium to preserve visual fidelity.
- Mobile typekit has a separate section at the bottom with the same 16px font styles in different weights as the desktop version, but they are never used on the pages. Omitted in code, easy to add later.
- Button styles have no meaningful overlap so I hard-coded each variant.
- Normalized spacing between page sections.
- Posts featured images are optional.
- Each post has an excerpt field that is used on the full post page as well as in the post card.
- Each post has an intro field that is only used on the full post page positioned after the excerpt but before the post date + authors section.
- Change the category chip text color on the light post card variant to a slighly darker grey because the lack of contrast between `basement-light-grey` and `basement-white` made it almost unreadable.

## Quirks and Features

- Granular cache tags that invalidate the smallest possible amount of cached data while accurately reflecting content changes across the entire site.
- Images load almost instantly with a LQIP (Low-Quality Image Placeholder) provided by Sanity while the full image is loading.
- The category filters and "LOAD MORE" button are functional. Selected category is stored as a search param in the URL.
- Sanity visual editing implemented with proper documents and locations mapping.
- Every blog post has a dynamic OpenGraph image, statically generated at build time and regenerated on-demand when the post changes.
- Sitemap is statically generated at build time and regenerated on-demand when posts are published, updated or deleted.
