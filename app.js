// ============================================================
// APP.JS — MuscuTrack V2 (ES Module)
// ============================================================
import createBodyHighlighter from 'https://esm.sh/body-highlighter@3';

const state = { sessions: [], bodyView: 'front', charts: {}, bodyHL: null };

// ---- SUPABASE ----
let supabase = null;
try {
  if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_KEY !== 'undefined' && SUPABASE_URL && SUPABASE_KEY) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch(e) { /* config.js missing or invalid */ }

async function syncFromSupabase() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('sessions').select('*').order('date', { ascending: true });
    if (error) return;
    if (data && data.length) {
      state.sessions = data.map(row => ({ id: row.id, date: row.date, energy: row.energy, exercises: typeof row.exercises === 'string' ? JSON.parse(row.exercises) : row.exercises }));
      localStorage.setItem('muscu_sessions', JSON.stringify(state.sessions));
      renderAll();
    } else {
      // Supabase is empty — push local data up
      await pushAllToSupabase();
    }
  } catch(e) { /* silent */ }
}

async function pushAllToSupabase() {
  if (!supabase) return;
  try {
    const rows = state.sessions.map(s => ({ id: s.id, date: s.date, energy: s.energy, exercises: JSON.stringify(s.exercises) }));
    await supabase.from('sessions').upsert(rows, { onConflict: 'id' });
  } catch(e) { /* silent */ }
}

async function upsertSessionToSupabase(s) {
  if (!supabase) return;
  try {
    await supabase.from('sessions').upsert({ id: s.id, date: s.date, energy: s.energy, exercises: JSON.stringify(s.exercises) }, { onConflict: 'id' });
  } catch(e) { /* silent */ }
}

async function deleteSessionFromSupabase(id) {
  if (!supabase) return;
  try { await supabase.from('sessions').delete().eq('id', id); } catch(e) { /* silent */ }
}

// ---- INIT ----
async function init() {
  loadSessions();
  setupTabs();
  setupEnergySelector();
  setupSeanceLibre();
  setupBodyToggle();
  setupTrendSelect();
  setupVoirTout();
  populateDataLists();
  renderAll();
  await syncFromSupabase();
}

function renderAll() {
  renderAccueilTab();
  renderSeanceTab();
  renderEncyclopedieTab();
  updateHeaderStats();
}

// ---- STORAGE ----
function loadSessions() {
  const s = localStorage.getItem('muscu_sessions');
  state.sessions = s ? JSON.parse(s) : JSON.parse(JSON.stringify(INITIAL_SESSIONS));
  if (!s) saveSessions();
}
function saveSessions() {
  localStorage.setItem('muscu_sessions', JSON.stringify(state.sessions));
}



// ---- TABS ----
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      if (btn.dataset.tab === 'accueil') refreshAccueilCharts();
      if (btn.dataset.tab === 'encyclopedie') renderBodyModel();
      if (btn.dataset.tab === 'seance') showSeanceScreen1();
    });
  });
}
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const btn = document.querySelector(`[data-tab="${tab}"]`);
  if (btn) btn.classList.add('active');
  document.getElementById('tab-' + tab)?.classList.add('active');
}
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); }

function showCheckmark() {
  const el = document.getElementById('checkmark-overlay');
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), 700);
}

// ---- UTILS ----
function computeVolumeByGroup() {
  const vol = {}, recent = state.sessions.slice(-6);
  const span = Math.max(1, (() => { if (recent.length < 2) return 1; const d = recent.map(s => new Date(s.date)); return Math.max(1, (Math.max(...d) - Math.min(...d)) / (7*864e5)); })());
  recent.forEach(s => s.exercises.forEach(ex => { vol[ex.group] = (vol[ex.group]||0) + ex.series; }));
  Object.keys(vol).forEach(g => { vol[g] = Math.round(vol[g] / span * 10) / 10; });
  return vol;
}
function getExerciseProgression(name) {
  const d = [];
  state.sessions.forEach(s => s.exercises.forEach(ex => { if (ex.name === name) d.push({ date: s.date, charge: ex.charge, reps: ex.reps, series: ex.series, ressenti: ex.ressenti }); }));
  return d;
}
function getAllExerciseNames() { const n = new Set(); state.sessions.forEach(s => s.exercises.forEach(ex => n.add(ex.name))); return [...n].sort(); }
function getAllKnownExerciseNames() {
  const n = new Set();
  state.sessions.forEach(s => s.exercises.forEach(ex => n.add(ex.name)));
  PLANNING[0].sessions.forEach(s => s.exercises.forEach(ex => n.add(ex.name)));
  return [...n].sort();
}
function getMaxCharges() { const m = {}; state.sessions.forEach(s => s.exercises.forEach(ex => { if (!m[ex.name] || ex.charge > m[ex.name]) m[ex.name] = ex.charge; })); return m; }
function getLastPerf(name) {
  for (let i = state.sessions.length - 1; i >= 0; i--) {
    const ex = state.sessions[i].exercises.find(e => e.name === name);
    if (ex) return { charge: ex.charge, series: ex.series, reps: ex.reps, ressenti: ex.ressenti };
  }
  return null;
}
function fmtDate(d) { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function getExercisesForMuscle(muscleId) {
  const groups = MUSCLE_TO_GROUPS[muscleId] || [], out = [];
  state.sessions.forEach(s => { s.exercises.forEach(ex => { if (groups.includes(ex.group)) out.push({ ...ex, date: s.date, sessionId: s.id }); }); });
  return out;
}

// ---- FORCE INDEX (vs meilleur précédent, with detail for tooltip) ----
function computeForceIndex() {
  const bestSoFar = {}; // exercice → meilleur volume load AVANT cette séance
  return state.sessions.map(s => {
    let total = 0, count = 0;
    const details = [];
    s.exercises.forEach(ex => {
      const vol = ex.charge * ex.series * ex.reps;
      const best = bestSoFar[ex.name];
      if (best && best > 0) {
        // On a un historique → comparer au meilleur précédent
        const pct = Math.round((vol / best) * 100);
        total += pct; count++;
        details.push({ name: ex.name, vol, best, pct });
      }
      // Mettre à jour le meilleur connu (pour les séances suivantes)
      if (!bestSoFar[ex.name] || vol > bestSoFar[ex.name]) bestSoFar[ex.name] = vol;
    });
    return { date: s.date, id: s.id, index: count > 0 ? Math.round(total / count) : 100, details };
  });
}

function computeTrend(values, w) {
  return values.map((_, i) => {
    const start = Math.max(0, i - w + 1);
    let sum = 0;
    for (let j = start; j <= i; j++) sum += values[j];
    return Math.round(sum / (i - start + 1));
  });
}

// ---- NEXT SESSION ----
function getNextSessionKey() {
  if (!state.sessions.length) return 'session-a';
  const last = state.sessions[state.sessions.length - 1];
  const lastNames = new Set(last.exercises.map(e => e.name));
  const templates = [
    { key: 'session-a', names: getTemplateExerciseNames('session-a') },
    { key: 'session-b', names: getTemplateExerciseNames('session-b') },
    { key: 'session-c', names: getTemplateExerciseNames('session-c') }
  ];
  let bestMatch = 'session-a', bestScore = -1;
  templates.forEach(t => { const score = t.names.filter(n => lastNames.has(n)).length; if (score > bestScore) { bestScore = score; bestMatch = t.key; } });
  const cycle = ['session-a', 'session-b', 'session-c'];
  return cycle[(cycle.indexOf(bestMatch) + 1) % 3];
}
function getTemplateExerciseNames(typeKey) { const s = PLANNING[0].sessions.find(s => s.type === typeKey); return s ? s.exercises.map(e => e.name) : []; }

// ---- RECENT PRs ----

// ---- CHARGE SUGGESTION ----


// ============================================================
// HEADER
// ============================================================
function updateHeaderStats() {
  document.getElementById('stat-sessions').textContent = state.sessions.length;
  const label = { 'session-a': 'A', 'session-b': 'B', 'session-c': 'C' }[getNextSessionKey()] || '?';
  document.getElementById('stat-next').textContent = 'Prochaine: ' + label;
}

// ============================================================
// SHARED HISTORY RENDERER
// ============================================================
function renderHistoryInto(containerId, limit) {
  const c = document.getElementById(containerId); if (!c) return;
  const sorted = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
  const items = limit ? sorted.slice(0, limit) : sorted;
  const ec = ['#FF453A', '#FF9F0A', '#ffcc00', '#30D158', '#007aff'];
  c.innerHTML = items.map(s => `<div class="session-history-item" data-sid="${s.id}"><div><span class="fw-600">${s.id}</span> <span class="text-muted">${fmtDate(s.date)}</span></div><div><span style="color:var(--accent)">${s.exercises.length} exos</span> <span style="color:${ec[Math.round(s.energy) - 1] || '#ffcc00'}">E${s.energy}</span></div></div>`).join('');
  c.querySelectorAll('.session-history-item').forEach(item => { item.addEventListener('click', () => viewSession(item.dataset.sid)); });
}

// ============================================================
// ACCUEIL TAB
// ============================================================
function renderAccueilTab() {
  renderTrendSelect();
  renderTrendChart();
  renderNextSessionCard();
  renderHistoryInto('recent-history', 5);
  renderProgressTable();
}
function refreshAccueilCharts() { renderAccueilTab(); }

// Trend select (populated once, content updated on renderAll)
function setupTrendSelect() {
  document.getElementById('trend-select').addEventListener('change', () => renderTrendChart());
}
function renderTrendSelect() {
  const sel = document.getElementById('trend-select');
  const prev = sel.value;
  const names = getAllKnownExerciseNames();
  sel.innerHTML = '<option value="__GLOBAL__">Global</option>' + names.map(n => `<option value="${n}">${n}</option>`).join('');
  if (prev && [...sel.options].some(o => o.value === prev)) sel.value = prev;
}

// Trend chart
function renderTrendChart() {
  const sel = document.getElementById('trend-select');
  const mode = sel ? sel.value : '__GLOBAL__';
  if (state.charts.trend) state.charts.trend.destroy();
  const canvas = document.getElementById('trend-chart');
  if (!canvas) return;

  let labels, trendData, rawValues, statsHTML, trendMeta;
  const W = 4;

  if (mode === '__GLOBAL__') {
    const data = computeForceIndex();
    if (!data.length) return;
    rawValues = data.map(d => d.index);
    trendData = computeTrend(rawValues, W);
    labels = data.map(d => fmtDate(d.date));
    trendMeta = data.map((d, i) => {
      const start = Math.max(0, i - W + 1);
      const window = rawValues.slice(start, i + 1);
      return { type: 'global', id: d.id, date: d.date, raw: d.index, windowSize: window.length, windowValues: window, details: d.details };
    });
    statsHTML = `<div class="trend-stat"><span class="stat-value">${state.sessions.length}</span> séances</div>` +
      `<div class="trend-stat">Indice: <span class="stat-value">${trendData[trendData.length - 1]}</span></div>`;
  } else {
    const prog = getExerciseProgression(mode);
    if (!prog.length) { document.getElementById('trend-stats').innerHTML = ''; return; }
    rawValues = prog.map(p => p.charge * p.series * p.reps);
    trendData = computeTrend(rawValues, W);
    labels = prog.map(p => fmtDate(p.date));
    trendMeta = prog.map((p, i) => {
      const start = Math.max(0, i - W + 1);
      const window = rawValues.slice(start, i + 1);
      return { type: 'exo', date: p.date, charge: p.charge, series: p.series, reps: p.reps, vol: rawValues[i], windowSize: window.length, windowValues: window };
    });
    const last = prog[prog.length - 1];
    statsHTML = `<div class="trend-stat">Dernière: <span class="stat-value">${last.charge}kg</span></div>` +
      `<div class="trend-stat">${last.series}\u00d7${last.reps}</div>`;
  }

  state.charts.trend = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels, datasets: [{ label: 'Tendance', data: trendData, borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,.06)', borderWidth: 2.5, fill: true, tension: .4, pointRadius: 0, pointHitRadius: 10 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeOutQuart' },
      scales: { y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2', font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: '#aeaeb2', font: { size: 9 }, maxRotation: 45 } } },
      plugins: {
        legend: { display: false },
        tooltip: {
          animation: { duration: 100 },
          backgroundColor: 'rgba(28,28,30,0.95)',
          titleColor: '#fff', bodyColor: '#ccc',
          titleFont: { weight: '700', size: 12 },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            title(items) { if (!items.length) return ''; const m = trendMeta[items[0].dataIndex]; return m ? fmtDate(m.date) : items[0].label; },
            label(item) {
              const m = trendMeta[item.dataIndex]; if (!m) return `Tendance: ${item.formattedValue}`;
              const lines = [`Tendance: ${item.formattedValue}`, `Moy. mobile sur ${m.windowSize} pt${m.windowSize > 1 ? 's' : ''}`];
              if (m.type === 'global') {
                lines.push(`${m.id} — Indice brut: ${m.raw}`);
                lines.push('---');
                m.details.slice(0, 5).forEach(d => { lines.push(`${d.name.length > 20 ? d.name.substring(0,18) + '..' : d.name}: ${d.pct}% vs PR`); });
                if (m.details.length > 5) lines.push(`+ ${m.details.length - 5} autres`);
              } else {
                lines.push(`${m.charge}kg × ${m.series}×${m.reps} = ${m.vol}`);
                if (m.windowSize > 1) lines.push(`Fenêtre: ${m.windowValues.join(' → ')}`);
              }
              return lines;
            }
          }
        }
      }
    }
  });
  document.getElementById('trend-stats').innerHTML = statsHTML;
}

// Next session card
function renderNextSessionCard() {
  const container = document.getElementById('next-session-card');
  const nextKey = getNextSessionKey();
  const tmpl = SESSION_TEMPLATES.find(t => t.key === nextKey);
  const exos = getTemplateExercises(nextKey);
  container.innerHTML = `<div class="next-card" style="border-left-color:${tmpl.color}">
    <div class="next-card-top"><div class="next-card-title" style="color:${tmpl.color}">${tmpl.label}</div></div>
    <div class="next-card-sub">${tmpl.sub}</div>
    <div class="next-card-count">${exos.length} exercices</div>
    <button class="next-card-btn" style="background:${tmpl.color}" id="btn-start-next">Commencer</button>
  </div>`;
  document.getElementById('btn-start-next').addEventListener('click', () => {
    switchTab('seance');
    setTimeout(() => openSeanceScreen2(tmpl, getTemplateExercises(nextKey)), 100);
  });
}

// PR section


// Voir tout button (attached once in init)
function setupVoirTout() {
  document.getElementById('btn-voir-tout').addEventListener('click', () => openFullHistory());
}

function openFullHistory() {
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');
  const sorted = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
  const ec = ['#FF453A', '#FF9F0A', '#ffcc00', '#30D158', '#007aff'];
  panel.innerHTML = `<div class="panel-handle"></div><button class="panel-close" id="pc">\u2715</button>
    <h2>Historique complet</h2>
    <div class="sessions-history" style="max-height:none">${sorted.map(s => `<div class="session-history-item" data-sid="${s.id}"><div><span class="fw-600">${s.id}</span> <span class="text-muted">${fmtDate(s.date)}</span></div><div><span style="color:var(--accent)">${s.exercises.length} exos</span> <span style="color:${ec[Math.round(s.energy) - 1] || '#ffcc00'}">E${s.energy}</span></div></div>`).join('')}</div>`;
  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active'); overlay.onclick = closePanel;
  setupPanelDrag(panel);
  panel.querySelectorAll('.session-history-item').forEach(item => {
    item.addEventListener('click', () => { closePanel(); setTimeout(() => viewSession(item.dataset.sid), 350); });
  });
}

// Progress table (with tapable rows)
function renderProgressTable() {
  const table = document.getElementById('progress-table');
  const rows = getAllExerciseNames().map(name => {
    const p = getExerciseProgression(name); if (p.length < 2) return null;
    const pct = p[0].charge > 0 ? Math.round(((p[p.length - 1].charge - p[0].charge) / p[0].charge) * 100) : 0;
    return { name, first: p[0].charge, last: p[p.length - 1].charge, pct };
  }).filter(Boolean).sort((a, b) => b.pct - a.pct);
  table.innerHTML = `<thead><tr><th>Exercice</th><th>Début</th><th>Actuel</th><th>Prog</th></tr></thead><tbody>${rows.map(r => `<tr data-exo="${r.name}"><td>${r.name}</td><td>${r.first}kg</td><td>${r.last}kg</td><td><span class="badge ${r.pct > 0 ? 'badge-green' : r.pct < 0 ? 'badge-red' : 'badge-gray'}">${r.pct > 0 ? '+' : ''}${r.pct}%</span></td></tr>`).join('')}</tbody>`;
  table.querySelectorAll('tbody tr').forEach(tr => {
    tr.addEventListener('click', () => {
      const name = tr.dataset.exo;
      const group = EXERCISE_TO_GROUP[name] || '';
      openExerciseDetail({ name, group });
    });
  });
}

// ============================================================
// SÉANCE TAB — 2 screens
// ============================================================
const SESSION_TEMPLATES = [
  { key: 'session-a', label: 'Session A', sub: 'Full Body Intense', color: '#6C63FF' },
  { key: 'session-b', label: 'Session B', sub: 'Full Body Moyen', color: '#FF9F0A' },
  { key: 'session-c', label: 'Session C', sub: 'Full Body Léger + Jambes', color: '#30D158' }
];

function getTemplateExercises(typeKey) { const s = PLANNING[0].sessions.find(s => s.type === typeKey); return s ? s.exercises : []; }

function renderSeanceTab() {
  document.getElementById('f-session-date').value = new Date().toISOString().split('T')[0];
  renderSeanceCards();
  renderHistoryInto('sessions-history');
}

function renderSeanceCards() {
  const container = document.getElementById('seance-cards');
  container.innerHTML = SESSION_TEMPLATES.map(t => {
    const exos = getTemplateExercises(t.key);
    return `<div class="seance-card" data-session="${t.key}" style="border-left-color:${t.color}">
      <div class="seance-card-content"><div class="seance-card-title" style="color:${t.color}">${t.label}</div>
      <div class="seance-card-sub">${t.sub}</div>
      <div class="seance-card-count">${exos.length} exercices</div></div>
      <span class="seance-card-chevron">\u203A</span>
    </div>`;
  }).join('');
  container.querySelectorAll('.seance-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.session;
      openSeanceScreen2(SESSION_TEMPLATES.find(t => t.key === key), getTemplateExercises(key));
    });
  });
}

function setupSeanceLibre() {
  document.getElementById('btn-seance-libre').addEventListener('click', () => {
    openSeanceScreen2({ key: 'libre', label: 'Séance libre', sub: '', color: '#636366' }, []);
  });
}

function setupEnergySelector() {
  const c = document.getElementById('energy-selector');
  c.innerHTML = [1, 2, 3, 4, 5].map(v => `<button type="button" class="energy-btn ${v === 3 ? 'active' : ''}" data-value="${v}">${v}</button>`).join('');
  c.addEventListener('click', e => { const b = e.target.closest('.energy-btn'); if (b) { c.querySelectorAll('.energy-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); } });
}

function showSeanceScreen1() {
  const s1 = document.getElementById('seance-screen1'), s2 = document.getElementById('seance-screen2');
  s2.classList.add('hidden'); s2.classList.remove('slide-in');
  s1.style.display = ''; s1.classList.add('slide-in');
  setTimeout(() => s1.classList.remove('slide-in'), 250);
}

function openSeanceScreen2(tmpl, templateExercises) {
  const s1 = document.getElementById('seance-screen1'), s2 = document.getElementById('seance-screen2');
  document.getElementById('seance-title').textContent = tmpl.label;
  document.getElementById('seance-badge').style.background = tmpl.color;
  s1.style.display = 'none'; s2.classList.remove('hidden'); s2.classList.add('slide-in');
  setTimeout(() => s2.classList.remove('slide-in'), 250);
  renderSeanceExercises(templateExercises);
  setupSeanceScreen2Events();
}

function renderSeanceExercises(templateExercises) {
  const list = document.getElementById('seance-exercises-list'), mc = getMaxCharges();
  list.innerHTML = '';
  templateExercises.forEach(ex => {
    const m = ex.sets.match(/^(\d+)[\u00d7x](\d+)/);
    list.appendChild(createSeanceExoRow({ name: ex.name, group: ex.group || EXERCISE_TO_GROUP[ex.name] || '', charge: mc[ex.name] || '', series: m ? parseInt(m[1]) : 3, reps: m ? parseInt(m[2]) : 10, isTemplate: true }));
  });
}

function createSeanceExoRow({ name, group, charge, series, reps, isTemplate }) {
  const div = document.createElement('div');
  div.className = 'seance-exo-row';
  const ressentiBtns = [1, 2, 3, 4, 5].map(v => `<button type="button" class="ressenti-btn ${v === 3 ? 'active' : ''}" data-value="${v}">${v}</button>`).join('');
  const lp = getLastPerf(name);
  const lpText = lp ? `${lp.series}\u00d7${lp.reps} \u00b7 ${lp.charge}kg \u00b7 R${lp.ressenti}` : '';

  if (isTemplate) {
    div.innerHTML = `<div class="seance-exo-line1"><span class="seance-exo-name">${name}</span><button type="button" class="seance-exo-info-btn" data-exo-name="${name}">i</button><button type="button" class="seance-exo-remove">\u2715</button></div>
      <div class="seance-exo-line2">${lpText ? `<span>Dernière: ${lpText}</span>` : `<span>${group}</span>`}</div>
      <div class="seance-exo-line3"><input type="number" class="seance-exo-charge" inputmode="decimal" step="0.5" min="0" placeholder="kg" value="${charge}"><input type="number" class="seance-exo-field seance-series" inputmode="decimal" min="1" max="10" placeholder="S" value="${series}"><input type="number" class="seance-exo-field seance-reps" inputmode="decimal" min="1" max="50" placeholder="R" value="${reps}"><div class="seance-exo-ressenti">${ressentiBtns}</div></div>
      <input type="hidden" class="seance-exo-name-val" value="${name}"><input type="hidden" class="seance-exo-group-val" value="${group}">`;
  } else {
    div.innerHTML = `<div class="seance-exo-line1"><input type="text" class="seance-exo-name-input" list="exercise-names" placeholder="Nom de l'exercice" value="${name}"><button type="button" class="seance-exo-remove">\u2715</button></div>
      <div class="seance-exo-line2"><span>&nbsp;</span></div>
      <div class="seance-exo-line3"><input type="number" class="seance-exo-charge" inputmode="decimal" step="0.5" min="0" placeholder="kg" value="${charge}"><input type="number" class="seance-exo-field seance-series" inputmode="decimal" min="1" max="10" placeholder="S" value="${series}"><input type="number" class="seance-exo-field seance-reps" inputmode="decimal" min="1" max="50" placeholder="R" value="${reps}"><div class="seance-exo-ressenti">${ressentiBtns}</div></div>
      <input type="hidden" class="seance-exo-name-val" value="${name}"><input type="hidden" class="seance-exo-group-val" value="${group}">`;
    const nameIn = div.querySelector('.seance-exo-name-input'), groupVal = div.querySelector('.seance-exo-group-val'), nameVal = div.querySelector('.seance-exo-name-val'), chargeIn = div.querySelector('.seance-exo-charge');
    nameIn.addEventListener('change', () => { const n = nameIn.value.trim(); nameVal.value = n; if (EXERCISE_TO_GROUP[n]) groupVal.value = EXERCISE_TO_GROUP[n]; const mc = getMaxCharges(); if (mc[n] && !chargeIn.value) chargeIn.value = mc[n]; });
  }
  div.querySelector('.seance-exo-remove').addEventListener('click', () => div.remove());
  div.querySelectorAll('.ressenti-btn').forEach(btn => { btn.addEventListener('click', () => { div.querySelectorAll('.ressenti-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
  const infoBtn = div.querySelector('.seance-exo-info-btn');
  if (infoBtn) infoBtn.addEventListener('click', e => { e.stopPropagation(); openExerciseDetail({ name: infoBtn.dataset.exoName, group: group || EXERCISE_TO_GROUP[infoBtn.dataset.exoName] || '' }); });
  return div;
}

function setupSeanceScreen2Events() {
  const backBtn = document.getElementById('seance-back'), newBack = backBtn.cloneNode(true);
  backBtn.parentNode.replaceChild(newBack, backBtn);
  newBack.addEventListener('click', () => showSeanceScreen1());
  const addBtn = document.getElementById('btn-seance-add-exo'), newAdd = addBtn.cloneNode(true);
  addBtn.parentNode.replaceChild(newAdd, addBtn);
  newAdd.addEventListener('click', () => { document.getElementById('seance-exercises-list').appendChild(createSeanceExoRow({ name: '', group: '', charge: '', series: 3, reps: 10, isTemplate: false })); });
  const saveBtn = document.getElementById('btn-seance-save'), newSave = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSave, saveBtn);
  newSave.addEventListener('click', () => saveSeance());
}

function saveSeance() {
  const date = document.getElementById('f-session-date').value;
  const eb = document.querySelector('#energy-selector .energy-btn.active');
  const energy = eb ? parseFloat(eb.dataset.value) : 3;
  const exercises = [];
  document.querySelectorAll('#seance-exercises-list .seance-exo-row').forEach(row => {
    const nameInput = row.querySelector('.seance-exo-name-input');
    const name = nameInput ? nameInput.value.trim() : (row.querySelector('.seance-exo-name-val')?.value || '');
    const group = row.querySelector('.seance-exo-group-val')?.value || EXERCISE_TO_GROUP[name] || '';
    const charge = parseFloat(row.querySelector('.seance-exo-charge').value) || 0;
    const series = parseInt(row.querySelector('.seance-series').value) || 3;
    const reps = parseInt(row.querySelector('.seance-reps').value) || 10;
    const rb = row.querySelector('.ressenti-btn.active');
    if (name && group) exercises.push({ name, group, charge, series, reps, ressenti: rb ? parseInt(rb.dataset.value) : 3 });
  });
  if (!exercises.length) { showToast('Ajoutez au moins un exercice !'); return; }

  const num = state.sessions.length + 1;
  const session = { id: 'S' + num, date, energy, exercises };
  state.sessions.push(session);
  state.sessions.sort((a, b) => a.date.localeCompare(b.date));
  saveSessions();
  upsertSessionToSupabase(session);
  showCheckmark();
  setTimeout(() => {
    showSeanceScreen1();
    renderAll();
    showToast('\u2713 Séance enregistrée');
  }, 700);
}

// ============================================================
// SESSION HISTORY & EDIT
// ============================================================
function viewSession(id) {
  const session = state.sessions.find(s => s.id === id); if (!session) return;
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');
  const energyBtns = [1, 2, 3, 4, 5].map(v => `<button type="button" class="energy-btn edit-energy-btn ${v === Math.round(session.energy) ? 'active' : ''}" data-value="${v}">${v}</button>`).join('');
  const ressentiBtns = v => [1, 2, 3, 4, 5].map(r => `<button type="button" class="ressenti-btn edit-ressenti ${r === Math.round(v) ? 'active' : ''}" data-value="${r}">${r}</button>`).join('');

  panel.innerHTML = `<div class="panel-handle"></div><button class="panel-close" id="pc">\u2715</button>
    <h2>${session.id} — ${fmtDate(session.date)}</h2>
    <div style="display:flex;flex-direction:column;gap:10px;margin:10px 0">
      <input type="date" class="form-input edit-date" value="${session.date}">
      <div class="energy-selector" style="gap:6px">${energyBtns}</div>
    </div>
    <div class="panel-section"><h3>Exercices</h3>
      <div id="edit-exercises-list">
      ${session.exercises.map((ex, i) => { const lp = getLastPerf(ex.name); const lpText = lp ? `${lp.series}\u00d7${lp.reps} \u00b7 ${lp.charge}kg \u00b7 R${lp.ressenti}` : '\u2014'; return `<div class="seance-exo-row edit-exo-row" data-idx="${i}">
        <div class="seance-exo-line1">
          <input type="text" class="seance-exo-name-input edit-ex-name" list="exercise-names" value="${ex.name}">
          <button type="button" class="seance-exo-remove edit-remove-ex">\u2715</button>
        </div>
        <input type="hidden" class="edit-ex-group" value="${ex.group}">
        <div class="seance-exo-line2"><span>Dernière: ${lpText}</span></div>
        <div class="seance-exo-line3">
          <input type="number" class="seance-exo-charge edit-ex-charge" inputmode="decimal" step="0.5" min="0" placeholder="kg" value="${ex.charge}">
          <input type="number" class="seance-exo-field edit-ex-series" inputmode="decimal" min="1" max="10" placeholder="S" value="${ex.series}">
          <input type="number" class="seance-exo-field edit-ex-reps" inputmode="decimal" min="1" max="50" placeholder="R" value="${ex.reps}">
          <div class="seance-exo-ressenti">${ressentiBtns(ex.ressenti)}</div>
        </div>
      </div>`; }).join('')}
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="btn-primary" style="flex:1" id="btn-save-edit">Sauvegarder</button>
      <button class="btn-danger" id="btn-del" style="min-height:50px">Supprimer</button>
    </div>`;

  panel.querySelectorAll('.edit-energy-btn').forEach(btn => { btn.addEventListener('click', () => { panel.querySelectorAll('.edit-energy-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
  panel.querySelectorAll('.edit-exo-row').forEach(item => {
    item.querySelectorAll('.edit-ressenti').forEach(btn => { btn.addEventListener('click', () => { item.querySelectorAll('.edit-ressenti').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
    const nameIn = item.querySelector('.edit-ex-name'), groupIn = item.querySelector('.edit-ex-group'), groupLabel = item.querySelector('.edit-ex-group-label');
    nameIn.addEventListener('change', () => { const g = EXERCISE_TO_GROUP[nameIn.value.trim()]; if (g) { groupIn.value = g; groupLabel.textContent = g; } });
  });
  panel.querySelectorAll('.edit-remove-ex').forEach(btn => { btn.addEventListener('click', () => btn.closest('.edit-exo-row').remove()); });
  document.getElementById('btn-save-edit').addEventListener('click', () => {
    session.date = panel.querySelector('.edit-date').value;
    const eb2 = panel.querySelector('.edit-energy-btn.active');
    session.energy = eb2 ? parseFloat(eb2.dataset.value) : session.energy;
    const newEx = [];
    panel.querySelectorAll('.edit-exo-row').forEach(item => {
      const n = item.querySelector('.edit-ex-name').value.trim(), g = item.querySelector('.edit-ex-group').value.trim() || EXERCISE_TO_GROUP[n] || '';
      const c = parseFloat(item.querySelector('.edit-ex-charge').value) || 0, s = parseInt(item.querySelector('.edit-ex-series').value) || 3, r = parseInt(item.querySelector('.edit-ex-reps').value) || 10;
      const rb = item.querySelector('.edit-ressenti.active');
      if (n) newEx.push({ name: n, group: g, charge: c, series: s, reps: r, ressenti: rb ? parseInt(rb.dataset.value) : 3 });
    });
    session.exercises = newEx;
    state.sessions.sort((a, b) => a.date.localeCompare(b.date));
    saveSessions(); upsertSessionToSupabase(session); closePanel(); renderAll(); showToast('Séance modifiée');
  });
  document.getElementById('btn-del').addEventListener('click', () => {
    if (!confirm('Supprimer ' + session.id + ' ?')) return;
    state.sessions = state.sessions.filter(s => s.id !== id);
    saveSessions(); deleteSessionFromSupabase(id); closePanel(); renderAll(); showToast('Supprimée');
  });
  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active'); overlay.onclick = closePanel;
  setupPanelDrag(panel);
}

// ============================================================
// UNIFIED EXERCISE DETAIL PANEL
// ============================================================
function openExerciseDetail(ex) {
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');
  const maxC = getMaxCharges(), prog = getExerciseProgression(ex.name);
  const best = maxC[ex.name] ? `${maxC[ex.name]} kg` : '\u2014';
  const execution = EXERCISE_EXECUTION[ex.name] || '';
  const videoKey = ex.name.toLowerCase();
  const videoUrl = EXERCISE_VIDEOS[videoKey] || Object.entries(EXERCISE_VIDEOS).find(([k]) => videoKey.includes(k))?.[1] || '';
  const last5 = prog.slice(-5).reverse();
  const perfTable = last5.length ? `<div class="panel-section"><h3>Dernières performances</h3><table class="last-perfs-table"><thead><tr><th>Date</th><th>Charge</th><th>Séries</th><th>Ressenti</th></tr></thead><tbody>${last5.map(p => `<tr><td>${fmtDate(p.date)}</td><td>${p.charge}kg</td><td>${p.series}\u00d7${p.reps}</td><td>${p.ressenti}/5</td></tr>`).join('')}</tbody></table></div>` : '';

  panel.innerHTML = `<div class="panel-handle"></div><button class="panel-close" id="pc">\u2715</button>
    <h2>${ex.name}</h2><span class="panel-priority" style="background:var(--accent-bg);color:var(--accent)">${ex.group}</span>
    <div class="panel-section"><h3>Mon record</h3><p style="font-size:1.3rem;font-weight:700">${best}</p><p class="text-sm text-muted">${prog.length} entrée${prog.length > 1 ? 's' : ''}</p></div>
    ${prog.length > 1 ? '<canvas id="exo-detail-chart" style="width:100%;max-height:150px;margin-top:12px"></canvas>' : ''}
    ${execution ? `<div class="panel-section"><h3>Exécution parfaite</h3><p>${execution}</p></div>` : ''}
    ${videoUrl ? `<div class="panel-section"><a href="${videoUrl}" target="_blank" rel="noopener" class="btn-pill" style="display:inline-flex;gap:6px;align-items:center;padding:10px 16px;font-size:0.85rem"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>Voir sur MuscleWiki</a></div>` : ''}
    ${perfTable}`;
  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active'); overlay.onclick = closePanel;
  setupPanelDrag(panel);
  if (prog.length > 1) {
    setTimeout(() => {
      const cv = document.getElementById('exo-detail-chart'); if (!cv) return;
      new Chart(cv.getContext('2d'), {
        type: 'line',
        data: { labels: prog.map(p => fmtDate(p.date)), datasets: [{ label: 'Volume load', data: prog.map(p => p.charge * p.series * p.reps), borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,.08)', borderWidth: 2, fill: true, tension: .3, pointRadius: 3, pointBackgroundColor: '#6C63FF' }] },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, scales: { x: { grid: { display: false }, ticks: { color: '#aeaeb2', font: { size: 9 } } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2' } } }, plugins: { legend: { display: false } } }
      });
    }, 120);
  }
}

// ============================================================
// PANEL & DRAG
// ============================================================
function closePanel() { document.getElementById('panel').classList.remove('active'); document.getElementById('panel-overlay').classList.remove('active'); }
function setupPanelDrag(panel) {
  let startY = 0, curY = 0, dragging = false;
  panel.addEventListener('touchstart', e => { if (panel.scrollTop > 5) return; startY = e.touches[0].clientY; dragging = true; panel.style.transition = 'none'; }, { passive: true });
  panel.addEventListener('touchmove', e => { if (!dragging) return; curY = e.touches[0].clientY; const d = curY - startY; if (d > 0) panel.style.transform = `translateY(${d}px)`; }, { passive: true });
  panel.addEventListener('touchend', () => { if (!dragging) return; dragging = false; panel.style.transition = ''; if (curY - startY > 80) closePanel(); else { panel.style.transform = ''; panel.classList.add('active'); } startY = 0; curY = 0; });
}

// ============================================================
// BODY MODEL
// ============================================================
function buildBodyData() {
  const vol = computeVolumeByGroup(), data = [];
  ['chest', 'abs', 'obliques', 'front-deltoids', 'biceps', 'forearm', 'quadriceps', 'adductors', 'abductors', 'upper-back', 'lower-back', 'trapezius', 'back-deltoids', 'triceps', 'hamstring', 'calves', 'gluteal'].forEach(m => {
    let tv = 0, tg = 0;
    Object.entries(GROUP_TO_MUSCLES).forEach(([g, ms]) => { if (ms.includes(m)) { tv += vol[g] || 0; tg = Math.max(tg, VOLUME_TARGETS[g] || 10); } });
    const r = tg > 0 ? tv / tg : 0;
    let f = 0; if (r > .05) f = 1; if (r > .35) f = 2; if (r > .6) f = 3; if (r > .85) f = 4;
    if (f > 0) data.push({ name: m, muscles: [m], frequency: f });
  });
  return data;
}
function renderBodyModel() {
  const c = document.getElementById('body-model-root'); if (!c) return;
  const data = buildBodyData(), type = state.bodyView === 'front' ? 'anterior' : 'posterior';
  if (state.bodyHL) { state.bodyHL.update({ data, type }); }
  else { c.innerHTML = ''; state.bodyHL = createBodyHighlighter({ container: c, data, type, style: { width: '100%', maxWidth: '280px', margin: '0 auto' }, bodyColor: '#d1d5db', highlightedColors: ['#c7d2fe', '#818cf8', '#6366f1', '#4338ca'], onClick: ({ muscle }) => { if (muscle) openMusclePanel(muscle); } }); }
}
function renderBodyLegend() {
  const el = document.getElementById('body-legend'); if (!el) return;
  el.innerHTML = [{ l: 'Faible', c: '#c7d2fe' }, { l: 'Moyen', c: '#818cf8' }, { l: 'Bon', c: '#6366f1' }, { l: 'Optimal', c: '#4338ca' }].map(i => `<div class="body-legend-item"><div class="body-legend-swatch" style="background:${i.c}"></div><span>${i.l}</span></div>`).join('');
}
function setupBodyToggle() {
  document.getElementById('body-toggle')?.addEventListener('click', e => {
    const btn = e.target.closest('.seg-btn'); if (!btn) return;
    document.querySelectorAll('#body-toggle .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); state.bodyView = btn.dataset.view; renderBodyModel();
  });
}

// ============================================================
// MUSCLE PANEL
// ============================================================
function openMusclePanel(muscleId) {
  const guide = MUSCLE_GUIDES[muscleId]; if (!guide) return;
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');
  const prioLabel = { critical: 'Priorité critique', high: 'Priorité haute', medium: 'Priorité moyenne', maintenance: 'Maintenance', low: 'Priorité basse' }[guide.priority] || '';
  const prioColor = { critical: 'background:#fce7f3;color:#e11d48', high: 'background:rgba(255,159,10,.1);color:#FF9F0A', medium: 'background:rgba(108,99,255,.08);color:#6C63FF', maintenance: 'background:rgba(0,0,0,.04);color:#636366', low: 'background:rgba(0,0,0,.03);color:#aeaeb2' }[guide.priority] || '';
  const exList = (guide.exercises || []).map(ex => `<div class="panel-exo-tag"><span style="flex:1">${ex.name}</span><span>${ex.sets}</span></div>`).join('') || '<p class="text-muted text-sm">Pas d\'exercice direct.</p>';
  const histHTML = buildMuscleHistory(muscleId), subdivHTML = buildSubdivisions(muscleId);
  panel.innerHTML = `<div class="panel-handle"></div><button class="panel-close" id="pc">\u2715</button><h2>${guide.title}</h2><span class="panel-priority" style="${prioColor}">${prioLabel}</span>${subdivHTML}${histHTML}<div class="panel-section"><h3>Anatomie</h3><p>${guide.anatomy}</p></div><div class="panel-section"><h3>Pourquoi</h3><p>${guide.why}</p></div><div class="panel-section"><h3>Volume cible</h3><p>${guide.volumeTarget}</p></div><div class="panel-section"><h3>Exercices recommandés</h3><div class="panel-exo-list">${exList}</div></div>${guide.avoid ? `<div class="panel-avoid"><strong>À éviter :</strong> ${guide.avoid}</div>` : ''}`;
  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active'); overlay.onclick = closePanel;
  setupPanelDrag(panel);
  setTimeout(() => renderMusclePanelChart(muscleId), 100);
}
function buildMuscleHistory(muscleId) {
  const exercises = getExercisesForMuscle(muscleId);
  if (!exercises.length) return '<div class="panel-section"><h3>Historique</h3><p class="text-muted text-sm">Aucune donnée.</p></div>';
  const byName = {}; exercises.forEach(ex => { if (!byName[ex.name]) byName[ex.name] = []; byName[ex.name].push(ex); });
  const totalSets = exercises.reduce((s, e) => s + e.series, 0), nbSess = new Set(exercises.map(e => e.sessionId)).size;
  const rows = Object.entries(byName).map(([name, entries]) => { const f = entries[0].charge, l = entries[entries.length - 1].charge; const pct = f > 0 ? Math.round(((l - f) / f) * 100) : 0; return { name, f, l, pct, count: entries.length }; }).sort((a, b) => b.count - a.count);
  return `<div class="panel-section"><h3>Historique</h3><div style="display:flex;gap:10px;margin-bottom:10px"><div style="flex:1;text-align:center;padding:10px;background:rgba(0,0,0,.03);border-radius:10px"><div style="font-size:1.2rem;font-weight:700;color:var(--accent)">${nbSess}</div><div class="text-xs text-muted">Séances</div></div><div style="flex:1;text-align:center;padding:10px;background:rgba(0,0,0,.03);border-radius:10px"><div style="font-size:1.2rem;font-weight:700;color:var(--accent)">${totalSets}</div><div class="text-xs text-muted">Séries</div></div></div><canvas id="muscle-panel-chart" style="width:100%;max-height:160px;margin-bottom:10px"></canvas><div class="table-scroll"><table class="progress-table"><thead><tr><th>Exercice</th><th>Début</th><th>Actuel</th><th>Prog</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.name}</td><td>${r.f}kg</td><td>${r.l}kg</td><td><span class="badge ${r.pct > 0 ? 'badge-green' : r.pct < 0 ? 'badge-red' : 'badge-gray'}">${r.pct > 0 ? '+' : ''}${r.pct}%</span></td></tr>`).join('')}</tbody></table></div></div>`;
}
function renderMusclePanelChart(muscleId) {
  const canvas = document.getElementById('muscle-panel-chart'); if (!canvas) return;
  const exercises = getExercisesForMuscle(muscleId), byName = {};
  exercises.forEach(ex => { if (!byName[ex.name]) byName[ex.name] = []; byName[ex.name].push(ex); });
  const top = Object.entries(byName).sort((a, b) => b[1].length - a[1].length).slice(0, 3);
  const colors = ['#6C63FF', '#FF9F0A', '#30D158'];
  const allDates = [...new Set(exercises.map(e => e.date))].sort();
  new Chart(canvas.getContext('2d'), { type: 'line', data: { labels: allDates.map(fmtDate), datasets: top.map(([name, entries], i) => ({ label: name.length > 18 ? name.substring(0, 16) + '...' : name, data: entries.map(p => ({ x: fmtDate(p.date), y: p.charge })), borderColor: colors[i], borderWidth: 2, fill: false, tension: .3, pointRadius: 3, pointBackgroundColor: colors[i] })) }, options: { responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, scales: { x: { grid: { display: false }, ticks: { color: '#aeaeb2', font: { size: 9 } } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2', font: { size: 10 } } } }, plugins: { legend: { labels: { color: '#636366', font: { size: 10 }, usePointStyle: true } }, tooltip: { animation: { duration: 100 } } } } });
}
function buildSubdivisions(muscleId) {
  const s = MUSCLE_SUBDIVISIONS[muscleId]; if (!s) return '';
  const allEx = getExercisesForMuscle(muscleId), byN = {};
  allEx.forEach(ex => { byN[ex.name] = (byN[ex.name] || 0) + ex.series; });
  return `<div class="panel-section"><h3>Portions — ${s.name}</h3>${s.portions.map(p => { const sets = p.exercises.reduce((sum, e) => sum + (byN[e] || 0), 0); const matched = p.exercises.filter(e => byN[e]); return `<div class="subdiv-card"><div class="subdiv-header"><span class="subdiv-name">${p.name}</span><span class="subdiv-sets">${sets} séries</span></div><div class="subdiv-bar-bg"><div class="subdiv-bar" style="width:${Math.min(100, sets * 3)}%"></div></div>${matched.length ? `<div class="subdiv-tags">${matched.map(e => `<span class="subdiv-tag">${e}</span>`).join('')}</div>` : '<span class="text-xs text-muted">Pas encore travaillé</span>'}</div>`; }).join('')}</div>`;
}

// ============================================================
// ENCYCLOPÉDIE TAB
// ============================================================
function renderEncyclopedieTab() {
  renderBodyLegend();
  setTimeout(() => renderBodyModel(), 200);
  renderExercisesCatalog();
}

function renderExercisesCatalog() {
  const container = document.getElementById('exercises-catalog'), bySession = {};
  PLANNING[0].sessions.forEach(session => { bySession[session.name] = session.exercises; });
  let html = '';
  Object.entries(bySession).forEach(([sessionName, exercises]) => {
    const typeColors = { 'Session A': '#6C63FF', 'Session B': '#FF9F0A', 'Session C': '#30D158' };
    const color = Object.entries(typeColors).find(([k]) => sessionName.includes(k))?.[1] || '#6C63FF';
    html += `<div class="exo-section-title" style="color:${color}">${sessionName}</div><div class="exo-grid">`;
    exercises.forEach(ex => { html += `<div class="exo-item" data-exo="${encodeURIComponent(JSON.stringify(ex))}"><div class="exo-item-info"><div class="exo-item-name">${ex.name}</div><div class="exo-item-group">${ex.group}</div></div><div class="exo-item-arrow">\u203A</div></div>`; });
    html += '</div>';
  });
  container.innerHTML = html;
  container.querySelectorAll('.exo-item').forEach(item => { item.addEventListener('click', () => openExerciseDetail(JSON.parse(decodeURIComponent(item.dataset.exo)))); });
}


function populateDataLists() {
  document.getElementById('exercise-names').innerHTML = EXERCISE_SUGGESTIONS.map(n => `<option value="${n}">`).join('');
  document.getElementById('muscle-groups').innerHTML = MUSCLE_GROUPS.map(g => `<option value="${g}">`).join('');
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', init);
