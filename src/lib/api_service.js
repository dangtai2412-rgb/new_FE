// src/lib/api_service.js (Thêm vào object api_service)

export const api_service = {
  // ... (giữ nguyên code cũ)

  // --- ORDER HISTORY (DASHBOARD) ---
  get_orders: async () => {
    try { return await fetchClient("/orders/"); } 
    catch (e) { console.warn("API orders lỗi/chưa có, trả về rỗng."); return []; }
  },
};
