/* logic-transactions.js - CHỈ DÀNH CHO TRANG TRANSACTIONS */
document.addEventListener('DOMContentLoaded', function() {

    /* --- Áp dụng Custom Select cho trang Transactions --- */
    (function applyTransactionSelects() {
        const transForm = document.getElementById('transaction-filter-form');
        if (!transForm) return;
       
        const selects = transForm.querySelectorAll('select');
        selects.forEach(s => window.createCustomSelect(s));
    })();


    /* --- Logic Trang Transactions (Filter, Bảng, Modal) --- */
    (async function setupTransactionPage() {
        const tbody = document.getElementById("transactionBody");
        if (!tbody) return;

        const noValid = document.getElementById("noValid");
        const filterBtn = document.getElementById("applyFilter");

        let data = [];

        // --- Fetch dữ liệu từ backend (✅ CÓ JWT) ---
        async function fetchTransactions() {
            try {
                const token = localStorage.getItem("authToken");

                if (ChronosAccess.isGuest()) {
                    data = ChronosAccess.transactions;
                    renderTable(data);
                    return;
                }

                const res = await fetch('/api/transactions/list', {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem('authToken');
                    sessionStorage.removeItem('profileId');
                    data = ChronosAccess.transactions;
                    renderTable(data);
                    return;
                }

                if (!res.ok) {
                    throw new Error("Could not fetch transactions");
                }

                data = await res.json();
                renderTable(data);

            } catch (e) {
                console.error(e);
                if (noValid) {
                    noValid.style.display = "block";
                    noValid.textContent = "You are not logged in or cannot load transactions.";
                }
            }
        }

        // Hàm định dạng tiền tệ
        function formatCurrency(amount, currency) {
            try {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits: 2
                }).format(amount);
            } catch (e) {
                return `${currency} ${parseFloat(amount).toFixed(2)}`;
            }
        }

        // Hàm render bảng
        function renderTable(rows) {
            tbody.innerHTML = "";

            if (!rows || rows.length === 0) {
                if (noValid) noValid.style.display = "block";
                return;
            }

            if (noValid) noValid.style.display = "none";

            rows.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${new Date(row.createdAt).toLocaleDateString()}</td>
                    <td>${row.type || "N/A"}</td>
                    <td>${row.transactionId}</td>
                    <td class="status ${row.status}">${row.status}</td>
                    <td>${formatCurrency(row.amount, row.currency)}</td>
                    <td>${row.currency}</td>
                    <td><button type="button" class="btn btn-secondary view-btn" data-id="${row.transactionId}">Chi tiết</button></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Render bảng ban đầu
        await fetchTransactions();

        // Xử lý Filter
        if (filterBtn) {
            filterBtn.addEventListener("click", () => {
                const id = document.getElementById("filterId").value.trim().toLowerCase();
                const type = document.getElementById("filterType").value;
                const status = document.getElementById("filterStatus").value;
                const from = document.getElementById("filterDateFrom").value;
                const to = document.getElementById("filterDateTo").value;

                const filtered = data.filter(row => {
                    const idMatch =
                        id === "" || row.transactionId.toString().toLowerCase().includes(id);

                    const typeMatch =
                        type === "all" || row.type === type;

                    const statusMatch =
                        status === "all" || row.status === status;

                    const dateMatch =
                        (!from || new Date(row.createdAt) >= new Date(from)) &&
                        (!to || new Date(row.createdAt) <= new Date(to));

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
                const id = viewBtn.getAttribute("data-id");
                const row = data.find(item => item.transactionId.toString() === id);

                if (!row) {
                    alert("Error: Could not find transaction data.");
                    return;
                }

                document.getElementById("detailId").value = row.transactionId;
                document.getElementById("detailType").value = row.type || "N/A";
                document.getElementById("detailStatus").value = row.status;
                document.getElementById("detailAmount").value =
                    formatCurrency(row.amount, row.currency);
                document.getElementById("detailCurrency").value = row.currency;
                document.getElementById("detailNotes").value = row.notes || "N/A";

                const fileList = document.getElementById("detailFiles");
                fileList.innerHTML = "<p>No file attached</p>";

                if (modal) modal.style.display = "flex";
            }

            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

        if (closeModal) {
            closeModal.onclick = () => (modal.style.display = "none");
        }

    })();

});
