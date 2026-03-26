const SYMBOLS = ["*", "#", "$", "%", "+", "-", "?", "/", "="] as const;
const IDLE_TICK_MS = 1400;
const WAVE_STEP_MS = 56;
const SCRAMBLE_ELIGIBLE = /[a-z0-9]/i;

let activeInterval: number | null = null;
let activeTimeouts: number[] = [];
let cleanupListeners: Array<() => void> = [];

const clearActiveInterval = () => {
  if (activeInterval !== null) {
    window.clearInterval(activeInterval);
    activeInterval = null;
  }
};

const clearActiveTimeouts = () => {
  activeTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
  activeTimeouts = [];
};

const clearListeners = () => {
  cleanupListeners.forEach((cleanup) => cleanup());
  cleanupListeners = [];
};

const schedule = (callback: () => void, delayMs: number) => {
  const timeoutId = window.setTimeout(callback, delayMs);
  activeTimeouts.push(timeoutId);
};

const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

export const initFooterNameTerminal = () => {
  const footerName = document.getElementById("footer-name-terminal");
  if (!footerName) {
    destroyFooterNameTerminal();
    return;
  }

  if (footerName.getAttribute("data-initialized") === "true") {
    return;
  }

  clearActiveInterval();
  clearActiveTimeouts();
  clearListeners();

  const slots = [
    ...footerName.querySelectorAll<HTMLSpanElement>(".footer-name-char"),
  ];
  const chars = slots.map(
    (slot) => slot.dataset.char ?? slot.textContent ?? ""
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const eligibleIndexes = chars
    .map((char, index) => (SCRAMBLE_ELIGIBLE.test(char) ? index : -1))
    .filter((index) => index >= 0);

  if (!chars.length) return;

  slots.forEach((slot, index) => {
    slot.textContent = chars[index];
    slot.classList.remove("is-scrambled", "is-pulsing");
  });

  window.requestAnimationFrame(() => {
    slots.forEach((slot) => {
      const width = slot.getBoundingClientRect().width;
      slot.style.width = `${width}px`;
    });
  });

  footerName.setAttribute("data-initialized", "true");

  if (reducedMotion.matches || !eligibleIndexes.length) {
    return;
  }

  const animateChar = (charIndex: number) => {
    const slot = slots[charIndex];

    slot.classList.add("is-pulsing", "is-scrambled");
    slot.textContent = randomSymbol();

    schedule(() => {
      slot.textContent = randomSymbol();
    }, 92);

    schedule(() => {
      slot.textContent = chars[charIndex];
      slot.classList.remove("is-scrambled");
    }, 196);

    schedule(() => {
      slot.classList.remove("is-pulsing");
    }, 280);
  };

  let cursor = 0;

  const nextEligibleIndex = () => {
    const value = eligibleIndexes[cursor];
    cursor = (cursor + 1) % eligibleIndexes.length;
    return value;
  };

  const triggerWave = () => {
    clearActiveTimeouts();
    eligibleIndexes.forEach((_, step) => {
      const charIndex = nextEligibleIndex();
      const jitter = Math.floor(Math.random() * 12);
      schedule(() => animateChar(charIndex), step * WAVE_STEP_MS + jitter);
    });
  };

  const onPointerEnter = () => triggerWave();
  const onFocusIn = () => triggerWave();
  const onTouchStart = () => triggerWave();

  footerName.addEventListener("pointerenter", onPointerEnter);
  footerName.addEventListener("focusin", onFocusIn);
  footerName.addEventListener("touchstart", onTouchStart, { passive: true });

  cleanupListeners.push(() => {
    footerName.removeEventListener("pointerenter", onPointerEnter);
    footerName.removeEventListener("focusin", onFocusIn);
    footerName.removeEventListener("touchstart", onTouchStart);
  });

  activeInterval = window.setInterval(() => {
    animateChar(nextEligibleIndex());
  }, IDLE_TICK_MS);
};

export const destroyFooterNameTerminal = () => {
  clearActiveInterval();
  clearActiveTimeouts();
  clearListeners();
};
