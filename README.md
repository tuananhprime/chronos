# CHRONOS

Ứng dụng Java Spring Boot quản lý giao dịch tài trợ thương mại, với giao diện HTML/CSS/JavaScript.

## Chạy local

Yêu cầu JDK 21 trở lên và kết nối Internet trong lần đầu tải Maven/thư viện.

```sh
git clone https://github.com/tuananhprime/chronos.git
cd chronos
./run-local.sh
```

Mở http://127.0.0.1:8080/login.html và đăng ký tài khoản tại
http://127.0.0.1:8080/register.html.
Trên Windows, chạy `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local`.

Profile `local` dùng H2, tự tạo bảng từ entity và lưu dữ liệu trong `data/`.
Database và tài khoản local không nằm trong repository.

## SQL Server

File `database/script.sql` chứa schema SQL Server gốc, không có dữ liệu mẫu.
Cấu hình SQL Server nằm tại `src/main/resources/application.properties`.
Đây là cấu hình dành cho môi trường gốc, cần điều chỉnh kết nối và xác thực
trước khi chạy mà không dùng profile `local`.

Mã nguồn được tải từ thư mục Google Drive CHRONOS do người dùng cung cấp;
có bổ sung cấu hình local, Maven Wrapper và hướng dẫn chạy trên Mac.
Xem [README-LOCAL.md](README-LOCAL.md) để biết các thay đổi và phạm vi kiểm tra.

## Chế độ khách và tài khoản

Khách có thể xem giao diện, chuyển trang và tab. Ô nhập, bộ lọc và nút nghiệp vụ
bị khóa; nút tạo yêu cầu dẫn tới đăng nhập. Trang đăng nhập và đăng ký luôn
cho phép nhập liệu. Sau khi đăng nhập, hệ thống mở lại trang đang xem.
Không có khung chú thích về chế độ khách trên giao diện.

## Vercel và database online

Vercel chạy Spring Boot bằng `Dockerfile.vercel`, profile `production`.
Neon PostgreSQL lưu tài khoản và dữ liệu lâu dài. Các biến sau được quản lý
trong Vercel, không đưa vào Git:

- `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`: từ tích hợp Neon.
- `CHRONOS_JWT_SECRET`: khóa Base64 ngẫu nhiên riêng cho môi trường production.

Hibernate tạo/cập nhật schema `dbo` từ entity. Database production là database
mới, không nhập tài khoản hoặc mật khẩu mẫu từ database local.
Mật khẩu mới được băm bằng BCrypt. Đăng ký công khai chỉ tạo tài khoản khách
hàng; tài khoản ngân hàng cần được quản trị viên cấp riêng.
API dữ liệu yêu cầu JWT hợp lệ, tài khoản chỉ đọc/sửa được hồ sơ của mình.
Cấu hình H2 local và SQL Server gốc vẫn được giữ theo profile.

Dùng `./mvnw -DskipTests package spring-boot:repackage` để tạo JAR chạy được.
Đã kiểm tra đăng ký/đăng nhập qua trình duyệt với PostgreSQL, truy cập dashboard,
trùng tài khoản, sai mật khẩu, giới hạn quyền ngân hàng và quyền hồ sơ.
