# TAYZEN — điểm nối phiên (cập nhật 21/11/2026)

## Trạng thái
| Phần | Ở đâu | Tình trạng |
|---|---|---|
| App (Expo SDK 54) | `~/Git/TAYZEN`, nhánh `feat/tayzen-rebrand-legal` | Đã push. **Không gộp master tới khi hoàn tất.** |
| Backend (.NET 8) | `~/Git/TAYZEN-API`, nhánh `tayzen/self-host-security` (7f141dd) | ✅ **ĐANG CHẠY trên VPS** tại https://api.tayzen.vn (21/11). **Không đụng master** (tự deploy Azure `fixy-api-v1`). |
| VPS | Vnode **AMD MAX 03** (4 vCPU / 6 GB / 70 GB NVMe, Ubuntu 24.04), IP **163.128.43.11**, SSH cổng **8686**, hết hạn 21/11/2027 | User `deploy` + khoá `~/.ssh/tayzen_vps`. Root + mật khẩu SSH ĐÃ TẮT. ufw chỉ mở 8686, fail2ban, tự cập nhật bản vá, swap 4 GB. |
| Website | `~/Git/tayzen-web` → Cloudflare Pages `tayzen` | tayzen.vn + www chạy. |
| Tunnel API | Cloudflare Tunnel `tayzen-api` (a0a95a95-…) | ✅ cloudflared chạy trong compose, api.tayzen.vn → api:8080. |
| EAS | `@digifnb/tayzen` | ✅ 21/11: APK preview đầu tiên XONG (build 120385ec, sau khi sửa patch expo 54.0.38 — ec6248a). iOS chờ Issuer ID. Keystore Android do EAS giữ. |

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

## 21/11 chiều — OTP Zalo, iOS, Firebase, ảnh danh mục
- **OTP qua Zalo ZNS (OA DIGIFNB)**: ERP thêm trạm `POST https://khoahoc.digifnb.com/api/internal/zns/otp` (ERP `e0d3b6a`, đã deploy) — ERP giữ refresh token Zalo DUY NHẤT (token xoay vòng). Backend `4cacd56`: `SmsSettings__Provider=ZnsRelay`, BaseUrl=trạm, ApiKey=khoá chung (ERP env `ZNS_RELAY_KEY_TAYZEN`), SenderId=tayzen. Mẫu ZNS **671211** "TAYZEN - Ma xac thuc tai khoan" (OTP, 400đ/tin, gửi duyệt 21/11 15:16, ERP env ZALO_TAYZEN_OTP_TEMPLATE_ID=671211 ĐÃ ĐẶT). **Khi Zalo duyệt**: trên VPS TAYZEN đặt `SmsSettings__UseMock=false` + `docker compose up -d api`. Trạm hiện trả `chua_co_mau_otp`.
- **iOS**: Issuer ID = `aabafa61-21aa-4a3e-bbd2-9d0b52ba05cf` (khoá Admin SMV6S5K9N9, `~/.config/digifnb/AuthKey_SMV6S5K9N9.p8`). Build bằng `expect` (`/tmp/claude-501/eas-ios.exp` — chọn No ở Push để không đòi Apple ID) + env EXPO_ASC_* + `EXPO_NO_CAPABILITY_SYNC=1`. Đã bật capability PUSH_NOTIFICATIONS cho bundle `CR4C88L2WH` qua ASC API. Đã thêm plugin `@maplibre/maplibre-react-native` (thiếu → "Module MapLibre not found"). ✅ **Bản iOS production ĐẦU TIÊN build ĐẠT** (a5aa0f93, .ipa) sau khi đổi MapLibre sang CocoaPods (patch podspec, 7883071 — SPM gắn 2 target làm archive lỗi chữ ký). **Chưa có hồ sơ app trên App Store Connect** (API không tạo được) → cần tạo tay trên web rồi mới `eas submit` lên TestFlight.
- **Firebase** dự án `tayzen-859af` (tài khoản sangtran.dna, tắt Analytics/Gemini): app Android `vn.tayzen.app` → `google-services.json` trong repo; service account → VPS `secrets/firebase.json` (chown 1654, dir 711) + bản ở `~/.tayzen-secrets/firebase-adminsdk.json`. iOS push qua FCM CHƯA (cần APNs key lên Firebase + SDK messaging).
- **Ảnh danh mục**: 6 biểu tượng Material Symbols màu TAYZEN, nguồn ở Drive `00_BAN_GIAO/2026-11-21_ANH_DANH_MUC_TAYZEN/`, đã tải lên API.
- **Goong**: bản APK chưa có `GOONG_API_KEY`/`GOONG_MAPTILES_API_KEY` (eas.json không đặt) → bản đồ/tìm địa chỉ chưa chạy. Tài khoản Goong = sangtran.dna (cần đăng nhập để tạo khoá riêng TAYZEN).

## 21/11 tối — store
- **App Store Connect**: app TAYZEN `6837625263` (SKU tayzen-ios-001, tiếng Việt). Build iOS 1.0.0 (9) có Goong ĐÃ NỘP lên TestFlight (submission 3abee68c). `eas submit` cần ascApiKeyPath/Id/IssuerId trong eas.json → thêm TẠM khi nộp, không commit (đường dẫn máy Mac).
- **Google Play Console** (Chrome mrsangtms, tài khoản DIGI FNB COMPANY LIMITED): app TAYZEN `4972895379482822376`, gói vn.tayzen.app, miễn phí. ✅ 21/11 15:59 bản 1.0.0 (versionCode 2) ĐÃ PHÁT HÀNH kênh thử nghiệm nội bộ, người thử = danh sách 'Thử nghiệm 01' (9 người). Link tham gia: https://play.google.com/apps/internaltest/4700876203618359921 . Tải AAB: CEO kéo thả (file 95MB > giới hạn 10MB của công cụ Chrome; dùng SA ChonDiem cho TAYZEN bị chặn — cần SA riêng nếu muốn tự đẩy).
- **Goong**: khoá `tayzen-app` (API) + `tayzen-maptiles` trên tài khoản sangtran.dna; lưu ở biến EAS (development/preview/production, sensitive). eas.json đã gắn `environment` cho từng profile — thiếu cái này EAS KHÔNG nạp biến.

## 21/11 tối — đổi PayOS → SePay (chuyển khoản QR)
- Backend `dcc67ff` (đã deploy): PaymentMethod.SePay=6 "Chuyển khoản QR". Tạo thanh toán → mã nội dung `TZ`+10 số (PaymentOrder.GatewayOrderCode) + link ảnh `qr.sepay.vn/img?...`. Webhook `POST https://api.tayzen.vn/api/payment/webhook/sepay` (header `Authorization: Apikey <SePay__WebhookToken>` — token ĐÃ sinh trong .env VPS): TransferType=in → khớp mã + ĐÚNG số tiền → Paid; out → đối soát chi trả cũ. 56/56 test.
- App `a4feac5`: `components/payment/sepay-qr-modal.tsx`; checkout/chi tiết đơn mặc định SePay, chỉ còn SePay/Tiền mặt/Ví; KTV nạp số dư qua QR. Thêm expo-clipboard → CẦN BUILD MỚI.
- ⚠️ 21/11 bẫy: VietinBank cá nhân/HKD CHỈ đẩy giao dịch sang SePay khi nội dung chứa **SEVQR** → backend caa968c: nội dung = `SEVQR TZxxxxxxxxxx` (SePay__ContentPrefix). Lần CK thử 1 (TZ5267727872, thiếu SEVQR) SePay không thấy — tiền vẫn vào TK HKD, đơn cọc đó để Pending.
- ✅ 21/11 14:40 (giờ VN 21:40) SePay CHẠY THẬT: CK 10.000đ "SEVQR TZ5271992867" → webhook → ví KTV thử nghiệm +10.000đ + thông báo "Nạp số dư bảo đảm thành công".
- CEO 21/11: BỎ cọc kích hoạt KTV (IsDepositPaid) — caa968c. KTV thử nghiệm 0900000222 (mật khẩu ~/.tayzen-secrets/ktv-thu-nghiem.txt), dịch vụ vai gáy 10.000đ, Hải Châu — XOÁ sau khi test.
- CEO chốt 21/11: tiền về **tài khoản HKD SangTQ** (hộ kinh doanh, không phải TK công ty DIGI FNB).
- 21/11: VPS đã điền SePay__BankCode=VietinBank, AccountNumber=101884996650, AccountName=HO KINH DOANH SANGTQ. ✅ Webhook SePay 'TAYZEN thanh toan' (#74780) ĐÃ TẠO: TK ****6650, Có tiền vào, JSON, tự gửi lại; Gửi thử → HTTP 200 (khoá khớp). CEO đã dán API key từ `~/.tayzen-secrets/sepay-webhook-token.txt` (Claude không được gõ khoá vào web).
- Pháp nhân đổi sang **HỘ KINH DOANH SANGTQ** (app 50adbe4, web a4d21f4 đã deploy; LEGAL_VERSION 2026-11-21.1). Còn [__]: MST, số/ngày/nơi cấp GCN ĐKHKD, địa chỉ kinh doanh. ✅ CEO 21/11: phí = **30% + GTGT 8% = 32,4%** (backend 029cee5 đã deploy, app 801374e, web; ký quỹ tiền mặt vẫn 40%). CEO: HKD chỉ để TEST, ổn thì chuyển sang công ty DIGI FNB (đổi lại company-info, Quy chế, TK SePay). ⚠️ Còn cần luật sư: nghĩa vụ khấu trừ thuế KTV, HKD có được đứng tên nền tảng TMĐT trung gian; Apple/Google đứng tên DIGI FNB.
- **Còn thiếu (cũ)**: điền `SePay__BankCode/AccountNumber/AccountName` trên VPS (chưa điền → app báo "phương thức tạm chưa dùng được") + tạo webhook trên my.sepay.vn (tài khoản sangtran.dna) trỏ URL trên, kiểu xác thực API Key = token trong .env VPS, chỉ giao dịch tiền vào.

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
