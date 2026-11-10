document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = '/api/compliance';
    const API_SUBMIT_CASE = API_BASE_URL + '/submit-case';

    // ⚠️ nếu app không chạy ở root, đổi thành '/chronos/api/screening/transaction'
    const API_SCREENING = '/api/screening/transaction';

    function q(selector, root = document) { return root.querySelector(selector); }
    function qAll(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

    let currentTransaction = null;

    function parseStored(key) {
        try {
            const v = localStorage.getItem(key) || sessionStorage.getItem(key);
            if (!v) return null;
            return JSON.parse(v);
        } catch (e) {
            console.warn('parseStored error', e);
            return null;
        }
    }

    /* =========================
       SCREENING PART
       ========================= */

    async function loadScreening(txId) {
        if (!txId) return;

        try {
            const res = await fetch(`${API_SCREENING}/${txId}`);
            if (!res.ok) throw new Error('Screening API failed');
            const data = await res.json();
            renderScreeningResult(data);
        } catch (e) {
            console.error(e);
            showNotification('Không thể thực hiện screening tự động.', 'error');
        }
    }

    function renderScreeningResult(data) {
        const box = q('.screening-result');
        if (!box) return;

        const titleSpan = box.querySelector('.result-title span');
        const body = box.querySelector('.result-body');
        const icon = box.querySelector('.result-title i');

        box.classList.remove('low-risk', 'high-risk');

        const isHigh = data.riskLevel === 'HIGH';

        box.classList.add(isHigh ? 'high-risk' : 'low-risk');

        if (icon) {
            icon.className = isHigh
                ? 'fas fa-exclamation-triangle'
                : 'fas fa-check-circle';
        }

        if (titleSpan) {
            titleSpan.textContent = isHigh
                ? 'High Risk (Review Required)'
                : 'Low Risk (Passed)';
        }

        if (body) {
            body.textContent = data.matchedKeywords && data.matchedKeywords.length
                ? 'Matched keywords: ' + data.matchedKeywords.join(', ')
                : 'No matches found.';
        }

        // HIGH risk → khóa Approve
        if (isHigh) {
            const btnApprove = q('#btn-compliance-approve');
            if (btnApprove) btnApprove.disabled = true;
        }
    }

    /* =========================
       COMPLIANCE ACTION
       ========================= */

    async function submitComplianceAction(action, txId, description, severity) {
        if (!txId) {
            showNotification('Không tìm thấy ID giao dịch để xử lý.', 'error');
            return;
        }

        const payload = {
            relatedTransactionID: String(txId).replace(/[^0-9]/g, ''),
            description,
            status: action.toUpperCase(),
            severityLevel: severity || 'MEDIUM'
        };

        const btnApprove = q('#btn-compliance-approve');
        const btnReject = q('#btn-compliance-reject');
        const btnRequest = q('#btn-compliance-request');
        const notesInput = q('#compliance-notes');

        try {
            showNotification(`Đang gửi yêu cầu ${action}...`, 'info');

            const response = await fetch(API_SUBMIT_CASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định.' }));
                throw new Error(errorData.message || response.statusText);
            }

            await response.json();

            showNotification(`Giao dịch đã được ${action.toUpperCase()} thành công.`, 'success');

            if (btnApprove) btnApprove.disabled = true;
            if (btnReject) btnReject.disabled = true;
            if (btnRequest) btnRequest.disabled = true;
            if (notesInput) notesInput.disabled = true;

            const statusEl = q('.status-tag');
            if (statusEl) statusEl.textContent = action.toUpperCase();

            setTimeout(() => {
                window.location.href = 'compliance.html';
            }, 1500);

        } catch (error) {
            showNotification(`Lỗi khi xử lý: ${error.message}`, 'error');
        }
    }

    function setupActionListeners() {
        const btnApprove = q('#btn-compliance-approve');
        const btnReject = q('#btn-compliance-reject');
        const btnRequest = q('#btn-compliance-request');
        const notesInput = q('#compliance-notes');

        if (!btnApprove || !btnReject || !btnRequest || !currentTransaction) return;

        const txIdClean = String(currentTransaction.id).replace(/[^0-9]/g, '');

        btnApprove.addEventListener('click', () => {
            const notes = notesInput?.value.trim() || 'Approved by compliance officer.';
            submitComplianceAction('APPROVED', txIdClean, notes, 'LOW');
        });

        btnReject.addEventListener('click', () => {
            const notes = notesInput?.value.trim();
            if (!notes) {
                showNotification('Vui lòng nhập lý do từ chối.', 'warning');
                notesInput.focus();
                return;
            }
            submitComplianceAction('REJECTED', txIdClean, notes, 'HIGH');
        });

        btnRequest.addEventListener('click', () => {
            const notes = notesInput?.value.trim();
            if (!notes) {
                showNotification('Vui lòng nhập nội dung yêu cầu thêm.', 'warning');
                notesInput.focus();
                return;
            }
            submitComplianceAction('REQUEST_INFO', txIdClean, notes, 'MEDIUM');
        });
    }

    function populateFromTransaction(tx) {
        if (!tx) return;

        currentTransaction = tx;

        const hdr = q('.main-header h1') || q('h1');
        if (hdr) hdr.textContent = `Compliance Review: ${tx.id}`;

        const map = {
            'Transaction ID': tx.id,
            'Customer (Applicant)': tx.customer || tx.applicant || '',
            'Transaction Type': tx.type || tx.transactionType || '',
            'Amount': tx.amountDisplay || tx.amount || '',
            'Date Submitted': tx.date || tx.submittedDate || '',
            'Current Status': tx.status || ''
        };

        qAll('.review-row').forEach(row => {
            const label = row.querySelector('.review-label')?.textContent.trim();
            const valueEl = row.querySelector('.review-value');
            if (map[label]) {
                valueEl.innerHTML = label === 'Current Status'
                    ? `<span class="status-tag">${map[label]}</span>`
                    : map[label];
            }
        });

        sessionStorage.setItem('selectedTransaction', JSON.stringify(tx));

        const cleanTxId = String(tx.id).replace(/[^0-9]/g, '');
        setupActionListeners();
        loadScreening(cleanTxId); // ✅ ID sạch, API chạy
    }

    (function bootstrap() {
        const tx = parseStored('selectedTransaction');
        if (tx) populateFromTransaction(tx);
    })();

    if (typeof window.showNotification !== 'function') {
        window.showNotification = (msg, type = 'info') => {
            alert(`[${type.toUpperCase()}] ${msg}`);
        };
    }
});
