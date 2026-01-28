// 2. Lấy danh sách sản phẩm (Đã nâng cấp để debug và tránh lỗi crash)
  get_products: async () => {
    try {
      // KIỂM TRA 1: Đảm bảo code chỉ chạy ở trình duyệt (Client-side)
      if (typeof window === "undefined") {
        return []; // Nếu chạy trên server (Next.js SSR), trả về rỗng để tránh lỗi localStorage
      }

      // KIỂM TRA 2: Lấy token
      const token = localStorage.getItem("token");

      // Nếu KHÔNG có token (chưa đăng nhập), thì không gọi API nữa để tránh lỗi 401
      if (!token) {
        console.warn("⚠️ Chưa có Token (User chưa đăng nhập).");
        return []; 
      }

      const res = await fetch(`${BASE_URL}/products/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
      });

      // KIỂM TRA 3: In ra lỗi chi tiết từ Server nếu thất bại
      if (!res.ok) {
        // Đọc nội dung lỗi server trả về (nếu có)
        const errorText = await res.text(); 
        console.error(`❌ API Lỗi [${res.status}]: ${errorText}`);
        throw new Error(`Server từ chối: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("🔥 Lỗi get_products:", error.message);
      // Trả về mảng rỗng để trang web không bị sập (trắng trang)
      return [];
    }
  }