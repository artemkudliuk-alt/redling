# Sidebar Component Specification

## Overview
- **Target file**: `src/components/Sidebar.jsx`
- **Screenshot**: `docs/design-references/desktop_screenshot.png`
- **Interaction model**: Static sidebar with absolute hover effects, dropdown links, and transitions.

---

## DOM Structure
- `.sidebar` (wrapper, fixed)
  - `.logo-section`
    - `a` (link to home)
      - `img` (`/assets/img/logo.svg`) — contains the circular crest and text
  - `nav.sidebar-nav`
    - `ul.menu` (navigation menu)
      - `li` with `a` links:
        - Номера (`#rooms-section`)
        - Бронирование (`https://redling-hotel.com.ua/booking/`)
        - Об отеле (`#atmosphere-section`)
        - Ресторан Redling (`#restaurant-section`)
        - Услуги (ссылка)
        - Блог (ссылка)
        - Контакты (`#contacts-section`)
      - `li.action-stock`
        - `a` link to promotions with text `★ АКЦИИ ★`
  - `.contacts-section`
    - `.phone-dropdown`
      - `.phone-selected` — displays `(067) 738 77 00` and chevron icon
      - `.phone-drop` (absolute, hidden by default, toggled on click/hover)
        - `.phone-links` (Viber, WhatsApp, Telegram)
  - `.socials-section`
    - Facebook link (opens in new tab)
    - Instagram link (opens in new tab)
    - TripAdvisor link (opens in new tab)
  - `.lang-section`
    - `en`, `ru` (active/current), `ua`
  - `.creator-section`
    - "Создание сайта — Nextweb"

---

## Computed Styles (Exact Values)

### `.sidebar` (Container)
* position: `fixed`
* left: `0px`
* top: `0px`
* width: `285px`
* height: `100vh`
* background-color: `#ffffff`
* background-image: `url("/assets/img/side.jpg")` (textured paper overlay)
* border-right: `1px solid rgba(77, 87, 96, 0.1)`
* padding: `30px 15px`
* display: `flex`
* flex-direction: `column`
* justify-content: `space-between`
* align-items: `center`
* z-index: `10`

### Navigation Menu Items (`.menu li a`)
* font-family: `'Montserrat', 'Geometria', Arial, sans-serif`
* font-size: `12px`
* font-weight: `600`
* text-transform: `uppercase`
* letter-spacing: `1.5px`
* color: `#4d5760`
* padding: `10px 0px`
* transition: `color 0.3s ease`
* **Hover State**: color changes to `#00aba9`

### Button «★ АКЦИИ ★» (`.menu li.action-stock a`)
* background-color: `#00aba9`
* color: `#ffffff`
* border-radius: `30px`
* padding: `8px 20px`
* font-size: `11px`
* font-weight: `700`
* text-align: `center`
* display: `inline-block`
* border: `none`
* margin: `15px 0`
* transition: `background-color 0.3s ease, transform 0.2s ease`
* **Hover State**: background-color changes to `#008e8c`, scale changes to `scale(1.03)`

### Phone Selector (`.phone-selected`)
* font-size: `14px`
* font-weight: `700`
* color: `#4d5760`
* cursor: `pointer`
* display: `flex`
* align-items: `center`
* gap: `5px`

### Messengers Dropdown (`.phone-drop`)
* position: `absolute`
* bottom: `100%` (opens upwards or drops down relative to parent)
* background: `#ffffff`
* border: `1px solid rgba(77, 87, 96, 0.15)`
* border-radius: `6px`
* padding: `10px`
* box-shadow: `0 4px 15px rgba(0,0,0,0.1)`
* z-index: `20`

---

## Responsive Behavior
* **Screens > 991px**: Visible, fixed on left.
* **Screens <= 991px**: Hidden by default (`display: none` on `.sidebar` or toggle class `active` for sliding transition).
* A mobile hamburger button toggles `.sidebar` width or translates it into view (`transform: translateX(0)` vs `transform: translateX(-100%)`).
