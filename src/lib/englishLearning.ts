"use client";

import { VOCABULARY_DATA } from "./vocabularyData";

// 单词难度等级
export type WordLevel = "basic" | "cet4" | "cet6" | "ielts" | "advanced";

// 单词数据结构
export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleCn: string;
  level: WordLevel;
  tags: string[];
}

// 学习记录
export interface WordProgress {
  wordId: string;
  familiarity: number;
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
  correctCount: number;
}

// 口语场景
export type SpeakingCategory = "daily" | "travel" | "work" | "social" | "ielts";

// 口语话题
export interface SpeakingTopic {
  id: string;
  category: SpeakingCategory;
  part?: 1 | 2 | 3;
  topic: string;
  topicCn: string;
  questions: string[];
  usefulPhrases: string[];
  sampleAnswer?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// 学习统计
export interface LearningStats {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  todayReviewed: number;
  todayNew: number;
  streak: number;
  lastStudyDate: string;
}

const PROGRESS_KEY = "english_progress";
const STATS_KEY = "english_stats";

// 从词汇数据生成单词列表
function generateWords(): Word[] {
  return VOCABULARY_DATA.map((w, i) => ({
    id: `w${i + 1}`,
    word: w.word,
    phonetic: w.phonetic,
    meaning: w.meaning,
    partOfSpeech: w.pos,
    example: w.example,
    exampleCn: w.exampleCn,
    level: w.level,
    tags: w.tags,
  }));
}

// 口语话题
const SPEAKING_TOPICS: SpeakingTopic[] = [
  // 日常基础
  {
    id: "t1",
    category: "daily",
    topic: "Self Introduction",
    topicCn: "自我介绍",
    questions: [
      "What's your name?",
      "Where are you from?",
      "What do you do?",
      "What are your hobbies?",
    ],
    usefulPhrases: [
      "My name is...",
      "I'm from...",
      "I work as...",
      "In my free time...",
    ],
    difficulty: "beginner",
  },
  {
    id: "t2",
    category: "daily",
    topic: "Daily Routine",
    topicCn: "日常作息",
    questions: [
      "What time do you wake up?",
      "What do you have for breakfast?",
      "How do you get to work?",
      "What do you do in the evening?",
    ],
    usefulPhrases: [
      "I usually wake up at...",
      "I typically have...",
      "I take the bus...",
      "After work, I...",
    ],
    difficulty: "beginner",
  },
  {
    id: "t3",
    category: "daily",
    topic: "Weather",
    topicCn: "天气",
    questions: [
      "What's the weather like today?",
      "What's your favorite season?",
      "Do you prefer hot or cold weather?",
    ],
    usefulPhrases: [
      "It's sunny/cloudy/rainy...",
      "I prefer... because...",
      "My favorite season is...",
    ],
    difficulty: "beginner",
  },
  {
    id: "t4",
    category: "daily",
    topic: "Food",
    topicCn: "饮食",
    questions: [
      "What's your favorite food?",
      "Can you cook?",
      "Do you prefer eating at home or out?",
    ],
    usefulPhrases: [
      "I'm a big fan of...",
      "I can make...",
      "I prefer... because...",
    ],
    difficulty: "beginner",
  },
  {
    id: "t5",
    category: "daily",
    topic: "Shopping",
    topicCn: "购物",
    questions: [
      "Do you like shopping?",
      "Where do you usually shop?",
      "Online or in stores?",
    ],
    usefulPhrases: [
      "I enjoy shopping for...",
      "I usually shop at...",
      "I prefer online because...",
    ],
    difficulty: "beginner",
  },
  // 社交
  {
    id: "t6",
    category: "social",
    topic: "Making Friends",
    topicCn: "交朋友",
    questions: [
      "How do you make new friends?",
      "What qualities do you value in friends?",
      "How often do you meet friends?",
    ],
    usefulPhrases: [
      "I usually meet people through...",
      "I value... in a friend",
      "We try to meet up...",
    ],
    difficulty: "intermediate",
  },
  {
    id: "t7",
    category: "social",
    topic: "Giving Opinions",
    topicCn: "表达观点",
    questions: [
      "What do you think about social media?",
      "Do you think technology makes life better?",
    ],
    usefulPhrases: [
      "In my opinion...",
      "I believe that...",
      "From my perspective...",
      "On one hand... on the other hand...",
    ],
    difficulty: "intermediate",
  },
  // 旅行
  {
    id: "t8",
    category: "travel",
    topic: "At the Airport",
    topicCn: "在机场",
    questions: [
      "Where are you flying to?",
      "Do you have luggage to check?",
      "What's the purpose of your visit?",
    ],
    usefulPhrases: [
      "I'm flying to...",
      "I have one bag to check.",
      "I'm here for business/vacation.",
    ],
    difficulty: "intermediate",
  },
  {
    id: "t9",
    category: "travel",
    topic: "At the Hotel",
    topicCn: "在酒店",
    questions: [
      "Do you have a reservation?",
      "What type of room?",
      "How long will you stay?",
    ],
    usefulPhrases: [
      "I have a reservation under...",
      "I'd like a single/double room.",
      "I'll be staying for... nights.",
    ],
    difficulty: "intermediate",
  },
  {
    id: "t10",
    category: "travel",
    topic: "Asking Directions",
    topicCn: "问路",
    questions: [
      "How do I get to...?",
      "Is there a subway nearby?",
      "How far is it?",
    ],
    usefulPhrases: [
      "Go straight and turn left/right.",
      "It's about... minutes walk.",
      "Take the first exit.",
    ],
    difficulty: "beginner",
  },
  // 工作
  {
    id: "t11",
    category: "work",
    topic: "Job Interview",
    topicCn: "工作面试",
    questions: [
      "Tell me about yourself.",
      "Why do you want this job?",
      "What are your strengths?",
      "Where do you see yourself in 5 years?",
    ],
    usefulPhrases: [
      "I have... years of experience in...",
      "I'm passionate about...",
      "My strength is...",
      "I'm looking for opportunities to...",
    ],
    difficulty: "intermediate",
  },
  {
    id: "t12",
    category: "work",
    topic: "Office Communication",
    topicCn: "办公室交流",
    questions: [
      "Could you help me with this?",
      "When is the deadline?",
      "Can we schedule a meeting?",
    ],
    usefulPhrases: [
      "I was wondering if you could...",
      "The deadline is...",
      "How about... o'clock?",
    ],
    difficulty: "intermediate",
  },
  // 雅思 Part 1
  {
    id: "t13",
    category: "ielts",
    part: 1,
    topic: "Hometown",
    topicCn: "家乡",
    questions: [
      "Where is your hometown?",
      "What do you like about it?",
      "Has it changed much?",
      "Would you live there in the future?",
    ],
    usefulPhrases: [
      "My hometown is located in...",
      "What I like most is...",
      "It has changed significantly...",
    ],
    difficulty: "intermediate",
  },
  {
    id: "t14",
    category: "ielts",
    part: 1,
    topic: "Work or Study",
    topicCn: "工作或学习",
    questions: [
      "Do you work or study?",
      "What do you like about it?",
      "What would you change?",
    ],
    usefulPhrases: [
      "I'm currently working as...",
      "What I enjoy most is...",
      "If I could change one thing...",
    ],
    difficulty: "intermediate",
  },
  {
    id: "t15",
    category: "ielts",
    part: 1,
    topic: "Technology",
    topicCn: "科技",
    questions: [
      "How often do you use your phone?",
      "What apps do you use most?",
      "Do you spend too much time on technology?",
    ],
    usefulPhrases: [
      "I use my phone for...",
      "The app I use most is...",
      "I try to limit...",
    ],
    difficulty: "intermediate",
  },
  // 雅思 Part 2
  {
    id: "t16",
    category: "ielts",
    part: 2,
    topic: "Describe a person who influenced you",
    topicCn: "描述影响你的人",
    questions: [
      "Who is this person?",
      "How did you meet?",
      "What did they do?",
      "How did it affect you?",
    ],
    usefulPhrases: [
      "I'd like to talk about...",
      "I first met them when...",
      "What impressed me most was...",
      "This experience taught me...",
    ],
    sampleAnswer:
      "I'd like to talk about my high school English teacher, Mr. Wang. I met him when I was 15, and he completely changed my attitude towards learning...",
    difficulty: "advanced",
  },
  {
    id: "t17",
    category: "ielts",
    part: 2,
    topic: "Describe a place you want to visit",
    topicCn: "描述想去的地方",
    questions: [
      "Where is it?",
      "How did you learn about it?",
      "What would you do there?",
      "Why do you want to go?",
    ],
    usefulPhrases: [
      "The place I'd like to visit is...",
      "I learned about it from...",
      "If I went there, I would...",
      "The main reason is...",
    ],
    difficulty: "advanced",
  },
  {
    id: "t18",
    category: "ielts",
    part: 2,
    topic: "Describe a skill you want to learn",
    topicCn: "描述想学的技能",
    questions: [
      "What skill?",
      "Why do you want to learn it?",
      "How would you learn it?",
      "How would it benefit you?",
    ],
    usefulPhrases: [
      "The skill I want to learn is...",
      "I've always been interested in...",
      "I plan to learn by...",
      "This skill would help me...",
    ],
    difficulty: "advanced",
  },
  // 雅思 Part 3
  {
    id: "t19",
    category: "ielts",
    part: 3,
    topic: "Education",
    topicCn: "教育",
    questions: [
      "How has education changed?",
      "Is online learning effective?",
      "What skills should schools teach?",
      "Is a degree necessary for success?",
    ],
    usefulPhrases: [
      "In recent years...",
      "There are advantages and disadvantages...",
      "I believe schools should...",
      "Success depends on...",
    ],
    difficulty: "advanced",
  },
  {
    id: "t20",
    category: "ielts",
    part: 3,
    topic: "Environment",
    topicCn: "环境",
    questions: [
      "What environmental problems are serious?",
      "Can individuals make a difference?",
      "Should governments do more?",
    ],
    usefulPhrases: [
      "The most pressing issue is...",
      "Every individual can contribute by...",
      "Governments should implement...",
      "If we don't act now...",
    ],
    difficulty: "advanced",
  },
  {
    id: "t21",
    category: "ielts",
    part: 3,
    topic: "Technology and Society",
    topicCn: "科技与社会",
    questions: [
      "How has technology changed communication?",
      "What are the dangers of too much technology?",
      "Will robots replace workers?",
    ],
    usefulPhrases: [
      "Technology has revolutionized...",
      "One concern is that...",
      "While technology offers...",
      "We need to find a balance...",
    ],
    difficulty: "advanced",
  },
];

// 获取所有单词
export function getAllWords(): Word[] {
  return generateWords();
}

// 获取学习进度
export function getProgress(): Record<string, WordProgress> {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : {};
}

// 更新单词进度
export function updateWordProgress(wordId: string, correct: boolean): void {
  const progress = getProgress();
  const now = new Date().toISOString();

  if (!progress[wordId]) {
    progress[wordId] = {
      wordId,
      familiarity: 0,
      lastReviewed: now,
      nextReview: now,
      reviewCount: 0,
      correctCount: 0,
    };
  }

  const p = progress[wordId];
  p.reviewCount++;
  if (correct) {
    p.correctCount++;
    p.familiarity = Math.min(5, p.familiarity + 1);
  } else {
    p.familiarity = Math.max(0, p.familiarity - 1);
  }
  p.lastReviewed = now;

  const intervals = [0, 1, 3, 7, 14, 30];
  const nextDays = intervals[p.familiarity] || 30;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextDays);
  p.nextReview = nextDate.toISOString();

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  updateStats(true);
}

// 获取今日待复习单词
export function getTodayReviewWords(): Word[] {
  const words = getAllWords();
  const progress = getProgress();
  const now = new Date();

  return words.filter((word) => {
    const p = progress[word.id];
    if (!p) return true;
    return new Date(p.nextReview) <= now;
  });
}

// 获取新单词
export function getNewWords(count: number = 10): Word[] {
  const words = getAllWords();
  const progress = getProgress();
  return words.filter((word) => !progress[word.id]).slice(0, count);
}

// 获取随机单词用于默写
export function getRandomWordsForSpelling(count: number = 100): Word[] {
  const words = getAllWords();
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, words.length));
}

// 获取学习统计
export function getStats(): LearningStats {
  if (typeof window === "undefined") {
    return {
      totalWords: 0,
      masteredWords: 0,
      learningWords: 0,
      todayReviewed: 0,
      todayNew: 0,
      streak: 0,
      lastStudyDate: "",
    };
  }

  const words = getAllWords();
  const progress = getProgress();
  const data = localStorage.getItem(STATS_KEY);

  const stats = data
    ? JSON.parse(data)
    : { todayReviewed: 0, todayNew: 0, streak: 0, lastStudyDate: "" };

  const today = new Date().toDateString();
  if (stats.lastStudyDate !== today) {
    stats.todayReviewed = 0;
    stats.todayNew = 0;
  }

  stats.totalWords = words.length;
  stats.masteredWords = Object.values(progress).filter(
    (p: WordProgress) => p.familiarity >= 4
  ).length;
  stats.learningWords = Object.values(progress).filter(
    (p: WordProgress) => p.familiarity > 0 && p.familiarity < 4
  ).length;

  return stats;
}

// 更新统计
function updateStats(_isReview: boolean): void {
  const stats = getStats();
  const today = new Date().toDateString();

  if (stats.lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    stats.streak =
      stats.lastStudyDate === yesterday.toDateString() ? stats.streak + 1 : 1;
    stats.todayReviewed = 0;
    stats.todayNew = 0;
  }

  stats.todayReviewed++;
  stats.lastStudyDate = today;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// 获取口语话题
export function getSpeakingTopics(): SpeakingTopic[] {
  return SPEAKING_TOPICS;
}

// 按分类获取话题
export function getTopicsByCategory(
  category: SpeakingCategory
): SpeakingTopic[] {
  return SPEAKING_TOPICS.filter((t) => t.category === category);
}

// 获取随机话题
export function getRandomTopic(
  category?: SpeakingCategory
): SpeakingTopic | null {
  const topics = category ? getTopicsByCategory(category) : SPEAKING_TOPICS;
  if (topics.length === 0) return null;
  return topics[Math.floor(Math.random() * topics.length)];
}
