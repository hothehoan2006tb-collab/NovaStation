
document.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('#productList');
    const search = document.querySelector('#productSearch');
    const cat = document.querySelector('#categoryFilter');
    const sort = document.querySelector('#sort');
    
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('q') && search) search.value = urlParams.get('q');
    
    // Đồng bộ tham số URL với thanh chọn trên trang danh sách
    let urlCat = urlParams.get('cat');
    if (urlCat && cat) {
        if (!Array.from(cat.options).some(opt => opt.value === urlCat)) {
            const newOpt = document.createElement('option');
            newOpt.value = urlCat;
            newOpt.textContent = urlCat === 'sale' ? 'Ưu Đãi' : urlCat;
            cat.appendChild(newOpt);
        }
        cat.value = urlCat;
    }

    function draw() {
        let data = [...(window.NS_GAMES || [])];
        const q = (search?.value || '').toLowerCase();
        
        if (q) data = data.filter(g => g.title.toLowerCase().includes(q));
        
        const activeCat = cat?.value || urlCat;
        if (activeCat && activeCat !== '') {
            if (activeCat === 'sale') data = data.filter(g => g.oldPrice && g.oldPrice > g.price);
            else data = data.filter(g => g.category === activeCat);
        }
        
        if (sort?.value === 'price-asc') data.sort((a, b) => a.price - b.price);
        if (sort?.value === 'price-desc') data.sort((a, b) => b.price - a.price);
        
        if (list) list.innerHTML = data.map(renderGameCard).join('') || '<p style="grid-column: 1/-1; text-align: center; color: var(--muted); padding: 40px 0;">Không tìm thấy game nào thuộc thể loại này.</p>';
    }
    
    [search, cat, sort].forEach(e => e && e.addEventListener('input', () => {
        urlCat = ''; // Bỏ qua URL Param khi người dùng tự chọn bộ lọc mới
        draw();
    }));
    draw();
});
