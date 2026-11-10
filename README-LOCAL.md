# CHRONOS — chạy local trên Mac

Mã nguồn tải từ thư mục Google Drive CHRONOS được cung cấp.

## Khởi chạy

Máy cần JDK 21 trở lên. Maven Wrapper sẽ tải Maven 3.9.11 trong lần chạy đầu tiên.

```sh
cd /Users/finn/Steal/chronos
./run-local.sh
```

Mở http://127.0.0.1:8080/login.html.

Tài khoản demo sau đây chỉ có trong database local trên máy đã thiết lập;
không được đưa lên GitHub. Sau khi clone mới, hãy tự đăng ký tài khoản.

Tài khoản demo trên máy hiện tại:
- Username: `tuananhprime`
- Password: `Demo@12345`

Có thể tự đăng ký tài khoản tại `/register.html`.

## Database

Profile `local` dùng H2 dạng file, lưu trong `data/chronos.mv.db`.
Hibernate tạo các bảng từ entity Java. Đây là cấu hình local thay thế,
không phải SQL Server và chưa xác minh toàn bộ nghiệp vụ.
File `database/script.sql` là bản gốc SQL Server, chỉ có schema, không có INSERT.
Không thực thi file này với H2. Cấu hình SQL Server gốc vẫn nằm trong
`src/main/resources/application.properties`; chạy không có profile `local`
sẽ dùng cấu hình đó và cần SQL Server cùng thông tin đăng nhập phù hợp.

Đã kiểm tra compile, trang login/register/dashboard, CSS/ảnh, API KPI,
và đăng ký/đăng nhập qua API. Chưa kiểm thử toàn bộ luồng giao dịch.

Các thay đổi để chạy local:
- Thêm driver H2 và profile local.
- Compile bytecode Java 21 để tương thích Spring Boot 3.3.5.
- Sửa main class cho exec plugin thành `com.mycompany.chronos.ChronosApplication`.

Nhấn Ctrl+C trong terminal đang chạy để dừng.
