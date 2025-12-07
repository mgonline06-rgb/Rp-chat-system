// Handle highlighting mentions, and shift-click helper
export function handleMentions(
  msgEl,
  user,
  text,
  myName,
  messageInput,
  pingAudio
) {
  if (!text) return;

  const lower = text.toLowerCase();
  const myTag = "@" + myName.toLowerCase();

  // If this message mentions me, highlight & ping
  if (lower.includes(myTag)) {
    msgEl.classList.add("mentionHit");
    if (pingAudio) {
      pingAudio.currentTime = 0;
      pingAudio
        .play()
        .catch(() => {
          /* user hasn't interacted yet – ignore */
        });
    }
  }

  // Shift-click a message → prefill "@username "
  msgEl.addEventListener("click", event => {
    if (event.shiftKey && user && user !== "System") {
      const at = "@" + user + " ";
      if (!messageInput.value.includes(at)) {
        messageInput.value =
          (messageInput.value ? messageInput.value + " " : "") + at;
        messageInput.focus();
      }
    }
  });
}
