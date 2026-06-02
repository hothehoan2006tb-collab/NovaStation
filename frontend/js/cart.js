
function renderCart() {
    const c = cart();
    const box = document.querySelector('#cartItems');
    const total = c.reduce((s, i) => s + i.price * i.qty, 0);
    if (!c.length) {
        box.innerHTML = '<div class="card summary-box">Giỏ hàng đang trống.</div>';
        document.querySelector('#cartTotal').textContent = money(0);
        return;
    }
    
    box.innerHTML = c.map(i => `
        <div class="cart-row">
            <img src="${i.image}" alt="${i.title}">
            <b>${i.title}</b>
            <span>${money(i.price)}</span>
            <div class="qty">
                <button onclick="changeQty(${i.id},-1)">-</button>
                <b>${i.qty}</b>
                <button onclick="changeQty(${i.id},1)">+</button>
            </div>
            <button onclick="removeItem(${i.id})" style="background: transparent; border: none; color: var(--muted); cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease;" onmouseover="this.style.color='var(--danger)'" onmouseout="this.style.color='var(--muted)'" title="Xóa sản phẩm">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        </div>`).join('');
        
    document.querySelector('#cartTotal').textContent = money(total);
}

function changeQty(id, d) {
    let c = cart();
    const it = c.find(x => x.id == id);
    if (!it) return;
    it.qty += d;
    if (it.qty <= 0) c = c.filter(x => x.id != id);
    saveCart(c);
    renderCart();
}
function removeItem(id) {
    saveCart(cart().filter(x => x.id != id));
    renderCart();
}
document.addEventListener('DOMContentLoaded', renderCart);
