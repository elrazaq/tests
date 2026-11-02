# Project Audit Report

**Target Project:** Single-Page E-Commerce Web Prototype (`index.html`)  
**Audit Date:** 2026-11-02  
**Status:** Completed  

---

## 1. Executive Summary

The project is an experimental single-file e-commerce prototype written in pure HTML5, CSS3, and ES5 Vanilla JavaScript. It implements basic product browsing, mock asynchronous loading, cart drawer toggling, item addition, quantity adjustments, and mock checkout.

While functionally demonstrable as a basic prototype, the application exhibits severe technical debt across architecture, security, state management, UI/UX responsiveness, and code quality. The codebase contains 16 annotated defects (`問題1` to `問題16`) alongside critical unlisted issues including XSS risks, missing user-facing controls (search bar missing in HTML despite JS existing), and rigid quantity mutation logic.

---

## 2. High-Priority Vulnerabilities & Critical Bugs

### 2.1 Security: Cross-Site Scripting (XSS)
- **Location:** `index.html` lines 343-348, 373-378, 463-475
- **Mechanism:** Direct string concatenation into `element.innerHTML` using unescaped object properties (`product.name`, `product.price`).
- **Risk:** High. If product names or prices originate from an untrusted backend or user input, arbitrary scripts can execute in the victim's session.
- **Remediation:** Use `textContent` for string insertion or sanitize interpolated HTML before assigning to DOM containers.

### 2.2 Functional Disconnect: Search Logic Without UI
- **Location:** `index.html` lines 354-381
- **Defect:** Functions `searchProducts(keyword)` and `renderFilteredProducts()` exist in JavaScript, but there is no `<input type="search">` or search container anywhere in the HTML markup. The feature is completely unreachable by end users.
- **Remediation:** Add search input in the header or catalog toolbar with proper debouncing.

### 2.3 Quantity Adjustment Limitation
- **Location:** `index.html` lines 427-438
- **Defect:** `updateQuantity(productId, change)` only accepts increment/decrement step values (`+1` or `-1`). The UI renders quantity as a static `<span>` without direct input capability. Bulk purchases, pack multiples (e.g., buying in packs of 5), or direct input are unsupported.
- **Remediation:** Implement direct numeric inputs with customizable step increments and input validation.

### 2.4 Destructive Actions Without Confirmation Dialog
- **Location:** `index.html` lines 417-425, 431-433, 487-500
- **Defect:** 
  1. Decrementing quantity to zero or clicking delete instantly drops the item from the cart without confirmation.
  2. Clicking "Checkout" triggers an immediate mock timeout followed by a blocking browser native `alert()`.
- **Remediation:** Implement non-blocking modal confirmation dialogs for destructive actions and checkout intent.

---

## 3. Structural & Architectural Deficiencies

### 3.1 Monolithic Single-File Anti-Pattern
- All styling, markup, and scripting reside in one file (`index.html`).
- Tight coupling between presentation, state, business logic, and mock API calls.
- Inability to scale, unit test, or maintain independently.

### 3.2 Global Scope Pollution
- Variables declared with `var` in the global window scope (`products`, `cart`, `isLoading`).
- Functions attached directly to `window` and referenced in inline HTML attributes (`onclick="addToCart(...)"`).
- Prone to collision, accidental overwrites, and memory leakage.

### 3.3 State Management & Derived Data Desynchronization
- State is managed via mutable in-memory arrays.
- Header cart counter (`#cartCount`) counts total quantity (`totalItems`), but there is no summary counter inside the cart sidebar.
- No single source of truth for computed metrics (subtotal, total items, tax, discount).

---

## 4. UI/UX & Responsive Layout Audit

| Issue ID | Category | Description | Impact |
|---|---|---|---|
| 問題1 | CSS Layout | `.container` has hardcoded `width: 1200px` | Horizontal scroll and layout clipping on tablet/desktop viewports < 1200px. |
| 問題2 | Layout | Cart icon positioned via `float: right` | Fails inside modern flex/grid containers, collapses on narrow widths. |
| 問題3 | Responsive | `.products-grid` fixed 4-column layout (`repeat(4, 1fr)`) | Elements squeeze into unreadable columns on tablet screens. |
| 問題4 | Media Queries | Minimal media query at `768px` only | Lack of mobile breakpoints (360px-480px) and wide desktop scaling. |
| 問題5 | CSS Specificity | Over-nested selectors (`.container .products-grid .product-card .product-image`) | Unnecessary selector weight, hampers stylesheet refactoring. |
| 問題10 | UX Feedback | No visual indicator or toast when adding product | User receives zero feedback whether the click succeeded. |

---

## 5. Performance & DOM Optimization Audit

### 5.1 DOM Thrashing via `innerHTML = ''`
- In `renderProducts()`, `renderFilteredProducts()`, and `updateCartDisplay()`, entire innerHTML strings are wiped and recreated.
- Existing DOM nodes and listeners are discarded, triggering full layout reflows and repaints.
- Lacks `DocumentFragment` or keyed diffing.

### 5.2 Missing Event Delegation
- Product cards generate individual inline `onclick` handlers on each button (`onclick="addToCart(id)"`).
- Violates Content Security Policy (CSP) best practices and inflates memory usage.

### 5.3 Event Listener Leaks & Missing Debounce
- Unthrottled `window.addEventListener('resize', ...)` logs to console on every pixel change (問題14).
- Global click listener on `document` evaluates every click unconditionally without lifecycle teardown (問題16).
- Search function executes full DOM re-render per keystroke with no debouncing (問題9).

---

## 6. Code Quality & Linting Findings Matrix

| Code Tag | Location | Defect Description | Severity | Recommended Fix |
|---|---|---|---|---|
| 問題1 | L19-25 | Fixed 1200px container width | Medium | Change to `max-width: 1200px; width: 92%;` |
| 問題2 | L38-47 | Cart icon floats right | Low | Convert `.header` to `display: flex; justify-content: space-between;` |
| 問題3 | L64-70 | Fixed 4-column grid | Medium | Use `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));` |
| 問題4 | L251-262 | Incomplete mobile responsive breakpoints | Medium | Add standard mobile/tablet breakpoints (480px, 768px, 1024px) |
| 問題5 | L264-269 | Deep CSS selector nesting | Low | Flatten to class-based BEM selector `.product-card__image` |
| 問題6 | L305-309 | Global namespace pollution with `var` | High | Wrap in ES module or IIFE, use `const` / `let` |
| 問題7 | L310-332 | Mock API call lacks rejection/error handling | Medium | Wrap mock in Promise with error catch blocks |
| 問題8 | L334-351 | Repetitive DOM lookups inside render loops | Medium | Cache DOM nodes or render via `DocumentFragment` |
| 問題9 | L353-364 | Unthrottled search re-rendering whole list | Medium | Add 300ms debounce and filter caching |
| 問題10 | L414 | No feedback when adding to cart | Medium | Implement toast notification component |
| 問題11 | L440-479 | Repetitive DOM manipulation in `updateCartDisplay` | Medium | Extract template function, batch DOM updates |
| 問題12 | L486-500 | Checkout lacks loading state and uses native `alert()` | High | Build custom modal with loading spinner and status feedback |
| 問題13 | L502 | Inline event bindings on buttons | Medium | Centralize event handling with container delegation |
| 問題14 | L503-507 | Unthrottled resize listener | Low | Debounce resize or replace with CSS media queries |
| 問題15 | L509-513 | Window load lacks error handling | Low | Add try/catch and fallback error UI |
| 問題16 | L514-530 | Global click listener has no cleanup | Low | Scope listener to open cart state or cart backdrop |

---

## 7. Audit Recommendations & Priority Roadmap

1. **Phase M0 (Immediate Usability & Critical Fixes):**
   - Confirmation modals for checkout & item removal.
   - User notification toast on item addition.
   - Comprehensive cart quantity metrics display.
   - Search box UI and debounced matching.
   - Multiple/batch quantity increment support.
2. **Phase M1 (Refactoring & Architecture):**
   - Separate files: `index.html`, `css/styles.css`, `js/app.js`, `js/store.js`, `js/ui.js`.
   - Implement unidirectional data flow.
3. **Phase M2 (Security & Performance):**
   - Eliminate `innerHTML` injection paths.
   - Implement event delegation and responsive CSS Grid.

