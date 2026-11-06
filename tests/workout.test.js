// test.js
import { generateWorkout } from '../js/workout.js';

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function runScenario(duration, level) {
  const result = generateWorkout(duration, level);
  assert(Array.isArray(result.exercises), `Exercises should be array for ${duration}-${level}`);
  assert(result.exercises.length > 0, `Should have at least one exercise for ${duration}-${level}`);
  const maxSec = duration * 60 * 1.1;
  assert(result.totalTimeSec <= maxSec, `Total time ${result.totalTimeSec}s exceeds 110% of ${duration}min`);
}

function testValidScenarios() {
  const levels = ['iniciante', 'intermediario', 'avancado'];
  const durations = [5, 30, 60];
  for (const level of levels) {
    for (const dur of durations) {
      runScenario(dur, level);
    }
  }
  console.log('✅ Valid scenarios passed');
}

function testInvalidInputs() {
  const invalidDurations = [4, 61, 7.5, 'ten'];
  for (const d of invalidDurations) {
    let threw = false;
    try {
      generateWorkout(d, 'iniciante');
    } catch (e) {
      threw = true;
    }
    assert(threw, `Expected error for invalid duration ${d}`);
  }
  const invalidLevels = ['expert', '', null];
  for (const lvl of invalidLevels) {
    let threw = false;
    try {
      generateWorkout(30, lvl);
    } catch (e) {
      threw = true;
    }
    assert(threw, `Expected error for invalid level ${lvl}`);
  }
  console.log('✅ Invalid input tests passed');
}

function main() {
  testValidScenarios();
  testInvalidInputs();
  console.log('All tests passed');
}

main();
