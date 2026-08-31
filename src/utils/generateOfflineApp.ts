import { Exercise, WeightUnit, BarbellType, UserSubscription } from '../types';

export function generateStandaloneOfflineAppHtml(
  exercises: Exercise[],
  unit: WeightUnit,
  barbell: BarbellType,
  subscription: UserSubscription
): string {
  const exportedData = {
    exercises,
    unit,
    barbell,
    subscription,
    exportedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(exportedData);

  return `<!doctype html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>StrongProgress - App Offline Portátil</title>
  <meta name="theme-color" content="#09090b" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #09090b; color: #f4f4f5; }
    .plate-25 { background: #dc2626; color: #fff; }
    .plate-20 { background: #2563eb; color: #fff; }
    .plate-15 { background: #eab308; color: #000; }
    .plate-10 { background: #16a34a; color: #fff; }
    .plate-5 { background: #fafafa; color: #000; }
    .plate-2_5 { background: #27272a; color: #fff; border: 1px solid #52525b; }
    .plate-1_25 { background: #71717a; color: #fff; }
    .plate-0_5 { background: #3f3f46; color: #fff; }
  </style>
</head>
<body class="p-4 sm:p-6 max-w-5xl mx-auto min-h-screen">
  <header class="mb-6 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-black uppercase text-amber-400 tracking-wider">StrongProgress</h1>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          PRO Offline Portátil
        </span>
      </div>
      <p class="text-xs text-zinc-400">Versão autônoma com seus dados locais salvos em ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs text-zinc-400 font-bold">Unidade:</span>
      <span class="px-3 py-1 bg-amber-500 text-zinc-950 font-bold text-xs rounded-lg uppercase">${unit}</span>
    </div>
  </header>

  <!-- Floor Calculator Section -->
  <section class="mb-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
    <h2 class="text-lg font-black uppercase text-zinc-100 flex items-center gap-2">
      ⚡ Calculadora Rápida do WOD (Offline)
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="text-xs text-zinc-400 font-bold block mb-1">Selecione o Movimento:</label>
        <select id="exerciseSelect" onchange="onSelectExercise()" class="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-100 font-semibold">
        </select>
      </div>
      <div>
        <label class="text-xs text-zinc-400 font-bold block mb-1">1RM do Movimento (${unit}):</label>
        <input type="number" id="base1RMInput" oninput="calculate()" class="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-sm text-amber-400 font-black" />
      </div>
      <div>
        <label class="text-xs text-zinc-400 font-bold block mb-1">Porcentagem Desejada (%):</label>
        <div class="flex gap-2">
          <input type="number" id="percentInput" value="75" oninput="calculate()" class="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-2.5 text-sm text-zinc-100 font-black" />
          <button onclick="setPercent(60)" class="px-2.5 py-1 bg-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-700">60%</button>
          <button onclick="setPercent(75)" class="px-2.5 py-1 bg-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-700">75%</button>
          <button onclick="setPercent(85)" class="px-2.5 py-1 bg-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-700">85%</button>
        </div>
      </div>
    </div>

    <!-- Result Banner -->
    <div class="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="text-xs text-zinc-400 font-bold uppercase" id="resultLabel">Carga para 75%:</div>
        <div class="text-3xl font-black text-amber-400 font-display" id="resultWeight">0 ${unit}</div>
      </div>
      <div id="platesContainer" class="flex flex-wrap gap-2 items-center">
        <!-- Plates will render here -->
      </div>
    </div>
  </section>

  <!-- Complete 1RM Percentages Table -->
  <section class="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-black uppercase text-zinc-100">
        📊 Tabela Completa de Porcentagens
      </h2>
      <span class="text-xs text-zinc-400" id="tableNameDisplay"></span>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3" id="tableGrid">
      <!-- Grid table percentages will render here -->
    </div>
  </section>

  <!-- All Exercises Grid -->
  <section class="mt-8 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
    <h2 class="text-lg font-black uppercase text-zinc-100">
      🏋️ Meus Exercícios & Recordes (1RMs) Salvos
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" id="exercisesList">
      <!-- Exercises cards will render here -->
    </div>
  </section>

  <footer class="mt-12 text-center text-xs text-zinc-600 pb-8">
    StrongProgress App Offline • Todos os seus dados foram empacotados com segurança.
  </footer>

  <script>
    const APP_DATA = ${jsonString};
    const unit = APP_DATA.unit || 'kg';
    const exercises = APP_DATA.exercises || [];

    function init() {
      const select = document.getElementById('exerciseSelect');
      select.innerHTML = '';
      exercises.forEach((ex, idx) => {
        const opt = document.createElement('option');
        opt.value = ex.id;
        opt.textContent = (ex.name + (ex.currentPR > 0 ? ' (' + ex.currentPR + ' ' + unit + ')' : ''));
        select.appendChild(opt);
      });

      renderExercisesList();
      onSelectExercise();
    }

    function onSelectExercise() {
      const select = document.getElementById('exerciseSelect');
      const ex = exercises.find(e => e.id === select.value) || exercises[0];
      if (ex) {
        document.getElementById('base1RMInput').value = ex.currentPR || 0;
        document.getElementById('tableNameDisplay').textContent = ex.name + ' (1RM: ' + ex.currentPR + ' ' + unit + ')';
        calculate();
      }
    }

    function setPercent(p) {
      document.getElementById('percentInput').value = p;
      calculate();
    }

    function calculatePlates(targetTotal, barWeight = 20) {
      let weightPerSide = (targetTotal - barWeight) / 2;
      if (weightPerSide <= 0) return [];
      const available = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5];
      const plates = [];
      for (const plate of available) {
        while (weightPerSide >= plate - 0.01) {
          plates.push(plate);
          weightPerSide -= plate;
        }
      }
      return plates;
    }

    function calculate() {
      const base1RM = parseFloat(document.getElementById('base1RMInput').value) || 0;
      const percent = parseFloat(document.getElementById('percentInput').value) || 0;
      const target = Math.round((base1RM * (percent / 100)) * 2) / 2;

      document.getElementById('resultLabel').textContent = 'Carga para ' + percent + '%:';
      document.getElementById('resultWeight').textContent = target + ' ' + unit;

      // Render plates
      const plates = calculatePlates(target, 20);
      const platesBox = document.getElementById('platesContainer');
      platesBox.innerHTML = '';

      if (plates.length === 0) {
        platesBox.innerHTML = '<span class="text-xs text-zinc-500">Apenas a barra (20 ' + unit + ')</span>';
      } else {
        const span = document.createElement('span');
        span.className = 'text-xs text-zinc-400 mr-2 font-bold';
        span.textContent = 'Por lado:';
        platesBox.appendChild(span);
        plates.forEach(p => {
          const badge = document.createElement('span');
          badge.className = 'px-2 py-1 rounded text-xs font-bold plate-' + String(p).replace('.', '_');
          badge.textContent = p + 'kg';
          platesBox.appendChild(badge);
        });
      }

      // Render Percent Table
      const tableGrid = document.getElementById('tableGrid');
      tableGrid.innerHTML = '';
      const percentages = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105];
      percentages.forEach(p => {
        const w = Math.round((base1RM * (p / 100)) * 2) / 2;
        const cell = document.createElement('div');
        cell.className = 'p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center ' + (p === percent ? 'border-amber-500 bg-amber-500/10' : '');
        cell.innerHTML = '<div class="text-[11px] font-bold text-zinc-400 uppercase">' + p + '%</div><div class="text-lg font-black text-amber-400 mt-0.5 font-display">' + w + ' ' + unit + '</div>';
        tableGrid.appendChild(cell);
      });
    }

    function renderExercisesList() {
      const container = document.getElementById('exercisesList');
      container.innerHTML = '';
      exercises.forEach(ex => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between';
        card.innerHTML = '<div><div class="text-sm font-bold text-zinc-200">' + ex.name + '</div><div class="text-[11px] text-zinc-500 uppercase font-semibold">' + ex.category + '</div></div><div class="text-base font-black text-amber-400">' + (ex.currentPR > 0 ? ex.currentPR + ' ' + unit : '--') + '</div>';
        container.appendChild(card);
      });
    }

    init();
  </script>
</body>
</html>`;
}
