# Master Plan Milestone M0 (React Architecture)

**Milestone Identifier:** M0  
**Framework:** React 19 / 18 (Vite + TypeScript)  
**Creation Date:** 2026-11-02  
**Target:** React-Based Usability, Dialogs, Toasts, Search & Step Quantity  

---

## 1. Milestone Overview

Milestone M0 delivers the core interactive foundation using **React Component Architecture**. All legacy procedural DOM-replacement logic is replaced with declarative React state, hooks, and reusable UI components.

### Five Core M0 Deliverables:
1. **Dialog Window (React Portal):** Declarative modal for checkout confirmation and item removal.
2. **Notification System (Toast Context):** Floating toast notifications on `addToCart` with auto-dismiss.
3. **Cart Total Quantity Computation:** Memoized cumulative quantity reflected synchronously across header badge and cart summary.
4. **Search Box Component:** Controlled search input with debounced filtering and empty-state handling.
5. **Multiples & Direct Input Quantity Control:** Numeric input supporting direct editing and step multiples (+/- packs).

---

## 2. Work Breakdown Structure (React Implementation)

```
Milestone M0 (React)
├── M0-T0: React Base Setup (Vite + TS + Component Skeleton)
├── M0-T1: <ConfirmDialog /> & useConfirm Hook (Portal)
├── M0-T2: <ToastContainer /> & useToast Hook
├── M0-T3: Cart Context Derived Total Quantity
├── M0-T4: <SearchBar /> with useDebounce Hook
└── M0-T5: <QuantityControl /> with Multiples & Direct Input
```

---

### Task M0-T0: Scaffolding React Application Skeleton
- **Goal:** Set up clean React project structure with TypeScript.
- **Action Items:**
  1. Initialize Vite React TypeScript project.
  2. Configure `src/types/index.ts` with domain interfaces (`Product`, `CartItem`, `CartTotals`).
  3. Create mock catalog service `services/productService.ts`.

---

### Task M0-T1: Create Confirmation Dialog Window (React Portal)

#### 1. Problem & Context
Legacy code uses blocking `alert()` on checkout and silently removes cart items with no confirmation. In React, dialogs must be non-blocking, accessible, styled, and rendered cleanly through `ReactDOM.createPortal`.

#### 2. React Design
- **Hook & Context:** `ModalContext` exposing `confirm({ title, message, confirmText, onConfirm })`.
- **Component:** `<ConfirmDialog />` rendered at `#modal-root` via `createPortal`.
- **Keyboard & Click:** Handles `Esc` key and backdrop click to cancel.
- **Use Cases:**
  1. **Checkout Action:**
     ```tsx
     const handleCheckout = () => {
       confirm({
         title: 'Konfirmasi Checkout',
         message: `Anda akan membeli ${totalQuantity} barang dengan total NT$ ${totalPrice.toLocaleString()}. Lanjutkan?`,
         confirmText: 'Bayar Sekarang',
         onConfirm: () => processCheckout()
       });
     };
     ```
  2. **Item Removal Action:** Triggered when clicking remove or when quantity reaches 0:
     ```tsx
     const handleRemoveItem = (item: CartItem) => {
       confirm({
         title: 'Hapus Barang',
         message: `Hapus "${item.product.name}" dari keranjang belanja?`,
         confirmText: 'Hapus',
         variant: 'danger',
         onConfirm: () => removeFromCart(item.product.id)
       });
     };
     ```

#### 3. Acceptance Criteria
- [ ] Dialog renders outside parent DOM hierarchy via React Portal.
- [ ] Checkout triggers styled confirmation with order summary before final execution.
- [ ] Removing an item prompts confirmation; canceling leaves cart unchanged.
- [ ] Native `alert()` and `confirm()` are completely removed.

---

### Task M0-T2: Create Notification System on Adding to Cart (Toast Context)

#### 1. Problem & Context
Currently, adding an item provides zero visual feedback in the viewport. Users require an immediate, unobtrusive confirmation banner.

#### 2. React Design
- **State:** `ToastContext` maintaining `toasts: ToastMessage[]`.
- **Hook:** `useToast()` providing `showToast(message, type = 'success', duration = 3000)`.
- **Component:** `<ToastContainer />` rendering a stack of animated `<ToastItem />` elements in a React Portal.
- **Integration with Cart:**
  ```tsx
  // Inside ProductCard.tsx or useCart hook
  const handleAddToCart = (product: Product, qty: number) => {
    addToCart(product, qty);
    showToast(`Berhasil menambahkan ${qty}x "${product.name}" ke keranjang!`, 'success');
  };
  ```

#### 3. Acceptance Criteria
- [ ] Clicking "Tambah ke Keranjang" fires a toast with product name and quantity.
- [ ] Toast auto-dismisses after 3 seconds via `setTimeout` and cleanup in `useEffect`.
- [ ] Multiple fast clicks stack toasts cleanly without overlapping.

---

### Task M0-T3: Count Total Quantity for User's Shopping Cart

#### 1. Problem & Context
The cart sidebar only displays subtotal monetary price (`總計: NT$ XXX`). Total quantity is computed ad-hoc only for the header icon. Both locations must be derived reactively from a single state source.

#### 2. React Design
- **State Derivation in `CartContext.tsx`:**
  ```tsx
  const totals = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity;
        acc.totalPrice += item.product.price * item.quantity;
        acc.totalUniqueItems += 1;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0, totalUniqueItems: 0 }
    );
  }, [cart]);
  ```
- **Component Consumers:**
  1. `<CartBadge count={totals.totalQuantity} />` inside `<Header />`.
  2. `<CartSummary totalQuantity={totals.totalQuantity} totalPrice={totals.totalPrice} />` inside `<CartDrawer />`.

#### 3. Acceptance Criteria
- [ ] `totalQuantity` sums all item units (`2 * ItemA + 3 * ItemB = 5 total units`).
- [ ] Header badge and drawer summary stay in synchronization on every addition, deletion, or step change.
- [ ] Empty state properly indicates `0 barang` without negative or NaN values.

---

### Task M0-T4: Add Search Box for Product Discovery

#### 1. Problem & Context
Search logic existed as orphaned JavaScript in `index.html` without any `<input>` element in the UI. Keystrokes previously re-rendered the whole DOM without debouncing.

#### 2. React Design
- **Custom Hook:** `useDebounce(value, delay = 300)`.
- **Component:** `<SearchBar value={searchQuery} onChange={setSearchQuery} />` in `<Header />`.
- **Catalog Filtering:**
  ```tsx
  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim()) return products;
    const lower = debouncedQuery.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(lower));
  }, [products, debouncedQuery]);
  ```
- **Empty State:** If `filteredProducts.length === 0`, display `<EmptyState onReset={() => setSearchQuery('')} />`.

#### 3. Acceptance Criteria
- [ ] Search input is clearly visible and responsive in `<Header />`.
- [ ] Input is debounced by 300ms; typing does not trigger lag or flickering.
- [ ] Empty search result renders a helpful "Tidak ada produk yang cocok" card with a reset action.
- [ ] Clearing search input instantly restores the full catalog.

---

### Task M0-T5: Fix Quantity Couldn't Update by Multiples & Direct Input

#### 1. Problem & Context
Legacy code locked quantity in a static `<span>`, only allowing `+1` / `-1` increments. Users could not type quantities directly or purchase in multiples/pack steps (e.g., box of 5).

#### 2. React Design
- **Component:** `<QuantityControl />`
  ```tsx
  interface QuantityControlProps {
    quantity: number;
    stepMultiple?: number; // Default 1, or bulk pack multiple (e.g. 5)
    min?: number;
    max?: number;
    onUpdate: (newQuantity: number) => void;
    onRequestRemove: () => void;
  }
  ```
- **Features:**
  1. **Direct Input:** `<input type="number" value={localQty} onBlur={handleCommit} onChange={handleChange} />`.
  2. **Step Buttons:**
     - `[-]`: Decrements by `stepMultiple`. If `newQty < min` or `0`, invokes `onRequestRemove()` to open confirmation dialog (M0-T1).
     - `[+]`: Increments by `stepMultiple`.
  3. **Multiple Clamping:** Enforces that quantity is aligned to `stepMultiple` (e.g., if step is 5, rounds 12 -> 15 or preserves step integrity).

#### 3. Acceptance Criteria
- [ ] User can click `+` / `-` to adjust quantity by defined multiples/steps.
- [ ] User can type exact quantities directly into the number input.
- [ ] Manual input of `0` or negative value triggers the confirmation removal dialog.
- [ ] Totals recompute instantly on value commit.

---

## 3. Component & State Implementation Matrix

| Task | Primary React Component | State / Hook | Deliverable File |
|---|---|---|---|
| **M0-T0** | `<App />` | Root Setup | `src/App.tsx`, `src/types/index.ts` |
| **M0-T1** | `<ConfirmDialog />` | `useConfirm()`, `ModalContext` | `src/components/common/Modal/ConfirmDialog.tsx` |
| **M0-T2** | `<ToastContainer />` | `useToast()`, `ToastContext` | `src/components/common/Toast/ToastContainer.tsx` |
| **M0-T3** | `<CartBadge />`, `<CartSummary />` | `useCart().totals` | `src/components/cart/CartSummary.tsx` |
| **M0-T4** | `<SearchBar />` | `useDebounce()`, local state | `src/components/layout/SearchBar.tsx` |
| **M0-T5** | `<QuantityControl />` | `useState`, `useCart().updateQuantity` | `src/components/cart/QuantityControl.tsx` |

---

## 4. Verification & Testing Checklist

- [ ] `npm run build` / `vite build` completes with zero TypeScript errors.
- [ ] Adding products triggers `<ToastContainer />` with correct name and unit count.
- [ ] Direct input on `<QuantityControl />` updates state without losing focus.
- [ ] Step multiple increment/decrement works for products with `stepMultiple > 1`.
- [ ] Removing an item or reducing quantity to 0 triggers `<ConfirmDialog />` portal.
- [ ] Clicking checkout opens confirmation modal with total item units and subtotal price.
- [ ] `<SearchBar />` filters products with 300ms debounce and displays empty state on zero matches.
