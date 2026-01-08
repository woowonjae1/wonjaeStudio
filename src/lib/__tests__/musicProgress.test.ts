/**
 * Music Progress Utilities - Property-Based Tests
 * Feature: music-learning-module
 * Property 15: Progress Persistence Round-Trip
 * Property 17: Streak Calculation
 * Property 18: Progress Percentage Calculation
 * Validates: Requirements 8.1, 8.3, 8.4, 8.5
 */

import * as fc from "fast-check";
import {
  MusicLearningProgress,
  EarTrainingResult,
  serializeProgress,
  deserializeProgress,
  calculateStreak,
  calculateProgressPercentage,
  calculateAccuracy,
  markKnowledgePointComplete,
  addEarTrainingResult,
  getLearningStatistics,
} from "../musicProgress";

// 生成有效的 EarTrainingResult
const earTrainingResultArb = fc.record({
  questionType: fc.constantFrom("interval", "chord", "rhythm") as fc.Arbitrary<
    "interval" | "chord" | "rhythm"
  >,
  correct: fc.boolean(),
  timestamp: fc.integer({ min: 0, max: Date.now() }),
});

// 生成有效的 MusicLearningProgress
const progressArb = fc.record({
  completedKnowledgePoints: fc.array(
    fc.string({ minLength: 1, maxLength: 20 }),
    { maxLength: 50 }
  ),
  earTrainingResults: fc.array(earTrainingResultArb, { maxLength: 100 }),
  lastStudyDate: fc.constantFrom("", "2024-01-01", "2024-06-15", "2025-01-08"),
  streak: fc.integer({ min: 0, max: 365 }),
  moduleProgress: fc.record({
    theory: fc.integer({ min: 0, max: 100 }),
    chords: fc.integer({ min: 0, max: 100 }),
    production: fc.integer({ min: 0, max: 100 }),
    earTraining: fc.integer({ min: 0, max: 100 }),
  }),
});

// 生成有效的日期字符串
const dateStringArb = fc
  .integer({
    min: new Date("2020-01-01").getTime(),
    max: new Date("2030-12-31").getTime(),
  })
  .map((timestamp) => new Date(timestamp).toISOString().split("T")[0]);

describe("Music Progress Utilities", () => {
  describe("Property 15: Progress Persistence Round-Trip", () => {
    /**
     * Property: For any valid MusicLearningProgress object,
     * serializing then deserializing produces an equivalent object
     */
    it("serialize then deserialize produces equivalent object", () => {
      fc.assert(
        fc.property(progressArb, (progress) => {
          const serialized = serializeProgress(progress);
          const deserialized = deserializeProgress(serialized);

          // Check all fields are preserved
          expect(deserialized.completedKnowledgePoints).toEqual(
            progress.completedKnowledgePoints
          );
          expect(deserialized.earTrainingResults).toEqual(
            progress.earTrainingResults
          );
          expect(deserialized.lastStudyDate).toEqual(progress.lastStudyDate);
          expect(deserialized.streak).toEqual(progress.streak);
          expect(deserialized.moduleProgress).toEqual(progress.moduleProgress);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Serialized data is valid JSON
     */
    it("serialized data is valid JSON", () => {
      fc.assert(
        fc.property(progressArb, (progress) => {
          const serialized = serializeProgress(progress);
          expect(() => JSON.parse(serialized)).not.toThrow();
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 17: Streak Calculation", () => {
    /**
     * Property: First study always results in streak of 1
     */
    it("first study results in streak of 1", () => {
      fc.assert(
        fc.property(dateStringArb, (today) => {
          const streak = calculateStreak("", 0, today);
          return streak === 1;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Studying on same day preserves current streak
     */
    it("studying on same day preserves streak", () => {
      fc.assert(
        fc.property(
          dateStringArb,
          fc.integer({ min: 1, max: 365 }),
          (today, currentStreak) => {
            const newStreak = calculateStreak(today, currentStreak, today);
            return newStreak === currentStreak;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Studying on consecutive day increments streak by 1
     */
    it("studying on consecutive day increments streak", () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: new Date("2020-01-02").getTime(),
            max: new Date("2030-12-31").getTime(),
          }),
          fc.integer({ min: 1, max: 364 }),
          (todayTimestamp, currentStreak) => {
            const todayDate = new Date(todayTimestamp);
            const today = todayDate.toISOString().split("T")[0];
            const yesterday = new Date(todayDate);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            const newStreak = calculateStreak(
              yesterdayStr,
              currentStreak,
              today
            );
            return newStreak === currentStreak + 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Gap of more than 1 day resets streak to 1
     */
    it("gap of more than 1 day resets streak to 1", () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: new Date("2020-01-03").getTime(),
            max: new Date("2030-12-31").getTime(),
          }),
          fc.integer({ min: 1, max: 365 }),
          fc.integer({ min: 2, max: 30 }),
          (todayTimestamp, currentStreak, daysGap) => {
            const todayDate = new Date(todayTimestamp);
            const today = todayDate.toISOString().split("T")[0];
            const pastDate = new Date(todayDate);
            pastDate.setDate(pastDate.getDate() - daysGap);
            const pastDateStr = pastDate.toISOString().split("T")[0];

            const newStreak = calculateStreak(
              pastDateStr,
              currentStreak,
              today
            );
            return newStreak === 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Streak is always positive (>= 1) after studying
     */
    it("streak is always positive after studying", () => {
      fc.assert(
        fc.property(
          fc.constantFrom("", "2024-01-01", "2024-06-15"),
          fc.integer({ min: 0, max: 365 }),
          dateStringArb,
          (lastStudyDate, currentStreak, today) => {
            const newStreak = calculateStreak(
              lastStudyDate,
              currentStreak,
              today
            );
            return newStreak >= 1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Property 18: Progress Percentage Calculation", () => {
    /**
     * Property: Progress percentage = (completed / total) * 100
     */
    it("percentage equals completed divided by total times 100", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          fc.integer({ min: 1, max: 1000 }),
          (completed, total) => {
            const adjustedCompleted = Math.min(completed, total);
            const percentage = calculateProgressPercentage(
              adjustedCompleted,
              total
            );
            const expected = Math.round((adjustedCompleted / total) * 100);
            return percentage === expected;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Progress percentage is between 0 and 100 (when completed <= total)
     */
    it("percentage is between 0 and 100 when completed is valid", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1000 }),
          fc.nat(1000),
          (total, completedRaw) => {
            const completed = completedRaw % (total + 1); // Ensure completed <= total
            const percentage = calculateProgressPercentage(completed, total);
            return percentage >= 0 && percentage <= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: 0 completed = 0%
     */
    it("zero completed equals zero percent", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000 }), (total) => {
          const percentage = calculateProgressPercentage(0, total);
          return percentage === 0;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: All completed = 100%
     */
    it("all completed equals 100 percent", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 1000 }), (total) => {
          const percentage = calculateProgressPercentage(total, total);
          return percentage === 100;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Empty total returns 0%
     */
    it("empty total returns zero percent", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1000 }), (completed) => {
          const percentage = calculateProgressPercentage(completed, 0);
          return percentage === 0;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: More completed = higher or equal percentage (when both are valid)
     */
    it("more completed means higher or equal percentage", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 1000 }), // total must be at least 2
          fc.nat(998), // completed1 raw value
          (total, completed1Raw) => {
            const completed1 = completed1Raw % (total - 1); // completed1 < total - 1
            const completed2 = completed1 + 1; // completed2 = completed1 + 1
            const percentage1 = calculateProgressPercentage(completed1, total);
            const percentage2 = calculateProgressPercentage(completed2, total);
            return percentage2 >= percentage1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Accuracy Calculation", () => {
    /**
     * Property: Accuracy = (correct / total) * 100
     */
    it("accuracy equals correct divided by total times 100", () => {
      fc.assert(
        fc.property(
          fc.array(earTrainingResultArb, { minLength: 1, maxLength: 100 }),
          (results) => {
            const accuracy = calculateAccuracy(results);
            const correctCount = results.filter((r) => r.correct).length;
            const expected = Math.round((correctCount / results.length) * 100);
            return accuracy === expected;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Empty results = 0% accuracy
     */
    it("empty results equals zero accuracy", () => {
      const accuracy = calculateAccuracy([]);
      expect(accuracy).toBe(0);
    });

    /**
     * Property: All correct = 100% accuracy
     */
    it("all correct equals 100 percent accuracy", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (count) => {
          const results: EarTrainingResult[] = Array(count)
            .fill(null)
            .map(() => ({
              questionType: "interval" as const,
              correct: true,
              timestamp: Date.now(),
            }));
          return calculateAccuracy(results) === 100;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: All incorrect = 0% accuracy
     */
    it("all incorrect equals zero percent accuracy", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (count) => {
          const results: EarTrainingResult[] = Array(count)
            .fill(null)
            .map(() => ({
              questionType: "chord" as const,
              correct: false,
              timestamp: Date.now(),
            }));
          return calculateAccuracy(results) === 0;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Filtering by type only considers that type
     */
    it("filtering by type only considers that type", () => {
      fc.assert(
        fc.property(
          fc.array(earTrainingResultArb, { minLength: 1, maxLength: 50 }),
          fc.constantFrom("interval", "chord", "rhythm") as fc.Arbitrary<
            "interval" | "chord" | "rhythm"
          >,
          (results, filterType) => {
            const accuracy = calculateAccuracy(results, filterType);
            const filtered = results.filter(
              (r) => r.questionType === filterType
            );

            if (filtered.length === 0) {
              return accuracy === 0;
            }

            const correctCount = filtered.filter((r) => r.correct).length;
            const expected = Math.round((correctCount / filtered.length) * 100);
            return accuracy === expected;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Knowledge Point Completion", () => {
    /**
     * Property: Marking a point complete adds it to the list
     */
    it("marking complete adds to list", () => {
      fc.assert(
        fc.property(
          progressArb,
          fc.string({ minLength: 1, maxLength: 20 }),
          (progress, pointId) => {
            // Ensure pointId is not already in the list
            const cleanProgress = {
              ...progress,
              completedKnowledgePoints:
                progress.completedKnowledgePoints.filter(
                  (id) => id !== pointId
                ),
            };

            const updated = markKnowledgePointComplete(cleanProgress, pointId);
            return updated.completedKnowledgePoints.includes(pointId);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Marking same point twice doesn't duplicate
     */
    it("marking same point twice does not duplicate", () => {
      fc.assert(
        fc.property(
          progressArb,
          fc.string({ minLength: 1, maxLength: 20 }),
          (progress, pointId) => {
            const updated1 = markKnowledgePointComplete(progress, pointId);
            const updated2 = markKnowledgePointComplete(updated1, pointId);

            const count = updated2.completedKnowledgePoints.filter(
              (id) => id === pointId
            ).length;
            return count === 1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Statistics Calculation", () => {
    /**
     * Property: Statistics totalCompleted matches completedKnowledgePoints length
     */
    it("totalCompleted matches completed points length", () => {
      fc.assert(
        fc.property(
          progressArb,
          fc.integer({ min: 1, max: 100 }),
          (progress, totalPoints) => {
            const stats = getLearningStatistics(progress, totalPoints);
            return (
              stats.totalCompleted === progress.completedKnowledgePoints.length
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Statistics streak matches progress streak
     */
    it("streak matches progress streak", () => {
      fc.assert(
        fc.property(
          progressArb,
          fc.integer({ min: 1, max: 100 }),
          (progress, totalPoints) => {
            const stats = getLearningStatistics(progress, totalPoints);
            return stats.streak === progress.streak;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
