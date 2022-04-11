
export class AudioController {

    constructor(
        private scale: number[],
        private startFreq: number,
        private audioCtx = new AudioContext(),
    ) {
    }

    makeOscillator(i: number) {
        const { audioCtx, scale, startFreq } = this;
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.connect(audioCtx.destination);
        const freq = startFreq * scale[i];
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
        oscillator.start();
        console.log(freq);
    }
}
