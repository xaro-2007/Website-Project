// Lấy danh sách tài khoản đã lưu
function getUsers() {
    let users = localStorage.getItem('julie_users');
    if (users) return JSON.parse(users);

    // Tài khoản thử nghiệm mặc định
    let defaultUsers = { "admin": "123456" };
    localStorage.setItem('julie_users', JSON.stringify(defaultUsers));
    return defaultUsers;
}

// Cập nhật giao diện menu
function renderAuthNav() {
    const authArea = document.getElementById('authArea');
    if (!authArea) return;

    let currentUser = localStorage.getItem('julie_currentUser');

    if (currentUser) {
        authArea.innerHTML = `
            <span class="user-welcome">Chào, ${currentUser}!</span>
            <button class="btn-nav-auth" onclick="handleLogout()">Đăng xuất</button>
        `;
    } else {
        authArea.innerHTML = `
            <button class="btn-nav-auth" onclick="openAuthModal('login')">Đăng nhập</button>
            <button class="btn-nav-auth secondary" onclick="openAuthModal('register')">Đăng ký</button>
        `;
    }
}

// Mở Pop-up Modal
function openAuthModal(defaultTab = 'login') {
    switchTab(defaultTab);
    document.getElementById('authModal').classList.add('active');
}

// Đóng Pop-up Modal
function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

// Chuyển đổi qua lại giữa Tab Đăng nhập và Đăng ký
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabLoginBtn.classList.remove('active');
        tabRegisterBtn.classList.add('active');
    }
}

// Xử lý gửi Form Đăng nhập
function submitLogin(event) {
    event.preventDefault();
    const userVal = document.getElementById('loginUser').value.trim();
    const passVal = document.getElementById('loginPass').value;

    const users = getUsers();

    if (users[userVal] && users[userVal] === passVal) {
        alert("Đăng nhập thành công! Chào mừng " + userVal);
        localStorage.setItem('julie_currentUser', userVal);
        closeAuthModal();
        renderAuthNav();
        document.getElementById('loginForm').reset();
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
}

// Xử lý gửi Form Đăng ký
function submitRegister(event) {
    event.preventDefault();
    const userVal = document.getElementById('regUser').value.trim();
    const passVal = document.getElementById('regPass').value;
    const confirmPassVal = document.getElementById('regConfirmPass').value;

    const users = getUsers();

    if (users[userVal]) {
        alert("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.");
        return;
    }

    if (passVal !== confirmPassVal) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    // Lưu tài khoản mới
    users[userVal] = passVal;
    localStorage.setItem('julie_users', JSON.stringify(users));

    alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
    switchTab('login');
    document.getElementById('registerForm').reset();
}

// Xử lý Đăng xuất
function handleLogout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        localStorage.removeItem('julie_currentUser');
        alert("Đã đăng xuất thành công!");
        renderAuthNav();
    }
}

// Đóng Pop-up khi nhấn click ra ngoài vùng khung trắng
window.addEventListener('click', function(e) {
    const modal = document.getElementById('authModal');
    if (e.target === modal) {
        closeAuthModal();
    }
});

// Khởi chạy kiểm tra khi tải xong trang
document.addEventListener('DOMContentLoaded', renderAuthNav);