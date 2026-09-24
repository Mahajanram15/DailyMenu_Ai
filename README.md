# DailyMenu AI ⚡
### *The Next-Gen Food Stall Operating System — AI Dynamic Menus & Smart Token Queues*

> **Linear + Vercel + Stripe-grade SaaS application** built for India's 10M+ food stalls, chaat centers, cloud kitchens, and campus canteens. Eliminates food waste and counter congestion by turning morning ingredient photos into dynamic, multilingual menus with real-time token tracking.

---

## 🌟 Key Highlights & Capabilities

1. **AI Vision & Photo Menu Synthesis**
   - Snap a photo of vegetable crates, dairy crates, handwritten chalkboards, or stock sheets.
   - Neural engine analyzes yield, generates appetizing multilingual descriptions (**Marathi, Hindi & English**), and recommends optimal pricing for zero evening leftover waste.

2. **Contactless QR Ordering & Direct UPI**
   - Diners scan table/counter QR standees with their phone camera.
   - Pure mobile-first storefront with instant category filters, search, multi-language switcher, and direct UPI settlement.

3. **Smart Token Queue Engine & Live Tracking**
   - Automatically issues digital tokens (e.g. `#A24`).
   - Live queue status tracking on customer phones showing orders ahead and countdown wait times.
   - Real-time cross-tab synchronization with audio announcements and confetti on pickup.

4. **Kitchen Display System (KDS)**
   - 4-column live ticket Kanban (`NEW`, `PREPARING`, `READY`, `COMPLETED`) with ticking live elapsed timers.
   - Status transitions in KDS broadcast instantly to customer tracking screens in real time.

5. **Big-Screen TV Token Board (`/vendor/queue`)**
   - Public display board designed for smart TVs and Android tablets mounted above food counters.
   - High-contrast glowing token numbers and chime callouts.

6. **Analytics & Waste Intelligence**
   - Hourly rush heatmaps, peak load indicators, Average Order Value (AOV), and AI demand forecasts.

---

## 🚀 Live Judge Demo Script (Step-by-Step)

```
1. LANDING PAGE (/)
   ├── Spectacular Hero with animated statistics & dual interactive mockups
   ├── 6-Stage Interactive AI Pipeline (PHOTO → AI → MENU → ORDER → TOKEN → READY)
   └── Click "Start Free Today" or "Live Demo Stall"

2. VENDOR CONSOLE (/vendor)
   ├── Real-time turnover metrics & zero-waste score
   ├── Quick Actions: "Generate Menu"
   ├── Select sample stock or upload ingredient photo
   ├── Watch optical laser scan & 5-stage neural processing
   └── Review yield margins & click "Save & Publish Menu"

3. TABLE QR STANDEES (/vendor/qr)
   ├── High-res printable acrylic table standee preview
   ├── 1-click "Download Standee Image" & "Open Live Customer Menu"
   └── Click "Open Live Customer Menu"

4. CUSTOMER STOREFRONT (/customer/chai-chaat-koramangala)
   ├── Switch language between English, मराठी (Marathi), and हिन्दी (Hindi)
   ├── Add dishes to tray with smooth quantity controls
   ├── Open floating cart drawer, select UPI payment
   └── Click "Place Order" → Generates Token #A24

5. LIVE TOKEN TRACKING (/customer/:vendorId/order/:orderId)
   ├── High-contrast glowing Token Hero (#A24)
   ├── Shows queue position ("X orders ahead") & countdown timer
   ├── Open /vendor/orders (KDS) in another tab
   ├── Advance ticket from NEW → PREPARING → READY
   └── Customer tab receives instant live status update with celebratory confetti!
```

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Realtime Layer**: `BroadcastChannel` + `localStorage` storage events with automatic Supabase Postgres changes support
- **Design System**: Obsidian Dark palette (`#060709`), Glassmorphism (`backdrop-blur-2xl`), Radiant Emerald & Amber gradients, Metallic Skeleton shimmers, and 20 bespoke micro-animations.
- **Accessibility**: Full `@media (prefers-reduced-motion: reduce)` support and responsive layouts tested across 320px, 375px, 768px, 1024px, and 1440px+.

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

*Built with ❤️ for Bharat's fastest-moving food entrepreneurs.*
