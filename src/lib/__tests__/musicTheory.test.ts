/**
 * Music Theory Utilities - Property-Based Tests
 * Feature: music-learning-module, Property 3: Note Frequency Calculation
 * Validates: Requirements 2.4, 5.6
 */

import * as fc from "fast-check";
import {
  noteToFrequency,
  noteToMidi,
  midiToNote,
  transposeNote,
  getInterval,
  getChordNotes,
  getScaleNotes,
  isValidNote,
  ChordType,
  ScaleType,
} from "../musicTheory";

// 生成有效音符的 arbitrary
const validNoteArb = fc
  .tuple(
    fc.constantFrom(
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
      "B"
    ),
    fc.integer({ min: 0, max: 8 })
  )
  .map(([note, octave]) => `${note}${octave}`);

// 生成有效 MIDI 编号的 arbitrary
const validMidiArb = fc.integer({ min: 12, max: 108 }); // C0 to C8

describe("Music Theory Utilities", () => {
  describe("Property 3: Note Frequency Calculation", () => {
    /**
     * Property: A4 = 440Hz (standard tuning)
     */
    it("should calculate A4 as exactly 440Hz", () => {
      expect(noteToFrequency("A4")).toBe(440);
    });

    /**
     * Property: For any valid note, frequency doubles every octave
     * f(note + 12 semitones) = 2 * f(note)
     */
    it("frequency doubles every octave", () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom(
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
              "B"
            ),
            fc.integer({ min: 0, max: 7 }) // Leave room for +1 octave
          ),
          ([noteName, octave]) => {
            const lowerNote = `${noteName}${octave}`;
            const higherNote = `${noteName}${octave + 1}`;
            const lowerFreq = noteToFrequency(lowerNote);
            const higherFreq = noteToFrequency(higherNote);
            // Allow small floating point tolerance
            expect(Math.abs(higherFreq / lowerFreq - 2)).toBeLessThan(0.0001);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Frequency increases monotonically with MIDI number
     */
    it("frequency increases monotonically with pitch", () => {
      fc.assert(
        fc.property(fc.integer({ min: 12, max: 107 }), (midi) => {
          const note1 = midiToNote(midi);
          const note2 = midiToNote(midi + 1);
          return noteToFrequency(note2) > noteToFrequency(note1);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("MIDI and Note Conversion Round-Trip", () => {
    /**
     * Property: noteToMidi and midiToNote are inverses
     * For any valid MIDI number, midiToNote(noteToMidi(midiToNote(midi))) = midiToNote(midi)
     */
    it("MIDI to note to MIDI round-trip preserves value", () => {
      fc.assert(
        fc.property(validMidiArb, (midi) => {
          const note = midiToNote(midi);
          const backToMidi = noteToMidi(note);
          return backToMidi === midi;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Note to MIDI to note round-trip preserves value
     */
    it("note to MIDI to note round-trip preserves value", () => {
      fc.assert(
        fc.property(validNoteArb, (note) => {
          const midi = noteToMidi(note);
          const backToNote = midiToNote(midi);
          return backToNote === note;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Transpose Properties", () => {
    /**
     * Property: Transposing by 0 semitones returns the same note
     */
    it("transposing by 0 returns same note", () => {
      fc.assert(
        fc.property(validNoteArb, (note) => {
          return transposeNote(note, 0) === note;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Transposing up then down by same amount returns original
     * Note: We constrain to notes that won't go below C0 or above C8 after transposition
     */
    it("transpose up then down returns original", () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom(
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
              "B"
            ),
            fc.integer({ min: 2, max: 6 }) // Safe octave range
          ),
          fc.integer({ min: -12, max: 12 }),
          ([noteName, octave], semitones) => {
            const note = `${noteName}${octave}`;
            const transposed = transposeNote(note, semitones);
            const backToOriginal = transposeNote(transposed, -semitones);
            return backToOriginal === note;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Transposing by 12 semitones moves up one octave
     */
    it("transposing by 12 moves up one octave", () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.constantFrom(
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
              "B"
            ),
            fc.integer({ min: 0, max: 7 })
          ),
          ([noteName, octave]) => {
            const note = `${noteName}${octave}`;
            const transposed = transposeNote(note, 12);
            const expected = `${noteName}${octave + 1}`;
            return transposed === expected;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe("Interval Properties", () => {
    /**
     * Property: Interval between same note is unison (0 semitones)
     */
    it("interval between same note is unison", () => {
      fc.assert(
        fc.property(validNoteArb, (note) => {
          const interval = getInterval(note, note);
          return interval.semitones === 0 && interval.name === "unison";
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Interval semitones match the difference in MIDI numbers (mod 12)
     */
    it("interval semitones match MIDI difference mod 12", () => {
      fc.assert(
        fc.property(validNoteArb, validNoteArb, (note1, note2) => {
          const interval = getInterval(note1, note2);
          const midi1 = noteToMidi(note1);
          const midi2 = noteToMidi(note2);
          const expectedSemitones = Math.abs(midi2 - midi1) % 12;
          return interval.semitones === expectedSemitones;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Chord Properties", () => {
    /**
     * Property: Chord always contains the root note
     */
    it("chord always contains root note", () => {
      fc.assert(
        fc.property(
          validNoteArb,
          fc.constantFrom(
            "major",
            "minor",
            "diminished",
            "augmented",
            "major7",
            "minor7",
            "dominant7"
          ),
          (root, chordType) => {
            const notes = getChordNotes(root, chordType as ChordType);
            return notes[0] === root;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Major chord has major 3rd (4 semitones) and perfect 5th (7 semitones)
     */
    it("major chord has correct intervals", () => {
      fc.assert(
        fc.property(validNoteArb, (root) => {
          const notes = getChordNotes(root, "major");
          const rootMidi = noteToMidi(root);
          const thirdMidi = noteToMidi(notes[1]);
          const fifthMidi = noteToMidi(notes[2]);
          return thirdMidi - rootMidi === 4 && fifthMidi - rootMidi === 7;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Minor chord has minor 3rd (3 semitones) and perfect 5th (7 semitones)
     */
    it("minor chord has correct intervals", () => {
      fc.assert(
        fc.property(validNoteArb, (root) => {
          const notes = getChordNotes(root, "minor");
          const rootMidi = noteToMidi(root);
          const thirdMidi = noteToMidi(notes[1]);
          const fifthMidi = noteToMidi(notes[2]);
          return thirdMidi - rootMidi === 3 && fifthMidi - rootMidi === 7;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Scale Properties", () => {
    /**
     * Property: Scale always starts with root note
     */
    it("scale always starts with root note", () => {
      fc.assert(
        fc.property(
          validNoteArb,
          fc.constantFrom(
            "major",
            "natural-minor",
            "pentatonic-major",
            "blues"
          ),
          (root, scaleType) => {
            const notes = getScaleNotes(root, scaleType as ScaleType);
            return notes[0] === root;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Major scale has 7 notes
     */
    it("major scale has 7 notes", () => {
      fc.assert(
        fc.property(validNoteArb, (root) => {
          const notes = getScaleNotes(root, "major");
          return notes.length === 7;
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Pentatonic scale has 5 notes
     */
    it("pentatonic scale has 5 notes", () => {
      fc.assert(
        fc.property(validNoteArb, (root) => {
          const notes = getScaleNotes(root, "pentatonic-major");
          return notes.length === 5;
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Note Validation", () => {
    /**
     * Property: All generated valid notes pass validation
     */
    it("valid notes pass validation", () => {
      fc.assert(
        fc.property(validNoteArb, (note) => {
          return isValidNote(note);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Property: Invalid note formats fail validation
     */
    it("invalid notes fail validation", () => {
      const invalidNotes = ["X4", "C", "4C", "CC4", "C-1", "", "abc"];
      invalidNotes.forEach((note) => {
        expect(isValidNote(note)).toBe(false);
      });
    });
  });
});
