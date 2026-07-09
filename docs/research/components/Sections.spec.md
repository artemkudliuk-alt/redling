# Sections Component Specification

## Overview
- **Target file**: `src/components/Sections.jsx`
- **Interaction model**: Scrollable content container with fade-in viewport animations (Intersection Observer) and glassmorphic cards.

---

## DOM Structure
- `.sections-container`
  - `section#hero.content-section`
    - `.section-card.glass`
      - `h1.section-title`
      - `p.section-text`
      - `a.btn-cta`
  - `section#rooms.content-section`
    - `.section-card.glass`
      - `h2.section-title`
      - `p.section-text`
      - `a.btn-cta`
  - `section#pool.content-section`
    - `.section-card.glass`
      - `h2.section-title`
      - `p.section-text`
  - `section#restaurant.content-section`
    - `.section-card.glass`
      - `h2.section-title`
      - `p.section-text`
      - `.work-hours`
      - `.buttons-group`
        - `a.btn-cta` (Book Table)
        - `a.btn-secondary` (Menu)
  - `section#atmosphere.content-section`
    - `.section-card.glass`
      - `h2.section-title`
      - `p.section-text`
  - `section#contacts.content-section`
    - `.section-card.glass`
      - `h2.section-title`
      - `.facts-grid`
        - `.fact-item` (Sea, Address, Distance)
      - `.contacts-details`
        - `.contact-row` (Reception, Restaurant, Email)
      - `a.btn-cta` (Route)

---

## Computed Styles (Exact Values)

### `.sections-container`
* position: `relative`
* z-index: `2`
* width: `100%`
* padding-left: `285px` (offset by desktop sidebar)

### `.content-section`
* min-height: `100vh`
* display: `flex`
* align-items: `center`
* justify-content: `center`
* padding: `60px 40px`

### `.section-card.glass` (Glassmorphism Card)
* background: `rgba(255, 255, 255, 0.08)`
* backdrop-filter: `blur(16px) saturate(120%)`
* -webkit-backdrop-filter: `blur(16px) saturate(120%)`
* border: `1px solid rgba(255, 255, 255, 0.15)`
* border-radius: `16px`
* padding: `40px`
* max-width: `680px`
* width: `100%`
* color: `#ffffff`
* box-shadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3)`
* transition: `transform 0.4s ease, opacity 0.6s ease`
* opacity: `0`
* transform: `translateY(40px)`

### `.section-card.active` (Triggered via Intersection Observer)
* opacity: `1`
* transform: `translateY(0)`

### Typographics
* **`.section-title`**:
  * font-family: `'Montserrat', 'Geometria', sans-serif`
  * font-size: `36px`
  * font-weight: `700`
  * margin-bottom: `20px`
  * line-height: `1.2`
  * letter-spacing: `-0.5px`
* **`.section-text`**:
  * font-family: `'Montserrat', 'Geometria', sans-serif`
  * font-size: `16px`
  * line-height: `1.6`
  * opacity: `0.9`
  * margin-bottom: `30px`
* **`.btn-cta`**:
  * background-color: `#00aba9`
  * color: `#ffffff`
  * padding: `12px 30px`
  * border-radius: `30px`
  * font-size: `14px`
  * font-weight: `700`
  * text-transform: `uppercase`
  * display: `inline-block`
  * text-decoration: `none`
  * transition: `background-color 0.3s ease, transform 0.2s ease`
  * **Hover State**: background-color: `#008e8c`, transform: `scale(1.02)`

---

## Responsive Behavior
* **Screens <= 991px**:
  * `.sections-container`: `padding-left: 0`
  * `.content-section`: `padding: 40px 20px`
  * `.section-card`: `padding: 30px 20px`, `max-width: 100%`
  * `.section-title`: `font-size: 28px`
