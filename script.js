const doorScreen = document.getElementById("doorScreen");
const leftDoor = document.querySelector(".door-left");
const rightDoor = document.querySelector(".door-right");
const openInvitation = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");

const musicButton = document.getElementById("musicButton");
const topButton = document.getElementById("topButton");
const rsvpButton = document.getElementById("rsvpButton");
const mapButton = document.getElementById("mapButton");

let opened = false;
let audioContext = null;
let musicTimer = null;
let musicOn = false;
let noteIndex = 0;


/* =====================================================
   RESPONSIVE SCREEN SIZE
   Works on:
   Mobile
   Tablet
   Laptop
   Desktop
===================================================== */

function setScreenSize() {

  const vh = window.innerHeight * 0.01;
  const vw = window.innerWidth * 0.01;

  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);

  // Update device type
  if (window.innerWidth <= 600) {

    document.body.classList.add("mobile");
    document.body.classList.remove("tablet", "desktop");

  } else if (window.innerWidth <= 1024) {

    document.body.classList.add("tablet");
    document.body.classList.remove("mobile", "desktop");

  } else {

    document.body.classList.add("desktop");
    document.body.classList.remove("mobile", "tablet");
  }
}


// Run when website opens
setScreenSize();

// Run whenever screen size changes
window.addEventListener("resize", setScreenSize);

// Run when phone/tablet changes orientation
window.addEventListener("orientationchange", () => {
  setTimeout(setScreenSize, 300);
});


/* =====================================================
   DOOR
===================================================== */

function openDoors() {

  if (opened) return;

  opened = true;

  leftDoor.classList.add("open");
  rightDoor.classList.add("open");

  /*
    Doors take exactly 2 seconds to open.
  */

  setTimeout(() => {

    invitation.classList.add("show");

    doorScreen.style.display = "none";

    document.body.style.overflow = "auto";

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    startPeacefulMusic();

  }, 2000);
}


openInvitation.addEventListener("click", openDoors);


doorScreen.addEventListener("click", (event) => {

  if (event.target !== openInvitation) {
    openDoors();
  }

});


/* =====================================================
   SMOOTH NAVIGATION
===================================================== */

document.querySelectorAll(".navbar a, .hero a").forEach((link) => {

  link.addEventListener("click", (event) => {

    const id = link.getAttribute("href");

    if (!id || !id.startsWith("#")) return;

    event.preventDefault();

    const target = document.querySelector(id);

    if (target) {

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  });

});


/* =====================================================
   PEACEFUL MUSIC
===================================================== */

const notes = [
  261.63,
  329.63,
  392.00,
  329.63,
  293.66,
  349.23,
  440.00,
  349.23
];


function playNote() {

  if (!audioContext || !musicOn) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";

  oscillator.frequency.value =
    notes[noteIndex % notes.length];

  const now = audioContext.currentTime;

  gain.gain.setValueAtTime(0, now);

  gain.gain.linearRampToValueAtTime(
    0.045,
    now + 0.08
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    now + 1.4
  );

  oscillator.connect(gain);

  gain.connect(audioContext.destination);

  oscillator.start(now);

  oscillator.stop(now + 1.4);

  noteIndex++;
}


function startPeacefulMusic() {

  if (musicOn) return;

  audioContext =
    new (window.AudioContext ||
      window.webkitAudioContext)();

  musicOn = true;

  musicButton.textContent = "🔊";

  playNote();

  musicTimer = setInterval(
    playNote,
    1500
  );
}


function stopPeacefulMusic() {

  musicOn = false;

  if (musicTimer) {

    clearInterval(musicTimer);

    musicTimer = null;
  }

  if (audioContext) {

    audioContext.close();

    audioContext = null;
  }

  musicButton.textContent = "🔇";
}


musicButton.addEventListener("click", () => {

  if (musicOn) {

    stopPeacefulMusic();

  } else {

    startPeacefulMusic();

  }

});


/* =====================================================
   RSVP
===================================================== */

rsvpButton.addEventListener("click", () => {

  alert(
    "Thank you! We are happy to celebrate this special day with you. ❤️"
  );

});


/* =====================================================
   MAP
===================================================== */

mapButton.addEventListener("click", () => {

  const latitude = 17.20977417967234;
  const longitude = 78.60111054881027;

  /*
    Always opens the same location.
  */

  const url =
    `https://www.google.com/maps/place/PALLAVI+BANQUETS/@17.2097768,78.6011426,20.33z/data=!4m6!3m5!1s0x3bcba7006429d68b:0xdafa10b54c839c31!8m2!3d17.2097509!4d78.6011126!16s%2Fg%2F11x5nkkz8w?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D=${latitude},${longitude}`;

  window.open(url, "_blank");

});


/* =====================================================
   BACK TO TOP
===================================================== */

window.addEventListener("scroll", () => {

  if (window.scrollY > 500) {

    topButton.classList.add("visible");

  } else {

    topButton.classList.remove("visible");

  }

});


topButton.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


/* =====================================================
   PREVENT PAGE SCROLL BEFORE DOORS OPEN
===================================================== */

document.body.style.overflow = "hidden";


/* =====================================================
   MOBILE TOUCH SUPPORT
===================================================== */

document.addEventListener(
  "touchstart",
  () => {

    if (
      audioContext &&
      audioContext.state === "suspended"
    ) {

      audioContext.resume();

    }

  },
  { passive: true }
);