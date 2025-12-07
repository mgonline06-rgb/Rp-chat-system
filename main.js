// -------------------------------------------------------
// Firebase v12 imports
// -------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase, ref, push, set, onChildAdded, onValue, off
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

import { filterBadWords } from "./swearFilter.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// -------------------------------------------------------
// UI elements
// -------------------------------------------------------
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const avatarInput = document.getElementById("avatar");
const roomInput = document.getElementById("roomCode");

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const playerList = document.getElementById("playerList");
const currentRoomSpan = document.getElementById("currentRoom");

const pingSound = document.getElementById("pingSound");


// -------------------------------------------------------
// Global state
// -------------------------------------------------------
let username = "";
let avatarURL = "";
let roomCode = "";

window.db = db; // for profile.js


// -------------------------------------------------------
// Avatar upload
// -------------------------------------------------------
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => avatarURL = e.target.result;
  reader.readAsDataURL(file);
});


// -------------------------------------------------------
// JOIN ROOM
// -------------------------------------------------------
joinBtn.addEventListener("click", () => {

  username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  let room = roomInput.value.trim();

  if (!username) return alert("Enter a username!");
  if (password !== "1234") return alert("Wrong password!");

  roomCode = room ? room.toUpperCase()
                  : Math.random().toString(36).substring(2, 8).toUpperCase();

  currentRoomSpan.textContent = roomCode;
  window.roomCode = roomCode;

  // Store presence
  set(ref(db, "rooms/" + roomCode + "/players/" + username), {
    user: username,
    avatar: avatarURL || "",
  });

  // Swap screens
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";

  startMessageListener();
  startPlayerListListener();

  addMessage("System", `Welcome ${username}!`);
});


// -------------------------------------------------------
// MESSAGE SENDING
// -------------------------------------------------------
sendBtn.addEventListener("click", () => {
  let text = messageInput.value.trim();
  if (!text) return;

  text = filterBadWords(text);

  const msgData = {
    user: username,
    text,
    avatar: avatarURL,
  };

  push(ref(db, "rooms/" + roomCode + "/messages"), msgData);

  messageInput.value = "";
});


// -------------------------------------------------------
// LISTEN FOR NEW MESSAGES
// -------------------------------------------------------
function startMessageListener() {
  const messagesRef = ref(db, "rooms/" + roomCode + "/messages");

  off(messagesRef);

  onChildAdded(messagesRef, snap => {
    const data = snap.val();
    addMessage(data.user, data.text, data.avatar);
  });
}


// -------------------------------------------------------
// DISPLAY A MESSAGE
// -------------------------------------------------------
function addMessage(user, text, avatar) {

  const msgEl = document.createElement("div");
  msgEl.classList.add("message");

  const img = document.createElement("img");
  img.src = avatar || "";

  const txt = document.createElement("span");
  txt.textContent = `${user}: ${text}`;

  msgEl.append(img, txt);

  // Character sheet open
  msgEl.addEventListener("click", () => {
    openCharacterSheetFromChat({ user, avatar, rpName: user });
  });

  // Mentions + ping
  const wasMention = handleMentions(msgEl, user, text, username, messageInput);
  if (wasMention && pingSound) pingSound.play();

  messagesDiv.append(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


// -------------------------------------------------------
// PLAYER LIST SYSTEM
// -------------------------------------------------------
function startPlayerListListener() {
  const playersRef = ref(db, "rooms/" + roomCode + "/players");

  onValue(playersRef, snap => {
    playerList.innerHTML = "";

    snap.forEach(child => {
      const p = child.val();

      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${p.avatar || ""}">
        <span>${p.user}</span>
      `;
      playerList.append(li);
    });
  });
}
