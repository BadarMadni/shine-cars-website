"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, UserRound, X } from "lucide-react";

interface Props {
  open: boolean;
  onSelect: (type: "company" | "individual") => void;
  onClose: () => void;
}

export default function AccountTypeModal({ open, onSelect, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">
                Choose Account <span className="gradient-text">Type</span>
              </h3>
              <button onClick={onClose}
                className="text-navy/30 hover:text-navy/60 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-navy/50 text-sm mb-6">
              Select the type of account you want to create.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => onSelect("individual")}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-crimson/50 hover:bg-crimson/5 transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-crimson/10 flex items-center justify-center">
                  <UserRound className="w-7 h-7 text-crimson" />
                </div>
                <span className="font-bold text-navy">Individual</span>
                <span className="text-navy/40 text-xs text-center">Personal account for everyday rides</span>
              </motion.button>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => onSelect("company")}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-gold/50 hover:bg-gold/5 transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-gold" />
                </div>
                <span className="font-bold text-navy">Company</span>
                <span className="text-navy/40 text-xs text-center">Business account for corporate travel</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
