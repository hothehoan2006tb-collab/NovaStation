
document.addEventListener('DOMContentLoaded', () => {
    const id = new URLSearchParams(location.search).get('id') || 1;
    const g = NS_GAMES.find(x => x.id == id) || NS_GAMES[0];
    
    document.title = g.title + ' - NovaStation';
    
    const favs = JSON.parse(localStorage.getItem('ns_favorites') || '[]');
    const isFav = favs.findIndex(fId => fId == g.id) > -1;
    const favColor = isFav ? 'var(--danger)' : 'var(--text)';
    const favFill = isFav ? 'currentColor' : 'none';
    
    document.querySelector('#detail').innerHTML = `
        <div>
            <img class="detail-cover" src="${g.image}" alt="${g.title}">
        </div>
        <div>
            <h1>${g.title}</h1>
            <p>${g.desc}</p>
            <h2 class="price">${money(g.price)}</h2>
            <p class="old">${money(g.oldPrice)}</p>
            <div class="meta">
                <div><b>Nền tảng</b><br>${g.platform}</div>
                <div><b>Thể loại</b><br>${g.category}</div>
                <div><b>Nhà phát hành</b><br>NovaStation Partner</div>
                <div><b>Ngôn ngữ</b><br>English / Vietnamese</div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="addToCart(${g.id})" style="background: transparent; border: none; color: var(--text); padding: 0 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'" title="Thêm vào giỏ hàng">
                    <svg viewBox="0 0 24 24" style="overflow: visible;" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        <line x1="20" y1="4" x2="20" y2="-4"></line>
                        <line x1="16" y1="0" x2="24" y2="0"></line>
                    </svg>
                </button>
                <button class="btn" onclick="addToCart(${g.id}); window.location.href='checkout.html'" style="background: #e60029; border: none; cursor: pointer; color: white; text-transform: uppercase; flex: 1; border-radius: 5px; box-shadow: 0 8px 24px rgba(230, 0, 41, 0.35); display: flex; align-items: center; justify-content: center;">
                    MUA NGAY 
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
                <button onclick="toggleFavorite(${g.id}, this)" style="background: transparent; border: none; color: ${favColor}; padding: 0 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'" title="Yêu thích">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="${favFill}" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <div style="position: relative; display: flex;" onmouseenter="this.querySelector('.share-menu').style.display='block'; this.querySelector('.share-menu').style.animation='fadeIn 0.2s ease-in-out'" onmouseleave="this.querySelector('.share-menu').style.display='none'">
                    <button style="background: transparent; border: none; color: var(--text); padding: 0 10px; border-radius: 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; height: 100%;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'" title="Chia sẻ">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 14 20 9 15 4"></polyline>
                            <path d="M4 20v-7a4 4 0 0 1 4-4h12"></path>
                        </svg>
                    </button>
                    <div style="position: absolute; left: -10px; right: -10px; top: 100%; height: 15px;"></div>
                    <div class="share-menu" style="right: 0; left: auto; top: calc(100% + 10px); min-width: 150px; z-index: 1000; display: none; position: absolute; background-color: #000000; border-radius: 8px; border: 1px solid var(--line); box-shadow: var(--shadow); overflow: hidden;">
                        <a href="javascript:void(0)" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href), 'facebook-share-dialog', 'width=800,height=600'); return false;" style="display: flex; align-items: center; padding: 10px 15px; color: var(--text); text-decoration: none; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.05)'" onmouseout="this.style.backgroundColor='transparent'">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg> Facebook
                        </a>
                        <a href="javascript:void(0)" onclick="window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(location.href), 'twitter-share-dialog', 'width=800,height=600'); return false;" style="display: flex; align-items: center; padding: 10px 15px; color: var(--text); text-decoration: none; font-size: 13px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.05)'" onmouseout="this.style.backgroundColor='transparent'">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg> Twitter
                        </a>
                        <a href="javascript:void(0)" onclick="navigator.clipboard.writeText(location.href); if(typeof showToast === 'function') showToast('Đã sao chép link!');" style="display: flex; align-items: center; padding: 10px 15px; color: var(--text); text-decoration: none; font-size: 13px; transition: background 0.2s; border-top: 1px solid rgba(255,255,255,0.05);" onmouseover="this.style.backgroundColor='rgba(255,255,255,0.05)'" onmouseout="this.style.backgroundColor='transparent'">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg> Copy Link
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
        
    document.querySelector('#related').innerHTML = NS_GAMES.filter(x => x.id !== g.id).slice(0, 5).map(renderGameCard).join('');
});
