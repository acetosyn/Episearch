const messages = [
  "Search any test instantly — just type two letters!",
  "Use the 🎤 button to search by voice.",
  "Click 'All Tests' to see our full catalogue with prices.",
  "All test have their respective prices listed.",
];

let messageIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 50;    // faster typing
let deletingDelay = 30;  // faster deleting
let pauseDelay = 1000;   // pause between messages

function typeWriter() {
  const el = document.getElementById('typewriter');
  const current = messages[messageIndex];

  if (!isDeleting) {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeWriter, pauseDelay); // short pause at end
      return;
    }
  } else {
    el.textContent = current.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      messageIndex = (messageIndex + 1) % messages.length;
    }
  }

  setTimeout(typeWriter, isDeleting ? deletingDelay : typingDelay);
}

document.addEventListener('DOMContentLoaded', typeWriter);
// Ensure the typewriter effect starts after the DOM is fully loaded