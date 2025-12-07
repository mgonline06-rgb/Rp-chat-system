// -------------------------------------------------------
// STRONG SWEAR FILTER (Fantasy RP Safe Mode)
// Blocks racial slurs, homophobic slurs, profanity,
// bypass attempts, leetspeak, spacing tricks.
// -------------------------------------------------------

export function filterMessage(text) {

  // List of blocked words (normalized)
  const blockedWords = [
    // Racial slurs
    "nigger", "nigga", "negro",
    "chink", "spic", "gook", "wetback",
    "kike", "faggot", "fag", "tranny",

    // Profanity
    "fuck", "shit", "bitch", "cunt",
    "dick", "pussy", "asshole",

    // Harassment
    "kill yourself", "kys"
  ];

  // Normalize the text:
  // remove punctuation, spaces, leetspeak replacements
  let normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")     // Remove symbols: ., -, _
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t");

  // Check for blocked terms
  for (let bad of blockedWords) {
    if (normalized.includes(bad)) {
      return "***[CENSORED]***";
    }
  }

  return text;
}
