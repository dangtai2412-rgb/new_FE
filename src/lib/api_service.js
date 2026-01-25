const BASE_URL = "http://localhost:9999";

export const api_service = {
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      localStorage.setItem("token", data.access_token); // Lưu "chìa khóa" vào kho
    }
    return data;
  },  
  // Hàm lấy danh sách sản phẩm
  get_products: async () => {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error("Lỗi lấy dữ liệu sản phẩm");
    return res.json();
  },
  
  // Hàm tạo đơn hàng mới
  create_order: async (order_data) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order_data),
    });
    return res.json();
  },
  get_categories: async () => {
    const res = await fetch(`${BASE_URL}/api/categories/`); 
    return res.json();
  }
};