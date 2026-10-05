import { gsap } from "gsap";

/* ============================================================
   TARGET CURSOR — vanilla JS port, scoped to a container
   ------------------------------------------------------------
   Ported from a React component (createPortal + hooks). The
   visual behaviour is unchanged — same corner-snap-to-target
   effect, same spin-when-idle animation — but two things differ
   on purpose:

     1. No React: the cursor's DOM is built with
        document.createElement and appended to <body> once.

     2. Scoped, not global: instead of listening on `window` and
        showing the cursor everywhere, everything here listens on
        a single `container` element. The custom cursor fades in
        only while the pointer is inside that container, and only
        elements matching targetSelector *inside* that container
        get the corner-snap treatment. Outside it, the page's
        normal cursor is used.

   Usage:
     const destroy = createTargetCursor(document.querySelector("#about"), {
       targetSelector: ".cursor-target",
     });
   ============================================================ */

// position: fixed is relative to the viewport UNLESS an ancestor
// establishes a containing block (transform, perspective, filter,
// matching will-change, or contain). Kept from the original so the
// cursor still tracks correctly if it ever ends up under one.
const getContainingBlock = (element) => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block) => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export function createTargetCursor(containerOrList, options = {}) {
  const {
    targetSelector = ".cursor-target",
    spinDuration = 2,
    hoverDuration = 0.2,
    parallaxOn = true,
    cursorColor = "#ffffff",
    cursorColorOnTarget,
  } = options;

  if (!containerOrList || typeof document === "undefined") return () => {};

  // Accept either one element or a list of elements (e.g. several
  // sibling <section>s that should share one cursor "zone").
  const containers =
    containerOrList instanceof Element ? [containerOrList] : Array.from(containerOrList).filter(Boolean);

  if (containers.length === 0) return () => {};

  const isInsideAnyContainer = (node) => containers.some((c) => c.contains(node));

  const hasTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUserAgent = mobileRegex.test(
    (navigator.userAgent || navigator.vendor || "").toLowerCase(),
  );
  const isMobile = (hasTouchScreen && isSmallScreen) || isMobileUserAgent;

  // No mouse to speak of — skip entirely, leave the native cursor alone.
  if (isMobile) return () => {};

  const constants = { borderWidth: 3, cornerSize: 12 };

  /* ---- build the cursor DOM ---- */
  const cursor = document.createElement("div");
  cursor.className = "target-cursor-wrapper";
  cursor.style.opacity = "0";

  const dot = document.createElement("div");
  dot.className = "target-cursor-dot";
  dot.style.backgroundColor = cursorColor;
  cursor.appendChild(dot);

  const corners = ["corner-tl", "corner-tr", "corner-br", "corner-bl"].map((cls) => {
    const el = document.createElement("div");
    el.className = `target-cursor-corner ${cls}`;
    el.style.borderColor = cursorColor;
    cursor.appendChild(el);
    return el;
  });

  document.body.appendChild(cursor);
  // Native cursor is hidden only inside the zone (see CSS), so we
  // never have to toggle document.body.style.cursor on enter/leave.
  containers.forEach((c) => c.classList.add("has-target-cursor"));

  let containingBlock = getContainingBlock(cursor);
  const getOffset = () => getContainingBlockOffset(containingBlock);

  let activeTarget = null;
  let currentLeaveHandler = null;
  let resumeTimeout = null;
  let targetCornerPositions = null;
  const activeStrength = { current: 0 };
  let spinTl = null;

  const cleanupTarget = (target) => {
    if (currentLeaveHandler) target.removeEventListener("mouseleave", currentLeaveHandler);
    currentLeaveHandler = null;
  };

  const createSpinTimeline = () => {
    if (spinTl) spinTl.kill();
    spinTl = gsap
      .timeline({ repeat: -1 })
      .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
  };
  createSpinTimeline();

  // Rest the cursor at the first zone's center until the first mousemove.
  const initialOffset = getOffset();
  const containerRect = containers[0].getBoundingClientRect();
  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
    x: containerRect.left + containerRect.width / 2 - initialOffset.x,
    y: containerRect.top + containerRect.height / 2 - initialOffset.y,
  });

  const moveCursor = (x, y) => {
    const { x: offsetX, y: offsetY } = getOffset();
    gsap.to(cursor, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: "power3.out" });
  };

  const tickerFn = () => {
    if (!targetCornerPositions) return;
    const strength = activeStrength.current;
    if (strength === 0) return;

    const cursorX = gsap.getProperty(cursor, "x");
    const cursorY = gsap.getProperty(cursor, "y");

    corners.forEach((corner, i) => {
      const currentX = gsap.getProperty(corner, "x");
      const currentY = gsap.getProperty(corner, "y");
      const targetX = targetCornerPositions[i].x - cursorX;
      const targetY = targetCornerPositions[i].y - cursorY;
      const finalX = currentX + (targetX - currentX) * strength;
      const finalY = currentY + (targetY - currentY) * strength;
      const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

      gsap.to(corner, {
        x: finalX,
        y: finalY,
        duration,
        ease: duration === 0 ? "none" : "power1.out",
        overwrite: "auto",
      });
    });
  };

  let hideTimeout = null;
  const showCursor = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    gsap.to(cursor, { opacity: 1, duration: 0.2 });
  };
  const hideCursor = () => {
    // Small grace period: moving from one zone section straight into
    // an adjacent one fires mouseleave then mouseenter back-to-back,
    // and without this the cursor would flicker off and back on.
    hideTimeout = setTimeout(() => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      if (activeTarget && currentLeaveHandler) currentLeaveHandler();
      hideTimeout = null;
    }, 40);
  };

  const moveHandler = (e) => moveCursor(e.clientX, e.clientY);

  const scrollHandler = () => {
    if (!activeTarget) return;
    const { x: offsetX, y: offsetY } = getOffset();
    const mouseX = gsap.getProperty(cursor, "x") + offsetX;
    const mouseY = gsap.getProperty(cursor, "y") + offsetY;
    const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
    const isStillOverTarget =
      elementUnderMouse &&
      (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
    if (!isStillOverTarget && currentLeaveHandler) currentLeaveHandler();
  };

  const mouseDownHandler = () => {
    gsap.to(dot, { scale: 0.7, duration: 0.3 });
    gsap.to(cursor, { scale: 0.9, duration: 0.2 });
  };
  const mouseUpHandler = () => {
    gsap.to(dot, { scale: 1, duration: 0.3 });
    gsap.to(cursor, { scale: 1, duration: 0.2 });
  };

  const enterHandler = (e) => {
    const target = e.target.closest(targetSelector);
    if (!target || !isInsideAnyContainer(target)) return;
    if (activeTarget === target) return;
    if (activeTarget) cleanupTarget(activeTarget);
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
      resumeTimeout = null;
    }

    activeTarget = target;
    corners.forEach((corner) => gsap.killTweensOf(corner, "x,y"));
    gsap.killTweensOf(cursor, "rotation");
    spinTl?.pause();
    gsap.set(cursor, { rotation: 0 });

    if (cursorColorOnTarget) {
      gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.15, ease: "power2.out" });
      gsap.to(dot, { backgroundColor: cursorColorOnTarget, duration: 0.15, ease: "power2.out" });
    }

    const rect = target.getBoundingClientRect();
    const { borderWidth, cornerSize } = constants;
    const { x: offsetX, y: offsetY } = getOffset();
    const cursorX = gsap.getProperty(cursor, "x");
    const cursorY = gsap.getProperty(cursor, "y");

    targetCornerPositions = [
      { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
      { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
      { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
      { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
    ];

    gsap.ticker.add(tickerFn);
    gsap.to(activeStrength, { current: 1, duration: hoverDuration, ease: "power2.out" });

    corners.forEach((corner, i) => {
      gsap.to(corner, {
        x: targetCornerPositions[i].x - cursorX,
        y: targetCornerPositions[i].y - cursorY,
        duration: 0.2,
        ease: "power2.out",
      });
    });

    const leaveHandler = () => {
      gsap.ticker.remove(tickerFn);
      targetCornerPositions = null;
      gsap.set(activeStrength, { current: 0, overwrite: true });
      activeTarget = null;

      if (cursorColorOnTarget) {
        gsap.to(corners, { borderColor: cursorColor, duration: 0.15, ease: "power2.out" });
        gsap.to(dot, { backgroundColor: cursorColor, duration: 0.15, ease: "power2.out" });
      }

      gsap.killTweensOf(corners, "x,y");
      const { cornerSize: cs } = constants;
      const positions = [
        { x: -cs * 1.5, y: -cs * 1.5 },
        { x: cs * 0.5, y: -cs * 1.5 },
        { x: cs * 0.5, y: cs * 0.5 },
        { x: -cs * 1.5, y: cs * 0.5 },
      ];
      const tl = gsap.timeline();
      corners.forEach((corner, index) => {
        tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: "power3.out" }, 0);
      });

      resumeTimeout = setTimeout(() => {
        if (!activeTarget && spinTl) {
          const currentRotation = gsap.getProperty(cursor, "rotation");
          const normalizedRotation = currentRotation % 360;
          spinTl.kill();
          spinTl = gsap
            .timeline({ repeat: -1 })
            .to(cursor, { rotation: "+=360", duration: spinDuration, ease: "none" });
          gsap.to(cursor, {
            rotation: normalizedRotation + 360,
            duration: spinDuration * (1 - normalizedRotation / 360),
            ease: "none",
            onComplete: () => spinTl?.restart(),
          });
        }
        resumeTimeout = null;
      }, 50);

      cleanupTarget(target);
    };

    currentLeaveHandler = leaveHandler;
    target.addEventListener("mouseleave", leaveHandler);
  };

  const resizeHandler = () => {
    containingBlock = getContainingBlock(cursor);
  };

  containers.forEach((c) => {
    c.addEventListener("mouseenter", showCursor);
    c.addEventListener("mouseleave", hideCursor);
    c.addEventListener("mousemove", moveHandler);
    c.addEventListener("mouseover", enterHandler, { passive: true });
    c.addEventListener("mousedown", mouseDownHandler);
    c.addEventListener("mouseup", mouseUpHandler);
  });
  window.addEventListener("scroll", scrollHandler, { passive: true });
  window.addEventListener("resize", resizeHandler);

  return function destroy() {
    containers.forEach((c) => {
      c.removeEventListener("mouseenter", showCursor);
      c.removeEventListener("mouseleave", hideCursor);
      c.removeEventListener("mousemove", moveHandler);
      c.removeEventListener("mouseover", enterHandler);
      c.removeEventListener("mousedown", mouseDownHandler);
      c.removeEventListener("mouseup", mouseUpHandler);
      c.classList.remove("has-target-cursor");
    });
    window.removeEventListener("scroll", scrollHandler);
    window.removeEventListener("resize", resizeHandler);
    if (activeTarget) cleanupTarget(activeTarget);
    spinTl?.kill();
    cursor.remove();
  };
}