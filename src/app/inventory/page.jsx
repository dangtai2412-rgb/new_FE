"use client"

import { useEffect, useMemo, useState } from "react";
import { api_service } from "@/lib/api_service";
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Package, 
  AlertTriangle,
  Layers,
  DollarSign,
  ArrowUpDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* =====================
   HELPERS
===================== */

const formatMoney = (num) =>
  num.toLocaleString("vi-VN") + "đ";

const PAGE_SIZE = 6;

/* =====================
   LOADING
===================== */

const LoadingBox = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
    <div className="h-32 bg-slate-200 rounded"></div>
    <div className="h-64 bg-slate-200 rounded"></div>
  </div>
);

/* =====================
   PAGE
===================== */

export default function InventoryPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [sortType, setSortType] = useState("none");
  const [page, setPage] = useState(1);

  /* =====================
     FETCH DATA
  ===================== */

  useEffect(() => {
    api_service.get_products()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* =====================
     CATEGORIES
  ===================== */

  const categories = useMemo(() => {
    return ["Tất cả", ...new Set(products.map(p => p.category))];
  }, [products]);

  /* =====================
     FILTER + SORT
  ===================== */

  const processedProducts = useMemo(() => {

    let data = [...products];

    // Search
    data = data.filter(p =>
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    // Category
    if (category !== "Tất cả") {
      data = data.filter(p => p.category === category);
    }

    // Sort
    if (sortType === "priceAsc") {
      data.sort((a, b) => a.sale_price - b.sale_price);
    }

    if (sortType === "priceDesc") {
      data.sort((a, b) => b.sale_price - a.sale_price);
    }

    if (sortType === "stockAsc") {
      data.sort((a, b) => a.stock - b.stock);
    }

    if (sortType === "stockDesc") {
      data.sort((a, b) => b.stock - a.stock);
    }

    return data;

  }, [products, search, category, sortType]);

  /* =====================
     PAGINATION
  ===================== */

  const totalPages = Math.ceil(processedProducts.length / PAGE_SIZE);

  const pagedProducts = useMemo(() => {

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return processedProducts.slice(start, end);

  }, [processedProducts, page]);

  /* =====================
     STATS
  ===================== */

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, p) => sum + p.stock,
    0
  );

  const totalValue = products.reduce(
    (sum, p) => sum + p.stock * p.cost_price,
    0
  );

  const lowStockCount = products.filter(p => p.stock < 10).length;

  const pageValue = pagedProducts.reduce(
    (sum, p) => sum + p.stock * p.cost_price,
    0
  );

  if (loading) return <LoadingBox />;

  /* =====================
     UI
  ===================== */

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            Quản lý Kho hàng nâng cao
          </h2>
          <p className="text-slate-500 mt-1">
            Tìm kiếm, phân loại, sắp xếp và phân trang dữ liệu kho
          </p>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2">
          <Plus size={18}/>
          Thêm sản phẩm
        </Button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatBox icon={<Package />} title="Sản phẩm" value={totalProducts} />
        <StatBox icon={<Layers />} title="Tồn kho" value={totalStock.toLocaleString()} />
        <StatBox icon={<DollarSign />} title="Giá trị kho" value={formatMoney(totalValue)} />
        <StatBox 
          icon={<AlertTriangle className="text-red-500"/>} 
          title="Sắp hết" 
          value={lowStockCount} 
        />

      </div>

      {/* FILTER BAR */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>
            <Input
              className="pl-10"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* CATEGORY */}
          <select
            className="border rounded px-3 py-2"
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {categories.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* SORT */}
          <select
            className="border rounded px-3 py-2"
            value={sortType}
            onChange={e => setSortType(e.target.value)}
          >
            <option value="none">Sắp xếp</option>
            <option value="priceAsc">Giá ↑</option>
            <option value="priceDesc">Giá ↓</option>
            <option value="stockAsc">Tồn kho ↑</option>
            <option value="stockDesc">Tồn kho ↓</option>
          </select>

          {/* PAGE INFO */}
          <div className="flex items-center justify-center text-sm text-slate-500">
            Trang {page} / {totalPages || 1}
          </div>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>

        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-center">Tồn</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead className="text-right">Giá vốn</TableHead>
                <TableHead className="text-right">Giá bán</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {pagedProducts.map(p => (

                <TableRow key={p.id} className="hover:bg-slate-50">

                  <TableCell className="text-blue-600 font-medium">
                    {p.id}
                  </TableCell>

                  <TableCell>{p.name}</TableCell>

                  <TableCell>
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                      {p.category}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className={`flex justify-center gap-1
                      ${p.stock < 10 ? "text-red-500 font-bold" : ""}`}>
                      {p.stock < 10 && <AlertTriangle size={14}/>}
                      {p.stock}
                    </span>
                  </TableCell>

                  <TableCell>{p.unit}</TableCell>

                  <TableCell className="text-right">
                    {formatMoney(p.cost_price)}
                  </TableCell>

                  <TableCell className="text-right font-bold">
                    {formatMoney(p.sale_price)}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Pencil size={16}/>
                      </Button>
                      <Button variant="ghost" size="icon-sm" className="text-red-500">
                        <Trash2 size={16}/>
                      </Button>
                    </div>
                  </TableCell>

                </TableRow>

              ))}

              {pagedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-slate-400">
                    Không có sản phẩm
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      {/* PAGINATION BUTTONS */}
      <div className="flex justify-center gap-2">

        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Trước
        </Button>

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Sau
        </Button>

      </div>

      {/* PAGE SUMMARY */}
      <div className="text-right text-sm text-slate-500">
        Giá trị kho trang này: 
        <span className="font-semibold ml-2">
          {formatMoney(pageValue)}
        </span>
      </div>

    </div>
  );
}

/* =====================
   STAT BOX
===================== */

function StatBox({ icon, title, value }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
