
document.addEventListener('DOMContentLoaded', () => {
    window.renderOrderSummary = function() {
        const c = cart();
        const total = c.reduce((s, i) => s + i.price * i.qty, 0);
        
        document.querySelector('#orderSummary').innerHTML = c.map(i => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 12px;">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <span style="color: #ffffff; font-weight: 500;">${i.title}</span>
                    <div class="qty" style="display: flex; gap: 6px; align-items: center;">
                        <button type="button" onclick="changeQtyCheckout(${i.id}, -1)" style="width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;">-</button>
                        <b style="font-size: 13px; min-width: 16px; text-align: center;">${i.qty}</b>
                        <button type="button" onclick="changeQtyCheckout(${i.id}, 1)" style="width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;">+</button>
                    </div>
                </div>
                <b style="color: #ffffff;">${money(i.price * i.qty)}</b>
            </div>
        `).join('') || '<p style="color: var(--muted); text-align: center;">Không có sản phẩm nào.</p>';
        
        document.querySelector('#checkoutTotal').textContent = money(total);
    };

    window.changeQtyCheckout = function(id, d) {
        let c = cart();
        const it = c.find(x => x.id == id);
        if (!it) return;
        it.qty += d;
        if (it.qty <= 0) c = c.filter(x => x.id != id);
        saveCart(c);
        renderOrderSummary();
    };

    renderOrderSummary();

    // Tự động điền thông tin người dùng đã đăng nhập
    const u = JSON.parse(localStorage.getItem('novastation_user') || '{}');
    if (u && (u.name || u.email)) {
        const nameInput = document.getElementById('chkName');
        const emailInput = document.getElementById('chkEmail');
        const phoneInput = document.getElementById('chkPhone');
        
        if(nameInput && u.name) nameInput.value = u.name; // Tự điền tên
        if(emailInput && u.email) emailInput.value = u.email; // Tự điền mail
        if(phoneInput && u.phone) phoneInput.value = u.phone; // Tự điền SĐT nếu có
    }

    document.querySelector('#checkoutForm').addEventListener('submit', e => {
        e.preventDefault();
        
        const currentCart = cart();
        if (currentCart.length === 0) {
            if (typeof showToast === 'function') showToast('Giỏ hàng trống!');
            return;
        }

        const nameInput = document.getElementById('chkName');
        const phoneInput = document.getElementById('chkPhone');
        
        if (nameInput && !nameInput.value.trim()) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Họ và tên!');
            nameInput.focus();
            return;
        }

        if (phoneInput && !phoneInput.value.trim()) {
            if (typeof showToast === 'function') showToast('Vui lòng nhập Số điện thoại!');
            phoneInput.focus();
            return;
        }
        
        const submitBtn = document.querySelector('button[form="checkoutForm"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="loading-spinner"></span> Đang xử lý...';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.9';
        }

        setTimeout(() => {
            // Lấy tên và mail thực tế trong form lúc đặt (phòng khi khách hàng sửa lại)
            const nameVal = document.getElementById('chkName') ? document.getElementById('chkName').value : (u.name || 'Khách vãng lai');
            const emailVal = document.getElementById('chkEmail') ? document.getElementById('chkEmail').value : (u.email || '');
            const currentTotal = currentCart.reduce((s, i) => s + i.price * i.qty, 0);

            const orders = JSON.parse(localStorage.getItem('novastation_orders') || '[]');
            orders.unshift({
                id: '#NS' + Date.now().toString().slice(-6),
                date: new Date().toLocaleDateString('vi-VN'),
                total: currentTotal, status: 'Đã thanh toán', customerName: nameVal, customerEmail: emailVal
            });
            
            localStorage.setItem('novastation_orders', JSON.stringify(orders));
            saveCart([]); // Làm trống giỏ hàng
            if (typeof showToast === 'function') showToast('Thanh toán thành công!');
            setTimeout(() => location.href = 'orders.html', 800);
        }, 1200);
    });
});
