import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

dropdown_html = '''<div class="user-dropdown">
                        <a href="javascript:void(0)" class="user-btn" onclick="toggleUserDropdown(event)">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </a>
                        <div class="dropdown-content" id="userDropdownContent">
                            <a href="login.html">Đăng nhập / Đăng ký</a>
                            <a href="profile.html">Hồ sơ</a>
                            <a href="orders.html">Đơn hàng</a>
                            <a href="javascript:void(0)" onclick="logoutUser()">Đăng xuất</a>
                        </div>
                    </div>'''

pattern = re.compile(r'<a[^>]*href="login\.html"[^>]*>\s*Đăng nhập/Đăng ký\s*</a>', re.IGNORECASE)

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = pattern.sub(dropdown_html, content)
    
    if new_content != content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")
