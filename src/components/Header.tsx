import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  filteredCount,
}) => {
  const { totals, toggleCart } = useCart();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-section">
          <h1 className="brand-title">精品商店</h1>
          <span className="brand-subtitle">Smart Hardware Boutique</span>
        </div>

        <div className="header-search">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            resultCount={filteredCount}
          />
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="cart-button"
            onClick={toggleCart}
            aria-label={`Buka keranjang belanja, ${totals.totalQuantity} total barang`}
          >
            <FiShoppingCart className="cart-icon" aria-hidden="true" />
            <span className="cart-label">Keranjang</span>
            <span className="cart-badge" id="cartCount">
              {totals.totalQuantity}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
