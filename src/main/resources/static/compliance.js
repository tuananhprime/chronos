// compliance.js

function formatDate(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return d.toLocaleString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    }).replace(',', '');
}

async function fetchComplianceTasks() {
    try {
        let data;
        if (ChronosAccess.isGuest()) {
            data = ChronosAccess.transactions.map(row => ({...row, customer: 'Doanh nghiệp minh họa', submittedDate: row.createdAt}));
        } else {
            const res = await fetch('/api/bank/compliance');
            if (!res.ok) throw new Error('HTTP Error ' + res.status);
            data = await res.json();
        }

        const tbody = document.getElementById("compliance-tbody");
        tbody.innerHTML = "";

        data.forEach(item => {
            const tr = document.createElement("tr");
            tr.dataset.transactionId = item.transactionId;

            const statusUpper = item.status.toUpperCase();
            const isProcessed = ["APPROVED", "REJECTED", "REQUEST_INFO"].includes(statusUpper);


            tr.innerHTML = `
                <td><strong>#${item.transactionId}</strong></td>
                <td>${item.customer || "N/A"}</td>
                <td>${item.type}</td>
                <td>${item.amount}</td>
                <td>${formatDate(item.submittedDate)}</td>
                <td><span class="status-tag status-${item.status.toLowerCase()}">${item.status}</span></td>
                <td>
                    <button class="btn btn-primary review-btn" 
                            style="padding: 5px 12px; font-size: 14px;"
                            ${isProcessed ? "disabled title='Giao dịch đã được xử lý'" : ""}>
                        <i class="fas fa-eye"></i> Review
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Lỗi khi tải compliance:", err);
        alert('Không tải được danh sách Compliance.');
    }
}

function viewComplianceDetail(transaction) {
    localStorage.setItem("selectedTransaction", JSON.stringify(transaction));
    window.location.href = "compliancereview.html";
}

document.addEventListener("DOMContentLoaded", () => {
    fetchComplianceTasks();

    const tbody = document.getElementById("compliance-tbody");

    tbody.addEventListener("click", (event) => {
        const button = event.target.closest(".review-btn");
        if (!button || button.disabled) return;

        const row = button.closest("tr");
        const transaction = {
            id: row.querySelector("td:nth-child(1)").innerText.trim(),
            customer: row.querySelector("td:nth-child(2)").innerText.trim(),
            type: row.querySelector("td:nth-child(3)").innerText.trim(),
            amount: row.querySelector("td:nth-child(4)").innerText.trim(),
            date: row.querySelector("td:nth-child(5)").innerText.trim(),
            status: row.querySelector("td:nth-child(6)").innerText.trim(),
            rawTransactionId: row.dataset.transactionId
        };

        viewComplianceDetail(transaction);
    });

    document.getElementById("filter-btn").addEventListener("click", () => {
        const searchText = document.getElementById("search-input").value.toLowerCase();
        const statusFilter = document.getElementById("status-filter").value;

        Array.from(tbody.querySelectorAll("tr")).forEach(tr => {
            const textMatch = tr.innerText.toLowerCase().includes(searchText);
            const status = tr.querySelector("td:nth-child(6)").innerText.toLowerCase();
            const statusMatch = !statusFilter || status.includes(statusFilter);
            tr.style.display = textMatch && statusMatch ? "" : "none";
        });
    });
});
