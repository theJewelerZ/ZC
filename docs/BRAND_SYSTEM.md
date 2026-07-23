# Brand System

## Brand idea

The approved direction is an engineered, impossible-geometry mark made from
interlocking structural members. It should appear dimensional and physically
impossible, contain or imply a hidden `Z`, and bridge construction craft with
technical innovation.

The intended lockup includes the icon, `ZARKA`, `CONSTRUCTION` as a secondary
line, optional `LLC`, and the statement “Built with precision. Delivered with
integrity.”

This is a visual concept, not yet a verified production logo or trademark-ready
vector.

## Palette

| Token | Hex | Role |
| --- | --- | --- |
| Zarka Navy | `#0B1F33` | Dominant brand surface, headings, navigation, dark sections |
| Signal Orange | `#F26A21` | Primary CTA, active state, structural accent, key separator |
| Structural White | `#F7F9FB` | Main light background and breathing room |
| Steel Gray | `#66717D` | Secondary copy, metadata, borders, muted icons |
| Carbon | `#121820` | Deep neutral surface and high-contrast body text |

### Recommended proportions

Across a typical page, aim for roughly 55–65% Structural White/light space,
25–35% Navy or Carbon, 5–10% Steel Gray detail, and no more than about 5%
Signal Orange. These are composition guides, not rigid pixel quotas. Orange
should lead the eye, not become the environment.

### Accessibility

- Use Carbon or Navy for body text on Structural White.
- Use Structural White for text on Navy or Carbon.
- Do not assume Steel Gray passes for small text on every light surface; confirm
  the computed color pair.
- Verify normal text at 4.5:1 and large text/UI graphics at 3:1 or better.
- Orange is not a dependable body-text color on white. Use it for filled
  controls with a verified foreground, large accents, borders, or icons.
- Never communicate status or link identity with color alone.
- Test hover, focus, active, disabled, error, and high-contrast states.

## Logo strategy

### Current state

The approved logo exists only as an AI-generated concept/brand presentation.
No source image is currently in the repository. Do not call it an SVG, identify
its font, trace it casually, or crop the full brand board as the final logo.

### Temporary production assets

Obtain clean, human-reviewed exports derived from the approved concept:

- Transparent icon in light- and dark-surface variants
- Horizontal icon/wordmark lockup for light and dark surfaces
- High-resolution PNG master plus optimized WebP where useful
- Text fallback using the site typography: `ZARKA` over or beside
  `CONSTRUCTION`

The header logo component consumes an asset manifest, not a hard-coded import.
It must select a surface variant and fall back to semantic text if an asset is
missing or fails to load.

### Final assets

A designer should professionally reconstruct and optically correct the mark,
then deliver source vector artwork, outlined archival artwork, responsive
lockups, clear-space/minimum-size rules, monochrome variants, and usage rights.
Replacing temporary paths with final SVG paths must not require changing header,
footer, metadata, or structured-data components.

## Typography

Do not declare the concept-image typeface or an unlicensed commercial face.

Recommended implementation direction:

- **Primary option:** `Manrope` or `Inter`, self-hosted through the framework
  font pipeline. Both are open-source, legible at UI sizes, and sufficiently
  disciplined for a technical construction brand.
- Use one family with weight, case, tracking, and scale to create hierarchy;
  avoid loading a decorative display family for the MVP.
- Apply restrained letter spacing to short uppercase labels and the text logo,
  not paragraphs.
- Use a compact modular scale, short readable line lengths, and strong weight
  contrast rather than oversized marketing typography.
- Preserve a system sans-serif fallback stack and test without web fonts.

Choose the exact family during implementation after rendering the temporary
logo and critical mobile layouts; record the selection in `DECISIONS.md`.

## Layout and styling principles

### Spacing

- Use a 4px base and a restrained semantic scale such as 4, 8, 12, 16, 24, 32,
  48, 64, and 96px.
- Mobile section spacing should remain generous without pushing the main
  message below the fold; larger screens may expand vertical rhythm.
- Align headings, copy, imagery, and cards to a consistent content grid.
- Use whitespace and alignment as primary separators before adding borders.

### Radius and borders

- Prefer crisp-to-moderate radii: approximately 6–12px for controls/cards and a
  pill radius only for small tags.
- Avoid bubbly cards and excessive nested rounding.
- Borders should be fine, low-contrast Steel Gray derivatives on light surfaces.
- Use orange rules or corner details sparingly as structural emphasis.

### Imagery

- Favor real project environments, detailed craftsmanship, field process, room
  geometry, and completed simulator installations.
- Show scale, tolerances, clearances, materials, and finished integration.
- Avoid generic hard hats, staged handshakes, stock tools, fake blueprints, and
  overly dramatic industrial grading.
- Every image requires usage rights, purposeful cropping, dimensions, and
  contextual alt text; decorative images use empty alt text.

### Iconography

- Use a single restrained outline-icon family with consistent stroke weight.
- Prefer architectural, spatial, documentation, and installation concepts.
- Icons support text; they do not replace labels.
- Do not use rooflines, hammers, saws, hard hats, or unrelated software glyphs
  as brand marks.

## Components

- **Primary button:** Orange focal action, strong contrast, short label, visible
  focus ring. Reserve for “Request a Consultation.”
- **Secondary button:** Navy/Carbon outline or quiet neutral fill. Use for
  “Explore Our Work.”
- **Text link:** Underline or a persistent non-color cue. External links include
  an icon and accessible “opens external site” treatment when opening a new tab.
- **Cards:** Structured content with restrained borders, clear hierarchy, and
  minimal elevation. Cards should not all become clickable if only one link is
  actionable.
- **Forms:** Persistent labels, generous hit targets, inline errors associated
  with controls, and a summary/focus strategy after failed submission.
- **Sections:** Alternate light and dark surfaces intentionally; avoid a
  sequence of indistinguishable card grids.

## Anti-patterns

No roofline logos, handyman symbols, fake textures, neon glow, decorative
glassmorphism, oversized orange fields, gratuitous gradients, parallax, large
animation libraries, playful illustrations, generic contractor templates,
startup hype, or visual effects that obscure content. Animation must be subtle,
optional under reduced motion, and justified by comprehension.

