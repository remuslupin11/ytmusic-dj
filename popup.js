const $ = id => document.getElementById(id);

function updateLabels() {
  $('volumeVal').textContent = Math.round($('volumeSlider').value * 100) + '%';
}

function updatePowerUI(on) {
  $('statusDot').classList.toggle('on', on);
  $('statusText').textContent = on ? 'Đang bật' : 'Đang tắt';
  document.body.classList.toggle('disabled', !on);
}

function saveSettings() {
  const s = {
    enabled:    $('enabledToggle').checked,
    lang:       $('langSelect').value,
    volume:     parseFloat($('volumeSlider').value),
    pauseMusic: $('pauseToggle').checked,
    template:   $('templateInput').value || 'Tiếp theo: {title} — {artist}',
  };
  chrome.storage.sync.set({ djSettings: s });
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { type: 'SETTINGS_UPDATED', settings: s }).catch(() => {});
  });
}

function loadSettings() {
  chrome.storage.sync.get('djSettings', data => {
    const s = data.djSettings || {};
    $('enabledToggle').checked = s.enabled !== false;
    $('langSelect').value      = s.lang      || 'vi';
    $('volumeSlider').value    = s.volume    ?? 1.0;
    $('pauseToggle').checked   = s.pauseMusic !== false;
    $('templateInput').value   = s.template  || 'Tiếp theo: {title} — {artist}';
    updateLabels();
    updatePowerUI($('enabledToggle').checked);
  });
}

// Events
$('enabledToggle').addEventListener('change', e => { updatePowerUI(e.target.checked); saveSettings(); });
$('volumeSlider').addEventListener('input', () => { updateLabels(); saveSettings(); });
$('langSelect').addEventListener('change', saveSettings);
$('pauseToggle').addEventListener('change', saveSettings);

// Template — lưu khi nhấn nút, không auto-save khi gõ
const DEFAULT_TEMPLATE = 'Tiếp theo: {title} — {artist}';

$('saveTemplateBtn').addEventListener('click', () => {
  const val = $('templateInput').value.trim();
  if (!val) { showStatus('⚠ Kịch bản không được để trống', 'var(--amber)'); return; }
  if (!val.includes('{title}') && !val.includes('{artist}')) {
    showStatus('⚠ Nên có {title} hoặc {artist}', 'var(--amber)'); return;
  }
  saveSettings();
  showStatus('✓ Đã lưu!', 'var(--green)');
});

$('resetTemplateBtn').addEventListener('click', () => {
  $('templateInput').value = DEFAULT_TEMPLATE;
  saveSettings();
  showStatus('✓ Đã khôi phục mặc định', 'var(--green)');
});

function showStatus(msg, color) {
  const el = $('saveStatus');
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { el.textContent = ''; }, 2500);
}

// Test button — dùng Google TTS luôn
let testAudio = null;
$('testBtn').addEventListener('click', () => {
  const lang     = $('langSelect').value;
  const volume   = parseFloat($('volumeSlider').value);
  const template = $('templateInput').value || 'Tiếp theo: {title} — {artist}';
  const text     = template.replace('{title}', 'Nơi Này Có Anh').replace('{artist}', 'Sơn Tùng M-TP');

  if (testAudio) { testAudio.pause(); testAudio = null; }

  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=${lang}&client=gtx&q=${encodeURIComponent(text)}`;
  testAudio = new Audio(url);
  testAudio.volume = volume;

  const btn = $('testBtn');
  btn.innerHTML = '⏸ Đang đọc...';
  btn.disabled = true;

  testAudio.play().catch(() => {
    btn.innerHTML = '<span>▶</span> Thử ngay';
    btn.disabled = false;
  });
  testAudio.addEventListener('ended', () => {
    btn.innerHTML = '<span>▶</span> Thử ngay';
    btn.disabled = false;
    testAudio = null;
  });
});

loadSettings();