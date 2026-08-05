# Asset Inventory

The founder supplied three transparent raster concept exports on July 23, 2026.
Original files are preserved under `assets/brand-source`; deterministic,
lossless-trimmed web copies live under `public/brand`. The mark is now integrated
through `BrandMark`, while the header retains a typeset wordmark because the
supplied full lockup is stacked rather than horizontal. Publication rights still
require explicit launch confirmation. No project photography has been supplied.

## Brand source and status

| Asset | Current status | Production use |
| --- | --- | --- |
| `assets/brand-source/zarka-construction-mark.png` | Supplied transparent 1536×1024 raster canvas; approved concept, not a verified vector | Active source for the site mark |
| `assets/brand-source/zarka-construction-logo-horizontal.png` | Supplied transparent 1536×1024 raster canvas; artwork is a stacked lockup despite the source name | Retained as source; not squeezed into the header |
| `assets/brand-source/zarka-construction-favicon.png` | Supplied transparent 1536×1024 raster canvas; not browser-sized as supplied | Source for deterministic browser-icon exports |
| Brand statement | Approved text: “Built with precision. Delivered with integrity.” | May be typeset using site typography |

### Active production derivatives

| Path | Role | Dimensions / status |
| --- | --- | --- |
| `public/brand/zarka-construction-mark.webp` | Shared-shell and hero mark | 567×720, transparent lossless WebP |
| `public/brand/zarka-construction-logo-lockup.webp` | Preserved stacked lockup derivative | 657×718, transparent lossless WebP; not currently rendered |
| `src/app/icon.png` | Browser/application icon | 512×512 transparent PNG with safe padding |
| `src/app/apple-icon.png` | Apple touch icon | 180×180 transparent PNG |

## Temporary production exports

Use a transparent, human-reviewed high-resolution source to create:

| File role | Suggested name | Suggested master/display size |
| --- | --- | --- |
| Horizontal, light surface | `zarka-construction-logo-on-light.png` | master ≥2400px wide; render near 180–240 CSS px |
| Horizontal, dark surface | `zarka-construction-logo-on-dark.png` | master ≥2400px wide |
| Icon, light surface | `zarka-construction-icon-on-light.png` | master ≥1024×1024 |
| Icon, dark surface | `zarka-construction-icon-on-dark.png` | master ≥1024×1024 |
| Monochrome fallback | `zarka-construction-logo-mono.png` | master ≥2400px wide |

Also generate optimized WebP versions where they are smaller without visible
damage. PNG remains appropriate for transparent sharp-edged temporary artwork.
Do not repeatedly recompress an AI-board crop.

Each asset must be checked for:

- Transparent edges without white/gray halos
- Geometry faithful to the approved concept
- Correct palette and sufficient surface contrast
- Legibility at mobile header and favicon sizes
- No embedded board labels, mockup shadows, texture, or invented `LLC`
- Confirmed permission for production publication

If a configured image fails or a future asset is removed, `BrandMark` retains a
text fallback. The active narrow lockup combines the supplied icon with typeset
`ZARKA / CONSTRUCTION`; it is a temporary production treatment, not a claim that
the embedded concept typeface has been recreated.

## Final vector deliverables

A professional designer should provide:

- Editable source artwork and optimized production SVG
- Icon-only, horizontal, and stacked lockups
- Light, dark, one-color, and knockout variants
- Wordmark with and without approved `LLC` use
- Outlined archival file independent of missing fonts
- Clear-space, minimum-size, background, and misuse guidance
- Optical corrections for small sizes
- Color values and accessibility notes
- Ownership/licensing and trademark-review status

Suggested names mirror temporary assets but use `.svg`. Update only
`config/assets.ts` paths and metadata; component code must remain unchanged.
SVGs must be inspected/sanitized before serving.

## Favicons and application icons

Required temporary/final outputs:

- `favicon.ico` containing 16×16 and 32×32
- `icon-32.png`
- `apple-touch-icon.png` at 180×180
- application icons at 192×192 and 512×512 if a manifest is included
- maskable-safe variant only after testing safe zones
- final `icon.svg` when a suitable vector exists

Use the icon only, simplify detail if professionally approved, and test on light
and dark browser chrome. Do not reduce the full horizontal lockup into a favicon.

**Implemented temporary production assets:** `src/app/icon.png` and
`src/app/apple-icon.png` are deterministic crops/resizes of the supplied favicon
artwork and use Next.js metadata conventions. Replace them when professionally
prepared small-size artwork is available.

## Open Graph image

- 1200×630 pixels, sRGB, compressed WebP or JPEG plus framework-compatible path
- Brand-led fallback using Navy, Structural White, restrained Orange, icon/text
  lockup, approved statement, and generous safe margins
- Avoid unapproved project photography, tiny text, QR codes, or unsupported
  service claims
- Suggested name: `zarka-construction-og-1200x630.jpg`
- Supply descriptive metadata alt text separately

**Implemented MVP fallback:** `src/app/opengraph-image.tsx` generates a
1200×630 brand-only image containing the text wordmark, approved statement, and
capability categories. It contains no invented photography or vector logo.

## Photography needs

### General project work

- Wide environmental establishing shots
- Medium views showing built scope and surrounding finish
- Detail views of carpentry, installation, protection, paint, and transitions
- Process images only when safe, professional, and permissioned
- Before/after pairs with matched viewpoint when truthful

For every project record owner/client permission, photographer/license, capture
date, general location approved for disclosure, Zarka scope, partner work,
caption facts, and alt text.

### Simulator environments

- Finished-room views from entry and player perspective
- Screen/enclosure geometry and protection details
- Left/right player-clearance context where safely demonstrable
- Turf/hitting area, projector/lighting coordination, trim/integration details
- Installation/process details that do not expose unsafe work or private data

Avoid showing third-party equipment logos as implied partnerships. Obtain
property/customer permission and remove identifying/private information.

### Founder

- One professional environmental portrait in a real, controlled project context
- One neutral horizontal/vertical alternative for responsive crops
- Avoid staged hard-hat/tool clichés and unsafe PPE portrayal
- Confirm name, title, biography, photographer rights, and approval before use

## Image specifications

- Retain archival originals outside the web build.
- Correct orientation/color, then export responsive AVIF/WebP; use JPEG fallback
  where needed and PNG only for transparency/graphic sharpness.
- Do not upscale low-resolution images.
- Typical web widths: 640, 960, 1280, 1600, and 2000px only when layout needs
  them; let the Next.js image pipeline generate actual responsive variants.
- Use explicit dimensions/aspect ratios to prevent layout shift.
- Strip unnecessary metadata while retaining an internal rights record.
- Quality should preserve material/finish detail without oversized transfers.

## Naming conventions

Use lowercase kebab-case, descriptive subject, optional project slug/view, and
dimensions only for fixed-purpose deliverables:

```text
brand/zarka-construction-logo-on-dark.svg
brand/zarka-construction-icon-on-light.png
projects/<project-slug>/<project-slug>-simulator-room-wide.jpg
projects/<project-slug>/<project-slug>-finish-detail-01.jpg
social/zarka-construction-og-1200x630.jpg
```

Avoid `final`, `new`, dates as the only distinction, spaces, client private
names, and camera-generated names.

## Replacement process

1. Add new files without overwriting the only known-good asset.
2. Validate SVG safety, dimensions, transparency, contrast, and small-size
   rendering.
3. Update asset manifest paths and metadata.
4. Run component, screenshot, performance, metadata, and favicon/social tests.
5. Confirm both light/dark surfaces and text fallback.
6. Remove obsolete assets only after references and production deployment are
   verified; record the brand decision.

## Simulator-first project-photo gate

- Use founder-owned simulator-room photography only.
- Do not use AI-generated, stock, staged, or fictional project imagery.
- Do not publish the secured upcoming project before actual construction begins.
- Keep typed image sources `null` until publication rights, project context,
  crop, dimensions, and alt text are approved.
- Preserve planning, construction-progress, impact-environment, and completed-room
  slots so approved photography can replace schematics without component rewrites.