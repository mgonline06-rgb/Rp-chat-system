export function handleMentions(messageElement, user, text, currentUser, inputBox) {

  const regex = /@([a-zA-Z0-9_]+)/g;
  const matches = text.match(regex);
  if (!matches) return;

  matches.forEach(tag => {
    const mentioned = tag.replace("@", "").trim();

    // Highlight keyword inside message
    messageElement.innerHTML = messageElement.innerHTML.replace(
      tag,
      `<span class="mention" style="color: gold; font-weight: bold;">${tag}</span>`
    );

    // 🔔 If CURRENT user is mentioned → play ping
    if (mentioned === currentUser) {
      const ping = document.getElementById("pingSound");
      ping.currentTime = 0;
      ping.play();

      messageElement.classList.add("mentionHighlight");
    }
  });
}
