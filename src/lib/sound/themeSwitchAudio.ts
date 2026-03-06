export type ThemeSoundPreset = "on" | "off";

type SoundProfile = {
  duration: number;
  clickFrequency: number;
  clickDecay: number;
  clickMix: number;
  knockFrequency: number;
  knockDecay: number;
  knockMix: number;
  gain: number;
};

const soundProfiles: Record<ThemeSoundPreset, SoundProfile> = {
  on: {
    duration: 0.1,
    clickFrequency: 2300,
    clickDecay: 260,
    clickMix: 0.062,
    knockFrequency: 240,
    knockDecay: 62,
    knockMix: 0.015,
    gain: 0.077,
  },
  off: {
    duration: 0.11,
    clickFrequency: 1960,
    clickDecay: 235,
    clickMix: 0.06,
    knockFrequency: 200,
    knockDecay: 58,
    knockMix: 0.017,
    gain: 0.08,
  },
};

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (audioContext !== null) {
    return audioContext;
  }

  audioContext = new AudioContext();
  return audioContext;
}

export async function playThemeSwitchSound(preset: ThemeSoundPreset) {
  const context = getAudioContext();

  if (context.state === "suspended") {
    await context.resume();
  }

  const profile = soundProfiles[preset];
  const sampleRate = context.sampleRate;
  const frameCount = Math.floor(sampleRate * profile.duration);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    const time = index / sampleRate;
    const click =
      Math.sin(2 * Math.PI * profile.clickFrequency * time) *
      Math.exp(-time * profile.clickDecay);
    const knock =
      Math.sin(2 * Math.PI * profile.knockFrequency * time) *
      Math.exp(-time * profile.knockDecay);

    channel[index] =
      (click * profile.clickMix + knock * profile.knockMix) * profile.gain;
  }

  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
}
