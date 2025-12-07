// -------------------------------------------------------
// Mention Highlight + Shift-Click @Mention System
// -------------------------------------------------------

export function handleMentions(msgEl, user, text, currentUser, messageInput) {

  // Highlight if message contains @you
  if (currentUser && text.toLowerCase().includes("@" + currentUser.toLowerCase())) {
    msgEl.classList.add("mentionHighlight");
  }

  // SHIFT-click → insert @mention
  msgEl.addEventListener("click", e => {
    if (e.shiftKey) {
      messageInput.value = "@" + user + " ";
      messageInput.focus();
    }
  });
}
