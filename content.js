(() => {
  'use strict';

  let lastTitle = '';
  let isSpeaking = false;
  let resumeAfterSpeak = false;
  let settings = {
    enabled: true,
    volume: 1.0,
    lang: 'vi',
    pauseMusic: true,
    template: 'Tiếp theo: {title} — {artist}'
  };

  chrome.storage.sync.get('djSettings', (data) => {
    if (data.djSettings) settings = { ...settings, ...data.djSettings };
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'SETTINGS_UPDATED') settings = { ...settings, ...msg.settings };
    if (msg.type === 'TTS_DONE') {
      isSpeaking = false;
      if (resumeAfterSpeak) {
        resumeAfterSpeak = false;
        setTimeout(resumeMusic, 400);
      }
    }
  });

  function isPlaying() {
    const v = document.querySelector('video');
    return v ? !v.paused && !v.ended && v.readyState > 2 : false;
  }

  function pauseMusic() {
    const v = document.querySelector('video');
    if (v && !v.paused) v.pause();
  }

  function resumeMusic() {
    if (isPlaying()) return;
    const bar = document.querySelector('ytmusic-player-bar');
    if (!bar) return;
    const btns = bar.querySelectorAll('.middle-controls-buttons tp-yt-paper-icon-button, .middle-controls tp-yt-paper-icon-button');
    const playBtn = bar.querySelector('#play-pause-button') || bar.querySelector('.play-pause-button') || btns[1] || btns[0];
    if (playBtn) {
      playBtn.click();
    } else {
      document.querySelector('video')?.play().catch(() => {});
    }
  }

  function getSongInfo() {
    const titleEl    = document.querySelector('ytmusic-player-bar yt-formatted-string.title');
    const subtitleEl = document.querySelector('ytmusic-player-bar span.subtitle');
    const title      = titleEl?.textContent?.trim() || '';
    const rawSub     = subtitleEl?.textContent?.trim() || '';
    const artist     = rawSub.split('•')[0].trim();
    return { title, artist };
  }

  function announce(title, artist) {
    if (!settings.enabled || isSpeaking || !title) return;

    const text = settings.template
      .replace('{title}', title)
      .replace('{artist}', artist);

    const wasPlaying = isPlaying();
    isSpeaking = true;
    resumeAfterSpeak = settings.pauseMusic && wasPlaying;

    const doSpeak = () => {
      chrome.runtime.sendMessage({
        type: 'SPEAK',
        text,
        lang:   settings.lang   || 'vi',
        volume: settings.volume || 1.0,
      });
    };

    if (settings.pauseMusic && wasPlaying) {
      pauseMusic();
      setTimeout(doSpeak, 400);
    } else {
      doSpeak();
    }
  }

  let debounceTimer = null;

  function checkSong() {
    const { title, artist } = getSongInfo();
    if (title && title !== lastTitle) {
      lastTitle = title;
      announce(title, artist);
    }
  }

  new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(checkSong, 800);
  }).observe(document.body, { childList: true, subtree: true });

  setInterval(checkSong, 2000);
})();
