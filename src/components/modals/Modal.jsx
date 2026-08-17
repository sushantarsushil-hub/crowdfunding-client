'use client';

import React, { useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants } from '../../constants/animations';

export const Modal = ({ isOpen, onClose, title, description, children, footer, className = '' }) => {
  const generatedId = useId();
  const titleId = title ? `modal-title-${generatedId}` : undefined;
  const descId = description ? `modal-desc-${generatedId}` : undefined;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Modal Dialog Container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`relative w-full max-w-lg bg-white p-6 shadow-2xl transition-all border border-slate-100 space-y-4 rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col ${className}`}
            >
              {/* Mobile Handle Indicator */}
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto sm:hidden shrink-0" aria-hidden="true" />

              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 shrink-0">
                <div>
                  {title && (
                    <h3 id={titleId} className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p id={descId} className="text-xs text-slate-500 font-medium mt-0.5">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-2xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors -mr-1 -mt-1 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 pr-1 font-sans">{children}</div>

              {/* Modal Footer */}
              {footer && <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
