document.addEventListener('DOMContentLoaded', function() {

    async function loadProfileData() {
        const pf = document.getElementById('profile-form');
        if (!pf) return;

        if (ChronosAccess.isGuest()) return;

        // Lấy profileId từ login
        const profileId = sessionStorage.getItem('profileId');
        if (!profileId) {
            console.error("Không có profileId trong sessionStorage");
            return;
        }

        try {
            const res = await fetch(`/api/profile/${profileId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error('Không thể load dữ liệu profile');

            const data = await res.json();

            document.querySelector('input[disabled][type="text"]').value = data.fullName || '';
            document.querySelector('input[disabled][type="email"]').value = data.email || '';

            document.getElementById('business-name').value = data.businessName || '';
            document.getElementById('tax-id').value = data.taxId || '';

            document.getElementById('registration-country').value = data.registrationCountry || '';
            document.getElementById('industry-type').value = data.industryType || '';

            document.getElementById('address').value = data.address || '';
            document.getElementById('contact-person').value = data.contactPerson || '';
            document.getElementById('phone-number').value = data.phoneNumber || '';

        } catch (err) {
            console.error(err);
            window.showNotification?.({
                title: 'Lỗi tải dữ liệu',
                message: 'Không thể kết nối tới máy chủ.'
            }, 'error', 3000);
        }
    }

    function initProfileSave() {
        const pf = document.getElementById('profile-form');
        if (!pf) return;

        pf.addEventListener('submit', async (e) => {
            e.preventDefault();

            const profileId = sessionStorage.getItem('profileId');
            if (!profileId) {
                console.error("Không có profileId để update");
                return;
            }

            const payload = {
                businessName: document.getElementById('business-name').value.trim(),
                taxId: document.getElementById('tax-id').value.trim(),
                registrationCountry: document.getElementById('registration-country').value,
                industryType: document.getElementById('industry-type').value,
                address: document.getElementById('address').value.trim(),
                contactPerson: document.getElementById('contact-person').value.trim(),
                phoneNumber: document.getElementById('phone-number').value.trim()
            };

            try {
                const res = await fetch(`/api/profile/update/${profileId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) throw new Error('Lỗi cập nhật thông tin');

                window.showNotification?.({
                    title: 'Lưu thông tin thành công!',
                    message: 'Dữ liệu đã được cập nhật!'
                }, 'success', 3200);

            } catch (err) {
                console.error(err);
                window.showNotification?.({
                    title: 'Lỗi lưu dữ liệu',
                    message: 'Máy chủ từ chối yêu cầu.'
                }, 'error', 3000);
            }
        });
    }

    loadProfileData();
    initProfileSave();
});
