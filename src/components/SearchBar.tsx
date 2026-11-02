import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, resultCount }) => {
  return (
    <div className="search-bar-container" role="search">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" aria-hidden="true" />
        <input
          type="search"
          className="search-input"
          placeholder="Cari produk (contoh: earphone, keyboard, usb)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Cari produk"
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onChange('')}
            aria-label="Hapus kata kunci pencarian"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>
      {value && resultCount !== undefined && (
        <span className="search-count-pill">
          {resultCount} produk ditemukan
        </span>
      )}
    </div>
  );
};
