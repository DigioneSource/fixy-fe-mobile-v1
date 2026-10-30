// Cấu hình an toàn & chính sách đơn hàng TAYZEN.
// Các cờ FEATURE_* đang tắt là tính năng đã dựng sẵn giao diện nhưng backend chưa có API tương ứng
// (xem docs/BACKEND_SAFETY_SPEC.md). Chỉ bật khi backend đã hỗ trợ, tránh hiển thị thứ không có thật.

export const FEATURE_WORKER_GENDER_PREFERENCE = false;
export const FEATURE_CANCELLATION_FEES = false;

// Số khẩn cấp quốc gia
export const EMERGENCY_NUMBERS = [
  { label: 'Công an', number: '113' },
  { label: 'Cấp cứu', number: '115' },
] as const;

// Hotline trực an toàn của TAYZEN — để trống thì ẩn nút gọi hotline.
export const SAFETY_HOTLINE = '';

// KTV chỉ được xác nhận "Đã đến nơi" khi ở trong bán kính này quanh địa chỉ khách.
export const CHECK_IN_RADIUS_METERS = 500;

// Backend: SupportCategory.Dispute = 0, SupportPriority.Urgent = 3
export const SOS_ISSUE_CATEGORY = 0;
export const SOS_ISSUE_PRIORITY = 3;
export const REPORT_ISSUE_PRIORITY_HIGH = 2;

export enum WorkerGenderPreference {
  Any = 0,
  Female = 1,
  Male = 2,
}

export const WORKER_GENDER_OPTIONS = [
  { value: WorkerGenderPreference.Any, label: 'Không yêu cầu' },
  { value: WorkerGenderPreference.Female, label: 'KTV nữ' },
  { value: WorkerGenderPreference.Male, label: 'KTV nam' },
] as const;

// Chính sách huỷ theo trạng thái đơn — CEO chốt 30/10/2026: 30% từ khi KTV xuất phát. Chờ backend áp dụng.
export const CANCELLATION_POLICY = [
  { stage: 'Trước khi KTV nhận đơn', fee: 'Miễn phí' },
  { stage: 'KTV đã nhận, chưa xuất phát', fee: 'Miễn phí' },
  { stage: 'KTV đang di chuyển', fee: '30% giá dịch vụ (phí di chuyển)' },
  { stage: 'KTV đã đến nơi', fee: '30% giá dịch vụ (phí di chuyển)' },
] as const;

export const CUSTOMER_REPORT_REASONS = [
  'Yêu cầu dịch vụ nhạy cảm, trái pháp luật',
  'Quấy rối, động chạm không phù hợp',
  'Đe doạ, bạo lực, say xỉn',
  'Có chất cấm hoặc hành vi đánh bạc',
  'Không thanh toán, gây khó dễ',
  'Lý do khác',
] as const;

export function distanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}
