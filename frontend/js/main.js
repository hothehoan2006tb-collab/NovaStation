
// Khởi tạo và đồng bộ kho dữ liệu game 
let localGames = JSON.parse(localStorage.getItem('ns_games_db'));
let deletedIds = JSON.parse(localStorage.getItem('ns_deleted_games') || '[]');

if (!localGames) {
    localGames = window.NS_GAMES || [];
    localStorage.setItem('ns_games_db', JSON.stringify(localGames));
} else {
    if (window.NS_GAMES) {
        const newGames = window.NS_GAMES.filter(g => !localGames.some(lg => lg.id == g.id) && !deletedIds.includes(g.id));
        if (newGames.length > 0) {
            localGames = [...newGames, ...localGames]; 
            localStorage.setItem('ns_games_db', JSON.stringify(localGames));
        }
    }
    window.NS_GAMES = localGames;
}

const money = n => Number(n || 0).toLocaleString('vi-VN') + 'đ';

const cart = () => JSON.parse(localStorage.getItem('ns_cart') || '[]');

const saveCart = c => {
    localStorage.setItem('ns_cart', JSON.stringify(c)); 
    updateCartBadge();
};

function showToast(m) {
    let b = document.getElementById('toast-box');
    if (!b) { b = document.createElement('div'); b.id = 'toast-box'; document.body.appendChild(b); }
    
    // Luôn áp dụng định dạng vị trí góc trên bên phải 
    Object.assign(b.style, { position: 'fixed', top: '100px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' });
    
    const t = document.createElement('div');

    t.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>${m}</div>`;
    Object.assign(t.style, { background: 'linear-gradient(135deg, var(--blue), #0755dc)', color: '#fff', padding: '14px 24px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,.3)', opacity: 0, transform: 'translateX(100%)', transition: 'all .4s cubic-bezier(0.68, -0.55, 0.265, 1.55)', fontWeight: '600', minWidth: '250px' });
    b.appendChild(t);
    
    setTimeout(() => { t.style.opacity = 1; t.style.transform = 'translateX(0)'; }, 10);
    setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(100%)'; setTimeout(() => t.remove(), 400); }, 2500);
}

// Hàm hiển thị Popup Xác Nhận tùy chỉnh
window.showConfirm = function(message, onConfirm) {
    let overlay = document.getElementById('confirm-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'confirm-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10000, opacity: 0, transition: '0.3s'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: '#000000', border: '1px solid var(--line)',
            borderRadius: '4px', padding: '30px', width: 'min(400px, 90%)',
            boxShadow: 'var(--shadow)', color: '#ffffff',
            transform: 'translateY(-20px)', transition: '0.3s', textAlign: 'center'
        });

        const icon = document.createElement('div');
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--danger)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        icon.style.marginBottom = '15px';

        const title = document.createElement('h3');
        Object.assign(title.style, { margin: '0 0 10px 0', fontSize: '20px' });
        title.textContent = 'Xác nhận xóa';

        const msg = document.createElement('p');
        msg.id = 'confirm-message';
        Object.assign(msg.style, { color: 'var(--muted)', marginBottom: '25px', fontSize: '14px', lineHeight: '1.5' });

        const btnRow = document.createElement('div');
        Object.assign(btnRow.style, { display: 'flex', justifyContent: 'center', gap: '12px' });

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn';
        Object.assign(cancelBtn.style, { background: 'rgba(255,255,255,0.05)', boxShadow: 'none', color: 'var(--text)' });
        cancelBtn.textContent = 'Hủy';

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn';
        Object.assign(confirmBtn.style, { background: 'var(--danger)', boxShadow: '0 8px 24px rgba(255, 77, 109, 0.25)' });
        confirmBtn.id = 'confirm-yes-btn';
        confirmBtn.textContent = 'Xóa';

        btnRow.append(cancelBtn, confirmBtn);
        modal.append(icon, title, msg, btnRow);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const close = () => { overlay.style.opacity = 0; modal.style.transform = 'translateY(-20px)'; setTimeout(() => overlay.style.display = 'none', 300); };
        cancelBtn.onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };
    }
    document.getElementById('confirm-message').textContent = message;
    overlay.style.display = 'flex';
    setTimeout(() => { overlay.style.opacity = 1; overlay.querySelector('div').style.transform = 'translateY(0)'; }, 10);

    document.getElementById('confirm-yes-btn').onclick = () => {
        overlay.style.opacity = 0; overlay.querySelector('div').style.transform = 'translateY(-20px)';
        setTimeout(() => overlay.style.display = 'none', 300);
        if (onConfirm) onConfirm();
    };
};

window.toggleFavorite = function(gameId, btnElement) {
    let favs = JSON.parse(localStorage.getItem('ns_favorites') || '[]');
    const index = favs.findIndex(id => id == gameId);
    if (index > -1) {
        favs.splice(index, 1);
        if (btnElement) { btnElement.style.color = 'var(--text)'; btnElement.querySelector('svg').style.fill = 'none'; }
        if (typeof showToast === 'function') showToast('Đã bỏ yêu thích!');
    } else {
        favs.push(gameId);
        if (btnElement) { btnElement.style.color = 'var(--danger)'; btnElement.querySelector('svg').style.fill = 'currentColor'; }
        if (typeof showToast === 'function') showToast('Đã thêm vào danh sách yêu thích!');
    }
    localStorage.setItem('ns_favorites', JSON.stringify(favs));
    
    // Nếu đang ở trang danh sách yêu thích, render lại ngay lập tức
    if (typeof renderFavorites === 'function') renderFavorites();
};

function addToCart(id, qty = 1) {
    const g = (window.NS_GAMES || []).find(x => x.id == id); 
    if (!g) return; 
    const c = cart(); 
    const item = c.find(x => x.id == id); 
    if (item) {
        item.qty += qty;
    } else {
        c.push({ id: g.id, title: g.title, price: g.price, image: g.image, qty });
    }
    saveCart(c); 
    showToast('Đã thêm vào giỏ hàng!');
}

function updateCartBadge() {
    const el = document.querySelector('#cartCount'); 
    if (el) el.textContent = cart().reduce((s, i) => s + i.qty, 0);
}

function renderStars(n) {
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}
function renderGameCard(g, showRemoveBtn = false) {
    // Ngăn chặn lỗi hiển thị thùng rác do hàm map() tự động truyền index vào
    if (typeof showRemoveBtn !== 'boolean') showRemoveBtn = false;

    const oldP = g.oldPrice || g.original_price;
    const oldPriceHtml = oldP ? `<span class="old" style="font-size: 10px;">${money(oldP)}</span>` : '';
    let discountHtml = '';
    if (oldP && oldP > g.price) {
        const pct = Math.round(((oldP - g.price) / oldP) * 100);
        discountHtml = `<span style="background: var(--danger); color: white; padding: 2px 4px; border-radius: 3px; font-size: 9px; font-weight: bold; margin-right: auto;">-${pct}%</span>`;
    }
    
    const removeBtn = showRemoveBtn ? `<button onclick="event.preventDefault(); toggleFavorite(${g.id})" style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; z-index: 10; transition: 0.2s;" onmouseover="this.style.background='var(--danger)'; this.style.borderColor='var(--danger)';" onmouseout="this.style.background='rgba(0,0,0,0.7)'; this.style.borderColor='rgba(255,255,255,0.2)'" title="Gỡ khỏi yêu thích"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>` : '';

    return `<article class="card game-card" style="position: relative;">
        ${removeBtn}
        <a href="product-detail.html?id=${g.id}"><img class="cover" src="${g.image}" alt="${g.title}"></a>
        <div class="info" style="display: flex; flex-direction: column; padding: 10px; flex: 1;">
            <h3 style="font-size: 13px; line-height: 1.4; margin: 0 0 auto 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${g.title}</h3>
            <div style="display: flex; align-items: center; width: 100%; margin-top: 8px; white-space: nowrap; gap: 4px; letter-spacing: -0.2px;">
                ${oldPriceHtml}
                ${discountHtml}
                <span class="price" style="color: white; font-weight: 700; font-size: 15px; margin-left: ${!discountHtml ? 'auto' : '0'};">${money(g.price)}</span>
            </div>
        </div>
    </article>`;
}

document.addEventListener('DOMContentLoaded',()=>{
    updateCartBadge(); 
    const gSearch=document.querySelector('#globalSearch'); 
    if(gSearch){
        const btn=gSearch.nextElementSibling; 
        const searchIcon=btn.querySelector('img');
        if(searchIcon) {
            searchIcon.src='images/icons/search2.png';
        }
        const go=()=>{if(gSearch.value.trim()) location.href='products.html?q='+encodeURIComponent(gSearch.value.trim());}; 
        btn.addEventListener('click',go); 
        gSearch.addEventListener('keypress',e=>e.key==='Enter'&&go());

        // Khởi tạo phần hiển thị danh sách gợi ý tìm kiếm
        const searchDiv = gSearch.closest('.search');
        if (searchDiv) {
            const searchWrap = document.createElement('div');
            searchWrap.className = 'search-wrap';
            searchDiv.parentNode.insertBefore(searchWrap, searchDiv);
            searchWrap.appendChild(searchDiv);

            const suggestionsBox = document.createElement('div');
            suggestionsBox.className = 'search-suggestions';
            searchWrap.appendChild(suggestionsBox);

            const showSuggestions = () => {
                const query = gSearch.value.trim().toLowerCase();
                suggestionsBox.innerHTML = '';
                
                // Chỉ hiển thị gợi ý khi có nhập từ khoá
                if (!query) {
                    suggestionsBox.style.display = 'none';
                    return;
                }

                let matches = (window.NS_GAMES || []).filter(g => g.title.toLowerCase().includes(query)).slice(0, 5);

                if (matches.length > 0) {
                    matches.forEach(g => {
                        const item = document.createElement('div');
                        item.className = 'suggestion-item';
                        
                        item.innerHTML = `
                            <img src="${g.image}" alt="${g.title}" style="width: 30px; height: 40px; object-fit: cover; border-radius: 4px;">
                            <div class="title" style="color: #000000; font-size: 14px; font-weight: 600; margin-left: 12px; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${g.title}</div>
                            <div class="price" style="color: #000000; font-size: 13px; font-weight: 500; margin-left: 10px;">${money(g.price)}</div>
                        `;
                        item.addEventListener('click', () => location.href = `product-detail.html?id=${g.id}`);
                        suggestionsBox.appendChild(item);
                    });
                    suggestionsBox.style.display = 'block';
                } else {
                    suggestionsBox.style.display = 'none';
                }
            };

            gSearch.addEventListener('input', showSuggestions);
            gSearch.addEventListener('focus', showSuggestions);
            document.addEventListener('click', e => { if (!searchWrap.contains(e.target)) suggestionsBox.style.display = 'none'; });
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Tự động tạo khối User Menu (có cả Icon và Dropdown) bằng Javascript
    const user = JSON.parse(localStorage.getItem('novastation_user'));
    
    // Đảm bảo các trang đều có nút user-dropdown trong topbar
    document.querySelectorAll(".nav-actions").forEach(nav => {
        if (!nav.querySelector('.user-dropdown') && !nav.querySelector('#adminName')) {
            const dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'user-dropdown';
            nav.prepend(dropdownDiv); // Đặt vào vị trí đầu trong góc trên bên phải
        }
    });

    const userDropdowns = document.querySelectorAll(".user-dropdown");
    userDropdowns.forEach(dropdownContainer => {
        dropdownContainer.innerHTML = `
            <a href="javascript:void(0)" class="user-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            </a>
            <div class="dropdown-content">
                <a href="login.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>Đăng nhập</a>
                <a href="profile.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>Hồ sơ</a>
                <a href="orders.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>Đơn hàng</a>
                ${user && user.role === 'Admin' ? '<a href="admin.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>Trang quản trị</a>' : ''}
                <a href="javascript:void(0)" onclick="logoutUser()" class="logout-btn"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>Đăng xuất</a>
            </div>
        `;
    });

    // Quét toàn bộ kho Game để tự động tạo danh sách Thể loại (Chống trùng lặp)
    const uniqueCategories = [...new Set((window.NS_GAMES || []).map(g => g.category).filter(Boolean))];
    const categoryLinksHtml = uniqueCategories.map(c => `<a href="products.html?cat=${encodeURIComponent(c)}">${c}</a>`).join('');

    // Tự động đồng bộ Menu Điều hướng (Trang chủ, Game Hot, Thể loại...) cho TẤT CẢ các trang
    const navLinksContainer = document.querySelector('.nav-links .container');
    if (navLinksContainer) {
        navLinksContainer.innerHTML = `
            <a href="index.html">TRANG CHỦ</a>
            <a href="products.html">GAME HOT</a>
            <a href="products.html?cat=sale">ƯU ĐÃI</a>
            <div class="category-dropdown">
                <a href="javascript:void(0)" style="display: flex; align-items: center; gap: 4px;">THỂ LOẠI <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                <div class="dropdown-content" style="right: auto; left: 0; top: 30px; min-width: 160px; z-index: 1000;">
                    ${categoryLinksHtml || '<a href="products.html">Tất cả game</a>'}
                </div>
            </div>
            <a href="favorites.html" style="margin-left: auto;">GAME YÊU THÍCH</a>
            <div class="category-dropdown">
                <a href="javascript:void(0)" style="display: flex; align-items: center; gap: 4px;">HƯỚNG DẪN <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></a>
                <div class="dropdown-content" style="right: auto; left: 0; top: 30px; min-width: 160px; z-index: 1000;">
                    <a href="about.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Về chúng tôi</a>
                    <a href="products.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>Mua hàng</a>
                    <a href="return.html"><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>Trả hàng</a>
                </div>
            </div>
            <a href="javascript:void(0)">NEWS</a>
        `;
    }
});

// Xử lý đăng xuất
window.logoutUser = function() {
    localStorage.removeItem('novastation_user'); // Xóa đúng key lưu tài khoản
    if (typeof showToast === 'function') showToast('Đã đăng xuất thành công!');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 800);
};

// --- QUẢN LÝ ĐÁNH GIÁ SẢN PHẨM (Tự động hiển thị ở trang chi tiết game) ---
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ chạy nếu đang ở trang chi tiết game
    if (!window.location.pathname.includes('product-detail.html') && !window.location.search.includes('id=')) return;

    // Dùng interval để chờ trình duyệt nạp xong giao diện chi tiết game
    const checkExist = setInterval(() => {
        const detailWrap = document.querySelector('.detail-wrap');
        if (detailWrap) {
            if (document.querySelector('#reviewsSection')) {
                clearInterval(checkExist);
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const gameId = urlParams.get('id');
            if (!gameId) return;
            clearInterval(checkExist);

            const reviewsContainer = document.createElement('div');
            reviewsContainer.id = 'reviewsSection';
            reviewsContainer.className = 'summary-box';
            reviewsContainer.style.marginTop = '30px';
            reviewsContainer.style.marginBottom = '30px';
            reviewsContainer.style.backgroundColor = '#12151c'; // Màu nền đen nhạt
            reviewsContainer.style.borderRadius = '5px';
            
            // Chèn khung Đánh giá xuống dưới cùng của trang chi tiết
            detailWrap.parentNode.appendChild(reviewsContainer);

            renderReviews(gameId, reviewsContainer);
        }
    }, 500);
});

function timeAgo(dateString) {
    if (!dateString) return '';
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ngày trước`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} tháng trước`;
    return `${Math.floor(months / 12)} năm trước`;
}

function renderReviews(gameId, container) {
    let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
    const user = JSON.parse(localStorage.getItem('novastation_user'));
    const isAdmin = user && user.role === 'Admin';

    let totalStars = reviews.reduce((sum, r) => sum + r.stars, 0);
    let avgStars = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 0;

    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 12px; margin-bottom: 15px;">
            <h3 style="margin: 0; color: #ffffff; text-transform: uppercase; font-size: 15px;">ĐÁNH GIÁ SẢN PHẨM</h3>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 18px; font-weight: bold;">
                ${avgStars > 0 ? `<span style="color: #ffffff;">${avgStars}</span> <span style="color: var(--gold); font-size: 20px;">★</span>` : '<span style="color: var(--muted); font-size: 13px; font-weight: normal;">Chưa có đánh giá</span>'}
            </div>
        </div>
        <div style="margin-bottom: 20px; max-height: 300px; overflow-y: auto; padding-right: 5px;">
    `;

    if (reviews.length === 0) {
        html += `<p style="color: var(--muted); text-align: center; margin: 15px 0; font-size: 13px; font-style: italic;">Chưa có bình luận nào. Hãy là người đầu tiên đánh giá!</p>`;
    } else {
        reviews.forEach(r => {
            const avatarStyle = r.isAdmin ? "width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid var(--danger); box-shadow: 0 0 8px rgba(255, 77, 109, 0.6);" : "width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);";
            html += `
                <div style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <strong style="color: #ffffff; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                            <img src="${r.userAvatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238ca4c1'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>"}" style="${avatarStyle}" alt="Avatar">
                            ${r.userName} 
                            <span style="color: var(--gold); font-size: 12px;">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
                            <span style="color: var(--muted); font-size: 11px; font-weight: normal; margin-left: 4px;">${timeAgo(r.date)}</span>
                        </strong>
                        <div style="display: flex; align-items: center;">
                            <button onclick="toggleLike('${gameId}', ${r.id})" style="background: transparent; border: none; color: ${r.likes && user && r.likes.includes(user.name) ? 'var(--danger)' : 'var(--muted)'}; font-size: 12px; cursor: pointer; margin-right: 10px; display: flex; align-items: center; gap: 4px; transition: 0.2s;">
                                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="${r.likes && user && r.likes.includes(user.name) ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                ${r.likes && r.likes.length > 0 ? r.likes.length : 'Thích'}
                            </button>
                            ${user ? `<button onclick="toggleReplyForm(${r.id})" style="background: transparent; border: none; color: var(--muted); font-size: 12px; cursor: pointer; margin-right: 10px; transition: 0.2s;">Trả lời</button>` : ''}
                            ${user && (r.userName === user.name || isAdmin) ? `<button onclick="editReview('${gameId}', ${r.id})" style="background: transparent; border: none; color: var(--muted); cursor: pointer; margin-right: 10px; transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted)'" title="Sửa bình luận"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>` : ''}
                            ${user && (r.userName === user.name || isAdmin) ? `<button onclick="deleteReview('${gameId}', ${r.id})" style="background: transparent; border: none; color: var(--danger); cursor: pointer; transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ff758f'" onmouseout="this.style.color='var(--danger)'" title="Xóa bình luận"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>` : ''}
                        </div>
                    </div>
                    <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 4px 0 0 36px; line-height: 1.5;">${r.text}</p>
                    ${r.image ? `<img src="${r.image}" style="max-height: 150px; border-radius: 6px; margin: 8px 0 0 36px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;" onclick="window.open('${r.image}', '_blank')" alt="Ảnh đánh giá">` : ''}
                    
                    ${(r.replies || []).map(reply => {
                        const replyAvatarStyle = reply.isAdmin ? "width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 2px solid var(--danger); box-shadow: 0 0 6px rgba(255, 77, 109, 0.6);" : "width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);";
                        return `
                        <div style="margin-top: 10px; margin-left: 36px; padding-left: 12px; border-left: 2px solid var(--line);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <strong style="color: #eef6ff; font-size: 12px; display: flex; align-items: center; gap: 6px;">
                                    <img src="${reply.userAvatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238ca4c1'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>"}" style="${replyAvatarStyle}" alt="Avatar">
                                    ${reply.userName} 
                                    ${reply.isAdmin ? '<span style="background: var(--danger); color: white; padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: bold;">Admin</span>' : ''}
                                    <span style="color: var(--muted); font-size: 10px; font-weight: normal; margin-left: 4px;">${timeAgo(reply.date)}</span>
                                </strong>
                                <div style="display: flex; align-items: center;">
                                    <button onclick="toggleReplyLike('${gameId}', ${r.id}, ${reply.id})" style="background: transparent; border: none; color: ${reply.likes && user && reply.likes.includes(user.name) ? 'var(--danger)' : 'var(--muted)'}; font-size: 11px; cursor: pointer; margin-right: 8px; display: flex; align-items: center; gap: 3px; transition: 0.2s;">
                                        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="${reply.likes && user && reply.likes.includes(user.name) ? 'currentColor' : 'none'}" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                        ${reply.likes && reply.likes.length > 0 ? reply.likes.length : 'Thích'}
                                    </button>
                                    ${user && (reply.userName === user.name || isAdmin) ? `<button onclick="editReply('${gameId}', ${r.id}, ${reply.id})" style="background: transparent; border: none; color: var(--muted); cursor: pointer; margin-right: 8px; transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted)'" title="Sửa câu trả lời"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>` : ''}
                                    ${user && (reply.userName === user.name || isAdmin) ? `<button onclick="deleteReply('${gameId}', ${r.id}, ${reply.id})" style="background: transparent; border: none; color: var(--danger); cursor: pointer; transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ff758f'" onmouseout="this.style.color='var(--danger)'" title="Xóa câu trả lời"><svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>` : ''}
                                </div>
                            </div>
                            <p style="color: rgba(255,255,255,0.65); font-size: 12px; margin: 4px 0 0 26px;">${reply.text}</p>
                            ${reply.image ? `<img src="${reply.image}" style="max-height: 100px; border-radius: 4px; margin: 6px 0 0 26px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;" onclick="window.open('${reply.image}', '_blank')" alt="Ảnh trả lời">` : ''}
                        </div>
                    `;
                    }).join('')}
                    <div id="reply-form-${r.id}" style="display: none; margin-top: 10px; margin-left: 36px;">
                        <div style="position: relative; margin-bottom: 6px;">
                            <textarea id="replyText-${r.id}" class="input" rows="1" placeholder="Viết câu trả lời..." style="background: transparent; font-size: 13px; font-family: inherit; resize: vertical; padding-bottom: 30px; width: 100%; border-radius: 8px;"></textarea>
                            <div style="position: absolute; bottom: 8px; left: 10px; display: flex; gap: 10px; align-items: center;">
                                <label style="cursor: pointer; color: var(--muted); transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted)'" title="Đính kèm ảnh">
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    <input type="file" id="replyImage-${r.id}" accept="image/*" style="display: none;" onchange="previewImage(this, 'replyImagePreview-${r.id}')">
                                </label>
                                <div style="position: relative;">
                                    <button onclick="toggleEmojiPicker('emojiPicker-${r.id}')" style="background: transparent; border: none; padding: 0; cursor: pointer; color: var(--muted); transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted)'" title="Biểu tượng cảm xúc">
                                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                                    </button>
                                    <div id="emojiPicker-${r.id}" style="display: none; position: absolute; bottom: 25px; left: -10px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 8px; box-shadow: var(--shadow); z-index: 10; gap: 5px; grid-template-columns: repeat(6, 1fr); width: 190px;">
                                        ${['😀','😂','😅','😍','😎','😢','😭','😡','👍','❤️','🔥','🎉','✨','💯','🙌','👏','🤔','👀'].map(e => `<button onclick="insertEmoji('replyText-${r.id}', '${e}')" style="background: transparent; border: none; font-size: 16px; cursor: pointer; padding: 4px; border-radius: 4px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">${e}</button>`).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="replyImagePreview-${r.id}" style="margin-bottom: 10px; display: none;"></div>
                        <div style="text-align: right;">
                            <button onclick="submitReply('${gameId}', ${r.id}, this)" class="btn" style="padding: 6px 12px; font-size: 11px;">Gửi</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    html += `
        </div>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; border: 1px solid var(--line);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="margin: 0; color: #fff; font-size: 13px;">Viết đánh giá của bạn</h4>
                ${user ? `
                    <div class="star-rating-box" style="gap: 4px; font-size: 22px;">
                        <input type="radio" id="star5" name="rating" value="5"><label for="star5">★</label>
                        <input type="radio" id="star4" name="rating" value="4"><label for="star4">★</label>
                        <input type="radio" id="star3" name="rating" value="3"><label for="star3">★</label>
                        <input type="radio" id="star2" name="rating" value="2"><label for="star2">★</label>
                        <input type="radio" id="star1" name="rating" value="1" checked><label for="star1">★</label>
                    </div>
                ` : ''}
            </div>
            ${user ? `
                <div style="position: relative; margin-bottom: 10px;">
                    <textarea id="reviewText" class="input" rows="2" placeholder="Hãy để lại bình luận..." style="background: transparent; font-size: 14px; font-family: Inter, Segoe UI, Arial, sans-serif; resize: vertical; padding-bottom: 35px; width: 100%; border-radius: 8px;"></textarea>
                    <div style="position: absolute; bottom: 10px; left: 10px; display: flex; gap: 12px; align-items: center;">
                        <label style="cursor: pointer; color: var(--muted); transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted)'" title="Đính kèm ảnh">
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <input type="file" id="reviewImage" accept="image/*" style="display: none;" onchange="previewImage(this, 'reviewImagePreview')">
                        </label>
                        <div style="position: relative;">
                            <button onclick="toggleEmojiPicker('emojiPicker-main')" style="background: transparent; border: none; padding: 0; cursor: pointer; color: var(--muted); transition: 0.2s; display: flex; align-items: center;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='var(--muted)'" title="Biểu tượng cảm xúc">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                            </button>
                            <div id="emojiPicker-main" style="display: none; position: absolute; bottom: 25px; left: -10px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 8px; box-shadow: var(--shadow); z-index: 10; gap: 5px; grid-template-columns: repeat(6, 1fr); width: 190px;">
                                ${['😀','😂','😅','😍','😎','😢','😭','😡','👍','❤️','🔥','🎉','✨','💯','🙌','👏','🤔','👀'].map(e => `<button onclick="insertEmoji('reviewText', '${e}')" style="background: transparent; border: none; font-size: 16px; cursor: pointer; padding: 4px; border-radius: 4px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">${e}</button>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="reviewImagePreview" style="margin-bottom: 10px; display: none;"></div>
                <div style="text-align: right;">
                    <button id="submitReviewBtn" onclick="submitReview('${gameId}')" class="btn" style="padding: 8px 16px; font-size: 12px;">Gửi đánh giá</button>
                </div>
            ` : `
                <p style="color: var(--muted); font-size: 13px; margin: 0;">Vui lòng <a href="login.html" style="color: var(--blue);">đăng nhập</a> để để lại bình luận.</p>
            `}
        </div>
    `;

    container.innerHTML = html;
}

window.previewImage = function(input, previewId) {
    const previewDiv = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            if (typeof showToast === 'function') showToast('Kích thước ảnh quá lớn (< 5MB)!');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            previewDiv.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <img src="${e.target.result}" style="max-height: 80px; border-radius: 4px; border: 1px solid var(--line); display: block;">
                    <button onclick="removePreview('${input.id}', '${previewId}')" style="position: absolute; top: -8px; right: -8px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; padding: 0;">&times;</button>
                </div>`;
            previewDiv.style.display = 'block';
            input.setAttribute('data-base64', e.target.result);
        }
        reader.readAsDataURL(file);
    }
};

window.removePreview = function(inputId, previewId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = "";
        input.removeAttribute('data-base64');
    }
    const previewDiv = document.getElementById(previewId);
    if (previewDiv) {
        previewDiv.innerHTML = "";
        previewDiv.style.display = "none";
    }
};

window.submitReview = function(gameId) {
    const user = JSON.parse(localStorage.getItem('novastation_user'));
    if (!user) return;
    
    const text = document.getElementById('reviewText').value.trim();
    const imgInput = document.getElementById('reviewImage');
    const imageBase64 = imgInput && imgInput.getAttribute('data-base64') ? imgInput.getAttribute('data-base64') : null;

    if (!text && !imageBase64) {
        if (typeof showToast === 'function') showToast('Vui lòng nhập nội dung hoặc đính kèm ảnh!');
        return;
    }

    const btn = document.getElementById('submitReviewBtn');
    btn.innerHTML = '<span class="loading-spinner"></span> Đang gửi...';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
        const ratingInput = document.querySelector('.star-rating-box input:checked');
        const stars = ratingInput ? parseInt(ratingInput.value) : 1;

        let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
        reviews.push({
            id: Date.now(),
            userName: user.name || 'Thành viên',
            userAvatar: user.avatar || null,
            isAdmin: user.role === 'Admin',
            stars: stars,
            text: text,
            image: imageBase64,
            date: new Date().toISOString()
        });
        
        localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
        if (typeof showToast === 'function') showToast('Cảm ơn bạn đã đánh giá!');
        
        renderReviews(gameId, document.querySelector('#reviewsSection'));
    }, 600);
};

window.toggleLike = function(gameId, reviewId) {
    const user = JSON.parse(localStorage.getItem('novastation_user'));
    if (!user) {
        if (typeof showToast === 'function') showToast('Vui lòng đăng nhập để thả cảm xúc!');
        return;
    }

    let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
    const rIndex = reviews.findIndex(r => r.id === reviewId);
    if (rIndex > -1) {
        if (!reviews[rIndex].likes) reviews[rIndex].likes = [];
        const userLikeIndex = reviews[rIndex].likes.indexOf(user.name);
        if (userLikeIndex > -1) {
            reviews[rIndex].likes.splice(userLikeIndex, 1);
        } else {
            reviews[rIndex].likes.push(user.name);
        }
        localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
        renderReviews(gameId, document.querySelector('#reviewsSection'));
    }
};

window.toggleEmojiPicker = function(pickerId) {
    const picker = document.getElementById(pickerId);
    if (!picker) return;
    const isVisible = picker.style.display === 'grid';
    document.querySelectorAll('[id^="emojiPicker-"]').forEach(p => p.style.display = 'none');
    if (!isVisible) picker.style.display = 'grid';
};

window.insertEmoji = function(inputId, emoji) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value += emoji;
        input.focus();
    }
};

document.addEventListener('click', (e) => {
    if (!e.target.closest('button[onclick^="toggleEmojiPicker"]') && !e.target.closest('[id^="emojiPicker-"]')) {
        document.querySelectorAll('[id^="emojiPicker-"]').forEach(p => p.style.display = 'none');
    }
});

window.toggleReplyLike = function(gameId, reviewId, replyId) {
    const user = JSON.parse(localStorage.getItem('novastation_user'));
    if (!user) {
        if (typeof showToast === 'function') showToast('Vui lòng đăng nhập để thả cảm xúc!');
        return;
    }

    let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
    const rIndex = reviews.findIndex(r => r.id === reviewId);
    if (rIndex > -1 && reviews[rIndex].replies) {
        const repIndex = reviews[rIndex].replies.findIndex(rep => rep.id === replyId);
        if (repIndex > -1) {
            if (!reviews[rIndex].replies[repIndex].likes) reviews[rIndex].replies[repIndex].likes = [];
            const userLikeIndex = reviews[rIndex].replies[repIndex].likes.indexOf(user.name);
            if (userLikeIndex > -1) {
                reviews[rIndex].replies[repIndex].likes.splice(userLikeIndex, 1);
            } else {
                reviews[rIndex].replies[repIndex].likes.push(user.name);
            }
            localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
            renderReviews(gameId, document.querySelector('#reviewsSection'));
        }
    }
};

window.editReview = function(gameId, reviewId) {
    let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
    const rIndex = reviews.findIndex(r => r.id === reviewId);
    if (rIndex > -1) {
        const newText = prompt("Sửa bình luận của bạn:", reviews[rIndex].text);
        if (newText !== null && newText.trim() !== "") {
            reviews[rIndex].text = newText.trim();
            localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
            if (typeof showToast === 'function') showToast('Đã cập nhật bình luận!');
            renderReviews(gameId, document.querySelector('#reviewsSection'));
        }
    }
};

window.editReply = function(gameId, reviewId, replyId) {
    let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
    const rIndex = reviews.findIndex(r => r.id === reviewId);
    if (rIndex > -1 && reviews[rIndex].replies) {
        const repIndex = reviews[rIndex].replies.findIndex(rep => rep.id === replyId);
        if (repIndex > -1) {
            const newText = prompt("Sửa câu trả lời của bạn:", reviews[rIndex].replies[repIndex].text);
            if (newText !== null && newText.trim() !== "") {
                reviews[rIndex].replies[repIndex].text = newText.trim();
                localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
                if (typeof showToast === 'function') showToast('Đã cập nhật câu trả lời!');
                renderReviews(gameId, document.querySelector('#reviewsSection'));
            }
        }
    }
};

window.deleteReview = function(gameId, reviewId) {
    showConfirm('Bạn có chắc chắn muốn xóa đánh giá này không? Thao tác này không thể hoàn tác.', () => {
        let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
        reviews = reviews.filter(r => r.id !== reviewId);
        localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
        if (typeof showToast === 'function') showToast('Đã xóa đánh giá!');
        renderReviews(gameId, document.querySelector('#reviewsSection'));
    });
};

window.toggleReplyForm = function(reviewId) {
    const form = document.getElementById(`reply-form-${reviewId}`);
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

window.submitReply = function(gameId, reviewId, btnElement) {
    const user = JSON.parse(localStorage.getItem('novastation_user'));
    if (!user) return;

    const text = document.getElementById(`replyText-${reviewId}`).value.trim();
    const imgInput = document.getElementById(`replyImage-${reviewId}`);
    const imageBase64 = imgInput && imgInput.getAttribute('data-base64') ? imgInput.getAttribute('data-base64') : null;

    if (!text && !imageBase64) {
        if (typeof showToast === 'function') showToast('Vui lòng nhập nội dung hoặc đính kèm ảnh!');
        return;
    }

    btnElement.innerHTML = '<span class="loading-spinner"></span> Đang gửi...';
    btnElement.style.pointerEvents = 'none';

    setTimeout(() => {
        let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
        const rIndex = reviews.findIndex(r => r.id === reviewId);
        if (rIndex > -1) {
            if (!reviews[rIndex].replies) reviews[rIndex].replies = [];
            reviews[rIndex].replies.push({ id: Date.now(), userName: user.name || 'Thành viên', userAvatar: user.avatar || null, isAdmin: user.role === 'Admin', text: text, image: imageBase64, date: new Date().toISOString() });
            localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
            if (typeof showToast === 'function') showToast('Đã gửi câu trả lời!');
            renderReviews(gameId, document.querySelector('#reviewsSection'));
        }
    }, 600);
};

window.deleteReply = function(gameId, reviewId, replyId) {
    showConfirm('Bạn có chắc chắn muốn xóa câu trả lời này không? Thao tác này không thể hoàn tác.', () => {
        let reviews = JSON.parse(localStorage.getItem('ns_reviews_' + gameId) || '[]');
        const rIndex = reviews.findIndex(r => r.id === reviewId);
        if (rIndex > -1 && reviews[rIndex].replies) {
            reviews[rIndex].replies = reviews[rIndex].replies.filter(rep => rep.id !== replyId);
            localStorage.setItem('ns_reviews_' + gameId, JSON.stringify(reviews));
            if (typeof showToast === 'function') showToast('Đã xóa câu trả lời!');
            renderReviews(gameId, document.querySelector('#reviewsSection'));
        }
    });
};
