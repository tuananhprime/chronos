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
