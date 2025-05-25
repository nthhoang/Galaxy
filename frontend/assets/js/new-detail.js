document.addEventListener('DOMContentLoaded', function() {
    const articleContainer = document.getElementById('article-container');
    const relatedArticlesSection = document.getElementById('related-articles-section');
    const relatedArticlesRow = document.getElementById('related-articles-row');

    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));

    if (!articleId) {
        articleContainer.innerHTML = '<p class="text-center text-danger">ID bài viết không hợp lệ hoặc không được cung cấp.</p>';
        return;
    }

    fetch('news.json') // Đường dẫn tới news.json từ thư mục js (đi ra một cấp)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const article = data.find(art => art.id === articleId);

            if (article) {
                document.title = `${article.title} - Khám Phá Vũ Trụ`; // Cập nhật tiêu đề trang web

                let tagsHtml = '';
                if (article.tags && article.tags.length > 0) {
                    tagsHtml = article.tags.map(tag => `<a href="#" class="tag">${tag}</a>`).join('');
                }

                const articleHtml = `
                    <article>
                        <header class="article-header">
                            <h1>${article.title}</h1>
                            <div class="article-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${article.date}</span>
                                <span><i class="fas fa-user"></i> ${article.author}</span>
                                <span><i class="fas fa-folder-open"></i> ${article.category}</span>
                            </div>
                        </header>

                        <div class="article-image-container">
                            <img src="${article.image}" alt="${article.title}" class="img-fluid">
                        </div>

                        <div class="row">
                            <div class="col-lg-10 mx-auto">
                                <div class="article-content">
                                    ${article.content}
                                </div>
                                ${tagsHtml ? `
                                <div class="article-tags">
                                    <strong><i class="fas fa-tags"></i> Tags:</strong>
                                    ${tagsHtml}
                                </div>` : ''}
                            </div>
                        </div>
                    </article>
                `;
                articleContainer.innerHTML = articleHtml;

                // Hiển thị bài viết liên quan (ví dụ: 3 bài khác)
                const related = data.filter(relArt => relArt.id !== articleId).slice(0, 3);
                if (related.length > 0) {
                    relatedArticlesRow.innerHTML = ''; // Xóa placeholder nếu có
                    related.forEach(rel => {
                        const relatedCardHtml = `
                            <div class="col-md-4">
                                <div class="related-card">
                                    <img src="${rel.image}" class="card-img-top" alt="${rel.title}">
                                    <div class="card-body">
                                        <h5 class="card-title"><a href="new-detail.html?id=${rel.id}">${rel.title}</a></h5>
                                    </div>
                                </div>
                            </div>
                        `;
                        relatedArticlesRow.innerHTML += relatedCardHtml;
                    });
                    relatedArticlesSection.style.display = 'block';
                }


            } else {
                articleContainer.innerHTML = '<p class="text-center text-warning display-4 mt-5">Bài viết không tồn tại!</p>';
            }
        })
        .catch(error => {
            console.error('Lỗi khi tải chi tiết bài viết:', error);
            articleContainer.innerHTML = '<p class="text-center text-danger">Không thể tải nội dung bài viết. Vui lòng thử lại sau.</p>';
        });

    // Active navbar link (Tin Tức) cho trang chi tiết
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentURL = window.location.href;

    navLinks.forEach(link => {
        // Xóa active cũ
        link.closest('.nav-item').classList.remove('active');
        // Nếu là link "Tin Tức" và đang ở trang chi tiết, thì active nó
        if (link.getAttribute('href') === 'news.html' && currentURL.includes('new-detail.html')) {
            link.closest('.nav-item').classList.add('active');
        }
    });
});