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

  const warmup = () => {
    warmupEvents.forEach((eventName) => {
      document.removeEventListener(eventName, warmup);
    });

    void warmupThemeSwitchAudio();
  };

  document.addEventListener("pointerdown", warmup, { passive: true });
  document.addEventListener("touchstart", warmup, { passive: true });
  document.addEventListener("keydown", warmup);
  document.addEventListener("wheel", warmup, { passive: true });
}
