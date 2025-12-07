export function censorMessage(text) {

  const bannedWords = [
    // hate speech
    "nigg", "fag", "retard", "chink", "spic", "kike",

    // sexual vulgar
    "pussy", "penis", "dick", "cock", "vagina", "cum",
    "slut", "whore", "rape", "jerk off", "handjob",
    "sex", "boob", "tits", "anal", "suck my",

    // extreme profanity
    "motherfucker", "cunt", "fuck", "shit"
  ];

  let output = text;

  for (let bad of bannedWords) {
    const regex = new RegExp(bad, "gi");
    output = output.replace(regex, "***[CENSORED]***");
  }

  return output;
}
