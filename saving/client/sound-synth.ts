import { SynthProfile } from "./sound-profiles";

/**
 * 🧪 Creates a PeriodicWave from harmonic amplitudes.
 * This defines the raw waveform shape and timbre.
 */
function createPeriodicWave(ctx: AudioContext, harmonics: number[]) {
    const real = new Float32Array(harmonics.length + 1);
    const imag = new Float32Array(harmonics.length + 1);
    real[0] = 0; // no DC offset
    for (let i = 0; i < harmonics.length; i++) {
        real[i + 1] = harmonics[i]; // cosine component = amplitude
        imag[i + 1] = 0;            // sine component = phase (off)
    }
    return ctx.createPeriodicWave(real, imag, { disableNormalization: false });
}

/**
 * 🎵 Plays one note using a synth profile
 * Connects oscillator → gain envelope → filter → stereo pan → destination
 */
export function playNote(ctx: AudioContext, freq: number, profile: SynthProfile) {
    const now = ctx.currentTime;
    const offset = profile.startOffset || 0; // delay per note (for sloppy or human feel)
    const stopTime = now + offset + profile.duration + profile.release;

    // 🔊 Oscillator: creates tone with harmonic shape
    const osc = ctx.createOscillator();
    osc.setPeriodicWave(createPeriodicWave(ctx, profile.harmonics));
    osc.frequency.setValueAtTime(freq, now + offset);

    // Optional: pitch wobble (± detune in cents)
    if (profile.oscDetune) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * profile.oscDetune, now);
    }

    // 📈 Gain node for amplitude envelope
    const gain = ctx.createGain();
    const totalGain = (profile.masterGain || 1) * (profile.gainLevel || 0.1);
    gain.gain.setValueAtTime(0, now + offset);                                // start silent
    gain.gain.linearRampToValueAtTime(totalGain, now + offset + profile.attack);    // attack
    gain.gain.setValueAtTime(totalGain, now + offset + profile.duration);           // hold
    gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);                 // release

    // 🎚 Filter: softens high frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(profile.filterCutoff, now + offset); // cutoff = brightness
    filter.Q.setValueAtTime(profile.lowpassQ || 0.7, now);                // Q = resonance/sharpness

    // 🔊 Stereo Panner: spreads the note left/right randomly
    const pan = ctx.createStereoPanner();
    const spread = (profile.stereoSpread || 0) * (Math.random() - 0.5); // centered if 0
    pan.pan.setValueAtTime(spread, now);

    // 🔌 Connect signal path: Osc → Gain → Filter → Pan → Speakers
    osc.connect(gain);
    gain.connect(filter);
    filter.connect(pan);
    pan.connect(ctx.destination);

    // ▶️ Start the sound
    osc.start(now + offset);
    osc.stop(stopTime);
}
