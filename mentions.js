// -------------------------------------------------------
// Mention handling
// -------------------------------------------------------
export function handleMentions(msgEl, options) {
  const { sender, text, currentUser, inputEl, openProfile } = options;

  // Highlight if this message mentions the current user
  if (currentUser && text && text.toLowerCase().includes("@" + currentUser.toLowerCase())) {
    msgEl.classList.add("mentioned");
  }

  // Click: open character sheet, but Shift+click inserts mention
  msgEl.addEventListener("click", event => {
    if (event.shiftKey) {
      inputEl.value = "@" + sender + " ";
      inputEl.focus();
      event.stopPropagation();
      return;
    }

    // normal click - open profile
    if (typeof openProfile === "function") {
      openProfile();
    }
  });
}
