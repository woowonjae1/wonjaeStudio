# Implementation Plan: Music Learning Module

## Overview

本实现计划将音乐学习模块分解为可增量执行的任务，从核心工具库开始，逐步构建组件和页面。使用 TypeScript 和 Next.js，复用现有项目的 UI 组件和 i18n 系统。

## Tasks

- [x] 1. Set up music module foundation
  - [x] 1.1 Create music theory utilities (musicTheory.ts)
    - Implement note/frequency conversion functions
    - Implement interval calculation functions
    - Implement chord note generation functions
    - Implement scale generation functions
    - _Requirements: 2.4, 5.6, 6.3_

  - [x]* 1.2 Write property tests for music theory utilities
    - **Property 3: Note Frequency Calculation**
    - **Validates: Requirements 2.4, 5.6**

  - [x] 1.3 Create music audio utilities (musicAudio.ts)
    - Implement Web Audio API wrapper
    - Implement playNote function with ADSR envelope
    - Implement playChord function
    - Implement playProgression function with tempo control
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x]* 1.4 Write property tests for audio scheduling
    - **Property 14: Audio Scheduling**
    - **Validates: Requirements 7.3, 7.4**

- [x] 2. Implement progress tracking system
  - [x] 2.1 Create music progress utilities (musicProgress.ts)
    - Implement localStorage save/load functions
    - Implement streak calculation
    - Implement progress percentage calculation
    - Implement statistics aggregation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x]* 2.2 Write property tests for progress persistence
    - **Property 15: Progress Persistence Round-Trip**
    - **Validates: Requirements 8.1, 8.5**

  - [x]* 2.3 Write property tests for streak calculation
    - **Property 17: Streak Calculation**
    - **Validates: Requirements 8.3**

  - [x]* 2.4 Write property tests for progress percentage
    - **Property 18: Progress Percentage Calculation**
    - **Validates: Requirements 8.4**

- [x] 3. Checkpoint - Core utilities complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Create music data content
  - [x] 4.1 Create music data file (musicData.ts)
    - Define knowledge points for theory module (intervals, chords, scales, rhythm)
    - Define chord progressions for different styles (pop, rnb, jazz)
    - Define production lessons (arrangement, mixing, sound design)
    - Include bilingual content (Chinese and English)
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 9.1, 9.4_

  - [x]* 4.2 Write property tests for data completeness
    - **Property 7: Chord Progression Example Songs**
    - **Property 8: Lesson Content Completeness**
    - **Property 19: Bilingual Content Completeness**
    - **Validates: Requirements 3.5, 4.3, 9.1, 9.4**

- [x] 5. Build core UI components
  - [x] 5.1 Create PianoKeyboard component
    - Render 2+ octaves of piano keys
    - Implement key highlighting for intervals/chords
    - Implement click-to-play functionality
    - Make responsive for mobile/desktop
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 5.2 Write property tests for piano keyboard highlighting
    - **Property 4: Piano Keyboard Highlighting**
    - **Validates: Requirements 2.6, 6.2**

  - [x] 5.3 Create AudioPlayer component
    - Implement play/pause/stop controls
    - Support single notes, chords, and progressions
    - Display playback state
    - _Requirements: 7.5_

  - [x] 5.4 Create KnowledgePointCard component
    - Display title, description, difficulty
    - Include audio example button
    - Include visual example (piano keyboard)
    - Support bilingual content
    - _Requirements: 2.3, 2.5_

  - [x] 5.5 Create ChordProgressionCard component
    - Display chord symbols and roman numerals
    - Include audio playback
    - Show example songs
    - _Requirements: 3.3, 3.4, 3.5_

  - [ ]* 5.6 Write property tests for chord progression display
    - **Property 6: Chord Progression Display Completeness**
    - **Validates: Requirements 3.3**

- [x] 6. Checkpoint - Components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Build Music Learning Hub page
  - [x] 7.1 Create /music/page.tsx
    - Display module cards (Theory, Chords, Production, Ear Training)
    - Display learning statistics
    - Implement navigation to sub-modules
    - Support bilingual content
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 7.2 Write property tests for statistics calculation
    - **Property 1: Statistics Calculation Correctness**
    - **Validates: Requirements 1.2**

- [x] 8. Build Theory Module page
  - [x] 8.1 Create /music/theory/page.tsx
    - Display category tabs (Intervals, Chords, Scales, Rhythm)
    - Display knowledge points filtered by category
    - Show knowledge point details with audio/visual examples
    - Track completion status
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 8.2 Write property tests for knowledge point filtering
    - **Property 2: Knowledge Point Filtering**
    - **Validates: Requirements 2.2**

- [x] 9. Build Chords Module page
  - [x] 9.1 Create /music/chords/page.tsx
    - Display style tabs (Pop, R&B/Neo-Soul, Jazz)
    - Display chord progressions filtered by style
    - Show progression details with audio playback
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 9.2 Write property tests for style filtering
    - **Property 5: Chord Progression Style Filtering**
    - **Validates: Requirements 3.2**

- [x] 10. Build Production Module page
  - [x] 10.1 Create /music/production/page.tsx
    - Display topic tabs (Arrangement, Mixing, Sound Design)
    - Display lessons with tips and common mistakes
    - Support audio examples where applicable
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 11. Checkpoint - Content modules complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Build Ear Training Module
  - [x] 12.1 Create EarTrainingQuiz component
    - Generate random interval/chord questions
    - Play audio for questions
    - Display answer options
    - Provide immediate feedback
    - Track accuracy
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [ ]* 12.2 Write property tests for question generation
    - **Property 9: Ear Training Question Generation**
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 12.3 Write property tests for answer feedback
    - **Property 10: Answer Feedback Correctness**
    - **Validates: Requirements 5.4**

  - [ ]* 12.4 Write property tests for accuracy tracking
    - **Property 11: Accuracy Tracking**
    - **Validates: Requirements 5.5**

  - [x] 12.5 Create /music/ear-training/page.tsx
    - Display training type selection
    - Integrate EarTrainingQuiz component
    - Display progress and accuracy stats
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 13. Integration and navigation
  - [x] 13.1 Update Navbar to include Music module link
    - Add music link to navigation
    - Support bilingual labels
    - _Requirements: 1.1_

  - [x] 13.2 Add music translations to i18n system
    - Add Chinese translations for all music module content
    - Add English translations for all music module content
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 14. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript with Next.js App Router
- Property-based tests use fast-check library with minimum 100 iterations
