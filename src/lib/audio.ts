let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (sharedAudioContext && sharedAudioContext.state !== "closed") {
    return sharedAudioContext;
  }
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  sharedAudioContext = new AudioCtx();
  return sharedAudioContext;
}

export function playWhatsAppPing(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(800, now);
    gain1.gain.setValueAtTime(0.14, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.onended = () => {
      osc1.disconnect();
      gain1.disconnect();
    };
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1200, now + 0.08);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.18, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.onended = () => {
      osc2.disconnect();
      gain2.disconnect();
    };
    osc2.start(now + 0.08);
    osc2.stop(now + 0.28);
  } catch {
    // Ignore audio playback errors when blocked by browser autoplay policy
  }
}

export function simulateLeadDispatch(
  baseMs: number,
  jitterMs: number,
  onDelivered: (elapsedSeconds: string) => void,
): number {
  const start = performance.now();
  const delay = baseMs + Math.random() * jitterMs;
  return window.setTimeout(() => {
    onDelivered(((performance.now() - start) / 1000).toFixed(1));
  }, delay);
}
