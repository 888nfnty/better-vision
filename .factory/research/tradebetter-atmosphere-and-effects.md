# TradeBetter.app — Atmosphere & Visual Effects Analysis

> Scraped and analysed: 2026-03-23  
> Source: https://tradebetter.app (Built with Framer, published Mar 9 2026)

---

## 1. Site-Wide Film Grain Overlay (THE KEY ATMOSPHERE EFFECT)

TradeBetter uses a **single animated GIF tiled across the entire viewport** as its atmosphere layer. There are **no WebGL shaders, no canvas elements, no SVG filters, and no CSS keyframe grain animations**. It's elegantly simple.

### Exact Implementation

```html
<div class="framer-9iky3h" data-framer-name="Grain Overlay">
  <div style="
    position: absolute;
    border-radius: inherit;
    top: 0; right: 0; bottom: 0; left: 0;
    background-image: url(https://framerusercontent.com/images/kelEr6s1qyt801dQcO45jKcaNkk.gif?width=480&height=360);
    background-repeat: repeat;
    background-position: center;
    border: 0;
    background-size: 240px auto;
  "></div>
</div>
```

### CSS Properties on the Grain Container

```css
.framer-9iky3h {
  mix-blend-mode: lighten;
  opacity: 0.05;
  pointer-events: none;
  will-change: filter;               /* GPU-accelerated */
  z-index: 10;                       /* sits on top of all content */
  flex: none;
  position: absolute;
  inset: 0;                          /* covers entire viewport */
  overflow: hidden;
}
```

### How It Works
- The animated GIF contains randomised noise frames that loop infinitely
- `mix-blend-mode: lighten` means only lighter pixels from the grain show through (subtle light specks on dark bg)
- `opacity: 0.05` keeps it extremely subtle — barely perceptible but adds analog texture
- `pointer-events: none` ensures it doesn't interfere with interactions
- `position: absolute; inset: 0` covers the **entire page**, not just the hero
- The GIF tiles at `240px auto` for dense, seamless coverage

### Grain GIF URL
```
https://framerusercontent.com/images/kelEr6s1qyt801dQcO45jKcaNkk.gif
```
(480×360 animated GIF, tiled at 240px width — standard Framer noise overlay component)

---

## 2. Color System & Design Tokens

### Core Palette
| Token | Value | Role |
|-------|-------|------|
| `--token-61e5ee56` | `#101010` / `rgb(16, 16, 16)` | **Primary background** (near-black) |
| `--token-914f4a2b` | `#455EFF` / `rgb(69, 94, 255)` | **Accent blue/indigo** |
| `--token-2546f2ec` | `#FFFFFF` / `rgb(255, 255, 255)` | White (text, borders) |
| `--token-aa00c859` | `#A0A0A0` / `rgb(160, 160, 160)` | Secondary text |
| `--token-0e5b1d38` | `#707070` / `rgb(112, 112, 112)` | Tertiary/muted borders |
| `--token-4cfb3a28` | `rgb(64, 64, 64)` | Subtle text |
| `--token-4e9ee025` | `rgb(230, 230, 230)` | Light text/headings |
| `--token-14022b6a` | `rgb(25, 26, 29)` | Near-black variant |
| `--token-6e5896a9` | `rgb(0, 255, 0)` | Terminal green accent |
| `--token-5d0f4c1a` | `rgb(2, 108, 6)` | Dark green |

### Background Declaration
```css
html body {
  background: var(--token-61e5ee56, rgb(16, 16, 16));
}
```

---

## 3. Gradient Effects

### Blue Accent Gradients (used on section edges/highlights)
```css
/* Bottom-right blue glow */
linear-gradient(228deg, #455eff00 63%, #455EFF 100%)

/* Stronger bottom-right variant */
linear-gradient(228deg, #455eff00 74%, #455EFF 100%)

/* Top-left blue glow */
linear-gradient(233deg, #455EFF 0%, #455eff00 25%)

/* Dark fade overlay (content readability) */
linear-gradient(#0000 0%, #000000a6 100%)
```

These create subtle blue light bleeds at diagonal corners — giving the impression of ambient blue light sources.

---

## 4. Glow & Shadow Effects

### Box Shadows
```css
/* White CTA glow (on hover/focus) */
box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.75);

/* Green glow (terminal aesthetic, likely animated from 0 opacity) */
box-shadow: 0px 0px 12px 0px rgba(0, 255, 0, 0);
```

### Text Shadow
```css
/* Subtle white text glow */
text-shadow: 0 0 16px #ffffff40;
```

### Backdrop Blur
```css
/* Used on navigation and floating elements */
backdrop-filter: blur(10px);
```

---

## 5. Card Borders & Surfaces

### Card Border Styles
```css
/* Primary card borders */
--border-color: rgba(255, 255, 255, 0.2);   /* 20% white — most cards */
--border-color: rgba(255, 255, 255, 0.5);   /* 50% white — highlighted cards */
--border-color: #fff6;                       /* ~40% white shorthand */
--border-width: 1px;
--border-style: solid;

/* Section divider borders */
--border-color: var(--token-0e5b1d38, #707070);   /* Muted gray */
--border-color: var(--token-2546f2ec, #fff);       /* Pure white */
```

### Semi-Transparent Surface Colors
```css
background-color: #ffffff1a;   /* ~10% white — card glass surface */
background-color: #ffffff4d;   /* ~30% white — elevated elements */
```

---

## 6. Scroll-Reveal Animations (Framer Motion)

All section content uses **spring-based appear animations** triggered on scroll:

### Standard Fade-Up
```json
{
  "initial": {
    "opacity": 0.001,
    "y": 32,
    "scale": 1
  },
  "animate": {
    "opacity": 1,
    "y": 0,
    "scale": 1,
    "transition": {
      "type": "spring",
      "damping": 100,
      "stiffness": 400,
      "mass": 1,
      "delay": 0.5
    }
  }
}
```

### Card Scale-In
```json
{
  "initial": {
    "opacity": 1,
    "scale": 0.8
  },
  "animate": {
    "opacity": 1,
    "scale": 1,
    "transition": {
      "type": "spring",
      "damping": 100,
      "stiffness": 400,
      "mass": 1,
      "delay": 0
    }
  }
}
```

**Key motion parameters**: `damping: 100`, `stiffness: 400`, `mass: 1` — this produces a crisp, snappy spring with minimal overshoot (feels precise and "engineered", not bouncy).

---

## 7. Typography

- **Primary font**: Inter (loaded from Framer CDN, weights 300-900, italic variants)
- **Secondary/fallback**: Helvetica Neue Medium
- **Monospace elements**: Terminal-style `>_` prefix on headings suggests a console aesthetic

---

## 8. Summary: TradeBetter's Visual DNA

| Layer | Technique | Complexity |
|-------|-----------|------------|
| **Grain/atmosphere** | Animated GIF overlay, mix-blend-mode: lighten, 5% opacity | Very simple |
| **Color** | Near-black (#101010) + indigo accent (#455EFF) + white | Minimal palette |
| **Gradients** | Diagonal blue bleeds at ~228-233° | CSS only |
| **Depth** | backdrop-filter: blur(10px), white-border glassmorphism | CSS only |
| **Glow** | Box-shadow (white/green), text-shadow | CSS only |
| **Motion** | Framer Motion springs (damping:100, stiffness:400) | Library-dependent |
| **Canvas/WebGL** | **NONE** | N/A |

**Verdict**: TradeBetter achieves its premium dark atmosphere through remarkably simple CSS techniques layered together. The grain overlay does the heavy lifting for "analog premium" feel.

---

---

# Liquid Metal Card Effects — Research & Recommendations

## Technique Comparison for "Liquid Metal" Card Finish

### Option A: Pure CSS Multi-Stop Metallic Gradient (Recommended for TradeBetter harmony)

The most performance-friendly approach. Uses carefully placed gradient stops to simulate metallic light reflections.

```css
.liquid-metal-card {
  background: linear-gradient(
    135deg,
    #1a1a2e 0%,
    #16213e 15%,
    #2c3e6b 25%,
    #455eff 35%,      /* TradeBetter accent blue */
    #1a1a2e 50%,
    #2c3e6b 65%,
    #455eff 75%,
    #16213e 85%,
    #1a1a2e 100%
  );
  border: 1px solid rgba(69, 94, 255, 0.3);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

/* Animated shimmer sweep */
.liquid-metal-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.08) 45%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.08) 55%,
    transparent 60%
  );
  transform: translateX(-100%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

**Pros**: Zero dependencies, matches TradeBetter palette, GPU-accelerated, works everywhere  
**Cons**: Less "liquid" than WebGL, static until hovered/animated  

### Option B: CSS + Mouse-Tracking Metallic Reflection (Enhanced)

Uses CSS custom properties updated via JavaScript for a reactive metallic sheen that follows cursor movement.

```css
.liquid-metal-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  background: #101010;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.liquid-metal-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: radial-gradient(
    600px circle at var(--mouse-x) var(--mouse-y),
    rgba(69, 94, 255, 0.4),
    rgba(69, 94, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 80%
  );
  z-index: 1;
  pointer-events: none;
}

/* Metallic border glow that follows cursor */
.liquid-metal-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(
    400px circle at var(--mouse-x) var(--mouse-y),
    rgba(69, 94, 255, 0.6),
    rgba(255, 255, 255, 0.1) 40%,
    transparent 70%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

```javascript
// Mouse tracking (lightweight)
document.querySelectorAll('.liquid-metal-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});
```

**Pros**: Interactive/alive, lightweight JS, beautiful metallic border glow, cursor-reactive  
**Cons**: Requires small JS snippet, no effect on touch devices without adaptation  

### Option C: MetalliCSS Library

A dependency-free JS library (`npm i metallicss`, ~5KB) that generates environment-mapped metallic reflections using CSS `conic-gradient` and `radial-gradient` layering.

```html
<script type="module" src="https://unpkg.com/metallicss@4.0.3/dist/metallicss.min.js"></script>
<div class="metallicss" style="--convexity: 1; --metal: silver; background: #1a1a2e; border-radius: 16px;">
  Card content
</div>
```

**Pros**: Realistic 3D metallic shading, auto-adapts to size/radius/color  
**Cons**: Extra dependency, may conflict with custom styling, skeuomorphic look may clash with TradeBetter's flat/minimal aesthetic  

### Option D: WebGL Shader (Overkill for Cards)

Full fragment shader for liquid metal displacement. Uses Three.js or raw WebGL with noise functions for flowing metallic surface.

**Pros**: Most visually impressive, truly "liquid"  
**Cons**: Heavy dependency (Three.js ~150KB), GPU-intensive, complex to implement, accessibility concerns, overkill for card borders  

---

## Recommended Approach for BETTER Vision Site

### Site-Wide Atmosphere (Matching TradeBetter)

Replicate TradeBetter's exact grain overlay technique:

```css
/* 1. Global grain overlay — fixed position, covers entire page */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  mix-blend-mode: lighten;
  opacity: 0.05;
  overflow: hidden;
}

.grain-overlay::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise-grain.gif');  /* Generate or use similar animated noise GIF */
  background-repeat: repeat;
  background-position: center;
  background-size: 240px auto;
}
```

Alternative if you don't want to host a GIF — use CSS-generated grain with SVG feTurbulence:

```css
.grain-overlay::after {
  content: "";
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.05;
  mix-blend-mode: lighten;
  pointer-events: none;
  z-index: 9999;
  animation: grain 8s steps(10) infinite;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0) }
  10% { transform: translate(-5%, -10%) }
  20% { transform: translate(-15%, 5%) }
  30% { transform: translate(7%, -25%) }
  40% { transform: translate(-5%, 25%) }
  50% { transform: translate(-15%, 10%) }
  60% { transform: translate(15%, 0%) }
  70% { transform: translate(0%, 15%) }
  80% { transform: translate(3%, 15%) }
  90% { transform: translate(-10%, 10%) }
}
```

### Liquid Metal Cards (Recommended: Option B with TradeBetter palette)

Use the **mouse-tracking radial gradient approach** with TradeBetter's `#455EFF` accent. This creates:
- A metallic blue sheen that follows the cursor
- An illuminated border glow effect
- Maintains the dark, minimal aesthetic
- Zero external dependencies (just a few lines of JS for cursor tracking)

### Accent Gradients (Section Atmosphere)

Add diagonal blue light bleeds matching TradeBetter's 228-233° gradients:

```css
.section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(228deg, transparent 63%, rgba(69, 94, 255, 0.15) 100%);
  pointer-events: none;
}
```

### Motion System

Use Framer Motion (if React) or CSS spring equivalents:
- Scroll-reveal: fade-up from `y: 32px` to `y: 0`, `opacity: 0 → 1`
- Spring config: `damping: 100, stiffness: 400, mass: 1` (snappy, no bounce)
- Card entrances: scale from `0.8 → 1.0`
- Stagger delays: `0.5s` base

---

## Summary Decision Matrix

| Effect | Recommendation | Matches TradeBetter? |
|--------|---------------|---------------------|
| Site grain overlay | Animated GIF with mix-blend-mode: lighten @ 5% opacity | ✅ Exact match |
| Background | `#101010` near-black | ✅ Exact match |
| Accent color | `#455EFF` indigo | ✅ Exact match |
| Card liquid metal | CSS radial-gradient + cursor tracking (Option B) | ✅ Harmonious upgrade |
| Section gradients | Diagonal blue bleeds at 228-233° | ✅ Exact match |
| Glassmorphism | `backdrop-filter: blur(10px)` + white border @ 20% opacity | ✅ Exact match |
| Motion | Spring animations (damping:100, stiffness:400) | ✅ Exact match |
| Text glow | `text-shadow: 0 0 16px #ffffff40` | ✅ Exact match |
