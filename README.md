# 精品商店 (Boutique Store) - React E-Commerce Application

Modern Component-Driven React e-commerce application built with Vite, TypeScript, and clean CSS.

## 🚀 Milestone M0 Implementation

1. **Confirmation Dialogs**: Accessible modal dialogs via React Portal for checkout confirmation and safe item removal (replaces blocking `alert()`).
2. **Toast Notifications**: Non-blocking toast alert system confirming item addition with auto-dismiss.
3. **Synchronized Cart Quantities**: Single-source-of-truth derived state calculating total cumulative unit quantity and price across header badge and drawer summary.
4. **Product Search Component**: Real-time product search with empty state fallback and clear action.
5. **Quantity Multiples & Direct Input**: Support for pack/batch multiples (`stepMultiple`) and direct numeric editing with step alignment.
6. **React Icons**: Clean SVG icons from `react-icons/fi` replacing emojis.

## 📁 Documentation

Detailed documentation available in `docs/`:
- [`docs/AUDIT.md`](docs/AUDIT.md): Comprehensive project audit report.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): React architecture specification and data flow.
- [`docs/MASTER_PLAN_M0.md`](docs/MASTER_PLAN_M0.md): Milestone M0 master plan and task breakdown.

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build

# Run unit assertion tests
node scripts/test-m0.mjs
```
