// -------------------------------------------------------
// SCROLL-THEMED EDITABLE CHARACTER SHEET
// -------------------------------------------------------

import {
  ref,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export function openCharacterSheetFromChat(player) {
  openCharacterSheet(
    player.user,
    player.avatar,
    player.rpName || player.user,
    player.bio || ""
  );
}

function openCharacterSheet(user, avatar, rpName, bio) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <h3>Character Sheet</h3>

    <div class="profileHeader">
      <img src="${avatar || ""}">
      <div>
        <input class="rpNameInput" value="${rpName}" />
        <br/>
        <small>@${user}</small>
      </div>
    </div>

    <label>Bio:</label>
    <textarea class="bioInput">${bio}</textarea>

    <button class="primary saveProfile" style="margin-top:8px;">Save</button>

    <h4 style="margin-top:14px;">Message History:</h4>
    <div class="profileMessages" id="history-${user}">
      <i>Gathering scrolls…</i>
    </div>
  `;

  // Close button
  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  // Save button – stored locally per browser for now
  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value;
    const newBio = win.querySelector(".bioInput").value;

    if (!window.rpProfiles) window.rpProfiles = {};
    window.rpProfiles[user] = {
      rpName: newName,
      bio: newBio
    };

    alert("Character sheet saved (locally on this device).");
  });

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
}

// -------------------------------------------------------
// LOAD USER MESSAGE HISTORY FOR THIS CHARACTER
// -------------------------------------------------------
function loadUserMessageHistory(targetUser, containerId) {
  const db = window.db;
  const roomCode = window.getCurrentRoom && window.getCurrentRoom();
  if (!db || !roomCode) return;

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const messagesRef = ref(db, "rooms/" + roomCode + "/messages");

  onChildAdded(messagesRef, snap => {
    const msg = snap.val();
    if (msg.user === targetUser) {
      const p = document.createElement("p");
      p.textContent = msg.text;
      container.appendChild(p);
    }
  });
}
