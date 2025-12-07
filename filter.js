// Simple swear filter.
// It replaces any banned word with ***[CENSORED]***.
// You can extend the bannedWords array with whatever you like.

// NOTE: For safety I’m not hard-coding specific slurs here,
// but you can add them as plain strings in the array.

const bannedWords = [
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "asshole",
  "cunt",
  "dick",
  "bastard",
  "nigger",
   "nig",
"kike",
"sewerback",
"negro",
"faggot",
"sex",
"penis",
"pussy",
"jiggaboo",
"chink",



  
  // Add extra words and slurs you want to block, like:
  // "yourBadWordHere",
];

const pattern = new RegExp(
  "\\b(" + bannedWords.map(w => escapeRegExp(w)).join("|") + ")\\b",
  "gi"
);

export function filterBadWords(text) {
  return text.replace(pattern, "***[CENSORED]***");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
