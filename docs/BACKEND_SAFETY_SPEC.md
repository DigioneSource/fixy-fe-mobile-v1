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
