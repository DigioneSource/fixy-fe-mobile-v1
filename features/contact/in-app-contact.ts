import { Alert } from 'react-native';

// CEO chốt 31/10/2026: khách và KTV KHÔNG thấy số điện thoại của nhau, chỉ liên lạc trong app
// để tránh giao dịch ngoài nền tảng và bảo vệ KTV. Gọi thoại trong app cần backend cấp token
// VoIP (xem docs/BACKEND_SAFETY_SPEC.md) — bật cờ khi đã tích hợp.
export const FEATURE_IN_APP_CALL = false;

export function startInAppCall(options: { partnerLabel: string; onOpenChat: () => void }) {
  if (FEATURE_IN_APP_CALL) {
    // Chỗ gắn SDK gọi thoại khi backend sẵn sàng.
    return;
  }
  Alert.alert(
    `Liên hệ ${options.partnerLabel}`,
    'Để bảo vệ thông tin của cả hai bên, TAYZEN không hiển thị số điện thoại. Vui lòng nhắn tin trong ứng dụng; tính năng gọi qua ứng dụng sắp ra mắt. Nếu gặp nguy hiểm, hãy bấm nút SOS.',
    [
      { text: 'Đóng', style: 'cancel' },
      { text: 'Nhắn tin', onPress: options.onOpenChat },
    ]
  );
}

const CONTACT_KEYWORDS = /(zalo|za\s*lo|facebook|fb\.com|messenger|telegram|viber|whatsapp|instagram|tiktok\.com)/i;

/** Phát hiện tin nhắn chứa số điện thoại hoặc kênh liên lạc ngoài app. */
export function containsContactInfo(text: string) {
  // ≥ 9 chữ số liền nhau (cho phép dấu cách, chấm, gạch ở giữa): số điện thoại hoặc số tài khoản.
  // Giá tiền như "1.500.000" chỉ 7 chữ số nên không bị chặn.
  const phoneLike = /\d(?:[\s.\-]?\d){8,}/.test(text);
  return phoneLike || CONTACT_KEYWORDS.test(text);
}

export const CONTACT_BLOCKED_MESSAGE =
  'Tin nhắn có số điện thoại hoặc kênh liên lạc ngoài ứng dụng. Để được TAYZEN bảo vệ (thanh toán, bảo hiểm sự cố, SOS), vui lòng chỉ trao đổi trong ứng dụng.';
