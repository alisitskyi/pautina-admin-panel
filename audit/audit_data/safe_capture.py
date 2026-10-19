import os
import sys
import time
from playwright.sync_api import sync_playwright

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace', line_buffering=True)
except Exception:
    pass


def run_safe_capture(target_url="https://www.pautina-rooms.com/admin/times"):
    print("=" * 65)
    print(" [SAFE PASSIVE RECORDER] - Режим безпечного пасивного запису")
    print("=" * 65)
    print(f"[*] Ціль: {target_url}")
    print("[*] Скрипт НЕ робить ЖОДНИХ автокліків, щоб не зачепити реальні сеанси.")
    print("[*] Відкривається Chrome...")

    har_path = os.path.abspath("dump.har")

    with sync_playwright() as p:
        # Launch real Chrome
        browser = p.chromium.launch(
            channel="chrome",
            headless=False,
            args=["--start-maximized"]
        )

        context = browser.new_context(
            no_viewport=True,
            record_har_path=har_path,
            record_har_content="attach"
        )

        page = context.new_page()
        page.goto(target_url)

        print("\n" + "=" * 65)
        print(">>> ВІКНО CHROME ВІДКРИТО!")
        print(">>> 1. Залогіньтесь у свій акаунт.")
        print(">>> 2. Відкрийте потрібні розділи: розклад (times), кімнати, налаштування.")
        print(">>> 3. Перемкніть дати або фільтри (щоб зафіксувати AJAX-запити сітки).")
        print(">>> 4. КОЛИ ЗАКІНЧИТЕ: просто ЗАКРИЙТЕ вікно браузера (хрестик).")
        print("=" * 65 + "\n")

        # Wait until the user closes the browser window or the page is closed
        try:
            while len(context.pages) > 0 and not page.is_closed():
                time.sleep(1)
        except Exception:
            pass

        print("\n[*] Вікно браузера закрито.")
        print("[*] Зберігаємо та фіналізуємо мережевий дамп (dump.har)...")
        try:
            context.close()
        except Exception:
            pass
        try:
            browser.close()
        except Exception:
            pass

    if os.path.exists(har_path):
        size_kb = os.path.getsize(har_path) / 1024
        print(f"[+] dump.har успішно збережено ({size_kb:.1f} KB)!")
        
        # Run HAR analyzer
        print("[*] Запускаємо автоматичний аналіз витягнутих API та структури даних...")
        try:
            import analyze_har
            report_path = analyze_har.parse_har(har_path)
            print(f"[+] Аудит завершено! Результат у: {report_path}")
        except Exception as e:
            print(f"[!] Помилка аналізатора: {e}")
    else:
        print("[!] dump.har не знайдено.")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "https://www.pautina-rooms.com/admin/times"
    run_safe_capture(target)
