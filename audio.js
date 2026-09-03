// 登機倒數：測一張暫停生活的單程機票 - 音效與背景音樂控制器 (Web Audio API)

class TravelAudioController {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.bgmTimer = null;
    this.masterGain = null;
    this.vinylGain = null;
    this.chordStep = 0;
    
    // Lo-Fi travel chord progression (Major 7ths & Minor 7ths in F major / D minor warm aesthetic)
    // Fmaj9, Am7, Dm9, Bbmaj7, C7sus4
    this.chords = [
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj9 (F3, A3, C4, E4, G4)
      [164.81, 196.00, 246.94, 293.66, 370.00], // E7alt / G# (E3, G3, B3, D4, F#4)
      [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9 (D3, F3, A3, C4, E4)
      [116.54, 174.61, 233.08, 293.66, 349.23], // Bbmaj7 (Bb2, F3, Bb3, D4, F4)
      [130.81, 196.00, 261.63, 349.23, 392.00], // Csus4 (C3, G3, C4, F4, G4)
      [174.61, 220.00, 261.63, 329.63, 440.00]  // Fmaj7/A
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Create vinyl crackle noise generator
      this.setupVinylCrackle();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setupVinylCrackle() {
    if (!this.ctx) return;
    try {
      // Buffer for subtle vinyl pink noise
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise approximation + random crackles
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        if (Math.random() < 0.0008) {
          data[i] += (Math.random() - 0.5) * 0.4; // micro crackle
        }
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 900;
      noiseFilter.Q.value = 1.2;

      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.value = 0.025; // Gentle background vinyl hiss

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(this.vinylGain);
      this.vinylGain.connect(this.masterGain);
      noiseSource.start();
    } catch (e) {
      console.warn('Vinyl noise init error:', e);
    }
  }

  playChordPad() {
    if (!this.ctx || !this.isPlaying || this.isMuted) return;

    const chord = this.chords[this.chordStep % this.chords.length];
    this.chordStep++;
    const now = this.ctx.currentTime;
    const duration = 4.2; // Warm slow breathing tempo

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm mellow tone (sine + gentle low-pass)
      osc.type = idx === 0 ? 'sine' : (idx % 2 === 0 ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, now);

      // Micro pitch drift for vintage cassette/vinyl flutter
      const drift = (Math.random() - 0.5) * 1.2;
      osc.frequency.linearRampToValueAtTime(freq + drift, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700 + idx * 100, now);
      filter.Q.value = 1.0;

      // Soft attack & decay envelope
      const baseVol = 0.045 / Math.sqrt(chord.length);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(baseVol, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(baseVol * 0.7, now + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    // Play a gentle bell/piano chime note occasionally
    if (Math.random() > 0.35) {
      const chimeFreq = chord[Math.floor(Math.random() * chord.length)] * 2;
      this.playChimeNote(chimeFreq, now + 0.8 + Math.random() * 1.5);
    }

    this.bgmTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.playChordPad();
      }
    }, 3800);
  }

  playChimeNote(freq, startTime) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.025, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.0);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 2.1);
  }

  startBGM() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playChordPad();
    this.updateUIState();
  }

  pauseBGM() {
    this.isPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.updateUIState();
  }

  toggleBGM() {
    if (this.isPlaying) {
      this.pauseBGM();
    } else {
      this.startBGM();
    }
  }

  // Sound Effect: Option click / soft paper flip
  playClickSound() {
    if (!this.ctx || this.isMuted) {
      this.init();
    }
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Sound Effect: Vintage stamp impact thud & ink press
  playStampSound() {
    if (!this.ctx) this.init();
    try {
      const now = this.ctx.currentTime;
      
      // Heavy low thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);

      // Higher mechanical click
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'sine';
      click.frequency.setValueAtTime(800, now + 0.02);
      click.frequency.exponentialRampToValueAtTime(200, now + 0.06);

      clickGain.gain.setValueAtTime(0.08, now + 0.02);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      click.connect(clickGain);
      clickGain.connect(this.masterGain);
      click.start(now + 0.02);
      click.stop(now + 0.08);
    } catch (e) {}
  }

  updateUIState() {
    const vinylBtn = document.getElementById('vinylBtn');
    if (vinylBtn) {
      if (this.isPlaying) {
        vinylBtn.classList.add('playing');
        vinylBtn.setAttribute('title', '點擊暫停背景音樂');
        vinylBtn.setAttribute('aria-label', '暫停背景音樂');
      } else {
        vinylBtn.classList.remove('playing');
        vinylBtn.setAttribute('title', '點擊播放背景音樂');
        vinylBtn.setAttribute('aria-label', '播放背景音樂');
      }
    }
  }
}

const audioCtrl = new TravelAudioController();
