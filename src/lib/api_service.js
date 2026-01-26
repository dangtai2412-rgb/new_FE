// src/lib/api_service.js
const BASE_URL = "http://localhost:9999";

export const api_service = {
  // 1. Đăng nhập (Lưu token)
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      // Lưu token vào bộ nhớ máy
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); 
      }
      
      return data;
    } catch (error) {
      console.error("Lỗi kết nối Login:", error);
      return { error: "Không thể kết nối đến server" };
    }
  },

  // 2. Lấy danh sách sản phẩm (ĐÃ SỬA: Gửi kèm Token)
  get_products: async () => {
    try {
      // Lấy token từ bộ nhớ ra
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${BASE_URL}/products/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Quan trọng nhất: Gửi chìa khóa
        }
      });

      if (!res.ok) throw new Error("Lỗi lấy dữ liệu sản phẩm");
      return await res.json();
    } catch (error) {
      console.error("Lỗi get_products:", error);
      return [];
    }
  },
  
  // 3. Tạo đơn hàng (ĐÃ SỬA: Bỏ comment dòng Authorization)
  create_order: async (order_data) => {
    const token = localStorage.getItem("token");
    
    const res = await fetch(`${BASE_URL}/orders/`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Đã bật lại dòng này
      },
      body: JSON.stringify(order_data),
    });
    return res.json();
  },

  // 4. Lấy danh mục
  get_categories: async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/categories`); 
      return res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};