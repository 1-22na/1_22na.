/* ===================== PERSONALIZE HERE ===================== */
const CONFIG = {
  birthdayName: 'Your Favorite Person',
  birthdayDate: '2026-09-25T00:00:00', // Change this to the birthday date and time: YYYY-MM-DDTHH:MM:SS
  openingMessage: 'You make ordinary days feel like little celebrations. Today, the celebration is all yours.',
  typingMessage: 'I hope this next chapter brings you the kind of joy you give so freely to everyone else. Thank you for being exactly who you are. The world is softer, brighter, and a whole lot more beautiful with you in it.',
  musicUrl: '' // Paste a direct .mp3 or .ogg URL here. Leave empty until you have one.
};
/* =================== END PERSONALIZATION =================== */

const welcomeScreen = document.getElementById('welcomeScreen');
const surpriseSite = document.getElementById('surpriseSite');
const openSurprise = document.getElementById('openSurprise');
const replaySurprise = document.getElementById('replaySurprise');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const music = document.getElementById('backgroundMusic');
const typingTarget = document.getElementById('typingMessage');
let countdownTimer;
let typingTimer;

function applyPersonalization() {
  document.getElementById('nameHeading').textContent = CONFIG.birthdayName;
  document.getElementById('footerName').textContent = CONFIG.birthdayName;
  document.getElementById('heroMessage').textContent = CONFIG.openingMessage;
  music.src = CONFIG.musicUrl;
}

function createConfetti() {
  const confetti = document.getElementById('confetti');
  const colors = ['#ff82b4', '#ffd57d', '#8cd5d5', '#fff1e9', '#a98ce0'];
  confetti.innerHTML = '';
  for (let index = 0; index < 75; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 240}px`);
    piece.style.animationDelay = `${Math.random() * 1.4}s`;
    confetti.appendChild(piece);
  }
}

function typeMessage() {
  window.clearInterval(typingTimer);
  typingTarget.textContent = '';
  let characterIndex = 0;
  typingTimer = window.setInterval(() => {
    typingTarget.textContent += CONFIG.typingMessage[characterIndex];
    characterIndex += 1;
    if (characterIndex >= CONFIG.typingMessage.length) window.clearInterval(typingTimer);
  }, 28);
}

function startCountdown() {
  window.clearInterval(countdownTimer);
  const birthday = new Date(CONFIG.birthdayDate).getTime();
  const update = () => {
    const remaining = Math.max(0, birthday - Date.now());
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  };
  update();
  countdownTimer = window.setInterval(update, 1000);
}

function revealVisibleElements() {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

async function toggleMusic() {
  if (!CONFIG.musicUrl) {
    musicLabel.textContent = 'Add music URL';
    window.setTimeout(() => { musicLabel.textContent = 'Play music'; }, 2200);
    return;
  }
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add('is-playing');
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Pause background music');
      musicLabel.textContent = 'Pause music';
    } catch (error) {
      musicLabel.textContent = 'Tap to play';
    }
  } else {
    music.pause();
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.setAttribute('aria-label', 'Play background music');
    musicLabel.textContent = 'Play music';
  }
}

function openTheSurprise() {
  welcomeScreen.style.display = 'none';
  surpriseSite.classList.add('is-open');
  surpriseSite.setAttribute('aria-hidden', 'false');
  document.body.classList.add('surprise-open');
  createConfetti();
  typeMessage();
  startCountdown();
  revealVisibleElements();
  window.scrollTo(0, 0);
}

function replayTheSurprise() {
  surpriseSite.classList.remove('is-open');
  surpriseSite.setAttribute('aria-hidden', 'true');
  welcomeScreen.style.display = 'grid';
  window.scrollTo(0, 0);
  window.setTimeout(openTheSurprise, 80);
}

applyPersonalization();
openSurprise.addEventListener('click', openTheSurprise);
replaySurprise.addEventListener('click', replayTheSurprise);
musicToggle.addEventListener('click', toggleMusic);
