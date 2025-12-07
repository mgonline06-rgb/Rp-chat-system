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

// Character sheet + mentions + filter
import { openCharacterSheetFromChat } from "./profile.js";
import { handleMentions } from "./mentions.js";
import { filterBadWords } from "./swearFilter.js";

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

// Expose to profile.js
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
const playerListEl = document.getElementById("playerList");
const pingAudio = document.getElementById("pingSound");

// -------------------------------------------------------
// Global State
// -------------------------------------------------------
let avatarURL = "";
let username = "";
let roomCode = "";
const playersInRoom = new Set();

// helper so profile.js can read room
window.getCurrentRoom = () => roomCode;

// -------------------------------------------------------
// Avatar Upload
// -------------------------------------------------------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      avatarURL = e.target.result;
    };
    reader.readAsDataURL(file);
  }
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

  // Always uppercase
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
  window.roomCode = roomCode;

  // Switch screens
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";

  // Clear prior messages
  messagesDiv.innerHTML = "";
  playersInRoom.clear();
  renderPlayerList();

  const messagesRef = ref(db, "rooms/" + roomCode + "/messages");

  // Remove old listeners
  off(messagesRef);

  // Listen for messages in this room
  onChildAdded(messagesRef, snap => {
    const data = snap.val();
    addMessage(data.user, data.text, data.avatar);
  });

  addMessage("System", `Welcome ${username}!`, "");
});

// -------------------------------------------------------
// Copy room code
// -------------------------------------------------------
copyBtn.addEventListener("click", () =>
  navigator.clipboard.writeText(roomCode)
);

// -------------------------------------------------------
// Send a message
// -------------------------------------------------------
sendBtn.addEventListener("click", () => {
  let msg = messageInput.value.trim();
  if (!msg) return;

  // Filter swears before sending
  msg = filterBadWords(msg);

  const msgData = {
    user: username,
    text: msg,
    avatar: avatarURL
  };

  push(ref(db, "rooms/" + roomCode + "/messages"), msgData);

  messageInput.value = "";
});

// also send on Enter
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendBtn.click();
  }
});

// -------------------------------------------------------
// Add / show message in chat
// -------------------------------------------------------
function addMessage(user, text, avatar) {
  const msgEl = document.createElement("div");
  msgEl.classList.add("message");
  if (user === "System") {
    msgEl.classList.add("system");
  }

  const imgEl = document.createElement("img");
  imgEl.src = avatar || "";

  const textEl = document.createElement("span");
  textEl.textContent = `${user}: ${text}`;

  msgEl.append(imgEl, textEl);

  // Update player list (ignore "System")
  if (user && user !== "System") {
    playersInRoom.add(user);
    renderPlayerList();
  }

  // Click → open character sheet
  msgEl.addEventListener("click", () => {
    openCharacterSheetFromChat({
      user,
      avatar,
      rpName: user,
      bio: window.rpProfiles?.[user]?.bio || "No bio yet."
    });
  });

  // mentions: highlight & ping, plus shift-click helper
  handleMentions(msgEl, user, text, username, messageInput, pingAudio);

  messagesDiv.append(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// -------------------------------------------------------
// Player list rendering
// -------------------------------------------------------
function renderPlayerList() {
  playerListEl.innerHTML = "";
  Array.from(playersInRoom)
    .sort((a, b) => a.localeCompare(b))
    .forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      playerListEl.appendChild(li);
    });
}
