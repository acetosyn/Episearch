let TESTS = [];
const SYNONYMS = {
  "thyroid test": ["TSH - Thyroid Stimulating Hormone","Free T4 (Thyroxine)","Free T3 (Triiodothyronine)"],
  "cbc": ["Full Blood Count (FBC)"],
  "fbc": ["Full Blood Count (FBC)"],
  "sugar": ["Fasting Blood Sugar (FBS)","HbA1c (Glycated Hemoglobin)"]
};
const formatNaira = (n) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

// Load tests
async function loadTests() {
  const res = await fetch('/api/tests');
  TESTS = await res.json();
}

// Search filter
function searchTests(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase();
  let extraTargets = new Set(SYNONYMS[q] || []);
  return TESTS.filter(t => {
    const name = t.test.toLowerCase();
    const cat = t.category.toLowerCase();
    return name.includes(q) || cat.includes(q) || extraTargets.has(t.test);
  });
}

// Render search results
function renderResults(list) {
  const panel = document.getElementById('resultsPanel');
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '';
  if (list.length === 0) {
    panel.classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');
  list.forEach(item => {
    const el = document.createElement('div');
    el.className = 'result-card rounded-xl shadow p-4 bg-white border border-gray-100';
    el.innerHTML = `
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900">${item.test}</h3>
        <div class="text-sm font-medium text-emerald-700">${formatNaira(item.price)}</div>
      </div>
      <div class="text-xs text-gray-500 mt-1">${item.category}</div>
    `;
    container.appendChild(el);
  });
}

// All Tests renderer
function renderAllTests() {
  const container = document.getElementById('allTestsContainer');
  container.innerHTML = '';
  TESTS.forEach(item => {
    const el = document.createElement('div');
    el.className = 'p-3 border rounded-lg bg-gray-50';
    el.innerHTML = `
      <div class="flex items-center justify-between">
        <h4 class="font-semibold">${item.test}</h4>
        <span class="text-sm text-emerald-700">${formatNaira(item.price)}</span>
      </div>
      <p class="text-xs text-gray-500">${item.category}</p>
    `;
    container.appendChild(el);
  });
}

// Input search
function onInput(e) {
  const q = e.target.value;
  const list = searchTests(q);
  renderResults(list);
}

// Voice search
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech recognition not supported in this browser.');
    return;
  }
  const recog = new SpeechRecognition();
  recog.lang = 'en-NG';
  recog.interimResults = false;
  recog.maxAlternatives = 1;
  recog.onresult = (ev) => {
    const text = ev.results[0][0].transcript.trim();
    const input = document.getElementById('searchInput');
    input.value = text;
    const matches = searchTests(text);
    if (matches.length === 0) {
      renderResults([]);
      const panel = document.getElementById('resultsPanel');
      panel.classList.remove('hidden');
      document.getElementById('resultsContainer').innerHTML = '<div class="text-sm text-gray-500">No such test in database.</div>';
      return;
    }
    const exact = matches.find(m => m.test.toLowerCase() === text.toLowerCase());
    renderResults(exact ? [exact] : matches);
  };
  recog.start();
}

// Admin toggle
function toggleAdmin() {
  document.getElementById('adminPanel').classList.toggle('hidden');
}
function addOrUpdateTest(e) {
  e.preventDefault();
  const test = document.getElementById('a_test').value.trim();
  const category = document.getElementById('a_category').value.trim();
  const price = parseInt(document.getElementById('a_price').value, 10) || 0;
  if (!test || !category) { alert('Provide test and category'); return; }
  const idx = TESTS.findIndex(t => t.test.toLowerCase() === test.toLowerCase());
  if (idx >= 0) {
    TESTS[idx].category = category;
    TESTS[idx].price = price;
  } else {
    TESTS.push({ test, category, price });
  }
  renderResults(searchTests(document.getElementById('searchInput').value));
  e.target.reset();
  alert('Saved locally (in-memory).');
}

// All Tests toggle
function toggleAllTests() {
  const panel = document.getElementById('allTestsPanel');
  const isHidden = panel.classList.contains('hidden');
  if (isHidden) {
    renderAllTests();
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}
function clearAllTests() {
  document.getElementById('allTestsPanel').classList.add('hidden');
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadTests();
  document.getElementById('searchInput').addEventListener('input', onInput);
  document.getElementById('micBtn').addEventListener('click', startVoice);
  document.getElementById('adminToggle').addEventListener('click', toggleAdmin);
  document.getElementById('adminForm').addEventListener('submit', addOrUpdateTest);
  document.getElementById('allTestsBtn').addEventListener('click', toggleAllTests);
  document.getElementById('clearAllTests').addEventListener('click', clearAllTests);
});
