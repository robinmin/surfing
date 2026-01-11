---
name: enhance UI on princing page as a stunning landing page for current surfing website
description: <prompt description>
status: Done
current_phase: 6
verify_cmd: bun run check
impl_progress:
  phase_1: completed
  phase_2: completed
  phase_3: completed
created_at: 2026-01-10 19:31:20
updated_at: 2026-01-11 00:02:44
---

## enhance UI on princing page as a stunning landing page for surfing website

### Background
After we fix the login issue, we needto enhance UI and SEO optimization on princing page as a stunning landing page for current surfing website.

### Requirements / Objectives
- Re-design the whole page to make it as a stunning and elegant landing page. The key request on this step is you can not lost any features in current page.

- Generate a hero page to match with the website, just as the hero image in the first page.

- As the whole website(layout?) we need to build up the framework to support SEO optimization/customization. The target of this service can be apply to these static pages, these dynamic page contents are not contanined in this scope.

- Apply this SEO optimization/customizatio mechanism to this pricing page.

### Solutions / Goals

#### Architecture Overview
We will leverage the existing Astro + Tailwind architecture, utilizing the `Layout` component for SEO management and the `Hero` widget for visual consistency. The design will focus on "Glassmorphism" and modern UI trends (gradients, subtle shadows) to create a "stunning" effect without altering the underlying functionality.

#### Core Components
- **Page Layout**: `src/layouts/PageLayout.astro` (Handles SEO via `metadata` prop).
- **Hero Widget**: `src/components/widgets/Hero.astro` (Reused from Index page, customized with Pricing content and background).
- **Pricing Widget**: Existing logic in `pricing.astro`, but with significantly enhanced CSS styling for cards (glass effect, hover states).
- **FAQ Section**: Enhanced styling for standard HTML `<details>` elements.

#### Implementation Plan

##### Phase 1: Foundation & SEO [Complexity: Low]

**Goal**: Ensure SEO metadata is correctly configured and transmitted to the Layout.

**Status**: pending

- [ ] Verify `pages.pricing.title` and `pages.pricing.description` translation keys exist or add fallbacks.
- [ ] Ensure `Layout` correctly propagates `metadata` to `Metadata` component (already implemented, just verify).
- [ ] Add OpenGraph image specific to pricing if available (or fallback to default).

**Deliverable**: correctly configured SEO metadata.
**Dependencies**: None

##### Phase 2: Hero Section [Complexity: Medium]

**Goal**: Recreate the stunning Hero section from the home page.

**Status**: pending

- [ ] Implement `Hero` widget in `pricing.astro`.
- [ ] Add a background image/gradient overlay (using `slot="bg"`) similar to `index.astro`.
- [ ] Style the title and subtitle to be impactful (typography, sizing).

**Deliverable**: Visual Hero section matching the site's brand.
**Dependencies**: Phase 1

##### Phase 3: Visual Polish (The "Stunning" Part) [Complexity: High]

**Goal**: Redesign the generic pricing cards into a premium, polished UI.

**Status**: pending

- [ ] Apply **Glassmorphism** (backdrop-blur, semi-transparent backgrounds) to pricing cards.
- [ ] Enhance **Typography** (headings, price tags).
- [ ] Add **Micro-interactions** (hover lift, button glow).
- [ ] Improve **Dark Mode** contrast and colors.
- [ ] Style the **FAQ** section to match the premium aesthetic.

**Deliverable**: A visually stunning pricing page.
**Dependencies**: Phase 2

### References
- `src/pages/index.astro` (Hero reference)
- `src/config.yaml` (SEO config)
