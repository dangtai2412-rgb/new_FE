// src/lib/mock_data.js

// --- 1. SẢN PHẨM (Global & Đa dạng ngành hàng) ---
export const INITIAL_PRODUCTS = [
  // --- VIỆT NAM (Vật liệu xây dựng cơ bản) ---
  { id: 1, name: "Xi măng Hà Tiên (Premium)", price: 92000, cost: 85000, stock: 150, unit: "Bao 50kg", category: "Vật liệu thô", image: "🇻🇳" },
  { id: 2, name: "Cát xây dựng Sông Lô", price: 1200000, cost: 1000000, stock: 10, unit: "Xe 3m3", category: "Vật liệu thô", image: "🚛" },
  { id: 3, name: "Gạch Tuynel Bình Dương", price: 1200, cost: 950, stock: 10000, unit: "Viên", category: "Gạch đá", image: "🧱" },
  { id: 4, name: "Thép Pomina phi 10 (VN)", price: 155000, cost: 140000, stock: 500, unit: "Cây", category: "Sắt thép", image: "🏗️" },
  
  // --- NHẬT BẢN (Điện máy & Công cụ) ---
  { id: 101, name: "Máy khoan Makita HP1630 (Japan)", price: 1450000, cost: 1100000, stock: 25, unit: "Cái", category: "Điện máy", image: "🇯🇵" },
  { id: 102, name: "Thiết bị vệ sinh TOTO (Bồn cầu)", price: 5600000, cost: 4200000, stock: 8, unit: "Bộ", category: "Nội thất", image: "🚽" },
  { id: 103, name: "Sơn ngoại thất Nippon Paint", price: 2100000, cost: 1800000, stock: 30, unit: "Thùng 18L", category: "Sơn nước", image: "🎎" },
  
  // --- ĐỨC (Cơ khí & Kim khí chất lượng cao) ---
  { id: 201, name: "Bộ kìm đa năng Bosch (Germany)", price: 850000, cost: 600000, stock: 40, unit: "Bộ", category: "Kim khí", image: "🇩🇪" },
  { id: 202, name: "Sàn gỗ công nghiệp Egger", price: 450000, cost: 320000, stock: 200, unit: "m2", category: "Nội thất", image: "🪵" },
  { id: 203, name: "Máy bơm nước Wilo", price: 3200000, cost: 2800000, stock: 12, unit: "Cái", category: "Điện máy", image: "⚙️" },

  // --- MỸ (USA) (Vật liệu cao cấp) ---
  { id: 301, name: "Sơn Dulux Weathershield (USA)", price: 2850000, cost: 2400000, stock: 50, unit: "Thùng 18L", category: "Sơn nước", image: "🇺🇸" },
  { id: 302, name: "Khóa cửa thông minh Yale", price: 4500000, cost: 3800000, stock: 15, unit: "Bộ", category: "Điện tử", image: "🔐" },
  { id: 303, name: "Tấm thạch cao Gyproc", price: 180000, cost: 140000, stock: 300, unit: "Tấm", category: "Vật liệu thô", image: "⬜" },

  // --- Ý (ITALY) (Gạch & Đá) ---
  { id: 401, name: "Gạch men EuroTile (Italy)", price: 650000, cost: 450000, stock: 120, unit: "Thùng", category: "Gạch đá", image: "🇮🇹" },
  { id: 402, name: "Đá Marble Carrara Trắng", price: 4200000, cost: 3500000, stock: 20, unit: "m2", category: "Gạch đá", image: "🏛️" },

  // --- THÁI LAN & TRUNG QUỐC (Đồ điện & Nhựa) ---
  { id: 501, name: "Ống nhựa Bình Minh (Thái-Việt)", price: 85000, cost: 60000, stock: 1000, unit: "Cây 4m", category: "Ngành nước", image: "🇹🇭" },
  { id: 502, name: "Đèn LED Âm trần Xiaomi (China)", price: 120000, cost: 80000, stock: 200, unit: "Cái", category: "Điện tử", image: "🇨🇳" },
  { id: 503, name: "Dây điện Cadivi 2.5", price: 950000, cost: 820000, stock: 60, unit: "Cuộn 100m", category: "Điện máy", image: "⚡" },
];

// --- 2. GÓI DỊCH VỤ ---
export const MOCK_SUBSCRIPTIONS = [
  { id: 1, plan_name: "Gói Dùng Thử", price: 0, duration: 30, description: "Dành cho người mới bắt đầu" },
  { id: 2, plan_name: "Gói Cơ Bản", price: 199000, duration: 30, description: "Đầy đủ tính năng bán hàng" },
  { id: 3, plan_name: "Gói Chuyên Nghiệp", price: 499000, duration: 365, description: "Tiết kiệm hơn, hỗ trợ 24/7" },
  { id: 4, plan_name: "Gói Global Enterprise", price: 2500000, duration: 365, description: "Quản lý đa chi nhánh, đa tiền tệ" }
];

// --- 3. NHÀ CUNG CẤP (Chuỗi cung ứng toàn cầu) ---
export const INITIAL_SUPPLIERS = [
  { id: 1, name: "VLXD Hưng Thịnh (Kho HCM)", phone: "0909123456", address: "Q.12, TP.HCM", contact: "A. Hưng", debt: 0 },
  { id: 2, name: "Tập đoàn Thép Nippon (Japan)", phone: "+81 3-1234-5678", address: "Tokyo, Japan", contact: "Mr. Tanaka", debt: 250000000 },
  { id: 3, name: "Bosch Vietnam Official", phone: "1800 1234", address: "KCN Tân Bình", contact: "Ms. Sarah", debt: 5000000 },
  { id: 4, name: "Kho Vận Tải Quốc Tế Maersk", phone: "028 3823 4567", address: "Cảng Cát Lái", contact: "Mr. David", debt: 15000000 },
  { id: 5, name: "EuroTile Imports", phone: "0918 777 666", address: "Đà Nẵng", contact: "Chị Lan", debt: 8200000 },
];

// --- 4. THÔNG BÁO (Phong phú & Đa dạng) ---
export const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    title: "Đơn hàng mới #DH005", 
    message: "Khách hàng VLXD Hưng Thịnh vừa đặt 50 bao xi măng.", 
    time: "2 phút trước", 
    isRead: false, 
    type: "order" 
  },
  { 
    id: 2, 
    title: "Cảnh báo tồn kho thấp", 
    message: "Thép Pomina phi 10 chỉ còn 200 cây (dưới mức tối thiểu 300).", 
    time: "15 phút trước", 
    isRead: false, 
    type: "alert" 
  },
  { 
    id: 3, 
    title: "Nhân viên xin nghỉ", 
    message: "Nhân viên Kho (Tài) vừa gửi đơn xin nghỉ phép ngày mai.", 
    time: "30 phút trước", 
    isRead: false, 
    type: "info" 
  },
  { 
    id: 4, 
    title: "Thanh toán thành công", 
    message: "Đã nhận 15.000.000đ chuyển khoản từ Cty Kiến Vàng.", 
    time: "1 giờ trước", 
    isRead: true, 
    type: "success" 
  },
  { 
    id: 5, 
    title: "Quá hạn công nợ", 
    message: "Khách hàng 'Anh Hùng' đã quá hạn thanh toán 3 ngày.", 
    time: "3 giờ trước", 
    isRead: true, 
    type: "alert" 
  },
  { 
    id: 6, 
    title: "Cập nhật giá xăng dầu", 
    message: "Giá vận chuyển dự kiến tăng 5% từ ngày mai do giá xăng tăng.", 
    time: "5 giờ trước", 
    isRead: true, 
    type: "info" 
  },
  { 
    id: 7, 
    title: "Hàng nhập khẩu về kho", 
    message: "Lô hàng Máy khoan Bosch (Đức) đã về tới kho Thủ Đức.", 
    time: "1 ngày trước", 
    isRead: true, 
    type: "success" 
  },
  { 
    id: 8, 
    title: "Bảo trì hệ thống", 
    message: "Hệ thống sẽ bảo trì định kỳ vào 00:00 - 02:00 sáng mai.", 
    time: "1 ngày trước", 
    isRead: true, 
    type: "info" 
  },
  { 
    id: 9, 
    title: "Đánh giá từ khách hàng", 
    message: "Cô Ba vừa đánh giá 5 sao cho dịch vụ giao hàng.", 
    time: "2 ngày trước", 
    isRead: true, 
    type: "success" 
  }
];