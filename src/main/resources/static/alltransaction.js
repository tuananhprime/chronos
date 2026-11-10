/* logic-bank-all-transactions.js - (ĐÃ CHUẨN HÓA) */
document.addEventListener('DOMContentLoaded', function() {


    /* --- 1. Áp dụng Custom Select cho trang này --- */
    (function applyBankAllTransactionsSelects() {
        const transForm = document.getElementById('bank-all-transactions-filter-form');
        if (!transForm) return; // Chỉ chạy nếu ở đúng trang
       
        const selects = transForm.querySelectorAll('select');
        // Gọi hàm createCustomSelect từ dashboard-core.js
        selects.forEach(s => window.createCustomSelect(s));
    })();




    /* --- 2. Logic Trang (Filter, Bảng, Modal) --- */
    (function setupBankAllTransactionsPage() {
        const tbody = document.getElementById("transactionBody");
        // Kiểm tra bằng ID của form (vì tbody có thể dùng chung)
        const form = document.getElementById('bank-all-transactions-filter-form');
        if (!tbody || !form) return; // Chỉ chạy nếu ở đúng trang


        const noValid = document.getElementById("noValid");
        const filterBtn = document.getElementById("applyFilter");


        // Dữ liệu mẫu (ĐÃ THÊM CUSTOMER)
        const data = [
          {
            date: "2025-01-02", type: "TT", id: "TX1001", customer: "Doe Enterprises", status: "Pending",
            beneficiary: "Apex Corp", amount: "150000.00", currency: "USD",
            country: "USA", address: "45 Wall Street, New York", account: "US9827391823",
            swift: "CITIUS33", notes: "Pending clearance by finance department.",
            files: [{ name: "Invoice_Apex.pdf", link: "#" }]
          },
          {
            date: "2025-02-05", type: "LC", id: "TX1002", customer: "ABC Exporter", status: "Completed",
            beneficiary: "Globe Inc", amount: "320000.00", currency: "EUR",
            country: "Germany", address: "Berliner Str. 20, Berlin", account: "DE1234567890",
            swift: "DEUTDEFF", notes: "Approved under LC conditions.",
            files: []
          }
        ];


        // Hàm định dạng tiền tệ (Sửa lỗi 2)
        function formatCurrency(amount, currency) {
            try {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency', currency: currency, minimumFractionDigits: 2
                }).format(amount);
            } catch (e) {
                return `${currency} ${parseFloat(amount).toFixed(2)}`;
            }
        }


        // Hàm render bảng
        function renderTable(rows) {
          tbody.innerHTML = "";
          if (rows.length === 0) {
            if (noValid) noValid.style.display = "block";
            return;
          }
          if (noValid) noValid.style.display = "none";
         
          rows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${row.date}</td>
              <td>${row.type}</td>
              <td>${row.id}</td>
              <td>${row.customer}</td> <td class="status ${row.status}">${row.status}</td>
              <td>${row.beneficiary}</td>
              <td>${formatCurrency(row.amount, row.currency)}</td> <td>${row.currency}</td>
              <td>
                <button class="view-btn" data-id="${row.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
              </td>
            `;
            tbody.appendChild(tr);
          });
        }


        // Render bảng ban đầu
        renderTable(data);


        // Xử lý Filter
        if (filterBtn) {
            filterBtn.addEventListener("click", () => {
              // ... (code filter y hệt file gốc) ...
              const id = document.getElementById("filterId").value.trim().toLowerCase();
              const type = document.getElementById("filterType").value;
              const status = document.getElementById("filterStatus").value;
              const from = document.getElementById("filterDateFrom").value;
              const to = document.getElementById("filterDateTo").value;
              const filtered = data.filter(row => {
                const idMatch = id === "" || row.id.toLowerCase().includes(id);
                const typeMatch = type === "all" || row.type === type;
                const statusMatch = status === "all" || row.status === status;
                const dateMatch = (!from || row.date >= from) && (!to || row.date <= to);
                return idMatch && typeMatch && statusMatch && dateMatch;
              });
              renderTable(filtered);
            });
        }


        // Xử lý Modal
        const modal = document.getElementById("detailModal");
        const closeModal = document.getElementById("closeModal");


        document.addEventListener("click", function (e) {
          const viewBtn = e.target.closest(".view-btn");
         
          if (viewBtn) {
            // Chỉ chạy logic này nếu nút bấm nằm trong bảng của trang này
            if (!tbody.contains(viewBtn)) return;
           
            const id = viewBtn.getAttribute("data-id"); // Lấy ID từ data-id
            const row = data.find(item => item.id === id);


            if (!row) { alert("No valid transaction data."); return; }


            // Điền dữ liệu (code của bạn ấy đã đúng)
            document.getElementById("beneficiaryName").value = row.beneficiary || "N/A";
            document.getElementById("country").value = row.country || "N/A";
            document.getElementById("address").value = row.address || "N/A";
            document.getElementById("accountNumber").value = row.account || "N/A";
            document.getElementById("swiftCode").value = row.swift || "N/A";
           
            document.getElementById("detailCustomer").value = row.customer || "N/A"; // (Đã có)
            document.getElementById("detailId").value = row.id;
            document.getElementById("detailType").value = row.type;
            document.getElementById("detailStatus").value = row.status;
           
            // SỬA LỖI TIỀN TỆ (Lỗi 4)
            document.getElementById("detailAmount").value = formatCurrency(row.amount, row.currency);
           
            document.getElementById("detailCurrency").value = row.currency;
            document.getElementById("detailNotes").value = row.notes || "N/A";


            // ... (code điền file list y hệt file gốc) ...
            const fileList = document.getElementById("detailFiles");
            fileList.innerHTML = "";
            if (row.files && row.files.length > 0) {
              row.files.forEach(f => {
                const item = document.createElement("div");
                item.classList.add("file-item");
                item.innerHTML = `<a href="${f.link}" target="_blank"><i class="fas fa-file-pdf"></i> ${f.name}</a>`;
                fileList.appendChild(item);
              });
            } else {
              fileList.innerHTML = "<p>No file attached</p>";
            }


            if (modal) modal.style.display = "flex";
          }


          if (e.target === modal) {
              if (modal) modal.style.display = "none";
          }
        });


        if (closeModal) {
            closeModal.onclick = () => (modal.style.display = "none");
        }
    })(); // Kết thúc khối logic


}); // end DOMContentLoaded

