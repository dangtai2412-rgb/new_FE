"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Trash2, Command, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_PRODUCTS } from "@/lib/mock_data";

export default function AIPage() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chào bạn! Tôi là trí tuệ nhân tạo BizFlow. Tôi đã kết nối với kho dữ liệu thời gian thực của bạn. Bạn muốn kiểm tra doanh thu, tồn kho hay tra cứu mã hàng?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    let products = INITIAL_PRODUCTS;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bizflow_products");
      if (saved) products = JSON.parse(saved);
    }

    if (lowerQuery.includes("xin chào") || lowerQuery.includes("hi")) return "Chào chủ shop! Tôi đã sẵn sàng hỗ trợ bạn quản lý vận hành. Hôm nay chúng ta bắt đầu từ đâu?";
    if (lowerQuery.includes("tổng") && (lowerQuery.includes("sản phẩm") || lowerQuery.includes("mặt hàng"))) return `Hệ thống ghi nhận tổng cộng **${products.length}** danh mục hàng hóa đang lưu kho.`;
    
    if (lowerQuery.includes("sắp hết") || lowerQuery.includes("cần nhập")) {
      const lowStock = products.filter(p => p.stock < 10);
      if (lowStock.length === 0) return "✅ Trạng thái kho hàng đang rất an toàn. Không có mặt hàng nào dưới ngưỡng tối thiểu.";
      return `⚠️ **Cảnh báo tồn kho thấp:**\n` + lowStock.map(p => `• ${p.name}: còn ${p.stock} ${p.unit}`).join("\n") + `\n\nBạn có muốn tạo đơn nhập hàng nhanh không?`;
    }

    const foundProduct = products.find(p => lowerQuery.includes(p.name.toLowerCase()));
    if (foundProduct) {
      if (lowerQuery.includes("giá")) return `💰 **${foundProduct.name}**\n- Giá bán: **${foundProduct.price.toLocaleString()}đ**\n- Lợi nhuận gộp: ${(foundProduct.price - foundProduct.cost).toLocaleString()}đ`;
      return `📦 **${foundProduct.name}**\n- Tồn kho: ${foundProduct.stock} ${foundProduct.unit}\n- Trạng thái: ${foundProduct.stock > 0 ? "Còn hàng" : "Hết hàng"}`;
    }

    return "Tôi chưa tìm thấy thông tin cụ thể về yêu cầu này. Bạn có thể thử hỏi: 'Sản phẩm nào sắp hết hàng?' hoặc 'Giá của [Tên sản phẩm]'.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateResponse(userMsg.content);
      setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-2 md:p-6 space-y-4">
      
      {/* HEADER GỌN GÀNG & HIỆN ĐẠI */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-[24px] border border-slate-200 shadow-sm px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 animate-pulse" />
            <div className="relative w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 shadow-xl border border-white/10">
              <Sparkles size={24} />
            </div>
          </div>
          <div>
            <h2 className="font-black text-slate-900 tracking-tight">BizFlow Intelligence</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Engine Active</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-red-500" onClick={() => setMessages([messages[0]])}>
          <Trash2 size={20} />
        </Button>
      </div>

      {/* KHUNG CHAT SANG TRỌNG */}
      <Card className="flex-1 overflow-hidden flex flex-col border-none bg-slate-50/50 rounded-[32px] shadow-inner relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                msg.role === "ai" 
                ? "bg-white text-blue-600 border-slate-100" 
                : "bg-slate-900 text-white border-slate-800"
              }`}>
                {msg.role === "ai" ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`group relative p-4 px-6 rounded-[24px] max-w-[85%] md:max-w-[70%] text-sm leading-relaxed shadow-sm transition-all ${
                msg.role === "ai" 
                ? "bg-white text-slate-700 rounded-tl-none border border-white" 
                : "bg-blue-600 text-white rounded-tr-none"
              }`}>
                <div className="whitespace-pre-line font-medium">
                  {msg.content}
                </div>
                <span className={`text-[10px] mt-2 block opacity-0 group-hover:opacity-50 transition-opacity ${msg.role === "user" ? "text-right" : ""}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <Bot size={20} className="text-blue-600 animate-bounce"/>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-4 px-6 rounded-[24px] rounded-tl-none flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA: FOCUS TRẢI NGHIỆM */}
        <div className="p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100">
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-0 bg-blue-500/5 rounded-[20px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-2 bg-slate-100/50 p-2 rounded-[22px] border border-slate-200 focus-within:border-blue-400/50 focus-within:bg-white transition-all">
              <div className="pl-3 text-slate-400">
                <Command size={18} />
              </div>
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Hỏi về giá, kho hàng, hoặc báo cáo..." 
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-slate-700 font-medium placeholder:text-slate-400"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className={`rounded-[16px] w-12 h-12 p-0 transition-all ${
                  input.trim() ? "bg-blue-600 shadow-blue-200 shadow-lg scale-100" : "bg-slate-300 scale-95"
                }`}
              >
                <Zap size={20} fill={input.trim() ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Inventory Access</span>
            <span className="text-slate-200">|</span>
            <span>Real-time Analytics</span>
            <span className="text-slate-200">|</span>
            <span>SaaS Integrated</span>
          </div>
        </div>
      </Card>
    </div>
  );
}