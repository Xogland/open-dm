const fs = require('fs');
const path = require('path');

// --- 1. Official Names Logic ---
const team = [
    { first: "ramees", last: "salim" },
    { first: "arun", last: "jose" }
];

const generateNameCombos = (people) => {
    const combos = new Set();
    people.forEach(p => {
        const f = p.first;
        const l = p.last;
        combos.add(f); // ramees
        combos.add(l); // salim
        combos.add(f + l); // rameessalim
        combos.add(f + "." + l); // ramees.salim (if supported) -> let's stick to alphanumeric for safety usually, but we can verify constraint. Assuming plain strings.
        combos.add(f + "_" + l);
        combos.add(l + f); // salimramees
        combos.add(f.charAt(0) + l); // rsalim
        combos.add(f + l.charAt(0)); // rameess
        combos.add(f.charAt(0) + l.charAt(0)); // rs
        // prefixes
        combos.add("official" + f);
        combos.add("real" + f);
        combos.add("iam" + f);
    });
    return Array.from(combos);
};

const teamHandles = generateNameCombos(team);

// --- 2. Official System Terms (>200 target) ---
let officialSystem = [
    "admin", "administrator", "root", "sysadmin", "superuser",
    "support", "help", "info", "contact", "sales", "marketing",
    "legal", "privacy", "terms", "security", "abuse", "complaints",
    "compliance", "billing", "subscriptions", "payments", "refunds",
    "api", "dev", "developer", "developers", "docs", "documentation",
    "status", "health", "uptime", "monitor", "alerts",
    "blog", "news", "press", "media", "jobs", "careers", "hiring",
    "team", "staff", "crew", "employee", "employees", "members",
    "official", "verified", "system", "bot", "noreply", "mailer",
    "web", "app", "mobile", "desktop", "portal", "dashboard",
    "auth", "login", "signin", "logout", "signout", "register", "signup",
    "account", "profile", "settings", "config", "setup", "install",
    "opendm", "opendmio", "opendmsite", "open-dm", "astrogames",
    "founder", "ceo", "cto", "cfo", "coo", "owner", "president",
    "manager", "director", "lead", "head", "vp", "executive"
];

// Pad official list to ensure >200 if needed (by adding generic variations)
const seedOfficial = [...officialSystem];
while (seedOfficial.length < 200) {
    const term = officialSystem[Math.floor(Math.random() * officialSystem.length)];
    const suffix = Math.floor(Math.random() * 1000);
    const variant = term + suffix;
    if (!seedOfficial.includes(variant)) {
        seedOfficial.push(variant);
    }
}

// Combine all official
const allOfficial = new Set([...teamHandles, ...seedOfficial]);

// --- 3. Default Premium/Big Names (>1000 target) ---
// Base list of ~800 from before + expansions
const basePremium = [
    "google", "apple", "microsoft", "amazon", "facebook", "meta", "instagram",
    "twitter", "x", "tiktok", "youtube", "netflix", "disney", "spotify",
    "tesla", "spacex", "nike", "adidas", "puma", "reebok", "gucci", "prada",
    "rolex", "omega", "mercedes", "bmw", "audi", "porsche", "ferrari",
    "paypal", "visa", "mastercard", "amex", "stripe", "bank", "finance",
    "crypto", "bitcoin", "ethereum", "solana", "nft", "blockchain",
    "gov", "edu", "org", "net", "com", "io", "ai", "app",
    "game", "play", "music", "video", "chat", "social", "search",
    "cloud", "code", "design", "art", "shop", "store", "buy", "sell",
    "love", "cool", "best", "top", "hot", "new", "pro", "plus",
    "max", "ultra", "super", "mega", "hyper", "cyber", "techno",
    "future", "world", "global", "local", "city", "town", "village",
    "home", "house", "apt", "flat", "room", "space", "place",
    "life", "live", "style", "fashion", "beauty", "health", "fit",
    "gym", "run", "bike", "swim", "fly", "travel", "trip", "tour",
    "food", "cook", "chef", "eat", "drink", "bar", "pub", "club",
    "fun", "joy", "happy", "smile", "laugh", "funny", "joke",
    "star", "sun", "moon", "sky", "sea", "ocean", "river", "lake",
    "mountain", "hill", "view", "vista", "pixel", "digital", "data",
    "smart", "genius", "guru", "ninja", "wizard", "hero", "king", "queen",
    "alpha", "beta", "gamma", "delta", "omega", "zen", "yolo", "swag",
    "vibe", "mood", "soul", "spirit", "ghost", "phantom", "shadow",
    "light", "dark", "neon", "retro", "vintage", "classic", "modern",
    "basic", "clean", "fresh", "pure", "nature", "eco", "green", "bio",
    "tech", "robot", "droid", "cyborg", "laser", "rocket", "atom",
    "quantum", "sonic", "flash", "spark", "fire", "ice", "storm",
    "thunder", "cloud", "rain", "snow", "wind", "earth", "water",
    "metal", "wood", "glass", "stone", "iron", "steel", "gold", "silver",
    "bronze", "platinum", "diamond", "ruby", "jade", "pearl", "opal",
    "red", "blue", "yellow", "orange", "purple", "pink", "black", "white",
    "gray", "brown", "cyan", "magenta", "lime", "indigo", "violet",
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "hundred", "thousand", "million", "billion", "zero", "first", "last",
    "london", "paris", "tokyo", "ny", "nyc", "la", "sf", "berlin",
    "dubai", "rome", "milan", "madrid", "barcelona", "sydney", "toronto",
    // Expanded tech terms
    "python", "javascript", "react", "vue", "angular", "node", "deno", "bun",
    "rust", "go", "java", "kotlin", "swift", "dart", "flutter", "c", "cpp",
    "linux", "windows", "macos", "android", "ios", "ubuntu", "debian",
    "docker", "k8s", "aws", "azure", "gcp", "vercel", "netlify", "heroku",
    "git", "github", "gitlab", "bitbucket", "jira", "slack", "discord",
    "zoom", "teams", "skype", "telegram", "whatsapp", "signal", "wechat",
    // Expanded nouns
    "cat", "dog", "pet", "animal", "bird", "fish", "lion", "tiger",
    "wolf", "fox", "bear", "panda", "koala", "eagle", "hawk", "owl",
    "shark", "whale", "dolphin", "snake", "dragon", "dino", "rex",
    "flower", "rose", "lily", "tree", "leaf", "plant", "garden", "park",
    "car", "bus", "truck", "bike", "train", "plane", "ship", "boat",
    "game", "gamer", "gaming", "play", "player", "stream", "streamer",
    "movie", "film", "show", "tv", "music", "song", "band", "artist",
    "book", "read", "write", "blog", "vlog", "pod", "cast", "radio"
];

// Pad default list to >1000
const seedDefault = [...basePremium];
const extraWords = ["corp", "inc", "ltd", "co", "group", "team", "studio", "lab", "labs", "box", "io", "ai", "app", "net", "org", "com"];
while (seedDefault.length < 1200) {
    const word = basePremium[Math.floor(Math.random() * basePremium.length)];
    const suffix = extraWords[Math.floor(Math.random() * extraWords.length)];
    const variant = word + suffix; // e.g., googlelabs, appio
    if (!seedDefault.includes(variant)) {
        seedDefault.push(variant);
    }
}

// Generate Output
const output = [];
const seen = new Set();

// Add Officials
allOfficial.forEach(h => {
    if (!seen.has(h)) {
        output.push({ handle: h, type: "official" });
        seen.add(h);
    }
});

// Add Defaults (Premium)
seedDefault.forEach(h => {
    // Only verify it's not in seen (official overrides default if conflict)
    if (!seen.has(h)) {
        output.push({ handle: h, type: "default" });
        seen.add(h);
    }
});

const data = output.map(o => JSON.stringify(o)).join('\n');
fs.writeFileSync(path.join(__dirname, '../data/reserved_handles.jsonl'), data);

console.log(`Generated ${output.length} reserved handles.`);
console.log(`Official: ${Array.from(allOfficial).length}`);
console.log(`Default (Premium): ${output.length - Array.from(allOfficial).length}`);
