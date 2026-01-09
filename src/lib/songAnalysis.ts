/**
 * Song Analysis Module - 歌曲分析模块
 * 分析编曲、作曲、混音等方面
 */

export type Genre = "rnb" | "kpop" | "soul" | "pop" | "hiphop";
export type AnalysisCategory =
  | "arrangement"
  | "composition"
  | "mixing"
  | "sound-design";

export interface SongSection {
  name: string;
  nameCn: string;
  bars: number;
  description: string;
  descriptionCn: string;
  instruments: string[];
  instrumentsCn: string[];
}

export interface PluginRecommendation {
  name: string;
  type: string;
  typeCn: string;
  usage: string;
  usageCn: string;
}

export interface SongAnalysis {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year: number;
  genre: Genre;
  bpm: number;
  key: string;
  keyCn: string;

  // 概述
  overview: string;
  overviewCn: string;

  // 歌曲结构
  structure: SongSection[];

  // 编曲分析
  arrangement: {
    summary: string;
    summaryCn: string;
    highlights: string[];
    highlightsCn: string[];
  };

  // 作曲分析
  composition: {
    chordProgression: string;
    chordProgressionCn: string;
    melody: string;
    melodyCn: string;
    harmony: string;
    harmonyCn: string;
  };

  // 混音分析
  mixing: {
    summary: string;
    summaryCn: string;
    techniques: string[];
    techniquesCn: string[];
  };

  // 音色设计
  soundDesign: {
    summary: string;
    summaryCn: string;
    keyElements: string[];
    keyElementsCn: string[];
  };

  // 推荐插件
  plugins: PluginRecommendation[];

  // 学习要点
  takeaways: string[];
  takeawaysCn: string[];
}

// 歌曲分析数据
export const SONG_ANALYSES: SongAnalysis[] = [
  {
    id: "get-you",
    title: "Get You",
    artist: "Daniel Caesar ft. Kali Uchis",
    album: "Freudian",
    year: 2017,
    genre: "rnb",
    bpm: 70,
    key: "F# Major",
    keyCn: "升F大调",
    overview:
      "A masterclass in modern R&B production, blending neo-soul warmth with contemporary minimalism. The track showcases Daniel Caesar's signature intimate vocal style over lush, jazzy chord progressions.",
    overviewCn:
      "现代R&B制作的典范之作，将新灵魂乐的温暖与当代极简主义完美融合。这首歌展示了Daniel Caesar标志性的亲密人声风格，配以丰富的爵士和弦进行。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 8,
        description: "Soft guitar arpeggios with subtle pad",
        descriptionCn: "柔和的吉他琶音配以微妙的铺底音色",
        instruments: ["Electric Guitar", "Synth Pad"],
        instrumentsCn: ["电吉他", "合成器铺底"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 16,
        description: "Intimate vocals with minimal instrumentation",
        descriptionCn: "亲密的人声配以极简的配器",
        instruments: ["Vocals", "Guitar", "Bass"],
        instrumentsCn: ["人声", "吉他", "贝斯"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 8,
        description: "Layered harmonies with fuller arrangement",
        descriptionCn: "层叠的和声配以更丰满的编曲",
        instruments: ["Vocals", "Guitar", "Bass", "Drums", "Strings"],
        instrumentsCn: ["人声", "吉他", "贝斯", "鼓", "弦乐"],
      },
      {
        name: "Verse 2",
        nameCn: "主歌2",
        bars: 16,
        description: "Kali Uchis verse with added texture",
        descriptionCn: "Kali Uchis的段落，增加了更多质感",
        instruments: ["Vocals", "Guitar", "Bass", "Percussion"],
        instrumentsCn: ["人声", "吉他", "贝斯", "打击乐"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 8,
        description: "Full arrangement with both vocalists",
        descriptionCn: "两位歌手的完整编曲",
        instruments: ["Vocals", "Full Band"],
        instrumentsCn: ["人声", "完整乐队"],
      },
      {
        name: "Outro",
        nameCn: "尾奏",
        bars: 8,
        description: "Gradual fade with vocal ad-libs",
        descriptionCn: "渐弱配以人声即兴",
        instruments: ["Vocals", "Guitar"],
        instrumentsCn: ["人声", "吉他"],
      },
    ],
    arrangement: {
      summary:
        'The arrangement follows a "less is more" philosophy, building emotional intensity through subtle additions rather than dramatic changes.',
      summaryCn:
        '编曲遵循"少即是多"的理念，通过微妙的叠加而非戏剧性的变化来构建情感强度。',
      highlights: [
        "Guitar serves as the harmonic foundation throughout",
        "Drums enter subtly in the chorus, never overpowering",
        "String arrangements add cinematic depth",
        "Space between elements creates intimacy",
      ],
      highlightsCn: [
        "吉他始终作为和声基础",
        "鼓在副歌中微妙进入，从不喧宾夺主",
        "弦乐编排增添电影感深度",
        "元素之间的空间创造亲密感",
      ],
    },
    composition: {
      chordProgression: "F#maj7 - G#m7 - A#m7 - D#7 (I - ii - iii - VI7)",
      chordProgressionCn:
        "升F大七 - 升G小七 - 升A小七 - 升D属七 (I - ii - iii - VI7)",
      melody:
        "The melody uses pentatonic scales with chromatic passing tones, creating a soulful yet sophisticated feel.",
      melodyCn:
        "旋律使用五声音阶配以半音经过音，创造出灵魂乐般又不失精致的感觉。",
      harmony:
        "Rich extended chords (7ths, 9ths) with smooth voice leading. The VI7 creates tension that resolves beautifully.",
      harmonyCn:
        "丰富的扩展和弦（七和弦、九和弦）配以流畅的声部进行。VI7创造的张力得到完美解决。",
    },
    mixing: {
      summary:
        "Warm, intimate mix with emphasis on vocal clarity and guitar texture.",
      summaryCn: "温暖、亲密的混音，强调人声清晰度和吉他质感。",
      techniques: [
        "Subtle saturation on vocals for warmth",
        "Wide stereo image on guitars",
        "Gentle compression to maintain dynamics",
        "Reverb with long decay for dreamy atmosphere",
      ],
      techniquesCn: [
        "人声上的微妙饱和度增添温暖",
        "吉他的宽广立体声像",
        "温和的压缩保持动态",
        "长衰减混响营造梦幻氛围",
      ],
    },
    soundDesign: {
      summary: "Organic sound palette with subtle electronic enhancements.",
      summaryCn: "有机的音色调色板配以微妙的电子增强。",
      keyElements: [
        "Clean electric guitar with chorus effect",
        "Warm synth pads in the background",
        "Acoustic-sounding drums with electronic processing",
        "Layered vocal harmonies with subtle pitch effects",
      ],
      keyElementsCn: [
        "带合唱效果的清音电吉他",
        "背景中温暖的合成器铺底",
        "带电子处理的原声鼓音色",
        "带微妙音高效果的层叠人声和声",
      ],
    },
    plugins: [
      {
        name: "Valhalla VintageVerb",
        type: "Reverb",
        typeCn: "混响",
        usage: "Create the dreamy, spacious atmosphere",
        usageCn: "创造梦幻、空旷的氛围",
      },
      {
        name: "Soundtoys Decapitator",
        type: "Saturation",
        typeCn: "饱和",
        usage: "Add warmth to vocals and guitars",
        usageCn: "为人声和吉他增添温暖",
      },
      {
        name: "FabFilter Pro-Q 3",
        type: "EQ",
        typeCn: "均衡器",
        usage: "Surgical EQ for vocal clarity",
        usageCn: "精确均衡提升人声清晰度",
      },
      {
        name: "Arturia Juno-6 V",
        type: "Synth",
        typeCn: "合成器",
        usage: "Warm pad sounds",
        usageCn: "温暖的铺底音色",
      },
    ],
    takeaways: [
      "Restraint in arrangement can create more emotional impact",
      "Extended chords add sophistication to simple progressions",
      "Vocal intimacy comes from proper mic technique and mixing",
      "Space in the mix is as important as the sounds themselves",
    ],
    takeawaysCn: [
      "编曲的克制可以创造更强的情感冲击",
      "扩展和弦为简单进行增添精致感",
      "人声的亲密感来自正确的麦克风技术和混音",
      "混音中的空间与声音本身同样重要",
    ],
  },

  {
    id: "best-part",
    title: "Best Part",
    artist: "Daniel Caesar ft. H.E.R.",
    album: "Freudian",
    year: 2017,
    genre: "rnb",
    bpm: 68,
    key: "G Major",
    keyCn: "G大调",
    overview:
      "A tender duet that exemplifies the neo-soul revival. The production is deliberately sparse, allowing the vocal chemistry between Daniel Caesar and H.E.R. to shine.",
    overviewCn:
      "一首温柔的二重唱，是新灵魂乐复兴的典范。制作刻意保持稀疏，让Daniel Caesar和H.E.R.之间的人声化学反应得以闪耀。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 4,
        description: "Gentle guitar intro",
        descriptionCn: "柔和的吉他前奏",
        instruments: ["Acoustic Guitar"],
        instrumentsCn: ["原声吉他"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 16,
        description: "Daniel's intimate opening",
        descriptionCn: "Daniel亲密的开场",
        instruments: ["Vocals", "Guitar", "Light Bass"],
        instrumentsCn: ["人声", "吉他", "轻贝斯"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 8,
        description: "Emotional peak with harmonies",
        descriptionCn: "带和声的情感高潮",
        instruments: ["Vocals", "Guitar", "Bass", "Soft Drums"],
        instrumentsCn: ["人声", "吉他", "贝斯", "轻鼓"],
      },
      {
        name: "Verse 2",
        nameCn: "主歌2",
        bars: 16,
        description: "H.E.R.'s verse with added warmth",
        descriptionCn: "H.E.R.的段落，增添温暖",
        instruments: ["Vocals", "Guitar", "Bass", "Keys"],
        instrumentsCn: ["人声", "吉他", "贝斯", "键盘"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 8,
        description: "Duet chorus",
        descriptionCn: "二重唱副歌",
        instruments: ["Vocals", "Full Arrangement"],
        instrumentsCn: ["人声", "完整编曲"],
      },
      {
        name: "Bridge",
        nameCn: "桥段",
        bars: 8,
        description: "Stripped back moment",
        descriptionCn: "简化的时刻",
        instruments: ["Vocals", "Guitar"],
        instrumentsCn: ["人声", "吉他"],
      },
      {
        name: "Outro",
        nameCn: "尾奏",
        bars: 8,
        description: "Vocal ad-libs and fade",
        descriptionCn: "人声即兴与渐弱",
        instruments: ["Vocals", "Guitar"],
        instrumentsCn: ["人声", "吉他"],
      },
    ],
    arrangement: {
      summary:
        "Ultra-minimal arrangement that puts vocals front and center. Every instrument serves the song without competing for attention.",
      summaryCn:
        "超极简编曲，将人声置于核心位置。每件乐器都服务于歌曲，不争夺注意力。",
      highlights: [
        "Acoustic guitar provides the entire harmonic foundation",
        "Bass enters only when needed for warmth",
        "No heavy drums - just subtle percussion",
        "Keyboard fills add color without clutter",
      ],
      highlightsCn: [
        "原声吉他提供整个和声基础",
        "贝斯仅在需要温暖时进入",
        "没有重鼓——只有微妙的打击乐",
        "键盘填充增添色彩而不杂乱",
      ],
    },
    composition: {
      chordProgression: "Gmaj7 - F#m7b5 - B7 - Em7 - Am7 - D7",
      chordProgressionCn: "G大七 - 升F半减七 - B属七 - E小七 - A小七 - D属七",
      melody:
        "Simple, singable melody that leaves room for vocal embellishments and runs.",
      melodyCn: "简单、易唱的旋律，为人声装饰和转音留出空间。",
      harmony:
        "Jazz-influenced progression with the ii-V-I turnaround. The F#m7b5 adds sophisticated tension.",
      harmonyCn: "受爵士影响的进行，带有ii-V-I回转。升F半减七增添精致的张力。",
    },
    mixing: {
      summary:
        "Clean, uncluttered mix that prioritizes vocal clarity and emotional connection.",
      summaryCn: "干净、整洁的混音，优先考虑人声清晰度和情感连接。",
      techniques: [
        "Minimal processing on vocals to preserve natural tone",
        "Subtle room reverb for cohesion",
        "Gentle high-pass filtering on guitars",
        "Dynamic EQ to manage vocal resonances",
      ],
      techniquesCn: [
        "人声上的最小处理以保留自然音色",
        "微妙的房间混响增强凝聚力",
        "吉他上的温和高通滤波",
        "动态均衡管理人声共振",
      ],
    },
    soundDesign: {
      summary: "Purely organic sound palette with no synthetic elements.",
      summaryCn: "纯有机音色调色板，没有合成元素。",
      keyElements: [
        "Nylon-string acoustic guitar tone",
        "Warm, round bass tone",
        "Natural room ambience",
        "Unprocessed vocal harmonies",
      ],
      keyElementsCn: [
        "尼龙弦原声吉他音色",
        "温暖、圆润的贝斯音色",
        "自然的房间氛围",
        "未处理的人声和声",
      ],
    },
    plugins: [
      {
        name: "UAD Neve 1073",
        type: "Preamp/EQ",
        typeCn: "前置放大器/均衡器",
        usage: "Warm vocal tone shaping",
        usageCn: "温暖的人声音色塑造",
      },
      {
        name: "Waves CLA-2A",
        type: "Compressor",
        typeCn: "压缩器",
        usage: "Gentle vocal compression",
        usageCn: "温和的人声压缩",
      },
      {
        name: "Valhalla Room",
        type: "Reverb",
        typeCn: "混响",
        usage: "Natural room ambience",
        usageCn: "自然的房间氛围",
      },
      {
        name: "Soundtoys Little Plate",
        type: "Reverb",
        typeCn: "混响",
        usage: "Subtle plate reverb on vocals",
        usageCn: "人声上微妙的板式混响",
      },
    ],
    takeaways: [
      "Sometimes the best production choice is to do less",
      "Vocal chemistry can carry an entire song",
      "Jazz harmony works beautifully in R&B context",
      "Natural sounds can be more impactful than processed ones",
    ],
    takeawaysCn: [
      "有时最好的制作选择是做得更少",
      "人声化学反应可以撑起整首歌",
      "爵士和声在R&B语境中效果很好",
      "自然的声音可能比处理过的更有冲击力",
    ],
  },

  {
    id: "kill-bill",
    title: "Kill Bill",
    artist: "SZA",
    album: "SOS",
    year: 2022,
    genre: "rnb",
    bpm: 89,
    key: "E Minor",
    keyCn: "E小调",
    overview:
      "A genre-blending track that combines R&B vocals with indie-rock instrumentation. The production juxtaposes dark lyrical content with an upbeat, almost cheerful musical backdrop.",
    overviewCn:
      "一首融合多种风格的歌曲，将R&B人声与独立摇滚配器结合。制作将黑暗的歌词内容与欢快、几乎愉悦的音乐背景并置。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 4,
        description: "Acoustic guitar riff",
        descriptionCn: "原声吉他riff",
        instruments: ["Acoustic Guitar"],
        instrumentsCn: ["原声吉他"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 8,
        description: "Playful vocal delivery",
        descriptionCn: "俏皮的人声演绎",
        instruments: ["Vocals", "Guitar", "Bass", "Drums"],
        instrumentsCn: ["人声", "吉他", "贝斯", "鼓"],
      },
      {
        name: "Pre-Chorus",
        nameCn: "预副歌",
        bars: 4,
        description: "Building tension",
        descriptionCn: "张力构建",
        instruments: ["Vocals", "Full Band"],
        instrumentsCn: ["人声", "完整乐队"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 8,
        description: "Catchy hook with layered vocals",
        descriptionCn: "带层叠人声的洗脑hook",
        instruments: ["Vocals", "Guitar", "Bass", "Drums", "Synths"],
        instrumentsCn: ["人声", "吉他", "贝斯", "鼓", "合成器"],
      },
      {
        name: "Verse 2",
        nameCn: "主歌2",
        bars: 8,
        description: "More intense delivery",
        descriptionCn: "更强烈的演绎",
        instruments: ["Vocals", "Full Band"],
        instrumentsCn: ["人声", "完整乐队"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 8,
        description: "Full arrangement",
        descriptionCn: "完整编曲",
        instruments: ["Vocals", "Full Band"],
        instrumentsCn: ["人声", "完整乐队"],
      },
      {
        name: "Bridge",
        nameCn: "桥段",
        bars: 8,
        description: "Emotional climax",
        descriptionCn: "情感高潮",
        instruments: ["Vocals", "Stripped Arrangement"],
        instrumentsCn: ["人声", "简化编曲"],
      },
      {
        name: "Outro",
        nameCn: "尾奏",
        bars: 4,
        description: "Guitar outro",
        descriptionCn: "吉他尾奏",
        instruments: ["Guitar", "Vocals"],
        instrumentsCn: ["吉他", "人声"],
      },
    ],
    arrangement: {
      summary:
        "Indie-rock meets R&B arrangement with driving acoustic guitar and punchy drums. The contrast between the upbeat music and dark lyrics creates compelling tension.",
      summaryCn:
        "独立摇滚与R&B编曲的结合，带有驱动性的原声吉他和有力的鼓。欢快音乐与黑暗歌词之间的对比创造了引人入胜的张力。",
      highlights: [
        "Acoustic guitar drives the entire track",
        "Punchy, live-sounding drums",
        "Subtle synth layers add modern touch",
        "Vocal stacks in chorus for impact",
      ],
      highlightsCn: [
        "原声吉他驱动整首歌",
        "有力、现场感的鼓",
        "微妙的合成器层增添现代感",
        "副歌中的人声堆叠增强冲击力",
      ],
    },
    composition: {
      chordProgression: "Em - C - G - D (i - VI - III - VII)",
      chordProgressionCn: "E小 - C大 - G大 - D大 (i - VI - III - VII)",
      melody:
        'Conversational melody with a memorable hook. The "I might kill my ex" line uses a descending pattern for emphasis.',
      melodyCn:
        '对话式旋律配以难忘的hook。"I might kill my ex"这句使用下行模式来强调。',
      harmony:
        "Simple diatonic progression in E minor. The major chords (C, G, D) create the upbeat feel despite the minor key.",
      harmonyCn:
        "E小调的简单自然音阶进行。大和弦（C、G、D）在小调中创造欢快感。",
    },
    mixing: {
      summary:
        "Bright, punchy mix with emphasis on the acoustic guitar and vocal clarity.",
      summaryCn: "明亮、有力的混音，强调原声吉他和人声清晰度。",
      techniques: [
        "Crisp high-end on acoustic guitar",
        "Punchy drum compression",
        "Vocal doubles panned wide",
        "Subtle saturation for warmth",
      ],
      techniquesCn: [
        "原声吉他上清脆的高频",
        "有力的鼓压缩",
        "人声叠录宽声像",
        "微妙的饱和度增添温暖",
      ],
    },
    soundDesign: {
      summary: "Organic instrumentation with subtle electronic enhancements.",
      summaryCn: "有机配器配以微妙的电子增强。",
      keyElements: [
        "Bright acoustic guitar tone",
        "Live drum kit with room sound",
        "Warm bass tone",
        "Subtle synth pads for atmosphere",
      ],
      keyElementsCn: [
        "明亮的原声吉他音色",
        "带房间声的现场鼓组",
        "温暖的贝斯音色",
        "微妙的合成器铺底营造氛围",
      ],
    },
    plugins: [
      {
        name: "Waves SSL E-Channel",
        type: "Channel Strip",
        typeCn: "通道条",
        usage: "Guitar and drum processing",
        usageCn: "吉他和鼓处理",
      },
      {
        name: "FabFilter Pro-C 2",
        type: "Compressor",
        typeCn: "压缩器",
        usage: "Punchy drum compression",
        usageCn: "有力的鼓压缩",
      },
      {
        name: "Soundtoys EchoBoy",
        type: "Delay",
        typeCn: "延迟",
        usage: "Vocal delay throws",
        usageCn: "人声延迟抛送",
      },
      {
        name: "iZotope Vinyl",
        type: "Lo-Fi",
        typeCn: "低保真",
        usage: "Subtle vintage character",
        usageCn: "微妙的复古特色",
      },
    ],
    takeaways: [
      "Genre-blending can create unique sonic identities",
      "Lyrical contrast with music creates emotional complexity",
      "Simple chord progressions can be highly effective",
      "Acoustic instruments can work in modern R&B",
    ],
    takeawaysCn: [
      "风格融合可以创造独特的声音身份",
      "歌词与音乐的对比创造情感复杂性",
      "简单的和弦进行可以非常有效",
      "原声乐器可以在现代R&B中发挥作用",
    ],
  },

  {
    id: "snooze",
    title: "Snooze",
    artist: "SZA",
    album: "SOS",
    year: 2022,
    genre: "rnb",
    bpm: 143,
    key: "D Major",
    keyCn: "D大调",
    overview:
      "An emotionally charged ballad that showcases SZA's vocal range and vulnerability. The production builds from intimate verses to a powerful, anthemic chorus.",
    overviewCn:
      "一首情感充沛的抒情歌，展示了SZA的音域和脆弱感。制作从亲密的主歌构建到强大、颂歌般的副歌。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 8,
        description: "Atmospheric synth intro",
        descriptionCn: "氛围合成器前奏",
        instruments: ["Synth Pad", "Vocal Sample"],
        instrumentsCn: ["合成器铺底", "人声采样"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 16,
        description: "Vulnerable, intimate delivery",
        descriptionCn: "脆弱、亲密的演绎",
        instruments: ["Vocals", "Piano", "Light Drums"],
        instrumentsCn: ["人声", "钢琴", "轻鼓"],
      },
      {
        name: "Pre-Chorus",
        nameCn: "预副歌",
        bars: 8,
        description: "Building intensity",
        descriptionCn: "强度构建",
        instruments: ["Vocals", "Synths", "Drums"],
        instrumentsCn: ["人声", "合成器", "鼓"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Powerful, soaring vocals",
        descriptionCn: "强大、高亢的人声",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
      {
        name: "Verse 2",
        nameCn: "主歌2",
        bars: 16,
        description: "More emotional delivery",
        descriptionCn: "更情感化的演绎",
        instruments: ["Vocals", "Piano", "Strings"],
        instrumentsCn: ["人声", "钢琴", "弦乐"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Full arrangement with ad-libs",
        descriptionCn: "带即兴的完整编曲",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
      {
        name: "Bridge",
        nameCn: "桥段",
        bars: 8,
        description: "Stripped back, raw emotion",
        descriptionCn: "简化、原始的情感",
        instruments: ["Vocals", "Piano"],
        instrumentsCn: ["人声", "钢琴"],
      },
      {
        name: "Final Chorus",
        nameCn: "最终副歌",
        bars: 16,
        description: "Climactic ending",
        descriptionCn: "高潮结尾",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
    ],
    arrangement: {
      summary:
        "Dynamic arrangement that mirrors the emotional journey of the lyrics. Builds from sparse verses to full, cinematic choruses.",
      summaryCn:
        "动态编曲反映歌词的情感旅程。从稀疏的主歌构建到完整、电影感的副歌。",
      highlights: [
        "Piano provides emotional foundation",
        "Synth layers create atmospheric depth",
        "Drums build progressively throughout",
        "String arrangements add cinematic quality",
      ],
      highlightsCn: [
        "钢琴提供情感基础",
        "合成器层创造氛围深度",
        "鼓逐渐构建",
        "弦乐编排增添电影质感",
      ],
    },
    composition: {
      chordProgression: "D - A - Bm - G (I - V - vi - IV)",
      chordProgressionCn: "D大 - A大 - B小 - G大 (I - V - vi - IV)",
      melody:
        "Wide-ranging melody that showcases SZA's vocal ability. The chorus melody soars with emotional intensity.",
      melodyCn: "宽广的旋律展示SZA的声乐能力。副歌旋律以情感强度高飞。",
      harmony:
        "Classic pop progression (I-V-vi-IV) executed with sophistication. The familiar progression allows focus on vocal performance.",
      harmonyCn:
        "经典流行进行（I-V-vi-IV）以精致方式执行。熟悉的进行让焦点集中在人声表演上。",
    },
    mixing: {
      summary:
        "Polished, radio-ready mix with careful attention to vocal dynamics and emotional impact.",
      summaryCn: "精致、适合电台的混音，仔细关注人声动态和情感冲击。",
      techniques: [
        "Careful vocal automation for dynamics",
        "Parallel compression on drums",
        "Wide stereo image in choruses",
        "Subtle sidechain for pumping effect",
      ],
      techniquesCn: [
        "仔细的人声自动化处理动态",
        "鼓上的并行压缩",
        "副歌中的宽立体声像",
        "微妙的侧链产生泵动效果",
      ],
    },
    soundDesign: {
      summary:
        "Modern R&B production with cinematic elements and atmospheric textures.",
      summaryCn: "现代R&B制作，带有电影元素和氛围质感。",
      keyElements: [
        "Lush synth pads",
        "Cinematic string arrangements",
        "Punchy 808-style bass",
        "Atmospheric vocal processing",
      ],
      keyElementsCn: [
        "丰富的合成器铺底",
        "电影感弦乐编排",
        "有力的808风格贝斯",
        "氛围人声处理",
      ],
    },
    plugins: [
      {
        name: "Spectrasonics Omnisphere",
        type: "Synth",
        typeCn: "合成器",
        usage: "Atmospheric pads and textures",
        usageCn: "氛围铺底和质感",
      },
      {
        name: "Native Instruments Kontakt",
        type: "Sampler",
        typeCn: "采样器",
        usage: "Orchestral strings",
        usageCn: "管弦乐弦乐",
      },
      {
        name: "Waves CLA Vocals",
        type: "Vocal Chain",
        typeCn: "人声链",
        usage: "Vocal processing chain",
        usageCn: "人声处理链",
      },
      {
        name: "Xfer Serum",
        type: "Synth",
        typeCn: "合成器",
        usage: "Modern synth sounds",
        usageCn: "现代合成器音色",
      },
    ],
    takeaways: [
      "Dynamic arrangement enhances emotional storytelling",
      "Classic progressions work when executed well",
      "Vocal performance is the star - production should support it",
      "Building intensity creates memorable moments",
    ],
    takeawaysCn: [
      "动态编曲增强情感叙事",
      "经典进行执行得好时效果很好",
      "人声表演是主角——制作应该支持它",
      "构建强度创造难忘时刻",
    ],
  },

  {
    id: "tarantallegra",
    title: "TARANTALLEGRA",
    artist: "XIA (Kim Junsu)",
    album: "Tarantallegra",
    year: 2012,
    genre: "kpop",
    bpm: 130,
    key: "D Minor",
    keyCn: "D小调",
    overview:
      "A groundbreaking K-pop track that blends electronic dance music with theatrical elements. Kim Junsu showcases his powerful vocals over an intense, cinematic production inspired by the Harry Potter spell.",
    overviewCn:
      "一首开创性的K-pop歌曲，将电子舞曲与戏剧元素融合。金俊秀在受哈利波特咒语启发的强烈、电影感制作上展示了他强大的声乐能力。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 8,
        description: "Dramatic orchestral build with electronic elements",
        descriptionCn: "戏剧性的管弦乐构建配以电子元素",
        instruments: ["Orchestra", "Synths", "Drums"],
        instrumentsCn: ["管弦乐", "合成器", "鼓"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 16,
        description: "Intense vocal delivery over driving beat",
        descriptionCn: "驱动节拍上的强烈人声演绎",
        instruments: ["Vocals", "Synths", "Bass", "Drums"],
        instrumentsCn: ["人声", "合成器", "贝斯", "鼓"],
      },
      {
        name: "Pre-Chorus",
        nameCn: "预副歌",
        bars: 8,
        description: "Building tension with layered synths",
        descriptionCn: "层叠合成器构建张力",
        instruments: ["Vocals", "Synths", "Orchestra"],
        instrumentsCn: ["人声", "合成器", "管弦乐"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Explosive hook with full production",
        descriptionCn: "爆发性hook配以完整制作",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
      {
        name: "Verse 2",
        nameCn: "主歌2",
        bars: 16,
        description: "More aggressive delivery",
        descriptionCn: "更具攻击性的演绎",
        instruments: ["Vocals", "Full Band"],
        instrumentsCn: ["人声", "完整乐队"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Full arrangement with ad-libs",
        descriptionCn: "带即兴的完整编曲",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
      {
        name: "Bridge",
        nameCn: "桥段",
        bars: 8,
        description: "Breakdown with theatrical elements",
        descriptionCn: "带戏剧元素的breakdown",
        instruments: ["Vocals", "Orchestra", "FX"],
        instrumentsCn: ["人声", "管弦乐", "效果音"],
      },
      {
        name: "Final Chorus",
        nameCn: "最终副歌",
        bars: 16,
        description: "Climactic ending with vocal runs",
        descriptionCn: "带转音的高潮结尾",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
    ],
    arrangement: {
      summary:
        "Epic, theatrical arrangement combining EDM production with orchestral elements. The track builds from intense verses to explosive choruses with cinematic grandeur.",
      summaryCn:
        "史诗般、戏剧性的编曲，将EDM制作与管弦乐元素结合。歌曲从强烈的主歌构建到具有电影般宏大感的爆发性副歌。",
      highlights: [
        "Orchestral strings add dramatic tension",
        "Heavy synth bass drives the energy",
        "Layered electronic textures throughout",
        "Dynamic contrast between sections",
      ],
      highlightsCn: [
        "管弦乐弦乐增添戏剧张力",
        "厚重的合成器贝斯驱动能量",
        "贯穿全曲的层叠电子质感",
        "段落之间的动态对比",
      ],
    },
    composition: {
      chordProgression: "Dm - Bb - C - Am (i - VI - VII - v)",
      chordProgressionCn: "D小 - 降B大 - C大 - A小 (i - VI - VII - v)",
      melody:
        "Powerful, wide-ranging melody that showcases Junsu's impressive vocal technique. The chorus hook is anthemic and memorable.",
      melodyCn:
        "强大、宽广的旋律展示了俊秀令人印象深刻的声乐技巧。副歌hook具有颂歌般的气质，令人难忘。",
      harmony:
        "Minor key progression with dramatic tension. The VI-VII movement creates an epic, cinematic feel typical of theatrical pop.",
      harmonyCn:
        "小调进行带有戏剧性张力。VI-VII的进行创造出戏剧流行典型的史诗、电影感。",
    },
    mixing: {
      summary:
        "Powerful, polished mix with emphasis on vocal presence and low-end impact. The production balances orchestral elements with modern EDM punch.",
      summaryCn:
        "强大、精致的混音，强调人声存在感和低频冲击力。制作平衡了管弦乐元素与现代EDM的冲击力。",
      techniques: [
        "Heavy sidechain compression for pumping effect",
        "Layered vocal processing for power",
        "Parallel compression on drums",
        "Wide stereo orchestral elements",
      ],
      techniquesCn: [
        "重度侧链压缩产生泵动效果",
        "层叠人声处理增强力量",
        "鼓上的并行压缩",
        "宽立体声管弦乐元素",
      ],
    },
    soundDesign: {
      summary:
        "Theatrical sound design combining orchestral samples with aggressive EDM synthesis.",
      summaryCn: "戏剧性的音色设计，将管弦乐采样与激进的EDM合成结合。",
      keyElements: [
        "Cinematic string arrangements",
        "Heavy distorted synth bass",
        "Dramatic brass hits",
        "Processed vocal effects and harmonies",
      ],
      keyElementsCn: [
        "电影感弦乐编排",
        "厚重失真合成器贝斯",
        "戏剧性铜管打击",
        "处理过的人声效果和和声",
      ],
    },
    plugins: [
      {
        name: "Spectrasonics Omnisphere",
        type: "Synth",
        typeCn: "合成器",
        usage: "Cinematic pads and textures",
        usageCn: "电影感铺底和质感",
      },
      {
        name: "Native Instruments Kontakt",
        type: "Sampler",
        typeCn: "采样器",
        usage: "Orchestral strings and brass",
        usageCn: "管弦乐弦乐和铜管",
      },
      {
        name: "Xfer Serum",
        type: "Synth",
        typeCn: "合成器",
        usage: "Heavy bass and lead sounds",
        usageCn: "厚重贝斯和主音音色",
      },
      {
        name: "FabFilter Saturn",
        type: "Saturation",
        typeCn: "饱和",
        usage: "Aggressive distortion on synths",
        usageCn: "合成器上的激进失真",
      },
    ],
    takeaways: [
      "Theatrical elements can elevate pop music to new heights",
      "Strong vocals need equally powerful production",
      "Orchestral and electronic elements can coexist beautifully",
      "Dynamic contrast creates memorable listening experiences",
    ],
    takeawaysCn: [
      "戏剧元素可以将流行音乐提升到新高度",
      "强大的人声需要同样强大的制作",
      "管弦乐和电子元素可以完美共存",
      "动态对比创造难忘的聆听体验",
    ],
  },

  {
    id: "incredible",
    title: "Incredible",
    artist: "XIA (Kim Junsu) ft. Quincy",
    album: "Incredible",
    year: 2013,
    genre: "kpop",
    bpm: 128,
    key: "A Minor",
    keyCn: "A小调",
    overview:
      "A high-energy dance track that showcases Kim Junsu's versatility as a performer. The collaboration with Quincy Jones III brings an international flavor to this electro-pop anthem.",
    overviewCn:
      "一首高能量舞曲，展示了金俊秀作为表演者的多才多艺。与Quincy Jones III的合作为这首电子流行颂歌带来了国际风味。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 8,
        description: "Electronic build with vocal chops",
        descriptionCn: "带人声切片的电子构建",
        instruments: ["Synths", "Vocal Chops", "Drums"],
        instrumentsCn: ["合成器", "人声切片", "鼓"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 16,
        description: "Rhythmic vocal delivery",
        descriptionCn: "节奏性人声演绎",
        instruments: ["Vocals", "Synths", "Bass", "Drums"],
        instrumentsCn: ["人声", "合成器", "贝斯", "鼓"],
      },
      {
        name: "Pre-Chorus",
        nameCn: "预副歌",
        bars: 8,
        description: "Building energy with synth risers",
        descriptionCn: "合成器上升音构建能量",
        instruments: ["Vocals", "Synths", "FX"],
        instrumentsCn: ["人声", "合成器", "效果音"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Explosive drop with hook",
        descriptionCn: "带hook的爆发性drop",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
      {
        name: "Verse 2 (Quincy)",
        nameCn: "主歌2 (Quincy)",
        bars: 16,
        description: "English rap verse",
        descriptionCn: "英文说唱段落",
        instruments: ["Vocals", "Synths", "Bass", "Drums"],
        instrumentsCn: ["人声", "合成器", "贝斯", "鼓"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Full arrangement",
        descriptionCn: "完整编曲",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
      {
        name: "Bridge",
        nameCn: "桥段",
        bars: 8,
        description: "Breakdown with vocal showcase",
        descriptionCn: "带人声展示的breakdown",
        instruments: ["Vocals", "Minimal Beat"],
        instrumentsCn: ["人声", "极简节拍"],
      },
      {
        name: "Final Chorus",
        nameCn: "最终副歌",
        bars: 16,
        description: "Climactic ending",
        descriptionCn: "高潮结尾",
        instruments: ["Vocals", "Full Production"],
        instrumentsCn: ["人声", "完整制作"],
      },
    ],
    arrangement: {
      summary:
        "EDM-influenced arrangement with big room house elements. The production features massive synth drops and driving four-on-the-floor beats.",
      summaryCn:
        "EDM影响的编曲，带有大房子元素。制作特色是巨大的合成器drop和驱动性的四拍节奏。",
      highlights: [
        "Big room synth drops in chorus",
        "Four-on-the-floor kick pattern",
        "Layered synth stabs and leads",
        "Vocal chops as rhythmic elements",
      ],
      highlightsCn: [
        "副歌中的大房子合成器drop",
        "四拍底鼓型",
        "层叠的合成器stab和主音",
        "人声切片作为节奏元素",
      ],
    },
    composition: {
      chordProgression: "Am - F - C - G (i - VI - III - VII)",
      chordProgressionCn: "A小 - F大 - C大 - G大 (i - VI - III - VII)",
      melody:
        "Catchy, repetitive hook designed for maximum impact. The melody sits perfectly in Junsu's powerful mid-range.",
      melodyCn:
        "洗脑、重复的hook设计为最大冲击力。旋律完美地位于俊秀强大的中音区。",
      harmony:
        "Classic EDM progression in A minor. The VI-III-VII movement creates uplifting energy despite the minor key.",
      harmonyCn: "A小调的经典EDM进行。VI-III-VII的进行在小调中创造振奋的能量。",
    },
    mixing: {
      summary:
        "Loud, punchy club-ready mix with emphasis on low-end power and synth presence.",
      summaryCn: "响亮、有力的俱乐部级混音，强调低频力量和合成器存在感。",
      techniques: [
        "Heavy limiting for loudness",
        "Sidechain compression on synths",
        "Layered kick drums for impact",
        "Wide stereo synth leads",
      ],
      techniquesCn: [
        "重度限制器增加响度",
        "合成器上的侧链压缩",
        "层叠底鼓增强冲击力",
        "宽立体声合成器主音",
      ],
    },
    soundDesign: {
      summary:
        "Big room house sound design with massive synths and processed vocals.",
      summaryCn: "大房子音色设计，带有巨大的合成器和处理过的人声。",
      keyElements: [
        "Massive supersaw synth leads",
        "Punchy layered kicks",
        "Processed vocal chops",
        "White noise risers and impacts",
      ],
      keyElementsCn: [
        "巨大的超级锯齿波合成器主音",
        "有力的层叠底鼓",
        "处理过的人声切片",
        "白噪声上升音和冲击音",
      ],
    },
    plugins: [
      {
        name: "Sylenth1",
        type: "Synth",
        typeCn: "合成器",
        usage: "Big room leads and pads",
        usageCn: "大房子主音和铺底",
      },
      {
        name: "Xfer Serum",
        type: "Synth",
        typeCn: "合成器",
        usage: "Bass and FX sounds",
        usageCn: "贝斯和效果音色",
      },
      {
        name: "FabFilter Pro-L 2",
        type: "Limiter",
        typeCn: "限制器",
        usage: "Loudness maximization",
        usageCn: "响度最大化",
      },
      {
        name: "Nicky Romero Kickstart",
        type: "Sidechain",
        typeCn: "侧链",
        usage: "Pumping sidechain effect",
        usageCn: "泵动侧链效果",
      },
    ],
    takeaways: [
      "EDM production techniques can enhance K-pop vocals",
      "International collaborations bring fresh perspectives",
      "Big room drops create memorable live performance moments",
      "Vocal processing can add rhythmic interest",
    ],
    takeawaysCn: [
      "EDM制作技术可以增强K-pop人声",
      "国际合作带来新鲜视角",
      "大房子drop创造难忘的现场表演时刻",
      "人声处理可以增加节奏趣味",
    ],
  },

  {
    id: "flower",
    title: "Flower (꽃)",
    artist: "XIA (Kim Junsu)",
    album: "Flower",
    year: 2015,
    genre: "kpop",
    bpm: 76,
    key: "Eb Major",
    keyCn: "降E大调",
    overview:
      "A stunning ballad that showcases Kim Junsu's exceptional vocal control and emotional depth. The orchestral arrangement creates a cinematic, theatrical atmosphere befitting his musical theater background.",
    overviewCn:
      "一首令人惊叹的抒情歌，展示了金俊秀卓越的声乐控制力和情感深度。管弦乐编排创造出电影般、戏剧性的氛围，与他的音乐剧背景相得益彰。",
    structure: [
      {
        name: "Intro",
        nameCn: "前奏",
        bars: 8,
        description: "Delicate piano intro",
        descriptionCn: "细腻的钢琴前奏",
        instruments: ["Piano"],
        instrumentsCn: ["钢琴"],
      },
      {
        name: "Verse 1",
        nameCn: "主歌1",
        bars: 16,
        description: "Intimate vocal delivery with piano",
        descriptionCn: "钢琴伴奏下的亲密人声演绎",
        instruments: ["Vocals", "Piano", "Strings"],
        instrumentsCn: ["人声", "钢琴", "弦乐"],
      },
      {
        name: "Verse 2",
        nameCn: "主歌2",
        bars: 16,
        description: "Building with added strings",
        descriptionCn: "加入弦乐的构建",
        instruments: ["Vocals", "Piano", "Strings", "Light Percussion"],
        instrumentsCn: ["人声", "钢琴", "弦乐", "轻打击乐"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Soaring vocals with full orchestra",
        descriptionCn: "完整管弦乐配以高亢人声",
        instruments: ["Vocals", "Full Orchestra"],
        instrumentsCn: ["人声", "完整管弦乐"],
      },
      {
        name: "Verse 3",
        nameCn: "主歌3",
        bars: 16,
        description: "Emotional build",
        descriptionCn: "情感构建",
        instruments: ["Vocals", "Piano", "Strings"],
        instrumentsCn: ["人声", "钢琴", "弦乐"],
      },
      {
        name: "Chorus",
        nameCn: "副歌",
        bars: 16,
        description: "Full arrangement",
        descriptionCn: "完整编曲",
        instruments: ["Vocals", "Full Orchestra"],
        instrumentsCn: ["人声", "完整管弦乐"],
      },
      {
        name: "Bridge",
        nameCn: "桥段",
        bars: 8,
        description: "Climactic vocal showcase",
        descriptionCn: "高潮人声展示",
        instruments: ["Vocals", "Orchestra"],
        instrumentsCn: ["人声", "管弦乐"],
      },
      {
        name: "Final Chorus",
        nameCn: "最终副歌",
        bars: 16,
        description: "Powerful emotional climax",
        descriptionCn: "强大的情感高潮",
        instruments: ["Vocals", "Full Orchestra"],
        instrumentsCn: ["人声", "完整管弦乐"],
      },
      {
        name: "Outro",
        nameCn: "尾奏",
        bars: 8,
        description: "Gentle piano fade",
        descriptionCn: "柔和的钢琴渐弱",
        instruments: ["Piano", "Vocals"],
        instrumentsCn: ["钢琴", "人声"],
      },
    ],
    arrangement: {
      summary:
        "Lush orchestral ballad arrangement that builds from intimate piano to full symphonic grandeur. The arrangement perfectly supports Junsu's theatrical vocal style.",
      summaryCn:
        "丰富的管弦乐抒情编曲，从亲密的钢琴构建到完整的交响乐宏大感。编曲完美支持俊秀的戏剧性声乐风格。",
      highlights: [
        "Piano provides emotional foundation",
        "Strings build gradually throughout",
        "Full orchestra in climactic moments",
        "Dynamic contrast enhances emotion",
      ],
      highlightsCn: [
        "钢琴提供情感基础",
        "弦乐逐渐构建",
        "高潮时刻的完整管弦乐",
        "动态对比增强情感",
      ],
    },
    composition: {
      chordProgression: "Eb - Cm - Ab - Bb (I - vi - IV - V)",
      chordProgressionCn: "降E大 - C小 - 降A大 - 降B大 (I - vi - IV - V)",
      melody:
        "Wide-ranging, operatic melody that showcases Junsu's three-octave vocal range. The melody builds to powerful high notes in the chorus.",
      melodyCn:
        "宽广、歌剧般的旋律展示俊秀三个八度的音域。旋律在副歌中构建到强大的高音。",
      harmony:
        "Classic ballad progression with rich voice leading. The vi chord adds emotional depth to the otherwise bright major key.",
      harmonyCn:
        "经典抒情进行配以丰富的声部进行。vi和弦为原本明亮的大调增添情感深度。",
    },
    mixing: {
      summary:
        "Spacious, cinematic mix that balances intimate vocals with orchestral grandeur.",
      summaryCn: "空旷、电影感的混音，平衡亲密的人声与管弦乐的宏大感。",
      techniques: [
        "Natural room reverb on orchestra",
        "Careful vocal automation for dynamics",
        "Wide stereo image for strings",
        "Subtle compression to preserve dynamics",
      ],
      techniquesCn: [
        "管弦乐上的自然房间混响",
        "仔细的人声自动化处理动态",
        "弦乐的宽立体声像",
        "微妙的压缩保持动态",
      ],
    },
    soundDesign: {
      summary: "Purely acoustic sound palette with concert hall ambience.",
      summaryCn: "纯原声音色调色板，带有音乐厅氛围。",
      keyElements: [
        "Grand piano with natural resonance",
        "Lush string section",
        "Warm brass accents",
        "Natural vocal tone with minimal processing",
      ],
      keyElementsCn: [
        "带自然共鸣的三角钢琴",
        "丰富的弦乐组",
        "温暖的铜管点缀",
        "最小处理的自然人声音色",
      ],
    },
    plugins: [
      {
        name: "Spitfire Audio Chamber Strings",
        type: "Strings",
        typeCn: "弦乐",
        usage: "Lush orchestral strings",
        usageCn: "丰富的管弦乐弦乐",
      },
      {
        name: "Native Instruments The Grandeur",
        type: "Piano",
        typeCn: "钢琴",
        usage: "Concert grand piano",
        usageCn: "音乐会三角钢琴",
      },
      {
        name: "Valhalla Room",
        type: "Reverb",
        typeCn: "混响",
        usage: "Concert hall ambience",
        usageCn: "音乐厅氛围",
      },
      {
        name: "FabFilter Pro-Q 3",
        type: "EQ",
        typeCn: "均衡器",
        usage: "Surgical vocal EQ",
        usageCn: "精确人声均衡",
      },
    ],
    takeaways: [
      "Orchestral arrangements can elevate pop ballads",
      "Dynamic range is crucial for emotional impact",
      "Musical theater training enhances pop vocal delivery",
      "Less processing can mean more emotional connection",
    ],
    takeawaysCn: [
      "管弦乐编排可以提升流行抒情歌",
      "动态范围对情感冲击至关重要",
      "音乐剧训练增强流行人声演绎",
      "更少的处理可能意味着更多的情感连接",
    ],
  },
];

// Helper functions
export function getSongsByGenre(genre: Genre): SongAnalysis[] {
  return SONG_ANALYSES.filter((song) => song.genre === genre);
}

export function getSongsByArtist(artist: string): SongAnalysis[] {
  return SONG_ANALYSES.filter((song) =>
    song.artist.toLowerCase().includes(artist.toLowerCase())
  );
}

export function getSongById(id: string): SongAnalysis | undefined {
  return SONG_ANALYSES.find((song) => song.id === id);
}

export function getAllArtists(): string[] {
  const artists = new Set(SONG_ANALYSES.map((song) => song.artist));
  return Array.from(artists);
}

export function getAllGenres(): Genre[] {
  const genres = new Set(SONG_ANALYSES.map((song) => song.genre));
  return Array.from(genres);
}
