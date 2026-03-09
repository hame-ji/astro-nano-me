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

type PrecomputedSound = {
  duration: number;
  channelData: Float32Array;
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
    gain: 0.096,
  },
  off: {
    duration: 0.11,
    clickFrequency: 1960,
    clickDecay: 235,
    clickMix: 0.06,
    knockFrequency: 200,
    knockDecay: 58,
    knockMix: 0.017,
    gain: 0.1,
  },
};

const precomputedSounds = new Map<ThemeSoundPreset, PrecomputedSound>();
const audioBuffers = new Map<ThemeSoundPreset, AudioBuffer>();
let audioContext: AudioContext | null = null;
let resumePromise: Promise<AudioContext | null> | null = null;

function precomputeSound(profile: SoundProfile) {
  const sampleRate = 44100;
  const frameCount = Math.floor(sampleRate * profile.duration);
  const channelData = new Float32Array(frameCount);

  for (let index = 0; index < frameCount; index += 1) {
    const time = index / sampleRate;
    const click =
      Math.sin(2 * Math.PI * profile.clickFrequency * time) *
      Math.exp(-time * profile.clickDecay);
    const knock =
      Math.sin(2 * Math.PI * profile.knockFrequency * time) *
      Math.exp(-time * profile.knockDecay);

    channelData[index] =
      (click * profile.clickMix + knock * profile.knockMix) * profile.gain;
  }

  return {
    duration: profile.duration,
    channelData,
  };
}

function getPrecomputedSound(preset: ThemeSoundPreset) {
  const existing = precomputedSounds.get(preset);

  if (existing !== undefined) {
    return existing;
  }

  const next = precomputeSound(soundProfiles[preset]);
  precomputedSounds.set(preset, next);
  return next;
}

getPrecomputedSound("on");
getPrecomputedSound("off");

function getAudioContext() {
  if (audioContext !== null) {
    return audioContext;
  }

  try {
    audioContext = new AudioContext();
  } catch {
    return null;
  }

  return audioContext;
}

async function ensureAudioContextReady() {
  const context = getAudioContext();

  if (context === null) {
    return null;
  }

  if (context.state === "running") {
    return context;
  }

  if (resumePromise !== null) {
    return resumePromise;
  }

  resumePromise = context
    .resume()
    .then(() => (context.state === "running" ? context : null))
    .catch(() => null)
    .finally(() => {
      resumePromise = null;
    });

  return resumePromise;
}

function getAudioBuffer(context: AudioContext, preset: ThemeSoundPreset) {
  const existing = audioBuffers.get(preset);

  if (existing !== undefined) {
    return existing;
  }

  const sound = getPrecomputedSound(preset);

  try {
    const frameCount = Math.floor(context.sampleRate * sound.duration);
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const channel = buffer.getChannelData(0);
    const source = sound.channelData;
    const lastIndex = source.length - 1;

    for (let index = 0; index < frameCount; index += 1) {
      const sourceIndex = Math.min(
        Math.floor((index / frameCount) * source.length),
        lastIndex
      );
      channel[index] = source[sourceIndex] ?? 0;
    }

    audioBuffers.set(preset, buffer);
    return buffer;
  } catch {
    return null;
  }
}

async function primeThemeSwitchBuffers() {
  const context = getAudioContext();

  if (context === null) {
    return null;
  }

  getAudioBuffer(context, "on");
  getAudioBuffer(context, "off");

  return ensureAudioContextReady();
}

export async function warmupThemeSwitchAudio() {
  const context = await primeThemeSwitchBuffers();
  return context !== null;
}

function startBufferPlayback(context: AudioContext, buffer: AudioBuffer) {
  try {
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
    return true;
  } catch {
    return false;
  }
}

export function playThemeSwitchSound(preset: ThemeSoundPreset) {
  const context = getAudioContext();

  if (context === null) {
    return;
  }

  getAudioBuffer(context, "on");
  getAudioBuffer(context, "off");

  const buffer = getAudioBuffer(context, preset);

  if (buffer === null) {
    return;
  }

  if (context.state !== "running") {
    void ensureAudioContextReady().then((readyContext) => {
      if (readyContext === null) {
        return;
      }

      const retryBuffer = getAudioBuffer(readyContext, preset);

      if (retryBuffer === null) {
        return;
      }

      startBufferPlayback(readyContext, retryBuffer);
    });
    return;
  }

  if (startBufferPlayback(context, buffer)) {
    return;
  }

  void ensureAudioContextReady().then((readyContext) => {
    if (readyContext === null) {
      return;
    }

    const retryBuffer = getAudioBuffer(readyContext, preset);

    if (retryBuffer === null) {
      return;
    }

    startBufferPlayback(readyContext, retryBuffer);
  });
}
