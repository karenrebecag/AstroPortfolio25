"use client";

import React, { useState, useEffect } from 'react';
import { ToastNotification } from './ToastNotification';

interface ToastProviderProps {
  autoShow?: boolean;
  showDelay?: number;
}

export function ToastProvider({ 
  autoShow = true, 
  showDelay = 3000 
}: ToastProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Always show toast when page loads (ignore localStorage)
    if (autoShow && !hasShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasShown(true);
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, showDelay, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOpenMessage = () => {
    // Scroll to contact section or open contact modal
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Close toast after opening message
    setIsVisible(false);
  };


  return (
    <ToastNotification
      isVisible={isVisible}
      onClose={handleClose}
      onOpenMessage={handleOpenMessage}
    />
  );
}

export default ToastProvider;
