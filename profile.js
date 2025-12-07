// -------------------------------------------------------
// PROFILE SYSTEM (SAFE SEPARATE MODULE)
// -------------------------------------------------------

// Allow main.js to call this
export function openCharacterSheetFromChat(player) {
  openCharacterSheet(player.user, player.avatar, player.rpName, player.bio);
}

// -------------------------------------------------------
// Create a popup window showing character info + message history
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

    <p><b>CHARACTER NAME:</b><br>${rpName}</p>

    <p><b>CHARACTER BIO:</b><br>${bio.replace(/\n/g, "<br>")}</p>

    <h4>Message History:</h4>
    <div class="profileMessages" id="history-${user}">
      Loading...
    </div>
  `;

  // Close button
  win.querySelector(".closeProfile").addEventListener("click", () => {
    win.remove();
  });

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
}

// -------------------------------------------------------
// Load message history (non-destructive)
// -------------------------------------------------------
function loadUserMessageHistory(username, containerId) {
  if (!window.roomCode || !window.db) {
    console.warn("Chat not initialized yet.");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const messagesRef = ref(window.db, "rooms/" + window.roomCode + "/messages");

  onChildAdded(messagesRef, snap => {
    const data = snap.val();

    if (data.user === username) {
      const p = document.createElement("p");
      p.textContent = data.text;
      container.appendChild(p);
    }
  });
}
