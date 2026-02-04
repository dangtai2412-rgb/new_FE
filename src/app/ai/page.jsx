"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Send, Bot, Sparkles, MessageSquare, 
  ShoppingCart, ArrowRight, CheckCircle2, AlertTriangle, FileText,
  Mic, MicOff, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_PRODUCTS } from "@/lib/mock_data";

const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Hàm loại bỏ dấu tiếng Việt để so sánh chuỗi dễ hơn
const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str.toLowerCase();
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState("order"); // Mặc định vào tab Đặt hàng luôn cho tiện demo
  const [products, setProducts] = useState([]);
  
  // State cho Chatbot
  const [messages, setMessages] = useState([
    { role: "ai", content: "Chào bạn! Tôi là trợ lý ảo BizFlow. Cần tra cứu kho cứ hỏi tôi nhé." }
  ]);
  const [inputChat, setInputChat] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // State cho Smart Order
  const [orderText, setOrderText] = useState(""); 
  const [parsedItems, setParsedItems] = useState([]); 
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false); // Trạng thái đang ghi âm

  // Load dữ liệu
  useEffect(() => {
    const saved = localStorage.getItem("bizflow_products");
    if (saved) setProducts(JSON.parse(saved));
    else setProducts(INITIAL_PRODUCTS);
  }, []);

  // --- TÍNH NĂNG 1: GIẢ LẬP VOICE-TO-TEXT ---
  const handleVoiceRecord = () => {
    if (isListening) return;
    setIsListening(true);
    setOrderText(""); // Xóa cũ

    // Giả vờ đang nghe trong 3 giây
    setTimeout(() => {
      setIsListening(false);
      // Điền câu mẫu "thần thánh" khớp với Mock Data
      setOrderText("Lấy cho anh 50 bao xi măng hà tiên và 5 khối cát xây dựng, giao gấp nhé.");
    }, 2500);
  };

  // --- TÍNH NĂNG 2: PHÂN TÍCH ĐƠN HÀNG (Logic cải tiến) ---
  const analyzeOrder = () => {
    if (!orderText) return;
    setIsAnalyzing(true);
    setParsedItems([]);

    setTimeout(() => {
      const foundItems = [];
      // Chuẩn hóa văn bản đầu vào: bỏ dấu, viết thường
      const normalizedText = removeVietnameseTones(orderText);
      
      // Tách câu thành các cụm từ (bằng dấu phẩy, chữ "và", "với")
      // Ví dụ: "5 xi măng, 2 cát" -> ["5 xi măng", " 2 cát"]
      const segments = normalizedText.split(/,| và | với |\.|\n/);

      products.forEach(prod => {
        const normalizedProdName = removeVietnameseTones(prod.name);
        // Tách tên SP thành các từ khóa chính. VD: "Xi măng Hà Tiên" -> "xi mang"
        const keywords = normalizedProdName.split(" ").slice(0, 2).join(" "); 

        // Duyệt từng đoạn văn bản xem có chứa từ khóa sản phẩm không
        segments.forEach(seg => {
          if (seg.includes(keywords) || seg.includes(normalizedProdName)) {
            // Nếu tìm thấy tên SP trong đoạn này, tìm số lượng trong chính đoạn đó
            const matches = seg.match(/(\d+)/); // Tìm số đầu tiên trong đoạn
            let qty = 1;
            if (matches) {
              qty = parseInt(matches[0]);
            }

            // Kiểm tra xem đã add chưa để tránh trùng
            if (!foundItems.find(i => i.id === prod.id)) {
              foundItems.push({
                ...prod,
                quantity: qty,
                total: prod.price * qty
              });
            }
          }
        });
      });

      setParsedItems(foundItems);
      setIsAnalyzing(false);
    }, 1000);
  };

  const confirmOrder = () => {
    if(parsedItems.length === 0) return;
    
    const newOrder = {
      id: Date.now(),
      customer: "Đơn Voice (AI)",
      date: new Date().toISOString(),
      items: parsedItems,
      total: parsedItems.reduce((sum, i) => sum + i.total, 0),
      paymentMethod: "cash"
    };

    const currentOrders = JSON.parse(localStorage.getItem("bizflow_orders") || "[]");
    localStorage.setItem("bizflow_orders", JSON.stringify([newOrder, ...currentOrders]));

    alert("✅ Đã tạo đơn hàng thành công!");
    setParsedItems([]);
    setOrderText("");
  };

  // Logic Chatbot cũ
  const handleSendChat = async () => {
    if (!inputChat.trim()) return;
    const userMsg = { role: "user", content: inputChat };
    setMessages(prev => [...prev, userMsg]);
    setInputChat("");
    setIsTyping(true);
    setTimeout(() => {
      const lowerQuery = userMsg.content.toLowerCase();
      let response = "Xin lỗi, tôi chưa hiểu ý bạn.";
      if (lowerQuery.includes("giá")) response = "Bạn muốn hỏi giá sản phẩm nào? (VD: Giá xi măng)";
      else {
        const found = products.find(p => lowerQuery.includes(p.name.toLowerCase()));
        if (found) response = `${found.name}: Giá ${formatMoney(found.price)} - Tồn kho: ${found.stock}`;
      }
      setMessages(prev => [...prev, { role: "ai", content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 max-w-6xl mx-auto font-sans">
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shadow-inner">
          <button onClick={() => setActiveTab("chat")} className={`px-6 py-2 rounded-lg text-sm font-bold flex gap-2 ${activeTab === 'chat' ? 'bg-white text-blue-600 shadow' : 'text-slate-500'}`}>
            <MessageSquare size={18}/> Chatbot
          </button>
          <button onClick={() => setActiveTab("order")} className={`px-6 py-2 rounded-lg text-sm font-bold flex gap-2 ${activeTab === 'order' ? 'bg-purple-600 text-white shadow' : 'text-slate-500'}`}>
            <Sparkles size={18}/> Tạo đơn bằng Giọng nói
          </button>
        </div>
      </div>

      {activeTab === "chat" && (
        <Card className="flex-1 flex flex-col shadow-lg border-slate-200 overflow-hidden">
          {/* ... Phần Chatbot giữ nguyên ... */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto" ref={scrollRef}>
             {messages.map((m,i)=>(<div key={i} className={`p-3 rounded-xl w-fit max-w-[80%] text-sm ${m.role==='ai'?'bg-slate-100':'bg-blue-600 text-white ml-auto'}`}>{m.content}</div>))}
             {isTyping && <div className="text-xs text-slate-400">Đang nhập...</div>}
          </div>
          <div className="p-4 border-t flex gap-2">
            <Input value={inputChat} onChange={e=>setInputChat(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSendChat()} placeholder="Hỏi AI..." />
            <Button onClick={handleSendChat}><Send size={18}/></Button>
          </div>
        </Card>
      )}

      {activeTab === "order" && (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <Card className="flex-1 flex flex-col shadow-md border-slate-200">
            <CardHeader className="bg-slate-50 border-b pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-purple-700">
                <Mic className="text-purple-600"/> Nhập lệnh giọng nói (Voice Command)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-4">
              
              {/* Vùng hiển thị trạng thái ghi âm */}
              <div className={`flex-1 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all ${isListening ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"}`}>
                {isListening ? (
                  <div className="text-center animate-pulse">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic size={32} className="text-red-600"/>
                    </div>
                    <p className="text-red-600 font-bold">Đang nghe...</p>
                    <p className="text-xs text-red-400">Nói to rõ tên sản phẩm và số lượng</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col">
                    <textarea 
                      className="flex-1 w-full bg-transparent outline-none resize-none text-slate-700 text-lg placeholder:text-slate-400"
                      placeholder="Bấm nút Micro bên dưới và nói: 'Lấy 5 bao xi măng...'"
                      value={orderText}
                      onChange={(e) => setOrderText(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Nút Micro to đùng */}
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  onClick={handleVoiceRecord}
                  disabled={isListening}
                  className={`col-span-1 h-14 rounded-xl ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-800 hover:bg-slate-900'} text-white shadow-lg transition-all`}
                  title="Giả lập giọng nói"
                >
                  {isListening ? <MicOff/> : <Mic/>}
                </Button>
                
                <Button 
                  onClick={analyzeOrder} 
                  disabled={!orderText.trim() || isAnalyzing || isListening}
                  className="col-span-3 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg shadow-lg rounded-xl"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin"/> : <><Sparkles className="mr-2"/> Phân tích & Lên đơn</>}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* CỘT PHẢI: KẾT QUẢ */}
          <div className="flex-1 flex flex-col gap-4">
             <Card className="flex-1 shadow-md border-slate-200 overflow-hidden flex flex-col">
                <CardHeader className="bg-green-50 border-b pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-green-800">
                    <CheckCircle2 size={18}/> Đơn hàng đề xuất
                  </CardTitle>
                </CardHeader>
                <div className="flex-1 p-0 overflow-y-auto bg-white">
                  {parsedItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="text-center">SL</TableHead>
                          <TableHead className="text-right">Thành tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedItems.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium text-slate-700">{item.name}</TableCell>
                            <TableCell className="text-center font-bold bg-slate-50 rounded">{item.quantity}</TableCell>
                            <TableCell className="text-right text-blue-600 font-bold">{formatMoney(item.total)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-slate-50">
                          <TableCell colSpan={2} className="font-bold text-slate-600">Tổng cộng</TableCell>
                          <TableCell className="text-right text-xl font-extrabold text-red-600">
                            {formatMoney(parsedItems.reduce((sum, i) => sum + i.total, 0))}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center space-y-4">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                        {isAnalyzing ? <Sparkles className="animate-spin text-purple-400" size={40}/> : <ShoppingCart size={40}/>}
                      </div>
                      <p>{isAnalyzing ? "AI đang xử lý ngôn ngữ tự nhiên..." : "Chưa có dữ liệu"}</p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t bg-white">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 font-bold text-lg shadow-green-200 shadow-lg" disabled={parsedItems.length === 0} onClick={confirmOrder}>
                    <ArrowRight className="mr-2"/> Xác nhận tạo đơn
                  </Button>
                </div>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}