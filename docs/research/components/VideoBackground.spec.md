# VideoBackground Component Specification

## Overview
- **Target file**: `src/components/VideoBackground.jsx`
- **Interaction model**: Scroll-driven video playback (video scrubbing) with Lerp smoothing.

---

## DOM Structure
- `.video-background-container`
  - `video` (muted, playsinline, preload="auto")
  - `.video-overlay` (mask overlay for readability)

---

## Computed Styles (Exact Values)

### `.video-background-container`
* position: `fixed`
* top: `0px`
* left: `285px` (offset by desktop sidebar width)
* width: `calc(100% - 285px)`
* height: `100vh`
* z-index: `1`
* overflow: `hidden`

### `video`
* width: `100%`
* height: `100%`
* object-fit: `cover`
* object-position: `center`

### `.video-overlay`
* position: `absolute`
* top: `0px`
* left: `0px`
* width: `100%`
* height: `100%`
* background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6))` (darkened mask to ensure white text is readable)
* z-index: `2`

---

## States & Behaviors

### Scroll Scrubbing (Управление временем скроллом)
* **Trigger**: Window scroll event (`scroll`).
* **Logic**:
  1. Calculate scroll fraction:
     `scrollFraction = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`
  2. Map fraction to video duration:
     `targetTime = video.duration * scrollFraction`
  3. Interpolate the current time smoothly using a `requestAnimationFrame` loop (Lerp - Linear Interpolation):
     `currentTime += (targetTime - currentTime) * 0.1`
     `video.currentTime = currentTime`
* **Fallback**: If the video is not fully loaded or duration is not available, default to static scrolling sections with a high-quality poster image.

---

## Responsive Behavior
* **Screens > 991px**: `left: 285px`, `width: calc(100% - 285px)`
* **Screens <= 991px**: `left: 0`, `width: 100%` (video spans full width behind the scrollable sections)
