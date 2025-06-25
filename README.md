# AgriCarbonDex - Sàn Giao Dịch Tín Chỉ Carbon NFT

## 1. Giới Thiệu

AgriCarbonDex là một ứng dụng phi tập trung (DApp) được xây dựng trên blockchain, cho phép người dùng giao dịch các Tín chỉ Carbon được token hóa dưới dạng NFT (ERC-721). Người dùng có thể sử dụng một loại token tiện ích là Carbon Credit Token (CCT - ERC-20) để mua bán các NFT này.

Dự án này mô phỏng một hệ thống giao dịch tín chỉ carbon minh bạch, nơi mọi giao dịch đều được ghi lại trên blockchain, đảm bảo tính toàn vẹn và không thể thay đổi.

## 2. Kiến Trúc Dự Án

Dự án được chia thành 3 thành phần chính:

-   `AgriDex/` (Frontend): Giao diện người dùng được xây dựng bằng React, sử dụng Vite làm công cụ build. Đây là nơi người dùng tương tác với DApp.
-   `AgriDexBack/` (Backend): Một máy chủ Node.js/Express đóng vai trò hỗ trợ. Backend xử lý các tác vụ yêu cầu quyền của người sở hữu (owner), chẳng hạn như list một NFT lên sàn thay cho người dùng sau khi họ đã "approve".
-   `ERC721-ERC20/` (Smart Contracts): Chứa mã nguồn các hợp đồng thông minh viết bằng Solidity, bao gồm token CCT (ERC-20), NFT Tín chỉ Carbon (ERC-721) và hợp đồng sàn giao dịch (DEX).

## 3. Công Nghệ Sử Dụng

-   **Frontend:** React, Vite, Ethers.js, CSS
-   **Backend:** Node.js, Express.js, Ethers.js, Dotenv
-   **Blockchain:** Solidity, Mạng thử nghiệm Sepolia
-   **Ví:** MetaMask

## 4. Hướng Dẫn Cài Đặt và Chạy Dự Án

### Yêu Cầu

-   Node.js (phiên bản 16 trở lên)
-   npm hoặc yarn
-   Ví MetaMask đã cài đặt trên trình duyệt

### Bước 1: Triển Khai Smart Contract

1.  Các file mã nguồn Solidity nằm trong thư mục `ERC721-ERC20/`.
2.  Sử dụng một công cụ như Remix, Hardhat hoặc Truffle để biên dịch và triển khai các hợp đồng sau lên mạng thử nghiệm **Sepolia**:
    -   `CarbonCreditToken.sol`
    -   `CarbonOffsetNFT.sol`
    -   `NFTDEX.sol` (hoặc `simpledex.sol` tùy vào file bạn sử dụng)
3.  Sau khi triển khai, lưu lại địa chỉ của cả 3 hợp đồng.

### Bước 2: Cấu Hình và Chạy Backend

1.  Đi tới thư mục backend:
    ```sh
    cd AgriCarbonDex/AgriDexBack
    ```
2.  Cài đặt các dependencies:
    ```sh
    npm install
    ```
3.  Tạo một file `.env` trong thư mục `AgriDexBack` và điền các thông tin sau:
    ```env
    # Khóa riêng của tài khoản đã triển khai các smart contract (ví owner)
    PRIVATE_KEY=YOUR_DEPLOYER_PRIVATE_KEY

    # URL của một node RPC mạng Sepolia (ví dụ từ Infura, Alchemy)
    RPC_URL=YOUR_SEPOLIA_RPC_URL

    # Địa chỉ các contract đã triển khai ở Bước 1
    NFTDEX_ADDRESS=YOUR_NFTDEX_CONTRACT_ADDRESS
    CARBON_OFFSET_NFT_ADDRESS=YOUR_CARBON_OFFSET_NFT_ADDRESS
    CARBON_CREDIT_TOKEN_ADDRESS=YOUR_CARBON_CREDIT_TOKEN_ADDRESS
    ```
4.  Khởi động máy chủ backend:
    ```sh
    npm start
    ```
    Máy chủ sẽ chạy tại `http://localhost:3001`.

### Bước 3: Cấu Hình và Chạy Frontend

1.  Mở một terminal mới và đi tới thư mục frontend:
    ```sh
    cd AgriCarbonDex/AgriDex
    ```
2.  Cài đặt các dependencies:
    ```sh
    npm install
    ```
3.  Cập nhật địa chỉ contract trong code frontend (nếu cần). Một số địa chỉ có thể được hardcode trong các file như `src/utils/constants.js` hoặc trực tiếp trong các component. Hãy kiểm tra và đảm bảo chúng khớp với địa chỉ bạn đã triển khai.
4.  Khởi động ứng dụng React:
    ```sh
    npm run dev
    ```
    Ứng dụng sẽ chạy tại `http://localhost:5173` (hoặc một cổng khác do Vite chỉ định).

## 5. Hướng Dẫn Sử Dụng

1.  Mở trình duyệt và truy cập `http://localhost:5173`.
2.  Kết nối ví MetaMask của bạn với mạng Sepolia.
3.  **Mua Token CCT:** Truy cập trang "Buy" để mua token CCT. Chức năng này có thể được quản lý bởi backend (admin mint) hoặc bạn phải tự trả phí gas tùy theo logic hiện tại.
4.  **List NFT:**
    -   Đảm bảo bạn sở hữu một vài Carbon Offset NFT.
    -   Truy cập trang "List".
    -   Với mỗi NFT, bạn cần nhấn "Approve" để cấp quyền cho sàn DEX tương tác với NFT đó.
    -   Sau khi approve, nhập giá (bằng CCT) và nhấn "List" để đưa NFT lên sàn.
5.  **Giao dịch:** Truy cập các trang "Trade" hoặc "Buy NFT" để xem các NFT đang được niêm yết và thực hiện giao dịch.
