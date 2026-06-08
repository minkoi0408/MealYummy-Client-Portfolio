# Báo cáo Đầu vào và Đầu ra của API Quản lý Món ăn và Dữ liệu

Dưới đây là danh sách các API đã được thêm mới và nâng cấp để hỗ trợ Upload ảnh, Import/Export dữ liệu từ file JSON.

---

## 1. API Upload ảnh cho Món ăn (Meal)
API cho phép upload 1 file ảnh lên Cloudinary và tự động thêm URL ảnh đó vào món ăn.

- **Endpoint:** `POST /api/v1/meals/{id}/images`
- **Controller:** `MealController.java`
- **Quyền yêu cầu:** `CREATE_MEAL` hoặc `UPDATE_MEAL`
- **Input (Request):**
  - Path variable: `id` (String) - ID của món ăn.
  - Form-data: 
    - `file`: (Kiểu file/MultipartFile) - File ảnh tải lên.
- **Output (Response):**
  - Trả về đối tượng `MealResponseDTO` đã được cập nhật danh sách ảnh.
  ```json
  {
      "message": "Upload ảnh món ăn thành công",
      "data": {
          "id": "meal_123",
          "name": "Salad Ức Gà",
          "images": [
              {
                  "url": "https://res.cloudinary.com/.../image.jpg",
                  "mainImage": true
              }
          ]
      }
  }
  ```

---

## 2. API Import Categories từ file JSON (Nested/Bulk)
Hỗ trợ tạo hàng loạt Category từ file JSON, bao gồm cả cấu trúc đa tầng (nested).

- **Endpoint:** `POST /api/v1/data/import/upload/categories`
- **Controller:** `DataController.java`
- **Quyền yêu cầu:** `CREATE_CATEGORY`
- **Input (Request):**
  - Form-data:
    - `file`: (Kiểu file/MultipartFile) - File JSON chứa mảng các Category.
    - Định dạng file JSON yêu cầu:
      ```json
      [
        {
          "name": "Món Chính",
          "description": "Các món ăn chính"
        }
      ]
      ```
- **Output (Response):**
  - Thông báo số lượng dữ liệu đã import thành công.
  ```json
  {
      "message": "Import thành công 15 categories từ file!",
      "data": null
  }
  ```

---

## 3. API Import Tags từ file JSON (Bulk)
Hỗ trợ tạo hàng loạt Tag từ file JSON.

- **Endpoint:** `POST /api/v1/data/import/upload/tags`
- **Controller:** `DataController.java`
- **Quyền yêu cầu:** `CREATE_TAG`
- **Input (Request):**
  - Form-data:
    - `file`: (Kiểu file/MultipartFile) - File JSON chứa mảng các Tag.
- **Output (Response):**
  ```json
  {
      "message": "Import thành công 20 tags từ file!",
      "data": null
  }
  ```

---

## 4. API Import Ingredients từ file JSON (Bulk)
Hỗ trợ tạo hàng loạt Ingredient (Nguyên liệu) từ file JSON.

- **Endpoint:** `POST /api/v1/data/import/upload/ingredients`
- **Controller:** `DataController.java`
- **Quyền yêu cầu:** `CREATE_INGREDIENT`
- **Input (Request):**
  - Form-data:
    - `file`: (Kiểu file/MultipartFile) - File JSON chứa mảng các Ingredient.
- **Output (Response):**
  ```json
  {
      "message": "Import thành công 50 ingredients từ file!",
      "data": null
  }
  ```

---

## 5. Các API Export JSON
Hệ thống hiện tại đã hỗ trợ xuất dữ liệu ra định dạng JSON lưu trực tiếp vào ổ cứng server (`src/main/resources/json/`).

- **Endpoints:**
  - `GET /api/v1/data/export/categories`
  - `GET /api/v1/data/export/tags`
  - `GET /api/v1/data/export/ingredients`
- **Controller:** `DataController.java`
- **Input:** Không yêu cầu tham số.
- **Output (Response):**
  - File JSON sẽ được tạo tại đường dẫn `resources/json/category/category_response.json` (tương tự với tag và ingredient).
  - Kết quả API trả về thông báo:
  ```json
  {
      "message": "Xuất thành công 15 danh mục để lấy ID tạo Meal.",
      "data": null
  }
  ```
