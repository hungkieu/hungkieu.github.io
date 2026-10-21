# Ảnh hướng dẫn bài tập

Đặt ảnh WebP tại `<exercise-id>/step-<n>.webp` trong thư mục này.

- ID là slug chữ thường ASCII, số và dấu gạch nối, khớp ID metadata.
- Số bước bắt đầu từ 1, không có số 0 đầu và khớp vị trí trong `instructions`.
- Ví dụ file: `dumbbell-squat/step-1.webp`.
- Metadata lưu `/images/exercises/dumbbell-squat/step-1.webp`, không thêm `/homefit/`.
- Bridge ghép `BASE_URL`, UI chỉ dùng URL Bridge cung cấp.
- Thêm hoặc thay ảnh cần build và triển khai lại. JSON không chứa ảnh nhị phân hay URL ngoài.
- Seed hiện chưa có ảnh. Chỉ thêm `media` khi đã có file tương ứng; kiểm tra hình và kỹ thuật trước khi phát hành.

Service Worker dùng cache riêng `homefit-exercise-images-v1`, chỉ cache phản hồi 200 của ảnh đúng pattern thuộc app. Ảnh đã tải có thể dùng offline; ảnh chưa từng tải không được bảo đảm có sẵn. Cache tối đa 300 ảnh, thời hạn 90 ngày, cập nhật nền khi online và có thể bị trình duyệt thu hồi khi thiếu dung lượng.
