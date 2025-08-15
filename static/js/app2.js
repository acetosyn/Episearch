// ===== All Tests & All Categories (accordion) =====

// Track which view is active inside the bottom panel
let PANEL_MODE = 'none'; // 'none' | 'tests' | 'categories'

// Ungrouped: list every test with its price (scrollable)
function renderAllTests() {
  const container = document.getElementById('allTestsContainer');
  container.innerHTML = '';
  TESTS.forEach(item => {
    const el = document.createElement('div');
    el.className = 'p-3 border rounded-lg bg-gray-50';
    el.innerHTML = `
      <div class="flex items-center justify-between">
        <h4 class="font-semibold">${item.test}</h4>
        <span class="text-sm text-emerald-700">${priceText(item.price)}</span>
      </div>
      <p class="text-xs text-gray-500">${item.category}</p>
    `;
    container.appendChild(el);
  });
}

// Grouped by category: only headers visible initially, click to slide tests down/up
function renderAllCategories() {
  const container = document.getElementById('allTestsContainer');
  container.innerHTML = '';

  // Group by category
  const grouped = {};
  TESTS.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  Object.keys(grouped).sort().forEach(category => {
    const categoryWrapper = document.createElement('div');
    categoryWrapper.className = 'mb-2 border border-gray-200 rounded-lg overflow-hidden';

    const catHeader = document.createElement('div');
    catHeader.className = 'category-header cursor-pointer flex justify-between items-center px-3 py-2 bg-[var(--teal)] text-white';
    catHeader.innerHTML = `
      <span class="font-bold">${category}</span>
      <span class="toggle-indicator">+</span>
    `;

    const catContent = document.createElement('div');
    catContent.className = 'category-content overflow-hidden max-h-0 transition-all duration-300 ease-in-out bg-gray-50';
    catContent.style.maxHeight = '0';

    // Populate tests for this category (initially hidden)
    grouped[category].forEach(item => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center px-3 py-2 border-b border-gray-200';
      row.innerHTML = `
        <span class="font-semibold">${item.test}</span>
        <span class="text-emerald-700 font-bold">${priceText(item.price)}</span>
      `;
      catContent.appendChild(row);
    });

    // Toggle accordion
catHeader.addEventListener('click', () => {
  const isOpen = catContent.style.maxHeight && catContent.style.maxHeight !== '0px';
  if (isOpen) {
    catContent.style.maxHeight = '0';
    catHeader.classList.remove('open');
    catHeader.querySelector('.toggle-indicator').textContent = '+';
  } else {
    catContent.style.maxHeight = catContent.scrollHeight + 'px';
    catHeader.classList.add('open');
    catHeader.querySelector('.toggle-indicator').textContent = '−';
  }
});

    categoryWrapper.appendChild(catHeader);
    categoryWrapper.appendChild(catContent);
    container.appendChild(categoryWrapper);
  });
}

// Ensure panel shows the requested mode
function showPanelMode(mode) {
  const panel = document.getElementById('allTestsPanel');
  if (mode === 'tests') {
    renderAllTests();
    panel.classList.remove('hidden');
    PANEL_MODE = 'tests';
  } else if (mode === 'categories') {
    renderAllCategories();
    panel.classList.remove('hidden');
    PANEL_MODE = 'categories';
  }
}

// Button handlers — proper mode switching
function toggleAllTests() {
  const panel = document.getElementById('allTestsPanel');
  const visible = !panel.classList.contains('hidden');
  if (visible && PANEL_MODE === 'tests') {
    // Same button toggled -> hide the panel
    panel.classList.add('hidden');
    PANEL_MODE = 'none';
  } else {
    // Switch to All Tests view (even if panel is currently showing categories)
    showPanelMode('tests');
  }
}

function toggleAllCategories() {
  const panel = document.getElementById('allTestsPanel');
  const visible = !panel.classList.contains('hidden');
  if (visible && PANEL_MODE === 'categories') {
    // Same button toggled -> hide the panel
    panel.classList.add('hidden');
    PANEL_MODE = 'none';
  } else {
    // Switch to All Categories view
    showPanelMode('categories');
  }
}

// Clear button always hides the panel
function clearAllTests() {
  const panel = document.getElementById('allTestsPanel');
  panel.classList.add('hidden');
  PANEL_MODE = 'none';
}

// Init panel listeners
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('allTestsBtn').addEventListener('click', toggleAllTests);
  document.getElementById('allCategoriesBtn').addEventListener('click', toggleAllCategories);
  document.getElementById('clearAllTests').addEventListener('click', clearAllTests);
});
