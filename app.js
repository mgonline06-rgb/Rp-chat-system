import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvj83bdrUn2WXrNHFz0e2HNqoWLNlgDc0",
  authDomain: "rp-system-01.firebaseapp.com",
  databaseURL: "https://rp-system-01-default-rtdb.firebaseio.com",
  projectId: "rp-system-01",
  storageBucket: "rp-system-01.appspot.com",
  messagingSenderId: "594537856244",
  appId: "1:594537856244:web:8311aaed52979b647772a1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elements
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

let avatarURL = "";
let username = "";
let roomCode = "";

// Avatar Upload
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = e => { avatarURL = e.target.result; }
    reader.readAsDataURL(file);
  }
});

// Join Room
joinBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  const password = document.getElementById("password").value.trim();
  let inputRoom = roomInput.value.trim();

  if(!username){ alert("Enter a username!"); return; }
  if(password !== "1234"){ alert("Incorrect password!"); return; }

  if(!inputRoom){
    roomCode = Math.random().toString(36).substring(2,8).toUpperCase();
    alert("Room created! Share this code with friends: " + roomCode);
  } else {
    roomCode = inputRoom.toUpperCase();
  }

  currentRoomSpan.textContent = roomCode;
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";

  addMessage("System", `Welcome ${username}! Joined room ${roomCode}`, "");

  // Listen for messages
  const messagesRef = ref(db, 'rooms/' + roomCode + '/messages');
  onChildAdded(messagesRef, snapshot => {
    const data = snapshot.val();
    addMessage(data.user, data.text, data.avatar);
  });
});

// Copy Room Code
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(roomCode)
    .then(() => alert("Room code copied!"))
    .catch(err => alert("Failed to copy: " + err));
});

// Send Message
sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if(!msg) return;
  const msgData = { user: username, text: msg, avatar: avatarURL };
  push(ref(db, 'rooms/' + roomCode + '/messages'), msgData);
  messageInput.value = "";
});

// Display Messages
function addMessage(user, text, avatar=""){
  const msgEl = document.createElement("div");
  msgEl.classList.add("message");

  const imgEl = document.createElement("img");
  imgEl.src = avatar || "";
  
  const textEl = document.createElement("span");
  textEl.textContent = `${user}: ${text}`;

  msgEl.appendChild(imgEl);
  msgEl.appendChild(textEl);
  messagesDiv.appendChild(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}




