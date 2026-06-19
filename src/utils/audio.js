// audio.js
// A soft, short click sound encoded in base64. 
// This is a minimal WAV file representing a very brief, low-frequency "pop" or "click".
const softClickBase64 = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

// More audible synthetic click (a short sine wave beep)
// Using AudioContext is generally better for generated UI sounds
let audioCtx = null;

export const playClickSound = () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    // Frequency of the click
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);

    // Volume envelope
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
  } catch (error) {
    console.warn("AudioContext not supported or failed to play", error);
    // Fallback to basic HTML5 audio
    const audio = new Audio(softClickBase64);
    audio.volume = 0.5;
    audio.play().catch(e => console.warn("Audio play failed:", e));
  }
};
