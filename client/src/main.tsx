import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles/index.css'
import App from './App.tsx'
import { tagAPI } from '../src/apis/tag.api.ts'; // Giả sử đây là nơi bạn lưu code vừa gửi
const testAPI = async () => {
  try {
    console.log("Đang gọi API lấy danh sách Tag...");
    const response = await tagAPI.getAll();
    console.log("Kết quả API nhận được:", response);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
  }
};

// Gọi hàm test
testAPI();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
