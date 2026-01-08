/**
 * Music Data - Property-Based Tests
 * Feature: music-learning-module
 * Property 7: Chord Progression Example Songs
 * Property 8: Lesson Content Completeness
 * Property 19: Bilingual Content Completeness
 * Validates: Requirements 3.5, 4.3, 9.1, 9.4
 */

import {
  KNOWLEDGE_POINTS,
  CHORD_PROGRESSIONS,
  PRODUCTION_LESSONS,
  getKnowledgePointsByCategory,
  getChordProgressionsByStyle,
  getProductionLessonsByCategory,
} from "../musicData";

describe("Music Data", () => {
  describe("Property 7: Chord Progression Example Songs", () => {
    /**
     * Property: For any chord progression, there SHALL be at least one example song
     */
    it("every chord progression has at least one example song", () => {
      CHORD_PROGRESSIONS.forEach((progression) => {
        expect(progression.exampleSongs.length).toBeGreaterThanOrEqual(1);
        expect(progression.exampleSongs[0].length).toBeGreaterThan(0);
      });
    });

    /**
     * Property: Example songs are non-empty strings
     */
    it("all example songs are non-empty strings", () => {
      CHORD_PROGRESSIONS.forEach((progression) => {
        progression.exampleSongs.forEach((song) => {
          expect(typeof song).toBe("string");
          expect(song.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Property 8: Lesson Content Completeness", () => {
    /**
     * Property: For any production lesson, there SHALL be at least one tip
     */
    it("every production lesson has at least one tip", () => {
      PRODUCTION_LESSONS.forEach((lesson) => {
        expect(lesson.tips.length).toBeGreaterThanOrEqual(1);
        expect(lesson.tips[0].length).toBeGreaterThan(0);
      });
    });

    /**
     * Property: For any production lesson, there SHALL be at least one common mistake
     */
    it("every production lesson has at least one common mistake", () => {
      PRODUCTION_LESSONS.forEach((lesson) => {
        expect(lesson.commonMistakes.length).toBeGreaterThanOrEqual(1);
        expect(lesson.commonMistakes[0].length).toBeGreaterThan(0);
      });
    });

    /**
     * Property: Tips and common mistakes are non-empty strings
     */
    it("all tips and common mistakes are non-empty strings", () => {
      PRODUCTION_LESSONS.forEach((lesson) => {
        lesson.tips.forEach((tip) => {
          expect(typeof tip).toBe("string");
          expect(tip.trim().length).toBeGreaterThan(0);
        });
        lesson.commonMistakes.forEach((mistake) => {
          expect(typeof mistake).toBe("string");
          expect(mistake.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Property 19: Bilingual Content Completeness", () => {
    /**
     * Property: For any knowledge point, both Chinese and English versions SHALL be present
     */
    it("every knowledge point has bilingual title and description", () => {
      KNOWLEDGE_POINTS.forEach((kp) => {
        // English
        expect(kp.title).toBeDefined();
        expect(kp.title.length).toBeGreaterThan(0);
        expect(kp.description).toBeDefined();
        expect(kp.description.length).toBeGreaterThan(0);

        // Chinese
        expect(kp.titleCn).toBeDefined();
        expect(kp.titleCn.length).toBeGreaterThan(0);
        expect(kp.descriptionCn).toBeDefined();
        expect(kp.descriptionCn.length).toBeGreaterThan(0);
      });
    });

    /**
     * Property: For any knowledge point with tips, both Chinese and English tips SHALL be present
     */
    it("knowledge points with tips have bilingual tips", () => {
      KNOWLEDGE_POINTS.forEach((kp) => {
        if (kp.tips && kp.tips.length > 0) {
          expect(kp.tipsCn).toBeDefined();
          expect(kp.tipsCn!.length).toBe(kp.tips.length);
          kp.tipsCn!.forEach((tip) => {
            expect(tip.length).toBeGreaterThan(0);
          });
        }
      });
    });

    /**
     * Property: For any chord progression, both Chinese and English versions SHALL be present
     */
    it("every chord progression has bilingual name and description", () => {
      CHORD_PROGRESSIONS.forEach((cp) => {
        // English
        expect(cp.name).toBeDefined();
        expect(cp.name.length).toBeGreaterThan(0);
        expect(cp.description).toBeDefined();
        expect(cp.description.length).toBeGreaterThan(0);

        // Chinese
        expect(cp.nameCn).toBeDefined();
        expect(cp.nameCn.length).toBeGreaterThan(0);
        expect(cp.descriptionCn).toBeDefined();
        expect(cp.descriptionCn.length).toBeGreaterThan(0);
      });
    });

    /**
     * Property: For any production lesson, both Chinese and English versions SHALL be present
     */
    it("every production lesson has bilingual content", () => {
      PRODUCTION_LESSONS.forEach((lesson) => {
        // English
        expect(lesson.title).toBeDefined();
        expect(lesson.title.length).toBeGreaterThan(0);
        expect(lesson.content).toBeDefined();
        expect(lesson.content.length).toBeGreaterThan(0);

        // Chinese
        expect(lesson.titleCn).toBeDefined();
        expect(lesson.titleCn.length).toBeGreaterThan(0);
        expect(lesson.contentCn).toBeDefined();
        expect(lesson.contentCn.length).toBeGreaterThan(0);
      });
    });

    /**
     * Property: Production lesson tips and mistakes have matching bilingual content
     */
    it("production lessons have matching bilingual tips and mistakes", () => {
      PRODUCTION_LESSONS.forEach((lesson) => {
        // Tips
        expect(lesson.tipsCn.length).toBe(lesson.tips.length);
        lesson.tipsCn.forEach((tip) => {
          expect(tip.length).toBeGreaterThan(0);
        });

        // Common mistakes
        expect(lesson.commonMistakesCn.length).toBe(
          lesson.commonMistakes.length
        );
        lesson.commonMistakesCn.forEach((mistake) => {
          expect(mistake.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("Data Filtering Functions", () => {
    /**
     * Property: Filtering by category returns only items of that category
     */
    it("getKnowledgePointsByCategory returns correct items", () => {
      const categories = ["intervals", "chords", "scales", "rhythm"] as const;

      categories.forEach((category) => {
        const filtered = getKnowledgePointsByCategory(category);
        filtered.forEach((kp) => {
          expect(kp.category).toBe(category);
        });
      });
    });

    /**
     * Property: Filtering by style returns only progressions of that style
     */
    it("getChordProgressionsByStyle returns correct items", () => {
      const styles = ["pop", "rnb", "jazz"] as const;

      styles.forEach((style) => {
        const filtered = getChordProgressionsByStyle(style);
        filtered.forEach((cp) => {
          expect(cp.style).toBe(style);
        });
      });
    });

    /**
     * Property: Filtering by category returns only lessons of that category
     */
    it("getProductionLessonsByCategory returns correct items", () => {
      const categories = ["arrangement", "mixing", "sound-design"] as const;

      categories.forEach((category) => {
        const filtered = getProductionLessonsByCategory(category);
        filtered.forEach((lesson) => {
          expect(lesson.category).toBe(category);
        });
      });
    });

    /**
     * Property: All items are covered by filtering
     */
    it("filtering covers all knowledge points", () => {
      const categories = ["intervals", "chords", "scales", "rhythm"] as const;
      let totalFiltered = 0;

      categories.forEach((category) => {
        totalFiltered += getKnowledgePointsByCategory(category).length;
      });

      expect(totalFiltered).toBe(KNOWLEDGE_POINTS.length);
    });

    it("filtering covers all chord progressions", () => {
      const styles = ["pop", "rnb", "jazz"] as const;
      let totalFiltered = 0;

      styles.forEach((style) => {
        totalFiltered += getChordProgressionsByStyle(style).length;
      });

      expect(totalFiltered).toBe(CHORD_PROGRESSIONS.length);
    });

    it("filtering covers all production lessons", () => {
      const categories = ["arrangement", "mixing", "sound-design"] as const;
      let totalFiltered = 0;

      categories.forEach((category) => {
        totalFiltered += getProductionLessonsByCategory(category).length;
      });

      expect(totalFiltered).toBe(PRODUCTION_LESSONS.length);
    });
  });

  describe("Data Integrity", () => {
    /**
     * Property: All IDs are unique
     */
    it("all knowledge point IDs are unique", () => {
      const ids = KNOWLEDGE_POINTS.map((kp) => kp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all chord progression IDs are unique", () => {
      const ids = CHORD_PROGRESSIONS.map((cp) => cp.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("all production lesson IDs are unique", () => {
      const ids = PRODUCTION_LESSONS.map((pl) => pl.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    /**
     * Property: Chord progressions have valid chord data
     */
    it("all chord progressions have valid chord data", () => {
      CHORD_PROGRESSIONS.forEach((cp) => {
        expect(cp.chords.length).toBeGreaterThan(0);
        cp.chords.forEach((chord) => {
          expect(chord.root).toBeDefined();
          expect(chord.type).toBeDefined();
          expect(chord.romanNumeral).toBeDefined();
        });
      });
    });
  });
});
