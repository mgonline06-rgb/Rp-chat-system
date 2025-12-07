// -------------------------------------------------------
// FANTASY CHARACTER SHEET POPUP
// -------------------------------------------------------

export function openCharacterSheetFromChat(player) {
  openCharacterSheet(player.user, player.avatar, player.rpName, player.bio);
}

function openCharacterSheet(user, avatar, rpName, bio) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <div class="profileHeader">
      <img src="${avatar}">
      <div>
        <b style="font-size:18px;">${rpName}</b><br>
        <small style="color:#4a2d00;">@${user}</small>
      </div>
    </div>

    <p><b>Character Name:</b><br>${rpName}</p>

    <p><b>Bio:</b><br>${bio.replace(/\n/g, "<br>")}</p>

    <h4>Message History</h4>
    <div class="profileMessages" id="history-${user}">
      <i>Gathering scrolls...</i>
    </div>
  `;

  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
}

function loadUserMessageHistory(targetUser, containerId) {
  if (!window.db || !window.roomCode) return;

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const messagesRef = ref(window.db, "rooms/" + window.roomCode + "/messages");

  onChildAdded(messagesRef, snap => {
    const data = snap.val();

    if (data.user === targetUser) {
      const p = document.createElement("p");
      p.textContent = data.text;
      container.appendChild(p);
    }
  });
}

