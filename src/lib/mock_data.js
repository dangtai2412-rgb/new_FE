// src/lib/mock_data.js
export const INITIAL_PRODUCTS = [
  { id: 1, name: "Xi măng Hà Tiên", price: 92000, cost: 85000, stock: 50, unit: "Bao", category: "Vật liệu thô", image: "🧱" },
  { id: 2, name: "Cát xây dựng (Xe)", price: 1200000, cost: 1000000, stock: 5, unit: "Xe 3m3", category: "Vật liệu thô", image: "🚛" },
  { id: 3, name: "Gạch ống 4 lỗ", price: 1200, cost: 950, stock: 5000, unit: "Viên", category: "Gạch đá", image: "🧱" },
  { id: 4, name: "Thép Pomina phi 10", price: 155000, cost: 140000, stock: 200, unit: "Cây", category: "Sắt thép", image: "🏗️" },
  { id: 5, name: "Sơn Dulux Trắng", price: 1850000, cost: 1600000, stock: 12, unit: "Thùng 18L", category: "Sơn nước", image: "🎨" },
  { id: 6, name: "Đá 1x2 (Xe)", price: 2500000, cost: 2200000, stock: 3, unit: "Xe 5m3", category: "Vật liệu thô", image: "🪨" },
];

export const MOCK_SUBSCRIPTIONS = [
  { id: 1, plan_name: "Gói Dùng Thử", price: 0, duration: 30, description: "Dành cho người mới bắt đầu" },
  { id: 2, plan_name: "Gói Cơ Bản", price: 199000, duration: 30, description: "Đầy đủ tính năng bán hàng" },
  { id: 3, plan_name: "Gói Chuyên Nghiệp", price: 499000, duration: 365, description: "Tiết kiệm hơn, hỗ trợ 24/7" },
  { id: 4, plan_name: "Gói Doanh Nghiệp", price: 1200000, duration: 365, description: "Không giới hạn nhân viên" }
];

export const INITIAL_SUPPLIERS = [
  { id: 1, name: "VLXD Hưng Thịnh", phone: "0909123456", address: "Q.12, TP.HCM", contact: "A. Hưng", debt: 0 },
  { id: 2, name: "Đại Lý Thép Miền Nam", phone: "0918888999", address: "Bình Dương", contact: "Chị Lan", debt: 15000000 },
  { id: 3, name: "Kho Sơn Dulux Tổng", phone: "0987654321", address: "Thủ Đức", contact: "Mr. John", debt: 5000000 },
  { id: 4, name: "Cát Đá Sông Đồng Nai", phone: "0903333444", address: "Đồng Nai", contact: "Chú Bảy", debt: 0 },
];

// --- THÊM PHẦN NÀY ---
export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Đơn hàng mới #DH005", message: "Khách hàng VLXD Hưng Thịnh vừa đặt hàng.", time: "5 phút trước", isRead: false, type: "order" },
  { id: 2, title: "Cảnh báo tồn kho", message: "Thép Pomina phi 10 sắp hết hàng (còn 200).", time: "1 giờ trước", isRead: false, type: "alert" },
  { id: 3, title: "Thanh toán thành công", message: "Đã nhận 15.000.000đ từ khách nợ.", time: "2 giờ trước", isRead: true, type: "success" },
  { id: 4, title: "Hệ thống bảo trì", message: "Bảo trì server vào 12:00 đêm nay.", time: "1 ngày trước", isRead: true, type: "info" }
];