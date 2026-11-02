import React from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const toastRoot = document.getElementById('toast-root') || document.body;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="toast-icon-svg" aria-hidden="true" />;
      case 'error':
        return <FiAlertCircle className="toast-icon-svg" aria-hidden="true" />;
      default:
        return <FiInfo className="toast-icon-svg" aria-hidden="true" />;
    }
  };

  return createPortal(
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`} role="status">
          <div className="toast-body">
            {renderIcon(toast.type)}
            <span className="toast-text">{toast.message}</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => removeToast(toast.id)}
            aria-label="Tutup notifikasi"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>,
    toastRoot
  );
};
