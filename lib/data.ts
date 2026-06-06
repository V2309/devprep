import { Question, Comment, Article, Activity } from '@/types/types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: '1',
    code: '001',
    title: 'Giải thích cơ chế Virtual DOM trong React',
    difficulty: 'Dễ',
    tags: 'React, JS',
    completed: true,
    category: 'Frontend',
    answer: 'Virtual DOM là một bản sao gọn nhẹ (lightweight blueprint) của Real DOM dưới dạng JavaScript Object trong RAM. Khi state thay đổi, React sẽ tạo một cây Virtual DOM mới, so sánh với cây Virtual DOM cũ bằng giải thuật Diffing để tìm ra sự khác biệt, sau đó chỉ cập nhật (patching) các phần thực sự thay đổi lên Real DOM, tránh việc re-render toàn bộ DOM giúp tăng hiệu năng rõ rệt.'
  },
  {
    id: '2',
    code: '002',
    title: 'Sự khác biệt giữa Flexbox và Grid Layout',
    difficulty: 'Trung bình',
    tags: 'CSS',
    completed: false,
    category: 'Frontend',
    answer: 'Flexbox là hệ thống bố cục một chiều (1D) dọc hoặc ngang, thích hợp cho việc căn chỉnh các phần tử con linh hoạt theo trục chính/trực phụ (ví dụ: navbar, nhóm nút). Grid là hệ thống bố cục hai chiều (2D) quản lý đồng thời cả hàng lẫn cột, lý tưởng cho các thiết kế lưới phức tạp như layout Bento Card hoặc toàn bộ khung sườn trang web.'
  },
  {
    id: '3',
    code: '003',
    title: 'Tối ưu hiệu suất bằng React.memo và useMemo',
    difficulty: 'Khó',
    tags: 'React, JS',
    completed: true,
    category: 'Frontend',
    answer: 'useMemo dùng để cache kết quả của các phép tính phức tạp (chỉ tính lại khi dependency thay đổi). useCallback dùng để cache chính hàm callback để giữ nguyên tham chiếu giữa các lần render. React.memo là Higher-Order Component dùng để bọc component con, thực hiện so sánh nông (shallow comparison) các props nhận vào để tránh re-render thừa khi props không đổi.'
  },
  {
    id: '4',
    code: '004',
    title: 'Closures và Scope Chain trong JavaScript',
    difficulty: 'Trung bình',
    tags: 'JS',
    completed: false,
    category: 'Frontend',
    answer: 'Closure là khả năng của một hàm ghi nhớ và truy cập vào phạm vi từ vựng (lexical scope) của nó ngay cả khi hàm đó được thực thi bên ngoài phạm vi từ vựng đó. Nó hoạt động bằng cách giữ lại tham chiếu đến môi trường cha trong bộ nhớ heap, thường được ứng dụng để tạo biến riêng tư (private variables) hoặc đóng gói logic.'
  },
  {
    id: '5',
    code: '005',
    title: 'Implement Custom Hook useLocalStorage',
    difficulty: 'Khó',
    tags: 'React, Hooks',
    completed: false,
    category: 'Frontend',
    answer: 'useLocalStorage là custom hook giúp đồng bộ state của React với localStorage. Khi khởi tạo, hook kiểm tra xem window có tồn tại (để tương thích SSR) và đọc dữ liệu từ localStorage qua JSON.parse. Khi cập nhật state, nó sẽ lưu dữ liệu đã được JSON.stringify vào localStorage và cập nhật React State, bọc các thao tác trong try-catch để bắt lỗi ngoại lệ.'
  },
  {
    id: '6',
    code: '006',
    title: 'Đảo ngược một Danh Sách Liên Kết Đơn (Reverse a Linked List)',
    difficulty: 'Trung bình',
    tags: 'Algorithms, Python',
    completed: false,
    category: 'Cấu trúc dữ liệu & Giải thuật',
    answer: 'Để đảo ngược một Linked List đơn bằng phương pháp lặp, ta sử dụng 3 con trỏ: prev (trước), curr (hiện tại) và nxt (kế tiếp). Lặp qua danh sách: lưu nxt = curr.next, bẻ hướng con trỏ curr.next = prev, dịch prev = curr và curr = nxt. Khi kết thúc, prev sẽ trỏ vào node đầu mới của danh sách đã đảo ngược.'
  },
  {
    id: '7',
    code: '007',
    title: 'Thiết kế hệ thống Rate Limiter cho Chat App quy mô lớn',
    difficulty: 'Khó',
    tags: 'System Design, Redis',
    completed: false,
    category: 'System Design',
    answer: 'Hệ thống sử dụng Redis để lưu trữ phân tán và thực hiện thuật toán Token Bucket. Mỗi user_id được cấp một key lưu số token khả dụng và timestamp cập nhật cuối cùng. Khi có request, ta sử dụng Lua Script trong Redis để thực hiện các thao tác đọc và ghi một cách nguyên tử (atomic), giúp phòng ngừa race-condition ở quy mô tải cực lớn.'
  },
  {
    id: '8',
    code: '008',
    title: 'Xây dựng cơ chế xác thực bảo mật JWT và cơ chế Refresh Token',
    difficulty: 'Trung bình',
    tags: 'Node.js, Security',
    completed: false,
    category: 'Backend',
    answer: 'Cơ chế xác thực sử dụng cặp token: Access Token (ngắn hạn, ví dụ 15 phút, lưu trong RAM/State để gọi API nhanh) và Refresh Token (dài hạn, ví dụ 7 ngày, lưu trong HttpOnly Cookie để chống XSS). Khi Access Token hết hạn, Client tự động gọi API gia hạn bằng Refresh Token. Đồng thời áp dụng cơ chế Refresh Token Rotation để thu hồi toàn bộ phiên đăng nhập nếu phát hiện replay attack.'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    authorName: 'Lan Anh Nguyễn',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    timestamp: '2 giờ trước',
    text: 'Bài giải thích rất dễ hiểu và chi tiết quá ạ. Mình từng nhầm lẫn tai hại giữa Shadow DOM (của Web Component) và Virtual DOM (của React), hóa ra chúng hoàn toàn khác nhau về cả bản chất lẫn phạm vi hoạt động.',
    upvotes: 12,
    liked: false
  },
  {
    id: 'c2',
    authorName: 'Minh Hoàng',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    timestamp: '5 giờ trước',
    text: 'Có ai có ví dụ thực tế nào về trường hợp mà Virtual DOM chạy chậm hơn việc cập nhật DOM trực tiếp không nhỉ? Chẳng hạn như render game hoặc vẽ animation tần suất cao 60fps?',
    upvotes: 8,
    liked: true
  },
  {
    id: 'c3',
    authorName: 'Quốc Bảo Trần',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    timestamp: '1 ngày trước',
    text: 'Đúng vậy bạn Hoàng ơi, khi thao tác cần lưu chuyển liên tục và biết chính xác node thay đổi (như vẽ canvas kỹ thuật số, game hoặc dải trượt âm thanh 60 lần/giây), thì DOM trực tiếp hoặc thư viện như VanillaJS, WebGL vượt trội hơn hẳn so với việc dựng ảo vDOM.',
    upvotes: 15,
    liked: false
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art1',
    category: 'Career Path',
    title: 'Cách trả lời câu hỏi System Design khi phỏng vấn Senior',
    description: 'Nắm vững các nguyên tắc cốt lõi, cách đặt câu hỏi làm rõ đề bài (ambiguity) và trình bày giải pháp kiến trúc hệ thống một cách khoa học thuyết phục trước mắt hội đồng giám khảo khó tính nhất.',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
    readTime: '8 phút đọc'
  },
  {
    id: 'art2',
    category: 'Tech Deep Dive',
    title: 'Tối ưu React Performance sâu sắc với useMemo và useCallback',
    description: 'Khi nào bạn thực sự cần tối ưu hóa hiệu năng? Những sai lầm vỡ lòng thường thấy khiến việc lạm dụng kén chọn khiến ứng dụng chạy chậm chạp hơn hẳn do phí tổn khai báo lại.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    readTime: '6 phút đọc'
  },
  {
    id: 'art3',
    category: 'Security',
    title: 'Bảo mật API cổng Gateway: Những tiêu chuẩn vàng bạn không thể bỏ qua',
    description: 'Từ câu chuyện kiến trúc JWT, thiết lập OAuth2, phân cấp RBAC bảo vệ hệ thống trước hành vi tấn công dò mật khẩu và rò rỉ dữ liệu ngoài mong muốn trong các hệ thống phân tán microservice.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    readTime: '10 phút đọc'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    timeStr: '2 giờ trước',
    action: 'Đã giải quyết: Reverse a Linked List',
    type: 'check',
    detail: 'Vượt qua bài test độ phức tạp bộ nhớ tối ưu hoàn chỉnh O(1).',
    tags: ['Trung bình', 'Python']
  },
  {
    id: 'act2',
    timeStr: 'Hôm qua',
    action: 'Đã hoàn thành chương: Microservices Patterns',
    type: 'book',
    detail: 'Bạn đã tiếp thu toàn bộ 8 bài đọc thực tế về thiết kế các mẫu Saga và Outbox trong cơ chế đồng bộ hóa cơ sở dữ liệu phân tán.'
  },
  {
    id: 'act3',
    timeStr: '3 ngày trước',
    action: 'Tham gia thi thử: Mid-level React Mock Interview',
    type: 'interactive',
    detail: 'Ghi điểm ấn tượng 88% do mô hình AI chấm điểm và sửa đổi mã nguồn trực tiếp.'
  }
];
