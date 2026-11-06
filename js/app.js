// app.js
// Front‑end script that connects the HTML form with the workout generator.

import { generateWorkout } from './workout.js';

const form = document.getElementById('workout-form');
const resultSection = document.getElementById('result');
const list = document.getElementById('exercise-list');
const totalTimeP = document.getElementById('total-time');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const duration = parseInt(document.getElementById('duration').value, 10);
  const level = document.getElementById('level').value;
  try {
    const { exercises, totalTimeSec } = generateWorkout(duration, level);
    // Clear previous results
    list.innerHTML = '';
    exercises.forEach((ex) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = ex.image; // assumes image file is in same folder
      img.alt = ex.name;
      const info = document.createElement('div');
      info.innerHTML = `<strong>${ex.name}</strong><br>${ex.description}<br>Repetições: ${ex.reps}`;
      li.appendChild(img);
      li.appendChild(info);
      list.appendChild(li);
    });
    totalTimeP.textContent = `Tempo total estimado: ${Math.round(totalTimeSec / 60)} min ${totalTimeSec % 60} seg`;
    resultSection.hidden = false;
  } catch (err) {
    alert(err.message);
  }
});
