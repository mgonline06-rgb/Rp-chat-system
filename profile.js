// -------------------------------------------------------
// SCROLL-THEMED EDITABLE CHARACTER SHEET
// -------------------------------------------------------

import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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

    <div class="scrollTop"></div>

    <div class="scrollContent">

      <div class="profileHeader">
        <img src="${avatar}">
        <div>
          <input class="rpNameInput" value="${rpName}" />
          <small>@${user}</small>
        </div>
      </div>

      <label>Bio:</label>
      <textarea class="bioInput">${bio}</textarea>

      <button class="saveProfile">Save</button>

      <h4>Message History:</h4>
      <div class="profileMessages" id="history-${user}">
        <i>Gathering scrolls…</i>
      </div>

    </div>

    <div class="scrollBottom"></div>
  `;

  // Close button
  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  // Save button
  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value;
    const newBio = win.querySelector(".bioInput").value;

    // TEMP LOCAL SAVE (Firebase version later)
    if (!window.rpProfiles) window.rpProfiles = {};
    window.rpProfiles[user] = {
      rpName: newName,
      bio: newBio
    };

    alert("Character sheet saved!");
  });

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
}

// -------------------------------------------------------
// LOAD USER MESSAGE HISTORY
// -------------------------------------------------------
function loadUserMessageHistory(targetUser, containerId) {
  if (!window.db || !window.roomCode) return;

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const messagesRef = ref(window.db, "rooms/" + window.roomCode + "/messages");

  onChildAdded(messagesRef, snap => {
    const msg = snap.val();
    if (msg.user === targetUser) {
      const p = document.createElement("p");
      p.textContent = msg.text;
      container.appendChild(p);
    }
  });
}
