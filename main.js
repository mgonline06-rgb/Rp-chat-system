// -------------------------------------------------------
// Firebase v12 imports
// -------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase, ref, push, onChildAdded, onDisconnect, set
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

import { openCharacterSheetFromChat } from "./profile.js";
import { filterBadWords } from "./wordfilter.js";
import { handleMentions, playPing } from "./mentions.js";

// -------------------------------------------------------
// Firebase config
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

// -------------------------------------------------------
// UI Elements
// -------------------------------------------------------
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const joinBtn = document.getElementById("joinBtn");

const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const roomInput = document.getElementById("roomCode");
const avatarInput = document.getElementById("avatar");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const playerList = document.getElementById("playerList");

let username = "";
let avatarURL = "";
let roomCode = "";

// Make available for profile.js
window.db = db;

// -------------------------------------------------------
// Avatar load
// -------------------------------------------------------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => avatarURL = e.target.result;
  reader.readAsDataURL(file);
});

// -------------------------------------------------------
// Join Room
// -------------------------------------------------------
joinBtn.addEventListener("click", () => {

  username = usernameInput.value.trim();
  const pass = passwordInput.value.trim();

  if (!username) return alert("Enter a username!");
  if (pass !== "1234") return alert("Wrong password!");

  roomCode = roomInput.value.trim() || Math.random().toString(36).substr(2,6).toUpperCase();
  document.getElementById("currentRoom").textContent = roomCode;

  loginDiv.classList.add("hidden");
  chatDiv.classList.remove("hidden");

  window.roomCode = roomCode;

  setupOnlineTracking();
  loadMessages();
});

// -------------------------------------------------------
// Track Who Is Online
// -------------------------------------------------------
function setupOnlineTracking() {
  const userRef = ref(db, `rooms/${roomCode}/players/${username}`);

  set(userRef, true);
  onDisconnect(userRef).remove();

  onChildAdded(ref(db, `rooms/${roomCode}/players`), snap => {
    updatePlayerList();
  });
}

function updatePlayerList() {
  playerList.innerHTML = "";

  const playersRef = ref(db, `rooms/${roomCode}/players`);
  onChildAdded(playersRef, snap => {
    const li = document.createElement("li");
    li.textContent = snap.key;
    playerList.appendChild(li);
  });
}

// -------------------------------------------------------
// Load Messages
// -------------------------------------------------------
function loadMessages() {
  const messagesRef = ref(db, `rooms/${roomCode}/messages`);

  onChildAdded(messagesRef, snap => {
    const msg = snap.val();
    addMessage(msg.user, msg.text, msg.avatar);

    if (msg.text.includes(`@${username}`)) {
      playPing();
    }
  });

  addMessage("System", `Welcome ${username}!`);
}

// -------------------------------------------------------
// Sending Messages
// -------------------------------------------------------
sendBtn.addEventListener("click", () => {

  let msg = messageInput.value.trim();
  if (!msg) return;

  msg = filterBadWords(msg);

  const msgData = {
    user: username,
    text: msg,
    avatar: avatarURL
  };

  push(ref(db, `rooms/${roomCode}/messages`), msgData);

  messageInput.value = "";
});

// -------------------------------------------------------
// Show Message in Chat
// -------------------------------------------------------
function addMessage(user, text, avatar) {

  const msgEl = document.createElement("div");
  msgEl.classList.add("message");

  const img = document.createElement("img");
  img.src = avatar || "";

  const span = document.createElement("span");
  span.textContent = `${user}: ${text}`;

  msgEl.append(img);
  msgEl.append(span);

  // Character sheet click
  msgEl.addEventListener("click", () => {
    openCharacterSheetFromChat({ user, avatar, rpName: user, bio: "" });
  });

  // Mentions highlight
  handleMentions(msgEl, user, text, username, messageInput);

  messagesDiv.append(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

