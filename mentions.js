// -------------------------------------------------------
// MENTION HIGHLIGHT + SHIFT-CLICK @MENTION SYSTEM
// -------------------------------------------------------

export function handleMentions(msgEl, user, text, currentUsername, messageInput) {

  // -------------------------------------------------------
  // HIGHLIGHT IF CURRENT USER IS MENTIONED
  // -------------------------------------------------------
  if (!currentUsername) return;

  const lowerText = text.toLowerCase();
  const lowerUser = currentUsername.toLowerCase();

  if (lowerText.includes("@" + lowerUser)) {
    msgEl.classList.add("mentionHighlight");
  }

  // -------------------------------------------------------
  // SHIFT-CLICK → INSERT @USERNAME INTO MESSAGE BOX
  // -------------------------------------------------------
  msgEl.addEventListener("click", (event) => {
    if (!event.shiftKey) return;

    messageInput.value = "@" + user + " ";
    messageInput.focus();
  });
}
