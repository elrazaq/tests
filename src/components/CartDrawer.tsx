import React, { useEffect } from 'react';
import { FiShoppingCart, FiTrash2, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import { QuantityControl } from './QuantityControl';
import { CartItem } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    totals,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();
  const { confirm } = useModal();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  const requestRemoveItem = (item: CartItem) => {
    confirm({
      title: 'Hapus Produk dari Keranjang',
      message: (
        <div>
          <p>
            Apakah Anda yakin ingin menghapus <strong>{item.product.name}</strong>{' '}
            dari keranjang belanja?
          </p>
          <p className="modal-subtext">
            Kuantitas saat ini: {item.quantity} unit
          </p>
        </div>
      ),
      variant: 'danger',
      confirmText: 'Hapus Produk',
      cancelText: 'Kembali',
      onConfirm: () => {
        removeFromCart(item.product.id);
        showToast(`"${item.product.name}" dihapus dari keranjang`, 'info');
      },
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Keranjang belanja Anda masih kosong', 'warning');
      return;
    }

    confirm({
      title: 'Konfirmasi Pesanan Checkout',
      message: (
        <div className="checkout-summary-box">
          <p className="summary-headline">
            Ringkasan Pesanan Pembelian:
          </p>
          <ul className="checkout-items-list">
            {cart.map((item) => (
              <li key={item.product.id} className="checkout-item-line">
                <span>{item.product.name} &times; {item.quantity}</span>
                <span>NT$ {(item.product.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="checkout-totals-row">
            <span>Total Kuantitas: <strong>{totals.totalQuantity} unit</strong> ({totals.totalUniqueItems} jenis)</span>
            <span className="checkout-grand-total">
              Total Pembayaran: NT$ {totals.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      ),
      confirmText: 'Konfirmasi & Bayar',
      cancelText: 'Periksa Lagi',
      variant: 'primary',
      onConfirm: () => {
        clearCart();
        closeCart();
        showToast(
          `Checkout berhasil! Total ${totals.totalQuantity} barang telah diproses.`,
          'success',
          4000
        );
      },
    });
  };

  return (
    <>
      <div
        className={`drawer-backdrop ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Keranjang Belanja"
      >
        <div className="cart-header">
          <div className="cart-title-group">
            <h2 className="cart-heading">Keranjang Belanja</h2>
            <span className="cart-subtitle-count">
              {totals.totalQuantity} total unit
            </span>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Tutup keranjang"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <FiShoppingCart className="empty-cart-icon" aria-hidden="true" />
              <p className="empty-cart-text">Keranjang belanja Anda masih kosong</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={closeCart}
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-item-row">
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.product.name}</h4>
                    <div className="cart-item-price-tag">
                      NT$ {item.product.price.toLocaleString()}
                      <span className="subtotal-calc">
                        / unit &bull; Subtotal: NT${' '}
                        {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <QuantityControl
                      item={item}
                      onUpdate={(qty) => updateQuantity(item.product.id, qty)}
                      onRemoveRequest={() => requestRemoveItem(item)}
                    />
                  </div>

                  <button
                    type="button"
                    className="item-remove-btn"
                    onClick={() => requestRemoveItem(item)}
                    aria-label={`Hapus ${item.product.name}`}
                    title="Hapus barang"
                  >
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-card">
              <div className="summary-row">
                <span className="summary-label">Total Jenis Barang:</span>
                <span className="summary-value">{totals.totalUniqueItems} jenis</span>
              </div>
              <div className="summary-row highlight">
                <span className="summary-label">Total Kuantitas:</span>
                <span className="summary-value" id="cartTotalQuantity">
                  {totals.totalQuantity} unit
                </span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Total Pembayaran:</span>
                <span className="summary-total-price" id="cartTotalPrice">
                  NT$ {totals.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Checkout ({totals.totalQuantity} unit)
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
