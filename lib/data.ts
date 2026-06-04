import { Question, Comment, Article, Activity } from '@/types/types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: '1',
    code: '001',
    title: 'Giải thích cơ chế Virtual DOM trong React',
    difficulty: 'Dễ',
    tags: ['React', 'JS'],
    successRate: 87,
    completed: true,
    category: 'Frontend',
    description: 'React được biết đến với hiệu suất cực cao nhờ cơ sở hạ tầng Virtual DOM. Hãy giải thích chi tiết cơ chế này hoạt động như thế nào, tại sao nó lại nhanh hơn việc cập nhật Real DOM trực tiếp và cách React tối ưu hóa tài nguyên.',
    requirements: [
      'Virtual DOM thực chất là gì dưới lăng kính JavaScript?',
      'Quy trình Reconciliation (Đối soát) và giải thuật Diffing.',
      'Sự khác biệt cốt lõi giữa Virtual DOM, Real DOM và Shadow DOM.',
      'Ưu điểm về mặt hiệu suất trong các ứng dụng có cấu trúc cây phức tạp.'
    ],
    codeSnippet: `// Một React component đơn giản
function Welcome() {
  return (
    <div>
      <h1>Xin chào!</h1>
      <p>Đây là một ví dụ về Virtual DOM.</p>
    </div>
  );
}`,
    solution: {
      overview: 'Virtual DOM là một bản sao gọn nhẹ (lightweight blueprint) của Real DOM được lưu giữ dưới dạng JavaScript Object trong bộ nhớ RAM. Khi trạng thái (state) thay đổi:',
      steps: [
        'Render: React kích hoạt việc tạo lập một cây Virtual DOM mới tinh để đại diện cho giao diện vừa cập nhật.',
        'Diffing: Đối chiếu cây Virtual DOM mới này với cây Virtual DOM cũ bằng giải thuật O(n) cực kỳ thông minh để bóc tách những điểm khác biệt chính xác.',
        'Patching: Chỉ tiến hành apply (vết mổ) chuẩn xác những phần thực sự thay đổi lên cây Real DOM ngoài màn hình.'
      ],
      codeSnippet: `// Minh họa cách React biểu diễn một node Virtual DOM trong RAM:
const oldElement = { 
  type: 'h1', 
  props: { 
    className: 'title', 
    children: 'Hello' 
  } 
};

const newElement = { 
  type: 'h1', 
  props: { 
    className: 'title', 
    children: 'Hi' 
  } 
};

// React diffing thuật toán nhanh chóng phát hiện ra text thay đổi từ 'Hello' thành 'Hi'
// Và ra lệnh cập nhật cục bộ textNode (đỡ tốn 100x hiệu năng so với dựng lại h1)`
    }
  },
  {
    id: '2',
    code: '002',
    title: 'Sự khác biệt giữa Flexbox và Grid Layout',
    difficulty: 'Trung bình',
    tags: ['CSS'],
    successRate: 62,
    completed: false,
    category: 'Frontend',
    description: 'Flexbox và CSS Grid Layout đều là các công cụ layout cực kỳ mạnh mẽ trong CSS hiện đại. Trình bày rõ ràng khi nào nên chọn dùng Flexbox thay vì Grid và ngược lại.',
    requirements: [
      'Khái niệm phân bố một chiều (1D) vs hai chiều (2D).',
      'Cách căn chỉnh phần tử con linh hoạt theo trục chính/trực phụ.',
      'Thiết kế dạng lưới bento phức tạp.'
    ],
    codeSnippet: `/* Ví dụ Flexbox */
.container-flex {
  display: flex;
  justify-content: space-between;
}

/* Ví dụ Grid */
.container-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}`,
    solution: {
      overview: 'Flexbox là hệ thống bố cục một chiều (phù hợp cho các hàng dọc hoặc hàng ngang biệt lập), trong khi Grid là hệ thống bố cục hai chiều hoàn mỹ (quản lý đồng thời cả hàng lẫn cột).',
      steps: [
        'Chọn Flexbox khi: Thiết kế thanh điều hướng, các nhóm nút, căn giữa item đơn lẻ hay các luồng phân phối dọc nằm ngang.',
        'Chọn Grid khi: Xây dựng toàn bộ khung sườn trang website, các bố cục Bento Card phức tạp, thư viện ảnh đa dạng tỷ lệ.'
      ],
      codeSnippet: `/* Layout phức tạp tối ưu bento */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(150px, auto);
}`
    }
  },
  {
    id: '3',
    code: '003',
    title: 'Tối ưu hiệu suất bằng React.memo và useMemo',
    difficulty: 'Khó',
    tags: ['React', 'JS'],
    successRate: 45,
    completed: true,
    category: 'Frontend',
    description: 'Trình bày cách thức hoạt động của React.memo, useMemo và useCallback để ngăn ngừa vòng lặp lãng phí kết xuất (wasteful re-renders).',
    requirements: [
      'Giải thích cơ chế Shallow Comparison trong React.',
      'Sự khác biệt lớn giữa useMemo và useCallback.',
      'Những trường hợp lạm dụng gây suy giảm hiệu năng.'
    ],
    codeSnippet: `import { useState, useMemo } from 'react';

function Calculator() {
  const [count, setCount] = useState(0);
  // Việc tính toán đắt đỏ này chạy lại mỗi khi component re-render
  const answer = performHeavyMath();
}`,
    solution: {
      overview: 'useMemo dùng để cache kết quả của một phép tính đắt đỏ, trong khi useCallback cache chính instance của hàm khai báo để tránh đổi tham chiếu.',
      steps: [
        'React.memo so sánh nông props của component nhận vào.',
        'React chỉ chạy phép tính nặng bên trong useMemo khi mảng dependency thay đổi giá trị.'
      ],
      codeSnippet: `// Giải pháp tối ưu với useMemo
const memoizedAnswer = useMemo(() => {
  return performHeavyMath(count);
}, [count]); // Chỉ tính lại khi count thực sự thay đổi`
    }
  },
  {
    id: '4',
    code: '004',
    title: 'Closures và Scope Chain trong JavaScript',
    difficulty: 'Trung bình',
    tags: ['JS'],
    successRate: 58,
    completed: false,
    category: 'Frontend',
    description: 'Closure là một trong những khái niệm quan trọng nhất của JavaScript. Hãy giải thích cách nó cho phép một hàm ghi nhớ phạm vi khai sinh của nó ngay cả khi đã thực thi xong.',
    requirements: [
      'Phạm vi từ vựng (Lexical Scoping).',
      'Ứng dụng closure để đóng gói dữ liệu (private variables).',
      'Quản lý bộ nhớ rác (Garbage Collection) liên quan.'
    ],
    codeSnippet: `function initCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const next = initCounter();`,
    solution: {
      overview: 'Closure là sự kết hợp giữa một hàm và môi trường từ vựng chứa nó. Nó giữ lại tham chiếu tới biến ngoài phạm vi thực thi ngay cả sau khi hàm cha đã kết thúc.',
      steps: [
        'Môi trường từ vựng (lexical environment) được giữ lại trong bộ nhớ heap nhờ tham chiếu sống.',
        'Rất hữu dụng để mô phỏng thuộc tính "private" trong OOP mà JS cũ không có.'
      ],
      codeSnippet: `// Ứng dụng Encapsulation
const database = (() => {
  let records = []; // Biến bí mật, bên ngoài không thể truy cập trực tiếp
  return {
    add: (rec) => records.push(rec),
    get: () => [...records]
  };
})();`
    }
  },
  {
    id: '5',
    code: '005',
    title: 'Implement Custom Hook useLocalStorage',
    difficulty: 'Khó',
    tags: ['React', 'Hooks'],
    successRate: 31,
    completed: false,
    category: 'Frontend',
    description: 'Viết một Custom React Hook hoàn chỉnh có tên useLocalStorage để đồng bộ hóa trạng thái state của React với localStorage của trình duyệt, hỗ trợ xử lý lỗi ngoại lệ.',
    requirements: [
      'Tương tác an toàn với server-side rendering (SSR), kiểm định window tồn tại.',
      'Hỗ trợ cập nhật trạng thái bằng hàm callback tương tự useState thông thường.',
      'Đồng bộ hóa dữ liệu JSON an toàn.'
    ],
    codeSnippet: `// Cách sử dụng kỳ vọng
const [theme, setTheme] = useLocalStorage('theme', 'dark');`,
    solution: {
      overview: 'Để tạo một custom hook lưu trữ an toàn, ta cần bọc thao tác đọc/ghi trong khối try-catch và kiểm tra xem biến window có tồn tại hay không (đề phòng SSR).',
      steps: [
        'Đọc giá trị ban đầu từ localStorage, nếu không tồn tại hoặc lỗi thì sử dụng initialValue.',
        'Trả về một State nội bộ của React kèm theo hàm Setter viết đè bảo đảm cập nhật cả React State lẫn Browser LocalStorage.'
      ],
      codeSnippet: `import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Lỗi đọc localStorage: ", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Lỗi ghi localStorage: ", error);
    }
  };

  return [storedValue, setValue] as const;
}`
    }
  },
  {
    id: '6',
    code: '006',
    title: 'Đảo ngược một Danh Sách Liên Kết Đơn (Reverse a Linked List)',
    difficulty: 'Trung bình',
    tags: ['Algorithms', 'Python'],
    successRate: 71,
    completed: false,
    category: 'Cấu trúc dữ liệu & Giải thuật',
    description: 'Việt hóa thuật toán đảo ngược Linked List kinh điển. Cho đầu vào là một con trỏ List Node, hãy sắp đặt lại các hướng con trỏ liên kết kế tiếp để tạo ra một danh sách liên kết đảo chiều hoàn toàn.',
    requirements: [
      'Phương pháp tiếp cận con trỏ kép (Iterative approach với prev, curr, next).',
      'Độ phức tạp thời gian O(N) và bộ nhớ bổ sung O(1).',
      'Phương pháp đệ quy (Recursive approach).'
    ],
    codeSnippet: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`,
    solution: {
      overview: 'Sử dụng ba biến con trỏ chạy tịnh tiến: trước (prev), hiện tại (curr) và kế tiếp (next). Tại mỗi bước lặp, ta bẻ chiều trỏ tiếp của curr lùi về prev, sau đó gán dịch chuyển prev và curr tiến lên phía trước.',
      steps: [
        'Khởi tạo prev = null, curr = head.',
        'Lặp khi curr khác null: Lưu biến tempNext = curr.next, bẻ hướng trỏ curr.next = prev, dịch prev = curr, curr = tempNext.',
        'Trả về prev chính là node đầu mới.'
      ],
      codeSnippet: `def reverseList(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`
    }
  },
  {
    id: '7',
    code: '007',
    title: 'Thiết kế hệ thống Rate Limiter cho Chat App quy mô lớn',
    difficulty: 'Khó',
    tags: ['System Design', 'Redis'],
    successRate: 22,
    completed: false,
    category: 'System Design',
    description: 'Tìm kiếm phương cách kiểm soát lưu lượng gọi API từ người dùng tránh tấn công DDOS hoặc Spam tin nhắn trong ứng dụng chat phân tán triệu người dùng đồng thời.',
    requirements: [
      'Thuật toán Token Bucket và Leaky Bucket.',
      'Sử dụng Redis Cluster lưu trữ phân tán hiệu năng siêu tốc.',
      'Quản lý race-condition bằng Lua Script trong Redis.'
    ],
    codeSnippet: `// Mock API request
async function chatApiGateway(req, res) {
  const userId = req.headers['x-user-id'];
  // Cần cơ chế check giới hạn cuộc gọi ở đây
}`,
    solution: {
      overview: 'Hệ thống dùng Redis để thực thi thuật toán Token Bucket. Mỗi người dùng được cấp một hòm khóa chứa tối đa X tokens, hồi phục theo chu kỳ T giây. Mỗi request tiêu tốn 1 token.',
      steps: [
        'Sử dụng Redis Key cấu trúc rate_limit:user_id lưu trữ số lượng token và dấu thời gian cập nhật gần nhất.',
        'Dùng Lua Script để thực hiện thao tác Đọc - Ghi nguyên tử (atomic) tránh xung đột đồng thời.'
      ],
      codeSnippet: `-- Redis Lua Script an toàn race-condition:
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")
if current + 1 > limit then
  return 0
else
  redis.call("INCRBY", key, 1)
  redis.call("EXPIRE", key, 10)
  return 1
end`
    }
  },
  {
    id: '8',
    code: '008',
    title: 'Xây dựng cơ chế xác thực bảo mật JWT và cơ chế Refresh Token',
    difficulty: 'Trung bình',
    tags: ['Node.js', 'Security'],
    successRate: 55,
    completed: false,
    category: 'Backend',
    description: 'Thiết kế hệ thống đăng nhập bảo mật trong Web App. Giải thích vòng đời của Access Token (ngắn hạn) và Refresh Token (dài hạn) để cân bằng giữa bảo mật mạnh mẽ và trải nghiệm người dùng.',
    requirements: [
      'Cấu trúc 3 phần của JSON Web Token (Header, Payload, Signature).',
      'Chiến lược phòng chống rò rỉ Token (XSS, CSRF attacks).',
      'Thiết lập rotation cho Refresh Token để vô hiệu hóa hacker.'
    ],
    codeSnippet: `const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
}`,
    solution: {
      overview: 'Hệ thống lưu Refresh Token trong HttpOnly Cookie để chống khai thác từ mã độc JavaScript (XSS), còn Access Token lưu trữ ở bộ nhớ RAM của ứng dụng.',
      steps: [
        'User gửi credentials -> Server cấp Access Token (15 phút) và Refresh Token (7 ngày) lưu HttpOnly.',
        'Client hết hạn Access Token sẽ tự động gọi API /api/refresh mang theo Cookie để gia hạn mà không cần bắt người dùng đăng nhập lại.'
      ],
      codeSnippet: `// Tránh tấn công Replay Attack bằng Refresh Token Rotation:
app.post('/api/refresh', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // Kiểm tra Refresh Token trong DB, nếu đã sử dụng từ trước -> nghi ngờ hacker -> thu hồi ngay lập tức toàn bộ phiên đăng nhập của người dùng này!
});`
    }
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
