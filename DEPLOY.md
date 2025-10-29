# 🚀 HƯỚNG DẪN DEPLOY WEBSITE

## 📋 Chuẩn Bị

### Files Cần Thiết

```
📦 Website
 ┣ 📜 index_new.html
 ┣ 📜 style_new.css
 ┣ 📜 script_new.js
 ┗ 🎵 background-music.mp3 (optional)
```

**Lưu ý:** Nếu muốn có nhạc nền, cần thêm file nhạc vào thư mục.

---

## 🌐 PHƯƠNG PHÁP 1: GitHub Pages (MIỄN PHÍ)

### Bước 1: Tạo Repository

1. Đăng nhập GitHub
2. Click **New Repository**
3. Đặt tên: `teachers-day-2024` (hoặc tên khác)
4. Chọn **Public**
5. Click **Create repository**

### Bước 2: Upload Files

```bash
# Khởi tạo git (trong thư mục dự án)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Teachers Day website"

# Thêm remote
git remote add origin https://github.com/USERNAME/teachers-day-2024.git

# Push
git branch -M main
git push -u origin main
```

### Bước 3: Bật GitHub Pages

1. Vào **Settings** của repository
2. Scroll xuống **Pages**
3. Source: chọn **main branch**
4. Folder: chọn **/ (root)**
5. Click **Save**

### Bước 4: Truy Cập

- URL: `https://USERNAME.github.io/teachers-day-2024/index_new.html`
- Hoặc đổi tên file thành `index.html` để URL ngắn gọn hơn

**Ưu điểm:**
✅ Hoàn toàn miễn phí
✅ HTTPS tự động
✅ Không cần server
✅ Dễ cập nhật (git push)

**Nhược điểm:**
❌ Repository phải public
❌ Giới hạn 100GB bandwidth/tháng
❌ Chỉ static content

---

## 🔥 PHƯƠNG PHÁP 2: Netlify (MIỄN PHÍ)

### Bước 1: Đăng Ký Netlify

1. Truy cập https://netlify.com
2. Sign up (có thể dùng GitHub account)

### Bước 2: Deploy

**Cách 1: Drag & Drop**

1. Click **Add new site** > **Deploy manually**
2. Kéo thả thư mục dự án vào
3. Chờ deploy xong

**Cách 2: Git Integration**

1. Push code lên GitHub (như trên)
2. **Add new site** > **Import from Git**
3. Chọn repository
4. Click **Deploy**

### Bước 3: Cấu Hình (Optional)

- Đổi tên site: `Site settings` > `Change site name`
- Custom domain: Thêm domain riêng nếu có

**Ưu điểm:**
✅ Miễn phí unlimited sites
✅ Auto deploy khi push
✅ HTTPS miễn phí
✅ CDN toàn cầu
✅ Forms backend miễn phí

**Nhược điểm:**
❌ Giới hạn 100GB bandwidth/tháng (free tier)

---

## ☁️ PHƯƠNG PHÁP 3: Vercel (MIỄN PHÍ)

### Deploy

1. Truy cập https://vercel.com
2. Sign up với GitHub
3. Click **New Project**
4. Import repository
5. Click **Deploy**

**Tương tự Netlify, rất đơn giản!**

**Ưu điểm:**
✅ Deploy cực nhanh
✅ Auto HTTPS
✅ Edge network
✅ Free unlimited sites

---

## 💻 PHƯƠNG PHÁP 4: Hosting Trả Phí

### Hostinger / 000webhost

1. Mua hosting hoặc dùng free tier
2. Upload files qua FTP/File Manager
3. Truy cập domain

### Upload qua FTP

```
Server: ftp.yourdomain.com
Username: your_username
Password: your_password

Upload vào thư mục: public_html/
```

**Ưu điểm:**
✅ Custom domain dễ dàng
✅ Có thể chạy backend
✅ Không giới hạn bandwidth (paid)

**Nhược điểm:**
❌ Phải trả tiền
❌ Cần config server

---

## 📱 PHƯƠNG PHÁP 5: Chạy Local (Test)

### Cách 1: Live Server (VS Code)

1. Cài extension **Live Server**
2. Right-click `index_new.html`
3. Chọn **Open with Live Server**
4. Truy cập http://localhost:5500

### Cách 2: Python Server

```bash
# Python 3
python -m http.server 8000

# Truy cập: http://localhost:8000
```

### Cách 3: Node.js http-server

```bash
# Cài đặt
npm install -g http-server

# Chạy
http-server

# Truy cập: http://localhost:8080
```

---

## 🎵 Thêm Nhạc Nền

### Bước 1: Chuẩn bị file nhạc

- Format: MP3 (khuyên dùng)
- Kích thước: < 5MB
- Tên file: `background-music.mp3`

### Bước 2: Thêm vào thư mục

```
📦 Website
 ┣ 📜 index_new.html
 ┣ 📜 style_new.css
 ┣ 📜 script_new.js
 ┗ 🎵 background-music.mp3  ← Thêm vào đây
```

### Bước 3: Kiểm tra code

File `script_new.js` đã có sẵn code:

```javascript
const bgMusic = new Audio("background-music.mp3");
bgMusic.loop = true;
```

**Lưu ý:** Nếu deploy lên hosting, đảm bảo upload cả file nhạc!

---

## 🔧 Tối Ưu Hóa Trước Khi Deploy

### 1. Đổi Tên Files (Optional)

```
index_new.html  →  index.html
style_new.css   →  style.css
script_new.js   →  script.js
```

**Nhớ update links trong HTML:**

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

### 2. Minify CSS & JS (Production)

- Sử dụng https://cssminifier.com/
- Sử dụng https://javascript-minifier.com/
- Hoặc dùng build tools (Gulp, Webpack)

### 3. Optimize Images (Nếu có)

- Compress với TinyPNG
- WebP format
- Lazy loading

### 4. Add Meta Tags (SEO)

```html
<meta
  name="description"
  content="Trang web chúc mừng ngày Nhà giáo Việt Nam 20/11"
/>
<meta property="og:title" content="Chúc Mừng 20/11 🌸" />
<meta
  property="og:description"
  content="Tri ân thầy cô nhân ngày Nhà giáo Việt Nam"
/>
<meta property="og:image" content="https://yourdomain.com/preview.jpg" />
```

---

## 📊 Sau Khi Deploy

### Kiểm Tra

- [ ] Mở website trên điện thoại
- [ ] Test tất cả tính năng
- [ ] Kiểm tra responsive
- [ ] Test trên nhiều trình duyệt
- [ ] Kiểm tra tốc độ load

### Share

1. Copy link website
2. Tạo QR code: https://www.qr-code-generator.com/
3. Chia sẻ lên mạng xã hội
4. Gửi cho thầy cô qua email/Zalo

### Monitor

- Google Analytics (optional)
- Netlify Analytics (built-in)
- GitHub Pages traffic (Insights)

---

## 🆘 Troubleshooting

### Website không load?

- Kiểm tra tên files chính xác
- Case-sensitive trên Linux servers
- Xóa cache browser (Ctrl + F5)

### CSS không áp dụng?

- Kiểm tra đường dẫn file CSS
- Hard refresh (Ctrl + Shift + R)
- Kiểm tra console có lỗi

### JavaScript không chạy?

- Mở Console (F12) xem lỗi
- Kiểm tra đường dẫn file JS
- Đảm bảo script tag đúng vị trí

### Nhạc không phát?

- File nhạc có đúng đường dẫn?
- Browser có block autoplay?
- Thử bật nhạc thủ công

---

## 🎯 Khuyến Nghị

### Cho Học Sinh

👉 **GitHub Pages** - Miễn phí, đơn giản, vĩnh viễn

### Cho Giáo Viên

👉 **Netlify** - Professional, dễ quản lý

### Cho Developer

👉 **Vercel** - Hiện đại, tích hợp CI/CD

### Cho Doanh Nghiệp

👉 **Paid Hosting** - Custom domain, support 24/7

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi deploy:

1. Kiểm tra CHECKLIST.md
2. Đọc README.md
3. Google error message
4. Hỏi cộng đồng (Stack Overflow)

---

**🚀 Chúc bạn deploy thành công! 🌸**

**Chia sẻ link website để cùng nhau tri ân thầy cô nhé! 💕**
