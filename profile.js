// -------------------------------------------------------
// SCROLL-THEMED EDITABLE CHARACTER SHEET (DRAGGABLE)
// -------------------------------------------------------

import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Called from main.js when clicking a player's message
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
    <div class="profileTitleBar">
        Character Sheet
        <button class="closeProfile">✖</button>
    </div>

    <div class="profileContent">

      <div class="profileHeader">
        <img src="${avatar || ""}">
        <div class="profileNameBlock">
          <input class="rpNameInput" value="${rpName}" />
          <small>@${user}</small>
        </div>
      </div>

      <label class="bioLabel">Bio:</label>
      <textarea class="bioInput">${bio}</textarea>

      <button class="saveProfile">Save</button>

      <h4>Message History:</h4>
      <div class="profileMessages" id="history-${user}">
        <i>Gathering scrolls…</i>
      </div>

    </div>
  `;

  // Close button
  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  // Save button → local memory for now
  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value;
    const newBio = win.querySelector(".bioInput").value;

    if (!window.rpProfiles) window.rpProfiles = {};
    window.rpProfiles[user] = {
      rpName: newName,
      bio: newBio
    };

    alert("Character sheet saved!");
  });

  document.body.appendChild(win);

  loadUserMessageHistory(user, `history-${user}`);
  makeDraggable(win); // enable dragging
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

// -------------------------------------------------------
// MAKE CHARACTER SHEET DRAGGABLE
// -------------------------------------------------------
function makeDraggable(win) {
  let isDown = false;
  let offsetX = 0;
  let offsetY = 0;

  const header = win.querySelector(".profileTitleBar");
  header.style.cursor = "grab";

  header.addEventListener("mousedown", (e) => {
    isDown = true;
    header.style.cursor = "grabbing";

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    win.style.transition = "none";
  });

  document.addEventListener("mouseup", () => {
    isDown = false;
    header.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    win.style.left = `${e.clientX - offsetX}px`;
    win.style.top = `${e.clientY - offsetY}px`;
  });
}
