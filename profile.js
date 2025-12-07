// -------------------------------------------------------
// FANTASY CHARACTER SHEET (MATCHES NEW UI)
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
  
  // Remove any existing sheet
  const old = document.querySelector(".profileWindow");
  if (old) old.remove();

  // Create window
  const win = document.createElement("div");
  win.classList.add("profileWindow");
  
  win.innerHTML = `
    <div class="profileCard">
      <button class="closeProfile">✖</button>

      <h2 class="profileTitle">Character Sheet</h2>

      <div class="profileHeader">
        <img class="profileAvatar" src="${avatar || ""}">
        <div class="profileIdentity">
          <input class="rpNameInput" value="${rpName}" />
          <small class="profileUser">@${user}</small>
        </div>
      </div>

      <label class="sectionLabel">Bio:</label>
      <textarea class="bioInput">${bio}</textarea>

      <button class="primary saveProfile">Save</button>

      <h3 class="sectionHeader">Message History</h3>
      <div class="profileMessages" id="history-${user}">
        <i>Gathering scrolls...</i>
      </div>
    </div>
  `;

  // Close button
  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  // Save button
  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value.trim();
    const newBio = win.querySelector(".bioInput").value.trim();

    if (!window.rpProfiles) window.rpProfiles = {};
    window.rpProfiles[user] = {
      rpName: newName,
      bio: newBio
    };

    alert("Your scroll has been updated.");
  });

  document.body.appendChild(win);

  // Load message history
  loadUserMessageHistory(user, `history-${user}`);
}

// -------------------------------------------------------
// LOAD USER MESSAGE HISTORY
// -------------------------------------------------------
function loadUserMessageHistory(targetUser, containerId) {
  const db = window.db;
  const room = window.getCurrentRoom && window.getCurrentRoom();
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
