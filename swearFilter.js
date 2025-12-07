export function filterBadWords(text) {

  const bannedWords = [
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt",
    "pussy", "penis", "vagina", "dick", "sex", "slut", "whore",
    "nigger", "nigga", "rape", "rapist", "faggot", "cum", "anal",
    "cock", "blowjob", "handjob", "semen", "orgy", "fetish"
  ];

  let cleaned = text;

  for (const bad of bannedWords) {
    const regex = new RegExp(bad, "gi");
    cleaned = cleaned.replace(regex, "***[CENSORED]***");
  }

  return cleaned;
}
