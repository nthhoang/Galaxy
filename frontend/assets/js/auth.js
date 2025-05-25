// public/js/auth.js

function updateAuthSection() {
    const token = localStorage.getItem("token");
    const authDiv = document.getElementById("auth-section");
    if (!authDiv) {
        console.warn("Element with id 'auth-section' not found.");
        return;
    }

    // Avatar mặc định
    const defaultAvatar = "http://localhost:3000/images/default-avatar.jpg"; // Đảm bảo đường dẫn này đúng trên server của bạn

    if (token) {
        fetch("http://localhost:3000/api/auth/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                // Nếu token lỗi hoặc hết hạn, coi như chưa đăng nhập
                throw new Error("Token không hợp lệ hoặc đã hết hạn.");
            }
            return res.json();
        })
        .then(user => {
            // Sử dụng avatar của người dùng nếu có và hợp lệ, ngược lại dùng avatar mặc định
            const avatarUrl = user.avatar && user.avatar.trim() !== "" ? user.avatar : defaultAvatar;

            authDiv.innerHTML = `
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button"
                   data-bs-toggle="dropdown" aria-expanded="false">
                   <img src="http://localhost:3000/${avatarUrl}" alt="Avatar" style="width:30px; height:30px; border-radius:50%; object-fit: cover;">
                   <span class="ms-2 d-none d-lg-block">${user.username}</span></a>
                <ul class="dropdown-menu dropdown-menu-end px-3" aria-labelledby="userDropdown">
                  <li><h6 class="dropdown-header">${user.username}</h6></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="profile.html">👤 Thông tin cá nhân</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" id="logout-link">🚪 Đăng xuất</a></li>
                </ul>
        
            `;

            // Khởi tạo dropdown sau khi nội dung được thêm vào DOM
            const dropdownElement = authDiv.querySelector('#userDropdown');
            if (dropdownElement) {
                new bootstrap.Dropdown(dropdownElement);
            } else {
                console.error("User dropdown element not found after rendering.");
            }

            // Gắn sự kiện logout sau khi đã render
            const logoutLink = document.getElementById("logout-link");
            if (logoutLink) {
                logoutLink.addEventListener("click", logout);
            }
        })
        .catch(error => {
            console.error("Lỗi khi lấy thông tin người dùng:", error.message);
            // Nếu token lỗi thì coi như chưa đăng nhập
            localStorage.removeItem("token");
            showLoginLinks(authDiv);
        });
    } else {
        showLoginLinks(authDiv);
    }
}

function showLoginLinks(container) {
    // Chèn trực tiếp các liên kết Đăng nhập/Đăng ký vào thẻ <li> có id="auth-section"
    container.innerHTML = `
        <a href="login.html" class="nav-link">Đăng nhập</a>
        <span class="text-white-50 mx-1">|</span>
        <a href="register.html" class="nav-link">Đăng kí</a>
    `;
}

function logout(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    localStorage.removeItem("token");
    // Chuyển hướng người dùng về trang chủ
    window.location.href = "index.html";
}

// Gọi khi trang load
document.addEventListener("DOMContentLoaded", updateAuthSection);