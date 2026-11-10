/* logic-processing.js - (ĐÃ NÂNG CẤP FILTER V2 - DÙNG ID) */
document.addEventListener('DOMContentLoaded', function () {


    /* --- 1. Áp dụng Custom Select --- */
    (function applyProcessingSelects() {
        const processingForm = document.getElementById('processing-filter-form');
        if (!processingForm) return;
        const selects = processingForm.querySelectorAll('select');
        selects.forEach(s => window.createCustomSelect(s));
    })();


    /* --- 2. Logic Filter (NÂNG CẤP V2) --- */
    const data = [
        { date: "25/10/2025 09:15 AM", id: "#TT-89012", customer: "Doe Enterprises (Importer A)", type: "T/T", amount: 104000.00, currency: "USD", status: "Pending Processing" },
        { date: "24/10/2025 04:30 PM", id: "#LC-67890", customer: "ABC Exporter (Exporter B)", type: "L/C", amount: 150000.00, currency: "USD", status: "Pending Processing" },
        { date: "24/10/2025 11:10 AM", id: "#TT-89011", customer: "Retail Goods Ltd (Importer C)", type: "T/T", amount: 5250.00, currency: "EUR", status: "Pending Processing" }
    ];


    // SỬA LỖI: Tìm tbody bằng ID
    const tbody = document.getElementById("processing-table-body");
    const form = document.getElementById('processing-filter-form');


    function formatCurrency(amount, currency) {
        try {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(amount);
        } catch (e) { return `${currency} ${parseFloat(amount).toFixed(2)}`; }
    }


    function renderTable(rows) {
        if (!tbody) return;
        tbody.innerHTML = "";
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; opacity: 0.7;">No transactions found matching criteria.</td></tr>';
            return;
        }
        rows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${row.id}</strong></td>
                <td>${row.customer}</td>
                <td>${row.type}</td>
                <td>${formatCurrency(row.amount, row.currency)}</td>
                <td>${row.date}</td>
                <td><span class="status-tag status-pending">${row.status}</span></td>
                <td>
                    <a href="processingdetail.html?id=${row.id}" class="btn btn-primary" style="padding: 5px 12px; font-size: 14px;">
                        <i class="fas fa-cogs"></i> Process
                    </a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    (function setupProcessingFilter() {
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Ngăn refresh
           
            const keyword = form.querySelector('input[type="text"]').value.trim().toLowerCase();
            const status = form.querySelector('select').value;
            const dateFrom = form.querySelector('#date-from').value;
            const dateTo = form.querySelector('#date-to').value;


            const filtered = data.filter(row => {
                const rowDate = row.date.split(' ')[0].split('/').reverse().join('-');
                const keywordMatch = keyword === "" || row.id.toLowerCase().includes(keyword) || row.customer.toLowerCase().includes(keyword);
                const statusMatch = status === "" || (status === "pending" && row.status === "Pending Processing");
                const dateMatch = (!dateFrom || rowDate >= dateFrom) && (!dateTo || rowDate <= dateTo);
                return keywordMatch && statusMatch && dateMatch;
            });


            renderTable(filtered); // "Lọc luôn"
        });
    })();
   
    if (tbody) renderTable(data); // Vẽ bảng lần đầu


    /* --- 3. Logic trang chi tiết (processing-detail) --- */
    (function setupProcessingDetailActions() {
        // ... (Code của 2 nút bấm 'Complete' / 'Fail' y hệt file cũ) ...
    })();


}); // end DOMContentLoaded

