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

// Character sheet + mentions + swear filter
import { openCharacterSheetFromChat } from "./profile.js";
import { handleMentions } from "./mentions.js";
import { filterMessage } from "./filter.js";

// -------------------------------------------------------
// Firebase config
// -------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDvj83bdrUn2WXrNHFz0e2HNqoWLNlgDc0",
  authDomain: "rp-system-01.firebaseapp.com",
  databaseURL:
    "https://rp-system-01-default-rtdb.europe-west1.firebasedatabase.app",
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

// make available to profile.js
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
const messageInput = document.getElementById("messageInput");
const avatarInput = document.getElementById("avatar");
const roomInput = document.getElementById("roomCode");
const currentRoomSpan = document.getElementById("currentRoom");
const copyBtn = document.getElementById("copyRoomBtn");

// -------------------------------------------------------
// Global state
// -------------------------------------------------------
let avatarURL = "";
let username = "";
let roomCode = "";

// -------------------------------------------------------
// Avatar upload
// -------------------------------------------------------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    avatarURL = e.target.result;
  };
  reader.readAsDataURL(file);
});

// -------------------------------------------------------
// Join room
// -------------------------------------------------------
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username) {
    alert("Enter a username!");
    return;
  }
  if (password !== "1234") {
    alert("Incorrect password!");
    return;
  }

  let inputRoom = roomInput.value.trim();

  if (!inputRoom) {
    roomCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    alert("Room created! Share this code: " + roomCode);
  } else {
    roomCode = inputRoom.toUpperCase();
  }

  currentRoomSpan.textContent = roomCode;
  window.roomCode = roomCode; // for profile.js

  loginDiv.style.display = "none";
  chatDiv.style.display = "block";

  // load messages for this room
  messagesDiv.innerHTML = "";

  const messagesRef = ref(db, "rooms/" + roomCode + "/messages");
  off(messagesRef); // avoid duplicate listeners

  onChildAdded(messagesRef, snap => {
    const data = snap.val();
    addMessage(data.user, data.text, data.avatar, false);
  });

  addMessage("System", `Welcome ${username}!`, "", true);
});

// -------------------------------------------------------
// Copy room code
// -------------------------------------------------------
copyBtn.addEventListener("click", () => {
  if (!roomCode) return;
  navigator.clipboard.writeText(roomCode);
});

// -------------------------------------------------------
// Send message
// -------------------------------------------------------
sendBtn.addEventListener("click", sendCurrentMessage);
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendCurrentMessage();
  }
});

function sendCurrentMessage() {
  const raw = messageInput.value.trim();
  if (!raw || !roomCode) return;

  const text = filterMessage(raw); // apply swear filter

  const msgData = {
    user: username,
    text,
    avatar: avatarURL
  };

  push(ref(db, "rooms/" + roomCode + "/messages"), msgData);
  messageInput.value = "";
}

// -------------------------------------------------------
// Show a message in chat
// -------------------------------------------------------
function addMessage(user, text, avatar, isSystem) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message");
  if (isSystem || user === "System") {
    msgEl.classList.add("system");
  }

  const imgEl = document.createElement("img");
  imgEl.src = avatar || "";
  const textEl = document.createElement("span");
  textEl.textContent = `${user}: ${text}`;

  msgEl.append(imgEl);
  msgEl.append(textEl);

  // Mentions + click to open character sheet
  handleMentions(msgEl, {
    sender: user,
    text,
    currentUser: username,
    inputEl: messageInput,
    openProfile: () => {
      openCharacterSheetFromChat({
        user,
        avatar,
        rpName: user
      });
    }
  });

  messagesDiv.append(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
