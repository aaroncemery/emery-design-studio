"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RING_SIZE = 32;
const DOT_SIZE = 8;

const INTERACTIVE_SELECTOR = "a, button, [role='button'], select, label";
const TEXT_FIELD_SELECTOR =
  "input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

function subscribeFinePointer(onChange: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getFinePointerServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const enabled = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTextField, setIsTextField] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, {
    stiffness: 500,
    damping: 40,
    mass: 0.5,
  });
  const springY = useSpring(cursorY, {
    stiffness: 500,
    damping: 40,
    mass: 0.5,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsTextField(Boolean(target.closest(TEXT_FIELD_SELECTOR)));
      setIsInteractive(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    document.body.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-9999 pointer-events-none mix-blend-difference"
      style={{ x: springX, y: springY }}
      animate={{ opacity: isTextField ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute rounded-full border border-paper"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          left: -RING_SIZE / 2,
          top: -RING_SIZE / 2,
        }}
      />
      <motion.div
        className="absolute rounded-full bg-paper"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          left: -DOT_SIZE / 2,
          top: -DOT_SIZE / 2,
        }}
        animate={{ scale: isInteractive ? RING_SIZE / DOT_SIZE : 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </motion.div>
  );
}
