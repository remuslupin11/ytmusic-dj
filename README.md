# 🎙️ Radio DJ for YouTube Music

> Nghe nhạc có hồn hơn — như radio ngày xưa

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/accelkpnjpnenackkinggaacdanbijbb?label=Chrome%20Web%20Store&color=e8a020)](https://chromewebstore.google.com/detail/radio-dj-for-youtube-music/accelkpnjpnenackkinggaacdanbijbb)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Bạn có nhớ cảm giác nghe radio ngày xưa, khi MC giới thiệu từng bài hát trước khi phát không? Extension này mang lại đúng trải nghiệm đó cho YouTube Music — một giọng MC ảo tự động giới thiệu tên bài và ca sĩ trước mỗi bài nhạc.

---

## ✨ Tính năng

- 🎙️ **Giọng MC tự động** — đọc tên bài & ca sĩ trước khi phát
- ⏸️ **Tự tạm dừng nhạc** khi đọc, phát lại sau khi xong
- 🇻🇳 **Giọng tiếng Việt** tự nhiên qua Google TTS — hoạt động ngay, không cần cài thêm
- ✍️ **Tùy chỉnh kịch bản MC** — ví dụ: `"Và bây giờ, {title} của {artist}"`
- 🌐 **Đa ngôn ngữ** — Tiếng Việt, English, 日本語, 한국어, 中文
- 🔊 **Điều chỉnh âm lượng** giọng đọc

---

## 🚀 Cài đặt

### Từ Chrome Web Store (khuyến nghị)
👉 [Cài đặt tại đây](https://chromewebstore.google.com/detail/radio-dj-for-youtube-music/accelkpnjpnenackkinggaacdanbijbb)

### Cài thủ công (Developer mode)
1. Download hoặc clone repo này
2. Vào `chrome://extensions` → bật **Developer mode**
3. Nhấn **Load unpacked** → chọn thư mục này
4. Mở [music.youtube.com](https://music.youtube.com) và phát nhạc

> Tương thích với Chrome, Opera, Edge, Brave và mọi trình duyệt Chromium.

---

## 🎛️ Cách dùng

Nhấn vào icon extension trên thanh công cụ để mở bảng điều khiển:

| Tính năng | Mô tả |
|-----------|-------|
| **Bật/Tắt** | Bật tắt toàn bộ extension |
| **Ngôn ngữ** | Chọn ngôn ngữ giọng đọc |
| **Âm lượng** | Điều chỉnh âm lượng giọng MC |
| **Kịch bản MC** | Tùy chỉnh câu giới thiệu |
| **Tạm dừng nhạc** | Tắt nhạc khi đọc, bật lại sau |
| **Thử ngay** | Test giọng đọc trước khi dùng |

### Tùy chỉnh kịch bản MC

Dùng `{title}` cho tên bài, `{artist}` cho ca sĩ:

```
Tiếp theo: {title} — {artist}
Và bây giờ, {title} của {artist}
Xin mời quý vị thưởng thức {title}
```

---

## 🏗️ Kiến trúc

```
content.js          background.js         offscreen.js
(YouTube Music)  →  (Service Worker)  →   (Audio Sandbox)
Phát hiện bài       Nhận lệnh SPEAK       Fetch Google TTS
Gửi lệnh SPEAK      Tạo offscreen doc     Phát audio
Nhận TTS_DONE  ←    Forward TTS_DONE  ←   Gửi TTS_DONE
Resume nhạc
```

**Tại sao cần Offscreen Document?**
YouTube Music có Content Security Policy (CSP) chặn content script không được tạo Audio hay kết nối ra ngoài. Offscreen document chạy trong sandbox riêng, không bị CSP nào giới hạn.

---

## 🔒 Quyền riêng tư

- ✅ Không thu thập bất kỳ dữ liệu người dùng nào
- ✅ Không gửi thông tin cá nhân ra ngoài
- ✅ Tên bài hát chỉ được gửi đến Google TTS để tạo audio, không lưu lại
- ✅ Settings lưu locally trong `chrome.storage.sync`
- ✅ Chỉ hoạt động trên `music.youtube.com`

---

## 🛠️ Phát triển

Extension được build bằng **Vibe Coding** — ý tưởng từ con người, thực thi bởi AI, kiểm thử bởi con người.

### Tech stack
- **Manifest V3** Chrome Extension
- **Google Translate TTS** (unofficial endpoint)
- **Chrome Offscreen API** cho audio playback
- **MutationObserver + Polling** để phát hiện bài hát thay đổi

### Roadmap
- [ ] Giọng AI tự nhiên hơn (ElevenLabs / OpenAI TTS)
- [ ] Kể chuyện về bài hát — hoàn cảnh sáng tác, thông tin ca sĩ
- [ ] Hỗ trợ Spotify, Apple Music
- [ ] Hiển thị notification popup khi đổi bài

---

## 📝 License

MIT License — tự do sử dụng, chỉnh sửa và phân phối.

---

*Made with ♪ — lấy cảm hứng từ radio Việt Nam*
