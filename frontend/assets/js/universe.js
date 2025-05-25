document.addEventListener('DOMContentLoaded', function() {
               // cho trang vũ trụ 

        // JavaScript cho Image Modal trong thư viện
        const imageModal = document.getElementById('imageModal');
        if (imageModal) {
            imageModal.addEventListener('show.bs.modal', event => {
                const button = event.relatedTarget; // Nút đã kích hoạt modal
                const imageSrc = button.getAttribute('data-image-src'); // Lấy link ảnh lớn
                const imageTitle = button.getAttribute('data-image-title') || button.getAttribute('alt') || 'Hình ảnh vũ trụ'; // Lấy tiêu đề/alt

                const modalImage = imageModal.querySelector('#modalImageDisplay');
                const modalTitle = imageModal.querySelector('#imageModalLabel');

                modalImage.src = imageSrc;
                modalImage.alt = imageTitle + " - Phóng to";
                modalTitle.textContent = imageTitle;
            });
        }

        // Optional: Thêm hiệu ứng scroll-spy hoặc active class cho navbar dựa trên vị trí cuộn
        // (Cần code phức tạp hơn nếu muốn chính xác theo section)

        // Kích hoạt Tooltips của Bootstrap nếu bạn sử dụng (ví dụ: cho các icon mạng xã hội)
        // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        //   return new bootstrap.Tooltip(tooltipTriggerEl)
        // })
        });