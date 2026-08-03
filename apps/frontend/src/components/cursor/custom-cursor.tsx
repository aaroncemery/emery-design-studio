"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const RING_SIZE = 56;
const DOT_SIZE = 14;
const RING_BORDER = 2;

const INTERACTIVE_SELECTOR = "a, button, [role='button'], select, label";
const TEXT_FIELD_SELECTOR =
  "input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";
// Opt-in for elements with substantial body text a user lingers on to read
// (currently just the homepage service rows): the dot switches to cream +
// mix-blend-difference instead of a flat opaque fill, so blend-mode
// inverts rather than averages and text underneath stays legible. Every
// other interactive element keeps the plain solid ink fill — deliberately
// not the default, since the same treatment washes out on small,
// text-dense buttons where letters dominate the circle's area instead of
// being a small detail within it.
const LENS_SELECTOR = "[data-cursor-lens]";

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

function subscribeForcedColors(onChange: () => void) {
  const mql = window.matchMedia("(forced-colors: active)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getForcedColorsSnapshot() {
  return window.matchMedia("(forced-colors: active)").matches;
}

function getForcedColorsServerSnapshot() {
  return false;
}

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const isFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );
  // Forced-colors (Windows High Contrast etc.) means the user needs the OS
  // to render the pointer plainly — bail out to the native cursor entirely
  // rather than hiding it behind our own decorative one.
  const forcedColorsActive = useSyncExternalStore(
    subscribeForcedColors,
    getForcedColorsSnapshot,
    getForcedColorsServerSnapshot,
  );
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const enabled = isFinePointer && !forcedColorsActive;
  const [isInteractive, setIsInteractive] = useState(false);
  const [isLensTarget, setIsLensTarget] = useState(false);
  const [isTextField, setIsTextField] = useState(false);
  const [isWindowActive, setIsWindowActive] = useState(true);
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
  // Reduced motion: track the raw position with no spring lag/overshoot,
  // and give every animate() below a zero-duration transition instead.
  const posX = reduceMotion ? cursorX : springX;
  const posY = reduceMotion ? cursorY : springY;
  const fadeTransition = reduceMotion ? { duration: 0 } : { duration: 0.2 };
  const scaleTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const };

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      // A null relatedTarget means the pointer just arrived from outside
      // the document (as opposed to bubbling from a sibling), i.e. it
      // re-entered the window.
      if (!e.relatedTarget) setIsWindowActive(true);

      const target = e.target as HTMLElement;
      setIsTextField(Boolean(target.closest(TEXT_FIELD_SELECTOR)));
      setIsInteractive(Boolean(target.closest(INTERACTIVE_SELECTOR)));
      setIsLensTarget(Boolean(target.closest(LENS_SELECTOR)));
    };
    // mouseleave on documentElement is the "obvious" way to catch this but
    // is unreliable across browsers right at the viewport edge. relatedTarget
    // being null on a bubbled mouseout is the more robust signal that the
    // pointer left the document entirely. blur/focus catch the case where
    // the window loses focus without any mouse movement at all (cmd+tab,
    // clicking another app) — otherwise the cursor is just left stranded at
    // its last known position with no further events to hide it.
    const handleOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setIsWindowActive(false);
    };
    const handleWindowBlur = () => setIsWindowActive(false);
    const handleWindowFocus = () => setIsWindowActive(true);

    document.body.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className={cn(
        "fixed top-0 left-0 z-9999 pointer-events-none",
        isLensTarget && "mix-blend-difference",
      )}
      style={{
        x: posX,
        y: posY,
        filter: isLensTarget
          ? undefined
          : "drop-shadow(0 0 1px rgba(246,244,239,0.9)) drop-shadow(0 0 2.5px rgba(246,244,239,0.55))",
      }}
      animate={{ opacity: isTextField || !isWindowActive ? 0 : 1 }}
      transition={fadeTransition}
    >
      <div
        className={cn(
          "absolute rounded-full",
          isLensTarget ? "border-paper" : "border-ink",
        )}
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          left: -RING_SIZE / 2,
          top: -RING_SIZE / 2,
          borderWidth: RING_BORDER,
        }}
      />
      <motion.div
        className={cn(
          "absolute rounded-full",
          isLensTarget ? "bg-paper" : "bg-ink",
        )}
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          left: -DOT_SIZE / 2,
          top: -DOT_SIZE / 2,
        }}
        animate={{ scale: isInteractive ? RING_SIZE / DOT_SIZE : 1 }}
        transition={scaleTransition}
      />
    </motion.div>
  );
}
