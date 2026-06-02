document.addEventListener('DOMContentLoaded', () => {
    let u = JSON.parse(localStorage.getItem('novastation_user'));
    
    // Nếu chưa đăng nhập, sử dụng dữ liệu khách để bạn có thể xem trang Hồ sơ mà không bị chuyển hướng sang Login
    if (!u) { 
        u = { name: 'Người dùng Khách', email: 'Vui lòng đăng nhập', role: 'Khách hàng' }; 
    }
    
    document.querySelector('#profileName').textContent = u.name;
    document.querySelector('#profileEmail').textContent = u.email;

    // Thêm nút vào trang Admin nếu tài khoản có quyền Admin
    if (u.role === 'Admin') {
        const logoutBtn = document.querySelector('#logoutBtn');
        if (logoutBtn) logoutBtn.insertAdjacentHTML('beforebegin', '<a class="btn" href="admin.html">Trang quản trị</a>');
    }

    // Hiển thị ảnh đại diện nếu người dùng đã từng upload
    const avatarImg = document.querySelector('#avatarImage');
    if (u.avatar && avatarImg) avatarImg.src = u.avatar;

    // Xử lý upload ảnh đại diện mới
    const avatarContainer = document.querySelector('#avatarContainer');
    const avatarUpload = document.querySelector('#avatarUpload');
    const changeAvatarBtn = document.querySelector('#changeAvatarBtn');
    const deleteAvatarBtn = document.querySelector('#deleteAvatarBtn');
    const avatarActions = document.querySelector('#avatarActions');
    const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238ca4c1'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

    if (avatarUpload) {
        if (avatarContainer) avatarContainer.addEventListener('click', () => {
            if (avatarActions) avatarActions.style.display = avatarActions.style.display === 'none' ? 'flex' : 'none';
        });
        if (changeAvatarBtn) changeAvatarBtn.addEventListener('click', () => avatarUpload.click());
        
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (avatarImg) avatarImg.src = ev.target.result;
                    u.avatar = ev.target.result;
                    localStorage.setItem('novastation_user', JSON.stringify(u));
                    if (typeof showToast === 'function') showToast('Cập nhật ảnh đại diện thành công!');
                    if (avatarActions) avatarActions.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (deleteAvatarBtn) {
        deleteAvatarBtn.addEventListener('click', () => {
            if (avatarImg) avatarImg.src = defaultAvatar;
            u.avatar = null;
            localStorage.setItem('novastation_user', JSON.stringify(u));
            if (typeof showToast === 'function') showToast('Đã xóa ảnh đại diện!');
            if (avatarActions) avatarActions.style.display = 'none';
        });
    }

    // Xử lý đăng xuất
    const logoutBtn = document.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('novastation_user');
            if (typeof showToast === 'function') showToast('Đã đăng xuất thành công!');
            setTimeout(() => location.href = 'login.html', 800);
        });
    }

    // Hiển thị thông tin vào form
    const editName = document.querySelector('#editName');
    const editFullName = document.querySelector('#editFullName');
    const editEmail = document.querySelector('#editEmail');
    const editPhone = document.querySelector('#editPhone');
    const updateBtn = document.querySelector('#updateProfileBtn');

    if (editName) editName.value = u.name || '';
    if (editFullName) editFullName.value = u.fullName || '';
    if (editEmail) editEmail.value = u.email || '';
    if (editPhone) editPhone.value = u.phone || '';

    // Xử lý khi nhấn nút Cập nhật
    if (updateBtn) {
        updateBtn.addEventListener('click', () => {
            if (editName) u.name = editName.value.trim();
            if (editFullName) u.fullName = editFullName.value.trim();
            if (editPhone) u.phone = editPhone.value.trim();

            localStorage.setItem('novastation_user', JSON.stringify(u));
            document.querySelector('#profileName').textContent = u.name;
            
            if (typeof showToast === 'function') showToast('Cập nhật thông tin cá nhân thành công!');
        });
    }
});
