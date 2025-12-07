// -------------------------------------------------------
// SCROLL-THEMED EDITABLE CHARACTER SHEET
// -------------------------------------------------------

import {
  ref,
  onChildAdded,
  set,
  get
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export function openCharacterSheetFromChat(player) {
  const profileRef = ref(window.db, "rooms/" + window.roomCode + "/profiles/" + player.user);

  get(profileRef).then(snapshot => {
    if (snapshot.exists()) {
      const saved = snapshot.val();
      openCharacterSheet(
        player.user,
        saved.avatar || player.avatar,
        saved.rpName || player.user,
        saved.bio || ""
      );
    } else {
      openCharacterSheet(
        player.user,
        player.avatar,
        player.rpName || player.user,
        player.bio || ""
      );
    }
  });
}

function openCharacterSheet(user, avatar, rpName, bio) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <div class="scrollContent">

      <div class="profileHeader">
        <img src="${avatar}">
        <div>
          <input class="rpNameInput" value="${rpName}">
          <small>@${user}</small>
        </div>
      </div>

      <label>Bio:</label>
      <textarea class="bioInput">${bio}</textarea>

      <button class="saveProfile">Save</button>

      <h4>Message History:</h4>
      <div class="profileMessages" id="history-${user}">
        <i>Gathering scrolls...</i>
      </div>

    </div>
  `;

  // Close
  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  // Save to Firebase
  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value;
    const newBio = win.querySelector(".bioInput").value;

    const profileRef = ref(window.db, "rooms/" + window.roomCode + "/profiles/" + user);

    set(profileRef, {
      rpName: newName,
      bio: newBio,
      avatar: avatar
    });

    alert("Profile saved to the realm!");
  });

  document.body.appendChild(win);
  loadUserMessageHistory(user, "history-" + user);
}

// -------------------------------------------------------
// Load user message history
// -------------------------------------------------------
function loadUserMessageHistory(targetUser, containerId) {
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

