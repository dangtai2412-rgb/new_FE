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
      
      // Kiểm tra tên biến 'token' cho khớp với Backend
      if (res.ok && data.token) { // Đổi access_token thành token
        localStorage.setItem("token", data.token); 
      }
      return { ok: res.ok, data };
    } catch (error) {
      return { ok: false, error: "Không thể kết nối đến server" };
    }
  },

  get_products: async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`);
      if (!res.ok) return [];
      return await res.json();
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
      return [];
    }
  },

  // Các hàm khác giữ nguyên logic của bạn...
};