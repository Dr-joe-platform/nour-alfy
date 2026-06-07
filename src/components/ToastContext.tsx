'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import styles from './Toast.module.css';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`${styles.toast} ${isVisible ? styles.show : ''}`}>
        {message}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
