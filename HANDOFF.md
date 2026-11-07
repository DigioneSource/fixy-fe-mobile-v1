# TAYZEN — điểm nối phiên (cập nhật 07/11/2026)

## Trạng thái
| Phần | Ở đâu | Tình trạng |
|---|---|---|
| App (Expo SDK 54) | `~/Git/TAYZEN`, nhánh `feat/tayzen-rebrand-legal` (9dcc109) | Đã push. **Không gộp master tới khi hoàn tất.** |
| Backend (.NET 8) | `~/Git/TAYZEN-API`, nhánh `tayzen/self-host-security` (7f141dd) | Đã push, 35/35 test. **Không đụng master** (tự deploy Azure `fixy-api-v1`). |
| Website | `~/Git/tayzen-web` (git local) → Cloudflare Pages `tayzen` | tayzen.vn + www đang chạy. |
| Tunnel API | Cloudflare Tunnel `tayzen-api` (a0a95a95-a9fa-4312-a0be-6209e0b41af1) | DNS `api.tayzen.vn` đã trỏ; chờ VPS chạy cloudflared. |
| EAS | `@digifnb/tayzen` (b99d7065-214f-4bf4-973e-6b96e31b2fb6) | Chưa build. App gọi `https://api.tayzen.vn/api`. |

⚠️ App mới bắt buộc backend mới (`verifyToken` ở đăng ký/đặt lại mật khẩu) — không build TestFlight trỏ Azure cũ.

## Đang chờ CEO
1. **VPS**: x86_64 (không ARM — SQL Server), 4 vCPU / 8 GB (tối thiểu 2/4), 80 GB NVMe, Ubuntu 24.04, datacenter Việt Nam, bật snapshot. Máy riêng, không chung VPS ChonDiem. Lúc tạo dán khoá công khai `~/.ssh/tayzen_vps.pub` → gửi IP, cổng, user.
2. **Issuer ID** App Store Connect (khoá Admin `AuthKey_SMV6S5K9N9.p8`, Team 4AD7CC757B).
3. Khoá dịch vụ đứng tên DIGI FNB: payOS, SMS OTP, SMTP (Oxmail), Firebase, Goong, VNPay.

## Việc tiếp khi có VPS (theo `TAYZEN-API/deploy/README.md`)
1. `ssh -i ~/.ssh/tayzen_vps <user>@<IP>` → cài Docker, `ufw` chỉ mở SSH (HTTPS đi qua tunnel).
2. Clone nhánh `tayzen/self-host-security`, tạo `.env` từ `.env.example` **trên VPS** (token tunnel: Zero Trust → Networks → Tunnels → tayzen-api). Không commit bí mật.
3. `docker compose up -d` → `deploy/migrate.sh` → **ngay lập tức** `deploy/set-admin-password.sh` (seeder có `admin@fixy.com` mật khẩu ghi cứng) → seed danh mục.
4. Kiểm `https://api.tayzen.vn/health`, chạy thử đăng ký OTP → đặt đơn.
5. EAS: iOS → TestFlight; Android → Play thử nội bộ (app mới `vn.tayzen.app`); tạo OAuth Google mới (SHA-1).

## Sau đó
Luật sư duyệt điều khoản/HĐ KTV; điền 33 chỗ `[__]` trong Quy chế; đăng ký sàn TMĐT trung gian (online.gov.vn); tên người đại diện; `hotro@tayzen.vn` trên Oxmail; web `PUBLISHED=1` khi luật sư duyệt.

## Hạn chế đã biết (backend)
Phí huỷ đơn tiền mặt chỉ ghi số phải thu; hoàn tiền về ví khách (chưa về nguồn); chưa lọc SĐT trong chat phía máy chủ; `propose` giá chưa lưu; chưa có API OCR CCCD (`identity-recognition`).

Báo cáo bàn giao: `~/Git/ERP-DIGIFNB/_DRIVE_QUANTRI/00_BAN_GIAO/2026-10-31_*TAYZEN*`.
