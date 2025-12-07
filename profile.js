import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export function openCharacterSheetFromChat(player) {
  const saved = window.rpProfiles?.[player.user] || {};
  openCharacterSheet(
    player.user,
    player.avatar,
    saved.rpName || player.user,
    saved.bio || ""
  );
}

function openCharacterSheet(user, avatar, rpName, bio) {

  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <div class="profileHeader">
      <img src="${avatar || ""}">
      <div>
        <input class="rpNameInput" value="${rpName}">
        <small>@${user}</small>
      </div>
    </div>

    <label>Bio:</label>
    <textarea class="bioInput">${bio}</textarea>

    <button class="primary saveProfile" style="margin-top:10px;">Save</button>

    <h4>Message History:</h4>
    <div class="profileMessages" id="history-${user}">
      <i>Gathering scrolls…</i>
    </div>
  `;

  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value;
    const newBio = win.querySelector(".bioInput").value;

    if (!window.rpProfiles) window.rpProfiles = {};
    window.rpProfiles[user] = { rpName: newName, bio: newBio };

    alert("Character sheet saved.");
  });

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
}

function loadUserMessageHistory(targetUser, containerId) {
  const db = window.db;
  const room = window.getCurrentRoom?.();
  if (!db || !room) return;

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const messagesRef = ref(db, "rooms/" + room + "/messages");

  onChildAdded(messagesRef, snap => {
    const msg = snap.val();
    if (msg.user === targetUser) {
      const p = document.createElement("p");
      p.textContent = msg.text;
      container.appendChild(p);
    }
  });
}
