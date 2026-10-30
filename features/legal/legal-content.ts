// Nội dung pháp lý hiển thị khi đăng ký và khi đặt đơn.
// Bản nháp nội bộ — cần luật sư rà soát trước khi phát hành chính thức.

export const LEGAL_VERSION = '2026-10-30';

export const LAW_VIOLATION_NOTICE = 'Nghiêm cấm mọi hành vi vi phạm pháp luật';

export type LegalSection = Readonly<{
  title: string;
  items: string[];
}>;

export const REGISTRATION_TERMS: LegalSection[] = [
  {
    title: '1. Vai trò của TAYZEN',
    items: [
      'TAYZEN là nền tảng công nghệ trung gian, kết nối Khách hàng với Kỹ thuật viên (KTV) và cơ sở Spa đối tác. TAYZEN không trực tiếp cung cấp dịch vụ.',
      'KTV và cơ sở Spa là đối tác độc lập, tự chịu trách nhiệm về chuyên môn, điều kiện hành nghề, thái độ và hành vi của mình khi cung cấp dịch vụ.',
    ],
  },
  {
    title: '2. Nghiêm cấm mọi hành vi vi phạm pháp luật',
    items: [
      'Dịch vụ trên TAYZEN chỉ gồm chăm sóc sức khoẻ, thư giãn và làm đẹp, hoàn toàn không nhạy cảm.',
      'Nghiêm cấm: mua bán dâm, môi giới hoặc yêu cầu dịch vụ tình dục; quấy rối, xâm hại thân thể; sử dụng, tàng trữ, mua bán chất cấm; đánh bạc; bạo lực, đe doạ; lừa đảo, chiếm đoạt tài sản; và mọi hành vi khác trái pháp luật Việt Nam.',
      'Khi phát hiện vi phạm, TAYZEN có quyền khoá tài khoản vĩnh viễn, huỷ đơn không hoàn tiền, giữ lại số dư liên quan và cung cấp thông tin cho cơ quan chức năng theo quy định.',
    ],
  },
  {
    title: '3. Trách nhiệm của người dùng',
    items: [
      'Người dùng phải đủ 18 tuổi, cung cấp thông tin chính xác và tự bảo mật tài khoản, mật khẩu, mã OTP.',
      'Người dùng chịu hoàn toàn trách nhiệm trước pháp luật về mọi hoạt động thực hiện qua tài khoản của mình.',
      'KTV cam kết có đủ giấy tờ tuỳ thân, chứng chỉ, điều kiện hành nghề và tự thực hiện nghĩa vụ thuế với thu nhập của mình.',
    ],
  },
  {
    title: '4. Miễn trừ trách nhiệm',
    items: [
      'Trong phạm vi pháp luật cho phép, TAYZEN không chịu trách nhiệm đối với thiệt hại phát sinh từ: hành vi vi phạm pháp luật hoặc vi phạm điều khoản của Khách hàng, KTV hay bên thứ ba; thông tin sai lệch do người dùng cung cấp; tình trạng sức khoẻ không được khai báo; giao dịch, thanh toán hoặc thoả thuận ngoài ứng dụng.',
      'TAYZEN không bảo đảm kết quả điều trị hay hiệu quả y khoa của dịch vụ. Dịch vụ không thay thế chẩn đoán và điều trị của cơ sở y tế.',
      'TAYZEN không chịu trách nhiệm khi gián đoạn dịch vụ do sự kiện bất khả kháng, sự cố mạng, hệ thống thanh toán hoặc nhà cung cấp bên thứ ba.',
    ],
  },
  {
    title: '5. Dữ liệu cá nhân',
    items: [
      'Dữ liệu cá nhân (họ tên, số điện thoại, địa chỉ, vị trí, giấy tờ tuỳ thân của KTV) được thu thập và xử lý để cung cấp dịch vụ, bảo đảm an toàn và theo Nghị định 13/2023/NĐ-CP.',
      'TAYZEN có thể lưu nội dung trò chuyện và lịch sử đơn để giải quyết khiếu nại và phòng chống vi phạm.',
    ],
  },
];

export const BOOKING_COMMITMENTS: string[] = [
  'Tôi chỉ đặt dịch vụ chăm sóc sức khoẻ, thư giãn, làm đẹp không nhạy cảm và không yêu cầu KTV làm việc ngoài phạm vi dịch vụ.',
  'Tôi cam kết không thực hiện, không yêu cầu bất kỳ hành vi vi phạm pháp luật nào, bao gồm quấy rối, mua bán dâm, sử dụng chất cấm.',
  'Tôi đã khai báo đúng tình trạng sức khoẻ (mang thai, bệnh tim mạch, huyết áp, chấn thương, dị ứng…). TAYZEN và KTV không chịu trách nhiệm với rủi ro do thông tin không được khai báo.',
  'KTV có quyền dừng phục vụ ngay khi bị xúc phạm, quấy rối hoặc gặp nguy hiểm; khi đó đơn không được hoàn tiền và tài khoản có thể bị khoá.',
  'Tôi chỉ thanh toán qua TAYZEN. TAYZEN không chịu trách nhiệm với mọi giao dịch, thoả thuận ngoài ứng dụng.',
];
