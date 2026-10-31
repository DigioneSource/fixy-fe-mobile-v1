# Đặc tả backend cho tính năng an toàn TAYZEN (30/10/2026)

App đã dựng sẵn giao diện. Các mục dưới đây cần backend bổ sung rồi mới bật cờ trong
`features/safety/safety-config.ts`.

## Đã chạy được ngay (dùng API sẵn có)

| Tính năng | Màn hình | API dùng |
|---|---|---|
| Nút SOS (gọi 113/115, gửi cảnh báo kèm vị trí, chia sẻ vị trí) | Theo dõi đơn, Chi tiết đơn (khách), Chi tiết công việc (KTV) | `POST /api/bookings/{id}/report-issue` — `category=0 (Dispute)`, `priority=3 (Urgent)`, subject bắt đầu `[SOS]` |
| KTV báo cáo khách vi phạm | Chi tiết công việc (KTV) | `POST /api/bookings/{id}/report-issue` — `priority=2`, subject bắt đầu `[KTV báo cáo khách]` |
| Check-in bằng GPS | Nút "Đã đến nơi" của KTV | Kiểm tra trên app: KTV phải trong bán kính 500 m quanh `booking.lat/lng` mới gọi được `/arrive` |
| Check-out | Có sẵn: `/complete` bắt buộc ảnh hoàn thành | — |

**Việc backend nên làm ngay cho SOS:** ticket có subject `[SOS]` phải đẩy cảnh báo tức thì
(Discord/SMS/gọi điện cho người trực), không chỉ nằm trong hàng đợi hỗ trợ. Đồng thời kiểm tra
khoảng cách GPS ở `/arrive` phía máy chủ, vì kiểm tra trên app có thể bị vượt qua.

## Chờ backend (cờ đang tắt)

### 1. Chọn giới tính KTV — `FEATURE_WORKER_GENDER_PREFERENCE`
- `WorkerProfile` thêm `gender` (0 khác, 1 nữ, 2 nam), khai báo lúc KTV đăng ký và đối chiếu với CCCD.
- `CreateBookingDraftRequest` / `UpdateBookingDraftRequest` thêm `preferredWorkerGender?: int` (0 = không yêu cầu, 1 = nữ, 2 = nam).
- Ghép đơn tự động (`autoMatch`) chỉ gửi đơn cho KTV đúng giới tính khi khách có yêu cầu.

### 2. KTV chấm điểm khách
- `POST /api/bookings/{id}/customer-rating` body `{ rating: 1..5, comment?: string }`, chỉ KTV của đơn, sau khi đơn Completed.
- Trả điểm trung bình của khách trong thông tin đơn cho KTV trước khi nhận việc (`customerRating`, `customerRatingCount`).
- Khách dưới 3 sao hoặc có báo cáo vi phạm thì đưa vào danh sách cần duyệt hoặc khoá.

### 3. Phí huỷ theo trạng thái — `FEATURE_CANCELLATION_FEES`
CEO chốt 30/10/2026:

| Thời điểm huỷ | Phí |
|---|---|
| Trước khi KTV nhận đơn | Miễn phí |
| KTV đã nhận, chưa xuất phát | Miễn phí |
| KTV đang di chuyển | 30% giá dịch vụ |
| KTV đã đến nơi | 30% giá dịch vụ |

- `/cancel` tính phí, trừ ví hoặc hoàn phần còn lại, và trả `cancellationFee` để app hiển thị.
- Một phần phí huỷ chuyển cho KTV như phí di chuyển.

### 4. Hotline an toàn
- CEO sẽ mua số sau. Điền số vào `SAFETY_HOTLINE` khi có người trực 24/7. Khi để trống, app ẩn nút gọi hotline.

## Bảo mật: nhận dạng CCCD qua FPT AI (30/10/2026)

App đã bỏ hẳn đường gọi thẳng `api.fpt.ai` bằng khoá đóng gói trong app. Backend cần thêm:

- `POST /api/worker-profiles/identity-recognition` (multipart, field `image`, yêu cầu đăng nhập vai KTV).
  Backend gọi `https://api.fpt.ai/vision/idr/vnm` bằng khoá lưu ở máy chủ (đang có sẵn cho `verify-face`)
  và trả nguyên JSON của FPT (`errorCode`, `data[]` gồm `id`, `name`, `dob`, `issue_date`, `issue_loc`...).
- Giới hạn tần suất (ví dụ 10 lần/giờ/KTV) để không bị lạm dụng tốn tiền.
- **Đổi khoá FPT AI** nếu từng build app có biến `FPT_AI_API_KEY`: khoá đó coi như đã lộ.

Trước khi có API này, nút quét CCCD sẽ báo "nhập thủ công"; KTV vẫn đăng ký được bằng cách nhập tay.

## Xoá tài khoản (30/10/2026)

App gọi `DELETE /api/user` (đã có trong Swagger). Backend cần bảo đảm:
- Chặn xoá khi còn đơn đang chạy, và trả thông báo lỗi tiếng Việt để app hiển thị nguyên văn.
- Xoá hoặc ẩn danh dữ liệu cá nhân (NĐ 13/2023), giữ lại chứng từ giao dịch theo luật kế toán.
- Thu hồi refresh token của tài khoản.

## Giờ hoạt động & hẹn giờ (CEO chốt 30/10/2026)

- TAYZEN nhận đơn **24/24**, app không giới hạn khung giờ đặt.
- Mỗi KTV tự đặt khung giờ làm việc (lịch tuần + ngày nghỉ trong hồ sơ KTV, API `worker-schedules` có sẵn).
- Khách chọn KTV cụ thể + hẹn giờ: app đã gọi `check-availability` trước khi đặt.
- **Backend cần bảo đảm:** ghép đơn tự động (`autoMatch`) chỉ gửi đơn cho KTV có lịch làm việc phủ
  `scheduledAt` (hoặc thời điểm hiện tại với đơn đặt ngay) và không trùng đơn khác, đồng thời
  `confirmDraft` kiểm tra lại lịch rảnh phía máy chủ.

## Rà soát toàn đội 30/10/2026 — việc backend (đọc từ Swagger, chưa thấy mã backend)

Các mục dưới là **suy luận từ thiết kế API**; đội BE xác nhận từng mục rồi đánh dấu đã có / đã sửa.

### P0
1. **Đặt lại mật khẩu không gắn OTP.** `ResetPasswordRequestDto` chỉ có `{target, newPassword}`.
   `/auth/otp/verify` phải trả `resetToken` dùng một lần (5–10 phút); `/reset-password` và `/register`
   bắt buộc token này. Đổi mật khẩu xong thu hồi mọi refresh token. (App sẽ gửi token khi BE có.)
2. **Điểm khớp khuôn mặt do app gửi.** `/worker-profiles/register` và `me/identification-images` nhận
   `FaceMatchScore` từ client. Bỏ qua giá trị này; máy chủ tự gọi FPT so CCCD–selfie, admin chỉ duyệt khi
   điểm do máy chủ tính đạt ngưỡng.
3. **Webhook thanh toán.** Kiểm chữ ký từng cổng (VNPay `vnp_SecureHash`, PayOS checksum, MoMo
   `signature`, SePay `Apikey` + IP whitelist), đối chiếu `amount`, UNIQUE theo mã giao dịch cổng.
   Tách IPN (ghi tiền) khỏi return URL (chỉ đọc). Hiện app vẫn gọi `GET /payment/callback/vnpay` sau khi
   VNPay chuyển hướng, rồi tự hỏi lại trạng thái đơn — endpoint này phải idempotent.
4. **`POST /api/seed/spa-data` đang có trên production**, Swagger mở công khai. Chỉ bật ở Development.

### P1
5. **IDOR**: kiểm tra chủ sở hữu ở `/worker-schedules/{workerProfileId}/*`, `/worker-profiles/{id}/private`,
   `/Media/{id}` (ảnh CCCD), `/bookings/{id}/tracking|chat/messages`, `GET /bookings?CustomerProfileId=`,
   `GET /api/user`. Viết test chéo tài khoản A gọi tài nguyên của B.
6. **Tiền chạy đồng thời**: `POST /payouts` (số tiền ≤ số dư khả dụng trừ lệnh đang chờ),
   `/wallet/booking/{id}/wallet`, `/vouchers/apply` (`UPDATE … WHERE used < limit` + UNIQUE),
   `Idempotency-Key`. Giá `/propose` phải nằm trong khung min–max của dịch vụ.
7. **Đăng xuất**: thêm `POST /auth/logout` thu hồi refresh token; xoay vòng refresh token; access token ≤ 15 phút.
8. **Dữ liệu trả thừa**: trước khi KTV nhận đơn chỉ trả phường/quận + khoảng cách; từ Confirmed mới trả địa
   chỉ đầy đủ và SĐT; ẩn lại 24 giờ sau Completed. `/tracking` chỉ trả vị trí KTV khi trạng thái 4–6.
9. **Giới hạn tần suất**: gửi OTP 3 lần/15 phút/target+IP, sai OTP 5 lần khoá mã, đăng nhập sai 10 lần/giờ → 429.
10. **`acceptedTerms`**: app đã gửi `{acceptedTerms: true}` khi `confirm` nháp — BE bắt buộc `true` và lưu thời điểm.
11. **Che số điện thoại**: hiện khách và KTV thấy số của nhau. Cần tổng đài số ẩn hoặc chỉ gọi trong
    khoảng từ khi nhận đơn tới 2 giờ sau khi xong (chờ CEO quyết chi phí).
12. **Check-in GPS phía máy chủ**: `/arrive` chưa nhận toạ độ. Thêm body `{lat, lng, accuracy, mocked}`
    và từ chối khi xa hơn 500 m — app sẽ gửi khi BE có.
13. **Thông báo đẩy**: app chưa đăng ký `POST /Notification/fcm-token`; cần thống nhất Expo push hay FCM thuần.

### Pháp lý ảnh hưởng backend
- **Thuế NĐ 117/2025**: nền tảng có chức năng thanh toán phải khấu trừ, nộp thay GTGT 5% + TNCN 2% trên
  doanh thu dịch vụ của KTV. Ví KTV cần tách: doanh thu, phí nền tảng, thuế đã khấu trừ.
- **Hoa hồng**: Swagger không có trường phí nền tảng nào. CEO chốt %, BE trả `platformFee`, `workerNet` mỗi đơn.
- **Lưu đồng ý**: lưu phiên bản điều khoản + thời điểm đồng ý (Luật 91/2025/QH15, NĐ 356/2025).

## Quyết định CEO 31/10/2026 — việc backend

### 1. Phí nền tảng 30% + VAT = 33%
- Mỗi đơn hoàn thành: `platformFee = 30% × giá dịch vụ (trước voucher)`, `platformFeeVat = 10% × platformFee`,
  `workerNet = giá − platformFee − platformFeeVat`. Voucher do TAYZEN chịu, không trừ vào KTV.
- Trả 3 trường này trong chi tiết đơn và trong giao dịch ví KTV. App hiện tự tính **tạm tính** theo
  `features/finance/commission.ts` — khi BE trả trường thật thì app chuyển sang hiển thị số của BE.
- Xuất hoá đơn GTGT cho phần phí nền tảng; khấu trừ thuế KTV theo NĐ 117/2025 là dòng riêng.

### 2. Ký quỹ đơn tiền mặt (40% giá trị đơn)
- `POST /bookings/{id}/accept` với đơn `PaymentMethod.Cash`: nếu `ví KTV < 40% giá đơn` → trả 400
  với thông báo tiếng Việt. Nếu đủ: **tạm giữ** (hold) 33% phí nền tảng ngay trong cùng transaction nhận đơn.
- Đơn huỷ trước khi KTV xuất phát → hoàn phần tạm giữ. Đơn hoàn thành → chuyển tạm giữ thành phí chính thức.
- KTV nạp ký quỹ: app gọi `POST /payment/topup` (VNPay) từ ví KTV — BE cần cho phép vai KTV gọi endpoint này.
- Đơn trả trước (PayOS/VNPay/Ví): không cần ký quỹ; khi hoàn thành chia `workerNet` vào ví KTV.

### 3. Không lộ số điện thoại, gọi qua ứng dụng
- **Ngừng trả** `customerPhone`, `workerPhone`, `worker.phone` trong mọi API đơn/chat cho phía đối tác
  (app đã ẩn nhưng dữ liệu vẫn nằm trong phản hồi API).
- Lọc tin nhắn phía máy chủ ở hub chat: chặn chuỗi ≥ 9 chữ số và từ khoá Zalo/Facebook/Telegram…
  (app đã chặn phía client trong `features/contact/in-app-contact.ts`, có thể vượt qua).
- Gọi thoại trong app — đề xuất Stringee (nhà cung cấp VN, có SDK React Native, gọi app-to-app và
  gọi qua số ẩn):
  - `POST /calls/token` → access token Stringee cho user hiện tại (ký bằng API secret ở máy chủ).
  - `POST /bookings/{id}/call` → kiểm tra người gọi là khách/KTV của đơn, đơn đang ở Confirmed–InProgress
    hoặc ≤ 2 giờ sau Completed; trả `calleeUserId` (không trả số điện thoại).
  - Lưu nhật ký cuộc gọi (thời điểm, thời lượng) để xử lý tranh chấp. Bật cờ `FEATURE_IN_APP_CALL` khi xong.

### 4. Đổi mã ứng dụng sang `vn.tayzen.app`
- **Google Sign-In:** tạo OAuth client mới cho iOS (bundle `vn.tayzen.app`) và Android (package
  `vn.tayzen.app` + SHA-1 của khoá ký EAS), cập nhật `GOOGLE_IOS_CLIENT_ID` trong `eas.json`;
  backend thêm client ID mới vào danh sách audience hợp lệ khi xác minh idToken.
- Slug EAS giữ `fixy-app` (gắn với projectId), không ảnh hưởng người dùng. Scheme mới `tayzen`, giữ `fixy-app` để link cũ vẫn mở app.
- Nếu backend tạo returnUrl cổng thanh toán dạng deep link thì chuyển sang `tayzen://`.

### 5. Đổi tên danh mục dịch vụ trong dữ liệu backend
CEO chốt hạn chế tối đa chữ "massage" (thuế TTĐB 30% xét theo bản chất dịch vụ; tên gọi chỉ giảm rủi ro
nhận diện, không thay đổi bản chất). Tránh cả "trị liệu", "phục hồi chức năng", "vật lý trị liệu" (sát hành nghề y).
Đổi `name` danh mục: "Chăm sóc vai gáy", "Chăm sóc lưng", "Chăm sóc chân", "Chăm sóc da mặt", "Gội đầu dưỡng sinh".
App tạm map tên cũ qua `utils/category-label.ts`. Luật sư cần chốt cách tách gói có/không xoa bóp và hoá đơn riêng.

## Mô hình trung gian như Shopee (CEO chốt 31/10/2026) — việc backend và kế toán

Cơ quan nhà nước xét theo **bản chất**: ai định giá, ai điều phối, ai giữ tiền (NĐ 158/2024 Điều 75 với
gọi xe; vụ Vinasun–Grab 2020; EU C-434/15 Uber). Điều khoản app đã viết lại theo mô hình trung gian
(`features/legal/legal-content.ts` bản 2026-10-31.2) — backend và sổ sách phải khớp với điều khoản.

1. **Giá do KTV quyết** (P0): autoMatch không dùng giá gói do TAYZEN cấu hình; gửi yêu cầu rộng tới các KTV
   phù hợp, mỗi KTV thấy giá của chính mình, khách xác nhận giá trước khi KTV xuất phát. Bỏ giá mặc định
   150.000đ khi KTV chưa đặt giá (`services/api/workers.ts` đang có fallback này — KTV chưa đặt giá thì không hiện).
2. **Không chỉ định, không phạt** (P0): KTV từ chối/bỏ qua đơn không bị trừ điểm, không khoá; không có tỷ lệ
   nhận đơn tối thiểu; không phạt tiền. GPS chỉ dùng cho an toàn, không chấm công/xếp hạng.
3. **Lưu nhật ký bằng chứng trung gian**: KTV đặt giá bao nhiêu, lúc nào; đơn được gửi tới những KTV nào;
   ai nhận/từ chối. Đây là bằng chứng khi bị thanh tra.
4. **Thu hộ**: tiền khách trả qua app ghi là *phải trả KTV*, doanh thu TAYZEN chỉ là phí 30%. Ưu tiên dùng
   dịch vụ thu hộ–chi hộ của PayOS/VNPay hoặc tài khoản thu hộ riêng; đối soát từng đơn
   (tiền vào = phí + VAT phí + thuế khấu trừ + phải trả KTV). Chuyển cho KTV sau 24 giờ khiếu nại.
5. **Hoá đơn**: TAYZEN xuất hoá đơn GTGT phần phí cho KTV; hoá đơn dịch vụ cho khách do KTV xuất hoặc
   TAYZEN lập thay theo uỷ nhiệm (NĐ 70/2025, TT 32/2025) — người bán ghi là KTV.
6. **Tạm giữ tiền** chỉ với đơn đang tranh chấp/nghi gian lận, tối đa 30 ngày.
7. **Ví khách hàng** (chờ CEO + luật sư): giữ số dư nạp trước là dịch vụ ví điện tử cần giấy phép NHNN
   (vốn ≥ 50 tỷ, NĐ 52/2024). Đề xuất tắt nạp ví khách, hoàn tiền về nguồn thanh toán, hoặc đổi thành điểm
   thưởng không quy đổi tiền. Số dư KTV chỉ là sổ công nợ: không chuyển cho người khác, rút về tài khoản chính chủ.
8. **VAT trên phí**: 10% hay 8% (giảm thuế 2026) — kế toán chốt; app đang để 10% ở `features/finance/commission.ts`.
