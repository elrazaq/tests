import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';

interface QuantityControlProps {
  item: CartItem;
  onUpdate: (quantity: number) => void;
  onRemoveRequest: () => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  item,
  onUpdate,
  onRemoveRequest,
}) => {
  const step = item.product.stepMultiple || 1;
  const [inputValue, setInputValue] = useState<string>(item.quantity.toString());

  useEffect(() => {
    setInputValue(item.quantity.toString());
  }, [item.quantity]);

  const handleStepDown = () => {
    const next = item.quantity - step;
    if (next <= 0) {
      onRemoveRequest();
    } else {
      onUpdate(next);
    }
  };

  const handleStepUp = () => {
    onUpdate(item.quantity + step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed <= 0) {
      // Revert input value display then prompt removal
      setInputValue(item.quantity.toString());
      onRemoveRequest();
      return;
    }

    // Align to step multiple if not already an exact multiple
    let aligned = parsed;
    if (step > 1 && parsed % step !== 0) {
      aligned = Math.round(parsed / step) * step;
      if (aligned < step) aligned = step;
    }

    setInputValue(aligned.toString());
    onUpdate(aligned);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="quantity-controls-wrapper">
      <div className="quantity-controls">
        <button
          type="button"
          className="quantity-btn"
          onClick={handleStepDown}
          aria-label={`Kurangi kuantitas sebesar ${step}`}
          title={`-${step}`}
        >
          -
        </button>

        <input
          type="number"
          className="quantity-input"
          value={inputValue}
          min={step}
          step={step}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          aria-label="Kuantitas produk"
        />

        <button
          type="button"
          className="quantity-btn"
          onClick={handleStepUp}
          aria-label={`Tambah kuantitas sebesar ${step}`}
          title={`+${step}`}
        >
          +
        </button>
      </div>

      {step > 1 && <span className="step-badge">Kelipatan {step}</span>}
    </div>
  );
};

