Thiết kế UI/UX cho một Web App tên MealYummy.

MealYummy là ứng dụng giúp người dùng quyết định “Hôm nay ăn gì?” bằng AI.
Thiết kế giao diện đơn giản, hiện đại, dễ sử dụng, phù hợp sinh viên và người đi làm.

Thiết kế MVP trước, dễ mở rộng sau.

1️⃣ Phong cách thiết kế

Clean, Simple, Modern

Thân thiện, dễ dùng

Tông màu chính: xanh lá nhạt (healthy vibe)

Nền sáng (light mode)

Border radius 12px

Shadow nhẹ cho card

Font sans-serif hiện đại

Desktop layout 1440px

Có hình ảnh món ăn nhưng không quá rối

Giao diện phải:

Nhẹ

Không quá nhiều màu

Không lòe loẹt

Hình ảnh cân đối, gọn gàng

2️⃣ Design System

Tạo:

🎨 Color Palette

Primary

Primary Hover

Background

Surface

Text Primary

Text Secondary

Border

Success

Error

🔘 Components (Reusable + Auto Layout)

Button (Primary / Secondary / Outline / Disabled)

Input

Textarea

Dropdown

Card

Navbar

Sidebar

Statistic Card

Image Card (dùng cho món ăn)

Sử dụng 8px spacing system
Toàn bộ dùng Auto Layout

3️⃣ Các màn hình cần thiết kế
🟢 1. Landing Page – MealYummy

Header:

Logo “MealYummy” bên trái

Login / Register bên phải

Hero Section:

Heading lớn:
“Hôm nay ăn gì? Để MealYummy quyết định giúp bạn.”

Mô tả ngắn

Ô input demo

Nút Primary: “Gợi ý ngay”

Bên cạnh hero có thể đặt 1 hình minh họa món ăn nhẹ nhàng (không quá to).

🟢 2. Login / Register

Card ở giữa màn hình

Email

Password

Button Continue

Link Forgot password

Tab Login / Register

Thiết kế tối giản.

🟢 3. Trang nhập nhu cầu

Layout 2 cột:

Cột trái (Form):

Textarea lớn (nhập nhu cầu)

Ngân sách

Số người

Thời gian nấu

Dropdown chế độ ăn

Button “Gợi ý món”

Cột phải:

Khu vực hiển thị kết quả (placeholder trước khi có dữ liệu)

🟢 4. Trang hiển thị kết quả AI (Có hình ảnh)

Hiển thị danh sách card dọc.

Mỗi card gồm:

Phần trên:

Hình ảnh món ăn (chiếm 40% card, bo góc mềm)

Phần dưới:

Tên món (heading nổi bật)

Calo

Giá ước tính

Thời gian nấu

Lý do đề xuất (1–2 dòng)

Cuối card:

Button nhỏ:

Lưu món

Thử món khác

Thiết kế card:

Không quá lớn

Hình ảnh cân đối

Giữ bố cục sạch

🟢 5. Dashboard

Layout có Sidebar bên trái:

Sidebar:

Trang chủ

Lập thực đơn

Món đã lưu

Hồ sơ

Cài đặt

Main Content:

2–3 Statistic Cards

1 biểu đồ placeholder

Khu vực “Món đã lưu gần đây” hiển thị card nhỏ có hình ảnh

4️⃣ Trạng thái cần có

Hover button

Active sidebar

Loading state (AI đang gợi ý)

Empty state

Error state

5️⃣ Hình ảnh sử dụng

Hình ảnh món ăn chất lượng cao

Kích thước đồng đều

Bo góc mềm

Không quá rực rỡ

Giữ tone màu tự nhiên

6️⃣ Mục tiêu

Thiết kế một web app đơn giản, dễ hiểu, thân thiện, có hình ảnh món ăn để tăng cảm giác hấp dẫn nhưng vẫn giữ sự tối giản