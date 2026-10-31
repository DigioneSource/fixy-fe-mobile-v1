// Thông tin chủ sở hữu nền tảng — bắt buộc công khai theo NĐ 248/2026 (nền tảng TMĐT trung gian).
// Để trống thì app hiển thị "Đang cập nhật". Điền khi có số liệu chính thức; khi được Bộ Công Thương
// xác nhận đăng ký, điền moitRegistrationUrl để gắn biểu tượng "Đã đăng ký".
export const COMPANY_INFO = {
  companyName: '',
  taxCode: '',
  address: '',
  representative: '',
  supportEmail: '',
  moitRegistrationNumber: '',
  moitRegistrationUrl: '',
  operatingRulesUrl: '',
} as const;
