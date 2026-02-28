const SYMBOLS = ["*", "#", "$", "%", "+", "-", "?", "/", "="] as const;
const SCRAMBLE_STEP_ONE_MS = 90;
const SCRAMBLE_STEP_TWO_MS = 180;
const TICK_MS = 320;
const SCRAMBLE_ELIGIBLE = /[a-z0-9]/i;

let activeInterval: number | null = null;

const clearActiveInterval = () => {
  if (activeInterval !== null) {
    window.clearInterval(activeInterval);
    activeInterval = null;
  }
};

const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

export const initFooterNameTerminal = () => {
  const footerName = document.getElementById("footer-name-terminal");
  if (!footerName) {
    clearActiveInterval();
    return;
  }

  if (footerName.getAttribute("data-initialized") === "true") {
    return;
  }

  clearActiveInterval();

  const slots = [
    ...footerName.querySelectorAll<HTMLSpanElement>(".footer-name-char"),
  ];
  const chars = slots.map(
    (slot) => slot.dataset.char ?? slot.textContent ?? ""
  );
  const charCount = chars.length;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!charCount) return;

  slots.forEach((slot, index) => {
    slot.textContent = chars[index];
    slot.classList.remove("is-scrambled");
  });

  window.requestAnimationFrame(() => {
    slots.forEach((slot) => {
      const width = slot.getBoundingClientRect().width;
      slot.style.width = `${width}px`;
    });
  });

  footerName.setAttribute("data-initialized", "true");

  if (reducedMotion.matches) return;

  let index = 0;

  const render = (charIndex: number, replacement: string) => {
    slots[charIndex].textContent = replacement;
  };

  const markScrambled = (charIndex: number, active: boolean) => {
    slots[charIndex].classList.toggle("is-scrambled", active);
  };

  const nextIndex = () => {
    for (let offset = 0; offset < charCount; offset++) {
      const candidate = (index + offset) % charCount;
      if (SCRAMBLE_ELIGIBLE.test(chars[candidate])) {
        index = (candidate + 1) % charCount;
        return candidate;
      }
    }
    return -1;
  };

  const tick = () => {
    const charIndex = nextIndex();
    if (charIndex === -1) return;

    markScrambled(charIndex, true);
    render(charIndex, randomSymbol());
    window.setTimeout(
      () => render(charIndex, randomSymbol()),
      SCRAMBLE_STEP_ONE_MS
    );
    window.setTimeout(() => {
      render(charIndex, chars[charIndex]);
      markScrambled(charIndex, false);
    }, SCRAMBLE_STEP_TWO_MS);
  };

  activeInterval = window.setInterval(tick, TICK_MS);
};

export const destroyFooterNameTerminal = () => {
  clearActiveInterval();
};
