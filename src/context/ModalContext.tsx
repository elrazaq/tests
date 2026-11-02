import React, { createContext, useContext, useState, useCallback } from 'react';
import { DialogOptions } from '../types';

interface ModalContextType {
  activeDialog: DialogOptions | null;
  confirm: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDialog, setActiveDialog] = useState<DialogOptions | null>(null);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
  }, []);

  const confirm = useCallback((options: DialogOptions) => {
    setActiveDialog(options);
  }, []);

  return (
    <ModalContext.Provider value={{ activeDialog, confirm, closeDialog }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

