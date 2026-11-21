# TAYZEN — điểm nối phiên (cập nhật 21/11/2026)

## Trạng thái
| Phần | Ở đâu | Tình trạng |
|---|---|---|
| App (Expo SDK 54) | `~/Git/TAYZEN`, nhánh `feat/tayzen-rebrand-legal` | Đã push. **Không gộp master tới khi hoàn tất.** |
| Backend (.NET 8) | `~/Git/TAYZEN-API`, nhánh `tayzen/self-host-security` (7f141dd) | ✅ **ĐANG CHẠY trên VPS** tại https://api.tayzen.vn (21/11). **Không đụng master** (tự deploy Azure `fixy-api-v1`). |
| VPS | Vnode **AMD MAX 03** (4 vCPU / 6 GB / 70 GB NVMe, Ubuntu 24.04), IP **163.128.43.11**, SSH cổng **8686**, hết hạn 21/11/2027 | User `deploy` + khoá `~/.ssh/tayzen_vps`. Root + mật khẩu SSH ĐÃ TẮT. ufw chỉ mở 8686, fail2ban, tự cập nhật bản vá, swap 4 GB. |
| Website | `~/Git/tayzen-web` → Cloudflare Pages `tayzen` | tayzen.vn + www chạy. |
| Tunnel API | Cloudflare Tunnel `tayzen-api` (a0a95a95-…) | ✅ cloudflared chạy trong compose, api.tayzen.vn → api:8080. |
| EAS | `@digifnb/tayzen` | 21/11: build Android preview (APK) đầu tiên. iOS chờ Issuer ID. Keystore Android do EAS giữ. |

## Vận hành VPS
- Vào máy: `ssh -i ~/.ssh/tayzen_vps -p 8686 deploy@163.128.43.11` → `cd /opt/tayzen/TAYZEN-API`.
- Mã KHÔNG kéo từ GitHub (không cần deploy key): repo trên VPS nhận push trực tiếp
  `GIT_SSH_COMMAND="ssh -i ~/.ssh/tayzen_vps -p 8686" git push ssh://deploy@163.128.43.11/opt/tayzen/TAYZEN-API tayzen/self-host-security:main`
  (receive.denyCurrentBranch=updateInstead → cây làm việc tự cập nhật). Rồi làm theo `deploy/README.md` mục 11 (backup → build → migrate → up -d).
- `.env` chỉ nằm trên VPS (chmod 600): mật khẩu sa/app/redis/JWT sinh ngẫu nhiên, token tunnel lấy qua API Cloudflare. **SMS đang Mock** (`SmsSettings__UseMock=true`, OTP chỉ hiện trong `docker compose logs api`) → phải đổi trước khi mở cho khách.
- Admin API: `admin@tayzen.vn`, mật khẩu ở `~/.tayzen-secrets/admin-api.txt` (máy Mac, chmod 600). `admin@fixy.com` đã bị vô hiệu (đổi email + mật khẩu).
- Sao lưu: `/etc/cron.d/tayzen-backup` 02:30 hằng đêm → `backups/mssql`, `backups/uploads`, giữ 7 ngày. Chưa có bản sao ngoài VPS (rclone → R2/Drive: việc nên làm).
- Đã nạp 6 danh mục (không ảnh): Chăm sóc vai gáy, Chăm sóc lưng, Chăm sóc chân, Chăm sóc da mặt, Gội đầu dưỡng sinh, Làm móng.
- Đã kiểm 21/11: /health Healthy; OTP → verify → register → login chạy; verifyToken dùng lại bị chặn; tài khoản thử đã xoá.

## Đang chờ CEO
1. **Issuer ID** App Store Connect (khoá Admin `AuthKey_SMV6S5K9N9.p8`, Team 4AD7CC757B) → build iOS/TestFlight.
2. Khoá dịch vụ đứng tên DIGI FNB: **SMS OTP** (bắt buộc trước khi mở khách), payOS, SMTP (Oxmail), Firebase (push), Goong, VNPay.
3. Ảnh cho 6 danh mục (hoặc cho phép dùng ảnh minh hoạ).
4. OAuth Google mới cho `vn.tayzen.app` (SHA-1 keystore EAS) — Google login tạm dùng client cũ của FIXY.

## Sau đó
Luật sư duyệt điều khoản/HĐ KTV; điền 33 chỗ `[__]` trong Quy chế; đăng ký sàn TMĐT trung gian (online.gov.vn); tên người đại diện; `hotro@tayzen.vn` trên Oxmail; web `PUBLISHED=1` khi luật sư duyệt; tắt Swagger production.

## Hạn chế đã biết (backend)
Phí huỷ đơn tiền mặt chỉ ghi số phải thu; hoàn tiền về ví khách (chưa về nguồn); chưa lọc SĐT trong chat phía máy chủ; `propose` giá chưa lưu; chưa có API OCR CCCD (`identity-recognition`).

Báo cáo bàn giao: `~/Git/ERP-DIGIFNB/_DRIVE_QUANTRI/00_BAN_GIAO/2026-10-31_*TAYZEN*`.
