// -------------------------------------------------------
// Swear filter
// -------------------------------------------------------
const badWords = [
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "cunt",
  "asshole",
  "dick",
  "cock",
  "fag"
];

export function filterMessage(text) {
  if (!text) return text;
  let cleaned = text;

  badWords.forEach(word => {
    const pattern = new RegExp("\\b" + escapeRegExp(word) + "\\b", "gi");
    const stars = "★".repeat(word.length);
    cleaned = cleaned.replace(pattern, stars);
  });

  return cleaned;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
