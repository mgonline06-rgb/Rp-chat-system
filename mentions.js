export function handleMentions(messageEl, sender, text, currentUser, inputBox) {
  const pingSound = document.getElementById("pingSound");

  const words = text.split(" ");

  words.forEach(w => {
    if (w.toLowerCase() === ("@" + currentUser).toLowerCase()) {
      messageEl.style.boxShadow = "0 0 15px gold";

      pingSound.currentTime = 0;
      pingSound.play().catch(() => {});

      messageEl.style.background = "rgba(255,255,100,0.15)";

      if (inputBox) inputBox.focus();
    }
  });
}
