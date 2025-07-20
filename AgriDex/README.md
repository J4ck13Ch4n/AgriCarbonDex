# Carbon Credit DEX Frontend Skeleton

## Cài đặt & chạy thử

```sh
npm install
npm run dev
```

- Mở trình duyệt: http://localhost:5173/trade

## Cấu trúc dự án
- UI layout giống ảnh mẫu, chia 3 cột, tab panel dưới, màu nền đen, chữ trắng, accent xanh/đỏ.
- Các component/table chỉ nhận data={[]} (placeholder), chưa fetch thật.
- Để gắn API, sửa các TODO trong `src/utils/api.js` và các component.

## Ghi chú
- Đã cấu hình sẵn TailwindCSS + Bootstrap trong `src/style/global.css`.
- Đã scaffold sẵn các file layout, table, page, route.
- Chưa có logic blockchain, chỉ UI và placeholder.
