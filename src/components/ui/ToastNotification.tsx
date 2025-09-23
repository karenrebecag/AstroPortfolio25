"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, ChevronDown } from 'lucide-react';
import { DitheringShader } from '../three/DitheringShader';

interface ToastNotificationProps {
  isVisible?: boolean;
  onClose?: () => void;
  onOpenMessage?: () => void;
}

export function ToastNotification({ 
  isVisible = true, 
  onClose, 
  onOpenMessage 
}: ToastNotificationProps) {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(isVisible);
  }, [isVisible]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleOpenMessage = () => {
    onOpenMessage?.();
  };

  if (!mounted) return null;

  const toastContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ 
            opacity: 0, 
            y: 120, 
            x: 100,
            scale: 0.7,
            rotate: 5
          }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            x: 0,
            scale: 1,
            rotate: 0
          }}
          exit={{ 
            opacity: 0, 
            y: 120, 
            x: 100,
            scale: 0.7,
            rotate: -5
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
            duration: 0.8
          }}
          className="fixed bottom-6 right-6 z-50 w-80 hidden md:block"
        >
          {/* Toast Container */}
          <div className={`${isHovered ? 'toast-container' : 'toast-compact'} relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-sm`}>
            {/* Purple Wave Background */}
            <div className="absolute inset-0 z-0">
              <DitheringShader
                width={320}
                height={280}
                colorBack="#2d2d2d"
                colorFront="#000000"
                shape="wave"
                type="8x8"
                pxSize={2}
                speed={0.4}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 z-10 bg-black/20" />

            {/* Content */}
            <div className="toast-content relative z-20">
              {!isHovered ? (
                /* Compact Notification View */
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center gap-3 cursor-pointer flex-1 clickable"
                    onClick={() => setIsHovered(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Avatar with notification badge */}
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20"
                      >
                        <img
                          src="/images/MeToast.webp"
                          alt="Karen Ortiz"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      {/* Notification Badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">1</span>
                      </div>
                    </div>

                    {/* Compact Info */}
                    <div>
                      <h4 className="text-white font-secondary font-semibold text-sm leading-tight">
                        New Message
                      </h4>
                      <p className="text-white/70 text-xs font-primary">
                        Click to read
                      </p>
                    </div>
                  </motion.div>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors clickable"
                  >
                    <X size={12} />
                  </motion.button>
                </div>
              ) : (
                /* Expanded Message View */
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.4, 0.0, 0.2, 1],
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2 }
                  }}
                >
                  {/* Header with Avatar and Buttons */}
                  <div className="toast-header flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20"
                      >
                        <img
                          src="/images/MeToast.webp"
                          alt="Karen Ortiz"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* User Info */}
                      <div>
                        <h4 className="text-white font-secondary font-semibold text-base leading-tight">
                          Karen Ortiz
                        </h4>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Collapse Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsHovered(false)}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors clickable"
                      >
                        <ChevronDown size={14} />
                      </motion.button>

                      {/* Close Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors clickable"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Message Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      delay: isHovered ? 0.1 : 0,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="toast-message"
                  >
                    <p className="text-white font-primary text-sm leading-relaxed">
                      Hey! 👋 Thanks for checking out my portfolio. I'd love to hear about your project and discuss how we can work together!
                    </p>
                  </motion.div>

                  {/* Action Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      delay: isHovered ? 0.2 : 0,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      scale: 1.01, 
                      y: -1,
                      backgroundColor: "rgba(255,255,255,0.15)"
                    }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleOpenMessage}
                    className="toast-button clickable w-full bg-white/8 hover:bg-white/12 backdrop-blur-sm  rounded-lg text-white/90 font-primary font-normal text-xs transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={14} />
                    Send Message
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Subtle border glow */}
            <div className="absolute inset-0 z-30  border border-white/10 pointer-events-none" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(toastContent, document.body);
}

// Add CSS styles for better padding
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .toast-container {
      padding: 12px !important;
      transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    }
    
    .toast-content {
      padding: 8px !important;
      transition: all 0.3s ease-out !important;
    }
    
    .toast-header {
      margin-bottom: 16px !important;
    }
    
    .toast-message {
      margin-bottom: 16px !important;
      padding: 0 4px !important;
    }
    
    .toast-button {
      padding: 6px 12px !important;
      transition: all 0.2s ease-out !important;
    }
    
    /* Compact notification styles */
    .toast-compact {
      padding: 8px 12px !important;
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) !important;
    }
    
    .toast-compact .toast-content {
      padding: 4px !important;
      transition: all 0.3s ease-out !important;
    }
    
    /* Smooth height transitions */
    .toast-container, .toast-compact {
      overflow: hidden !important;
    }
  `;
  document.head.appendChild(style);
}

export default ToastNotification;
