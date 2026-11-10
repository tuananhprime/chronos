/* logic-documents.js - (ĐÃ NÂNG CẤP FILTER) */
document.addEventListener('DOMContentLoaded', function() {


    /* --- 1. Áp dụng Custom Select --- */
    (function applyDocumentSelects() {
        const docForm = document.getElementById('importer-filter-form');
        if (!docForm) return;
        const selects = docForm.querySelectorAll('select');
        selects.forEach(s => window.createCustomSelect(s));
    })();


    /* --- 2. Logic Filter (NÂNG CẤP) --- */
   
    // Dữ liệu mẫu (cho trang documents)
    const data = [
        { date: "23/10/2025", id: "#LC-67890", name: "Bill of Lading_BL7890.pdf", type: "bl", typeDisplay: "Bill of Lading", uploader: "ABC Exporter", status: "Verified" },
        { date: "21/10/2025", id: "#TT-89012", name: "Invoice_INV123.pdf", type: "invoice", typeDisplay: "Invoice", uploader: "You", status: "Pending Review" }
    ];


    // (Lưu ý: #importer-filter-form nằm trong tab #importer-view)
    const tbody = document.querySelector("#importer-view table tbody");
    const noValid = tbody ? tbody.closest(".content-section").querySelector(".no-valid") : null;
    const form = document.getElementById('importer-filter-form');


    // Hàm "Vẽ" Bảng
    function renderTable(rows) {
        if (!tbody) return;
        tbody.innerHTML = "";
       
        if (rows.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; opacity: 0.7;">No documents found matching criteria.</td></tr>';
            return;
        }
       
        rows.forEach(row => {
            const tr = document.createElement("tr");
            const statusClass = row.status === 'Verified' ? 'status-verified' : 'status-pending';
           
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.typeDisplay}</td>
                <td>${row.uploader}</td>
                <td><span class="status-tag ${statusClass}">${row.status}</span></td>
                <td>
                    <button class="btn-icon" title="Download"><i class="fas fa-download"></i></button>
                    <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }


    // Hàm Filter (ĐÃ SỬA)
    (function setupDocumentFilter() {
        if (!form) return;


        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn refresh
           
            const keyword = form.querySelector('input[type="text"]').value.trim().toLowerCase();
            const docType = form.querySelector('select').value;
            const dateFrom = form.querySelector('#date-from').value;
            const dateTo = form.querySelector('#date-to').value;


            const filtered = data.filter(row => {
                const rowDate = row.date.split('/').reverse().join('-');
               
                const keywordMatch = keyword === "" ||
                                     row.id.toLowerCase().includes(keyword) ||
                                     row.name.toLowerCase().includes(keyword);
                                     
                const typeMatch = docType === "" || row.type === docType;
               
                const dateMatch = (!dateFrom || rowDate >= dateFrom) &&
                                  (!dateTo || rowDate <= dateTo);
                                 
                return keywordMatch && typeMatch && dateMatch;
            });
           
            renderTable(filtered);
        });
    })();


    // Vẽ bảng lần đầu khi tải trang
    renderTable(data);


/* --- 3. (MỚI) Hồi sinh các nút "Upload Documents" trên Tab Exporter --- */
(function setupDocumentUploadButtons() {
   
    // 1. Tìm tab Exporter
    const exporterView = document.getElementById('exporter-view');
    if (!exporterView) return; // Chỉ chạy nếu ở đúng trang


    // 2. Tìm tất cả các nút "Upload Documents"
    const uploadButtons = exporterView.querySelectorAll('.lc-card-footer .btn-primary');
    if (!uploadButtons.length) return;


    // 3. Tạo một input[type=file] ẩn, dùng chung cho tất cả các nút
    let hiddenFileInput = document.getElementById('hidden-doc-uploader');
    if (!hiddenFileInput) {
        hiddenFileInput = document.createElement('input');
        hiddenFileInput.type = 'file';
        hiddenFileInput.multiple = true; // Cho phép chọn nhiều file
        hiddenFileInput.style.display = 'none';
        hiddenFileInput.id = 'hidden-doc-uploader';
        document.body.appendChild(hiddenFileInput);


        // 4. Thêm listener cho input ẩn này
        hiddenFileInput.addEventListener('change', function() {
            if (hiddenFileInput.files.length > 0) {
                // Lấy tên L/C ID mà chúng ta đã "nhớ"
                const lcId = hiddenFileInput.dataset.lcId || '';
               
                // Báo toast (dùng hàm core)
                window.showNotification({
                    title: 'Files Selected',
                    message: `Bạn đã chọn ${hiddenFileInput.files.length} file cho ${lcId}. Đang mô phỏng upload...`
                }, 'success');
               
                // (Trong thực tế, đây là lúc gọi API upload)
                console.log(`Uploading ${hiddenFileInput.files.length} files for ${lcId}`, hiddenFileInput.files);
               
                // Reset input để có thể chọn lại file
                hiddenFileInput.value = null;
                hiddenFileInput.dataset.lcId = '';
            }
        });
    }
   
    // 5. Gắn sự kiện click cho TẤT CẢ các nút "Upload"
    uploadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Tìm L/C ID từ thẻ card cha
            const card = btn.closest('.lc-card');
            const lcIdElement = card ? card.querySelector('.lc-card-header strong') : null;
            const lcId = lcIdElement ? lcIdElement.textContent : 'Unknown L/C';
           
            // "Nhớ" ID L/C này để hàm "change" ở trên biết
            hiddenFileInput.dataset.lcId = lcId;


            // Mở cửa sổ chọn file
            hiddenFileInput.click();
        });
    });


})();


}); // end DOMContentLoaded

