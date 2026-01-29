// src/lib/api_service.js

const BASE_URL = "http://localhost:9999/api/v1"; // Đảm bảo đúng port Backend của bạn

// Hàm helper gọi API chung
const fetchClient = async (endpoint, options = {}) => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  
  // Lưu ý: Nếu user chưa đăng nhập (không có token), API có thể trả về 401.
  // Ở đây ta cứ gửi request, để Backend quyết định.
  
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Gửi kèm token nếu có
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    // Ném lỗi ra để component xử lý (hiện thông báo cho user)
    throw new Error(`Lỗi Server (${res.status}): ${errorText}`);
  }

  // Nếu response không có nội dung (VD: 204 No Content), trả về null
  if (res.status === 204) return null;

  return res.json();
};

export const api_service = {
  // --- SẢN PHẨM ---
  get_products: () => fetchClient("/products/"),
  
  create_product: (data) => fetchClient("/products/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  update_product: (id, data) => fetchClient(`/products/${id}`, {
    method: "PUT", // Nếu Backend bạn dùng PATCH thì sửa thành "PATCH"
    body: JSON.stringify(data),
  }),

  delete_product: (id) => fetchClient(`/products/${id}`, {
    method: "DELETE",
  }),

  // --- DANH MỤC & ĐƠN VỊ ---
  // Thêm catch() để nếu Backend chưa có API này thì không bị chết trang
  get_categories: async () => {
    try { return await fetchClient("/categories/"); } 
    catch (e) { console.warn("Chưa có API categories, dùng danh sách rỗng."); return []; }
  },
  
  get_units: async () => {
    try { return await fetchClient("/units/"); } 
    catch (e) { console.warn("Chưa có API units, dùng danh sách rỗng."); return []; }
  },
};