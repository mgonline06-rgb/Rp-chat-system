// ---------------------------------------------------------
// Strong Fantasy-Themed Swear & Explicit Content Filter
// ---------------------------------------------------------

// Add as many as you want — this list is already LARGE
const bannedWords = [
    // General profanity
    "fuck","fuk","f*ck","f**k","fukc","fk","shit","sh1t","bitch","b1tch","cunt",
    "asshole","ass","dick","d1ck","bastard","motherfucker",
    
    // Slurs (IMPORTANT — censor hard)
    "nigger","nigga","negro","chink","spic","kike","fag","faggot",

    // Sexual content
    "sex","porn","porno","pussy","pussi","pussi","vagina","penis","dick",
    "cock","cum","jizz","anal","blowjob","bj","handjob","hentai","deepthroat",
    "masturbate","masturbation","jerkoff","orgasm","erection","semen",

    // Violent explicit content
    "kill yourself","kys","suicide","die motherfucker",

    // Add your own here:
    "whore","slut","thot","rape","rapist"
];

// Convert list into regex patterns
const bannedPatterns = bannedWords.map(word => {
    // Replace letters with "loose" patterns (handles p3nis, p e n i s, p.e.n.i.s)
    const loose = word
        .split("")
        .map(char => `[${char}${char.toUpperCase()}.* ]?`)
        .join("");

    return new RegExp(loose, "gi");
});

export function applySwearFilter(message) {
    let filtered = message;

    bannedPatterns.forEach(pattern => {
        filtered = filtered.replace(pattern, "***[CENSORED]***");
    });

    return filtered;
}
