// workout.test.js
// Tests for the workout generation module.
// Runs in Node.js — uses fs to load exercise data, then passes it to generateWorkout().

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateWorkout } from '../js/workout.js';

// Load exercise data (Node-only — this is the test harness)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, '..', 'data', 'exercises.json');
const rawData = JSON.parse(readFileSync(dataPath, 'utf8'));
const allExercises = rawData.exercises;

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function assert(condition, message) {
  if (!condition) throw new Error('FAIL: ' + (message || 'Assertion failed'));
}

let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    passCount++;
    console.log('  ✅ ' + name);
  } catch (err) {
    failCount++;
    console.error('  ❌ ' + name + ': ' + err.message);
  }
}

// ──────────────────────────────────────────────
// Test suites
// ──────────────────────────────────────────────

function testDataLoaded() {
  console.log('\n📦 Data loading');
  test('exercises array is loaded and non-empty', () => {
    assert(Array.isArray(allExercises), 'exercises should be an array');
    assert(allExercises.length > 0, 'exercises array should not be empty');
  });
}

function testValidScenarios() {
  console.log('\n🏋️ Valid scenarios (all level × duration combos)');
  const levels = ['iniciante', 'intermediario', 'avancado'];
  const durations = [5, 15, 30, 60];

  for (const level of levels) {
    for (const dur of durations) {
      test(`${level} / ${dur}min`, () => {
        const result = generateWorkout(allExercises, dur, level);
        assert(Array.isArray(result.exercises), 'exercises should be array');
        assert(result.exercises.length > 0, 'should have at least one exercise');
        const maxSec = dur * 60 * 1.1;
        assert(
          result.totalTimeSec <= maxSec,
          `totalTimeSec ${result.totalTimeSec}s exceeds 110% of ${dur}min (${maxSec}s)`
        );
        assert(typeof result.focusLabel === 'string', 'focusLabel should be string');
        assert(typeof result.levelLabel === 'string', 'levelLabel should be string');
      });
    }
  }
}

function testFocusFiltering() {
  console.log('\n🎯 Focus filtering');

  const focusCases = [
    { focus: 'corpo-inteiro', expectedParts: null },
    { focus: 'superiores', expectedParts: ['chest', 'back', 'shoulders', 'upper_arms', 'lower_arms', 'full_body'] },
    { focus: 'core', expectedParts: ['core', 'full_body'] },
    { focus: 'inferiores', expectedParts: ['upper_legs', 'lower_legs', 'full_body'] },
  ];

  for (const { focus, expectedParts } of focusCases) {
    test(`focus="${focus}" returns matching body_parts`, () => {
      const result = generateWorkout(allExercises, 30, 'iniciante', focus);
      assert(result.exercises.length > 0, `no exercises returned for focus=${focus}`);
      if (expectedParts !== null) {
        for (const ex of result.exercises) {
          const bp = (ex.bodyPart || '').toLowerCase();
          assert(
            expectedParts.includes(bp),
            `exercise "${ex.name}" has body_part="${bp}" which is not in [${expectedParts}]`
          );
        }
      }
    });
  }

  test('default focus is corpo-inteiro', () => {
    const result = generateWorkout(allExercises, 30, 'iniciante');
    assert(result.focusLabel === 'Corpo Inteiro', `expected "Corpo Inteiro", got "${result.focusLabel}"`);
  });
}

function testExerciseFields() {
  console.log('\n📋 Returned exercise fields');

  test('each exercise has all required fields', () => {
    const result = generateWorkout(allExercises, 30, 'iniciante');
    const requiredFields = ['id', 'name', 'description', 'image', 'primaryMuscles', 'bodyPart', 'reps', 'timeSec', 'restSec'];
    for (const ex of result.exercises) {
      for (const field of requiredFields) {
        assert(ex[field] !== undefined, `missing field "${field}" on exercise "${ex.id}"`);
      }
      assert(typeof ex.id === 'string' && ex.id.length > 0, 'id should be non-empty string');
      assert(typeof ex.name === 'string' && ex.name.length > 0, 'name should be non-empty string');
      assert(typeof ex.image === 'string' && ex.image.startsWith('assets/'), `image "${ex.image}" should start with "assets/"`);
      assert(Array.isArray(ex.primaryMuscles), 'primaryMuscles should be array');
      assert(typeof ex.reps === 'number' && ex.reps >= 8, `reps should be >= 8, got ${ex.reps}`);
      assert(typeof ex.timeSec === 'number' && ex.timeSec > 0, 'timeSec should be positive number');
      assert(typeof ex.restSec === 'number' && ex.restSec > 0, 'restSec should be positive number');
    }
  });

  test('beginner exercises have 15s rest', () => {
    const result = generateWorkout(allExercises, 30, 'iniciante');
    for (const ex of result.exercises) {
      assert(ex.restSec === 15, `beginner restSec should be 15, got ${ex.restSec}`);
    }
  });

  test('intermediate exercises have 12s rest', () => {
    const result = generateWorkout(allExercises, 30, 'intermediario');
    for (const ex of result.exercises) {
      assert(ex.restSec === 12, `intermediate restSec should be 12, got ${ex.restSec}`);
    }
  });

  test('advanced exercises have 10s rest', () => {
    const result = generateWorkout(allExercises, 30, 'avancado');
    for (const ex of result.exercises) {
      assert(ex.restSec === 10, `advanced restSec should be 10, got ${ex.restSec}`);
    }
  });
}

function testInvalidInputs() {
  console.log('\n🚫 Invalid inputs');

  const invalidDurations = [4, 61, 7.5, 'ten', null, undefined];
  for (const d of invalidDurations) {
    test(`invalid duration: ${JSON.stringify(d)}`, () => {
      let threw = false;
      try {
        generateWorkout(allExercises, d, 'iniciante');
      } catch (e) {
        threw = true;
      }
      assert(threw, `expected error for duration=${JSON.stringify(d)}`);
    });
  }

  const invalidLevels = ['expert', '', null, undefined, 42];
  for (const lvl of invalidLevels) {
    test(`invalid level: ${JSON.stringify(lvl)}`, () => {
      let threw = false;
      try {
        generateWorkout(allExercises, 30, lvl);
      } catch (e) {
        threw = true;
      }
      assert(threw, `expected error for level=${JSON.stringify(lvl)}`);
    });
  }

  test('invalid focus throws', () => {
    let threw = false;
    try {
      generateWorkout(allExercises, 30, 'iniciante', 'pernas');
    } catch (e) {
      threw = true;
    }
    assert(threw, 'expected error for invalid focus');
  });

  test('empty exercises array throws', () => {
    let threw = false;
    try {
      generateWorkout([], 30, 'iniciante');
    } catch (e) {
      threw = true;
    }
    assert(threw, 'expected error for empty exercises');
  });
}

function testImageResolution() {
  console.log('\n🖼️ Image resolution');

  test('images resolve to assets/ prefix', () => {
    const result = generateWorkout(allExercises, 60, 'iniciante');
    for (const ex of result.exercises) {
      assert(ex.image.startsWith('assets/'), `image "${ex.image}" must start with "assets/"`);
    }
  });

  test('exercises without images get placeholder', () => {
    const fakeExercises = [{
      id: 'fake-no-img',
      name_en: 'Fake Exercise',
      description_en: 'Test',
      category: 'strength',
      difficulty: 'beginner',
      body_part: 'chest',
      primary_muscles: ['pectorals'],
      secondary_muscles: [],
      is_bodyweight: true,
      met: 5,
      images: {},
    }];
    const result = generateWorkout(fakeExercises, 5, 'iniciante');
    assert(result.exercises.length > 0, 'should select the fake exercise');
    assert(
      result.exercises[0].image === 'assets/illustrations/placeholder.svg',
      `expected placeholder, got "${result.exercises[0].image}"`
    );
  });
}

// ──────────────────────────────────────────────
// Main runner
// ──────────────────────────────────────────────

console.log('═══════════════════════════════════════');
console.log(' Treino Academia — Workout Tests');
console.log('═══════════════════════════════════════');

testDataLoaded();
testValidScenarios();
testFocusFiltering();
testExerciseFields();
testInvalidInputs();
testImageResolution();

console.log('\n═══════════════════════════════════════');
console.log(` Results: ${passCount} passed, ${failCount} failed`);
console.log('═══════════════════════════════════════\n');

if (failCount > 0) {
  process.exit(1);
}
