export function handleMentions(msgEl, user, text, myName, inputBox) {
  
  if (text.includes("@"+myName)) {
    msgEl.style.border = "2px solid gold";
    msgEl.style.boxShadow = "0 0 10px gold";
  }

  msgEl.addEventListener("dblclick", () => {
    inputBox.value = `@${user} `;
    inputBox.focus();
  });
}

export function playPing() {
  const audio = new Audio("ping.mp3");
  audio.volume = 0.5;
  audio.play().catch(()=>{});
}
