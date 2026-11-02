import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import { CartProvider } from './context/CartContext';
import { INITIAL_PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ConfirmModal } from './components/ConfirmModal';
import { ToastContainer } from './components/ToastContainer';

export const AppContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const products = INITIAL_PRODUCTS;

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <div className="app-layout">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredCount={filteredProducts.length}
      />

      <main className="main-content">
        <div className="catalog-header-bar">
          <div className="catalog-info">
            <h2 className="section-title">Katalog Produk</h2>
            <p className="section-subtitle">
              Pilihan perangkat keras premium dan aksesoris pintar
            </p>
          </div>
          <div className="catalog-status">
            Menampilkan {filteredProducts.length} dari {products.length} produk
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-search-box">
            <FiSearch className="empty-icon" aria-hidden="true" />
            <h3>Tidak ditemukan produk yang cocok</h3>
            <p>
              Tidak ada produk yang mengandung kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSearchQuery('')}
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="products-grid" id="productsGrid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <p>&copy; 2026 精品商店 (Boutique Store). All rights reserved.</p>
          <p className="footer-note">React Architecture &bull; Milestone M0 Executed</p>
        </div>
      </footer>

      <CartDrawer />
      <ConfirmModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <ModalProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ModalProvider>
    </ToastProvider>
  );
};

export default App;
