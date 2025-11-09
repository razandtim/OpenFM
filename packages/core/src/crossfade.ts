// Crossfade scheduler and gain ramp calculations

export interface CrossfadeOptions {
  duration: number; // ms
  stepInterval?: number; // ms between gain updates, default 10-15ms
}

export interface GainRamp {
  startGain: number;
  endGain: number;
  duration: number;
  steps: number;
}

/**
 * Calculate gain ramp for smooth crossfades
 */
export function calculateGainRamp(
  startGain: number,
  endGain: number,
  durationMs: number,
  stepIntervalMs = 15
): GainRamp {
  const steps = Math.max(1, Math.floor(durationMs / stepIntervalMs));
  return {
    startGain,
    endGain,
    duration: durationMs,
    steps,
  };
}

/**
 * Get gain value at a specific step in the ramp
 */
export function getGainAtStep(ramp: GainRamp, step: number): number {
  const progress = Math.min(1, step / ramp.steps);
  // Use exponential curve for more natural sounding fades
  const curve = Math.pow(progress, 2);
  return ramp.startGain + (ramp.endGain - ramp.startGain) * curve;
}

/**
 * Crossfade scheduler that manages two audio sources
 */
export class CrossfadeScheduler {
  private fadeOutRamp?: GainRamp;
  private fadeInRamp?: GainRamp;
  private currentStep = 0;
  private intervalId?: NodeJS.Timeout;
  private onGainUpdate?: (fadeOutGain: number, fadeInGain: number) => void;
  private onComplete?: () => void;

  constructor(
    private stepIntervalMs = 15
  ) {}

  /**
   * Start crossfade between two sources
   */
  start(
    durationMs: number,
    onGainUpdate: (fadeOutGain: number, fadeInGain: number) => void,
    onComplete?: () => void
  ): void {
    this.stop(); // Stop any existing crossfade
    
    this.fadeOutRamp = calculateGainRamp(1, 0, durationMs, this.stepIntervalMs);
    this.fadeInRamp = calculateGainRamp(0, 1, durationMs, this.stepIntervalMs);
    this.currentStep = 0;
    this.onGainUpdate = onGainUpdate;
    this.onComplete = onComplete;
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, this.stepIntervalMs);
  }

  private tick(): void {
    if (!this.fadeOutRamp || !this.fadeInRamp || !this.onGainUpdate) return;
    
    const fadeOutGain = getGainAtStep(this.fadeOutRamp, this.currentStep);
    const fadeInGain = getGainAtStep(this.fadeInRamp, this.currentStep);
    
    this.onGainUpdate(fadeOutGain, fadeInGain);
    
    this.currentStep++;
    
    if (this.currentStep >= this.fadeOutRamp.steps) {
      this.stop();
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.fadeOutRamp = undefined;
    this.fadeInRamp = undefined;
    this.currentStep = 0;
  }

  isActive(): boolean {
    return this.intervalId !== undefined;
  }
}

/**
 * Convert dB to linear gain (0-1)
 */
export function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}

/**
 * Convert linear gain to dB
 */
export function gainToDb(gain: number): number {
  return 20 * Math.log10(Math.max(0.0001, gain));
}

