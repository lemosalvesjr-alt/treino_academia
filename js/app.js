// app.js
// Front-end controller for the Treino Academia PWA.
// Fetches exercise data via fetch(), drives the UI screens, workout player, and history.

import { generateWorkout } from './workout.js';
import { createTimer } from './timer.js';

// ── State ──────────────────────────────────────────────
let allExercises = [];
let currentWorkout = null;  // { exercises, totalTimeSec, focusLabel, levelLabel }
let currentIndex = 0;
let isResting = false;
let timer = null;

// Selected options
let selectedDuration = 20;
let selectedLevel = 'iniciante';
let selectedFocus = 'corpo-inteiro';

// ── DOM References ─────────────────────────────────────
const $ = (id) => document.getElementById(id);

const screens = {
  loading: $('loading-screen'),
  setup: $('setup-screen'),
  preview: $('preview-screen'),
  workout: $('workout-screen'),
  completion: $('completion-screen'),
  history: $('history-screen'),
};

const bottomNav = $('bottom-nav');

// Setup screen
const durationChips = $('duration-chips');
const levelChips = $('level-chips');
const focusChips = $('focus-chips');
const btnGenerate = $('btn-generate');

// Preview screen
const previewCount = $('preview-count');
const previewTime = $('preview-time');
const previewFocus = $('preview-focus');
const exerciseList = $('exercise-list');
const btnStartWorkout = $('btn-start-workout');
const btnBackSetup = $('btn-back-setup');

// Workout screen
const workoutProgress = $('workout-progress');
const workoutCounter = $('workout-counter');
const workoutImg = $('workout-img');
const workoutName = $('workout-name');
const workoutDetail = $('workout-detail');
const timerRingFill = $('timer-ring-fill');
const timerSeconds = $('timer-seconds');
const timerLabel = $('timer-label');
const btnPrev = $('btn-prev');
const btnPlayPause = $('btn-play-pause');
const btnNext = $('btn-next');
const btnStopWorkout = $('btn-stop-workout');

// Completion screen
const compExercises = $('comp-exercises');
const compTime = $('comp-time');
const compFocus = $('comp-focus');
const compLevel = $('comp-level');
const btnNewWorkout = $('btn-new-workout');

// History screen
const historyContent = $('history-content');
const btnClearHistory = $('btn-clear-history');

// Timer ring circumference
const RING_CIRCUMFERENCE = 2 * Math.PI * 54; // r=54

// ── Screen Management ──────────────────────────────────
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });

  // Hide bottom nav during active workout
  if (name === 'workout') {
    bottomNav.classList.add('hidden');
  } else {
    bottomNav.classList.remove('hidden');
  }

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach((btn) => {
    const target = btn.dataset.screen;
    btn.classList.toggle('active', target === name + '-screen');
  });
}

// ── Chip Selection ─────────────────────────────────────
function initChipGroup(container, onChange) {
  container.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    container.querySelectorAll('.chip').forEach((c) => c.classList.remove('selected'));
    chip.classList.add('selected');
    onChange(chip.dataset.value);
  });
}

// ── Focus label mapping ────────────────────────────────
const focusLabels = {
  'corpo-inteiro': 'Corpo Inteiro',
  'superiores': 'Superiores',
  'core': 'Core',
  'inferiores': 'Inferiores',
};

const levelLabels = {
  'iniciante': 'Iniciante',
  'intermediario': 'Intermediário',
  'avancado': 'Avançado',
};

// ── Muscle name beautifier ─────────────────────────────
function formatMuscle(muscle) {
  return muscle.replace(/_/g, ' ');
}

// ── Initialize ─────────────────────────────────────────
async function init() {
  try {
    const resp = await fetch('./data/exercises.json');
    if (!resp.ok) throw new Error('Failed to load exercises');
    const data = await resp.json();
    allExercises = data.exercises;
  } catch (err) {
    console.error('Error loading exercises:', err);
    screens.loading.querySelector('.loading-screen').innerHTML =
      '<p style="color:var(--red);font-size:0.9rem;">Erro ao carregar exercícios.<br>Verifique sua conexão.</p>';
    return;
  }

  // Wire up chip groups
  initChipGroup(durationChips, (v) => { selectedDuration = parseInt(v, 10); });
  initChipGroup(levelChips, (v) => { selectedLevel = v; });
  initChipGroup(focusChips, (v) => { selectedFocus = v; });

  // Buttons
  btnGenerate.addEventListener('click', handleGenerate);
  btnStartWorkout.addEventListener('click', handleStartWorkout);
  btnBackSetup.addEventListener('click', () => showScreen('setup'));
  btnPlayPause.addEventListener('click', handlePlayPause);
  btnPrev.addEventListener('click', handlePrev);
  btnNext.addEventListener('click', handleNext);
  btnStopWorkout.addEventListener('click', handleStopWorkout);
  btnNewWorkout.addEventListener('click', () => showScreen('setup'));
  btnClearHistory.addEventListener('click', handleClearHistory);

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      if (target === 'history-screen') {
        renderHistory();
        showScreen('history');
      } else {
        showScreen('setup');
      }
    });
  });

  // Show setup
  showScreen('setup');
}

// ── Generate Workout ───────────────────────────────────
function handleGenerate() {
  try {
    currentWorkout = generateWorkout(allExercises, selectedDuration, selectedLevel, selectedFocus);
  } catch (err) {
    alert(err.message);
    return;
  }

  if (currentWorkout.exercises.length === 0) {
    alert('Nenhum exercício encontrado para essa combinação. Tente outro foco ou nível.');
    return;
  }

  // Fill preview
  previewCount.textContent = currentWorkout.exercises.length;
  previewTime.textContent = Math.round(currentWorkout.totalTimeSec / 60);
  previewFocus.textContent = focusLabels[selectedFocus] || selectedFocus;

  // Render exercise cards
  exerciseList.innerHTML = '';
  currentWorkout.exercises.forEach((ex) => {
    const li = document.createElement('li');
    li.className = 'exercise-card';
    li.innerHTML = `
      <img class="exercise-card-img" src="${ex.image}" alt="${ex.name}"
           onerror="this.src='assets/illustrations/pushup.svg'" loading="lazy" />
      <div class="exercise-card-info">
        <div class="exercise-card-name">${ex.name}</div>
        <div class="exercise-card-meta">
          <span>⏱ ${ex.timeSec}s</span>
          <span>🔄 ${ex.reps} reps</span>
          <span>😮‍💨 ${ex.restSec}s desc.</span>
        </div>
        <div class="exercise-card-muscles">
          ${ex.primaryMuscles.map((m) => `<span class="muscle-tag">${formatMuscle(m)}</span>`).join('')}
        </div>
      </div>
    `;
    exerciseList.appendChild(li);
  });

  showScreen('preview');
}

// ── Start Active Workout ───────────────────────────────
function handleStartWorkout() {
  currentIndex = 0;
  isResting = false;
  showScreen('workout');
  loadExercise(currentIndex);
}

function loadExercise(index) {
  if (timer) timer.destroy();

  const ex = currentWorkout.exercises[index];
  const total = currentWorkout.exercises.length;

  // Update progress
  workoutProgress.style.width = `${((index) / total) * 100}%`;
  workoutCounter.textContent = `Exercício ${index + 1} de ${total}`;

  // Update exercise info
  workoutImg.src = ex.image;
  workoutImg.alt = ex.name;
  workoutImg.onerror = function () { this.src = 'assets/illustrations/pushup.svg'; };
  workoutName.textContent = ex.name;
  workoutDetail.textContent = `${ex.reps} repetições • ${formatMuscle(ex.primaryMuscles[0] || ex.bodyPart)}`;

  // Setup timer for exercise phase
  isResting = false;
  timerLabel.textContent = 'EXERCÍCIO';
  timerLabel.classList.remove('rest-label');
  timerRingFill.classList.remove('rest');

  timer = createTimer(ex.timeSec, onTimerTick, onExerciseComplete);

  // Update buttons
  btnPrev.disabled = index === 0;
  btnPlayPause.textContent = '▶';

  // Auto-start
  timer.resume();
  btnPlayPause.textContent = '⏸';
}

function onTimerTick(remaining, total) {
  timerSeconds.textContent = remaining;
  const offset = RING_CIRCUMFERENCE * (1 - remaining / total);
  timerRingFill.style.strokeDashoffset = offset;
}

function onExerciseComplete() {
  const ex = currentWorkout.exercises[currentIndex];

  if (!isResting) {
    // Start rest period
    isResting = true;
    timerLabel.textContent = 'DESCANSO';
    timerLabel.classList.add('rest-label');
    timerRingFill.classList.add('rest');

    timer = createTimer(ex.restSec, onTimerTick, onExerciseComplete);
    timer.resume();
    btnPlayPause.textContent = '⏸';
  } else {
    // Rest is over, move to next exercise
    if (currentIndex < currentWorkout.exercises.length - 1) {
      currentIndex++;
      loadExercise(currentIndex);
    } else {
      // Workout complete!
      handleWorkoutComplete();
    }
  }
}

// ── Workout Controls ───────────────────────────────────
function handlePlayPause() {
  if (!timer) return;
  if (timer.isPaused()) {
    timer.resume();
    btnPlayPause.textContent = '⏸';
  } else {
    timer.pause();
    btnPlayPause.textContent = '▶';
  }
}

function handlePrev() {
  if (currentIndex > 0) {
    currentIndex--;
    loadExercise(currentIndex);
  }
}

function handleNext() {
  if (currentIndex < currentWorkout.exercises.length - 1) {
    currentIndex++;
    loadExercise(currentIndex);
  } else {
    handleWorkoutComplete();
  }
}

function handleStopWorkout() {
  if (timer) timer.destroy();
  timer = null;
  showScreen('setup');
}

// ── Workout Complete ───────────────────────────────────
function handleWorkoutComplete() {
  if (timer) timer.destroy();
  timer = null;

  compExercises.textContent = currentWorkout.exercises.length;
  const mins = Math.floor(currentWorkout.totalTimeSec / 60);
  const secs = currentWorkout.totalTimeSec % 60;
  compTime.textContent = `${mins}m${secs > 0 ? secs + 's' : ''}`;
  compFocus.textContent = focusLabels[selectedFocus] || selectedFocus;
  compLevel.textContent = levelLabels[selectedLevel] || selectedLevel;

  // Save to history
  saveWorkoutToHistory({
    date: new Date().toISOString(),
    exercises: currentWorkout.exercises.length,
    totalTimeSec: currentWorkout.totalTimeSec,
    focus: focusLabels[selectedFocus] || selectedFocus,
    level: levelLabels[selectedLevel] || selectedLevel,
    duration: selectedDuration,
  });

  // Update progress bar to 100%
  workoutProgress.style.width = '100%';

  showScreen('completion');
}

// ── History (localStorage) ─────────────────────────────
const HISTORY_KEY = 'treino_academia_history';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWorkoutToHistory(entry) {
  const history = getHistory();
  history.unshift(entry); // newest first
  // Keep last 50
  if (history.length > 50) history.length = 50;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historyContent.innerHTML = `
      <div class="history-empty">
        <div class="history-empty-icon">📭</div>
        <p>Nenhum treino registrado ainda.</p>
        <p style="margin-top:4px; font-size: 0.75rem;">Complete um treino para vê-lo aqui.</p>
      </div>
    `;
    btnClearHistory.style.display = 'none';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'history-list';

  history.forEach((entry) => {
    const d = new Date(entry.date);
    const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <div class="history-item-icon">🏋️</div>
      <div class="history-item-info">
        <div class="history-item-title">${entry.focus} • ${entry.level}</div>
        <div class="history-item-meta">${dateStr} às ${timeStr} • ${entry.exercises} exercícios • ${Math.round(entry.totalTimeSec / 60)} min</div>
      </div>
    `;
    ul.appendChild(li);
  });

  historyContent.innerHTML = '';
  historyContent.appendChild(ul);
  btnClearHistory.style.display = '';
}

function handleClearHistory() {
  if (!confirm('Limpar todo o histórico de treinos?')) return;
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

// ── Boot ───────────────────────────────────────────────
init();
