# 🌸 Website Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11 🌸

## Giới Thiệu

Đây là một trang web tương tác đầy màu sắc để chúc mừng và tri ân các thầy cô giáo nhân dịp Ngày Nhà Giáo Việt Nam 20/11.

## 🎨 Tính Năng Nổi Bật

### 1. **Hiệu Ứng Hoa Rơi** 🌸

- Hoa liên tục rơi từ trên xuống tạo không khí lễ hội
- Các lời chúc rơi nhẹ nhàng như mưa hoa

### 2. **Không Gian 3D Sao Đêm** ✨

- Canvas 3D với hàng ngàn ngôi sao chuyển động
- Hiệu ứng nebula lung linh

### 3. **Các Wish Cards (Thẻ Lời Chúc)** 💐

#### a. **Tri Thức Vô Biên** - Slideshow Tự Động

- Slideshow hình ảnh tự động chuyển đổi
- Nhạc nền êm dịu (có thể bật/tắt)
- Điều khiển chuyển slide thủ công

#### b. **Tình Thương Vô Bờ** - Hearts Canvas

- Vẽ trái tim bằng chuột/chạm
- Click để tạo trái tim nổ tung
- Hiệu ứng lãng mạn

#### c. **Ân Tình Sâu Nặng** - Poem Reader

- 4 bài thơ về thầy cô
- Text-to-Speech đọc thơ tự động
- Điều khiển phát/dừng

### 4. **Bento Grid Layout** 📦

#### a. **🌺 Vườn Hoa Tri Ân**

- Nhấp chuột để trồng hoa
- Chọn loại hoa yêu thích (6 loại)
- Hệ thống cấp độ tự động tăng
- Lưu vườn hoa vào localStorage
- Xóa và bắt đầu lại

#### b. **📝 Bức Tường Kỷ Niệm**

- Viết sticky notes tri ân
- Ghi lại kỷ niệm với thầy cô
- Lưu trữ tự động
- Kéo thả notes tự do

#### c. **🎨 Tạo Thiệp Chúc Mừng**

- 3 mẫu thiệp đẹp (Cổ điển, Hiện đại, Thanh lịch)
- Tùy chỉnh lời chúc và chữ ký
- Xem trước thiệp
- Tải xuống hoặc chia sẻ

### 5. **Quotes Xoay Vòng** 💬

- 6 câu danh ngôn về giáo dục
- Tự động chuyển đổi mỗi 5 giây
- Hiệu ứng hoa trang trí

### 6. **Hệ Thống Thành Tích** 🏆

- 10 thành tích có thể mở khóa
- Tích điểm khi tương tác
- Thống kê chi tiết
- Animation khi đạt thành tích mới

### 7. **Pháo Hoa Cuộn Trang** 🎆

- Pháo hoa nổ khi cuộn qua các section
- Intersection Observer API
- Tự động kích hoạt

### 8. **Chia Sẻ Mạng Xã Hội** 📱

- Share lên Facebook
- Share qua Zalo
- Copy link trang web
- Web Share API

### 9. **Chọn Tâm Trạng** 😊

- 5 tâm trạng khác nhau
- Thay đổi màu sắc theme
- Hiệu ứng tương ứng

### 10. **Bắn Confetti** 🎊

- Nhấn nút để bắn confetti
- Canvas animation mượt mà
- Nhiều màu sắc rực rỡ

### 11. **Ghi Âm Lời Nhắn** 🎤

- Ghi âm giọng nói
- Nghe lại recording
- Tải xuống file âm thanh
- Waveform visualization

### 12. **Timeline Hành Trình** 📖

- Timeline động về hành trình thầy trò
- 4 mốc quan trọng
- Animation khi scroll

### 13. **Gửi Lời Nhắn** ✉️

- Form gửi lời nhắn
- Hiển thị danh sách tin nhắn
- Chữ ký canvas
- Lưu trữ localStorage

## 🚀 Cách Sử Dụng

### Chạy Trang Web

1. Mở file `index_new.html` bằng trình duyệt
2. Hoặc sử dụng Live Server trong VS Code

### Tương Tác

- **Cuộn trang** để khám phá các phần
- **Click vào các nút** để kích hoạt tính năng
- **Di chuột** trên canvas Hearts để vẽ
- **Gõ phím Space** (một số tính năng)

## 📁 Cấu Trúc File

```
📦 nhà giáo Việt Nam
 ┣ 📜 index_new.html     (1028 dòng) - Cấu trúc HTML
 ┣ 📜 style_new.css      (4994 dòng) - CSS styling + animations
 ┣ 📜 script_new.js      (2000+ dòng) - JavaScript logic
 ┗ 📜 README.md          - File hướng dẫn này
```

## 🎨 Công Nghệ Sử Dụng

### HTML5

- Semantic tags
- Canvas elements
- Forms & inputs

### CSS3

- **Flexbox & Grid** - Layout responsive
- **Hexagonal Clip-path** - Wish cards hình bát giác
- **Bento Grid** - Layout 12 cột linh hoạt
- **Glassmorphism** - Backdrop-filter blur
- **3D Transforms** - perspective, preserve-3d
- **Gradients** - Linear, radial, animated
- **Keyframe Animations** - float, bounce, pulse, rotate
- **Custom Properties** - CSS Variables

### JavaScript (Vanilla)

- **Canvas API** - 3D particles, hearts, fireworks, garden, waveform, confetti
- **Web Speech API** - Text-to-Speech cho poem reader
- **MediaRecorder API** - Ghi âm lời nhắn
- **Web Share API** - Chia sẻ native
- **localStorage** - Lưu achievements, garden, messages, notes
- **Intersection Observer** - Scroll-triggered animations
- **Event Listeners** - Mouse, click, scroll, drag

## 🎯 Layout Systems

### 1. Hexagonal Honeycomb (Wish Cards)

```css
clip-path: polygon(
  30% 0%,
  70% 0%,
  100% 30%,
  100% 70%,
  70% 100%,
  30% 100%,
  0% 70%,
  0% 30%
);
```

- 3 thẻ lời chúc hình bát giác
- Gradient backgrounds khác nhau
- Float animation

### 2. Bento Grid (Features)

```css
display: grid;
grid-template-columns: repeat(12, 1fr);
```

- **Large cards**: span 8 columns × 2 rows
- **Medium cards**: span 4 columns × 2 rows
- **Wide cards**: span 12 columns × 1 row
- **Small cards**: span 6 columns × 1 row

## 📱 Responsive Design

### Breakpoints

- **Desktop**: > 1024px - Full layout
- **Tablet**: 768px - 1024px - Adjusted grid
- **Mobile**: < 768px - Single column, stacked

### Mobile Optimizations

- Hexagon cards thu nhỏ
- Bento Grid → 1 column
- Buttons chỉ hiện icons
- Touch-friendly targets
- Reduced animations

## 🎭 Animations & Effects

### Keyframes Animations

- `floatBubble` - Wish cards nhấp nhô
- `fallDown` - Lời chúc rơi xuống
- `pulse` - Nhấp nháy badges
- `rotate` - Xoay decorations
- `gradientShift` - Gradient di chuyển
- `neonGlow` - Hiệu ứng neon

### Canvas Effects

- 3D star field với depth
- Hearts explosion
- Fireworks particles
- Garden flowers
- Audio waveform
- Confetti rain

## 💾 Data Persistence

### localStorage Keys

- `achievements` - Danh sách thành tích đã mở
- `totalPoints` - Tổng điểm
- `gardenFlowers` - Dữ liệu vườn hoa
- `gardenLevel` - Cấp độ vườn
- `memoryNotes` - Sticky notes
- `teacherMessages` - Tin nhắn gửi thầy cô

## 🏆 Danh Sách Thành Tích

1. **Người Mới** - Truy cập trang web (10 điểm)
2. **Người Đọc** - Đọc thơ (15 điểm)
3. **Họa Sĩ Trái Tim** - Vẽ 50 trái tim (20 điểm)
4. **Người Trồng Hoa** - Trồng 20 bông hoa (25 điểm)
5. **Nhà Thiết Kế** - Tạo thiệp chúc mừng (20 điểm)
6. **Người Viết** - Gửi tin nhắn (15 điểm)
7. **Kỷ Niệm Sâu Sắc** - Tạo 10 sticky notes (25 điểm)
8. **Bậc Thầy Khối** - Xoay cube (10 điểm)
9. **Người Chia Sẻ** - Chia sẻ trang (30 điểm)
10. **Trùm Cuối** - Mở khóa tất cả (50 điểm)

## 🎵 Tính Năng Âm Thanh

### Background Music

- Tự động phát khi bật slideshow
- Nút điều khiển bật/tắt
- Loop vô hạn

### Text-to-Speech

- Đọc bài thơ bằng giọng Việt
- Điều chỉnh tốc độ, pitch
- Dừng/tiếp tục

### Voice Recording

- Ghi âm MediaRecorder
- Waveform real-time
- Export file âm thanh

## 🌐 Trình Duyệt Hỗ Trợ

✅ Chrome/Edge (Chromium) - Đầy đủ tính năng
✅ Firefox - Đầy đủ tính năng
✅ Safari - Hầu hết tính năng (một số API giới hạn)
❌ IE11 - Không hỗ trợ

## 🐛 Troubleshooting

### Nhạc không phát?

- Kiểm tra file nhạc đường dẫn đúng
- Trình duyệt có thể chặn autoplay
- Nhấn nút Music để bật thủ công

### Canvas không hiển thị?

- Kiểm tra console có lỗi không
- Trình duyệt có hỗ trợ Canvas API
- Thử refresh trang

### localStorage không lưu?

- Kiểm tra Private/Incognito mode
- localStorage có thể bị disable
- Xóa cache và thử lại

## 📝 Ghi Chú Phát Triển

### Code Style

- Sử dụng `const/let` thay vì `var`
- Template literals cho string
- Arrow functions
- Async/await (nếu cần)

### Performance

- Debounce scroll events
- RequestAnimationFrame cho animations
- Lazy loading cho images (nếu thêm)
- Tối ưu số lượng particles

### Accessibility

- Semantic HTML
- ARIA labels (cần bổ sung)
- Keyboard navigation (cần cải thiện)
- Color contrast

## 🔮 Tính Năng Tương Lai

- [ ] Thêm nhiều mẫu thiệp hơn
- [ ] Upload ảnh vào thiệp
- [ ] Chơi minigames
- [ ] Ranking bảng xếp hạng
- [ ] Backend lưu tin nhắn thật
- [ ] PWA - cài đặt như app
- [ ] Dark mode toggle
- [ ] Multi-language support

## 👨‍💻 Credits

- **Design & Development**: Students Team
- **Inspiration**: Ngày Nhà Giáo Việt Nam 20/11
- **Built with**: ❤️ HTML, CSS, JavaScript

---

## 📞 Liên Hệ

Nếu có câu hỏi hoặc đóng góp, vui lòng tạo issue hoặc pull request!

**🌸 Chúc mừng 20/11 - Tri ân thầy cô! 🌸**
