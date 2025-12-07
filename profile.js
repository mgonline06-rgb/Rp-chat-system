// -------------------------------------------------------
// Character sheet module
// -------------------------------------------------------
import {
  ref,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export function openCharacterSheetFromChat(player) {
  const stored = loadProfile(player.user);
  const rpName = stored?.rpName || player.rpName || player.user;
  const bio = stored?.bio || "";

  createSheet({
    user: player.user,
    avatar: player.avatar || "",
    rpName,
    bio
  });
}

// -------------------------------------------------------
// Create window
// -------------------------------------------------------
function createSheet({ user, avatar, rpName, bio }) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <div class="profileHeaderBar">
      <strong>Character Sheet</strong>
      <button class="closeProfileBtn" aria-label="Close">×</button>
    </div>

    <div class="scrollContent">
      <div class="profileHeader">
        <img src="${avatar || ""}" alt="">
        <div>
          <input class="rpNameInput" value="${rpName}" />
          <br />
          <small>@${user}</small>
        </div>
      </div>

      <label>Bio:</label>
      <textarea class="bioInput" placeholder="Who are you in this realm?">${bio}</textarea>

      <button class="saveProfileBtn">Save</button>

      <label style="margin-top:10px;">Message History:</label>
      <div class="profileMessages" id="history-${user}">
        <i>Gathering scrolls…</i>
      </div>
    </div>
  `;

  document.body.appendChild(win);

  // close button
  win.querySelector(".closeProfileBtn").addEventListener("click", () => {
    win.remove();
  });

  // save button
  win.querySelector(".saveProfileBtn").addEventListener("click", () => {
    const newName = win.querySelector(".rpNameInput").value.trim() || user;
    const newBio = win.querySelector(".bioInput").value;

    saveProfile(user, { rpName: newName, bio: newBio });
    alert("Character sheet saved on this device.");
  });

  // load history
  loadHistory(user, `history-${user}`);
}

// -------------------------------------------------------
// Local storage helpers
// -------------------------------------------------------
function storageKey(user) {
  return `rpProfile:${user}`;
}

function loadProfile(user) {
  try {
    const raw = localStorage.getItem(storageKey(user));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveProfile(user, data) {
  try {
    localStorage.setItem(storageKey(user), JSON.stringify(data));
  } catch (e) {
    // ignore
  }
}

// -------------------------------------------------------
// Load message history for user in current room
// -------------------------------------------------------
function loadHistory(targetUser, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const db = window.db;
  const roomCode = window.roomCode;
  if (!db || !roomCode) {
    container.innerHTML = "<i>No room data available.</i>";
    return;
  }

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
