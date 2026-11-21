// Thông tin chủ sở hữu nền tảng — bắt buộc công khai theo NĐ 248/2026 (nền tảng TMĐT trung gian).
// Để trống thì app hiển thị "Đang cập nhật". Điền khi có số liệu chính thức; khi được Bộ Công Thương
// xác nhận đăng ký, điền moitRegistrationUrl để gắn biểu tượng "Đã đăng ký".
// Chủ sở hữu: HỘ KINH DOANH SANGTQ (CEO chốt 21/11/2026 — tiền chuyển khoản về TK VietinBank
// 101884996650 của HKD). Trước đó (31/10) là CÔNG TY TNHH DIGI FNB, MST 0402211096.
// ⏳ Chờ CEO gửi mã số thuế + địa chỉ kinh doanh theo Giấy chứng nhận đăng ký hộ kinh doanh.
export const COMPANY_INFO = {
  entityType: 'household' as 'company' | 'household',
  companyName: 'HỘ KINH DOANH SANGTQ',
  taxCode: '',
  address: '',
  representative: 'Trần Quang Sang',
  supportEmail: 'kinhdoanh@digifnb.com',
  moitRegistrationNumber: '',
  moitRegistrationUrl: '',
  operatingRulesUrl: '',
} as const;
