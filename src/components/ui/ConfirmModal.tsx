import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "./Button"
import { AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title = "Confirm Deletion", message = "Are you sure you want to delete this?" }: ConfirmModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 w-full max-w-[360px] rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 p-8"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 text-center mb-2">
              {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8 leading-relaxed">
              {message}
            </p>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="destructive" 
                className="h-12 w-full rounded-2xl font-bold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                onClick={() => {
                  console.log("delete clicked");
                  onConfirm();
                  onClose();
                }}
              >
                Yes, Delete
              </Button>
              <Button 
                variant="outline" 
                className="h-12 w-full rounded-2xl font-bold border-slate-200 dark:border-slate-800"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
