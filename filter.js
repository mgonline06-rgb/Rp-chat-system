const badWords = [
  "fuck","shit","bitch","cunt","bastard",
  "nigger","nigga","retard","fag","slut","whore"
];

export function filterBadWords(text) {

  let lowered = text.toLowerCase();

  for (let bad of badWords) {
    if (lowered.includes(bad)) {
      const stars = "*".repeat(bad.length);
      const regex = new RegExp(bad, "gi");
      text = text.replace(regex, stars);
    }
  }
  return text;
}
