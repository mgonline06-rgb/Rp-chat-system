// -------------------------------------------------------
// Firebase imports
// -------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  onValue,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

import { handleMentions } from "./mentions.js";
import { openCharacterSheetFromChat } from "./profile.js";
import { censorMessage } from "./swearFilter.js";

// -------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDvj83bdrUn2WXrNHFz0e2HNqoWLNlgDc0",
  authDomain: "rp-system-01.firebaseapp.com",
  databaseURL: "https://rp-system-01-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rp-system-01",
  storageBucket: "rp-system-01.firebasestorage.app",
  messagingSenderId: "594537856244",
  appId: "1:594537856244:web:8311aaed52979b647772a1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// expose for profile.js
window.db = db;

// -------------------------------------------------------
let username = "";
let avatarURL = "";
let roomCode = "";

window.getCurrentRoom = () => roomCode;

// UI references
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const avatarInput = document.getElementById("avatar");
const roomInput = document.getElementById("roomCode");
const joinBtn = document.getElementById("joinBtn");

const currentRoomSpan = document.getElementById("currentRoom");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const playerList = document.getElementById("playerList");

avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => avatarURL = e.target.result;
  reader.readAsDataURL(file);
});

// JOIN ROOM
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (!username) return alert("Enter a username.");
  if (passwordInput.value.trim() !== "1234") return alert("Wrong password.");

  roomCode = roomInput.value.trim().toUpperCase();
  if (!roomCode) {
    roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    alert("Room created: " + roomCode);
  }

  currentRoomSpan.textContent = roomCode;

  loginDiv.style.display = "none";
  chatDiv.style.display = "block";

  messagesDiv.innerHTML = "";

  loadMessages();
  registerPlayer();
});

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  let text = messageInput.value.trim();
  if (!text) return;

  text = censorMessage(text);

  push(ref(db, `rooms/${roomCode}/messages`), {
    user: username,
    avatar: avatarURL,
    text,
    time: Date.now()
  });

  messageInput.value = "";
}

// -------------------------------------------------------
function loadMessages() {
  const messagesRef = ref(db, `rooms/${roomCode}/messages`);

  onChildAdded(messagesRef, snap => {
    const msg = snap.val();
    displayMessage(msg.user, msg.text, msg.avatar);
  });
}

// -------------------------------------------------------
// ONLY ONE SHEET OPEN
let openProfileWindow = null;

function displayMessage(user, text, avatar) {
  const row = document.createElement("div");
  row.classList.add("messageRow");

  const avatarEl = document.createElement("img");
  avatarEl.classList.add("chatAvatar");
  avatarEl.src = avatar || "";
  avatarEl.style.cursor = "pointer";

  const textEl = document.createElement("div");
  textEl.classList.add("msgText");
  textEl.innerHTML = `<strong>${user}:</strong> ${text}`;

  row.append(avatarEl, textEl);

  avatarEl.addEventListener("click", () => {
    if (openProfileWindow && openProfileWindow.isConnected) {
      openProfileWindow.remove();
    }
    openProfileWindow = openCharacterSheetFromChat({ user, avatar });
  });

  handleMentions(row, user, text, username, messageInput);

  messagesDiv.appendChild(row);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// -------------------------------------------------------
function registerPlayer() {
  const playerRef = ref(db, `rooms/${roomCode}/players/${username}`);

  set(playerRef, { name: username, avatar: avatarURL });

  window.addEventListener("beforeunload", () => remove(playerRef));

  onValue(ref(db, `rooms/${roomCode}/players`), snap => {
    playerList.innerHTML = "";
    snap.forEach(child => {
      const p = child.val();
      const li = document.createElement("li");

      li.innerHTML = `<img src="${p.avatar}"><span>${p.name}</span>`;
      playerList.appendChild(li);
    });
  });
}
