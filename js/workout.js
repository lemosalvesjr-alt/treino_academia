// workout.js
// Pure workout generation module — no data loading, no Node modules.
// Receives the exercises array from the caller (app.js or test harness).

/**
 * Map Portuguese level labels to RepDB difficulty strings.
 * @type {Record<string, string>}
 */
const LEVEL_MAP = {
  iniciante: 'beginner',
  intermediario: 'intermediate',
  avancado: 'advanced',
};

/**
 * Rest time in seconds per level.
 * @type {Record<string, number>}
 */
const REST_SEC_MAP = {
  iniciante: 15,
  intermediario: 12,
  avancado: 10,
};

/**
 * Map Portuguese focus labels to RepDB body_part values.
 * 'full_body' exercises are always included regardless of focus.
 * @type {Record<string, string[]|null>}
 */
const FOCUS_MAP = {
  'corpo-inteiro': null, // no filter — all body parts
  'superiores': ['chest', 'back', 'shoulders', 'upper_arms', 'lower_arms'],
  'core': ['core'],
  'inferiores': ['upper_legs', 'lower_legs'],
};

/**
 * Portuguese labels shown in the UI for each focus.
 * @type {Record<string, string>}
 */
const FOCUS_LABELS = {
  'corpo-inteiro': 'Corpo Inteiro',
  'superiores': 'Superiores',
  'core': 'Core',
  'inferiores': 'Inferiores',
};

/**
 * Portuguese labels shown in the UI for each level.
 * @type {Record<string, string>}
 */
const LEVEL_LABELS = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

/**
 * Resolve the best available image path for an exercise.
 * Prefers flat.main → flat.start → flat.peak → placeholder SVG.
 * Prepends 'assets/' since data paths are relative (e.g. "images/flat/...").
 *
 * @param {object} images - The exercise's `images` object (may be undefined).
 * @returns {string} Resolved image path ready for <img src>.
 */
function resolveImage(images) {
  if (images && images.flat) {
    const flat = images.flat;
    const raw = flat.main || flat.start || flat.peak || '';
    if (raw) {
      return 'assets/' + raw;
    }
  }
  return 'assets/illustrations/placeholder.svg';
}

/**
 * Estimate repetitions for an exercise.
 * If the exercise has a MET value, use Math.max(8, Math.round(met * 3)).
 * Otherwise default to 10.
 *
 * @param {object} exercise
 * @returns {number}
 */
function estimateReps(exercise) {
  if (exercise.met != null && typeof exercise.met === 'number') {
    return Math.max(8, Math.round(exercise.met * 3));
  }
  return 10;
}

/**
 * Generate a workout plan.
 *
 * @param {object[]} allExercises  - Full array of exercise objects from exercises.json
 * @param {number}   durationMinutes - Integer between 5 and 60 inclusive
 * @param {string}   level          - 'iniciante' | 'intermediario' | 'avancado'
 * @param {string}   [focus='corpo-inteiro'] - 'corpo-inteiro' | 'superiores' | 'core' | 'inferiores'
 * @returns {{ exercises: Array, totalTimeSec: number, focusLabel: string, levelLabel: string }}
 */
export function generateWorkout(allExercises, durationMinutes, level, focus) {
  // --- Default focus ---
  if (focus === undefined || focus === null) {
    focus = 'corpo-inteiro';
  }

  // --- Validate inputs ---
  if (!Array.isArray(allExercises) || allExercises.length === 0) {
    throw new Error('Lista de exercícios inválida ou vazia.');
  }
  if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 60) {
    throw new Error('Duração deve ser um inteiro entre 5 e 60 minutos.');
  }
  const validLevels = Object.keys(LEVEL_MAP);
  if (!validLevels.includes(level)) {
    throw new Error('Nível inválido.');
  }
  const validFocuses = Object.keys(FOCUS_MAP);
  if (!validFocuses.includes(focus)) {
    throw new Error('Foco inválido.');
  }

  const difficulty = LEVEL_MAP[level];
  const restSec = REST_SEC_MAP[level];
  const focusParts = FOCUS_MAP[focus]; // null means no filter

  // --- Filter exercises ---
  const pool = allExercises.filter((ex) => {
    // Must be bodyweight
    if (ex.is_bodyweight !== true) return false;
    // Must match difficulty
    if (!ex.difficulty || ex.difficulty.toLowerCase() !== difficulty) return false;
    // If focus has a body_part filter, exercise must match OR be full_body
    if (focusParts !== null) {
      const bp = (ex.body_part || '').toLowerCase();
      if (bp !== 'full_body' && !focusParts.includes(bp)) return false;
    }
    return true;
  });

  if (pool.length === 0) {
    throw new Error('Nenhum exercício disponível para o nível e foco escolhidos.');
  }

  // --- Shuffle pool (Fisher-Yates) ---
  const shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // --- Select exercises that fit within duration ---
  const maxTotalSec = Math.floor(durationMinutes * 60 * 1.1); // 110% tolerance
  const selected = [];
  let totalSec = 0;

  for (const ex of shuffled) {
    const reps = estimateReps(ex);
    // Estimate time per exercise: roughly 3 seconds per rep, minimum 20s
    const exTimeSec = Math.max(20, reps * 3);
    const blockSec = exTimeSec + restSec;

    if (totalSec + blockSec > maxTotalSec) continue;

    selected.push({
      id: ex.id,
      name: ex.name_en,
      description: ex.description_en || '',
      image: resolveImage(ex.images),
      primaryMuscles: ex.primary_muscles || [],
      bodyPart: ex.body_part || '',
      reps: reps,
      timeSec: exTimeSec,
      restSec: restSec,
    });

    totalSec += blockSec;
    if (totalSec >= durationMinutes * 60 * 0.9) break; // stop once within 90%
  }

  return {
    exercises: selected,
    totalTimeSec: totalSec,
    focusLabel: FOCUS_LABELS[focus] || focus,
    levelLabel: LEVEL_LABELS[level] || level,
  };
}
