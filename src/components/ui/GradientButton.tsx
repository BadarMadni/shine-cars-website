"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "crimson" | "gold" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  crimson: "bg-gradient-to-r from-crimson to-crimson-dark text-white hover:shadow-[0_0_30px_rgba(204,34,41,0.4)]",
  gold: "bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-[0_0_30px_rgba(245,166,35,0.4)]",
  outline: "border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60",
};

const sizes = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-base",
  lg: "px-10 py-4.5 text-lg",
};

export default function GradientButton({
  children,
  href,
  onClick,
  variant = "crimson",
  size = "md",
  className = "",
}: GradientButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 cursor-pointer ${variantStyles[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="inline-block"
      >
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
