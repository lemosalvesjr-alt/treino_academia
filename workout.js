// workout.js
// Generates a workout using the RepDB free dataset (bodyweight exercises).
// Falls back to placeholder SVG images if no image is provided.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load RepDB free tier exercises
const repdbPath = path.resolve(__dirname, 'repdb', 'exercises.json');
const repdbData = JSON.parse(fs.readFileSync(repdbPath, 'utf8'));
const allExercises = repdbData.exercises;

/**
 * Map Portuguese level to RepDB difficulty string.
 */
const levelMap = {
  iniciante: 'beginner',
  intermediario: 'intermediate',
  avancado: 'advanced',
};

function filterByLevel(level) {
  const difficulty = levelMap[level];
  return allExercises.filter((ex) => {
    return ex.is_bodyweight === true && ex.difficulty && ex.difficulty.toLowerCase() === difficulty;
  });
}

/**
 * Generate a workout plan.
 * @param {number} durationMinutes - integer between 5 and 60 inclusive
 * @param {string} level - 'iniciante' | 'intermediario' | 'avancado'
 * @returns {{exercises: Array, totalTimeSec: number}}
 */
export function generateWorkout(durationMinutes, level) {
  if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 60) {
    throw new Error('Duração deve ser um inteiro entre 5 e 60 minutos.');
  }
  const validLevels = ['iniciante', 'intermediario', 'avancado'];
  if (!validLevels.includes(level)) {
    throw new Error('Nível inválido.');
  }

  const pool = filterByLevel(level);
  if (pool.length === 0) {
    throw new Error('Nenhum exercício de peso corporal disponível para o nível escolhido.');
  }

  // Shuffle pool
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const maxTotalSec = Math.floor(durationMinutes * 60 * 1.1); // 110% tolerance
  const selected = [];
  let totalSec = 0;

  for (const ex of shuffled) {
    // Estimate time: try to use MET (if present) otherwise default 30s per exercise.
    const baseSec = ex.met ? Math.round(ex.met * 60) : 30;
    const exTime = baseSec + 15; // add 15s rest
    if (totalSec + exTime > maxTotalSec) continue;
    // Resolve image path – buscar qualquer campo .webp dentro de ex.images.
    let imgPath = '';
    if (ex.images) {
      const findWebp = (obj) => {
        if (typeof obj === 'string' && obj.toLowerCase().endsWith('.webp')) return obj;
        if (obj && typeof obj === 'object') {
          for (const k of Object.keys(obj)) {
            const r = findWebp(obj[k]);
            if (r) return r;
          }
        }
        return '';
      };
      imgPath = findWebp(ex.images);
    }
    if (imgPath) {
      // Prefixa com a pasta repdb para que o servidor encontre o arquivo.
      imgPath = path.join('repdb', imgPath).replace(/\\/g, '/');
    } else {
      // fallback para SVG local.
      imgPath = `${ex.id}.svg`;
    }
    selected.push({
      id: ex.id,
      name: ex.name_pt || ex.name_en,
      description: ex.description_pt || ex.description_en,
      image: imgPath,
      reps: ex.base_reps || '-',
      timeSec: baseSec,
    });
    totalSec += exTime;
    if (totalSec >= durationMinutes * 60 * 0.9) break;
  }

  return { exercises: selected, totalTimeSec: totalSec };
}
