# UI Style Guide 🎨

This document defines the visual design system and component patterns for the ChainStamps frontend.

## Color Palette

### Primary Colors
- **Stacks Blue**: `#5546FF` (Primary actions, branding)
- **Bitcoin Orange**: `#F7931A` (Accents, highlights)

### Semantic Colors
- **Success**: `#10B981` (Green-500)
- **Error**: `#EF4444` (Red-500)
- **Warning**: `#F59E0B` (Amber-500)
- **Info**: `#3B82F6` (Blue-500)

### Backgrounds & Neutrals
- **Dark Mode Background**: `#0F172A` (Slate-950)
- **Card Background**: `#1E293B` (Slate-800)
- **Border**: `#334155` (Slate-700)
- **Text Primary**: `#F8FAFC` (Slate-50)
- **Text Secondary**: `#94A3B8` (Slate-400)

## Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Headings**: Semi-bold, tight tracking
- **Body**: Regular, relaxed line height
- **Monospace**: JetBrains Mono (for hashes and addresses)

## Layout & Grids

- **Max Width**: `1280px` (7xl)
- **Padding**: `1rem` on mobile, `2rem` on desktop
- **Gap**: `1.5rem` between grid items

## Components

### Buttons
- **Primary**: Solid background, white text, 8px border radius.
- **Secondary**: Outlined or subtle background.
- **Ghost**: Transparent background, active hover state.

### Cards
- Rounded corners (`12px`)
- Subtle border (`1px solid var(--border)`)
- Background: `var(--card-bg)`

### Feedback
- **Toasts**: Floating notifications at the top or bottom right.
- **Skeletons**: Pulsing loaders for asynchronous data fetching.

## Animations

- **Transitions**: `150ms ease-in-out` for hover states.
- **Page Transitions**: Framer Motion `opacity` and `y` offset.
- **Scale**: `0.98` on click/press for interactive elements.
