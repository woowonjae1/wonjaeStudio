/**
 * Music Progress Utilities
 * 学习进度追踪工具库 - 使用 localStorage 存储和管理学习进度
 */

// 听感训练结果
export interface EarTrainingResult {
  questionType: "interval" | "chord" | "rhythm";
  correct: boolean;
  timestamp: number;
}

// 学习进度数据结构
export interface MusicLearningProgress {
  completedKnowledgePoints: string[]; // 已完成知识点 ID
  earTrainingResults: EarTrainingResult[];
  lastStudyDate: string; // ISO 日期字符串
  streak: number; // 连续学习天数
  moduleProgress: {
    theory: number; // 0-100 百分比
    chords: number;
    production: number;
    earTraining: number;
  };
}

// localStorage 键名
const STORAGE_KEY = "music-learning-progress";

// 默认进度数据
const DEFAULT_PROGRESS: MusicLearningProgress = {
  completedKnowledgePoints: [],
  earTrainingResults: [],
  lastStudyDate: "",
  streak: 0,
  moduleProgress: {
    theory: 0,
    chords: 0,
    production: 0,
    earTraining: 0,
  },
};

/**
 * 获取今天的日期字符串（ISO 格式，只保留日期部分）
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * 获取昨天的日期字符串
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

/**
 * 从 localStorage 加载学习进度
 */
export function loadProgress(): MusicLearningProgress {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PROGRESS };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { ...DEFAULT_PROGRESS };
    }

    const parsed = JSON.parse(stored);
    // 合并默认值以确保所有字段存在
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      moduleProgress: {
        ...DEFAULT_PROGRESS.moduleProgress,
        ...parsed.moduleProgress,
      },
    };
  } catch {
    console.error("Failed to load music progress from localStorage");
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * 保存学习进度到 localStorage
 */
export function saveProgress(progress: MusicLearningProgress): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.error("Failed to save music progress to localStorage");
  }
}

/**
 * 计算连续学习天数
 * @param lastStudyDate 上次学习日期
 * @param currentStreak 当前连续天数
 * @param today 今天的日期（用于测试）
 * @returns 新的连续天数
 */
export function calculateStreak(
  lastStudyDate: string,
  currentStreak: number,
  today: string = getTodayDateString()
): number {
  if (!lastStudyDate) {
    return 1; // 首次学习
  }

  if (lastStudyDate === today) {
    return currentStreak; // 今天已经学习过
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastStudyDate === yesterdayStr) {
    return currentStreak + 1; // 连续学习
  }

  return 1; // 中断后重新开始
}

/**
 * 计算模块进度百分比
 * @param completedCount 已完成数量
 * @param totalCount 总数量
 * @returns 进度百分比 (0-100)
 */
export function calculateProgressPercentage(
  completedCount: number,
  totalCount: number
): number {
  if (totalCount <= 0) {
    return 0;
  }
  return Math.round((completedCount / totalCount) * 100);
}

/**
 * 计算听感训练准确率
 * @param results 训练结果数组
 * @param questionType 可选，筛选特定类型
 * @returns 准确率百分比 (0-100)
 */
export function calculateAccuracy(
  results: EarTrainingResult[],
  questionType?: "interval" | "chord" | "rhythm"
): number {
  const filtered = questionType
    ? results.filter((r) => r.questionType === questionType)
    : results;

  if (filtered.length === 0) {
    return 0;
  }

  const correctCount = filtered.filter((r) => r.correct).length;
  return Math.round((correctCount / filtered.length) * 100);
}

/**
 * 标记知识点为已完成
 */
export function markKnowledgePointComplete(
  progress: MusicLearningProgress,
  knowledgePointId: string
): MusicLearningProgress {
  if (progress.completedKnowledgePoints.includes(knowledgePointId)) {
    return progress; // 已经完成
  }

  const today = getTodayDateString();
  const newStreak = calculateStreak(
    progress.lastStudyDate,
    progress.streak,
    today
  );

  return {
    ...progress,
    completedKnowledgePoints: [
      ...progress.completedKnowledgePoints,
      knowledgePointId,
    ],
    lastStudyDate: today,
    streak: newStreak,
  };
}

/**
 * 添加听感训练结果
 */
export function addEarTrainingResult(
  progress: MusicLearningProgress,
  result: Omit<EarTrainingResult, "timestamp">
): MusicLearningProgress {
  const today = getTodayDateString();
  const newStreak = calculateStreak(
    progress.lastStudyDate,
    progress.streak,
    today
  );

  return {
    ...progress,
    earTrainingResults: [
      ...progress.earTrainingResults,
      { ...result, timestamp: Date.now() },
    ],
    lastStudyDate: today,
    streak: newStreak,
  };
}

/**
 * 更新模块进度
 */
export function updateModuleProgress(
  progress: MusicLearningProgress,
  module: keyof MusicLearningProgress["moduleProgress"],
  completedCount: number,
  totalCount: number
): MusicLearningProgress {
  const percentage = calculateProgressPercentage(completedCount, totalCount);

  return {
    ...progress,
    moduleProgress: {
      ...progress.moduleProgress,
      [module]: percentage,
    },
  };
}

/**
 * 获取学习统计数据
 */
export interface LearningStatistics {
  totalCompleted: number;
  streak: number;
  overallProgress: number;
  earTrainingAccuracy: number;
  moduleProgress: MusicLearningProgress["moduleProgress"];
}

export function getLearningStatistics(
  progress: MusicLearningProgress,
  totalKnowledgePoints: number
): LearningStatistics {
  const overallProgress = calculateProgressPercentage(
    progress.completedKnowledgePoints.length,
    totalKnowledgePoints
  );

  const earTrainingAccuracy = calculateAccuracy(progress.earTrainingResults);

  return {
    totalCompleted: progress.completedKnowledgePoints.length,
    streak: progress.streak,
    overallProgress,
    earTrainingAccuracy,
    moduleProgress: progress.moduleProgress,
  };
}

/**
 * 重置学习进度
 */
export function resetProgress(): MusicLearningProgress {
  const newProgress = { ...DEFAULT_PROGRESS };
  saveProgress(newProgress);
  return newProgress;
}

/**
 * 检查知识点是否已完成
 */
export function isKnowledgePointCompleted(
  progress: MusicLearningProgress,
  knowledgePointId: string
): boolean {
  return progress.completedKnowledgePoints.includes(knowledgePointId);
}

/**
 * 获取最近的听感训练结果
 */
export function getRecentEarTrainingResults(
  progress: MusicLearningProgress,
  count: number = 10
): EarTrainingResult[] {
  return progress.earTrainingResults.slice(-count).reverse();
}

/**
 * 序列化进度数据（用于导出）
 */
export function serializeProgress(progress: MusicLearningProgress): string {
  return JSON.stringify(progress);
}

/**
 * 反序列化进度数据（用于导入）
 */
export function deserializeProgress(data: string): MusicLearningProgress {
  try {
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      moduleProgress: {
        ...DEFAULT_PROGRESS.moduleProgress,
        ...parsed.moduleProgress,
      },
    };
  } catch {
    throw new Error("Invalid progress data format");
  }
}
