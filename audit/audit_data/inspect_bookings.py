from bs4 import BeautifulSoup

def inspect_page(filename, title):
    print(f"\n==================== {title} ({filename}) ====================")
    with open(filename, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Check tables
    tables = soup.find_all('table')
    print(f"Tables: {len(tables)}")
    for i, t in enumerate(tables):
        headers = [th.get_text(strip=True) for th in t.find_all('th')]
        print(f"  Table {i+1} headers: {headers}")
        first_row = t.find('tbody').find('tr') if t.find('tbody') and t.find('tbody').find('tr') else None
        if first_row:
            tds = [td.get_text(strip=True) for td in first_row.find_all('td')]
            print(f"  Sample row data: {tds}")

    # Check forms
    forms = soup.find_all('form')
    print(f"Forms: {len(forms)}")
    for f in forms:
        print(f"  Form id={f.get('id')} action={f.get('action')} method={f.get('method')}")
        inputs = [(inp.get('name'), inp.get('type')) for inp in f.find_all(['input', 'select', 'textarea'])]
        print(f"  Fields: {inputs}")

inspect_page('page_booking.html', 'BOOKINGS LIST')
inspect_page('page_room_14_history.html', 'ROOM 14 HISTORY')
