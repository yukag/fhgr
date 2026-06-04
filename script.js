document.addEventListener('DOMContentLoaded', () => {
  // --- SCROLL TRANSFORM NAVBAR ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- REVEAL ON SCROLL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- MARKETING VIDEO CUSTOM TRIGGER ---
  const videoContainer = document.getElementById('video-container');
  const videoElement = document.getElementById('marketing-video');
  const videoOverlay = document.getElementById('video-overlay');

  if (videoOverlay && videoElement) {
    videoOverlay.addEventListener('click', () => {
      videoOverlay.style.display = 'none';
      videoElement.setAttribute('controls', 'true');
      videoElement.play();
    });
  }

  // --- WEB AUDIO API SYNTHESIZER ---
  // Synthesizes cool retro mystery sound effects without requiring audio files!
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSynthSound(type) {
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'success') {
        // Mysterious high-tech double chime (arpeggio)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.36); // C6

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (type === 'error') {
        // Deep error buzzer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.4);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'click') {
        // Small typewriter key tick
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      console.warn('Web Audio synthesis not supported or blocked by browser policy.', e);
    }
  }

  // Add click sounds to terminal buttons
  const terminalBtns = document.querySelectorAll('.btn-terminal, .btn-primary');
  terminalBtns.forEach(btn => {
    btn.addEventListener('mousedown', () => playSynthSound('click'));
  });

  // --- INTERACTIVE RIDDLE TERMINAL LOGIC ---
  const riddleSubmit = document.getElementById('riddle-submit');
  const riddleInput = document.getElementById('riddle-input');
  const riddleOutput = document.getElementById('riddle-output');

  if (riddleSubmit && riddleInput && riddleOutput) {
    // Enable enter key submission
    riddleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        riddleSubmit.click();
      }
    });

    riddleSubmit.addEventListener('click', () => {
      const code = riddleInput.value.trim().toLowerCase();
      
      // The answer is "42" (found in hero.png as "BEWEISSTÜCK #42")
      // We will accept "42", "#42", "beweisstück 42", "beweisstück #42"
      if (code === '42' || code === '#42' || code.includes('42')) {
        playSynthSound('success');
        riddleOutput.className = 'terminal-output success';
        
        // Write the decoded transmission letter by letter for a hacker typing effect
        const successMessage = `[SYSTEM] CODE DECRYPTED: VALID.
--------------------------------------------
STANDORT: GEYSIER-PFAD, GRAUBÜNDEN
STATUS: BEWEISSTÜCK #42 BESTÄTIGT.
--------------------------------------------
DECODIERTE NACHRICHT:
"Die Spur führt tiefer in den Wald. Am Ende
des Pfads wartet das nächste Hörspiel. Nimm
die Akte mit und lade die App, um zu starten."
--------------------------------------------
[AUDIO-FREIGESCHALTET]`;
        
        riddleOutput.innerHTML = '';
        let index = 0;
        
        function typeWriter() {
          if (index < successMessage.length) {
            const char = successMessage.charAt(index);
            if (char === '\n') {
              riddleOutput.innerHTML += '<br>';
            } else {
              riddleOutput.innerHTML += char;
            }
            index++;
            setTimeout(typeWriter, 15);
          }
        }
        
        typeWriter();
        
        // Disable inputs upon success
        riddleInput.disabled = true;
        riddleSubmit.disabled = true;
        riddleInput.style.borderColor = 'var(--color-teal-neon)';
        riddleSubmit.style.opacity = '0.5';
        riddleSubmit.style.cursor = 'not-allowed';
      } else {
        // Failed attempt
        playSynthSound('error');
        riddleOutput.className = 'terminal-output error';
        riddleOutput.innerHTML = `[SYSTEM] FEHLER: CODE UNBEKANNT.<br>[SYSTEM] ZUGRIFF VERWEIGERT. Versuche es erneut.<br><span style="color: var(--color-text-muted)">Hinweis: Suche nach der Nummer des Beweisstücks auf dem Berggipfel-Foto.</span>`;
        
        // Shake animation on error
        const terminal = document.querySelector('.terminal-interface');
        terminal.style.animation = 'none';
        // force reflow
        void terminal.offsetWidth;
        
        terminal.style.animation = 'shakeTerminal 0.4s ease';
      }
    });
  }
});

// CSS shake keyframe dynamically injected for errors
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shakeTerminal {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
`;
document.head.appendChild(styleSheet);
