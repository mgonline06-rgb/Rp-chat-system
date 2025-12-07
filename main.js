// -------------------------------------------------------
// Firebase v12 imports
// -------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  off
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

import { openCharacterSheetFromChat } from "./profile.js";
import { handleMentions } from "./mentions.js";

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

// -------------------------------------------------------
// Init Firebase
// -------------------------------------------------------
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
window.db = db;

// -------------------------------------------------------
// UI elements
// -------------------------------------------------------
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const messageInput = document.getElementById("messageInput");
const avatarInput = document.getElementById("avatar");
const roomInput = document.getElementById("roomCode");
const currentRoomSpan = document.getElementById("currentRoom");
const copyBtn = document.getElementById("copyRoomBtn");

let avatarURL = "";
let username = "";
let roomCode = "";

// -------------------------------------------------------
// Avatar upload
// -------------------------------------------------------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => avatarURL = e.target.result;
    reader.readAsDataURL(file);
  }
});

// -------------------------------------------------------
// Join room
// -------------------------------------------------------
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username) return alert("Please enter a username.");
  if (password !== "1234") return alert("Password incorrect.");

  let inputRoom = roomInput.value.trim();
  roomCode = inputRoom ? inputRoom.toUpperCase() :
                         Math.random().toString(36).substring(2, 8).toUpperCase();

  window.roomCode = roomCode; // make available to profile.js
  currentRoomSpan.textContent = roomCode;

  loginDiv.style.display = "none";
  chatDiv.style.display = "block";
  messagesDiv.innerHTML = "";

  const messagesRef = ref(db, "rooms/" + roomCode + "/messages");
  off(messagesRef); // prevent duplicate listeners

  onChildAdded(messagesRef, snap => {
    const data = snap.val();
    addMessage(data.user, data.text, data.avatar);
  });

  addMessage("System", `Welcome ${username}!`);
});

// -------------------------------------------------------
// Copy room code
// -------------------------------------------------------
copyBtn.addEventListener("click", () => {
  if (roomCode) navigator.clipboard.writeText(roomCode);
});

// -------------------------------------------------------
// Send message
// -------------------------------------------------------
sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  push(ref(db, "rooms/" + roomCode + "/messages"), {
    user: username,
    text: msg,
    avatar: avatarURL
  });

  messageInput.value = "";
});

// -------------------------------------------------------
// Add message to chat
// -------------------------------------------------------
function addMessage(user, text, avatar) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message");

  const imgEl = document.createElement("img");
  imgEl.src = avatar || "";
  const textEl = document.createElement("span");
  textEl.textContent = `${user}: ${text}`;

  msgEl.append(imgEl);
  msgEl.append(textEl);

  // Mentions.js handler
  handleMentions(msgEl, user, text, username, messageInput);

  // Default click → open character sheet
  msgEl.addEventListener("click", e => {
    if (e.shiftKey) return; // mention already handled

    openCharacterSheetFromChat({
      user,
      avatar: avatar || "",
      rpName: user,
      bio: ""
    });
  });

  messagesDiv.append(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
