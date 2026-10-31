// Nội dung pháp lý hiển thị khi đăng ký và khi đặt đơn.
// Bản nháp nội bộ — cần luật sư rà soát trước khi phát hành chính thức.

export const LEGAL_VERSION = '2026-10-31.2';

export const LAW_VIOLATION_NOTICE = 'Nghiêm cấm mọi hành vi vi phạm pháp luật';

export type LegalSection = Readonly<{
  title: string;
  items: string[];
}>;

export const REGISTRATION_TERMS: LegalSection[] = [
  {
    title: '1. Vai trò của TAYZEN',
    items: [
      'TAYZEN là nền tảng thương mại điện tử trung gian theo Luật Thương mại điện tử số 122/2025/QH15. TAYZEN cung cấp hạ tầng công nghệ để Kỹ thuật viên (KTV) tự giới thiệu và cung ứng dịch vụ của mình, và để Khách hàng tìm, đặt và thanh toán dịch vụ đó.',
      'TAYZEN không cung ứng dịch vụ chăm sóc cho Khách hàng, không phải là bên bán dịch vụ, không phải người sử dụng lao động, đại lý hay người đại diện của KTV. Hợp đồng dịch vụ được giao kết trực tiếp giữa Khách hàng và KTV ngay khi KTV chấp nhận yêu cầu đặt dịch vụ.',
      'KTV là cá nhân hoặc hộ kinh doanh độc lập. KTV tự quyết định có nhận việc hay không, thời gian làm việc, giá dịch vụ, cách thực hiện, và tự chịu trách nhiệm về chuyên môn, chất lượng, điều kiện hành nghề, giấy phép (nếu pháp luật yêu cầu), nghĩa vụ thuế của mình, thái độ và hành vi khi cung ứng dịch vụ.',
      'Giữa TAYZEN và KTV không phát sinh quan hệ lao động. KTV không chịu sự quản lý, điều hành, giám sát của TAYZEN về giờ làm, ca trực, số đơn tối thiểu hay đồng phục. KTV được từ chối hoặc bỏ qua yêu cầu mà không bị trừ điểm hay khoá tài khoản.',
    ],
  },
  {
    title: '1a. Giá dịch vụ',
    items: [
      'Giá dịch vụ do KTV tự niêm yết trên hồ sơ của mình. KTV có thể đề xuất giá khác cho từng yêu cầu qua chức năng "Báo giá khác"; giá chỉ có hiệu lực khi Khách hàng đồng ý.',
      'TAYZEN không ấn định giá, không đặt giá tối đa hay tối thiểu. TAYZEN có thể hiển thị mức giá tham khảo; mức này không ràng buộc.',
      'Voucher, mã giảm giá do TAYZEN phát hành là chi phí khuyến mại của TAYZEN. KTV vẫn nhận đủ giá đã niêm yết hoặc đã báo, trừ phí dịch vụ nền tảng.',
    ],
  },
  {
    title: '2. Nghiêm cấm mọi hành vi vi phạm pháp luật',
    items: [
      'Dịch vụ do KTV đăng trên TAYZEN chỉ được gồm chăm sóc thư giãn và làm đẹp không nhạy cảm, đúng mô tả đã công khai.',
      'Nghiêm cấm: mua bán dâm, môi giới hoặc yêu cầu dịch vụ tình dục; quấy rối, xâm hại thân thể; sử dụng, tàng trữ, mua bán chất cấm; đánh bạc; bạo lực, đe doạ; lừa đảo, chiếm đoạt tài sản; và mọi hành vi khác trái pháp luật Việt Nam.',
      'Khi có vi phạm đã được xác minh theo Quy chế hoạt động, TAYZEN có thể: gỡ dịch vụ, tạm ngưng hoặc chấm dứt tài khoản, và cung cấp thông tin cho cơ quan có thẩm quyền. TAYZEN không phạt tiền KTV.',
      'TAYZEN chỉ tạm giữ khoản tiền thu hộ của đơn đang có tranh chấp hoặc có dấu hiệu gian lận, trong tối đa 30 ngày hoặc đến khi cơ quan có thẩm quyền có quyết định. Khoản tạm giữ được trả cho bên có quyền ngay khi có kết quả.',
      'Người dùng có quyền khiếu nại mọi quyết định khoá tài khoản hoặc tạm giữ tiền qua mục Hỗ trợ. TAYZEN phản hồi trong 03 ngày làm việc.',
    ],
  },
  {
    title: '3. Trách nhiệm của người dùng',
    items: [
      'Người dùng phải đủ 18 tuổi, cung cấp thông tin chính xác và tự bảo mật tài khoản, mật khẩu, mã OTP.',
      'Người dùng chịu hoàn toàn trách nhiệm trước pháp luật về mọi hoạt động thực hiện qua tài khoản của mình.',
      'KTV cam kết có đủ giấy tờ tuỳ thân, chứng chỉ, điều kiện hành nghề và giấy phép mà pháp luật yêu cầu đối với dịch vụ mình đăng. TAYZEN chỉ xác minh giấy tờ theo nghĩa vụ của chủ nền tảng; việc xác minh không phải là bảo đảm về chất lượng.',
    ],
  },
  {
    title: '3a. Thu hộ, phí dịch vụ nền tảng và số dư bảo đảm',
    items: [
      'Khi Khách hàng thanh toán qua ứng dụng (PayOS, VNPay hoặc phương thức khác do tổ chức được cấp phép cung ứng), TAYZEN nhận khoản tiền đó với tư cách bên thu hộ cho KTV theo uỷ quyền của KTV. Tiền dịch vụ là doanh thu của KTV, không phải doanh thu của TAYZEN.',
      'TAYZEN chuyển tiền thu hộ cho KTV sau khi đơn hoàn thành và hết thời hạn khiếu nại 24 giờ (hoặc khi Khách hàng xác nhận hoàn thành), sau khi trừ phí dịch vụ nền tảng và khoản thuế TAYZEN khấu trừ, nộp thay theo luật.',
      'Phí dịch vụ nền tảng là tiền KTV trả cho TAYZEN để dùng hạ tầng kết nối, thanh toán và hỗ trợ: 30% giá dịch vụ chưa gồm thuế GTGT (33% đã gồm thuế), tính trên giá KTV niêm yết hoặc đã báo. TAYZEN báo trước ít nhất 15 ngày khi đổi mức phí.',
      'Với đơn Khách hàng trả tiền mặt trực tiếp cho KTV, tại thời điểm nhận đơn KTV phải có số dư bảo đảm tối thiểu bằng phí dịch vụ nền tảng (đã gồm thuế) cộng khoản thuế TAYZEN khấu trừ, nộp thay của chính đơn đó, hiện bằng 40% giá đơn. Khoản này chỉ dùng để thanh toán phí và thuế của đơn đó; phần chưa dùng thuộc về KTV và được rút bất kỳ lúc nào.',
      'Khách hàng và KTV liên lạc qua tính năng nhắn tin, gọi trong ứng dụng; TAYZEN không hiển thị số điện thoại của hai bên để bảo vệ thông tin cá nhân và an toàn. Giao dịch ngoài ứng dụng không được TAYZEN hỗ trợ khiếu nại hay bảo vệ.',
    ],
  },
  {
    title: '3b. Hoá đơn và thuế',
    items: [
      'KTV là người cung ứng dịch vụ và có nghĩa vụ lập hoá đơn cho Khách hàng theo quy định. KTV có thể uỷ nhiệm cho TAYZEN lập hoá đơn điện tử thay mình; hoá đơn khi đó vẫn ghi KTV là người bán.',
      'TAYZEN lập hoá đơn giá trị gia tăng cho KTV đối với phí dịch vụ nền tảng.',
      'TAYZEN khấu trừ, khai thay và nộp thay thuế GTGT, TNCN của KTV trên doanh thu từng đơn theo pháp luật về quản lý thuế đối với kinh doanh trên nền tảng thương mại điện tử, và cấp chứng từ khấu trừ khi KTV yêu cầu.',
      'Các nghĩa vụ thuế khác phát sinh từ dịch vụ của KTV (nếu có) do KTV tự kê khai và nộp.',
    ],
  },
  {
    title: '4. Miễn trừ trách nhiệm',
    items: [
      'TAYZEN không phải bên cung ứng dịch vụ nên không chịu trách nhiệm thay KTV về chất lượng và kết quả dịch vụ, trừ trường hợp TAYZEN có lỗi khi thực hiện nghĩa vụ của chủ nền tảng theo pháp luật.',
      'Trong phạm vi pháp luật cho phép, TAYZEN không chịu trách nhiệm đối với thiệt hại phát sinh từ: hành vi vi phạm pháp luật hoặc vi phạm điều khoản của Khách hàng, KTV hay bên thứ ba; thông tin sai lệch do người dùng cung cấp; tình trạng sức khoẻ không được khai báo; giao dịch, thanh toán hoặc thoả thuận ngoài ứng dụng.',
      'Dịch vụ trên TAYZEN là chăm sóc thư giãn, làm đẹp, không phải dịch vụ y tế và không thay thế chẩn đoán, điều trị của cơ sở y tế.',
      'TAYZEN không chịu trách nhiệm khi gián đoạn dịch vụ do sự kiện bất khả kháng, sự cố mạng, hệ thống thanh toán hoặc nhà cung cấp bên thứ ba.',
    ],
  },
  {
    title: '5. Dữ liệu cá nhân',
    items: [
      'Dữ liệu cá nhân (họ tên, số điện thoại, địa chỉ, vị trí, giấy tờ tuỳ thân của KTV) được thu thập và xử lý để cung cấp dịch vụ, bảo đảm an toàn và theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Chi tiết xem Chính sách bảo mật.',
      'Dữ liệu vị trí chỉ dùng để hiển thị lộ trình, xác nhận có mặt cho Khách hàng và xử lý SOS; TAYZEN không dùng vị trí để chấm công hay đánh giá KTV.',
      'TAYZEN có thể lưu nội dung trò chuyện và lịch sử đơn để giải quyết khiếu nại và phòng chống vi phạm.',
    ],
  },
];

export const BOOKING_COMMITMENTS: string[] = [
  'Tôi chỉ đặt dịch vụ chăm sóc sức khoẻ, thư giãn, làm đẹp không nhạy cảm và không yêu cầu KTV làm việc ngoài phạm vi dịch vụ.',
  'Tôi cam kết không thực hiện, không yêu cầu bất kỳ hành vi vi phạm pháp luật nào, bao gồm quấy rối, mua bán dâm, sử dụng chất cấm.',
  'Tôi đã khai báo đúng tình trạng sức khoẻ (mang thai, bệnh tim mạch, huyết áp, chấn thương, dị ứng…). TAYZEN và KTV không chịu trách nhiệm với rủi ro do thông tin không được khai báo.',
  'KTV có quyền dừng phục vụ ngay khi bị xúc phạm, quấy rối hoặc gặp nguy hiểm; khi đó TAYZEN sẽ xem xét bằng chứng trong 03 ngày làm việc; nếu Khách hàng vi phạm, đơn không được hoàn tiền và tài khoản có thể bị khoá.',
  'Tôi hiểu rằng KTV là người cung ứng dịch vụ, còn TAYZEN là nền tảng trung gian. Khi thanh toán qua ứng dụng, TAYZEN thu hộ tiền dịch vụ cho KTV. TAYZEN không chịu trách nhiệm với giao dịch, thoả thuận ngoài ứng dụng.',
  'Giá tôi trả là giá do KTV niêm yết hoặc báo và tôi đã đồng ý; voucher của TAYZEN (nếu có) do TAYZEN chi trả.',
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
