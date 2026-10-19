import sys
import time
from urllib.parse import urlparse, urljoin
from playwright.sync_api import sync_playwright

LOGOUT_KEYWORDS = ['logout', 'signout', 'exit', 'quit', 'delete', 'destroy', 'remove']

def run_auto_capture(target_url, username=None, password=None):
    print(f"[*] Starting browser for: {target_url}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            channel="chrome",
            headless=False,
            args=["--start-maximized"]
        )
        
        context = browser.new_context(
            no_viewport=True,
            record_har_path="dump.har",
            record_har_content="attach"
        )
        
        page = context.new_page()
        print(f"[*] Opening {target_url}...")
        page.goto(target_url, wait_until="domcontentloaded")
        
        # If credentials provided, attempt autofill
        if username and password:
            print("[*] Attempting auto-login...")
            try:
                user_inputs = page.locator('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"], input[name*="login"]')
                pass_inputs = page.locator('input[type="password"]')
                if user_inputs.count() > 0 and pass_inputs.count() > 0:
                    user_inputs.first.fill(username)
                    pass_inputs.first.fill(password)
                    submit = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Увійти"), button:has-text("Вхід"), button:has-text("Sign in")')
                    if submit.count() > 0:
                        submit.first.click()
            except Exception as e:
                print(f"[!] Auto-login form fill notice: {e}")

        # Check login status
        print("\n=======================================================")
        print(">>> БРАУЗЕР ВІДКРИТО.")
        print(">>> Якщо потрібна авторизація (2FA, капча, вхід) — увійдіть у свій акаунт.")
        print(">>> Коли будете всередині адмінки, скрипт автоматично почне збір сторінок!")
        print("=======================================================\n")

        login_url = page.url
        base_domain = urlparse(login_url).netloc
        
        # Wait up to 3 minutes for user to be logged in
        start_time = time.time()
        while time.time() - start_time < 180:
            current_url = page.url
            # If URL changed from login page or contains typical dashboard elements
            if current_url != login_url and ('login' not in current_url.lower() and 'signin' not in current_url.lower()):
                print(f"[*] Авторизацію виявлено! Поточний URL: {current_url}")
                break
            
            # Or if sidebar / nav appeared
            nav_count = page.locator('nav, aside, [class*="sidebar"], [class*="menu"]').count()
            if nav_count > 0 and ('login' not in current_url.lower()):
                print(f"[*] Панель керування виявлено!")
                break
                
            page.wait_for_timeout(1000)
            
        print("[*] Починаємо автоматичний обхід розділів адмінки...")
        page.wait_for_timeout(2000)

        # Collect internal navigation links
        visited_urls = set()
        visited_urls.add(page.url)

        links = page.eval_on_selector_all("a[href]", "elements => elements.map(el => el.href)")
        print(f"[*] Знайдено посилань на сторінці: {len(links)}")

        valid_targets = []
        for href in links:
            parsed = urlparse(href)
            if parsed.netloc != base_domain:
                continue
            path_lower = parsed.path.lower()
            if any(kw in path_lower for kw in LOGOUT_KEYWORDS):
                continue
            # avoid javascript: or anchor-only
            if href.startswith('javascript:') or parsed.fragment and parsed.path == urlparse(page.url).path:
                continue
            if href not in visited_urls:
                valid_targets.append(href)
                visited_urls.add(href)

        print(f"[*] Розділів адмінки для аудиту: {len(valid_targets)}")

        # Visit each section
        for i, url in enumerate(valid_targets[:25], 1):
            print(f"[{i}/{min(len(valid_targets), 25)}] Обхід: {url}")
            try:
                page.goto(url, timeout=15000, wait_until="networkidle")
                page.wait_for_timeout(1500)
                
                # Try clicking any obvious tabs or filter buttons
                tabs = page.locator('[role="tab"], button[class*="tab"]')
                for t in range(min(tabs.count(), 4)):
                    try:
                        tabs.nth(t).click(timeout=1000)
                        page.wait_for_timeout(500)
                    except Exception:
                        pass
            except Exception as e:
                print(f"    Пропущено або таймаут: {e}")

        print("[*] Завершення збору. Зберігаємо HAR файл...")
        context.close()
        browser.close()
        print("[+] Дамп мережі успішно записано у dump.har!")

        # Run analysis
        try:
            import analyze_har
            analyze_har.parse_har("dump.har")
        except Exception as e:
            print(f"[!] Помилка аналізатора: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python auto_capture.py <URL> [username] [password]")
        sys.exit(1)
        
    url = sys.argv[1]
    u = sys.argv[2] if len(sys.argv) > 2 else None
    p = sys.argv[3] if len(sys.argv) > 3 else None
    run_auto_capture(url, u, p)
