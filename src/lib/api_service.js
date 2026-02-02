// File: src/lib/api_service.js
const BASE_URL = "http://localhost:9999"; // Đảm bảo trùng port với server Python

export const api_service = {
  // 1. Logic Đăng nhập (Của bạn)
  login: async (email, password, role) => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user?.role || role);
        localStorage.setItem("user_name", data.user?.name || "User");
      }
      return data;
    } catch (error) {
      console.error("Lỗi login:", error);
      return { error: "Lỗi kết nối server" };
    }
  },

  // 2. Logic lấy sản phẩm (Của nhánh feature-d)
  get_products: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];
      const res = await fetch(`${BASE_URL}/api/products`, { // Endpoint khớp với Backend
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Lỗi ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error("Lỗi get_products:", error);
      return [];
    }
  },

  // 3. Logic tạo đơn hàng (Của nhánh feature-d)
  create_order: async (order_data) => {
    try {
      const token = localStorage.getItem("token");
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
  }
};
  delete_product: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/products/${id}`, { // Backend phải có route này
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      return res.ok; // Trả về true nếu xóa thành công
    } catch (error) {
      console.error("Lỗi xóa SP:", error);
      return false;
    }
  };

  // 2. Thêm hàm tạo sản phẩm mới
  create_product: async (productData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (error) {
      return null;
    }
  };
  