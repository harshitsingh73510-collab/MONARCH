/**
 * MONARCH sound design — sparing, synthesized, zero-asset.
 * One low UI tone on key transitions only (entering a case study, form
 * success). Muted by default; never autoplays. The AudioContext is created
 * lazily on the first user gesture (the unmute toggle), satisfying browser
 * autoplay policy.
 */

type Kind = "enter" | "success";

const STORAGE_KEY = "monarch:sound";
const EVENT = "monarch:sound-change";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = false;

  init() {
    if (typeof window === "undefined") return;
    try {
      this.enabled = localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      this.enabled = false;
    }
  }

  private ensureCtx() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
    if (on) {
      this.ensureCtx();
      this.ctx?.resume();
      this.chime("enter"); // gentle confirmation that sound is now on
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(EVENT, { detail: on }));
    }
  }

  toggle() {
    this.setEnabled(!this.enabled);
  }

  /** Play a short, low, compressed tone. No-op while muted. */
  chime(kind: Kind) {
    if (!this.enabled || typeof window === "undefined") return;
    this.ensureCtx();
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    // low sine notes with a soft champagne-warm second partial
    const notes =
      kind === "success" ? [220, 329.6] : [174.6]; // A3→E4 rise, or a low F3
    notes.forEach((freq, i) => {
      const t0 = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const partial = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      partial.type = "sine";
      partial.frequency.value = freq * 2;
      pGain.gain.value = 0.12;
      const peak = 0.22;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(peak, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
      osc.connect(gain);
      partial.connect(pGain).connect(gain);
      gain.connect(master);
      osc.start(t0);
      partial.start(t0);
      osc.stop(t0 + 0.95);
      partial.stop(t0 + 0.95);
    });
  }
}

export const sound = new SoundEngine();
export const SOUND_EVENT = EVENT;
