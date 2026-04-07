// ============================================================
// APP.JS — MuscuTrack (ES Module)
// ============================================================
import createBodyHighlighter from 'https://esm.sh/body-highlighter@3';

const state = { sessions: [], bodyView: 'front', planningWeek: 0, charts: {}, bodyHL: null };

// ---- INIT ----
function init() {
  loadSessions();
  setupTabs();
  setupEnergySelector();
  setupForm();
  populateDataLists();
  renderProgressionTab();
  renderPlanningTab();
  renderExercisesCatalog();
  renderAddTab();
  renderScienceTab();
  updateHeaderStats();
}

// ---- STORAGE ----
function loadSessions() {
  const s = localStorage.getItem('muscu_sessions');
  state.sessions = s ? JSON.parse(s) : JSON.parse(JSON.stringify(INITIAL_SESSIONS));
  if (!s) saveSessions();
}
function saveSessions() { localStorage.setItem('muscu_sessions', JSON.stringify(state.sessions)); }

// ---- TABS ----
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const id = 'tab-' + btn.dataset.tab;
      document.getElementById(id).classList.add('active');
      if (btn.dataset.tab === 'progression') refreshProgressionCharts();
      if (btn.dataset.tab === 'science') renderBodyModel();
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
function updateHeaderStats() { document.getElementById('stat-sessions').textContent = state.sessions.length; }
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); }

// ---- UTILS ----
function computeVolumeByGroup() {
  const vol = {}, recent = state.sessions.slice(-6);
  const span = Math.max(1, (() => { if (recent.length < 2) return 1; const d = recent.map(s => new Date(s.date)); return Math.max(1, (Math.max(...d) - Math.min(...d)) / (7*864e5)); })());
  recent.forEach(s => s.exercises.forEach(ex => { vol[ex.group] = (vol[ex.group]||0) + ex.series; }));
  Object.keys(vol).forEach(g => { vol[g] = Math.round(vol[g] / span * 10) / 10; });
  return vol;
}
function computeTotalVolumeByGroup() {
  const vol = {};
  state.sessions.forEach(s => s.exercises.forEach(ex => { vol[ex.group] = (vol[ex.group]||0) + ex.series * ex.reps * ex.charge; }));
  return vol;
}
function getExerciseProgression(name) {
  const d = [];
  state.sessions.forEach(s => s.exercises.forEach(ex => { if (ex.name === name) d.push({ date: s.date, charge: ex.charge, reps: ex.reps, series: ex.series, ressenti: ex.ressenti }); }));
  return d;
}
function getAllExerciseNames() { const n = new Set(); state.sessions.forEach(s => s.exercises.forEach(ex => n.add(ex.name))); return [...n].sort(); }
function getMaxCharges() { const m = {}; state.sessions.forEach(s => s.exercises.forEach(ex => { if (!m[ex.name] || ex.charge > m[ex.name]) m[ex.name] = ex.charge; })); return m; }
function fmtDate(d) { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }); }
function fmtDateFull(d) { return new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); }
function getExercisesForMuscle(muscleId) {
  const groups = MUSCLE_TO_GROUPS[muscleId] || [], out = [];
  state.sessions.forEach(s => { s.exercises.forEach(ex => { if (groups.includes(ex.group)) out.push({ ...ex, date: s.date, sessionId: s.id }); }); });
  return out;
}

// ============================================================
// BODY MODEL (in Science tab)
// ============================================================
function buildBodyData() {
  const vol = computeVolumeByGroup(), data = [];
  ['chest','abs','obliques','front-deltoids','biceps','forearm','quadriceps','adductors','abductors','upper-back','lower-back','trapezius','back-deltoids','triceps','hamstring','calves','gluteal'].forEach(m => {
    let tv = 0, tg = 0;
    Object.entries(GROUP_TO_MUSCLES).forEach(([g, ms]) => { if (ms.includes(m)) { tv += vol[g]||0; tg = Math.max(tg, VOLUME_TARGETS[g]||10); } });
    const r = tg > 0 ? tv / tg : 0;
    let f = 0; if (r > .05) f = 1; if (r > .35) f = 2; if (r > .6) f = 3; if (r > .85) f = 4;
    if (f > 0) data.push({ name: m, muscles: [m], frequency: f });
  });
  return data;
}
function renderBodyModel() {
  const c = document.getElementById('body-model-root');
  if (!c) return;
  const data = buildBodyData(), type = state.bodyView === 'front' ? 'anterior' : 'posterior';
  if (state.bodyHL) { state.bodyHL.update({ data, type }); }
  else {
    c.innerHTML = '';
    state.bodyHL = createBodyHighlighter({ container: c, data, type, style: { width: '100%', maxWidth: '280px', margin: '0 auto' }, bodyColor: '#d1d5db', highlightedColors: ['#c7d2fe','#818cf8','#6366f1','#4338ca'], onClick: ({ muscle }) => { if (muscle) openMusclePanel(muscle); } });
  }
}
function renderBodyLegend() {
  const el = document.getElementById('body-legend'); if (!el) return;
  el.innerHTML = [{ l: 'Faible', c: '#c7d2fe' },{ l: 'Moyen', c: '#818cf8' },{ l: 'Bon', c: '#6366f1' },{ l: 'Optimal', c: '#4338ca' }].map(i => `<div class="body-legend-item"><div class="body-legend-swatch" style="background:${i.c}"></div><span>${i.l}</span></div>`).join('');
}
function setupBodyToggle() {
  document.getElementById('body-toggle')?.addEventListener('click', e => {
    const btn = e.target.closest('.seg-btn'); if (!btn) return;
    document.querySelectorAll('#body-toggle .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.bodyView = btn.dataset.view;
    renderBodyModel();
  });
}

// ============================================================
// MUSCLE PANEL (no GIFs, just exercise list + history)
// ============================================================
function openMusclePanel(muscleId) {
  const guide = MUSCLE_GUIDES[muscleId]; if (!guide) return;
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');
  const prioLabel = { critical: 'Priorite critique', high: 'Priorite haute', medium: 'Priorite moyenne', maintenance: 'Maintenance', low: 'Priorite basse' }[guide.priority] || '';
  const prioColor = { critical: 'background:#fce7f3;color:#e11d48', high: 'background:rgba(255,149,0,.1);color:#ff9500', medium: 'background:rgba(88,86,214,.08);color:#5856d6', maintenance: 'background:rgba(0,0,0,.04);color:#636366', low: 'background:rgba(0,0,0,.03);color:#aeaeb2' }[guide.priority] || '';

  // Exercises list
  const exList = (guide.exercises || []).map(ex =>
    `<div class="panel-exo-tag"><span style="flex:1">${ex.name}</span><span>${ex.sets}</span></div>`
  ).join('') || '<p class="text-muted text-sm">Pas d\'exercice direct.</p>';

  // History
  const histHTML = buildMuscleHistory(muscleId);
  const subdivHTML = buildSubdivisions(muscleId);

  panel.innerHTML = `
    <div class="panel-handle"></div>
    <button class="panel-close" id="pc">\u2715</button>
    <h2>${guide.title}</h2>
    <span class="panel-priority" style="${prioColor}">${prioLabel}</span>
    ${subdivHTML}
    ${histHTML}
    <div class="panel-section"><h3>Anatomie</h3><p>${guide.anatomy}</p></div>
    <div class="panel-section"><h3>Pourquoi</h3><p>${guide.why}</p></div>
    <div class="panel-section"><h3>Volume cible</h3><p>${guide.volumeTarget}</p></div>
    <div class="panel-section"><h3>Exercices recommandes</h3><div class="panel-exo-list">${exList}</div></div>
    ${guide.avoid ? `<div class="panel-avoid"><strong>A eviter :</strong> ${guide.avoid}</div>` : ''}
  `;
  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active');
  overlay.onclick = closePanel;
  setupPanelDrag(panel);
  setTimeout(() => renderMusclePanelChart(muscleId), 100);
}

function buildMuscleHistory(muscleId) {
  const exercises = getExercisesForMuscle(muscleId);
  if (!exercises.length) return '<div class="panel-section"><h3>Historique</h3><p class="text-muted text-sm">Aucune donnee.</p></div>';
  const byName = {};
  exercises.forEach(ex => { if (!byName[ex.name]) byName[ex.name] = []; byName[ex.name].push(ex); });
  const totalSets = exercises.reduce((s, e) => s + e.series, 0);
  const nbSess = new Set(exercises.map(e => e.sessionId)).size;
  const rows = Object.entries(byName).map(([name, entries]) => {
    const f = entries[0].charge, l = entries[entries.length-1].charge;
    const pct = f > 0 ? Math.round(((l-f)/f)*100) : 0;
    return { name, f, l, pct, count: entries.length };
  }).sort((a,b) => b.count - a.count);

  return `<div class="panel-section"><h3>Historique</h3>
    <div style="display:flex;gap:10px;margin-bottom:10px">
      <div style="flex:1;text-align:center;padding:10px;background:rgba(0,0,0,.03);border-radius:10px"><div style="font-size:1.2rem;font-weight:700;color:var(--accent)">${nbSess}</div><div class="text-xs text-muted">Seances</div></div>
      <div style="flex:1;text-align:center;padding:10px;background:rgba(0,0,0,.03);border-radius:10px"><div style="font-size:1.2rem;font-weight:700;color:var(--accent)">${totalSets}</div><div class="text-xs text-muted">Series</div></div>
    </div>
    <canvas id="muscle-panel-chart" style="width:100%;max-height:160px;margin-bottom:10px"></canvas>
    <div class="table-scroll"><table class="progress-table"><thead><tr><th>Exercice</th><th>Debut</th><th>Actuel</th><th>Prog</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.name}</td><td>${r.f}kg</td><td>${r.l}kg</td><td><span class="badge ${r.pct>0?'badge-green':r.pct<0?'badge-red':'badge-gray'}">${r.pct>0?'+':''}${r.pct}%</span></td></tr>`).join('')}</tbody></table></div>
  </div>`;
}

function renderMusclePanelChart(muscleId) {
  const canvas = document.getElementById('muscle-panel-chart'); if (!canvas) return;
  const exercises = getExercisesForMuscle(muscleId);
  const byName = {}; exercises.forEach(ex => { if (!byName[ex.name]) byName[ex.name] = []; byName[ex.name].push(ex); });
  const top = Object.entries(byName).sort((a,b) => b[1].length - a[1].length).slice(0, 3);
  const colors = ['#5856d6','#ff9500','#34c759'];
  const allDates = [...new Set(exercises.map(e => e.date))].sort();
  new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: allDates.map(fmtDate), datasets: top.map(([name, entries], i) => ({ label: name.length > 18 ? name.substring(0,16)+'...' : name, data: entries.map(p => ({ x: fmtDate(p.date), y: p.charge })), borderColor: colors[i], borderWidth: 2, fill: false, tension: .3, pointRadius: 3, pointBackgroundColor: colors[i] })) },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, scales: { x: { grid: { display: false }, ticks: { color: '#aeaeb2', font: { size: 9 } } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2', font: { size: 10 } } } }, plugins: { legend: { labels: { color: '#636366', font: { size: 10 }, usePointStyle: true } }, tooltip: { animation: { duration: 100 } } } }
  });
}

function buildSubdivisions(muscleId) {
  const s = MUSCLE_SUBDIVISIONS[muscleId]; if (!s) return '';
  const allEx = getExercisesForMuscle(muscleId), byN = {};
  allEx.forEach(ex => { byN[ex.name] = (byN[ex.name]||0) + ex.series; });
  return `<div class="panel-section"><h3>Portions — ${s.name}</h3>${s.portions.map(p => {
    const sets = p.exercises.reduce((sum, e) => sum + (byN[e]||0), 0);
    const matched = p.exercises.filter(e => byN[e]);
    return `<div class="subdiv-card"><div class="subdiv-header"><span class="subdiv-name">${p.name}</span><span class="subdiv-sets">${sets} series</span></div><div class="subdiv-bar-bg"><div class="subdiv-bar" style="width:${Math.min(100,sets*3)}%"></div></div>${matched.length ? `<div class="subdiv-tags">${matched.map(e=>`<span class="subdiv-tag">${e}</span>`).join('')}</div>` : '<span class="text-xs text-muted">Pas encore travaille</span>'}</div>`;
  }).join('')}</div>`;
}

function closePanel() {
  document.getElementById('panel').classList.remove('active');
  document.getElementById('panel-overlay').classList.remove('active');
}

function setupPanelDrag(panel) {
  let startY = 0, curY = 0, dragging = false;
  panel.addEventListener('touchstart', e => { if (panel.scrollTop > 5) return; startY = e.touches[0].clientY; dragging = true; panel.style.transition = 'none'; }, { passive: true });
  panel.addEventListener('touchmove', e => { if (!dragging) return; curY = e.touches[0].clientY; const d = curY - startY; if (d > 0) panel.style.transform = `translateY(${d}px)`; }, { passive: true });
  panel.addEventListener('touchend', () => { if (!dragging) return; dragging = false; panel.style.transition = ''; if (curY - startY > 80) closePanel(); else { panel.style.transform = ''; panel.classList.add('active'); } startY = 0; curY = 0; });
}

// ============================================================
// EXERCISES CATALOG
// ============================================================
function renderExercisesCatalog() {
  const container = document.getElementById('exercises-catalog');
  // Get unique exercises from all 3 session templates
  const allExos = [];
  const seen = new Set();
  PLANNING[0].sessions.forEach(session => {
    session.exercises.forEach(ex => {
      if (!seen.has(ex.name)) { seen.add(ex.name); allExos.push({ ...ex, session: session.name }); }
    });
  });

  // Group by session
  const bySession = {};
  PLANNING[0].sessions.forEach(session => {
    bySession[session.name] = session.exercises;
  });

  let html = '';
  Object.entries(bySession).forEach(([sessionName, exercises]) => {
    const typeColors = { 'Session A': '#5856d6', 'Session B': '#ff9500', 'Session C': '#34c759' };
    const color = Object.entries(typeColors).find(([k]) => sessionName.includes(k))?.[1] || '#5856d6';
    html += `<div class="exo-section-title" style="color:${color}">${sessionName}</div><div class="exo-grid">`;
    exercises.forEach(ex => {
      html += `<div class="exo-item" data-exo="${encodeURIComponent(JSON.stringify(ex))}">
        <div class="exo-item-info"><div class="exo-item-name">${ex.name}</div><div class="exo-item-group">${ex.group}</div></div>
        <div class="exo-item-arrow">\u203A</div>
      </div>`;
    });
    html += '</div>';
  });
  container.innerHTML = html;

  container.querySelectorAll('.exo-item').forEach(item => {
    item.addEventListener('click', () => {
      const ex = JSON.parse(decodeURIComponent(item.dataset.exo));
      openExerciseDetail(ex);
    });
  });
}

function openExerciseDetail(ex) {
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');
  const maxC = getMaxCharges();
  const prog = getExerciseProgression(ex.name);
  const best = maxC[ex.name] ? `${maxC[ex.name]} kg` : '\u2014';

  // Get execution guide and MuscleWiki link
  const execution = EXERCISE_EXECUTION[ex.name] || '';
  const videoKey = ex.name.toLowerCase();
  const videoUrl = EXERCISE_VIDEOS[videoKey] || Object.entries(EXERCISE_VIDEOS).find(([k]) => videoKey.includes(k))?.[1] || '';

  panel.innerHTML = `
    <div class="panel-handle"></div>
    <button class="panel-close" id="pc">\u2715</button>
    <h2>${ex.name}</h2>
    <span class="panel-priority" style="background:var(--accent-bg);color:var(--accent)">${ex.group}</span>

    <div class="panel-section"><h3>Mon record</h3><p style="font-size:1.3rem;font-weight:700">${best}</p><p class="text-sm text-muted">${prog.length} entree${prog.length > 1 ? 's' : ''}</p></div>

    ${execution ? `<div class="panel-section"><h3>Execution parfaite</h3><p>${execution}</p></div>` : ''}

    ${videoUrl ? `<div class="panel-section"><a href="${videoUrl}" target="_blank" rel="noopener" class="btn-pill" style="display:inline-flex;gap:6px;align-items:center;padding:10px 16px;font-size:0.85rem">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>
      Voir sur MuscleWiki</a></div>` : ''}

    ${prog.length > 1 ? '<canvas id="exo-detail-chart" style="width:100%;max-height:160px;margin-top:12px"></canvas>' : ''}
  `;

  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active');
  overlay.onclick = closePanel;
  setupPanelDrag(panel);

  if (prog.length > 1) {
    setTimeout(() => {
      const cv = document.getElementById('exo-detail-chart'); if (!cv) return;
      new Chart(cv.getContext('2d'), {
        type: 'line',
        data: { labels: prog.map(p => fmtDate(p.date)), datasets: [{ label: 'Charge', data: prog.map(p => p.charge), borderColor: '#5856d6', backgroundColor: 'rgba(88,86,214,.08)', borderWidth: 2, fill: true, tension: .3, pointRadius: 3, pointBackgroundColor: '#5856d6' }] },
        options: { responsive: true, maintainAspectRatio: false, animation: { duration: 500 }, scales: { x: { grid: { display: false }, ticks: { color: '#aeaeb2', font: { size: 9 } } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2' } } }, plugins: { legend: { display: false } } }
      });
    }, 120);
  }
}

// ============================================================
// PROGRESSION TAB
// ============================================================
function renderProgressionTab() { renderExerciseSelect(); renderProgressionChart(); renderProgressTable(); }

function renderExerciseSelect() {
  const sel = document.getElementById('exercise-select');
  const names = getAllExerciseNames();
  sel.innerHTML = '<option value="__ALL__">Top 5</option>' + names.map(n => `<option value="${n}">${n}</option>`).join('');
  sel.addEventListener('change', () => renderProgressionChart());
}

function renderProgressionChart() {
  const selected = document.getElementById('exercise-select').value;
  if (state.charts.progression) state.charts.progression.destroy();
  const colors = ['#5856d6','#ff9500','#34c759','#ff3b30','#007aff'];
  let datasets, allLabels;

  if (selected === '__ALL__') {
    const freq = {}; state.sessions.forEach(s => s.exercises.forEach(ex => { freq[ex.name] = (freq[ex.name]||0)+1; }));
    const top5 = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5).map(e => e[0]);
    const allDates = [...new Set(state.sessions.flatMap(s => s.exercises.filter(e => top5.includes(e.name)).map(() => s.date)))].sort();
    allLabels = allDates.map(fmtDate);
    datasets = top5.map((name, i) => { const p = getExerciseProgression(name); return { label: name.length>20?name.substring(0,18)+'...':name, data: p.map(x=>({x:fmtDate(x.date),y:x.charge})), borderColor: colors[i], borderWidth: 2, fill: false, tension: .3, pointRadius: 3, pointBackgroundColor: colors[i] }; });
  } else {
    const p = getExerciseProgression(selected);
    allLabels = p.map(x => fmtDate(x.date));
    datasets = [{ label: 'Charge (kg)', data: p.map(x => x.charge), borderColor: '#5856d6', backgroundColor: 'rgba(88,86,214,.06)', borderWidth: 2.5, fill: true, tension: .3, pointBackgroundColor: '#5856d6', pointRadius: 4 }];
  }

  state.charts.progression = new Chart(document.getElementById('progression-chart').getContext('2d'), {
    type: 'line', data: { labels: allLabels, datasets },
    options: { responsive: true, animation: { duration: 600, easing: 'easeOutQuart' }, interaction: { mode: 'nearest', intersect: false },
      scales: { y: { beginAtZero: false, grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2' } }, x: { grid: { display: false }, ticks: { color: '#aeaeb2', font: { size: 9 }, maxRotation: 45 } } },
      plugins: { legend: { display: selected==='__ALL__', labels: { color: '#636366', font: { size: 10 }, usePointStyle: true } }, tooltip: { animation: { duration: 100 }, backgroundColor: '#1c1c1e', titleColor: '#fff', bodyColor: '#ccc' } } }
  });
}

function renderVolumeBarChart() {
  const vol = computeTotalVolumeByGroup(), groups = Object.keys(vol).sort((a,b) => vol[b]-vol[a]);
  if (state.charts.volumeBar) state.charts.volumeBar.destroy();
  const cmap = g => { if (g==='Delt_lat\u00e9ral') return '#ff3b30'; if (['Pectoraux','Dos_largeur','Dos_\u00e9paisseur','Delt_post\u00e9rieur'].includes(g)) return '#ff9500'; if (['Triceps','Biceps','\u00c9paules'].includes(g)) return '#5856d6'; return '#aeaeb2'; };
  state.charts.volumeBar = new Chart(document.getElementById('volume-bar-chart').getContext('2d'), {
    type: 'bar', data: { labels: groups, datasets: [{ data: groups.map(g => Math.round(vol[g])), backgroundColor: groups.map(g => cmap(g)+'25'), borderColor: groups.map(cmap), borderWidth: 1.5, borderRadius: 6 }] },
    options: { responsive: true, indexAxis: 'y', animation: { duration: 600 }, scales: { x: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { color: '#aeaeb2' } }, y: { grid: { display: false }, ticks: { color: '#636366', font: { size: 10 } } } }, plugins: { legend: { display: false } } }
  });
}

function renderProgressTable() {
  const table = document.getElementById('progress-table');
  const rows = getAllExerciseNames().map(name => {
    const p = getExerciseProgression(name); if (p.length < 2) return null;
    const pct = p[0].charge > 0 ? Math.round(((p[p.length-1].charge - p[0].charge) / p[0].charge) * 100) : 0;
    return { name, first: p[0].charge, last: p[p.length-1].charge, pct, count: p.length };
  }).filter(Boolean).sort((a,b) => b.pct - a.pct);
  table.innerHTML = `<thead><tr><th>Exercice</th><th>Debut</th><th>Actuel</th><th>Prog</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.name}</td><td>${r.first}kg</td><td>${r.last}kg</td><td><span class="badge ${r.pct>0?'badge-green':r.pct<0?'badge-red':'badge-gray'}">${r.pct>0?'+':''}${r.pct}%</span></td></tr>`).join('')}</tbody>`;
}

function refreshProgressionCharts() { renderProgressionChart(); renderProgressTable(); }

// ============================================================
// PLANNING
// ============================================================
function renderPlanningTab() { renderWeekPills(); renderPlanningWeek(); }

function renderWeekPills() {
  const c = document.getElementById('week-pills');
  c.innerHTML = PLANNING.map((w, i) => `<button class="week-pill ${i===state.planningWeek?'active':''} ${w.isDeload?'deload':''}" data-week="${i}">${w.number}</button>`).join('');
  c.addEventListener('click', e => { const p = e.target.closest('.week-pill'); if (p) { state.planningWeek = parseInt(p.dataset.week); renderPlanningTab(); document.getElementById('tab-planning').scrollTo({ top: 0, behavior: 'smooth' }); } });
}

function renderPlanningWeek() {
  const week = PLANNING[state.planningWeek], header = document.getElementById('planning-header');
  header.innerHTML = `<div class="week-nav"><button id="wp" ${state.planningWeek===0?'disabled':''}>\u2190</button><span class="week-label">Sem. ${week.number}</span><button id="wn" ${state.planningWeek===11?'disabled':''}>\u2192</button></div><span class="phase-badge phase-${week.phase.toLowerCase()}">${week.phase}${week.isDeload?' (DELOAD)':''}</span>`;
  document.getElementById('wp')?.addEventListener('click', () => { if (state.planningWeek > 0) { state.planningWeek--; renderPlanningTab(); } });
  document.getElementById('wn')?.addEventListener('click', () => { if (state.planningWeek < 11) { state.planningWeek++; renderPlanningTab(); } });

  const sc = document.getElementById('planning-sessions');
  const tc = { 'session-a': '#5856d6', 'session-b': '#ff9500', 'session-c': '#34c759' };
  sc.innerHTML = (week.isDeload ? '<div class="deload-banner">Semaine de decharge — charges -40%, 2 series. Focus technique.</div>' : '') +
    week.sessions.map((s, si) => `<div class="session-card" style="border-left-color:${tc[s.type]}">
      <div class="session-card-header"><h3>${s.name}</h3><span class="session-date">${s.dayName} ${fmtDate(s.date)}</span></div>
      ${s.exercises.map(ex => `<div class="session-exercise-row"><span class="session-exercise-name">${ex.name}</span><span class="session-exercise-sets">${ex.sets}</span><span class="session-exercise-focus">${ex.focus.substring(0,60)}${ex.focus.length>60?'...':''}</span></div>`).join('')}
      <div style="margin-top:10px;text-align:right"><button class="btn-pill prepare-btn" data-w="${state.planningWeek}" data-s="${si}">Preparer</button></div>
    </div>`).join('');

  sc.querySelectorAll('.prepare-btn').forEach(btn => {
    btn.addEventListener('click', () => prepareSession(PLANNING[parseInt(btn.dataset.w)].sessions[parseInt(btn.dataset.s)]));
  });
}

// ============================================================
// ADD SESSION
// ============================================================
function renderAddTab() {
  document.getElementById('f-session-num').value = state.sessions.length + 1;
  document.getElementById('f-session-date').value = new Date().toISOString().split('T')[0];
  renderSessionHistory();
  addExerciseRow();
}

function setupEnergySelector() {
  const c = document.getElementById('energy-selector');
  c.innerHTML = [1,2,3,4,5].map(v => `<button type="button" class="energy-btn ${v===3?'active':''}" data-value="${v}">${v}</button>`).join('');
  c.addEventListener('click', e => { const b = e.target.closest('.energy-btn'); if (b) { c.querySelectorAll('.energy-btn').forEach(x => x.classList.remove('active')); b.classList.add('active'); } });
}

let exRowCount = 0;

function addExerciseRow(prefill) {
  exRowCount++;
  const list = document.getElementById('exercises-form-list'), div = document.createElement('div');
  div.className = 'exercise-form-item';
  const pN = prefill?.name||'', pG = prefill?.group||'', pC = prefill?.charge||'', pS = prefill?.series||3, pR = prefill?.reps||10;
  div.innerHTML = `<button type="button" class="exercise-form-remove">\u2715</button>
    <div class="form-group"><label class="form-label">Exercice</label><input type="text" class="form-input ex-name" list="exercise-names" placeholder="Ex: Chest Press" value="${pN}"></div>
    <input type="hidden" class="ex-group" value="${pG}">
    <div class="form-group"><label class="form-label">Charge (kg)</label><input type="number" class="form-input ex-charge" min="0" step="0.5" placeholder="0" value="${pC}"></div>
    <div class="form-row-3"><div class="form-group"><label class="form-label">Series</label><input type="number" class="form-input ex-series" min="1" max="10" value="${pS}"></div><div class="form-group"><label class="form-label">Reps</label><input type="number" class="form-input ex-reps" min="1" max="50" value="${pR}"></div><div class="form-group"><label class="form-label">Ressenti</label><div class="ressenti-selector">${[1,2,3,4,5].map(v=>`<button type="button" class="ressenti-btn ${v===3?'active':''}" data-value="${v}">${v}</button>`).join('')}</div></div></div>`;
  list.appendChild(div);
  div.querySelector('.exercise-form-remove').addEventListener('click', () => div.remove());
  div.querySelectorAll('.ressenti-btn').forEach(btn => { btn.addEventListener('click', () => { div.querySelectorAll('.ressenti-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
  // Auto-fill
  const nameIn = div.querySelector('.ex-name'), groupIn = div.querySelector('.ex-group'), chargeIn = div.querySelector('.ex-charge');
  nameIn.addEventListener('change', () => {
    const n = nameIn.value.trim();
    if (EXERCISE_TO_GROUP[n]) groupIn.value = EXERCISE_TO_GROUP[n];
    const mc = getMaxCharges();
    if (mc[n] && !chargeIn.value) chargeIn.value = mc[n];
  });
}

function prepareSession(template) {
  switchTab('add');
  document.getElementById('f-session-num').value = state.sessions.length + 1;
  document.getElementById('f-session-date').value = template.date || new Date().toISOString().split('T')[0];
  document.getElementById('exercises-form-list').innerHTML = '';
  exRowCount = 0;
  const mc = getMaxCharges();
  template.exercises.forEach(ex => {
    const m = ex.sets.match(/^(\d+)[\u00d7x](\d+)/);
    addExerciseRow({ name: ex.name, group: ex.group, charge: mc[ex.name]||'', series: m?parseInt(m[1]):3, reps: m?parseInt(m[2]):10 });
  });
  showToast('Seance preparee !');
  document.getElementById('tab-add').scrollTo({ top: 0, behavior: 'smooth' });
}

function setupForm() {
  document.getElementById('btn-add-exercise').addEventListener('click', () => addExerciseRow());
  document.getElementById('session-form').addEventListener('submit', e => {
    e.preventDefault();
    const num = document.getElementById('f-session-num').value, date = document.getElementById('f-session-date').value;
    const eb = document.querySelector('#energy-selector .energy-btn.active');
    const energy = eb ? parseFloat(eb.dataset.value) : 3;
    const exercises = [];
    document.querySelectorAll('.exercise-form-item').forEach(row => {
      const name = row.querySelector('.ex-name').value.trim(), group = row.querySelector('.ex-group').value.trim() || EXERCISE_TO_GROUP[name] || '';
      const charge = parseFloat(row.querySelector('.ex-charge').value)||0, series = parseInt(row.querySelector('.ex-series').value)||3, reps = parseInt(row.querySelector('.ex-reps').value)||10;
      const rb = row.querySelector('.ressenti-btn.active');
      if (name && group) exercises.push({ name, group, charge, series, reps, ressenti: rb?parseInt(rb.dataset.value):3 });
    });
    if (!exercises.length) { showToast('Ajoutez au moins un exercice !'); return; }
    state.sessions.push({ id: 'S'+num, date, energy, exercises });
    state.sessions.sort((a,b) => a.date.localeCompare(b.date));
    saveSessions();
    document.getElementById('exercises-form-list').innerHTML = ''; exRowCount = 0; addExerciseRow();
    document.getElementById('f-session-num').value = state.sessions.length + 1;
    renderSessionHistory(); updateHeaderStats(); renderProgressionTab();
    showToast('Seance S'+num+' enregistree !');
    setTimeout(() => switchTab('progression'), 800);
  });
}

function renderSessionHistory() {
  const c = document.getElementById('sessions-history');
  const sorted = [...state.sessions].sort((a,b) => b.date.localeCompare(a.date));
  const ec = ['#ff3b30','#ff9500','#ffcc00','#34c759','#007aff'];
  c.innerHTML = sorted.map(s => `<div class="session-history-item" data-sid="${s.id}"><div><span class="fw-600">${s.id}</span> <span class="text-muted">${fmtDate(s.date)}</span></div><div><span style="color:var(--accent)">${s.exercises.length} exos</span> <span style="color:${ec[Math.round(s.energy)-1]||'#ffcc00'}">E${s.energy}</span></div></div>`).join('');
  c.querySelectorAll('.session-history-item').forEach(item => { item.addEventListener('click', () => viewSession(item.dataset.sid)); });
}

function viewSession(id) {
  const session = state.sessions.find(s => s.id === id); if (!session) return;
  const panel = document.getElementById('panel'), overlay = document.getElementById('panel-overlay');

  const energyBtns = [1,2,3,4,5].map(v => `<button type="button" class="energy-btn edit-energy-btn ${v === Math.round(session.energy) ? 'active' : ''}" data-value="${v}">${v}</button>`).join('');
  const ressentiBtns = v => [1,2,3,4,5].map(r => `<button type="button" class="ressenti-btn edit-ressenti ${r === Math.round(v) ? 'active' : ''}" data-value="${r}">${r}</button>`).join('');

  panel.innerHTML = `<div class="panel-handle"></div><button class="panel-close" id="pc">\u2715</button>
    <h2>${session.id}</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0">
      <div class="form-group"><label class="form-label">Date</label><input type="date" class="form-input edit-date" value="${session.date}"></div>
      <div class="form-group"><label class="form-label">Energie</label><div class="energy-selector" style="gap:3px">${energyBtns}</div></div>
    </div>
    <div class="panel-section"><h3>Exercices</h3>
      ${session.exercises.map((ex, i) => `<div class="exercise-form-item" data-idx="${i}" style="margin-bottom:8px">
        <button type="button" class="exercise-form-remove edit-remove-ex" data-idx="${i}">\u2715</button>
        <div class="form-group"><label class="form-label">Exercice</label><input type="text" class="form-input edit-ex-name" list="exercise-names" value="${ex.name}"></div>
        <input type="hidden" class="edit-ex-group" value="${ex.group}">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
          <div class="form-group"><label class="form-label">Charge</label><input type="number" class="form-input edit-ex-charge" value="${ex.charge}" min="0" step="0.5"></div>
          <div class="form-group"><label class="form-label">Series</label><input type="number" class="form-input edit-ex-series" value="${ex.series}" min="1" max="10"></div>
          <div class="form-group"><label class="form-label">Reps</label><input type="number" class="form-input edit-ex-reps" value="${ex.reps}" min="1" max="50"></div>
        </div>
        <div class="form-group"><label class="form-label">Ressenti</label><div class="ressenti-selector">${ressentiBtns(ex.ressenti)}</div></div>
      </div>`).join('')}
    </div>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="btn-primary" style="flex:1" id="btn-save-edit">Sauvegarder</button>
      <button class="btn-danger" id="btn-del" style="min-height:50px">Supprimer</button>
    </div>`;

  // Energy buttons
  panel.querySelectorAll('.edit-energy-btn').forEach(btn => {
    btn.addEventListener('click', () => { panel.querySelectorAll('.edit-energy-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); });
  });
  // Ressenti buttons
  panel.querySelectorAll('.exercise-form-item').forEach(item => {
    item.querySelectorAll('.edit-ressenti').forEach(btn => {
      btn.addEventListener('click', () => { item.querySelectorAll('.edit-ressenti').forEach(b => b.classList.remove('active')); btn.classList.add('active'); });
    });
    // Auto-fill group on name change
    const nameIn = item.querySelector('.edit-ex-name'), groupIn = item.querySelector('.edit-ex-group');
    nameIn.addEventListener('change', () => { if (EXERCISE_TO_GROUP[nameIn.value.trim()]) groupIn.value = EXERCISE_TO_GROUP[nameIn.value.trim()]; });
  });
  // Remove exercise
  panel.querySelectorAll('.edit-remove-ex').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.exercise-form-item').remove());
  });
  // Save
  document.getElementById('btn-save-edit').addEventListener('click', () => {
    const newDate = panel.querySelector('.edit-date').value;
    const eb = panel.querySelector('.edit-energy-btn.active');
    const newEnergy = eb ? parseFloat(eb.dataset.value) : session.energy;
    const newExercises = [];
    panel.querySelectorAll('.exercise-form-item').forEach(item => {
      const name = item.querySelector('.edit-ex-name').value.trim();
      const group = item.querySelector('.edit-ex-group').value.trim() || EXERCISE_TO_GROUP[name] || '';
      const charge = parseFloat(item.querySelector('.edit-ex-charge').value) || 0;
      const series = parseInt(item.querySelector('.edit-ex-series').value) || 3;
      const reps = parseInt(item.querySelector('.edit-ex-reps').value) || 10;
      const rb = item.querySelector('.edit-ressenti.active');
      if (name) newExercises.push({ name, group, charge, series, reps, ressenti: rb ? parseInt(rb.dataset.value) : 3 });
    });
    session.date = newDate; session.energy = newEnergy; session.exercises = newExercises;
    state.sessions.sort((a, b) => a.date.localeCompare(b.date));
    saveSessions(); closePanel(); renderSessionHistory(); renderProgressionTab(); showToast('Seance modifiee');
  });
  // Delete
  document.getElementById('btn-del').addEventListener('click', () => { if (!confirm('Supprimer '+session.id+' ?')) return; state.sessions = state.sessions.filter(s => s.id !== id); saveSessions(); closePanel(); renderSessionHistory(); updateHeaderStats(); renderProgressionTab(); showToast('Supprimee'); });

  document.getElementById('pc').addEventListener('click', closePanel);
  overlay.classList.add('active'); panel.classList.add('active'); overlay.onclick = closePanel;
  setupPanelDrag(panel);
}

function populateDataLists() {
  document.getElementById('exercise-names').innerHTML = EXERCISE_SUGGESTIONS.map(n => `<option value="${n}">`).join('');
  document.getElementById('muscle-groups').innerHTML = MUSCLE_GROUPS.map(g => `<option value="${g}">`).join('');
}

// ============================================================
// SCIENCE
// ============================================================
function renderScienceTab() {
  const p = USER_PROFILE;
  document.getElementById('profile-grid').innerHTML = `<dt>Age</dt><dd>${p.age} ans</dd><dt>Taille</dt><dd>${p.height} cm</dd><dt>Poids</dt><dd>${p.weight} kg (depart: ${p.startWeight} kg)</dd><dt>Morpho</dt><dd>${p.morphology}</dd><dt>Objectif</dt><dd>${p.objective}</dd><dt>Calories</dt><dd>${p.nutrition.calories}</dd><dt>Proteines</dt><dd>${p.nutrition.protein}</dd><dt>Supplements</dt><dd>${p.nutrition.supplements}</dd>`;

  // Body model
  renderBodyLegend();
  setupBodyToggle();
  setTimeout(() => renderBodyModel(), 200);

  const rs = s => `<div class="science-section"><h2>${s.title}</h2>${s.points.map(pt => `<div class="science-point"><h4>${pt.title}</h4><p>${pt.text}</p>${pt.source?`<div class="science-source">${pt.source}</div>`:''}</div>`).join('')}</div>`;
  const dp = SCIENCE_CONTENT.doubleProgression;
  document.getElementById('science-content').innerHTML =
    rs(SCIENCE_CONTENT.hypertrophy) + rs(SCIENCE_CONTENT.nutrition) + rs(SCIENCE_CONTENT.recovery) +
    `<div class="science-section"><h2>${dp.title}</h2><div class="card"><ol class="progression-steps">${dp.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div></div>` +
    `<div class="science-section"><h2>Echelles</h2><div class="card"><table class="scale-table"><tr><th>Note</th><th>Ressenti</th><th>Action</th></tr>${SCIENCE_CONTENT.scales.ressenti.map(s=>`<tr><td><span class="scale-value">${s.value}</span></td><td>${s.label}</td><td class="text-muted">${s.action}</td></tr>`).join('')}</table></div><div class="card" style="margin-top:8px"><table class="scale-table"><tr><th>Note</th><th>Energie</th></tr>${SCIENCE_CONTENT.scales.energy.map(s=>`<tr><td><span class="scale-value" style="background:${s.color};color:#fff">${s.value}</span></td><td>${s.label}</td></tr>`).join('')}</table></div></div>` +
    `<div style="text-align:center;margin-top:20px"><button class="btn-ghost" id="btn-reset">Reinitialiser les donnees</button></div>`;

  document.getElementById('btn-reset')?.addEventListener('click', () => { if (confirm('Reinitialiser toutes les donnees ?')) { localStorage.removeItem('muscu_sessions'); location.reload(); } });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', init);
