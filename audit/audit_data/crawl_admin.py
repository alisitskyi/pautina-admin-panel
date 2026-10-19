import httpx
from bs4 import BeautifulSoup
import os

client = httpx.Client(follow_redirects=True, timeout=15)

# 1. Login
r1 = client.get('https://www.pautina-rooms.com/site/login')
soup = BeautifulSoup(r1.text, 'html.parser')
csrf = soup.find('input', {'name': '_csrf'})['value']

data = {
    '_csrf': csrf,
    'LoginForm[username]': 'anton',
    'LoginForm[password]': '123456',
    'LoginForm[rememberMe]': '1'
}
client.post('https://www.pautina-rooms.com/site/login', data=data)

# 2. Endpoints to audit
pages_to_audit = [
    ('/admin/times', 'page_times.html'),
    ('/admin/booking', 'page_booking.html'),
    ('/admin/times/14', 'page_room_14.html'),
    ('/admin/times/14?history=1', 'page_room_14_history.html'),
    ('/admin/gallery', 'page_gallery.html'),
    ('/admin/rules', 'page_rules.html'),
    ('/admin/profile', 'page_profile.html'),
    ('/admin', 'page_admin_dashboard.html')
]

for url_path, filename in pages_to_audit:
    full_url = f'https://www.pautina-rooms.com{url_path}'
    try:
        res = client.get(full_url)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(res.text)
        print(f"[+] Downloaded {url_path} ({len(res.text)} bytes) -> {filename}")
    except Exception as e:
        print(f"[-] Failed {url_path}: {e}")

# 3. Test Booking create / edit modal endpoint (read-only get_name test)
try:
    res_modal = client.post('https://www.pautina-rooms.com/admin/booking/createbooking?get_name', data={
        '_csrf': csrf,
        'id': 732442
    })
    print(f"[+] /admin/booking/createbooking?get_name response: {res_modal.text}")
except Exception as e:
    print(f"[-] Modal test failed: {e}")

print("\nAll core admin pages downloaded successfully!")
