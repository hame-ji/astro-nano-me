import { warmupThemeSwitchAudio } from "@lib/sound/themeSwitchAudio";

const audioWarmupStateKey = "__nanoThemeToggleAudioWarmupBound";

const warmupEvents: Array<keyof DocumentEventMap> = [
  "pointerdown",
  "touchstart",
  "keydown",
  "wheel",
];

export function installThemeSwitchAudioWarmup() {
  const globalWindow = window as unknown as Record<string, unknown>;

  if (globalWindow[audioWarmupStateKey] === true) {
    return;
  }

  globalWindow[audioWarmupStateKey] = true;
  let warmedUp = false;
  let warmingUp = false;

  const warmup = () => {
    if (warmedUp || warmingUp) {
      return;
    }

    warmingUp = true;

    void warmupThemeSwitchAudio()
      .then((ready) => {
        if (!ready) {
          return;
        }

        warmedUp = true;

        warmupEvents.forEach((eventName) => {
          document.removeEventListener(eventName, warmup, { capture: true });
        });
      })
      .finally(() => {
        warmingUp = false;
      });
  };

  document.addEventListener("pointerdown", warmup, {
    passive: true,
    capture: true,
  });
  document.addEventListener("touchstart", warmup, {
    passive: true,
    capture: true,
  });
  document.addEventListener("keydown", warmup, {
    passive: true,
    capture: true,
  });
  document.addEventListener("wheel", warmup, {
    passive: true,
    capture: true,
  });
}
