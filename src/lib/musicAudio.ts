/**
 * Music Audio Utilities
 * 音频工具库 - 使用 Web Audio API 生成和播放音乐
 */

import { noteToFrequency } from "./musicTheory";

// ADSR 包络配置
export interface ADSRConfig {
  attack: number; // 起音时间 (seconds)
  decay: number; // 衰减时间 (seconds)
  sustain: number; // 持续音量 (0-1)
  release: number; // 释放时间 (seconds)
}

// 音频配置
export interface AudioConfig {
  adsr: ADSRConfig;
  waveform: OscillatorType;
  masterVolume: number;
}

// 和弦进行接口
export interface ChordProgressionAudio {
  chords: string[][]; // 每个和弦的音符数组
  beatsPerChord: number;
}

// 默认 ADSR 配置（钢琴音色）
const DEFAULT_ADSR: ADSRConfig = {
  attack: 0.02,
  decay: 0.1,
  sustain: 0.7,
  release: 0.3,
};

// 默认音频配置
const DEFAULT_CONFIG: AudioConfig = {
  adsr: DEFAULT_ADSR,
  waveform: "triangle",
  masterVolume: 0.3,
};

// 全局 AudioContext 实例
let audioContext: AudioContext | null = null;

/**
 * 获取或创建 AudioContext
 */
export function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

/**
 * 确保 AudioContext 处于运行状态
 * 浏览器要求用户交互后才能播放音频
 */
export async function ensureAudioContextRunning(): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

/**
 * 创建带有 ADSR 包络的增益节点
 */
function createEnvelopeGain(
  ctx: AudioContext,
  startTime: number,
  duration: number,
  adsr: ADSRConfig,
  volume: number
): GainNode {
  const gainNode = ctx.createGain();
  const { attack, decay, sustain, release } = adsr;

  // 起始音量为 0
  gainNode.gain.setValueAtTime(0, startTime);

  // Attack: 从 0 升到最大音量
  gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);

  // Decay: 从最大音量降到持续音量
  gainNode.gain.linearRampToValueAtTime(
    volume * sustain,
    startTime + attack + decay
  );

  // Sustain: 保持持续音量直到释放
  const sustainEnd = startTime + duration - release;
  if (sustainEnd > startTime + attack + decay) {
    gainNode.gain.setValueAtTime(volume * sustain, sustainEnd);
  }

  // Release: 从持续音量降到 0
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  return gainNode;
}

/**
 * 播放单个音符
 * @param note 音符名称，如 'C4', 'A4'
 * @param duration 持续时间（秒），默认 0.5
 * @param config 音频配置
 */
export async function playNote(
  note: string,
  duration: number = 0.5,
  config: Partial<AudioConfig> = {}
): Promise<void> {
  await ensureAudioContextRunning();
  const ctx = getAudioContext();
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  const frequency = noteToFrequency(note);
  const startTime = ctx.currentTime;

  // 创建振荡器
  const oscillator = ctx.createOscillator();
  oscillator.type = fullConfig.waveform;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  // 创建包络增益
  const gainNode = createEnvelopeGain(
    ctx,
    startTime,
    duration,
    fullConfig.adsr,
    fullConfig.masterVolume
  );

  // 连接节点
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // 开始和停止
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.1);
}

/**
 * 播放和弦（多个音符同时发声）
 * @param notes 音符数组，如 ['C4', 'E4', 'G4']
 * @param duration 持续时间（秒），默认 1
 * @param config 音频配置
 */
export async function playChord(
  notes: string[],
  duration: number = 1,
  config: Partial<AudioConfig> = {}
): Promise<void> {
  await ensureAudioContextRunning();
  const ctx = getAudioContext();
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  const startTime = ctx.currentTime;
  // 降低每个音符的音量以避免削波
  const noteVolume = fullConfig.masterVolume / Math.sqrt(notes.length);

  notes.forEach((note) => {
    const frequency = noteToFrequency(note);

    const oscillator = ctx.createOscillator();
    oscillator.type = fullConfig.waveform;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    const gainNode = createEnvelopeGain(
      ctx,
      startTime,
      duration,
      fullConfig.adsr,
      noteVolume
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.1);
  });
}

/**
 * 计算和弦进行的调度时间
 * @param tempo BPM
 * @param beatsPerChord 每个和弦的拍数
 * @param chordIndex 和弦索引
 * @returns 相对于开始时间的偏移（秒）
 */
export function calculateChordStartTime(
  tempo: number,
  beatsPerChord: number,
  chordIndex: number
): number {
  const secondsPerBeat = 60 / tempo;
  return chordIndex * beatsPerChord * secondsPerBeat;
}

/**
 * 计算和弦持续时间
 * @param tempo BPM
 * @param beatsPerChord 每个和弦的拍数
 * @returns 持续时间（秒）
 */
export function calculateChordDuration(
  tempo: number,
  beatsPerChord: number
): number {
  const secondsPerBeat = 60 / tempo;
  return beatsPerChord * secondsPerBeat;
}

/**
 * 播放和弦进行
 * @param progression 和弦进行数据
 * @param tempo BPM，默认 120
 * @param config 音频配置
 * @returns 返回停止函数
 */
export async function playProgression(
  progression: ChordProgressionAudio,
  tempo: number = 120,
  config: Partial<AudioConfig> = {}
): Promise<{ stop: () => void; duration: number }> {
  await ensureAudioContextRunning();
  const ctx = getAudioContext();
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  const startTime = ctx.currentTime;
  const oscillators: OscillatorNode[] = [];

  const chordDuration = calculateChordDuration(
    tempo,
    progression.beatsPerChord
  );
  const noteVolume =
    fullConfig.masterVolume /
    Math.sqrt(Math.max(...progression.chords.map((c) => c.length)));

  progression.chords.forEach((chordNotes, chordIndex) => {
    const chordStartTime =
      startTime +
      calculateChordStartTime(tempo, progression.beatsPerChord, chordIndex);

    chordNotes.forEach((note) => {
      const frequency = noteToFrequency(note);

      const oscillator = ctx.createOscillator();
      oscillator.type = fullConfig.waveform;
      oscillator.frequency.setValueAtTime(frequency, chordStartTime);

      const gainNode = createEnvelopeGain(
        ctx,
        chordStartTime,
        chordDuration,
        fullConfig.adsr,
        noteVolume
      );

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(chordStartTime);
      oscillator.stop(chordStartTime + chordDuration + 0.1);

      oscillators.push(oscillator);
    });
  });

  const totalDuration = progression.chords.length * chordDuration;

  return {
    stop: () => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // 忽略已停止的振荡器
        }
      });
    },
    duration: totalDuration,
  };
}

/**
 * 播放音阶
 * @param notes 音阶音符数组
 * @param tempo BPM，默认 120
 * @param config 音频配置
 */
export async function playScale(
  notes: string[],
  tempo: number = 120,
  config: Partial<AudioConfig> = {}
): Promise<{ stop: () => void; duration: number }> {
  await ensureAudioContextRunning();
  const ctx = getAudioContext();
  const fullConfig = { ...DEFAULT_CONFIG, ...config };

  const startTime = ctx.currentTime;
  const oscillators: OscillatorNode[] = [];
  const noteDuration = 60 / tempo; // 每个音符一拍

  notes.forEach((note, index) => {
    const noteStartTime = startTime + index * noteDuration;
    const frequency = noteToFrequency(note);

    const oscillator = ctx.createOscillator();
    oscillator.type = fullConfig.waveform;
    oscillator.frequency.setValueAtTime(frequency, noteStartTime);

    const gainNode = createEnvelopeGain(
      ctx,
      noteStartTime,
      noteDuration,
      fullConfig.adsr,
      fullConfig.masterVolume
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(noteStartTime);
    oscillator.stop(noteStartTime + noteDuration + 0.1);

    oscillators.push(oscillator);
  });

  const totalDuration = notes.length * noteDuration;

  return {
    stop: () => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {
          // 忽略已停止的振荡器
        }
      });
    },
    duration: totalDuration,
  };
}

/**
 * 停止所有音频播放
 */
export function stopAllAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

/**
 * 预设音色配置
 */
export const PRESETS: Record<string, Partial<AudioConfig>> = {
  piano: {
    waveform: "triangle",
    adsr: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.3 },
  },
  organ: {
    waveform: "sine",
    adsr: { attack: 0.05, decay: 0.1, sustain: 0.9, release: 0.1 },
  },
  synth: {
    waveform: "sawtooth",
    adsr: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.2 },
  },
  pad: {
    waveform: "sine",
    adsr: { attack: 0.3, decay: 0.2, sustain: 0.8, release: 0.5 },
  },
};
