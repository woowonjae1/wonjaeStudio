/**
 * Music Audio Utilities - Property-Based Tests
 * Feature: music-learning-module, Property 14: Audio Scheduling
 * Validates: Requirements 7.3, 7.4
 */

import * as fc from "fast-check";
import { calculateChordStartTime, calculateChordDuration } from "../musicAudio";

describe("Music Audio Utilities", () => {
  describe("Property 14: Audio Scheduling", () => {
    /**
     * Property: Chord duration is correctly calculated from tempo and beats
     * duration = beatsPerChord * (60 / tempo)
     */
    it("chord duration equals beats times seconds per beat", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 240 }), // Valid BPM range
          fc.integer({ min: 1, max: 8 }), // Beats per chord
          (tempo, beatsPerChord) => {
            const duration = calculateChordDuration(tempo, beatsPerChord);
            const expected = beatsPerChord * (60 / tempo);
            return Math.abs(duration - expected) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Consecutive chords are scheduled at correct intervals
     * For chord at index i, start time = i * beatsPerChord * (60 / tempo)
     */
    it("consecutive chords are scheduled at correct intervals", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 240 }), // Valid BPM range
          fc.integer({ min: 1, max: 8 }), // Beats per chord
          fc.integer({ min: 0, max: 16 }), // Chord index
          (tempo, beatsPerChord, chordIndex) => {
            const startTime = calculateChordStartTime(
              tempo,
              beatsPerChord,
              chordIndex
            );
            const expected = chordIndex * beatsPerChord * (60 / tempo);
            return Math.abs(startTime - expected) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: First chord always starts at time 0
     */
    it("first chord starts at time 0", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 240 }),
          fc.integer({ min: 1, max: 8 }),
          (tempo, beatsPerChord) => {
            const startTime = calculateChordStartTime(tempo, beatsPerChord, 0);
            return startTime === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Chord start times are monotonically increasing
     */
    it("chord start times increase monotonically", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 240 }),
          fc.integer({ min: 1, max: 8 }),
          fc.integer({ min: 0, max: 15 }),
          (tempo, beatsPerChord, chordIndex) => {
            const time1 = calculateChordStartTime(
              tempo,
              beatsPerChord,
              chordIndex
            );
            const time2 = calculateChordStartTime(
              tempo,
              beatsPerChord,
              chordIndex + 1
            );
            return time2 > time1;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Gap between consecutive chords equals chord duration
     */
    it("gap between consecutive chords equals chord duration", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 240 }),
          fc.integer({ min: 1, max: 8 }),
          fc.integer({ min: 0, max: 15 }),
          (tempo, beatsPerChord, chordIndex) => {
            const time1 = calculateChordStartTime(
              tempo,
              beatsPerChord,
              chordIndex
            );
            const time2 = calculateChordStartTime(
              tempo,
              beatsPerChord,
              chordIndex + 1
            );
            const duration = calculateChordDuration(tempo, beatsPerChord);
            return Math.abs(time2 - time1 - duration) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Higher tempo results in shorter chord duration
     */
    it("higher tempo results in shorter duration", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 120 }),
          fc.integer({ min: 1, max: 8 }),
          (lowerTempo, beatsPerChord) => {
            const higherTempo = lowerTempo + 20;
            const durationLower = calculateChordDuration(
              lowerTempo,
              beatsPerChord
            );
            const durationHigher = calculateChordDuration(
              higherTempo,
              beatsPerChord
            );
            return durationHigher < durationLower;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: More beats per chord results in longer duration
     */
    it("more beats per chord results in longer duration", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 40, max: 240 }),
          fc.integer({ min: 1, max: 4 }),
          (tempo, fewerBeats) => {
            const moreBeats = fewerBeats + 1;
            const durationFewer = calculateChordDuration(tempo, fewerBeats);
            const durationMore = calculateChordDuration(tempo, moreBeats);
            return durationMore > durationFewer;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: At 60 BPM, one beat equals one second
     */
    it("at 60 BPM, one beat equals one second", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 8 }), (beatsPerChord) => {
          const duration = calculateChordDuration(60, beatsPerChord);
          return Math.abs(duration - beatsPerChord) < 0.0001;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: At 120 BPM, one beat equals 0.5 seconds
     */
    it("at 120 BPM, one beat equals 0.5 seconds", () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 8 }), (beatsPerChord) => {
          const duration = calculateChordDuration(120, beatsPerChord);
          return Math.abs(duration - beatsPerChord * 0.5) < 0.0001;
        }),
        { numRuns: 100 }
      );
    });
  });
});
