// Nội dung pháp lý hiển thị khi đăng ký và khi đặt đơn.
// Bản nháp nội bộ — cần luật sư rà soát trước khi phát hành chính thức.

export const LEGAL_VERSION = '2026-10-31.1';

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
      'Khi vi phạm đã được TAYZEN xác minh, TAYZEN có quyền khoá tài khoản vĩnh viễn, huỷ đơn và không hoàn tiền cho bên vi phạm, tạm giữ số dư liên quan trực tiếp đến vi phạm và cung cấp thông tin cho cơ quan chức năng theo quy định.',
      'Khách hàng có quyền khiếu nại qua mục Hỗ trợ trong ứng dụng; TAYZEN phản hồi trong 03 ngày làm việc.',
    ],
  },
  {
    title: '3. Trách nhiệm của người dùng',
    items: [
      'Người dùng phải đủ 18 tuổi, cung cấp thông tin chính xác và tự bảo mật tài khoản, mật khẩu, mã OTP.',
      'Người dùng chịu hoàn toàn trách nhiệm trước pháp luật về mọi hoạt động thực hiện qua tài khoản của mình.',
      'KTV cam kết có đủ giấy tờ tuỳ thân, chứng chỉ và điều kiện hành nghề.',
      'TAYZEN khấu trừ và nộp thay thuế GTGT, TNCN trên doanh thu mỗi đơn của KTV theo Nghị định 117/2025/NĐ-CP và cấp chứng từ khấu trừ khi KTV yêu cầu.',
    ],
  },
  {
    title: '3a. Phí nền tảng, ký quỹ và liên lạc trong ứng dụng',
    items: [
      'KTV trả TAYZEN phí nền tảng bằng 30% giá dịch vụ (chưa gồm thuế GTGT), tức 33% sau thuế. Voucher, khuyến mãi do TAYZEN phát hành không trừ vào thu nhập KTV.',
      'Với đơn khách thanh toán tiền mặt, ví KTV phải có số dư ký quỹ tối thiểu 40% giá trị đơn tại thời điểm nhận đơn; TAYZEN tạm thu phí nền tảng từ ví khi KTV nhận đơn. Phần ký quỹ chưa dùng được rút theo quy định rút tiền.',
      'Khách hàng và KTV chỉ liên lạc qua tính năng nhắn tin, gọi trong ứng dụng; TAYZEN không hiển thị số điện thoại của hai bên. Nghiêm cấm trao đổi số điện thoại, tài khoản mạng xã hội hoặc thoả thuận giao dịch ngoài ứng dụng. Vi phạm có thể bị khoá tài khoản và mất quyền được TAYZEN hỗ trợ, bảo vệ.',
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
      'Dữ liệu cá nhân (họ tên, số điện thoại, địa chỉ, vị trí, giấy tờ tuỳ thân của KTV) được thu thập và xử lý để cung cấp dịch vụ, bảo đảm an toàn và theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Chi tiết xem Chính sách bảo mật.',
      'TAYZEN có thể lưu nội dung trò chuyện và lịch sử đơn để giải quyết khiếu nại và phòng chống vi phạm.',
    ],
  },
];

export const BOOKING_COMMITMENTS: string[] = [
  'Tôi chỉ đặt dịch vụ chăm sóc sức khoẻ, thư giãn, làm đẹp không nhạy cảm và không yêu cầu KTV làm việc ngoài phạm vi dịch vụ.',
  'Tôi cam kết không thực hiện, không yêu cầu bất kỳ hành vi vi phạm pháp luật nào, bao gồm quấy rối, mua bán dâm, sử dụng chất cấm.',
  'Tôi đã khai báo đúng tình trạng sức khoẻ (mang thai, bệnh tim mạch, huyết áp, chấn thương, dị ứng…). TAYZEN và KTV không chịu trách nhiệm với rủi ro do thông tin không được khai báo.',
  'KTV có quyền dừng phục vụ ngay khi bị xúc phạm, quấy rối hoặc gặp nguy hiểm; khi đó TAYZEN sẽ xem xét bằng chứng trong 03 ngày làm việc; nếu Khách hàng vi phạm, đơn không được hoàn tiền và tài khoản có thể bị khoá.',
  'Tôi chỉ thanh toán qua TAYZEN. TAYZEN không chịu trách nhiệm với mọi giao dịch, thoả thuận ngoài ứng dụng.',
];

export const PRIVACY_POLICY: LegalSection[] = [
  {
    title: '1. Dữ liệu TAYZEN thu thập',
    items: [
      'Họ tên, số điện thoại hoặc email, địa chỉ phục vụ.',
      'Vị trí của thiết bị khi bạn đang dùng dịch vụ hoặc khi bấm nút SOS.',
      'Với KTV: thêm ảnh căn cước công dân (CCCD), chứng chỉ nghề và ảnh làm việc thực tế.',
    ],
  },
  {
    title: '2. Mục đích xử lý',
    items: [
      'Ghép đơn giữa Khách hàng và KTV, hiển thị lộ trình và trạng thái đơn.',
      'Bảo đảm an toàn cho hai bên, xử lý tình huống khẩn cấp khi có SOS.',
      'Thanh toán, đối soát và khấu trừ, kê khai thuế theo quy định.',
      'Phối hợp với cơ quan chức năng khi có sự cố hoặc khi có yêu cầu hợp pháp.',
    ],
  },
  {
    title: '3. Bên nhận dữ liệu',
    items: [
      'FPT Smart Cloud: nhận dạng tự động thông tin trên ảnh CCCD của KTV.',
      'Cổng thanh toán PayOS, VNPay: xử lý giao dịch thanh toán.',
      'Cơ quan nhà nước có thẩm quyền khi pháp luật yêu cầu.',
      'TAYZEN không bán dữ liệu cá nhân của bạn cho bất kỳ ai.',
    ],
  },
  {
    title: '4. Thời hạn lưu trữ',
    items: [
      'Dữ liệu được lưu trong thời gian bạn sử dụng dịch vụ.',
      'Chứng từ thanh toán, thuế được lưu theo thời hạn mà pháp luật kế toán, thuế yêu cầu.',
    ],
  },
  {
    title: '5. Quyền của bạn',
    items: [
      'Xem, sửa thông tin cá nhân trong mục Hồ sơ.',
      'Rút lại sự đồng ý xử lý dữ liệu bất kỳ lúc nào; việc rút lại có thể khiến một số tính năng không dùng được.',
      'Xoá tài khoản ngay trong ứng dụng: Hồ sơ → Xoá tài khoản.',
    ],
  },
  {
    title: '6. Căn cứ pháp lý và liên hệ',
    items: [
      'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP.',
      'Mọi câu hỏi, yêu cầu về dữ liệu cá nhân xin gửi qua mục Hỗ trợ trong ứng dụng.',
    ],
  },
];
