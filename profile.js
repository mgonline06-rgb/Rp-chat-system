import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

export function openCharacterSheetFromChat(player) {
  openCharacterSheet(player.user, player.avatar);
}

function openCharacterSheet(user, avatar) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <h2>${user}</h2>
    <img src="${avatar}">
    
    <h3>Bio</h3>
    <textarea class="bioInput">No bio yet.</textarea>

    <h3>Message History</h3>
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
    const msg = snap.val();
    if (msg.user === targetUser) {
      const p = document.createElement("p");
      p.textContent = msg.text;
      container.appendChild(p);
    }
  });
}
