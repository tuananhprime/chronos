/* logic-lc.js - CHỈ DÀNH CHO TRANG TẠO VÀ REVIEW L/C */
document.addEventListener('DOMContentLoaded', function() {

    /* --- Áp dụng Custom Select cho trang L/C --- */
    (function applyLCSelects() {
        const lcForm = document.getElementById('lc-application-form');
        if (!lcForm) return; 
        lcForm.querySelectorAll('select').forEach(s => window.createCustomSelect(s));
    })();

    /* --- Logic Ẩn/Hiện Usance Terms --- */
    (function setupLCTermsToggle() {
        const termGroup = document.getElementById('usance-terms-group');
        const hiddenInput = document.getElementById('payment_term');
        const termToggle = document.querySelector('#lc-application-form .fee-toggle');
        if (!termToggle || !termGroup || !hiddenInput) return;

        termToggle.addEventListener('click', function(e) {
            const clickedBtn = e.target.closest('.fee-btn');
            if (!clickedBtn) return;
            const term = clickedBtn.getAttribute('data-term');
            hiddenInput.value = term;
            termGroup.style.display = (term === 'Usance') ? 'block' : 'none';
        });
    })();

    /* --- Logic Validate Form L/C --- */
    (function setupLCCreateForm() {
        const lcForm = document.getElementById('lc-application-form');
        if (!lcForm) return;

        lcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.clearInlineErrors();
            let isValid = true;
            const getVal = id => {
                const el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };
            const showError = (id, msg) => {
                window.showInlineError(id, msg);
                isValid = false;
            };

            // --- Validate các trường quan trọng ---
            if (!getVal('beneficiary_name')) showError('error-beneficiary_name', 'Beneficiary Name is required.');
            if (!getVal('advising_bank')) showError('error-advising_bank', 'Advising Bank is required.');
            if (!getVal('address')) showError('error-address', 'Beneficiary Address is required.');
            if (!getVal('swift_bic_code')) showError('error-swift_bic_code', 'SWIFT/BIC Code is required.');
            if (!getVal('country')) showError('error-country', 'Please select a Beneficiary Country.');
            const paymentTerm = getVal('payment_term');
            if (paymentTerm === 'Usance' && !getVal('usance_terms')) showError('error-usance_terms', 'Usance Terms are required when Payment Term is Usance.');
            if (!getVal('expiry_date')) showError('error-expiry_date', 'Expiry Date is required.');
            if (!getVal('place_of_expiry')) showError('error-place_of_expiry', 'Place of Expiry is required.');
            const amount = parseFloat(getVal('amount'));
            if (isNaN(amount) || amount <= 0) showError('error-amount', 'Amount must be greater than 0.');
            if (!getVal('goods_description')) showError('error-goods_description', 'Description of Goods is required.');
            if (!getVal('port_loading')) showError('error-port_loading', 'Port of Loading is required.');
            if (!getVal('port_discharge')) showError('error-port_discharge', 'Port of Discharge is required.');
            if (!getVal('latest_shipment')) showError('error-latest_shipment', 'Latest Shipment Date is required.');

            if (!isValid) {
                window.showNotification({
                    title: 'Lỗi Dữ liệu',
                    message: 'Vui lòng kiểm tra lại các trường đã báo đỏ.'
                }, 'error', 4000);
                const firstError = lcForm.querySelector('.error-message:not(:empty)');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // --- Gom dữ liệu gửi sang review ---
            const lcData = {
                applicant: getVal('applicant-name'),
                lcType: getVal('lc_type_selection'),
                beneficiaryName: getVal('beneficiary_name'),
                advisingBank: getVal('advising_bank'),
                address: getVal('address'),
                swiftCode: getVal('swift_bic_code'),
                country: getVal('country'),
                paymentTerm: paymentTerm,
                usanceTerms: getVal('usance_terms'),
                expiryDate: getVal('expiry_date'),
                placeOfExpiry: getVal('place_of_expiry'),
                amount: amount,
                currency: getVal('currency'),
                goodsDescription: getVal('goods_description'),
                portLoading: getVal('port_loading'),
                portDischarge: getVal('port_discharge'),
                latestShipment: getVal('latest_shipment'),
                otherRequirements: getVal('other_reqs')
            };

            // --- Lưu vào sessionStorage và redirect sang review ---
            sessionStorage.setItem('lcReviewData', JSON.stringify(lcData));
            window.location.href = 'review_lc.html'; // redirect đầu tiên
        });
    })();

    /* --- Logic Review L/C --- */
    (function setupLCReview() {
        const reviewPanel = document.getElementById('lc-review-panel');
        if (!reviewPanel) return;

        const raw = sessionStorage.getItem('lcReviewData');
        if (!raw) {
            window.showNotification({ title: 'Không có dữ liệu', message: 'Không tìm thấy dữ liệu L/C. Chuyển về Dashboard.' }, 'error', 3000);
            setTimeout(() => window.location.href = 'dashboard.html', 1000);
            return;
        }

        let data = {};
        try { data = JSON.parse(raw); } catch(e) {}

        const setText = (id, txt) => {
            const el = document.getElementById(id);
            if (el) el.textContent = (txt === undefined || txt === null || txt === '') ? 'N/A' : txt;
        };

        // --- Set dữ liệu review vào các element ---
        setText('review-applicant', data.applicant);
        setText('review-beneficiary-name', data.beneficiaryName);
        setText('review-address', data.address);
        setText('review-country', data.country);
        setText('review-advising-bank', data.advisingBank);
        setText('review-swift-code', data.swiftCode);
        setText('review-lc-type', data.lcType);
        setText('review-payment-term', data.paymentTerm);
        setText('review-usance-terms', data.paymentTerm === 'Usance' ? data.usanceTerms : 'N/A');
        setText('review-amount', `${data.amount || '0.00'}`);
        setText('review-currency', data.currency || 'USD');
        setText('review-expiry-date', data.expiryDate);
        setText('review-place-expiry', data.placeOfExpiry);
        setText('review-goods-desc', data.goodsDescription);
        setText('review-port-loading', data.portLoading);
        setText('review-port-discharge', data.portDischarge);
        setText('review-latest-shipment', data.latestShipment);

        // --- Nút Submit thực tế: gọi API và redirect dashboard ---
        const submitLCBtn = document.getElementById('submit-lc-btn');
        if (submitLCBtn) {
            submitLCBtn.addEventListener('click', async () => {
                const token = TokenStorage.get();
                try {
                    const response = await fetch('/api/lc/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    console.log('LC API result:', result);

                    if (!response.ok) {
                        window.showNotification({
                            title: 'Tạo L/C thất bại',
                            message: result.message || 'Không thể tạo L/C. Vui lòng thử lại.'
                        }, 'error', 4000);
                        return;
                    }

                    window.showNotification({
                        title: 'Thành công',
                        message: 'L/C đã được tạo thành công!'
                    }, 'success', 3000);

                    sessionStorage.removeItem('lcReviewData');
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);

                } catch (err) {
                    console.error('Lỗi kết nối:', err);
                    window.showNotification({
                        title: 'Kết nối thất bại',
                        message: 'Không thể kết nối tới máy chủ.'
                    }, 'error', 4000);
                }
            });
        }

        const backBtn = document.getElementById('back-to-edit-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'lc.html';
            });
        }
    })();

}); // end DOMContentLoaded
