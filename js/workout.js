// workout.js
// Pure workout generation module — no data loading, no Node modules.
// Receives the exercises array from the caller (app.js or test harness).

/**
 * Map Portuguese level labels to RepDB difficulty strings.
 * @type {Record<string, string>}
 */
export const LEVEL_MAP = {
  iniciante: 'beginner',
  intermediario: 'intermediate',
  avancado: 'advanced',
};

/**
 * Realistic rest time in seconds per level (ACSM/NSCA resistance training standards).
 * Beginners need more rest (45s) to recover ATP-CP and maintain safe biomechanics.
 * @type {Record<string, number>}
 */
export const REST_SEC_MAP = {
  iniciante: 45,
  intermediario: 30,
  avancado: 20,
};

/**
 * Map Portuguese focus labels to RepDB body_part values.
 * 'full_body' exercises are always included regardless of focus.
 * @type {Record<string, string[]|null>}
 */
export const FOCUS_MAP = {
  'corpo-inteiro': null, // no filter — all body parts
  'superiores': ['chest', 'back', 'shoulders', 'upper_arms', 'lower_arms'],
  'core': ['core'],
  'inferiores': ['upper_legs', 'lower_legs'],
};

/**
 * Portuguese labels shown in the UI for each focus.
 * @type {Record<string, string>}
 */
export const FOCUS_LABELS = {
  'corpo-inteiro': 'Corpo Inteiro',
  'superiores': 'Superiores',
  'core': 'Core',
  'inferiores': 'Inferiores',
};

/**
 * Portuguese labels shown in the UI for each level.
 * @type {Record<string, string>}
 */
export const LEVEL_LABELS = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

/**
 * Determine realistic sets per exercise based on duration and fitness level.
 *
 * @param {number} durationMinutes
 * @param {string} level
 * @returns {number} Sets count (typically 2 to 4)
 */
export function determineSets(durationMinutes, level) {
  if (durationMinutes <= 10) return 2;
  if (durationMinutes <= 20) return level === 'iniciante' ? 2 : 3;
  if (durationMinutes <= 35) return 3;
  return level === 'avancado' ? 4 : (level === 'intermediario' ? 4 : 3);
}

/**
 * Get recommended min/max unique exercise counts based on workout duration.
 * Keeps workouts focused and realistic (never 40+ exercises).
 *
 * @param {number} durationMinutes
 * @returns {{ min: number, max: number }}
 */
function getExerciseCountLimits(durationMinutes) {
  if (durationMinutes <= 5) return { min: 1, max: 2 };
  if (durationMinutes <= 10) return { min: 2, max: 3 };
  if (durationMinutes <= 20) return { min: 3, max: 5 };
  if (durationMinutes <= 35) return { min: 4, max: 7 };
  return { min: 5, max: 8 };
}

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
 * Estimate repetitions for an exercise based on MET and fitness level.
 *
 * @param {object} exercise
 * @param {string} [level='iniciante']
 * @returns {number}
 */
function estimateReps(exercise, level = 'iniciante') {
  let baseReps = 10;
  if (exercise.met != null && typeof exercise.met === 'number') {
    baseReps = Math.max(8, Math.round(exercise.met * 3));
  }
  if (level === 'iniciante') {
    return Math.min(12, Math.max(8, baseReps));
  }
  if (level === 'intermediario') {
    return Math.min(15, Math.max(10, baseReps + 2));
  }
  if (level === 'avancado') {
    return Math.min(20, Math.max(12, baseReps + 4));
  }
  return baseReps;
}

/**
 * Generate a realistic workout plan with structured sets, reps and recovery periods.
 *
 * @param {object[]} allExercises  - Full array of exercise objects from exercises.json
 * @param {number}   durationMinutes - Integer between 5 and 60 inclusive
 * @param {string}   level          - 'iniciante' | 'intermediario' | 'avancado'
 * @param {string}   [focus='corpo-inteiro'] - 'corpo-inteiro' | 'superiores' | 'core' | 'inferiores'
 * @returns {{ exercises: Array, steps: Array, totalTimeSec: number, totalSets: number, focusLabel: string, levelLabel: string }}
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
  const numSets = determineSets(durationMinutes, level);
  const limits = getExerciseCountLimits(durationMinutes);

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
  let shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // --- Interleave body parts for full body focus to guarantee muscle variety ---
  if (focus === 'corpo-inteiro') {
    const buckets = {};
    for (const ex of shuffled) {
      const bp = ex.body_part || 'other';
      if (!buckets[bp]) buckets[bp] = [];
      buckets[bp].push(ex);
    }
    const interleaved = [];
    const keys = Object.keys(buckets);
    let added = true;
    let idx = 0;
    while (added) {
      added = false;
      for (const k of keys) {
        if (idx < buckets[k].length) {
          interleaved.push(buckets[k][idx]);
          added = true;
        }
      }
      idx++;
    }
    shuffled = interleaved;
  }

  // --- Select a focused number of exercises structured in sets ---
  const targetSec = durationMinutes * 60;
  const maxTotalSec = Math.floor(targetSec * 1.10); // 110% tolerance ceiling
  const minTargetSec = Math.floor(targetSec * 0.85); // 85% target floor
  const effectiveMin = Math.min(limits.min, shuffled.length);
  const effectiveMax = Math.min(limits.max, shuffled.length);

  const selected = [];
  let totalSec = 0;

  for (const ex of shuffled) {
    if (selected.length >= effectiveMax) break;

    const reps = estimateReps(ex, level);
    // Estimate execution time: roughly 3 seconds per rep, minimum 20s
    const exTimeSec = Math.max(20, reps * 3);
    const exerciseBlockSec = numSets * (exTimeSec + restSec);

    // If adding this exercise exceeds max ceiling and we already reached min count, stop
    if (totalSec + exerciseBlockSec > maxTotalSec && selected.length >= effectiveMin) {
      continue;
    }

    selected.push({
      id: ex.id,
      name: ex.name_en,
      description: ex.description_en || '',
      image: resolveImage(ex.images),
      primaryMuscles: ex.primary_muscles || [],
      bodyPart: ex.body_part || '',
      sets: numSets,
      reps: reps,
      timeSec: exTimeSec,
      restSec: restSec,
    });

    totalSec += exerciseBlockSec;

    // Check if we reached a balanced workout duration
    if (totalSec >= minTargetSec && selected.length >= effectiveMin) {
      break;
    }
  }

  // Fallback: Ensure at least one exercise is selected
  if (selected.length === 0 && shuffled.length > 0) {
    const ex = shuffled[0];
    const reps = estimateReps(ex, level);
    const exTimeSec = Math.max(20, reps * 3);
    selected.push({
      id: ex.id,
      name: ex.name_en,
      description: ex.description_en || '',
      image: resolveImage(ex.images),
      primaryMuscles: ex.primary_muscles || [],
      bodyPart: ex.body_part || '',
      sets: numSets,
      reps: reps,
      timeSec: exTimeSec,
      restSec: restSec,
    });
    totalSec = numSets * (exTimeSec + restSec);
  }

  // Build flattened step sequence for the active workout player
  const steps = [];
  selected.forEach((ex, exIdx) => {
    for (let s = 1; s <= ex.sets; s++) {
      steps.push({
        exerciseIndex: exIdx,
        setIndex: s,
        totalSets: ex.sets,
        exercise: ex,
        timeSec: ex.timeSec,
        restSec: ex.restSec,
      });
    }
  });

  return {
    exercises: selected,
    steps: steps,
    totalTimeSec: totalSec,
    totalSets: steps.length,
    focusLabel: FOCUS_LABELS[focus] || focus,
    levelLabel: LEVEL_LABELS[level] || level,
  };
}
