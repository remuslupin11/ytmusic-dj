chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SPEAK') {
    handleSpeak(msg)
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
  if (msg.type === 'TTS_DONE') {
    chrome.tabs.query({ url: '*://music.youtube.com/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { type: 'TTS_DONE' }).catch(() => {});
      });
    });
  }
});

async function handleSpeak({ text, lang, volume }) {
  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&tl=${lang}&client=gtx&q=${encodeURIComponent(text)}`;
  await ensureOffscreen();
  return chrome.runtime.sendMessage({ type: 'OFFSCREEN_PLAY', url, volume: parseFloat(volume) || 1.0 });
}

async function ensureOffscreen() {
  try {
    const exists = await chrome.offscreen.hasDocument();
    if (!exists) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play Google TTS audio for YouTube Music DJ',
      });
    }
  } catch (e) {
    if (!e.message?.includes('already')) throw e;
  }
}
