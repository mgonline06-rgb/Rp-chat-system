// -------------------------------------------------------
// Firebase v12 imports
// -------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase, ref, push, onChildAdded, off
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Character sheet + mentions
import { openCharacterSheetFromChat } from "./profile.js";
import { handleMentions } from "./mentions.js";

// -------------------------------------------------------
// Correct Firebase config
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
// Global State
// -------------------------------------------------------
let avatarURL = "";
let username = "";
let roomCode = "";

// Expose for profile.js
window.db = db;

// -------------------------------------------------------
// Avatar Upload
// -------------------------------------------------------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => { avatarURL = e.target.result; };
    reader.readAsDataURL(file);
  }
});

// -------------------------------------------------------
// Join room (BOOK OPENS HERE)
// -------------------------------------------------------
joinBtn.addEventListener("click", () => {

  username = usernameInput.value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username) return alert("Enter a username!");
  if (password !== "1234") return alert("Incorrect password!");

  let inputRoom = roomInput.value.trim();

  if (!inputRoom) {
    roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    alert("Room created! Share this code: " + roomCode);
  } else {
    roomCode = inputRoom.toUpperCase();
  }

  currentRoomSpan.textContent = roomCode;
  window.roomCode = roomCode;

  // Switch screens
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";

  // Book opening animation
  chatDiv.classList.remove("closed");
  setTimeout(() => {
    chatDiv.classList.add("open");
  }, 60);

  // Load messages
  messagesDiv.innerHTML = "";

  const messagesRef = ref(db, "rooms/" + roomCode + "/messages");

  off(messagesRef); // avoid duplicate listeners

  onChildAdded(messagesRef, snap => {
    const data = snap.val();
    addMessage(data.user, data.text, data.avatar);
  });

  addMessage("System", `Welcome ${username}!`);
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
  const msg = messageInput.value.trim();
  if (!msg) return;

  const msgData = {
    user: username,
    text: msg,
    avatar: avatarURL
  };

  push(ref(db, "rooms/" + roomCode + "/messages"), msgData);

  messageInput.value = "";
});

// -------------------------------------------------------
// Show a message in the chat
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

  // Click → open character sheet
  msgEl.addEventListener("click", () => {
    openCharacterSheetFromChat({
      user,
      avatar,
      rpName: user,
      bio: "No bio yet."
    });
  });

  // Mentions (highlight + shift-click)
  handleMentions(msgEl, user, text, username, messageInput);

  messagesDiv.append(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

