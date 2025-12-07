// Grab elements
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("messageInput");
const avatarInput = document.getElementById("avatar");

let avatarURL = ""; // store selected avatar

// Test JS is running
console.log("JavaScript is running!");

// Handle avatar upload
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      avatarURL = e.target.result; // base64 URL
    };
    reader.readAsDataURL(file);
  }
});

// Join chat button
joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username) {
    alert("Enter your username!");
    return;
  }

  // Simple password check
  if (password !== "1234") {
    alert("Incorrect password!");
    return;
  }

  loginDiv.style.display = "none";  // hide login screen
  chatDiv.style.display = "block";   // show chat screen

  addMessage("System", `Welcome ${username}!`, avatarURL);
});

// Send message button
sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (!msg) return;

  const username = usernameInput.value.trim();
  addMessage(username, msg, avatarURL);
  messageInput.value = "";
});

// Add a message to chat
function addMessage(user, text, avatar = "") {
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


