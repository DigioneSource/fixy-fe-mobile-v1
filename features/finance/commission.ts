// Phí dịch vụ nền tảng & số dư bảo đảm của KTV — CEO chốt 31/10/2026 (mô hình trung gian: TAYZEN thu hộ, chỉ phí là doanh thu).
// Backend là nơi tính chính thức; app chỉ hiển thị tạm tính và chặn sớm ở phía KTV.

/** Phí nền tảng chưa thuế. */
export const PLATFORM_FEE_RATE = 0.3;
/** Thuế GTGT trên phí nền tảng. */
export const PLATFORM_FEE_VAT_RATE = 0.1;
/** Tổng KTV trả nền tảng, đã gồm thuế: 30% × 1,1 = 33%. */
export const PLATFORM_FEE_TOTAL_RATE = PLATFORM_FEE_RATE * (1 + PLATFORM_FEE_VAT_RATE);

/**
 * Đơn tiền mặt: số dư bảo đảm tối thiểu 40% giá đơn (gói 500k → 200k)
 * = phí nền tảng 33% (gồm VAT) + thuế GTGT 5% và TNCN 2% TAYZEN khấu trừ, nộp thay cho KTV.
 */
export const WORKER_CASH_DEPOSIT_RATE = 0.4;

export function calcCommission(servicePrice: number) {
  const price = Math.max(0, Math.round(servicePrice || 0));
  const fee = Math.round(price * PLATFORM_FEE_RATE);
  const vat = Math.round(fee * PLATFORM_FEE_VAT_RATE);
  const total = fee + vat;
  return { price, fee, vat, total, workerNet: price - total };
}

/** Số dư ví tối thiểu để KTV nhận một đơn tiền mặt, làm tròn lên nghìn đồng. */
export function requiredCashDeposit(servicePrice: number) {
  return Math.ceil((Math.max(0, servicePrice || 0) * WORKER_CASH_DEPOSIT_RATE) / 1000) * 1000;
}

export const formatPercent = (rate: number) => `${Math.round(rate * 100)}%`;
