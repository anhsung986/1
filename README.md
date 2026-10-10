# CHI-DOI-CHAT

Ứng dụng chat web responsive theo phong cách Messenger xanh dương, dùng HTML/CSS/JavaScript module và Firebase Authentication + Realtime Database.

## Có trong gói
- Đầy đủ các trang HTML theo danh sách yêu cầu.
- Đăng ký/đăng nhập email và mật khẩu qua Firebase Auth.
- Hồ sơ/Bio, danh sách bạn bè theo UID, tạo nhóm, tin nhắn realtime cơ bản.
- Ghi chú cá nhân và Secret Vault mã hóa AES-GCM ngay trên thiết bị.
- Khung trang cho Stories, gallery, gọi, thông báo, bình chọn, lịch, games, admin, analytics, hỗ trợ...
- Quy tắc Realtime Database mẫu (`database.rules.json`).

## 1. Cấu hình Firebase
1. Mở https://console.firebase.google.com/ và tạo project.
2. Vào **Authentication → Sign-in method** bật **Email/Password**.
3. Vào **Realtime Database** tạo database.
4. Vào Project settings → Your apps → Web app, lấy config.
5. `js/db.js` đã được điền sẵn cấu hình Firebase của dự án `chi-doi-chat`. Nếu dùng dự án Firebase khác, hãy thay các giá trị trong `firebaseConfig`.
6. Trong Realtime Database → Rules, nhập nội dung `database.rules.json`, sau đó Publish.
7. Authentication → Settings → Authorized domains: thêm domain GitHub Pages của bạn.
8. Để hỗ trợ tải ảnh/file, bật Firebase Storage và triển khai Storage Rules riêng (chưa bật upload trực tiếp trong bản khung).

### Quan trọng về bảo mật
- Firebase web `apiKey` không phải mật khẩu quản trị, nhưng Rules là hàng rào bảo mật chính. Không đặt service-account key hoặc khóa riêng tư trong frontend.
- `database.rules.json` là bản khởi đầu để kiểm tra. Hãy kiểm thử Rules kỹ trước khi mở cho người dùng; không dùng `.read: true` / `.write: true`.
- Sau khi triển khai, đổi mã Cấp 5 demo `CHIDOI` trong `js/auth.js`. Trong bản production, không nên dùng một mã bí mật cố định trong frontend vì người khác có thể đọc mã từ JavaScript. Hãy xác minh cấp 5 ở Cloud Functions/backend hoặc dùng mã mời dùng một lần.
- Không lưu mật khẩu tài khoản bằng SHA-256 tự viết; Firebase Authentication xử lý mật khẩu.
- Mã hóa Vault hoạt động trong trình duyệt; nếu quên cụm mật khẩu, không thể khôi phục dữ liệu.
- Vai trò admin phải gán từ môi trường đáng tin cậy (ví dụ Admin SDK/Cloud Functions), không cho người dùng tự nâng quyền.
- Gọi thật cần WebRTC, STUN/TURN và signaling an toàn; push notification cần Firebase Cloud Messaging/service worker; AI cần Cloud Functions hoặc backend để giữ API key. Các trang này có giao diện/khung nhưng không giả vờ các dịch vụ này đã hoạt động hoàn chỉnh.

## 2. Chạy thử
Do dùng JavaScript modules và Firebase SDK, không mở file HTML trực tiếp bằng `file://`. Dùng server localhost hoặc GitHub Pages.
Nếu có máy tính cài Python:
```bash
python -m http.server 8080
```
Sau đó mở `http://localhost:8080`.
Trên Android có thể dùng Termux:
```bash
pkg update
pkg install python
cd /duong-dan/CHI-DOI-CHAT
python -m http.server 8080
```
Điện thoại mở `http://127.0.0.1:8080`.

## 3. Đưa lên GitHub Pages
1. Tạo repository GitHub tên `CHI-DOI-CHAT`.
2. Upload toàn bộ thư mục/file trong ZIP lên root của repository (đảm bảo `index.html` ở root).
3. Settings → Pages → Build and deployment → Deploy from a branch → chọn `main` và `/ (root)`.
4. Chờ GitHub Pages cấp URL, ví dụ `https://TEN-GITHUB.github.io/CHI-DOI-CHAT/`.
5. Thêm URL domain đó trong Firebase Authentication → Authorized domains.
6. Kiểm tra Console nếu có lỗi cấu hình hoặc Rules.

## 4. Tạo APK Android
### Cách dễ hơn: đóng gói website bằng Android Studio
1. Đưa website lên GitHub Pages và xác nhận hoạt động HTTPS.
2. Tạo project Android Studio (Empty Views Activity).
3. Dùng Android WebView với JavaScript bật, DOM storage bật và tải URL GitHub Pages.
4. Thêm quyền `INTERNET` trong `AndroidManifest.xml`.
5. Bật xử lý điều hướng, upload file, quyền camera/micro nếu muốn gọi; cần xử lý quyền runtime và HTTPS.
6. Build → Build APK(s).

Ví dụ tối thiểu trong Activity (thay URL của bạn):
```java
WebView webView = findViewById(R.id.webView);
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setDomStorageEnabled(true);
webView.loadUrl("https://TEN-GITHUB.github.io/CHI-DOI-CHAT/");
```
Để phát hành nghiêm túc, ưu tiên Android Trusted Web Activity (TWA) hoặc app native; không cho phép điều hướng WebView tùy ý sang website không tin cậy.

## Tình trạng triển khai
Đây là bản khởi tạo có thể tùy chỉnh. Chat cơ bản, xác thực và một số trang đã có logic; các module nâng cao (WebRTC, Storage uploads, push, AI server, admin workflows, hết hạn Stories, poll voting, mini-games) cần hoàn thiện backend và kiểm thử trước khi dùng thật.
