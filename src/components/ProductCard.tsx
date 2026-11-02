import React from 'react';
import { FiPackage, FiPlus } from 'react-icons/fi';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart(product);
    const qtyAdded = product.stepMultiple || 1;
    showToast(
      `Ditambahkan: ${qtyAdded}x ${product.name} ke keranjang`,
      'success'
    );
  };

  return (
    <article className="product-card">
      <div className="product-image-container">
        <div className="product-image-placeholder">
          <span className="placeholder-category">{product.category}</span>
          <FiPackage className="placeholder-icon" aria-hidden="true" />
        </div>
        {product.stepMultiple > 1 && (
          <span className="multiple-indicator-badge">
            Paket {product.stepMultiple} Unit
          </span>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-meta">
          <span className="product-price">
            NT$ {product.price.toLocaleString()}
          </span>
          {product.stepMultiple > 1 && (
            <span className="unit-note">
              (Min. {product.stepMultiple} unit)
            </span>
          )}
        </div>

        <button
          type="button"
          className="add-to-cart-btn"
          onClick={handleAdd}
          aria-label={`Tambah ${product.name} ke keranjang`}
        >
          <FiPlus aria-hidden="true" style={{ marginRight: '6px' }} />
          Tambah ke Keranjang
        </button>
      </div>
    </article>
  );
};
