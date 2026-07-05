import { useState, useCallback, useRef, useEffect } from "react";
import {
  Menu, X, Search, Settings, BookOpen, Users, Globe, Clock,
  Image as ImageIcon, Info, ChevronRight, ChevronLeft,
  ArrowRight, Home, Star, Bookmark, Eye, MapPin,
  Volume2, Type, Sun, Moon, Play, Scroll
} from "lucide-react";

// ── Asset Imports ─────────────────────────────────────────────
import shadowCave from "@/assets/shadow-cave.png";
import banyanForest from "@/assets/banyan-forest.png";
import crimsonTemple from "@/assets/crimson-temple.png";
import sacredRitual from "@/assets/sacred-ritual.png";
import lotusDreamscape from "@/assets/lotus-dreamscape.png";
import keshavaVillage from "@/assets/keshava-village.png";
import mountKailash from "@/assets/mount-kailash.png";
import cosmosAboveKailash from "@/assets/cosmos-above-kailash.png";
import shivaKeshavaPortrait from "@/assets/shiva-keshava-portrait.png";
import bloodRedDawn from "@/assets/blood-red-dawn.png";

// ── Types ─────────────────────────────────────────────────────
type Page = "home" | "chapters" | "reader" | "characters" | "world" | "timeline" | "gallery" | "search" | "about" | "settings";

// ── Constants / Data ──────────────────────────────────────────
const STARS = Array.from({ length: 180 }, (_, i) => ({
  x: (i * 137.508) % 1400,
  y: (i * 89.17) % 500,
  r: i % 5 === 0 ? 1.9 : i % 5 === 1 ? 1.3 : i % 5 === 2 ? 0.9 : i % 5 === 3 ? 0.6 : 0.4,
  opacity: 0.2 + (i % 7) * 0.1,
  animDur: `${2.5 + (i % 6) * 0.7}s`,
  animDelay: `${(i % 9) * 0.35}s`,
}));

const GOLD_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 113.5) % 1400,
  y: 600 + (i * 67) % 300,
  r: i % 3 === 0 ? 2.8 : 1.6,
  dur: `${5 + (i % 5)}s`,
  delay: `${(i % 8) * 0.6}s`,
}));

const SANSKRIT = [
  { t: "ॐ",           x: 120,  y: 210, sz: 34, op: 0.11, d: "0s"   },
  { t: "त्र्यम्बकं",    x: 470,  y: 148, sz: 17, op: 0.07, d: "1.4s" },
  { t: "यजामहे",      x: 830,  y: 108, sz: 15, op: 0.06, d: "3.1s" },
  { t: "महादेव",      x: 1160, y: 172, sz: 19, op: 0.09, d: "2.2s" },
  { t: "कैलाश",       x: 1295, y: 82,  sz: 15, op: 0.07, d: "4.1s" },
  { t: "शिव",         x: 255,  y: 305, sz: 26, op: 0.08, d: "2.6s" },
  { t: "नंदी",         x: 690,  y: 225, sz: 17, op: 0.06, d: "0.9s" },
  { t: "ॐ",           x: 1060, y: 255, sz: 30, op: 0.09, d: "3.5s" },
  { t: "सत्यम्",      x: 600,  y: 340, sz: 14, op: 0.05, d: "5s"   },
];

const CHAPTERS = [
  {
    id: 1, num: "01",
    title: "The Soul Written in the Stars",
    sub: "Scenes 1–4 · 42 pages",
    img: shadowCave,
    summary: "Shiva Keshava seals a volcanic demon using ancient Sanskrit rituals. That night, in an ethereal lotus dreamscape, he glimpses the face of his destined beloved. On Mount Kailash, Lord Shiva reveals the cosmic design to Nandi: love is the warrior's true purpose.",
    tags: ["Ritual", "Vision", "Destiny"],
    status: "available",
    pages: 42,
  },
  {
    id: 2, num: "02",
    title: "The Forest of Forgotten Names",
    sub: "Coming Soon",
    img: banyanForest,
    summary: "Into the ancient Naimisha Forest, Shiva Keshava follows a thread of golden light only he can see. The trees whisper in Sanskrit. Something old watches from the roots.",
    tags: ["Forest", "Mystery", "Ancient Magic"],
    status: "soon",
    pages: 0,
  },
  {
    id: 3, num: "03",
    title: "The Crimson Temple",
    sub: "Coming Soon",
    img: crimsonTemple,
    summary: "Emerging from the celestial portal, Keshava stands before a temple bathed in saffron flame. The priests know his name. They have been waiting four hundred years.",
    tags: ["Temple", "Revelation", "Destiny"],
    status: "soon",
    pages: 0,
  },
];

const READER_SCENES = [
  {
    id: 1, title: "The Ritual of Shadows",
    panels: [
      { desc: "Ultra-wide establishing shot: a jagged mountain fissure beneath a blood-red sky. Black, miasmic smoke billows from the cave's mouth.", sfx: "RUMBLE...", char: null, dialogue: null, img: shadowCave, wide: true },
      { desc: "Close-up of a grotesque demon — skin like cracked volcanic rock, eyes burning with unchecked hatred. It lunges forward, claws extended.", sfx: null, char: "DEMON", dialogue: "Mortal dust! You dare stand against the hunger of the dark?!", img: null, wide: false },
      { desc: "Shiva Keshava steps into the light. Broad-shouldered, clothes torn from battle. His gaze is utterly steady — devoid of fear, filled with profound resolve. He dodges a crushing blow. Rock shatters behind him.", sfx: "CRACK!!!", char: null, dialogue: null, img: sacredRitual, wide: true },
      { desc: "Dynamic diagonal panel: Shiva Keshava drives a sacred trishul-tipped dagger into the demon's shoulder. Blood mixed with dark mist erupts from the wound.", sfx: "SCHLIT!!!", char: "DEMON", dialogue: "AAAGHH! This... this bloodline again...!", img: null, wide: false },
      { desc: "Shiva Keshava lands gracefully on one knee, palms pressed to the earth. A brilliant golden aura bursts from his body, casting away the violet shadows.", sfx: null, char: "SHIVA KESHAVA", dialogue: "By the breath of the Creator, by the light that binds the cosmos... let the darkness return to its true form.", img: null, wide: false },
      { desc: "DOUBLE-PAGE SPREAD — Glowing Sanskrit hymns weave through the air like ribbons of solid light, encircling the thrashing beast. The demon's form dissolves into flat, ink-like shadows sinking into stone.", sfx: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्...", char: "DEMON", dialogue: "We will consume this world... you cannot bind us forever...!", img: null, wide: true },
    ],
  },
  {
    id: 2, title: "A Dream in the Night",
    panels: [
      { desc: "Transition to an ethereal dreamscape. The cave fades into a sea of glowing white lotuses and starlight. Warm golds, soft pinks, deep cosmic blues.", sfx: null, char: "NARRATION", dialogue: "Not even an ant is born without the will of Lord Shiva.", img: lotusDreamscape, wide: true },
      { desc: "Through shimmering mist, a silhouette appears — a young woman amidst the starlight. Her face is partially obscured by a veil of cosmic light, but her eyes — gentle, deep, filled with ancient recognition — lock onto the viewer.", sfx: null, char: "SHIVA KESHAVA", dialogue: "Who... are you?", img: null, wide: false },
      { desc: "Tight close-up of Shiva Keshava's sleeping face. No longer a hardened warrior — he is filled with profound, aching peace. A single tear slips down his cheek.", sfx: null, char: "NARRATION", dialogue: "A face he had never seen in the waking world, yet his soul recognized her instantly. It was a vision more real than reality itself.", img: null, wide: false },
      { desc: "Morning. Bright sunlight pours over a vibrant Indian village square. Birds fly past a stone well. Shiva Keshava sits on a wooden bench, staring at his hands, completely lost in thought.", sfx: null, char: null, dialogue: null, img: keshavaVillage, wide: true },
      { desc: "Neighbors lean into the frame, grinning mischievously. One jabs an elbow into Shiva's side.", sfx: null, char: "NEIGHBOR 1", dialogue: "Look at him! Our fierce warrior looks like he's been struck by an arrow — and not the kind from a bow!", img: null, wide: false },
      { desc: "Shiva Keshava blushes slightly, a quiet innocent smile gracing his lips. He looks up at the sky, hand resting over his heart.", sfx: null, char: "SHIVA KESHAVA", dialogue: "It wasn't a mere dream... it felt as if my heart has belonged to her for a thousand lifetimes. I only wish I knew where her path begins.", img: null, wide: false },
    ],
  },
  {
    id: 3, title: "The Decree of Kailash",
    panels: [
      { desc: "Awe-inspiring shot of Mount Kailash towering above the clouds. Peaks gleam with divine, pristine snow. The atmosphere radiates infinite peace and cosmic stillness.", sfx: null, char: null, dialogue: null, img: mountKailash, wide: true },
      { desc: "Lord Shiva sits in profound meditation on the sacred peak — pale ash skin, crescent moon in matted hair, tiger skin around his shoulders. Nandi, the divine bull, stands respectfully nearby, bowing his head.", sfx: null, char: "NANDI", dialogue: "My Lord... why did Shiva Keshava witness the vision of a woman from his future? What is the reason behind such a dream?", img: null, wide: false },
      { desc: "Lord Shiva slowly opens his eyes. They contain the depth of universes, burning with gentle wisdom. A serene smile plays on his lips.", sfx: null, char: "LORD SHIVA", dialogue: "Every soul enters this world with a purpose, Nandi. No thread is spun by destiny without a tapestry to belong to.", img: null, wide: false },
      { desc: "Nandi steps closer, his expression filled with earnest devotion.", sfx: null, char: "NANDI", dialogue: "Then what is Shiva Keshava's purpose, Mahadeva? Why show him a destination before the journey has even begun?", img: null, wide: false },
      { desc: "Stunning close-up profile of Lord Shiva as he looks out over the mortal realm. The stars themselves seem to align behind him.", sfx: null, char: "LORD SHIVA", dialogue: "Love.", img: null, wide: false },
      { desc: "The framing widens — the vast cosmos swirls above Kailash.", sfx: null, char: "LORD SHIVA", dialogue: "He has already seen the soul destined to walk beside him. He will search for her across the lands, guided by the echo in his chest. But remember, Nandi... the path of a true seeker will not be easy. Destiny itself shall stand against him, testing whether his bond is made of fleeting desire or eternal truth. Yet... he will never abandon the one written into his fate.", img: cosmosAboveKailash, wide: true },
    ],
  },
  {
    id: 4, title: "The Ascetic's Lesson",
    panels: [
      { desc: "Dense ancient forest. Heavy canopy lets through only sharp beams of sunlight. Shiva Keshava walks alone, traveling pack on his shoulders, eyes scanning the horizon.", sfx: null, char: null, dialogue: null, img: banyanForest, wide: true },
      { desc: "An old wandering ascetic steps from behind a massive banyan tree — tattered clothes, wooden staff, eyes gleaming with otherworldly intellect. Keshava bows immediately in respect.", sfx: null, char: "ASCETIC", dialogue: "Young warrior... you walk with the weight of the future on your shoulders. Tell me, do you believe your strength alone can overcome destiny?", img: null, wide: false },
      { desc: "Shiva Keshava rises, posture straightening. His eyes burn with determination.", sfx: null, char: "SHIVA KESHAVA", dialogue: "If destiny requires me to cross oceans or shatter mountains to fulfill my purpose, I will trust in my strength and the gods. I will not break.", img: null, wide: false },
      { desc: "Action sequence. The ascetic raises his staff. Shiva draws his sword. They clash — the ascetic effortlessly deflects every strike with a simple turn of his wrist.", sfx: "TAK!", char: "ASCETIC", dialogue: "A bold claim. Let us see if your spine is as strong as your words.", img: null, wide: false },
      { desc: "The ascetic stops perfectly still. The leaves freeze in mid-air. Time itself trembles. The old man's form glows with blinding divine light — behind him, the massive silhouette of Mahadeva appears. A golden celestial portal tears open behind Keshava.", sfx: "VUUUUUUM—", char: null, dialogue: null, img: null, wide: true },
      { desc: "Shiva Keshava is thrown backward into the glowing vortex, eyes wide as he realizes the true identity of the traveler.", sfx: null, char: "SHIVA KESHAVA", dialogue: "Mahadeva...!", img: null, wide: false },
      { desc: "Lord Shiva stands alone in his true form, looking at the space where the portal was. His expression is filled with profound fatherly love and cosmic wisdom. Golden particles drift in the quiet forest.", sfx: null, char: "LORD SHIVA", dialogue: "Your journey has only just begun. The road ahead shall test your heart, your faith, your love, and your soul. Walk forward... and become the man destiny awaits.", img: null, wide: false },
    ],
  },
];

const CHARACTERS = [
  {
    name: "Shiva Keshava",
    role: "Protagonist · Shadow Sealer",
    desc: "Broad-shouldered and fearless, Keshava carries the burden of a sacred bloodline that can seal demons into shadow using ancient Sanskrit rituals. Beneath the hardened warrior is a soul of profound humility — every victory belongs to the divine. When destiny shows him a face he has never seen but always known, he cannot rest until he finds her.",
    traits: ["Devout", "Fearless", "Humble", "Relentless"],
    quote: "I am merely the instrument. The victory belongs to Him.",
    img: shivaKeshavaPortrait,
    color: "#C4933A",
    chapter: "Ch. 1",
  },
  {
    name: "Lord Shiva",
    role: "The Mahadeva · Cosmic Architect",
    desc: "The supreme deity whose presence radiates infinite stillness even as universes burn behind his eyes. He does not intervene directly — he designs. The ritual, the dream, the disguise in the forest — all threads woven with the patience of eternity. His love for Keshava is the quiet, total love of a father who knows the full pattern.",
    traits: ["Omniscient", "Serene", "Enigmatic", "Just"],
    quote: "Love. He has already seen the soul destined to walk beside him.",
    img: mountKailash,
    color: "#9080FF",
    chapter: "Ch. 1",
  },
  {
    name: "Nandi",
    role: "Sacred Guardian · Devotee of Mahadeva",
    desc: "Divine guardian of Kailash and eternal devotee of Lord Shiva. Nandi serves as the voice of earnest curiosity — asking the questions mortals cannot, drawing forth Lord Shiva's pronouncements about Keshava's destiny. His devotion is the purest model of faithful surrender.",
    traits: ["Devoted", "Protective", "Earnest", "Ancient"],
    quote: "Then what is Shiva Keshava's purpose, Mahadeva?",
    img: cosmosAboveKailash,
    color: "#E8820C",
    chapter: "Ch. 1",
  },
  {
    name: "The Mysterious Girl",
    role: "Soul of Stars · Destined Beloved",
    desc: "She appears only as a silhouette of cosmic light — gentle eyes holding ancient recognition, standing amidst a sea of glowing white lotuses. Her face is obscured, her name unspoken. Yet Keshava's soul recognizes her across a thousand lifetimes the moment she appears. She is the destination of every trial ahead.",
    traits: ["Ethereal", "Ancient Soul", "Fated", "Mysterious"],
    quote: "A face he had never seen, yet his soul recognized her instantly.",
    img: lotusDreamscape,
    color: "#C0B0FF",
    chapter: "Ch. 1",
  },
  {
    name: "The Volcanic Demon",
    role: "Shadow Entity · Herald of Darkness",
    desc: "A grotesque entity with skin like cracked volcanic rock and eyes burning with unchecked hatred. Before dissolving into the stone floor beneath Keshava's Sanskrit light, it warned: 'We will consume this world... you cannot bind us forever.' One of many. A herald of far older darkness still unbound.",
    traits: ["Wrathful", "Ancient", "Prophetic", "Defeated"],
    quote: "We will consume this world... you cannot bind us forever...!",
    img: shadowCave,
    color: "#8B1A1A",
    chapter: "Ch. 1",
  },
];

const LOCATIONS = [
  { name: "Mount Kailash", type: "Divine Realm", desc: "The sacred peak towering above all clouds — where divine silence can be heard. Lord Shiva meditates here at the axis of the cosmos. Its pristine snow carries the light of ten thousand suns. Every decree made here echoes through all three worlds.", img: mountKailash, tags: ["Divine", "Sacred", "Meditation"] },
  { name: "The Shadow Cave", type: "Battleground · Seal Site", desc: "A jagged mountain fissure where violet miasma chokes the air and black smoke billows into a blood-red sky. The walls hold ink-black imprints of every demon Keshava has sealed. The cave breathes. Something in the deepest dark has not been sealed yet.", img: shadowCave, tags: ["Battle", "Darkness", "Ritual"] },
  { name: "The Lotus Dreamscape", type: "Ethereal Plane", desc: "A plane at the edge of sleep and destiny — warm golds, soft pinks, deep cosmic blues. Glowing white lotuses float on starlit water. Here, Keshava first saw the face written into his fate, and where the soul-contract between them was made before either was born.", img: lotusDreamscape, tags: ["Vision", "Soul", "Destiny"] },
  { name: "The Ancient Banyan Forest", type: "Sacred Wilderness", desc: "Trees older than the Vedas, roots entangled with the bones of forgotten kingdoms. Sharp beams of sunlight cut through the canopy like divine proclamations. Here, Lord Shiva walked disguised as an ordinary ascetic — to test the warrior who claimed his spine was as strong as his words.", img: banyanForest, tags: ["Forest", "Test", "Portal"] },
  { name: "Keshava's Village", type: "Mortal Realm · Home", desc: "A vibrant village square where women gather at stone wells, birds sing at dawn, and neighbors speak in cheerful gossip. The ordinary world Keshava protects and returns to. Here, the warrior blushes. Here, the soul aches for something it cannot name.", img: keshavaVillage, tags: ["Home", "Peace", "Mortal"] },
];

const TIMELINE = [
  { time: "Chapter 1 · Scene 1", title: "The Ritual of Shadows", desc: "Shiva Keshava seals a volcanic demon into the cave floor. The demon warns: 'You cannot bind us forever.'", type: "battle" },
  { time: "Chapter 1 · Scene 1", title: "The Sealing Complete", desc: "Golden Sanskrit hymns dissolve the demon into shadow. Keshava: 'I am merely the instrument. The victory belongs to Him.'", type: "divine" },
  { time: "Chapter 1 · Scene 2", title: "The Dream Begins", desc: "In an ethereal lotus dreamscape, a silhouette appears — gentle eyes filled with ancient recognition lock onto Keshava's soul.", type: "vision" },
  { time: "Chapter 1 · Scene 2", title: "Soul Recognition", desc: "A single tear slips down his sleeping cheek. He tells neighbors: 'My heart has belonged to her for a thousand lifetimes.'", type: "vision" },
  { time: "Chapter 1 · Scene 3", title: "The Decree of Kailash", desc: "On Mount Kailash, Nandi questions Lord Shiva. Shiva answers with one word — 'Love' — before revealing the full cosmic design.", type: "divine" },
  { time: "Chapter 1 · Scene 3", title: "Destiny Declared", desc: "Lord Shiva: 'Destiny itself shall stand against him, testing whether his bond is made of fleeting desire or eternal truth.'", type: "divine" },
  { time: "Chapter 1 · Scene 4", title: "The Ascetic's Challenge", desc: "In the Banyan Forest, a disguised ascetic challenges Keshava: 'Do you believe your strength alone can overcome destiny?'", type: "journey" },
  { time: "Chapter 1 · Scene 4", title: "Mahadeva Revealed", desc: "The ascetic glows with blinding divine light. Lord Shiva's silhouette appears behind him. A golden celestial portal tears open.", type: "divine" },
  { time: "Chapter 1 · Scene 4", title: "Into the Unknown", desc: "Keshava is thrown into the vortex. Lord Shiva: 'Walk forward... and become the man destiny awaits.' The portal snaps shut.", type: "journey" },
];

const GALLERY = [
  { title: "Blood-Red Dawn", scene: "Chapter 1 · The Cave", img: bloodRedDawn, tall: true },
  { title: "Mount Kailash", scene: "Chapter 1 · Divine Realm", img: mountKailash, tall: false },
  { title: "The Sacred Ritual", scene: "Chapter 1 · Scene 1", img: sacredRitual, tall: true },
  { title: "Lotus Dreamscape", scene: "Chapter 1 · Scene 2", img: lotusDreamscape, tall: false },
  { title: "The Banyan Forest", scene: "Chapter 1 · Scene 4", img: banyanForest, tall: true },
  { title: "Cosmos Above Kailash", scene: "Chapter 1 · Scene 3", img: cosmosAboveKailash, tall: false },
  { title: "The Shadow Cave", scene: "Chapter 1 · Scene 1", img: shadowCave, tall: true },
  { title: "Village at Morning", scene: "Chapter 1 · Scene 2", img: keshavaVillage, tall: false },
  { title: "The Crimson Temple", scene: "Chapter 3 Preview", img: crimsonTemple, tall: true },
];

const TYPE_COLORS: Record<string, string> = {
  battle: "#8B1A1A",
  divine: "#C4933A",
  vision: "#9080FF",
  journey: "#4D7A4D",
};
const TYPE_LABELS: Record<string, string> = {
  battle: "Battle",
  divine: "Divine",
  vision: "Vision",
  journey: "Journey",
};

// ── Hero Scene SVG ─────────────────────────────────────
function HeroScene() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Cinematic artwork background — Mount Kailash under the cosmos, with subtle parallax drift */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ transform: `translate3d(${tilt.x * 10}px, ${tilt.y * 8}px, 0) scale(1.08)` }}
      >
        <img
          src={mountKailash}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 38%" }}
        />
      </div>

      {/* Cinematic color grade + legibility overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(2,4,8,0.5) 0%, rgba(16,3,8,0.42) 45%, rgba(7,7,15,0.97) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 26% 66%, rgba(77,0,153,0.26), transparent 55%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 76% 22%, rgba(196,147,58,0.24), transparent 52%)" }} />

      <svg
        className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ transform: `translate3d(${tilt.x * -16}px, ${tilt.y * -12}px, 0)` }}
      >
        <defs>
          <radialGradient id="divGlow" cx="72%" cy="38%" r="48%">
            <stop offset="0%"   stopColor="#C4933A" stopOpacity="0.38" />
            <stop offset="55%"  stopColor="#8B6020" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#C4933A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="shadGlow" cx="28%" cy="60%" r="38%">
            <stop offset="0%"   stopColor="#4D0099" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#4D0099" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonGlow" cx="82%" cy="11%" r="10%">
            <stop offset="0%"   stopColor="#E8D5A0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E8D5A0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moonHalo" cx="82%" cy="11%" r="20%">
            <stop offset="0%"   stopColor="#8FB4E8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8FB4E8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#07070F" stopOpacity="0" />
            <stop offset="100%" stopColor="#07070F" stopOpacity="0.97" />
          </linearGradient>
          <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#020408" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#020408" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rightFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#020408" stopOpacity="0" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0.7" />
          </linearGradient>
          <filter id="rayBlur">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="goldBloom">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="auraBlur">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        {/* Nebula clouds drifting through the cosmic sky */}
        <ellipse cx="240" cy="170" rx="270" ry="150" fill="#4D0099" opacity="0.12" filter="url(#rayBlur)" className="animate-shadow-breath" />
        <ellipse cx="1180" cy="600" rx="320" ry="180" fill="#1A3A7A" opacity="0.10" filter="url(#rayBlur)" style={{ animation: "shadowBreath 8s ease-in-out infinite" }} />
        <ellipse cx="700" cy="120" rx="240" ry="110" fill="#6A2A8A" opacity="0.08" filter="url(#rayBlur)" style={{ animation: "shadowBreath 10s ease-in-out infinite" }} />

        {/* Atmospheric glow fields */}
        <ellipse cx="1010" cy="340" rx="680" ry="440" fill="url(#divGlow)" className="animate-divine-ray" />
        <ellipse cx="370"  cy="520" rx="450" ry="310" fill="url(#shadGlow)" className="animate-shadow-breath" />
        <ellipse cx="1150" cy="100" rx="175" ry="110" fill="url(#moonGlow)" />
        {/* Blue moonlight highlight */}
        <ellipse cx="1150" cy="100" rx="280" ry="190" fill="url(#moonHalo)" />

        {/* Stars */}
        {STARS.map((s, i) => (
          <circle
            key={i} cx={s.x} cy={s.y} r={s.r}
            fill="white" opacity={s.opacity}
            style={{ animation: `twinkle ${s.animDur} ${s.animDelay} infinite alternate ease-in-out` }}
          />
        ))}

        {/* Crescent moon */}
        <path d="M 1106 66 Q 1150 92 1120 150 Q 1172 118 1150 66 Z" fill="#E8D5A0" opacity="0.72" filter="url(#softGlow)" />

        {/* Divine light rays */}
        <g filter="url(#rayBlur)" className="animate-divine-ray">
          <line x1="1370" y1="170" x2="380" y2="760" stroke="#C4933A" strokeWidth="65" opacity="0.07" />
          <line x1="1400" y1="230" x2="500" y2="860" stroke="#C4933A" strokeWidth="42" opacity="0.06" />
          <line x1="1310" y1="140" x2="340" y2="710" stroke="#D4A840" strokeWidth="28" opacity="0.08" />
          <line x1="1340" y1="280" x2="460" y2="820" stroke="#C4933A" strokeWidth="18" opacity="0.05" />
        </g>

        {/* ── Distant Divine Aura — a faint, far-off presence watching over the mountain ── */}
        <g transform="translate(640, 520) scale(0.42)" opacity="0.15" filter="url(#auraBlur)">
          <ellipse cx="80" cy="195" rx="115" ry="210" fill="#C4933A" opacity="0.10" filter="url(#goldBloom)" />
          <circle cx="80" cy="22" r="25" fill="#020408" />
          <ellipse cx="80" cy="4"  rx="11" ry="15" fill="#020408" />
          <rect x="73" y="45" width="14" height="14" rx="2" fill="#020408" />
          <path d="M 28 60 L 14 100 L 20 170 L 140 170 L 146 100 L 132 60 Q 110 52 80 52 Q 50 52 28 60 Z" fill="#020408" />
          <path d="M 30 72 L -2 26 L -9 4 L 6 10 L 3 26 L 32 77 Z" fill="#020408" />
          <rect x="-14" y="-8" width="3.5" height="26" rx="1" fill="#C4933A" opacity="0.7" />
          <path d="M -12.3,-8 L -8.8,-24 L -5.3,-8 Z" fill="#C4933A" opacity="0.75" />
          <path d="M 130 72 L 166 112 L 172 140 L 158 135 L 154 118 L 128 76 Z" fill="#020408" />
          <path d="M 36 172 L 26 268 L 52 268 L 80 208 L 108 268 L 134 268 L 124 172 Z" fill="#020408" />
          <path d="M 28 60 L 14 100 L 20 170 L 140 170 L 146 100 L 132 60 Q 110 52 80 52 Q 50 52 28 60 Z"
            fill="none" stroke="#C4933A" strokeWidth="1.2" opacity="0.25" />
        </g>

        {/* ── Celestial Girl Silhouette — upper right ── */}
        <g transform="translate(955, 95)" opacity="0.22">
          <ellipse cx="56" cy="145" rx="115" ry="175" fill="#9080FF" opacity="0.1" />
          <ellipse cx="56" cy="100" rx="72"  ry="112" fill="#C0B0FF" opacity="0.07" />
          {/* Head */}
          <circle cx="56" cy="34" r="24" fill="#C8C0E8" opacity="0.52" />
          {/* Hair flowing */}
          <path d="M 34 24 Q 10 84 16 168 Q 28 160 25 108 Q 31 162 26 218" fill="#A898D0" opacity="0.38" />
          <path d="M 78 24 Q 102 84 96 168 Q 84 160 87 108 Q 81 162 86 218" fill="#A898D0" opacity="0.38" />
          {/* Dress/veil */}
          <path d="M 32 68 Q 8 156 14 268 L 98 268 Q 104 156 80 68 Z" fill="#C8C0E8" opacity="0.18" />
          {/* Cosmic veil trails */}
          <path d="M 30 48 Q -18 108 -6 228" fill="none" stroke="#D0C8FF" strokeWidth="1.5" opacity="0.24" />
          <path d="M 82 48 Q 130 108 118 228" fill="none" stroke="#D0C8FF" strokeWidth="1.5" opacity="0.24" />
          {/* Celestial particles */}
          {[0,1,2,3,4,5].map(i => (
            <circle key={i}
              cx={56 + Math.cos(i * Math.PI / 3) * 82}
              cy={110 + Math.sin(i * Math.PI / 3) * 82}
              r="2.2" fill="#C0B0FF" opacity="0.55"
              style={{ animation: `twinkle ${1.8 + i * 0.4}s ${i * 0.28}s infinite alternate` }}
            />
          ))}
        </g>

        {/* Glowing Sanskrit glyphs floating */}
        {SANSKRIT.map((g, i) => (
          <text key={i} x={g.x} y={g.y} fontSize={g.sz}
            fill="#C4933A" opacity={g.op}
            fontFamily="'Crimson Pro', Georgia, serif"
            filter="url(#softGlow)"
            style={{ animation: `driftFloat 9s ${g.d} infinite alternate ease-in-out` }}
          >
            {g.t}
          </text>
        ))}

        {/* Gold particles floating up */}
        {GOLD_PARTICLES.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r}
            fill="#C4933A" opacity="0.55"
            style={{ animation: `floatUp ${p.dur} ${p.delay} infinite linear` }}
          />
        ))}

        {/* Bottom mist */}
        <rect x="0" y="700" width="1400" height="200" fill="url(#bottomFade)" />
        {/* Top vignette */}
        <rect x="0" y="0"   width="1400" height="190" fill="url(#topFade)" />
        {/* Side vignettes */}
        <rect x="0"    y="0" width="130"  height="900" fill="url(#leftFade)" />
        <rect x="1270" y="0" width="130"  height="900" fill="url(#rightFade)" />
      </svg>
    </div>
  );
}

// ── Navigation ─────────────────────────────────────────
const NAV_LINKS = [
  { id: "home" as Page,       label: "Home",       icon: Home       },
  { id: "chapters" as Page,   label: "Chapters",   icon: BookOpen   },
  { id: "characters" as Page, label: "Characters", icon: Users      },
  { id: "world" as Page,      label: "World",      icon: Globe      },
  { id: "timeline" as Page,   label: "Timeline",   icon: Clock      },
  { id: "gallery" as Page,    label: "Gallery",    icon: ImageIcon  },
  { id: "about" as Page,      label: "About",      icon: Info       },
];

function Nav({ page, nav, search, setSearch }: { page: Page; nav: (p: Page) => void; search: boolean; setSearch: (v: boolean) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16" style={{ background: "rgba(7,7,15,0.82)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(196,147,58,0.12)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => nav("home")} className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A1A, #C4933A)" }}>
            <span className="text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: "#F0E8D8" }}>श</span>
          </div>
          <span className="text-lg hidden sm:block" style={{ fontFamily: "var(--font-display)", color: "#C4933A", letterSpacing: "0.05em" }}>
            Shiva Keshava
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <button
              key={l.id} onClick={() => nav(l.id)}
              className="px-3 py-2 text-sm rounded transition-colors duration-200"
              style={{
                fontFamily: "var(--font-label)",
                letterSpacing: "0.06em",
                color: page === l.id ? "#C4933A" : "#8A8A9A",
                background: page === l.id ? "rgba(196,147,58,0.08)" : "transparent",
              }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => { setSearch(!search); nav("search"); }}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/5"
            style={{ color: "#8A8A9A" }}>
            <Search size={18} />
          </button>
          <button onClick={() => nav("settings")}
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/5"
            style={{ color: "#8A8A9A" }}>
            <Settings size={18} />
          </button>
          <button className="lg:hidden w-9 h-9 flex items-center justify-center" onClick={() => setOpen(v => !v)} style={{ color: "#F0E8D8" }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden absolute top-16 left-0 right-0 border-t" style={{ background: "rgba(7,7,15,0.96)", backdropFilter: "blur(20px)", borderColor: "rgba(196,147,58,0.12)" }}>
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => { nav(l.id); setOpen(false); }}
              className="w-full flex items-center gap-3 px-6 py-3.5 text-left transition-colors hover:bg-white/5"
              style={{ color: page === l.id ? "#C4933A" : "#F0E8D8", borderBottom: "1px solid rgba(196,147,58,0.06)" }}>
              <l.icon size={16} style={{ color: "#C4933A" }} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: "0.85rem", letterSpacing: "0.06em" }}>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ── Section label ─────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs tracking-widest uppercase mb-4"
      style={{ fontFamily: "var(--font-label)", color: "#C4933A", background: "rgba(196,147,58,0.08)", border: "1px solid rgba(196,147,58,0.2)" }}>
      {children}
    </span>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl md:text-4xl mb-3" style={{ color: "#F0E8D8" }}>{children}</h2>
      {sub && <p className="text-lg" style={{ color: "#8A8A9A", fontFamily: "var(--font-body)" }}>{sub}</p>}
      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "rgba(196,147,58,0.15)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C4933A" }} />
        <div className="h-px w-16" style={{ background: "rgba(196,147,58,0.15)" }} />
      </div>
    </div>
  );
}

// ── Home Page ─────────────────────────────────────────
function HomePage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
        <HeroScene />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ animation: "fadeInUp 1s ease 0.3s both" }}>
          <SectionLabel>Indian Mythological Fantasy Manhwa</SectionLabel>
          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-5 leading-none gold-shimmer" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            Shiva Keshava
          </h1>
          <p className="text-xl md:text-2xl mb-6" style={{ color: "#C4933A", fontFamily: "var(--font-heading)", letterSpacing: "0.12em" }}>
            ॐ — Souls Written in the Stars
          </p>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: "#9A9090" }}>
            A warrior bound to the divine. A demon sealed in shadow. A face glimpsed in a dream that his soul has always known. One decree from Lord Shiva on Mount Kailash — and a destiny that cannot be denied.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => nav("reader")}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8B1A1A, #C4933A)", color: "#F0E8D8", fontFamily: "var(--font-label)", letterSpacing: "0.08em", boxShadow: "0 4px 24px rgba(196,147,58,0.25)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 40px rgba(196,147,58,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(196,147,58,0.25)"; }}>
              <Play size={16} />
              Start Reading
            </button>
            <button onClick={() => nav("world")}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-lg font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105"
              style={{ border: "1px solid rgba(196,147,58,0.35)", color: "#C4933A", fontFamily: "var(--font-label)", letterSpacing: "0.08em" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 32px rgba(196,147,58,0.28)"; e.currentTarget.style.borderColor = "rgba(196,147,58,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(196,147,58,0.35)"; }}>
              <Globe size={16} />
              Explore the World
            </button>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: "#8A8A9A", animation: "fadeInUp 1s ease 1.2s both" }}>
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-label)" }}>Scroll</span>
          <div className="w-px h-12" style={{ background: "linear-gradient(180deg, rgba(196,147,58,0.6), transparent)" }} />
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y" style={{ borderColor: "rgba(196,147,58,0.12)", background: "rgba(15,15,28,0.8)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "3", label: "Chapters" },
            { val: "42", label: "Pages Released" },
            { val: "5", label: "Characters" },
            { val: "∞", label: "Lifetimes of Fate" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "#C4933A" }}>{s.val}</div>
              <div className="text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Chapter */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
        <SectionLabel><Star size={12} /> Latest Chapter</SectionLabel>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[3/4] max-w-sm" style={{ border: "1px solid rgba(196,147,58,0.15)" }}>
            <img src={CHAPTERS[0].img} alt="Chapter 1 cover — The Shadow Cave" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-xs tracking-widest mb-3" style={{ fontFamily: "var(--font-label)", color: "#8B1A1A" }}>CHAPTER 01</div>
            <h2 className="text-3xl md:text-4xl mb-4" style={{ color: "#F0E8D8" }}>{CHAPTERS[0].title}</h2>
            <p className="text-lg mb-6 leading-relaxed" style={{ color: "#9A9090" }}>{CHAPTERS[0].summary}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {CHAPTERS[0].tags.map(t => (
                <span key={t} className="px-3 py-1 rounded text-xs tracking-wide" style={{ fontFamily: "var(--font-label)", color: "#C4933A", background: "rgba(196,147,58,0.08)", border: "1px solid rgba(196,147,58,0.18)" }}>{t}</span>
              ))}
            </div>
            <button onClick={() => nav("reader")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:gap-3"
              style={{ background: "rgba(196,147,58,0.1)", border: "1px solid rgba(196,147,58,0.25)", color: "#C4933A", fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>
              Read Chapter 1 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Characters Preview */}
      <section className="bg-card py-32 relative">
        {/* Gold gradient divider — top */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,147,58,0.5) 50%, transparent)" }} />
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionLabel><Users size={12} /> Characters</SectionLabel>
          <SectionTitle sub="The souls bound by cosmic design">Meet the Cast</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-7">
            {CHARACTERS.map((c, i) => (
              <button key={i} onClick={() => nav("characters")}
                className="group text-left relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2"
                style={{
                  background: "#141420",
                  border: "1px solid rgba(196,147,58,0.12)",
                  borderRadius: "20px",
                  height: "440px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                }}>
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "20px" }}>
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" style={{ objectPosition: "center 22%" }} />
                </div>
                {/* Base tint for depth */}
                <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "20px", background: "linear-gradient(180deg, transparent 38%, rgba(8,8,16,0.9) 100%)" }} />
                {/* Golden hover glow ring */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ borderRadius: "20px", boxShadow: `inset 0 0 0 1.5px ${c.color}88, 0 0 36px 6px rgba(196,147,58,0.35)` }}
                />
                {/* Glass-gradient name/role overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    background: "linear-gradient(180deg, rgba(10,10,20,0) 0%, rgba(10,10,20,0.6) 45%, rgba(10,10,20,0.92) 100%)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}>
                  <div className="h-0.5 rounded mb-2 transition-all duration-500 ease-out" style={{ width: "2rem", background: c.color }} />
                  <div className="text-sm font-medium" style={{ fontFamily: "var(--font-heading)", color: "#F0E8D8" }}>{c.name}</div>
                  <div className="text-xs mt-0.5" style={{ fontFamily: "var(--font-label)", color: "#9A9090", fontSize: "0.68rem" }}>{c.role.split("·")[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Gold gradient divider — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,147,58,0.5) 50%, transparent)" }} />
      </section>

      {/* World Preview */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-24">
        <SectionLabel><MapPin size={12} /> World</SectionLabel>
        <SectionTitle sub="Sacred lands, ethereal planes, and divine realms">The World of Keshava</SectionTitle>
        <div className="grid md:grid-cols-3 gap-5">
          {LOCATIONS.slice(0, 3).map((loc, i) => (
            <button key={i} onClick={() => nav("world")} className="group text-left rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-video overflow-hidden">
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(7,7,15,0.85) 100%)" }} />
                <div className="absolute bottom-0 p-4">
                  <div className="text-xs mb-1" style={{ fontFamily: "var(--font-label)", color: "#C4933A", letterSpacing: "0.08em" }}>{loc.type}</div>
                  <div className="text-base font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#F0E8D8" }}>{loc.name}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => nav("world")} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 hover:gap-3"
            style={{ color: "#C4933A", fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>
            Explore All Locations <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}

// ── Chapters Page ──────────────────────────────────────
function ChaptersPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <SectionLabel><BookOpen size={12} /> Library</SectionLabel>
      <SectionTitle sub="Follow Shiva Keshava across lifetimes">Chapter Library</SectionTitle>
      <div className="grid md:grid-cols-3 gap-8">
        {CHAPTERS.map((ch) => (
          <div key={ch.id} className="group rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            style={{ background: "#0F0F1C", border: "1px solid rgba(196,147,58,0.12)" }}>
            <div className="aspect-[3/4] relative overflow-hidden">
              <img src={ch.img} alt={`Chapter ${ch.num} cover`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,7,15,0.9) 100%)" }} />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded text-xs" style={{ fontFamily: "var(--font-label)", background: "rgba(7,7,15,0.8)", color: "#C4933A", border: "1px solid rgba(196,147,58,0.2)" }}>
                Ch. {ch.num}
              </div>
              {ch.status === "soon" && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs" style={{ fontFamily: "var(--font-label)", background: "rgba(139,26,26,0.6)", color: "#F0E8D8" }}>
                  Coming Soon
                </div>
              )}
              <div className="absolute bottom-0 p-4">
                <h3 className="text-lg mb-1" style={{ color: "#F0E8D8", fontFamily: "var(--font-heading)" }}>{ch.title}</h3>
                <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>{ch.sub}</div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "#8A8A9A" }}>{ch.summary}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {ch.tags.map(t => (
                  <span key={t} className="px-2.5 py-0.5 rounded text-xs" style={{ fontFamily: "var(--font-label)", color: "#C4933A", background: "rgba(196,147,58,0.08)" }}>{t}</span>
                ))}
              </div>
              {ch.status === "available" ? (
                <button onClick={() => nav("reader")}
                  className="w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #8B1A1A, #C4933A)", color: "#F0E8D8", fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>
                  <Play size={14} /> Read Now
                </button>
              ) : (
                <button className="w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-50"
                  style={{ border: "1px solid rgba(196,147,58,0.2)", color: "#C4933A", fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>
                  <Bookmark size={14} /> Notify Me
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reader Page ────────────────────────────────────────
function ReaderPage({ nav }: { nav: (p: Page) => void }) {
  const [scene, setScene] = useState(0);
  const sc = READER_SCENES[scene];
  const progress = ((scene + 1) / READER_SCENES.length) * 100;

  return (
    <div className="min-h-screen" style={{ background: "#04040A" }}>
      {/* Reading progress bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />

      {/* Reader header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(4,4,10,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(196,147,58,0.1)" }}>
        <button onClick={() => nav("chapters")} className="flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ color: "#8A8A9A", fontFamily: "var(--font-label)" }}>
          <ChevronLeft size={16} /> Library
        </button>
        <div className="text-center">
          <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "#C4933A", letterSpacing: "0.08em" }}>CHAPTER 1</div>
          <div className="text-sm" style={{ fontFamily: "var(--font-heading)", color: "#F0E8D8" }}>{sc.title}</div>
        </div>
        <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>
          Scene {scene + 1}/{READER_SCENES.length}
        </div>
      </div>

      {/* Scene nav tabs */}
      <div className="flex overflow-x-auto gap-0 border-b" style={{ borderColor: "rgba(196,147,58,0.1)" }}>
        {READER_SCENES.map((s, i) => (
          <button key={i} onClick={() => setScene(i)}
            className="flex-shrink-0 px-5 py-3 text-xs transition-colors duration-200"
            style={{
              fontFamily: "var(--font-label)", letterSpacing: "0.05em",
              color: scene === i ? "#C4933A" : "#8A8A9A",
              borderBottom: scene === i ? "2px solid #C4933A" : "2px solid transparent",
              background: "transparent",
            }}>
            {i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {sc.panels.map((p, i) => (
          <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(196,147,58,0.08)", background: "#080810" }}>
            {p.img && (
              <div className={p.wide ? "aspect-video" : "aspect-[4/3]"}>
                <img src={p.img} alt={p.desc} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 space-y-4">
              {/* Panel number */}
              <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "rgba(196,147,58,0.4)", letterSpacing: "0.1em" }}>
                PANEL {i + 1}
              </div>
              {/* Description */}
              <p className="text-base leading-relaxed italic" style={{ color: "#9A9090", fontFamily: "var(--font-body)" }}>
                {p.desc}
              </p>
              {/* SFX */}
              {p.sfx && (
                <div className="text-xl font-black tracking-wider" style={{ fontFamily: "var(--font-display)", color: "rgba(196,147,58,0.7)", textShadow: "0 0 20px rgba(196,147,58,0.3)" }}>
                  {p.sfx}
                </div>
              )}
              {/* Dialogue */}
              {p.char && p.dialogue && (
                <div className="rounded-lg p-4" style={{ background: "rgba(196,147,58,0.05)", border: "1px solid rgba(196,147,58,0.12)" }}>
                  <div className="text-xs mb-2 tracking-widest" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>
                    {p.char === "NARRATION" ? "✦ NARRATION" : `${p.char}:`}
                  </div>
                  <p className="text-base leading-relaxed" style={{ color: p.char === "NARRATION" ? "#B0A890" : "#F0E8D8", fontStyle: p.char === "NARRATION" ? "italic" : "normal", fontFamily: "var(--font-body)" }}>
                    "{p.dialogue}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scene navigation */}
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4 py-10 border-t" style={{ borderColor: "rgba(196,147,58,0.1)" }}>
        <button onClick={() => setScene(s => Math.max(0, s - 1))} disabled={scene === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all disabled:opacity-30"
          style={{ border: "1px solid rgba(196,147,58,0.2)", color: "#C4933A", fontFamily: "var(--font-label)" }}>
          <ChevronLeft size={15} /> Previous Scene
        </button>
        {scene < READER_SCENES.length - 1 ? (
          <button onClick={() => setScene(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #8B1A1A, #C4933A)", color: "#F0E8D8", fontFamily: "var(--font-label)" }}>
            Next Scene <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={() => nav("chapters")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm"
            style={{ background: "rgba(196,147,58,0.1)", color: "#C4933A", fontFamily: "var(--font-label)", border: "1px solid rgba(196,147,58,0.2)" }}>
            Back to Library <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Characters Page ────────────────────────────────────
function CharactersPage() {
  const [active, setActive] = useState(0);
  const c = CHARACTERS[active];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <SectionLabel><Users size={12} /> Encyclopedia</SectionLabel>
      <SectionTitle sub="The souls that shape the fate of the cosmos">Character Encyclopedia</SectionTitle>
      <div className="grid md:grid-cols-5 gap-3 mb-12">
        {CHARACTERS.map((ch, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="group rounded-xl overflow-hidden transition-all duration-200"
            style={{ border: `1px solid ${active === i ? ch.color : "rgba(196,147,58,0.1)"}`, background: active === i ? "rgba(15,15,28,0.9)" : "#0F0F1C" }}>
            <div className="aspect-[3/4] relative overflow-hidden">
              <img src={ch.img} alt={ch.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, rgba(7,7,15,0.92) 100%)` }} />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="w-full h-0.5 mb-2 rounded" style={{ background: ch.color }} />
                <div className="text-xs font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#F0E8D8" }}>{ch.name}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="grid md:grid-cols-3 gap-10 rounded-2xl p-8"
        style={{ background: "#0F0F1C", border: `1px solid ${c.color}25` }}>
        <div className="rounded-xl overflow-hidden aspect-[3/4]">
          <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="text-xs tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: c.color }}>{c.chapter}</div>
          <h2 className="text-3xl md:text-4xl mb-1" style={{ color: "#F0E8D8" }}>{c.name}</h2>
          <p className="text-sm mb-6" style={{ color: "#8A8A9A", fontFamily: "var(--font-label)" }}>{c.role}</p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "#B0A890" }}>{c.desc}</p>
          <blockquote className="border-l-2 pl-4 mb-6 italic" style={{ borderColor: c.color, color: "#C4933A" }}>
            "{c.quote}"
          </blockquote>
          <div className="flex flex-wrap gap-2">
            {c.traits.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs" style={{ fontFamily: "var(--font-label)", color: c.color, background: `${c.color}12`, border: `1px solid ${c.color}30` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── World Page ─────────────────────────────────────────
function WorldPage() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <SectionLabel><Globe size={12} /> Mythology & World</SectionLabel>
      <SectionTitle sub="Sacred lands, ethereal planes, and divine thresholds">The World of Shiva Keshava</SectionTitle>
      <div className="space-y-6">
        {LOCATIONS.map((loc, i) => (
          <div key={i} className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
            style={{ border: `1px solid ${active === i ? "rgba(196,147,58,0.3)" : "rgba(196,147,58,0.1)"}`, background: "#0F0F1C" }}
            onClick={() => setActive(active === i ? null : i)}>
            <div className={`grid ${active === i ? "md:grid-cols-2" : "grid-cols-1"} transition-all duration-300`}>
              <div className={`relative overflow-hidden ${active === i ? "aspect-video" : "aspect-[16/5]"} transition-all duration-500`}>
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(7,7,15,0.5) 0%, transparent 50%, rgba(7,7,15,0.4) 100%)" }} />
                <div className="absolute inset-0 flex items-center px-8">
                  <div>
                    <div className="text-xs mb-2 tracking-widest" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>{loc.type}</div>
                    <h3 className="text-2xl md:text-3xl" style={{ color: "#F0E8D8" }}>{loc.name}</h3>
                  </div>
                </div>
              </div>
              {active === i && (
                <div className="p-8 flex flex-col justify-center" style={{ animation: "fadeIn 0.3s ease" }}>
                  <p className="text-base leading-relaxed mb-6" style={{ color: "#9A9090" }}>{loc.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {loc.tags.map(t => (
                      <span key={t} className="px-3 py-1 rounded text-xs" style={{ fontFamily: "var(--font-label)", color: "#C4933A", background: "rgba(196,147,58,0.08)", border: "1px solid rgba(196,147,58,0.18)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Timeline Page ──────────────────────────────────────
function TimelinePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-8 py-16">
      <SectionLabel><Clock size={12} /> Timeline</SectionLabel>
      <SectionTitle sub="Every thread spun by destiny">Story Timeline</SectionTitle>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, rgba(196,147,58,0.6), rgba(196,147,58,0.1))" }} />
        <div className="space-y-8">
          {TIMELINE.map((ev, i) => (
            <div key={i} className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start gap-6 md:gap-12`}>
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full mt-1 border-2"
                style={{ background: TYPE_COLORS[ev.type], borderColor: "#07070F", zIndex: 1 }} />
              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="rounded-xl p-5 transition-all duration-200 hover:translate-y-[-2px]"
                  style={{ background: "#0F0F1C", border: `1px solid ${TYPE_COLORS[ev.type]}25` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[ev.type] }} />
                    <span className="text-xs tracking-widest" style={{ fontFamily: "var(--font-label)", color: TYPE_COLORS[ev.type] }}>{TYPE_LABELS[ev.type].toUpperCase()}</span>
                    <span className="text-xs ml-auto" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>{ev.time}</span>
                  </div>
                  <h4 className="text-base mb-2" style={{ color: "#F0E8D8", fontFamily: "var(--font-heading)" }}>{ev.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#8A8A9A" }}>{ev.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Gallery Page ───────────────────────────────────────
function GalleryPage() {
  const [viewing, setViewing] = useState<number | null>(null);
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
      <SectionLabel><ImageIcon size={12} /> Gallery</SectionLabel>
      <SectionTitle sub="Cinematic stills from the world of Shiva Keshava">Art Gallery</SectionTitle>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {GALLERY.map((item, i) => (
          <button key={i} onClick={() => setViewing(i)} className="group block w-full rounded-xl overflow-hidden relative break-inside-avoid">
            <img src={item.img} alt={item.title} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
              style={{ background: "linear-gradient(180deg, transparent 40%, rgba(7,7,15,0.9) 100%)" }}>
              <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#F0E8D8" }}>{item.title}</div>
              <div className="text-xs mt-1" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>{item.scene}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {viewing !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(4,4,10,0.96)" }}
          onClick={() => setViewing(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full"
            style={{ background: "rgba(196,147,58,0.1)", border: "1px solid rgba(196,147,58,0.2)", color: "#C4933A" }}>
            <X size={18} />
          </button>
          <div className="max-w-4xl w-full rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={GALLERY[viewing].img} alt={GALLERY[viewing].title} className="w-full object-cover" />
            <div className="p-4" style={{ background: "#0F0F1C" }}>
              <div className="font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#F0E8D8" }}>{GALLERY[viewing].title}</div>
              <div className="text-sm mt-1" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>{GALLERY[viewing].scene}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Search Page ────────────────────────────────────────
function SearchPage({ nav }: { nav: (p: Page) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allItems = [
    ...CHAPTERS.map(c => ({ type: "Chapter", title: c.title, sub: `Chapter ${c.num}`, action: () => nav("reader") })),
    ...CHARACTERS.map(c => ({ type: "Character", title: c.name, sub: c.role, action: () => nav("characters") })),
    ...LOCATIONS.map(l => ({ type: "Location", title: l.name, sub: l.type, action: () => nav("world") })),
    ...TIMELINE.map(t => ({ type: "Event", title: t.title, sub: t.time, action: () => nav("timeline") })),
  ];

  const results = query.length > 1
    ? allItems.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.sub.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <SectionLabel><Search size={12} /> Search</SectionLabel>
      <h1 className="text-3xl mb-8" style={{ color: "#F0E8D8" }}>Search the World</h1>
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8A8A9A" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search chapters, characters, locations..."
          className="w-full pl-12 pr-4 py-4 rounded-xl text-base outline-none"
          style={{ background: "#0F0F1C", border: "1px solid rgba(196,147,58,0.2)", color: "#F0E8D8", fontFamily: "var(--font-body)" }}
        />
      </div>
      {query.length > 1 && (
        <div className="space-y-2" style={{ animation: "fadeIn 0.2s ease" }}>
          {results.length === 0 ? (
            <div className="text-center py-12" style={{ color: "#8A8A9A" }}>No results for "{query}"</div>
          ) : results.map((r, i) => (
            <button key={i} onClick={r.action}
              className="w-full text-left flex items-center justify-between p-4 rounded-xl transition-all hover:translate-x-1"
              style={{ background: "#0F0F1C", border: "1px solid rgba(196,147,58,0.1)" }}>
              <div>
                <div className="text-xs mb-1" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>{r.type}</div>
                <div className="text-base" style={{ color: "#F0E8D8", fontFamily: "var(--font-heading)" }}>{r.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8A9A" }}>{r.sub}</div>
              </div>
              <ChevronRight size={16} style={{ color: "#C4933A" }} />
            </button>
          ))}
        </div>
      )}
      {query.length <= 1 && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Chapters", page: "chapters" as Page, count: "3" },
            { label: "Characters", page: "characters" as Page, count: "5" },
            { label: "Locations", page: "world" as Page, count: "5" },
            { label: "Timeline", page: "timeline" as Page, count: "9 Events" },
          ].map((cat) => (
            <button key={cat.label} onClick={() => nav(cat.page)}
              className="p-5 rounded-xl text-left transition-all hover:translate-y-[-2px]"
              style={{ background: "#0F0F1C", border: "1px solid rgba(196,147,58,0.1)" }}>
              <div className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "#C4933A" }}>{cat.count}</div>
              <div className="text-sm" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>{cat.label}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── About Page ─────────────────────────────────────────
function AboutPage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <SectionLabel><Info size={12} /> About</SectionLabel>
      <SectionTitle>About Shiva Keshava</SectionTitle>
      <div className="grid md:grid-cols-3 gap-10 mb-16">
        <div className="md:col-span-2 space-y-5 text-lg leading-relaxed" style={{ color: "#9A9090" }}>
          <p><span style={{ color: "#C4933A", fontFamily: "var(--font-heading)" }}>Shiva Keshava</span> is an Indian Mythological Fantasy Manhwa rooted in the rich cosmology of Hindu scripture — Lord Shiva, the Maha Mrityunjaya mantra, Mount Kailash, the sacred bond between devotee and deity, and the ancient conviction that every soul is written into the cosmos before it is born.</p>
          <p>The story follows <em style={{ color: "#F0E8D8" }}>Shiva Keshava</em>, a warrior of a sacred bloodline gifted with the power to seal shadow demons using Sanskrit rituals. After sealing a volcanic demon in a dark cave, he dreams of a woman his soul recognizes across a thousand lifetimes — a woman Lord Shiva himself reveals as his destined beloved.</p>
          <p>What begins as a warrior's duty becomes a seeker's pilgrimage — through forests, celestial portals, and the trials of faith — guided by the echo of a heart that belongs, and has always belonged, to a soul it has not yet found.</p>
          <blockquote className="border-l-2 pl-5 my-6 italic text-xl" style={{ borderColor: "#C4933A", color: "#C4933A" }}>
            "Not even an ant is born without the will of Lord Shiva."
          </blockquote>
        </div>
        <div className="space-y-4">
          {[
            { label: "Genre", val: "Mythological Fantasy Romance" },
            { label: "Tradition", val: "Hindu Cosmology" },
            { label: "Format", val: "Full-Color Manhwa" },
            { label: "Style", val: "Korean Manhwa × Indian Art" },
            { label: "Status", val: "Chapter 1 Available" },
            { label: "Update", val: "Ongoing" },
          ].map(m => (
            <div key={m.label} className="flex justify-between py-3 border-b" style={{ borderColor: "rgba(196,147,58,0.1)" }}>
              <span className="text-xs tracking-wide" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>{m.label}</span>
              <span className="text-sm text-right" style={{ color: "#F0E8D8", fontFamily: "var(--font-body)" }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <button onClick={() => nav("reader")}
          className="flex items-center gap-2 px-7 py-3 rounded-lg"
          style={{ background: "linear-gradient(135deg, #8B1A1A, #C4933A)", color: "#F0E8D8", fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>
          <Play size={15} /> Read Chapter 1
        </button>
        <button onClick={() => nav("characters")}
          className="flex items-center gap-2 px-7 py-3 rounded-lg"
          style={{ border: "1px solid rgba(196,147,58,0.25)", color: "#C4933A", fontFamily: "var(--font-label)" }}>
          <Users size={15} /> Meet the Characters
        </button>
      </div>
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────
function SettingsPage() {
  const [fontSize, setFontSize] = useState<"small" | "normal" | "large">("normal");
  const [showSfx, setShowSfx] = useState(true);
  const [autoScroll, setAutoScroll] = useState(false);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full transition-all duration-300 relative"
      style={{ background: value ? "#C4933A" : "rgba(196,147,58,0.15)", border: "1px solid rgba(196,147,58,0.2)" }}>
      <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300"
        style={{ background: "#F0E8D8", left: value ? "calc(100% - 18px)" : "2px" }} />
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <SectionLabel><Settings size={12} /> Preferences</SectionLabel>
      <SectionTitle>Settings</SectionTitle>
      <div className="space-y-2">
        {/* Reading */}
        <div className="rounded-xl p-6 mb-4" style={{ background: "#0F0F1C", border: "1px solid rgba(196,147,58,0.1)" }}>
          <div className="text-xs tracking-widest mb-5" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>READING EXPERIENCE</div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: "#F0E8D8" }}>Font Size</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8A9A" }}>Adjusts reader text size</div>
              </div>
              <div className="flex gap-1">
                {(["small", "normal", "large"] as const).map(s => (
                  <button key={s} onClick={() => setFontSize(s)}
                    className="px-3 py-1 rounded text-xs capitalize transition-all"
                    style={{ fontFamily: "var(--font-label)", background: fontSize === s ? "rgba(196,147,58,0.15)" : "transparent", color: fontSize === s ? "#C4933A" : "#8A8A9A", border: `1px solid ${fontSize === s ? "rgba(196,147,58,0.3)" : "rgba(196,147,58,0.08)"}` }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-px" style={{ background: "rgba(196,147,58,0.08)" }} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: "#F0E8D8" }}>Sound Effects</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8A9A" }}>Show SFX text in reader panels</div>
              </div>
              <Toggle value={showSfx} onChange={setShowSfx} />
            </div>
            <div className="h-px" style={{ background: "rgba(196,147,58,0.08)" }} />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: "#F0E8D8" }}>Auto-advance Panels</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8A9A" }}>Automatically progress through scenes</div>
              </div>
              <Toggle value={autoScroll} onChange={setAutoScroll} />
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="rounded-xl p-6" style={{ background: "#0F0F1C", border: "1px solid rgba(196,147,58,0.1)" }}>
          <div className="text-xs tracking-widest mb-5" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>DISPLAY</div>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: "#F0E8D8" }}>Theme</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A8A9A" }}>Dark mode is recommended for this title</div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "rgba(196,147,58,0.08)", border: "1px solid rgba(196,147,58,0.15)", color: "#C4933A", fontFamily: "var(--font-label)" }}>
                <Moon size={13} /> Dark Mode
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 rounded-xl text-center" style={{ background: "rgba(196,147,58,0.04)", border: "1px solid rgba(196,147,58,0.08)" }}>
        <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>
          Shiva Keshava · Indian Mythological Fantasy Manhwa · Chapter 1 Available
        </div>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────
function Footer({ nav }: { nav: (p: Page) => void }) {
  return (
    <footer className="border-t mt-12" style={{ borderColor: "rgba(196,147,58,0.12)", background: "#04040A" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl mb-3 gold-shimmer" style={{ fontFamily: "var(--font-display)" }}>Shiva Keshava</div>
            <div className="text-sm mb-4" style={{ fontFamily: "var(--font-label)", color: "#C4933A", letterSpacing: "0.12em" }}>ॐ — Souls Written in the Stars</div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "#8A8A9A" }}>
              An Indian Mythological Fantasy Manhwa rooted in sacred scripture — where the warrior's heart and the cosmos align.
            </p>
            <div className="flex gap-2 mt-6">
              {["Twitter", "Instagram", "Patreon"].map(s => (
                <button key={s} className="px-3 py-1.5 rounded text-xs transition-all hover:bg-white/5"
                  style={{ fontFamily: "var(--font-label)", color: "#8A8A9A", border: "1px solid rgba(196,147,58,0.1)" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <div className="text-xs tracking-widest mb-5" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>NAVIGATE</div>
            <div className="space-y-3">
              {NAV_LINKS.map(l => (
                <button key={l.id} onClick={() => nav(l.id)}
                  className="block text-sm transition-colors hover:text-white"
                  style={{ color: "#8A8A9A" }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Story info */}
          <div>
            <div className="text-xs tracking-widest mb-5" style={{ fontFamily: "var(--font-label)", color: "#C4933A" }}>THE STORY</div>
            <div className="space-y-3">
              {["Chapter 1 Available", "Chapter 2 — Coming Soon", "Chapter 3 — Coming Soon"].map(s => (
                <div key={s} className="text-sm" style={{ color: "#8A8A9A" }}>{s}</div>
              ))}
              <button onClick={() => nav("about")} className="text-sm mt-4 transition-colors hover:text-white" style={{ color: "#C4933A" }}>
                Read the story →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(196,147,58,0.08)" }}>
          <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A" }}>
            © 2024 Shiva Keshava Manhwa. All rights reserved.
          </div>
          <div className="text-xs" style={{ fontFamily: "var(--font-label)", color: "#8A8A9A", textAlign: "center" }}>
            Rooted in the sacred tradition of <span style={{ color: "#C4933A" }}>Hindu Cosmology</span> · All mythology honored as written
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");

  const nav = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isReader = page === "reader";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isReader && <Nav page={page} nav={nav} search={page === "search"} setSearch={() => nav("search")} />}

      <main className={!isReader ? "pt-16" : ""} style={{ animation: "fadeIn 0.4s ease" }}>
        {page === "home"       && <HomePage nav={nav} />}
        {page === "chapters"   && <ChaptersPage nav={nav} />}
        {page === "reader"     && <ReaderPage nav={nav} />}
        {page === "characters" && <CharactersPage />}
        {page === "world"      && <WorldPage />}
        {page === "timeline"   && <TimelinePage />}
        {page === "gallery"    && <GalleryPage />}
        {page === "search"     && <SearchPage nav={nav} />}
        {page === "about"      && <AboutPage nav={nav} />}
        {page === "settings"   && <SettingsPage />}
      </main>

      {!isReader && <Footer nav={nav} />}
    </div>
  );
}
