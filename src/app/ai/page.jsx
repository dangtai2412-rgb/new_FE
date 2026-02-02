"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_PRODUCTS } from "@/lib/mock_data"; // Đọc đúng dữ liệu kho của bạn

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chào bạn! Tôi là trợ lý ảo BizFlow. Tôi có thể giúp bạn kiểm tra kho hàng, tra cứu giá cả hoặc tính toán đơn hàng. Bạn cần giúp gì không?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- LOGIC "AI" TỰ CHẾ (Rất hiệu quả để demo) ---
  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // 1. Lấy dữ liệu mới nhất (từ localStorage nếu có, không thì dùng mặc định)
    let products = INITIAL_PRODUCTS;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bizflow_products");
      if (saved) products = JSON.parse(saved);
    }

    // 2. Kịch bản trả lời
    if (lowerQuery.includes("xin chào") || lowerQuery.includes("hi")) {
      return "Chào chủ shop! Chúc bạn một ngày buôn may bán đắt. Cần kiểm tra kho cứ bảo tôi nhé!";
    }

    if (lowerQuery.includes("tổng") && (lowerQuery.includes("sản phẩm") || lowerQuery.includes("mặt hàng"))) {
      return `Hiện tại trong kho đang có tổng cộng **${products.length}** mặt hàng khác nhau.`;
    }

    if (lowerQuery.includes("sắp hết") || lowerQuery.includes("cần nhập")) {
      const lowStock = products.filter(p => p.stock < 10);
      if (lowStock.length === 0) return "Tuyệt vời! Không có sản phẩm nào sắp hết hàng.";
      return `Cảnh báo! Có **${lowStock.length}** sản phẩm sắp hết hàng cần nhập thêm: \n` + 
             lowStock.map(p => `- ${p.name} (còn ${p.stock} ${p.unit})`).join("\n");
    }

    // 3. Tìm kiếm sản phẩm cụ thể (Thông minh nhất)
    // Ví dụ user hỏi: "Giá xi măng bao nhiêu?"
    const foundProduct = products.find(p => lowerQuery.includes(p.name.toLowerCase()) || (lowerQuery.includes("xi măng") && p.name.toLowerCase().includes("xi măng")));
    
    if (foundProduct) {
      if (lowerQuery.includes("giá") || lowerQuery.includes("bao nhiêu")) {
        return `Sản phẩm **${foundProduct.name}** đang có giá bán là **${foundProduct.price.toLocaleString()}đ**/${foundProduct.unit}. (Giá vốn: ${foundProduct.cost.toLocaleString()}đ)`;
      }
      if (lowerQuery.includes("còn") || lowerQuery.includes("tồn") || lowerQuery.includes("số lượng")) {
        return `Trong kho hiện còn **${foundProduct.stock} ${foundProduct.unit}** sản phẩm **${foundProduct.name}**.`;
      }
      return `Thông tin **${foundProduct.name}**: \n- Giá bán: ${foundProduct.price.toLocaleString()}đ \n- Tồn kho: ${foundProduct.stock}`;
    }

    return "Xin lỗi, tôi chưa hiểu ý bạn hoặc không tìm thấy tên sản phẩm trong câu hỏi. Bạn thử hỏi cụ thể tên món hàng xem (ví dụ: 'Xi măng giá bao nhiêu?')";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Giả vờ suy nghĩ 1 giây cho giống thật
    setTimeout(() => {
      const aiResponse = generateResponse(userMsg.content);
      setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-t-xl border-b flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-lg text-slate-800">Trợ lý ảo AI BizFlow</h2>
          <p className="text-xs text-green-600 flex items-center gap-1">● Đang hoạt động (Demo Mode)</p>
        </div>
      </div>

      <Card className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"}`}>
              {msg.role === "ai" ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${msg.role === "ai" ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" : "bg-blue-600 text-white rounded-tr-none"}`}>
              {msg.content.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Bot size={18} className="text-blue-600 animate-pulse"/></div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none text-slate-400 text-xs italic flex items-center">Đang suy nghĩ...</div>
          </div>
        )}
      </Card>

      <div className="mt-4 flex gap-2">
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Hỏi về kho hàng, doanh thu..." 
          className="bg-white border-slate-300 shadow-sm text-base py-6"
        />
        <Button onClick={handleSend} className="h-full px-6 bg-blue-600 hover:bg-blue-700 shadow-md"><Send size={20} /></Button>
      </div>
    </div>
  );
}