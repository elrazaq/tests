import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { useModal } from '../context/ModalContext';

export const ConfirmModal: React.FC = () => {
  const { activeDialog, closeDialog } = useModal();

  useEffect(() => {
    if (!activeDialog) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDialog.onCancel) activeDialog.onCancel();
        closeDialog();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDialog, closeDialog]);

  if (!activeDialog) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  const handleConfirm = () => {
    activeDialog.onConfirm();
    closeDialog();
  };

  const handleCancel = () => {
    if (activeDialog.onCancel) activeDialog.onCancel();
    closeDialog();
  };

  return createPortal(
    <div className="modal-backdrop" onClick={handleCancel} role="presentation">
      <div
        className="modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {activeDialog.title}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleCancel}
            aria-label="Tutup dialog"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="modal-content">{activeDialog.message}</div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            {activeDialog.cancelText || 'Batal'}
          </button>
          <button
            type="button"
            className={`btn ${activeDialog.variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {activeDialog.confirmText || 'Konfirmasi'}
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};
