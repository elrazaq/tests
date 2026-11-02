# React Architecture Specification

**System:** Modern React E-Commerce Application  
**Target Stack:** React 19 / 18, Vite, TypeScript, CSS Modules / Tailwind CSS  
**Document Version:** 2.0.0  
**Status:** Approved  

---

## 1. Architectural Overview

The application transitions from a legacy procedural single-file script into a **Modern Component-Driven React Single-Page Application (SPA)** with unidirectional data flow, explicit state ownership, and modular separation of concerns.

```
+---------------------------------------------------------------------------------+
|                                 React App Root                                  |
|                                                                                 |
|  +---------------------------------------------------------------------------+  |
|  | Context Providers                                                         |  |
|  |  - CartProvider (Cart state, totalQuantity, totalPrice, mutations)        |  |
|  |  - ToastProvider (Notification queue, dismiss timer)                     |  |
|  |  - ModalProvider (Dialog manager for checkout & item removal)             |  |
|  +---------------------------------------------------------------------------+  |
|                                       │                                         |
|                                       ▼                                         |
|  +---------------------------------------------------------------------------+  |
|  | Component Tree                                                            |  |
|  |                                                                           |  |
|  |  [Header]                                                                 |  |
|  |    ├── BrandLogo                                                          |  |
|  |    ├── SearchBar (debounced query)                                        |  |
|  |    └── CartBadge (displays derived totalQuantity)                         |  |
|  |                                                                           |  |
|  |  [Main Content]                                                           |  |
|  |    └── ProductGrid                                                        |  |
|  |          └── ProductCard (image, info, multiple-selector, AddToCartBtn)   |  |
|  |                                                                           |  |
|  |  [Overlays / Portals]                                                     |  |
|  |    ├── CartDrawer (slide-out panel, CartItemList, CartSummary, Checkout)  |  |
|  |    │     └── CartItemRow (QuantityControl with multiples & direct input)  |  |
|  |    ├── ConfirmDialog (React Portal, handles checkout & remove confirmation)|  |
|  |    └── ToastContainer (React Portal, toast notification stack)            |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

---

## 2. Directory Structure & File Organization

```
src/
├── assets/                  # Static assets and icons
├── components/              # Reusable presentational components
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/           # ConfirmDialog implementation (Portal)
│   │   └── Toast/           # ToastContainer & ToastItem
│   ├── layout/
│   │   ├── Header.tsx       # App header with SearchBar and CartBadge
│   │   └── SearchBar.tsx    # Debounced search input
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── cart/
│       ├── CartDrawer.tsx   # Sidebar cart drawer
│       ├── CartItemRow.tsx  # Individual cart line item
│       ├── CartSummary.tsx  # Totals calculation display
│       └── QuantityControl.tsx # Step/multiple button & direct number input
├── context/                 # Application state providers
│   ├── CartContext.tsx      # Cart items, derived totals, add/remove/update
│   ├── ToastContext.tsx     # Toast dispatch and auto-dismiss lifecycle
│   └── ModalContext.tsx     # Declarative confirmation dialog triggers
├── hooks/                   # Custom business hooks
│   ├── useCart.ts           # Access cart state and actions
│   ├── useToast.ts          # Trigger toast alerts
│   ├── useConfirm.ts        # Promise-based or callback-based confirm modal
│   └── useDebounce.ts       # Debounce input for search optimization
├── services/                # API and mock data layers
│   ├── mockProducts.ts      # Product catalog seed data
│   └── productService.ts    # Async mock fetch with error handling
├── types/                   # TypeScript domain definitions
│   └── index.ts             # Product, CartItem, DialogConfig, Toast types
├── App.tsx                  # Root layout orchestration
└── main.tsx                 # React DOM mount point
```

---

## 3. Component Hierarchy & Communication Matrix

```
<App>
  ├── <Header>
  │     ├── <SearchBar />              ──> updates search filter state
  │     └── <CartBadge />              <── consumes useCart().totalQuantity
  │
  ├── <ProductGrid>
  │     └── <ProductCard />            ──> triggers useCart().addToCart()
  │                                    ──> triggers useToast().showToast()
  │
  ├── <CartDrawer>                     <── consumes useCart()
  │     ├── <CartItemRow>
  │     │     └── <QuantityControl />  ──> triggers useCart().updateQuantity()
  │     │                              ──> triggers useConfirm() if qty drops to 0
  │     └── <CartSummary>
  │           └── <CheckoutButton />   ──> triggers useConfirm() for order review
  │
  ├── <ConfirmDialogPortal />          <── consumes ModalContext
  └── <ToastPortal />                  <── consumes ToastContext
```

---

## 4. State Management & Data Contracts

### 4.1 Domain Models (`src/types/index.ts`)

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stepMultiple?: number; // Minimum order and step increment (default: 1)
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  stepMultiple: number;
}

export interface CartTotals {
  totalUniqueItems: number; // Count of distinct lines
  totalQuantity: number;    // Sum of all unit quantities
  totalPrice: number;       // Cumulative price
}

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

export interface ConfirmDialogOptions {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel?: () => void;
}
```

### 4.2 Cart Context & State Store (`src/context/CartContext.tsx`)

```typescript
interface CartContextValue {
  cart: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  totalUniqueItems: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  adjustQuantityByStep: (productId: number, direction: 1 | -1) => void;
  clearCart: () => void;
}
```

---

## 5. Architectural Benefits of React Migration

1. **Elimination of XSS Risks:** React's JSX automatically escapes strings before rendering, preventing script injection present in `innerHTML` concatenations.
2. **Deterministic UI State:** Renders are pure projections of state (`UI = f(State)`). No race conditions or DOM sync drift between header badge and cart drawer.
3. **Optimized Virtual DOM Updates:** Only mutated components re-render. Keystrokes in `SearchBar` or clicks in `QuantityControl` don't destroy and rebuild unrelated DOM trees.
4. **Declarative Dialogs & Toasts:** Modals and notifications are rendered via React Portals (`createPortal`), keeping them outside parent overflow boundaries while retaining access to context.
5. **Component Reusability & Testability:** `QuantityControl`, `Modal`, and `SearchBar` become isolated, unit-testable components with typed props.
