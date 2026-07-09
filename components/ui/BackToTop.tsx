import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  label: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({ label }) => {
  const [isNarrow, setIsNarrow] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // narrow device breakpoint: width < 768px (Tailwind md breakpoint)
      setIsNarrow(window.innerWidth < 768);
    };

    const handleScroll = () => {
      // Check if scroll position is past the viewport height
      const isPastViewport = window.scrollY > window.innerHeight;
      setShowButton(isPastViewport);
    };

    // Initial evaluation
    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Only show the button when on a narrow device and scrolled past viewport height
  const isVisible = isNarrow && showButton;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="back-to-top-button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[99] flex items-center justify-center p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 border border-indigo-500/10"
          title={label}
          aria-label={label}
        >
          <ArrowUp size={20} className="stroke-[2.5]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
