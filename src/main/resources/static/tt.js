document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       TT.HTML – CREATE → REVIEW
       ========================= */
    const form = document.getElementById('tt-order-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = {
                beneficiaryName: document.getElementById('beneficiary-name').value,
                country: document.getElementById('country').value,
                address: document.getElementById('address').value,
                accountNumber: document.getElementById('account-number').value,
                swiftCode: document.getElementById('swift-code').value,
                currency: document.getElementById('currency').value,
                amount: Number(document.getElementById('amount').value),
                purpose: document.getElementById('purpose').value,
                description: document.getElementById('description').value
            };

            sessionStorage.setItem('ttReviewData', JSON.stringify(data));
            window.location.href = 'review_tt.html';
        });
    }

    /* =========================
       REVIEW.HTML – LOAD DATA
       ========================= */
    const reviewPanel = document.getElementById('tt-review-panel');

    if (reviewPanel) {
        const raw = sessionStorage.getItem('ttReviewData');
        if (!raw) return;

        const data = JSON.parse(raw);

        document.getElementById('review-beneficiary-name').textContent = data.beneficiaryName;
        document.getElementById('review-country').textContent = data.country;
        document.getElementById('review-address').textContent = data.address;
        document.getElementById('review-account-number').textContent = data.accountNumber;
        document.getElementById('review-swift-code').textContent = data.swiftCode;
        document.getElementById('review-amount').textContent = data.amount;
        document.getElementById('review-currency').textContent = data.currency;
        document.getElementById('review-purpose').textContent = data.purpose;
        document.getElementById('review-description').textContent = data.description;
    }

    /* =========================
       REVIEW.HTML – SUBMIT
       ========================= */
    const submitBtn = document.getElementById('submit-order-btn');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {

            const data = JSON.parse(sessionStorage.getItem('ttReviewData'));
            if (!data) return;

            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Bạn chưa đăng nhập');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const payload = {
                amount: data.amount,
                currency: data.currency,
                purpose: data.purpose,
                description: data.description,
                address: data.address
            };

            try {
                const res = await fetch('/api/transactions/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error('Create failed');

                sessionStorage.removeItem('ttReviewData');
                window.location.href = 'transaction.html';

            } catch (err) {
                console.error(err);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Order';
            }
        });
    }
});
