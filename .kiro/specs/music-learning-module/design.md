# Design Document: Music Learning Module

## Overview

音乐学习模块是一个基于 Next.js 的交互式音乐教育系统，采用与现有英语学习模块相似的架构模式。该模块通过 Web Audio API 提供音频生成功能，使用可视化钢琴键盘组件展示音乐概念，并通过 localStorage 追踪学习进度。

### 设计目标

1. **模块化架构**: 每个学习模块（乐理、和弦、制作、听感）独立实现，共享通用组件
2. **交互式学习**: 通过可视化和音频反馈增强学习体验
3. **渐进式难度**: 知识点按难度分级，支持循序渐进的学习路径
4. **双语支持**: 复用现有 i18n 系统，提供中英双语内容

## Architecture

```
src/
├── app/
│   └── music/
│       ├── page.tsx                 # Music Learning Hub
│       ├── theory/
│       │   └── page.tsx             # Theory Module
│       ├── chords/
│       │   └── page.tsx             # Chords Module
│       ├── production/
│       │   └── page.tsx             # Production Module
│       └── ear-training/
│           └── page.tsx             # Ear Training Module
├── components/
│   └── music/
│       ├── PianoKeyboard.tsx        # Interactive piano component
│       ├── AudioPlayer.tsx          # Audio playback controls
│       ├── ChordProgressionCard.tsx # Chord progression display
│       ├── KnowledgePointCard.tsx   # Knowledge point display
│       └── EarTrainingQuiz.tsx      # Ear training quiz component
└── lib/
    ├── musicAudio.ts                # Web Audio API utilities
    ├── musicTheory.ts               # Music theory calculations
    ├── musicData.ts                 # Static music content data
    └── musicProgress.ts             # Progress tracking utilities
```

## Components and Interfaces

### PianoKeyboard Component

```typescript
interface PianoKeyboardProps {
  startOctave?: number;        // 起始八度 (default: 3)
  octaves?: number;            // 显示八度数 (default: 2)
  highlightedNotes?: string[]; // 高亮的音符 (e.g., ['C4', 'E4', 'G4'])
  highlightColor?: string;     // 高亮颜色
  onKeyClick?: (note: string) => void; // 按键点击回调
  interactive?: boolean;       // 是否可交互
}
```

### AudioPlayer Component

```typescript
interface AudioPlayerProps {
  notes?: string[];            // 要播放的音符
  chordProgression?: ChordProgression; // 和弦进行
  tempo?: number;              // BPM (default: 120)
  autoPlay?: boolean;          // 自动播放
  showControls?: boolean;      // 显示控制按钮
}

interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
}
```

### Music Audio Utilities

```typescript
// musicAudio.ts
interface AudioConfig {
  attack: number;   // 起音时间 (seconds)
  decay: number;    // 衰减时间
  sustain: number;  // 持续音量 (0-1)
  release: number;  // 释放时间
  waveform: OscillatorType; // 波形类型
}

function playNote(note: string, duration?: number): void;
function playChord(notes: string[], duration?: number): void;
function playProgression(progression: ChordProgression, tempo: number): void;
function noteToFrequency(note: string): number;
```

### Music Theory Utilities

```typescript
// musicTheory.ts
type IntervalName = 'unison' | 'minor2nd' | 'major2nd' | 'minor3rd' | 'major3rd' | 
                    'perfect4th' | 'tritone' | 'perfect5th' | 'minor6th' | 'major6th' |
                    'minor7th' | 'major7th' | 'octave';

type ChordType = 'major' | 'minor' | 'diminished' | 'augmented' | 'major7' | 
                 'minor7' | 'dominant7' | 'diminished7' | 'half-diminished7' |
                 'sus2' | 'sus4' | 'add9' | 'maj9' | 'min9';

interface Interval {
  name: IntervalName;
  semitones: number;
  nameCn: string;
  nameEn: string;
}

interface Chord {
  root: string;
  type: ChordType;
  notes: string[];
  symbol: string;
  romanNumeral?: string;
}

interface ChordProgression {
  id: string;
  name: string;
  nameCn: string;
  style: 'pop' | 'rnb' | 'jazz';
  chords: Chord[];
  romanNumerals: string[];
  exampleSongs: string[];
  description: string;
  descriptionCn: string;
}

function getInterval(note1: string, note2: string): Interval;
function getChordNotes(root: string, type: ChordType): string[];
function transposeNote(note: string, semitones: number): string;
function getScaleNotes(root: string, scaleType: string): string[];
```

## Data Models

### Knowledge Point

```typescript
interface KnowledgePoint {
  id: string;
  category: 'intervals' | 'chords' | 'scales' | 'rhythm';
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioExample?: {
    notes?: string[];
    chord?: Chord;
    progression?: ChordProgression;
  };
  visualExample?: {
    highlightedNotes: string[];
  };
  tips?: string[];
  tipsCn?: string[];
}
```

### Production Lesson

```typescript
interface ProductionLesson {
  id: string;
  category: 'arrangement' | 'mixing' | 'sound-design';
  title: string;
  titleCn: string;
  content: string;
  contentCn: string;
  tips: string[];
  tipsCn: string[];
  commonMistakes: string[];
  commonMistakesCn: string[];
  audioExamples?: string[]; // URLs to audio files
}
```

### Ear Training Question

```typescript
interface EarTrainingQuestion {
  type: 'interval' | 'chord' | 'rhythm';
  audio: {
    notes?: string[];
    chord?: Chord;
  };
  correctAnswer: string;
  options: string[];
}

interface EarTrainingResult {
  questionType: string;
  correct: boolean;
  timestamp: number;
}
```

### Learning Progress

```typescript
interface MusicLearningProgress {
  completedKnowledgePoints: string[];  // IDs of completed points
  earTrainingResults: EarTrainingResult[];
  lastStudyDate: string;               // ISO date string
  streak: number;                      // Consecutive days
  moduleProgress: {
    theory: number;      // 0-100 percentage
    chords: number;
    production: number;
    earTraining: number;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Statistics Calculation Correctness

*For any* set of completed knowledge points and ear training results, the calculated statistics (total completed, accuracy percentage, streak) SHALL be mathematically correct.

**Validates: Requirements 1.2**

### Property 2: Knowledge Point Filtering

*For any* category selection, the filtered knowledge points SHALL contain only items belonging to that category, and SHALL contain all items of that category.

**Validates: Requirements 2.2**

### Property 3: Note Frequency Calculation

*For any* valid note name (e.g., 'A4', 'C#5'), the calculated frequency SHALL match the standard equal temperament tuning (A4 = 440Hz).

**Validates: Requirements 2.4, 5.6**

### Property 4: Piano Keyboard Highlighting

*For any* interval or chord, the Piano_Keyboard component SHALL highlight exactly the notes that comprise that interval or chord, with no extra or missing highlights.

**Validates: Requirements 2.6, 6.2**

### Property 5: Chord Progression Style Filtering

*For any* style selection (pop, rnb, jazz), the filtered chord progressions SHALL contain only progressions of that style.

**Validates: Requirements 3.2**

### Property 6: Chord Progression Display Completeness

*For any* chord progression, the display SHALL include the chord symbols, roman numerals, and all notes for each chord.

**Validates: Requirements 3.3**

### Property 7: Chord Progression Example Songs

*For any* chord progression in the data, there SHALL be at least one example song associated with it.

**Validates: Requirements 3.5**

### Property 8: Lesson Content Completeness

*For any* production lesson, the content SHALL include at least one tip and at least one common mistake.

**Validates: Requirements 4.3**

### Property 9: Ear Training Question Generation

*For any* ear training question, the correct answer SHALL be included in the options, and the audio SHALL match the correct answer.

**Validates: Requirements 5.2, 5.3**

### Property 10: Answer Feedback Correctness

*For any* submitted answer in ear training, the feedback (correct/incorrect) SHALL accurately reflect whether the answer matches the correct answer.

**Validates: Requirements 5.4**

### Property 11: Accuracy Tracking

*For any* sequence of ear training results, the calculated accuracy percentage SHALL equal (correct answers / total answers) * 100.

**Validates: Requirements 5.5**

### Property 12: Piano Key Click Audio

*For any* piano key click, the played note frequency SHALL match the frequency of the clicked key's note.

**Validates: Requirements 6.3**

### Property 13: Audio Envelope Application

*For any* note playback, the audio envelope (ADSR) parameters SHALL be applied to shape the sound.

**Validates: Requirements 7.2**

### Property 14: Audio Scheduling

*For any* chord, all notes SHALL be scheduled to play at the same time. *For any* chord progression with tempo T, consecutive chords SHALL be scheduled at intervals of (60/T * beats) seconds.

**Validates: Requirements 7.3, 7.4**

### Property 15: Progress Persistence Round-Trip

*For any* valid MusicLearningProgress object, saving to localStorage and then loading SHALL produce an equivalent object.

**Validates: Requirements 8.1, 8.5**

### Property 16: Completion Marking

*For any* knowledge point marked as complete, the completedKnowledgePoints array SHALL contain that point's ID.

**Validates: Requirements 8.2**

### Property 17: Streak Calculation

*For any* sequence of study dates, the streak SHALL equal the count of consecutive days ending with the most recent study date. If the most recent study date is not today or yesterday, the streak SHALL be 0.

**Validates: Requirements 8.3**

### Property 18: Progress Percentage Calculation

*For any* module with N total knowledge points and M completed points, the progress percentage SHALL equal (M/N) * 100.

**Validates: Requirements 8.4**

### Property 19: Bilingual Content Completeness

*For any* content item (knowledge point, lesson, chord progression), both Chinese and English versions of all text fields SHALL be present and non-empty.

**Validates: Requirements 9.1, 9.4**

## Error Handling

### Audio Context Errors

- 如果浏览器不支持 Web Audio API，显示友好的错误提示
- 如果音频上下文被暂停（用户未交互），在用户首次交互时恢复
- 音频播放失败时，记录错误但不中断用户体验

### Data Loading Errors

- 如果知识点数据加载失败，显示重试按钮
- 如果进度数据损坏，重置为初始状态并通知用户

### Input Validation

- 验证音符名称格式（如 'C4', 'F#5'）
- 验证和弦类型是否在支持列表中
- 验证 BPM 范围（40-240）

## Testing Strategy

### Unit Tests

单元测试将覆盖核心逻辑函数：

1. **musicTheory.ts**: 音程计算、和弦音符生成、音符转调
2. **musicAudio.ts**: 频率计算、音频调度逻辑
3. **musicProgress.ts**: 进度计算、连续天数计算、百分比计算

### Property-Based Tests

使用 fast-check 库进行属性测试，每个测试运行至少 100 次迭代：

1. **频率计算属性**: 验证所有音符的频率计算正确性
2. **进度持久化属性**: 验证保存/加载的往返一致性
3. **过滤属性**: 验证分类过滤的完整性和正确性
4. **准确率计算属性**: 验证统计计算的数学正确性

### Integration Tests

集成测试将验证组件间的交互：

1. 钢琴键盘点击触发正确的音频播放
2. 知识点完成正确更新进度
3. 语言切换正确更新所有内容

### Test Configuration

```typescript
// 属性测试配置
const propertyTestConfig = {
  numRuns: 100,
  verbose: true,
};

// 测试标签格式
// Feature: music-learning-module, Property N: [property description]
```
