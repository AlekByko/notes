/**
 * Represents a synth sound profile used by the SynthEngine.
 * Controls how a note or chord behaves over time and how it sounds.
 */
export interface SynthProfile {
    /**
     * Array of harmonic amplitudes.
     * Index 0 = fundamental (1st harmonic), Index 1 = 2nd harmonic, etc.
     * Values typically decay like [1.0, 0.5, 0.25, ...]
     *
     * @example [1, 0.8, 0.5, 0.3]
     * @default [1]
     */
    harmonics: number[];

    /**
     * Master amplitude level for the note (0–1).
     * Higher = louder. Watch out for clipping if using many harmonics.
     *
     * @example 0.2 — soft, 0.6 — loud, 1.0 — max
     * @default 0.1
     */
    gainLevel: number;

    /**
     * Low-pass filter cutoff frequency in Hz.
     * - Use -1 to disable the filter.
     * - 200–1000 = warm/dark
     * - 1000–4000 = bright
     * - 5000+ = full range
     *
     * @example 1200
     * @default -1 (disabled)
     */
    filterCutoff: number;

    /**
     * Time in seconds to ramp up from 0 to peak gain.
     * - 0.001–0.01 = snappy
     * - 0.1+ = pad-like
     *
     * @example 0.005
     * @default 0.01
     */
    attack: number;

    /**
     * Time in seconds to fade out after note ends.
     * - 0.2 = short tail
     * - 1.0+ = slow fade
     *
     * @example 0.8
     * @default 0.5
     */
    release: number;

    /**
     * Time in seconds to hold the note before release starts.
     * Works like sustain in basic ADSR.
     *
     * @example 1.5
     * @default 1.0
     */
    duration: number;

    /**
     * Stereo pan spread for this voice (0–1).
     * Determines how far apart each note can be in stereo field.
     * - 0 = centered
     * - 1 = full L/R random spread
     *
     * @example 0.3
     * @default 0
     */
    stereoSpread: number;

    /**
     * Resonance (Q factor) for the lowpass filter.
     * - 0.5 = soft
     * - 1–2 = sharper peak
     *
     * @example 1.0
     * @default 0.7
     */
    lowpassQ: number;

    /**
     * Time offset in seconds to delay note start.
     * Useful for humanizing chords or loose timing.
     *
     * @example 0.01
     * @default 0
     */
    startOffset: number;

    /**
     * Amount of random pitch detuning in cents.
     * - 0 = no detune (perfect tuning)
     * - 5–15 = analog drift feel
     *
     * @example 6
     * @default 0
     */
    oscDetune: number;

    /**
     * Overall multiplier on output volume (0–1).
     * Scales the final output of the profile.
     * Useful for global balancing without touching `gainLevel`.
     *
     * @example 1.0
     * @default 1.0
     */
    masterGain: number;

    /**
     * Optional multi-stage volume envelope.
     * Overrides `attack`, `duration`, `release` if present.
     * Defines gain curve as an array of time/value points.
     *
     * Time is in seconds. Value is 0–1.
     *
     * @example
     * [
     *   { time: 0.0, value: 0 },
     *   { time: 0.05, value: 1 },
     *   { time: 0.3, value: 0.3 },
     *   { time: 1.0, value: 0.0001 }
     * ]
     */
    envelope?: {
        time: number;
        value: number;
    }[];

    /**
     * Mode of synthesis.
     * - 'periodic' = uses PeriodicWave
     * - 'raw' = raw stacked sine oscillators (more CPU)
     *
     * @example 'periodic'
     */
    mode: 'periodic' | 'raw';
}



// 🎨 Synth profiles define the shape and behavior of the sound
export const synthProfiles = {
    freightTrain: {
        harmonics: [1, 1, 0.9, 0.8, 0.6, 0.5, 0.4],
        gainLevel: 0.3,          // loud!
        filterCutoff: 5000,      // bright
        attack: 0.005,           // fast attack
        release: 0.8,
        duration: 0.3,
        stereoSpread: 0.2,       // slightly wide
        lowpassQ: 1,
        startOffset: 0,
        oscDetune: 0,
        masterGain: 1,
        mode: 'periodic',
    } satisfies SynthProfile,

    toothless: {
        harmonics: [1, 0.05, 0.02, 0.01, 0.005],
        gainLevel: 0.07,         // soft volume
        filterCutoff: 900,       // warm & dark
        attack: 0.04,            // smooth fade-in
        release: 1.5,
        duration: 1.5,
        stereoSpread: 0,
        lowpassQ: 0.5,
        startOffset: 0,
        oscDetune: 0,
        masterGain: 1,
        mode: 'periodic',
    } satisfies SynthProfile,

    velvetSaw: {
        harmonics: [1, 0.8, 0.6, 0.4, 0.2, 0.1],
        gainLevel: 0.15,
        filterCutoff: 2000,
        attack: 0.015,
        release: 1.2,
        duration: 1.8,
        stereoSpread: 0.3,
        lowpassQ: 0.7,
        startOffset: 0,
        oscDetune: 0,
        masterGain: 1,
        mode: 'periodic',
    } satisfies SynthProfile,

    lofiWobble: {
        harmonics: [1, 0.4, 0.15, 0.05],
        gainLevel: 0.12,
        filterCutoff: 1300,
        attack: 0.03,
        release: 2.5,
        duration: 2,
        stereoSpread: 0.4,      // extra wide
        lowpassQ: 1.5,          // bump on highs
        startOffset: 0.005,     // loose timing
        oscDetune: 6,           // pitch wobble
        masterGain: 0.9,
        mode: 'periodic',
    } satisfies SynthProfile,
};
