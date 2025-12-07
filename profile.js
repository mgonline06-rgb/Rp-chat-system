// -------------------------------------------------------
// PROFILE SYSTEM — SEPARATE & SAFE
// -------------------------------------------------------

// Called by main.js when a chat message is clicked
export function openCharacterSheetFromChat(player) {
  openCharacterSheet(player.user, player.avatar, player.rpName, player.bio);
}

// -------------------------------------------------------
// Create popup window showing character sheet
// -------------------------------------------------------
function openCharacterSheet(user, avatar, rpName, bio) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <div class="profileHeader">
      <img src="${avatar}">
      <div>
        <b>${rpName}</b><br>
        <small>@${user}</small>
      </div>
    </div>

    <p><b>CHARACTER NAME:</b><br> ${rpName}</p>

    <p><b>BIO:</b><br> ${bio.replace(/\n/g, "<br>")}</p>

    <h4>Message History</h4>
    <div class="profileMessages" id="history-${user}">
      Loading...
    </div>
  `;

  // Close window
  win.querySelector(".closeProfile").addEventListener("click", () => {
    win.remove();
  });

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
}

// -------------------------------------------------------
// Load message history for that user
// -------------------------------------------------------
function loadUserMessageHistory(targetUser, containerId) {
  // Make sure db & roomCode exist (main.js provides these)
  if (!window.db || !window.roomCode) {
    console.warn("Chat not ready yet.");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Firebase reference to messages
  const messagesRef = ref(w

