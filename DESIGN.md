# Design System

## Color Tokens

- **Accent (Teal)**: `#00aba9` (Hover: `#008e8c`) — used for CTA buttons, star ratings, active sidebar menu highlights, text markers, and scrollbar thumbs.
- **Background (Dark)**: `#0c0e12` — page body, preloader overlay background (except during intro), mobile header background.
- **Preloader Gold**: `#c6a15b` — used for the initial preloader screen background before the intro video is revealed.
- **Text (White)**: `#ffffff` — primary text, sidebar text, headings.
- **Text (Dark)**: `#4d5760` — supporting copy, details.
- **Text (Muted)**: `#7d8c99` — disabled states or minor metadata.

## Typography

- **Font Family**: Montserrat (Google Fonts, weights 300, 400, 500, 600, 700, 800).
- **Hero Title**: `64px` (Weight: 800, uppercase, letter-spacing: 3px) — for the hotel name.
- **Hero Subtitle**: `26px` (Weight: 600, uppercase, letter-spacing: 1.5px) — for hotel descriptor.
- **Section Heading**: `44px` (Weight: 800, uppercase, letter-spacing: -0.5px) — for section headers.
- **Section Subtitle (Tag)**: `14px` (Weight: 600, uppercase, letter-spacing: 2px) — section labels.
- **Body Text**: `15px` / `16px` (Weight: 400, line-height: 1.5).

## Components

### Buttons
- **CTA Button (`.btn-cta`)**:
  - Border-radius: `0` (Strictly sharp corners)
  - Background: `linear-gradient(120deg, #00aba9 0%, #00e5e2 50%, #00aba9 100%)`
  - Animation: Shimmer effect (`shimmer-gradient 3s linear infinite`)
  - Padding: `14px 32px`
  - Font: `13px` / Bold / Uppercase / Letter-spacing: `1.5px`
- **Secondary Button (`.btn-secondary`)**:
  - Border-radius: `0`
  - Background: Transparent, border `2px solid rgba(255, 255, 255, 0.2)`
- **YouTube Button (`.btn-youtube-sharp`)**:
  - Border-radius: `0`
  - Background: Transparent, border `2px solid rgba(255, 255, 255, 0.25)`

### Photo Gallery (Mobile)
- Swipe-enabled, drag-to-scroll container.
- Equal-width cards with a `3:2` aspect ratio.
- Hidden navigation arrows, clean numbered pagination beneath the image row.
