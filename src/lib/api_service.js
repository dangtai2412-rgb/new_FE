// src/lib/api_service.js
const BASE_URL = "http://localhost:9999";

export const api_service = {
  // 1. Đăng nhập
  login: async (email, password, role) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // SỬA: Gửi role trong body
        body: JSON.stringify({ email, password, role }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        // Lưu role server trả về để chắc chắn
        const userRole = data.user?.role || role; 
        localStorage.setItem("role", userRole);
        localStorage.setItem("user_name", data.user?.name || "User");
      }
      return data;
    } catch (error) {
      console.error("Lỗi login:", error);
      return { error: "Lỗi kết nối server" };
    }
  },

  // 2. Lấy danh sách sản phẩm
  get_products: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return []; // Nếu không có token thì trả về rỗng luôn để tránh lỗi 401

      // SỬA: Thêm /api và bỏ dấu / ở cuối để Flask tự xử lý redirect
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        // In ra lỗi cụ thể từ server nếu có
        const errorData = await res.json().catch(() => ({}));
        console.error("Server Error:", errorData);
        throw new Error(`Lỗi ${res.status}: Không lấy được dữ liệu sản phẩm`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Lỗi get_products:", error);
      return [];
    }
  },
  
  // 3. Tạo đơn hàng
  create_order: async (order_data) => {
    try {
      const token = localStorage.getItem("token");
      // SỬA: Thêm /api
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(order_data),
      });
      return res.json();
    } catch (error) {
        console.error(error);
        return { error: "Lỗi tạo đơn" };
    }
  },

  // 4. Lấy danh mục
  get_categories: async () => {
    try {
      const token = localStorage.getItem("token");
      // Đường dẫn này đã đúng (/api/categories) nhưng thêm token cho chắc
      const res = await fetch(`${BASE_URL}/api/categories`, {
         headers: { "Authorization": `Bearer ${token}` }
      }); 
      if (!res.ok) return [];
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};