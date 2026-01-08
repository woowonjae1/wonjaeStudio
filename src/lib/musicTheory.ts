/**
 * Music Theory Utilities
 * 音乐理论工具库 - 提供音符、音程、和弦、音阶的计算功能
 */

// 音符名称常量
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;
const NOTE_NAMES_FLAT = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

// A4 = 440Hz 标准音高
const A4_FREQUENCY = 440;
const A4_MIDI = 69;

// 音程类型
export type IntervalName =
  | "unison"
  | "minor2nd"
  | "major2nd"
  | "minor3rd"
  | "major3rd"
  | "perfect4th"
  | "tritone"
  | "perfect5th"
  | "minor6th"
  | "major6th"
  | "minor7th"
  | "major7th"
  | "octave";

// 和弦类型
export type ChordType =
  | "major"
  | "minor"
  | "diminished"
  | "augmented"
  | "major7"
  | "minor7"
  | "dominant7"
  | "diminished7"
  | "half-diminished7"
  | "sus2"
  | "sus4"
  | "add9"
  | "maj9"
  | "min9";

// 音阶类型
export type ScaleType =
  | "major"
  | "natural-minor"
  | "harmonic-minor"
  | "melodic-minor"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "locrian"
  | "pentatonic-major"
  | "pentatonic-minor"
  | "blues";

// 音程接口
export interface Interval {
  name: IntervalName;
  semitones: number;
  nameCn: string;
  nameEn: string;
}

// 和弦接口
export interface Chord {
  root: string;
  type: ChordType;
  notes: string[];
  symbol: string;
  romanNumeral?: string;
}

// 音程定义
export const INTERVALS: Record<IntervalName, Interval> = {
  unison: { name: "unison", semitones: 0, nameCn: "同度", nameEn: "Unison" },
  minor2nd: {
    name: "minor2nd",
    semitones: 1,
    nameCn: "小二度",
    nameEn: "Minor 2nd",
  },
  major2nd: {
    name: "major2nd",
    semitones: 2,
    nameCn: "大二度",
    nameEn: "Major 2nd",
  },
  minor3rd: {
    name: "minor3rd",
    semitones: 3,
    nameCn: "小三度",
    nameEn: "Minor 3rd",
  },
  major3rd: {
    name: "major3rd",
    semitones: 4,
    nameCn: "大三度",
    nameEn: "Major 3rd",
  },
  perfect4th: {
    name: "perfect4th",
    semitones: 5,
    nameCn: "纯四度",
    nameEn: "Perfect 4th",
  },
  tritone: {
    name: "tritone",
    semitones: 6,
    nameCn: "三全音",
    nameEn: "Tritone",
  },
  perfect5th: {
    name: "perfect5th",
    semitones: 7,
    nameCn: "纯五度",
    nameEn: "Perfect 5th",
  },
  minor6th: {
    name: "minor6th",
    semitones: 8,
    nameCn: "小六度",
    nameEn: "Minor 6th",
  },
  major6th: {
    name: "major6th",
    semitones: 9,
    nameCn: "大六度",
    nameEn: "Major 6th",
  },
  minor7th: {
    name: "minor7th",
    semitones: 10,
    nameCn: "小七度",
    nameEn: "Minor 7th",
  },
  major7th: {
    name: "major7th",
    semitones: 11,
    nameCn: "大七度",
    nameEn: "Major 7th",
  },
  octave: { name: "octave", semitones: 12, nameCn: "八度", nameEn: "Octave" },
};

// 和弦音程定义（相对于根音的半音数）
const CHORD_INTERVALS: Record<ChordType, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
  diminished7: [0, 3, 6, 9],
  "half-diminished7": [0, 3, 6, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14],
  maj9: [0, 4, 7, 11, 14],
  min9: [0, 3, 7, 10, 14],
};

// 音阶音程定义（相对于根音的半音数）
const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  "natural-minor": [0, 2, 3, 5, 7, 8, 10],
  "harmonic-minor": [0, 2, 3, 5, 7, 8, 11],
  "melodic-minor": [0, 2, 3, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  "pentatonic-major": [0, 2, 4, 7, 9],
  "pentatonic-minor": [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
};

/**
 * 解析音符名称，返回音符名和八度
 * @param note 音符名称，如 'C4', 'F#5', 'Bb3'
 * @returns { noteName: string, octave: number }
 */
export function parseNote(note: string): { noteName: string; octave: number } {
  const match = note.match(/^([A-Ga-g][#b]?)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid note format: ${note}`);
  }
  return {
    noteName: match[1].toUpperCase(),
    octave: parseInt(match[2], 10),
  };
}

/**
 * 获取音符的 MIDI 编号
 * @param note 音符名称，如 'C4', 'A4'
 * @returns MIDI 编号
 */
export function noteToMidi(note: string): number {
  const { noteName, octave } = parseNote(note);

  // 处理升降号
  let noteIndex = NOTE_NAMES.indexOf(noteName as (typeof NOTE_NAMES)[number]);
  if (noteIndex === -1) {
    noteIndex = NOTE_NAMES_FLAT.indexOf(
      noteName as (typeof NOTE_NAMES_FLAT)[number]
    );
  }
  if (noteIndex === -1) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  // MIDI: C4 = 60
  return (octave + 1) * 12 + noteIndex;
}

/**
 * 将 MIDI 编号转换为音符名称
 * @param midi MIDI 编号
 * @param useFlats 是否使用降号表示
 * @returns 音符名称
 */
export function midiToNote(midi: number, useFlats: boolean = false): string {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  const noteName = useFlats
    ? NOTE_NAMES_FLAT[noteIndex]
    : NOTE_NAMES[noteIndex];
  return `${noteName}${octave}`;
}

/**
 * 将音符转换为频率（Hz）
 * 使用等律音阶，A4 = 440Hz
 * @param note 音符名称，如 'A4', 'C4'
 * @returns 频率（Hz）
 */
export function noteToFrequency(note: string): number {
  const midi = noteToMidi(note);
  // f = 440 * 2^((midi - 69) / 12)
  return A4_FREQUENCY * Math.pow(2, (midi - A4_MIDI) / 12);
}

/**
 * 将频率转换为最接近的音符
 * @param frequency 频率（Hz）
 * @returns 音符名称
 */
export function frequencyToNote(frequency: number): string {
  // midi = 69 + 12 * log2(f / 440)
  const midi = Math.round(A4_MIDI + 12 * Math.log2(frequency / A4_FREQUENCY));
  return midiToNote(midi);
}

/**
 * 转调音符
 * @param note 原音符
 * @param semitones 半音数（正数升调，负数降调）
 * @returns 转调后的音符
 */
export function transposeNote(note: string, semitones: number): string {
  const midi = noteToMidi(note);
  return midiToNote(midi + semitones);
}

/**
 * 计算两个音符之间的音程
 * @param note1 第一个音符
 * @param note2 第二个音符
 * @returns 音程信息
 */
export function getInterval(note1: string, note2: string): Interval {
  const midi1 = noteToMidi(note1);
  const midi2 = noteToMidi(note2);
  let semitones = Math.abs(midi2 - midi1) % 12;

  // 查找对应的音程
  const intervalEntry = Object.entries(INTERVALS).find(
    ([, interval]) => interval.semitones === semitones
  );

  if (!intervalEntry) {
    throw new Error(`Unknown interval: ${semitones} semitones`);
  }

  return intervalEntry[1];
}

/**
 * 获取和弦的所有音符
 * @param root 根音，如 'C4'
 * @param type 和弦类型
 * @returns 和弦音符数组
 */
export function getChordNotes(root: string, type: ChordType): string[] {
  const intervals = CHORD_INTERVALS[type];
  if (!intervals) {
    throw new Error(`Unknown chord type: ${type}`);
  }

  return intervals.map((semitones) => transposeNote(root, semitones));
}

/**
 * 创建和弦对象
 * @param root 根音
 * @param type 和弦类型
 * @param romanNumeral 罗马数字标记（可选）
 * @returns 和弦对象
 */
export function createChord(
  root: string,
  type: ChordType,
  romanNumeral?: string
): Chord {
  const { noteName } = parseNote(root);
  const notes = getChordNotes(root, type);

  // 生成和弦符号
  const typeSymbols: Record<ChordType, string> = {
    major: "",
    minor: "m",
    diminished: "dim",
    augmented: "aug",
    major7: "maj7",
    minor7: "m7",
    dominant7: "7",
    diminished7: "dim7",
    "half-diminished7": "m7b5",
    sus2: "sus2",
    sus4: "sus4",
    add9: "add9",
    maj9: "maj9",
    min9: "m9",
  };

  return {
    root,
    type,
    notes,
    symbol: `${noteName}${typeSymbols[type]}`,
    romanNumeral,
  };
}

/**
 * 获取音阶的所有音符
 * @param root 根音，如 'C4'
 * @param scaleType 音阶类型
 * @returns 音阶音符数组
 */
export function getScaleNotes(root: string, scaleType: ScaleType): string[] {
  const intervals = SCALE_INTERVALS[scaleType];
  if (!intervals) {
    throw new Error(`Unknown scale type: ${scaleType}`);
  }

  return intervals.map((semitones) => transposeNote(root, semitones));
}

/**
 * 获取大调音阶的顺阶和弦
 * @param root 根音
 * @returns 顺阶和弦数组
 */
export function getDiatonicChords(root: string): Chord[] {
  const scaleNotes = getScaleNotes(root, "major");
  const chordTypes: ChordType[] = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "diminished",
  ];
  const romanNumerals = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];

  return scaleNotes.map((note, index) =>
    createChord(note, chordTypes[index], romanNumerals[index])
  );
}

/**
 * 获取所有音程名称列表
 */
export function getAllIntervalNames(): IntervalName[] {
  return Object.keys(INTERVALS) as IntervalName[];
}

/**
 * 获取所有和弦类型列表
 */
export function getAllChordTypes(): ChordType[] {
  return Object.keys(CHORD_INTERVALS) as ChordType[];
}

/**
 * 获取所有音阶类型列表
 */
export function getAllScaleTypes(): ScaleType[] {
  return Object.keys(SCALE_INTERVALS) as ScaleType[];
}

/**
 * 验证音符格式是否有效
 * @param note 音符字符串
 * @returns 是否有效
 */
export function isValidNote(note: string): boolean {
  try {
    parseNote(note);
    return true;
  } catch {
    return false;
  }
}
