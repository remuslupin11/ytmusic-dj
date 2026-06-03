let currentAudio = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'OFFSCREEN_PLAY') {
    playAudio(msg.url, msg.volume)
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (msg.type === 'OFFSCREEN_STOP') {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    sendResponse({ ok: true });
  }
});

function playAudio(url, volume) {
  return new Promise((resolve, reject) => {
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    const audio = new Audio(url);
    audio.volume = Math.min(1, Math.max(0, volume));
    currentAudio = audio;
    audio.addEventListener('ended', () => {
      currentAudio = null;
      chrome.runtime.sendMessage({ type: 'TTS_DONE' });
      resolve();
    });
    audio.addEventListener('error', () => {
      currentAudio = null;
      chrome.runtime.sendMessage({ type: 'TTS_DONE' });
      reject();
    });
    audio.play().catch(reject);
  });
}
