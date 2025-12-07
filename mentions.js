export function handleMentions(msgEl, user, text, currentUser, inputBox) {

  // Highlight if this message mentions YOU
  if (text.includes("@" + currentUser)) {
    msgEl.classList.add("mentionGlow");
    setTimeout(() => msgEl.classList.remove("mentionGlow"), 2000);
  }

  // Shift + click a message → auto-mention that user
  msgEl.addEventListener("click", e => {
    if (e.shiftKey) {
      inputBox.value = "@" + user + " ";
      inputBox.focus();
    }
  });
}
