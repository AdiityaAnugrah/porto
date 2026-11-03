export const interfaceTones = {
  hover: [
    { frequency: 880, endFrequency: 1046.5, offset: 0, duration: 0.085, gain: 0.024, type: 'sine' },
    { frequency: 1760, endFrequency: 1568, offset: 0.008, duration: 0.055, gain: 0.006, type: 'sine' },
  ],
  press: [
    { frequency: 523.25, endFrequency: 523.25, offset: 0, duration: 0.16, gain: 0.035, type: 'sine' },
    { frequency: 783.99, endFrequency: 783.99, offset: 0.025, duration: 0.17, gain: 0.026, type: 'sine' },
    { frequency: 1046.5, endFrequency: 1174.66, offset: 0.055, duration: 0.2, gain: 0.018, type: 'sine' },
  ],
};

export function scheduleInterfaceTone(context, destination, kind) {
  const start = context.currentTime + 0.006;
  const voices = [];
  for (const note of interfaceTones[kind] || []) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const time = start + note.offset;
    oscillator.type = note.type;
    oscillator.frequency.setValueAtTime(note.frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(note.endFrequency, time + note.duration);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(note.gain, time + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + note.duration);
    oscillator.connect(envelope);
    envelope.connect(destination);
    oscillator.start(time);
    oscillator.stop(time + note.duration + 0.01);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    voices.push(oscillator);
  }
  return voices;
}

export function createInterfaceAudio() {
  let context;
  let output;
  let enabled = true;
  let disposed = false;
  let lastHover = -Infinity;
  const unlock = () => {
    if (!enabled || disposed) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      if (!context) {
        context = new Audio();
        output = context.createGain();
        output.connect(context.destination);
      }
      if (context.state === 'suspended') void context.resume().catch(() => {});
    } catch { context = undefined; }
  };
  return {
    unlock,
    setEnabled(value) {
      enabled = value;
      if (context && output) {
        output.gain.cancelScheduledValues(context.currentTime);
        output.gain.setTargetAtTime(value ? 1 : 0, context.currentTime, 0.012);
      }
    },
    play(kind) {
      if (!enabled || disposed || document.hidden) return;
      if (kind === 'press') unlock();
      if (!context || context.state !== 'running') return;
      const now = performance.now();
      if (kind === 'hover' && now - lastHover < 100) return;
      if (kind === 'hover') lastHover = now;
      scheduleInterfaceTone(context, output, kind);
    },
    dispose() {
      disposed = true;
      if (context && context.state !== 'closed') void context.close().catch(() => {});
    },
  };
}
