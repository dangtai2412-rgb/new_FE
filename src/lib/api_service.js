// src/lib/api_service.js (Bổ sung thêm vào file hiện có)

// ... (Giữ nguyên các hàm cũ)

export const api_service = {
  // ... (code cũ: products, categories...)

  // --- KHÁCH HÀNG ---
  get_customers: async () => {
    try { return await fetchClient("/customers/"); } 
    catch (e) { console.warn("API customers lỗi/chưa có, dùng list rỗng."); return []; }
  },

  // --- ĐƠN HÀNG (POS) ---
  create_order: (orderData) => fetchClient("/orders/", {
    method: "POST",
    body: JSON.stringify(orderData)
  }),
};