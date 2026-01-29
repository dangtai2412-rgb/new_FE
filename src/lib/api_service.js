// src/lib/api_service.js

const BASE_URL = "http://localhost:9999/api/v1"; // Kiểm tra lại port backend của bạn

// Hàm helper để gọi fetch gọn hơn
const fetchClient = async (endpoint, options = {}) => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
    }
    return res.json();
};

export const api_service = {
    // 1. Sản phẩm (CRUD)
    get_products: () => fetchClient("/products/"),
    
    create_product: (data) => fetchClient("/products/", {
        method: "POST",
        body: JSON.stringify(data)
    }),

    update_product: (id, data) => fetchClient(`/products/${id}`, {
        method: "PUT", // Hoặc PATCH tùy backend
        body: JSON.stringify(data)
    }),

    delete_product: (id) => fetchClient(`/products/${id}`, {
        method: "DELETE"
    }),

    // 2. Danh mục & Đơn vị (Để hiển thị trong Dropdown)
    get_categories: () => fetchClient("/categories/"),
    get_units: () => fetchClient("/units/"),
};