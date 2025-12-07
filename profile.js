// -------------------------------------------------------
// SCROLL-THEMED EDITABLE CHARACTER SHEET
// -------------------------------------------------------

export function openCharacterSheetFromChat(player) {
  openCharacterSheet(player.user, player.avatar, player.rpName || player.user, player.bio || "");
}

function openCharacterSheet(user, avatar, rpName, bio) {
  const win = document.createElement("div");
  win.classList.add("profileWindow");

  win.innerHTML = `
    <button class="closeProfile">✖</button>

    <div class="scrollTop"></div>

    <div class="scrollContent">

      <div class="profileHeader">
        <img src="${avatar}">
        <div>
          <input class="rpNameInput" value="${rpName}" />
          <small>@${user}</small>
        </div>
      </div>

      <label>Bio:</label>
      <textarea class="bioInput">${bio}</textarea>

      <button class="saveProfile">Save</button>

      <h4>Message History:</h4>
      <div class="profileMessages" id="history-${user}">
        <i>Gathering scrolls…</i>
      </div>

    </div>

    <div class="scrollBottom"></div>
  `;

  // Close button
  win.querySelector(".closeProfile").addEventListener("click", () => win.remove());

  // Save button
  win.querySelector(".saveProfile").addEventListener("click", () => {
    const newName = win.que
