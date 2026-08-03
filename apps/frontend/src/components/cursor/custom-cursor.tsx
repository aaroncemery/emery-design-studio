"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const RING_SIZE = 32;
const DOT_SIZE = 8;

const INTERACTIVE_SELECTOR = "a, button, [role='button'], select, label";
const TEXT_FIELD_SELECTOR =
  "input:not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";
const INVERT_SELECTOR = "[data-cursor-invert]";

// Renders a second cream ring+dot, positioned via the same spring values as
// the base cursor but re-based to a fixed-rect container's own coordinate
// space, so the container's overflow:hidden clips it to exactly the hovered
// element's box. Offsets are plain arithmetic on existing motion values —
// no extra per-frame work beyond what the base cursor already does.
function InvertCursor({
  springX,
  springY,
  originX,
  originY,
  isInteractive,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  originX: number;
  originY: number;
  isInteractive: boolean;
}) {
  const localX = useTransform(springX, (v) => v - originX);
  const localY = useTransform(springY, (v) => v - originY);

  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ x: localX, y: localY }}
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
  const [isWindowActive, setIsWindowActive] = useState(true);
  const [invertRect, setInvertRect] = useState<DOMRect | null>(null);
  const invertTargetRef = useRef<Element | null>(null);
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
      // A null relatedTarget means the pointer just arrived from outside
      // the document (as opposed to bubbling from a sibling), i.e. it
      // re-entered the window.
      if (!e.relatedTarget) setIsWindowActive(true);

      const target = e.target as HTMLElement;
      setIsTextField(Boolean(target.closest(TEXT_FIELD_SELECTOR)));
      setIsInteractive(Boolean(target.closest(INTERACTIVE_SELECTOR)));

      const invertTarget = target.closest(INVERT_SELECTOR);
      if (invertTarget !== invertTargetRef.current) {
        invertTargetRef.current = invertTarget;
        setInvertRect(
          invertTarget ? invertTarget.getBoundingClientRect() : null,
        );
      }
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
    const handleScrollOrResize = () => {
      if (invertTargetRef.current) {
        setInvertRect(invertTargetRef.current.getBoundingClientRect());
      }
    };

    document.body.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 z-9999 pointer-events-none"
        style={{
          x: springX,
          y: springY,
          filter:
            "drop-shadow(0 0 1px rgba(246,244,239,0.9)) drop-shadow(0 0 2.5px rgba(246,244,239,0.55))",
        }}
        animate={{ opacity: isTextField || !isWindowActive ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute rounded-full border border-ink"
          style={{
            width: RING_SIZE,
            height: RING_SIZE,
            left: -RING_SIZE / 2,
            top: -RING_SIZE / 2,
          }}
        />
        <motion.div
          className="absolute rounded-full bg-ink"
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

      {/* Clipped to the hovered [data-cursor-invert] element's own rect
          (recomputed on hover-enter/scroll/resize, never per-frame) so the
          cream, difference-blended cursor only paints inside that block —
          outside it, the plain ink cursor above is all that's visible. */}
      {invertRect && !isTextField && isWindowActive && (
        <div
          aria-hidden
          className="fixed z-9999 pointer-events-none overflow-hidden mix-blend-difference"
          style={{
            top: invertRect.top,
            left: invertRect.left,
            width: invertRect.width,
            height: invertRect.height,
          }}
        >
          <InvertCursor
            springX={springX}
            springY={springY}
            originX={invertRect.left}
            originY={invertRect.top}
            isInteractive={isInteractive}
          />
        </div>
      )}
    </>
  );
}
