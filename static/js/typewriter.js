const messages = [
  "Search any test instantly — just type two letters!",
  "Use the 🎤 button to search by voice.",
  "Click 'All Tests' to see our full catalogue with prices.",
  "Admins can add or update tests using the Toggle Admin panel."
];
let messageIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const el = document.getElementById('typewriter');
  const current = messages[messageIndex];
  
  if (!isDeleting) {
    el.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 2000);
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
  setTimeout(typeWriter, isDeleting ? 50 : 100);
}

document.addEventListener('DOMContentLoaded', typeWriter);
