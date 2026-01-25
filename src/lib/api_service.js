const BASE_URL = "http://localhost:9999";

export const api_service = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      // --- ĐOẠN SỬA QUAN TRỌNG ---
      // Backend trả về 'token', nên phải kiểm tra data.token
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token); 
      }
      // ----------------------------
      
      return data;
    } catch (error) {
      console.error("Lỗi kết nối Login:", error);
      return { error: "Không thể kết nối đến server" };
    }
  },

  // Hàm lấy danh sách sản phẩm
  get_products: async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) throw new Error("Lỗi lấy dữ liệu sản phẩm");
      return await res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  
  // Hàm tạo đơn hàng mới
  create_order: async (order_data) => {
    const token = localStorage.getItem("token"); // Lấy token để gửi kèm nếu cần
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // Bỏ comment dòng này nếu Backend yêu cầu xác thực
      },
      body: JSON.stringify(order_data),
    });
    return res.json();
  },

  get_categories: async () => {
    try {
      // Lưu ý: Backend Flask thường không thích dấu / ở cuối, nên bỏ đi cho chắc
      const res = await fetch(`${BASE_URL}/api/categories`); 
      return res.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};