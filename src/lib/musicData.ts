/**
 * Music Data
 * 音乐学习模块的静态数据 - 知识点、和弦进行、制作课程
 */

import { ChordType, ScaleType, IntervalName } from "./musicTheory";

// 知识点分类
export type KnowledgeCategory = "intervals" | "chords" | "scales" | "rhythm";

// 难度级别
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

// 和弦进行风格
export type ProgressionStyle = "pop" | "rnb" | "jazz";

// 制作课程分类
export type ProductionCategory = "arrangement" | "mixing" | "sound-design";

// 知识点接口
export interface KnowledgePoint {
  id: string;
  category: KnowledgeCategory;
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
  difficulty: DifficultyLevel;
  audioExample?: {
    notes?: string[];
    chordType?: ChordType;
    scaleType?: ScaleType;
    intervalName?: IntervalName;
  };
  visualExample?: {
    highlightedNotes: string[];
  };
  tips?: string[];
  tipsCn?: string[];
}

// 和弦进行接口
export interface ChordProgressionData {
  id: string;
  name: string;
  nameCn: string;
  style: ProgressionStyle;
  chords: { root: string; type: ChordType; romanNumeral: string }[];
  exampleSongs: string[];
  description: string;
  descriptionCn: string;
}

// 制作课程接口
export interface ProductionLesson {
  id: string;
  category: ProductionCategory;
  title: string;
  titleCn: string;
  content: string;
  contentCn: string;
  tips: string[];
  tipsCn: string[];
  commonMistakes: string[];
  commonMistakesCn: string[];
  audioExamples?: string[];
}

// ============ 知识点数据 ============

export const KNOWLEDGE_POINTS: KnowledgePoint[] = [
  // === 音程 (Intervals) ===
  {
    id: "interval-minor-2nd",
    category: "intervals",
    title: "Minor 2nd",
    titleCn: "小二度",
    description:
      "The smallest interval in Western music, spanning one semitone. Creates tension and dissonance.",
    descriptionCn: "西方音乐中最小的音程，跨越一个半音。产生紧张感和不协和感。",
    difficulty: "beginner",
    audioExample: { intervalName: "minor2nd", notes: ["C4", "C#4"] },
    visualExample: { highlightedNotes: ["C4", "C#4"] },
    tips: ["Think of the Jaws theme", "Used in horror movie soundtracks"],
    tipsCn: ["想想《大白鲨》主题曲", "常用于恐怖电影配乐"],
  },
  {
    id: "interval-major-2nd",
    category: "intervals",
    title: "Major 2nd",
    titleCn: "大二度",
    description:
      "A whole step interval, spanning two semitones. The building block of major scales.",
    descriptionCn: "一个全音音程，跨越两个半音。大调音阶的基本构成单位。",
    difficulty: "beginner",
    audioExample: { intervalName: "major2nd", notes: ["C4", "D4"] },
    visualExample: { highlightedNotes: ["C4", "D4"] },
    tips: [
      "First two notes of a major scale",
      "Happy Birthday starts with this",
    ],
    tipsCn: ["大调音阶的前两个音", "《生日快乐》开头就是这个音程"],
  },
  {
    id: "interval-minor-3rd",
    category: "intervals",
    title: "Minor 3rd",
    titleCn: "小三度",
    description:
      "Three semitones apart. Defines the minor chord quality, creating a sad or melancholic feel.",
    descriptionCn: "相隔三个半音。定义小和弦的特质，产生悲伤或忧郁的感觉。",
    difficulty: "beginner",
    audioExample: { intervalName: "minor3rd", notes: ["C4", "Eb4"] },
    visualExample: { highlightedNotes: ["C4", "D#4"] },
    tips: ["Greensleeves melody", "Creates a sad feeling"],
    tipsCn: ["《绿袖子》旋律", "产生悲伤的感觉"],
  },
  {
    id: "interval-major-3rd",
    category: "intervals",
    title: "Major 3rd",
    titleCn: "大三度",
    description:
      "Four semitones apart. Defines the major chord quality, creating a bright and happy feel.",
    descriptionCn: "相隔四个半音。定义大和弦的特质，产生明亮和愉快的感觉。",
    difficulty: "beginner",
    audioExample: { intervalName: "major3rd", notes: ["C4", "E4"] },
    visualExample: { highlightedNotes: ["C4", "E4"] },
    tips: ["Oh When The Saints", "Creates a happy feeling"],
    tipsCn: ["《当圣徒进行时》", "产生愉快的感觉"],
  },
  {
    id: "interval-perfect-5th",
    category: "intervals",
    title: "Perfect 5th",
    titleCn: "纯五度",
    description:
      "Seven semitones apart. The most consonant interval after the octave, used in power chords.",
    descriptionCn: "相隔七个半音。除八度外最协和的音程，用于强力和弦。",
    difficulty: "beginner",
    audioExample: { intervalName: "perfect5th", notes: ["C4", "G4"] },
    visualExample: { highlightedNotes: ["C4", "G4"] },
    tips: ["Star Wars theme", "Foundation of power chords in rock"],
    tipsCn: ["《星球大战》主题曲", "摇滚强力和弦的基础"],
  },

  // === 和弦 (Chords) ===
  {
    id: "chord-major",
    category: "chords",
    title: "Major Chord",
    titleCn: "大三和弦",
    description:
      "Built with root, major 3rd, and perfect 5th. Sounds bright, happy, and stable.",
    descriptionCn: "由根音、大三度和纯五度构成。听起来明亮、愉快、稳定。",
    difficulty: "beginner",
    audioExample: { chordType: "major", notes: ["C4", "E4", "G4"] },
    visualExample: { highlightedNotes: ["C4", "E4", "G4"] },
    tips: ["The most common chord type", "Formula: 1-3-5"],
    tipsCn: ["最常见的和弦类型", "公式：1-3-5"],
  },
  {
    id: "chord-minor",
    category: "chords",
    title: "Minor Chord",
    titleCn: "小三和弦",
    description:
      "Built with root, minor 3rd, and perfect 5th. Sounds sad, dark, or mysterious.",
    descriptionCn: "由根音、小三度和纯五度构成。听起来悲伤、阴暗或神秘。",
    difficulty: "beginner",
    audioExample: { chordType: "minor", notes: ["C4", "D#4", "G4"] },
    visualExample: { highlightedNotes: ["C4", "D#4", "G4"] },
    tips: ["Lower the 3rd by a half step from major", "Formula: 1-b3-5"],
    tipsCn: ["将大和弦的三度降低半音", "公式：1-b3-5"],
  },
  {
    id: "chord-major7",
    category: "chords",
    title: "Major 7th Chord",
    titleCn: "大七和弦",
    description:
      "Major chord with added major 7th. Sounds dreamy, jazzy, and sophisticated.",
    descriptionCn: "大三和弦加上大七度。听起来梦幻、爵士、精致。",
    difficulty: "intermediate",
    audioExample: { chordType: "major7", notes: ["C4", "E4", "G4", "B4"] },
    visualExample: { highlightedNotes: ["C4", "E4", "G4", "B4"] },
    tips: ["Common in jazz and neo-soul", "Formula: 1-3-5-7"],
    tipsCn: ["常用于爵士和新灵魂乐", "公式：1-3-5-7"],
  },
  {
    id: "chord-minor7",
    category: "chords",
    title: "Minor 7th Chord",
    titleCn: "小七和弦",
    description:
      "Minor chord with added minor 7th. Sounds smooth, mellow, and soulful.",
    descriptionCn: "小三和弦加上小七度。听起来柔和、醇厚、有灵魂感。",
    difficulty: "intermediate",
    audioExample: { chordType: "minor7", notes: ["C4", "D#4", "G4", "A#4"] },
    visualExample: { highlightedNotes: ["C4", "D#4", "G4", "A#4"] },
    tips: ["Essential for R&B and jazz", "Formula: 1-b3-5-b7"],
    tipsCn: ["R&B和爵士的必备和弦", "公式：1-b3-5-b7"],
  },
  {
    id: "chord-dominant7",
    category: "chords",
    title: "Dominant 7th Chord",
    titleCn: "属七和弦",
    description:
      "Major chord with added minor 7th. Creates tension that wants to resolve.",
    descriptionCn: "大三和弦加上小七度。产生想要解决的紧张感。",
    difficulty: "intermediate",
    audioExample: { chordType: "dominant7", notes: ["G4", "B4", "D5", "F5"] },
    visualExample: { highlightedNotes: ["G4", "B4", "D5", "F5"] },
    tips: ["The V7 chord in a key", "Wants to resolve to the I chord"],
    tipsCn: ["调式中的V7和弦", "想要解决到I级和弦"],
  },

  // === 音阶 (Scales) ===
  {
    id: "scale-major",
    category: "scales",
    title: "Major Scale",
    titleCn: "大调音阶",
    description:
      "The most common scale in Western music. Pattern: W-W-H-W-W-W-H (W=whole, H=half).",
    descriptionCn: "西方音乐中最常见的音阶。模式：全-全-半-全-全-全-半。",
    difficulty: "beginner",
    audioExample: {
      scaleType: "major",
      notes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
    },
    visualExample: {
      highlightedNotes: ["C4", "D4", "E4", "F4", "G4", "A4", "B4"],
    },
    tips: ["Do-Re-Mi-Fa-Sol-La-Ti", "Happy and bright sound"],
    tipsCn: ["Do-Re-Mi-Fa-Sol-La-Ti", "明亮愉快的声音"],
  },
  {
    id: "scale-natural-minor",
    category: "scales",
    title: "Natural Minor Scale",
    titleCn: "自然小调音阶",
    description: "The relative minor of major scale. Pattern: W-H-W-W-H-W-W.",
    descriptionCn: "大调的关系小调。模式：全-半-全-全-半-全-全。",
    difficulty: "beginner",
    audioExample: {
      scaleType: "natural-minor",
      notes: ["A4", "B4", "C5", "D5", "E5", "F5", "G5"],
    },
    visualExample: {
      highlightedNotes: ["A4", "B4", "C5", "D5", "E5", "F5", "G5"],
    },
    tips: ["Sad and melancholic sound", "A minor uses all white keys"],
    tipsCn: ["悲伤忧郁的声音", "A小调只用白键"],
  },
  {
    id: "scale-pentatonic-major",
    category: "scales",
    title: "Major Pentatonic Scale",
    titleCn: "大调五声音阶",
    description:
      "Five-note scale without half steps. Very versatile and hard to play wrong notes.",
    descriptionCn: "没有半音的五音音阶。非常通用，很难弹错音。",
    difficulty: "beginner",
    audioExample: {
      scaleType: "pentatonic-major",
      notes: ["C4", "D4", "E4", "G4", "A4"],
    },
    visualExample: { highlightedNotes: ["C4", "D4", "E4", "G4", "A4"] },
    tips: ["Great for improvisation", "Used in blues, rock, and pop"],
    tipsCn: ["非常适合即兴演奏", "用于蓝调、摇滚和流行"],
  },
  {
    id: "scale-blues",
    category: "scales",
    title: "Blues Scale",
    titleCn: "蓝调音阶",
    description:
      "Minor pentatonic with added blue note (b5). Essential for blues and rock.",
    descriptionCn: "小调五声音阶加上蓝调音（b5）。蓝调和摇滚的必备音阶。",
    difficulty: "intermediate",
    audioExample: {
      scaleType: "blues",
      notes: ["C4", "D#4", "F4", "F#4", "G4", "A#4"],
    },
    visualExample: {
      highlightedNotes: ["C4", "D#4", "F4", "F#4", "G4", "A#4"],
    },
    tips: [
      "The blue note adds tension",
      "Bend into the blue note for expression",
    ],
    tipsCn: ["蓝调音增加紧张感", "推弦到蓝调音增加表现力"],
  },
  {
    id: "scale-dorian",
    category: "scales",
    title: "Dorian Mode",
    titleCn: "多利亚调式",
    description: "Minor scale with raised 6th. Popular in jazz, funk, and R&B.",
    descriptionCn: "升高六度的小调音阶。在爵士、放克和R&B中很流行。",
    difficulty: "intermediate",
    audioExample: {
      scaleType: "dorian",
      notes: ["D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    },
    visualExample: {
      highlightedNotes: ["D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    },
    tips: ["Minor with a brighter 6th", "So What by Miles Davis"],
    tipsCn: ["带有明亮六度的小调", "Miles Davis的《So What》"],
  },

  // === 节奏 (Rhythm) ===
  {
    id: "rhythm-4-4",
    category: "rhythm",
    title: "4/4 Time Signature",
    titleCn: "4/4拍",
    description:
      "The most common time signature. Four beats per measure, quarter note gets one beat.",
    descriptionCn: "最常见的拍号。每小节四拍，四分音符为一拍。",
    difficulty: "beginner",
    tips: ["Count: 1-2-3-4", "Used in most pop, rock, and R&B"],
    tipsCn: ["数：1-2-3-4", "用于大多数流行、摇滚和R&B"],
  },
  {
    id: "rhythm-syncopation",
    category: "rhythm",
    title: "Syncopation",
    titleCn: "切分音",
    description:
      "Accenting off-beats or weak beats. Creates groove and forward motion.",
    descriptionCn: "强调弱拍或反拍。创造律动感和前进感。",
    difficulty: "intermediate",
    tips: ["Essential for funk and R&B", 'Accent the "and" beats'],
    tipsCn: ["放克和R&B的必备元素", '强调"和"拍'],
  },
  {
    id: "rhythm-swing",
    category: "rhythm",
    title: "Swing Feel",
    titleCn: "摇摆节奏",
    description:
      "Uneven division of beats, creating a bouncy feel. Essential for jazz.",
    descriptionCn: "不均匀的节拍划分，创造弹跳感。爵士乐的必备元素。",
    difficulty: "intermediate",
    tips: ["Long-short pattern", "Think triplet feel"],
    tipsCn: ["长-短模式", "想象三连音的感觉"],
  },
];

// ============ 和弦进行数据 ============

export const CHORD_PROGRESSIONS: ChordProgressionData[] = [
  // === Pop ===
  {
    id: "pop-1-5-6-4",
    name: "I-V-vi-IV",
    nameCn: "万能和弦进行",
    style: "pop",
    chords: [
      { root: "C4", type: "major", romanNumeral: "I" },
      { root: "G4", type: "major", romanNumeral: "V" },
      { root: "A4", type: "minor", romanNumeral: "vi" },
      { root: "F4", type: "major", romanNumeral: "IV" },
    ],
    exampleSongs: [
      "Let It Be - The Beatles",
      "No Woman No Cry - Bob Marley",
      "With or Without You - U2",
    ],
    description:
      "The most popular chord progression in pop music. Works for almost any song.",
    descriptionCn: "流行音乐中最常用的和弦进行。几乎适用于任何歌曲。",
  },
  {
    id: "pop-1-4-5-4",
    name: "I-IV-V-IV",
    nameCn: "经典摇滚进行",
    style: "pop",
    chords: [
      { root: "C4", type: "major", romanNumeral: "I" },
      { root: "F4", type: "major", romanNumeral: "IV" },
      { root: "G4", type: "major", romanNumeral: "V" },
      { root: "F4", type: "major", romanNumeral: "IV" },
    ],
    exampleSongs: ["Wild Thing - The Troggs", "Louie Louie - The Kingsmen"],
    description: "Classic rock and roll progression. Simple but effective.",
    descriptionCn: "经典摇滚进行。简单但有效。",
  },
  {
    id: "pop-6-4-1-5",
    name: "vi-IV-I-V",
    nameCn: "悲伤四和弦",
    style: "pop",
    chords: [
      { root: "A4", type: "minor", romanNumeral: "vi" },
      { root: "F4", type: "major", romanNumeral: "IV" },
      { root: "C4", type: "major", romanNumeral: "I" },
      { root: "G4", type: "major", romanNumeral: "V" },
    ],
    exampleSongs: [
      "Despacito - Luis Fonsi",
      "Hello - Adele",
      "Grenade - Bruno Mars",
    ],
    description: "Starting on minor creates a more emotional feel.",
    descriptionCn: "从小和弦开始创造更感性的感觉。",
  },

  // === R&B / Neo-Soul ===
  {
    id: "rnb-2-5-1",
    name: "ii-V-I",
    nameCn: "二五一进行",
    style: "rnb",
    chords: [
      { root: "D4", type: "minor7", romanNumeral: "ii7" },
      { root: "G4", type: "dominant7", romanNumeral: "V7" },
      { root: "C4", type: "major7", romanNumeral: "Imaj7" },
    ],
    exampleSongs: [
      "Fly Me to the Moon",
      "Autumn Leaves",
      "All The Things You Are",
    ],
    description:
      "The most important progression in jazz. Creates strong resolution.",
    descriptionCn: "爵士乐中最重要的进行。创造强烈的解决感。",
  },
  {
    id: "rnb-1-6-2-5",
    name: "Imaj7-vi7-ii7-V7",
    nameCn: "循环进行",
    style: "rnb",
    chords: [
      { root: "C4", type: "major7", romanNumeral: "Imaj7" },
      { root: "A4", type: "minor7", romanNumeral: "vi7" },
      { root: "D4", type: "minor7", romanNumeral: "ii7" },
      { root: "G4", type: "dominant7", romanNumeral: "V7" },
    ],
    exampleSongs: [
      "I Will Always Love You - Whitney Houston",
      "Just The Two of Us - Grover Washington Jr.",
    ],
    description: "Smooth cycling progression popular in R&B and neo-soul.",
    descriptionCn: "在R&B和新灵魂乐中流行的平滑循环进行。",
  },
  {
    id: "rnb-neo-soul",
    name: "Neo-Soul Progression",
    nameCn: "新灵魂乐进行",
    style: "rnb",
    chords: [
      { root: "F4", type: "major7", romanNumeral: "IVmaj7" },
      { root: "E4", type: "minor7", romanNumeral: "iii7" },
      { root: "A4", type: "minor7", romanNumeral: "vi7" },
      { root: "D4", type: "minor7", romanNumeral: "ii7" },
    ],
    exampleSongs: [
      "Untitled (How Does It Feel) - D'Angelo",
      "Electric - Alina Baraz",
    ],
    description:
      "Dreamy progression with all 7th chords. Very smooth and sophisticated.",
    descriptionCn: "全部使用七和弦的梦幻进行。非常平滑和精致。",
  },

  // === Jazz ===
  {
    id: "jazz-rhythm-changes",
    name: "Rhythm Changes",
    nameCn: "节奏变化",
    style: "jazz",
    chords: [
      { root: "Bb4", type: "major7", romanNumeral: "Imaj7" },
      { root: "G4", type: "minor7", romanNumeral: "vi7" },
      { root: "C4", type: "minor7", romanNumeral: "ii7" },
      { root: "F4", type: "dominant7", romanNumeral: "V7" },
    ],
    exampleSongs: ["I Got Rhythm - George Gershwin", "Oleo - Sonny Rollins"],
    description: "Based on I Got Rhythm. Foundation for many jazz standards.",
    descriptionCn: "基于《I Got Rhythm》。许多爵士标准曲的基础。",
  },
  {
    id: "jazz-coltrane-changes",
    name: "Coltrane Changes",
    nameCn: "科特兰变化",
    style: "jazz",
    chords: [
      { root: "C4", type: "major7", romanNumeral: "Imaj7" },
      { root: "Ab4", type: "dominant7", romanNumeral: "bVI7" },
      { root: "E4", type: "major7", romanNumeral: "IIImaj7" },
      { root: "B4", type: "dominant7", romanNumeral: "VII7" },
    ],
    exampleSongs: ["Giant Steps - John Coltrane", "Countdown - John Coltrane"],
    description:
      "Advanced progression using major third cycles. Very challenging.",
    descriptionCn: "使用大三度循环的高级进行。非常具有挑战性。",
  },
  {
    id: "jazz-minor-2-5-1",
    name: "Minor ii-V-i",
    nameCn: "小调二五一",
    style: "jazz",
    chords: [
      { root: "D4", type: "half-diminished7", romanNumeral: "iiø7" },
      { root: "G4", type: "dominant7", romanNumeral: "V7" },
      { root: "C4", type: "minor7", romanNumeral: "i7" },
    ],
    exampleSongs: [
      "Autumn Leaves (minor section)",
      "Blue Bossa - Kenny Dorham",
    ],
    description:
      "Minor key version of ii-V-I. Creates darker, more mysterious sound.",
    descriptionCn: "二五一的小调版本。创造更暗、更神秘的声音。",
  },
];

// ============ 制作课程数据 ============

export const PRODUCTION_LESSONS: ProductionLesson[] = [
  // === Arrangement ===
  {
    id: "arrangement-song-structure",
    category: "arrangement",
    title: "Song Structure Basics",
    titleCn: "歌曲结构基础",
    content:
      "Learn the common song structures used in pop music: Verse-Chorus-Verse-Chorus-Bridge-Chorus. Understanding structure helps you create songs that feel complete and satisfying.",
    contentCn:
      "学习流行音乐中常用的歌曲结构：主歌-副歌-主歌-副歌-桥段-副歌。理解结构有助于创作完整且令人满意的歌曲。",
    tips: [
      "Start with a simple ABABCB structure",
      "Use contrast between sections",
      "Build energy towards the chorus",
    ],
    tipsCn: [
      "从简单的ABABCB结构开始",
      "在各部分之间使用对比",
      "向副歌积累能量",
    ],
    commonMistakes: [
      "Making all sections sound the same",
      "Too many different sections",
      "No clear climax or peak",
    ],
    commonMistakesCn: [
      "让所有部分听起来一样",
      "太多不同的部分",
      "没有明确的高潮或顶点",
    ],
  },
  {
    id: "arrangement-layering",
    category: "arrangement",
    title: "Layering Instruments",
    titleCn: "乐器叠加",
    content:
      "Layering is the art of combining multiple sounds to create a fuller, richer texture. Learn when to add and remove elements for maximum impact.",
    contentCn:
      "叠加是将多种声音组合以创造更丰富质感的艺术。学习何时添加和移除元素以获得最大效果。",
    tips: [
      "Start sparse, add layers gradually",
      "Each layer should serve a purpose",
      "Use frequency separation to avoid muddiness",
    ],
    tipsCn: [
      "从稀疏开始，逐渐添加层次",
      "每一层都应该有其目的",
      "使用频率分离避免浑浊",
    ],
    commonMistakes: [
      "Adding too many layers at once",
      "Layers fighting for the same frequency space",
      "Not leaving room for vocals",
    ],
    commonMistakesCn: [
      "一次添加太多层次",
      "层次争夺相同的频率空间",
      "没有为人声留出空间",
    ],
  },
  {
    id: "arrangement-dynamics",
    category: "arrangement",
    title: "Dynamic Arrangement",
    titleCn: "动态编曲",
    content:
      "Dynamics create emotional impact. Learn to use volume, intensity, and instrumentation changes to create movement in your songs.",
    contentCn:
      "动态创造情感冲击。学习使用音量、强度和配器变化在歌曲中创造动感。",
    tips: [
      "Drop elements before the chorus for impact",
      "Use automation for gradual changes",
      "Contrast quiet verses with loud choruses",
    ],
    tipsCn: [
      "在副歌前减少元素以增加冲击力",
      "使用自动化进行渐变",
      "用安静的主歌对比响亮的副歌",
    ],
    commonMistakes: [
      "Everything at the same volume throughout",
      "No build-up before drops",
      "Sudden jarring changes",
    ],
    commonMistakesCn: ["全程音量相同", "下落前没有铺垫", "突然的刺耳变化"],
  },

  // === Mixing ===
  {
    id: "mixing-eq-basics",
    category: "mixing",
    title: "EQ Fundamentals",
    titleCn: "EQ基础",
    content:
      "EQ (Equalization) shapes the frequency content of sounds. Learn to cut problem frequencies and boost pleasant ones to create clarity in your mix.",
    contentCn:
      "EQ（均衡器）塑造声音的频率内容。学习削减问题频率并提升悦耳频率，以在混音中创造清晰度。",
    tips: [
      "Cut before you boost",
      "Use high-pass filters on non-bass elements",
      "Make small, surgical cuts for problem frequencies",
    ],
    tipsCn: [
      "先削减再提升",
      "在非低音元素上使用高通滤波器",
      "对问题频率进行小幅精确削减",
    ],
    commonMistakes: [
      "Boosting too much",
      "Not using high-pass filters",
      "EQing in solo instead of in context",
    ],
    commonMistakesCn: [
      "提升过多",
      "不使用高通滤波器",
      "在独奏而非上下文中调整EQ",
    ],
  },
  {
    id: "mixing-compression",
    category: "mixing",
    title: "Compression Basics",
    titleCn: "压缩基础",
    content:
      "Compression controls dynamic range, making quiet parts louder and loud parts quieter. Essential for professional-sounding mixes.",
    contentCn:
      "压缩控制动态范围，使安静部分更响，响亮部分更安静。专业混音的必备工具。",
    tips: [
      "Start with a ratio of 3:1 or 4:1",
      "Set attack and release to match the material",
      "Use makeup gain to compensate for volume reduction",
    ],
    tipsCn: [
      "从3:1或4:1的比率开始",
      "设置起音和释放以匹配素材",
      "使用补偿增益弥补音量降低",
    ],
    commonMistakes: [
      "Over-compressing and killing dynamics",
      "Attack too fast, losing transients",
      "Not using makeup gain",
    ],
    commonMistakesCn: [
      "过度压缩，扼杀动态",
      "起音太快，丢失瞬态",
      "不使用补偿增益",
    ],
  },
  {
    id: "mixing-reverb-delay",
    category: "mixing",
    title: "Reverb and Delay",
    titleCn: "混响和延迟",
    content:
      "Reverb and delay create space and depth in your mix. Learn to use them to place sounds in a virtual room.",
    contentCn:
      "混响和延迟在混音中创造空间和深度。学习使用它们将声音放置在虚拟房间中。",
    tips: [
      "Use sends instead of inserts for flexibility",
      "Match reverb time to song tempo",
      "Use pre-delay to maintain clarity",
    ],
    tipsCn: [
      "使用发送而非插入以获得灵活性",
      "将混响时间与歌曲速度匹配",
      "使用预延迟保持清晰度",
    ],
    commonMistakes: [
      "Too much reverb, creating mud",
      "Same reverb on everything",
      "Not using EQ on reverb returns",
    ],
    commonMistakesCn: [
      "混响过多，造成浑浊",
      "所有东西使用相同混响",
      "不在混响返回上使用EQ",
    ],
  },

  // === Sound Design ===
  {
    id: "sound-design-synthesis",
    category: "sound-design",
    title: "Synthesis Basics",
    titleCn: "合成器基础",
    content:
      "Learn the fundamentals of sound synthesis: oscillators, filters, envelopes, and LFOs. These are the building blocks of electronic sound.",
    contentCn:
      "学习声音合成的基础：振荡器、滤波器、包络和LFO。这些是电子声音的基本构建块。",
    tips: [
      "Start with a simple subtractive synth",
      "Learn one synth deeply before moving on",
      "Experiment with filter cutoff and resonance",
    ],
    tipsCn: [
      "从简单的减法合成器开始",
      "深入学习一个合成器后再继续",
      "尝试滤波器截止频率和共振",
    ],
    commonMistakes: [
      "Using too many presets without understanding",
      "Ignoring the filter section",
      "Not using envelopes creatively",
    ],
    commonMistakesCn: [
      "使用太多预设而不理解",
      "忽略滤波器部分",
      "不创造性地使用包络",
    ],
  },
  {
    id: "sound-design-sampling",
    category: "sound-design",
    title: "Sampling Techniques",
    titleCn: "采样技术",
    content:
      "Sampling is the art of taking existing sounds and transforming them into new instruments. Learn to chop, stretch, and manipulate samples.",
    contentCn: "采样是将现有声音转化为新乐器的艺术。学习切割、拉伸和处理采样。",
    tips: [
      "Always clear samples or use royalty-free sources",
      "Pitch and time-stretch for creative effects",
      "Layer samples for unique textures",
    ],
    tipsCn: [
      "始终清除采样或使用免版税来源",
      "使用音高和时间拉伸创造效果",
      "叠加采样以获得独特质感",
    ],
    commonMistakes: [
      "Using uncleared samples commercially",
      "Not processing samples enough",
      "Samples not matching the key or tempo",
    ],
    commonMistakesCn: [
      "商业使用未清除的采样",
      "采样处理不足",
      "采样与调式或速度不匹配",
    ],
  },
  {
    id: "sound-design-foley",
    category: "sound-design",
    title: "Foley and Field Recording",
    titleCn: "Foley和实地录音",
    content:
      "Create unique sounds by recording real-world objects. Foley adds organic texture that synthesizers cannot replicate.",
    contentCn:
      "通过录制现实世界的物体创造独特声音。Foley添加合成器无法复制的有机质感。",
    tips: [
      "Record in quiet environments",
      "Experiment with unusual objects",
      "Process recordings with effects",
    ],
    tipsCn: ["在安静的环境中录音", "尝试不寻常的物体", "用效果器处理录音"],
    commonMistakes: [
      "Poor recording quality",
      "Not editing out unwanted noise",
      "Using recordings without processing",
    ],
    commonMistakesCn: [
      "录音质量差",
      "不编辑掉不需要的噪音",
      "不处理就使用录音",
    ],
  },
];

// ============ 辅助函数 ============

/**
 * 按分类获取知识点
 */
export function getKnowledgePointsByCategory(
  category: KnowledgeCategory
): KnowledgePoint[] {
  return KNOWLEDGE_POINTS.filter((kp) => kp.category === category);
}

/**
 * 按难度获取知识点
 */
export function getKnowledgePointsByDifficulty(
  difficulty: DifficultyLevel
): KnowledgePoint[] {
  return KNOWLEDGE_POINTS.filter((kp) => kp.difficulty === difficulty);
}

/**
 * 按风格获取和弦进行
 */
export function getChordProgressionsByStyle(
  style: ProgressionStyle
): ChordProgressionData[] {
  return CHORD_PROGRESSIONS.filter((cp) => cp.style === style);
}

/**
 * 按分类获取制作课程
 */
export function getProductionLessonsByCategory(
  category: ProductionCategory
): ProductionLesson[] {
  return PRODUCTION_LESSONS.filter((pl) => pl.category === category);
}

/**
 * 获取知识点总数
 */
export function getTotalKnowledgePoints(): number {
  return KNOWLEDGE_POINTS.length;
}

/**
 * 获取各模块的知识点数量
 */
export function getModuleKnowledgePointCounts(): Record<
  KnowledgeCategory,
  number
> {
  return {
    intervals: getKnowledgePointsByCategory("intervals").length,
    chords: getKnowledgePointsByCategory("chords").length,
    scales: getKnowledgePointsByCategory("scales").length,
    rhythm: getKnowledgePointsByCategory("rhythm").length,
  };
}

/**
 * 根据 ID 获取知识点
 */
export function getKnowledgePointById(id: string): KnowledgePoint | undefined {
  return KNOWLEDGE_POINTS.find((kp) => kp.id === id);
}

/**
 * 根据 ID 获取和弦进行
 */
export function getChordProgressionById(
  id: string
): ChordProgressionData | undefined {
  return CHORD_PROGRESSIONS.find((cp) => cp.id === id);
}

/**
 * 根据 ID 获取制作课程
 */
export function getProductionLessonById(
  id: string
): ProductionLesson | undefined {
  return PRODUCTION_LESSONS.find((pl) => pl.id === id);
}
