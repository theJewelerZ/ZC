# Design Tokens

## Brand colors

- Navy: `#0B1F33`
- Signal Orange: `#F26A21`
- Structural White: `#F7F9FB`
- Steel Gray: `#66717D`
- Carbon: `#121820`

## Layout

- Public page width: `77.5rem`
- Private console width: `84rem`
- Reading width: `46rem`
- Page gutter: `clamp(1rem, 4vw, 3rem)`
- Section rhythm: `clamp(3.5rem, 8vw, 7rem)`

## Surfaces

- Small radius: `0.375rem`
- Standard radius: `0.625rem`
- Large radius: `0.875rem`
- Hairline border: neutral steel at low opacity
- Quiet shadow: shallow separation for elevated controls
- Elevated shadow: reserved for authentication and focused capture surfaces

## Type hierarchy

- Display: public hero statements
- Page title: route identity
- Section heading: primary page divisions
- Card heading: action or record title
- Body: normal reading copy
- Supporting body: explanatory secondary copy
- Eyebrow: short uppercase context label
- Metadata: dates, locations, and compact state
- Form label: persistent field purpose
- Helper/error: concise instruction or correction

Type sizes use fluid `clamp()` values only where the viewport materially affects composition. Body text remains at least 1rem on public and mobile operational surfaces.

## Status system

Status treatments always include a text label. Neutral states use steel/navy; attention uses orange with dark text; success uses a restrained green; failure uses a restrained red. Color is never the only signal.

## Controls

- Compact button: minimum 44px target
- Standard button: minimum 50px target
- Field primary button: minimum 56px target
- Focus ring: 3px Signal Orange with visible offset

## Governance

Tokens live as project-owned CSS variables in `src/app/globals.css`. Do not add a UI framework or introduce an unrelated color, radius, or shadow without a documented decision.
