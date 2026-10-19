from bs4 import BeautifulSoup

with open('admin_times_dump.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("--- SCHEDULE AUDIT ---")

# Find date header or navigation
date_nav = soup.find_all(lambda el: any(k in str(el.get('class', [])).lower() for k in ['date', 'calendar', 'day', 'filter']))
print(f"Date/filter elements: {len(date_nav)}")

# Check how columns/rows are structured
cells = soup.find_all('div', class_='cell-item')
print(f"Total time slots found: {len(cells)}")

# Look at the room titles
room_headers = []
for el in soup.find_all(['h2', 'h3', 'h4', 'th', 'div']):
    c = el.get('class', [])
    if any('room' in str(x).lower() for x in c):
        room_headers.append((el.name, c, el.get_text(strip=True)))

print(f"Room elements found: {len(room_headers)}")
for r in room_headers[:10]:
    print(" ", r)

# Inspect sample slot markup
if cells:
    print("\n--- SAMPLE SLOT MARKUP ---")
    print(cells[0].prettify())

# Inspect booking modal
modal = soup.find(id="BMD")
if modal:
    print("\n--- BOOKING MODAL (#BMD) FOUND ---")
    print(modal.prettify()[:1000])
