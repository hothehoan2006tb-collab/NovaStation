document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const formTitle = document.getElementById('formTitle');
  const formSubtitle = document.getElementById('formSubtitle');

  // Chuyển đổi qua lại giữa các tab
  if (loginTab && registerTab && loginForm && registerForm) {
    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
      
      if (formTitle) formTitle.textContent = 'Chào mừng trở lại';
      if (formSubtitle) formSubtitle.textContent = 'Đăng nhập để tiếp tục hành trình khám phá của bạn';
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
      
      if (formTitle) formTitle.textContent = 'Tạo tài khoản mới';
      if (formSubtitle) formSubtitle.textContent = 'Đăng ký để nhận những ưu đãi độc quyền';
    });
  }

  // Chức năng ẩn/hiện mật khẩu
  const togglePasswords = document.querySelectorAll('.toggle-password');
  togglePasswords.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.style.opacity = '1';
        } else {
          input.type = 'password';
          btn.style.opacity = '0.5';
        }
      }
    });
  });
});