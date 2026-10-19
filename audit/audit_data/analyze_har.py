import json
import os
import sys
import glob
from urllib.parse import urlparse, parse_qs
from collections import defaultdict

IGNORE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.css')
IGNORE_DOMAINS = ('google-analytics.com', 'googletagmanager.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'mc.yandex.ru', 'hotjar.com')

def infer_type(val):
    if val is None:
        return 'null'
    if isinstance(val, bool):
        return 'boolean'
    if isinstance(val, int):
        return 'number (integer)'
    if isinstance(val, float):
        return 'number (float)'
    if isinstance(val, str):
        return 'string'
    if isinstance(val, list):
        if len(val) == 0:
            return 'Array<any>'
        inner = infer_type(val[0])
        return f'Array<{inner}>'
    if isinstance(val, dict):
        return 'object'
    return 'unknown'

def infer_schema(obj, max_depth=3, current_depth=0):
    if current_depth > max_depth:
        return '...'
    if isinstance(obj, dict):
        schema = {}
        for k, v in list(obj.items())[:20]:
            if isinstance(v, dict):
                schema[k] = infer_schema(v, max_depth, current_depth + 1)
            elif isinstance(v, list):
                if len(v) > 0 and isinstance(v[0], dict):
                    schema[k] = [infer_schema(v[0], max_depth, current_depth + 1)]
                elif len(v) > 0:
                    schema[k] = [infer_type(v[0])]
                else:
                    schema[k] = []
            else:
                schema[k] = infer_type(v)
        return schema
    elif isinstance(obj, list):
        if len(obj) > 0:
            return [infer_schema(obj[0], max_depth, current_depth + 1)]
        return []
    return infer_type(obj)

def parse_har(har_path):
    print(f"Reading {har_path}...")
    with open(har_path, 'r', encoding='utf-8', errors='ignore') as f:
        data = json.load(f)

    entries = data.get('log', {}).get('entries', [])
    print(f"Total network entries found: {len(entries)}")

    api_endpoints = defaultdict(list)
    page_routes = set()

    for entry in entries:
        req = entry.get('request', {})
        res = entry.get('response', {})
        url = req.get('url', '')
        method = req.get('method', 'GET')
        status = res.get('status', 0)

        parsed = urlparse(url)
        path = parsed.path
        domain = parsed.netloc

        if any(ign in domain for ign in IGNORE_DOMAINS):
            continue

        if any(path.lower().endswith(ext) for ext in IGNORE_EXTENSIONS):
            continue

        res_content = res.get('content', {})
        mime_type = res_content.get('mimeType', '').lower()
        res_text = res_content.get('text', '')

        # Check if it's a page or an API call
        is_json = 'json' in mime_type or (res_text.strip().startswith('{') or res_text.strip().startswith('['))
        is_html = 'html' in mime_type

        if is_html:
            page_routes.add(path)

        req_body = None
        post_data = req.get('postData', {})
        if post_data.get('text'):
            try:
                req_body = json.loads(post_data['text'])
            except Exception:
                req_body = post_data['text'][:200]

        res_body = None
        if res_text:
            try:
                res_body = json.loads(res_text)
            except Exception:
                pass

        query_params = parse_qs(parsed.query)

        endpoint_key = f"{method} {path}"
        api_endpoints[endpoint_key].append({
            'domain': domain,
            'url': url,
            'method': method,
            'path': path,
            'status': status,
            'query_params': query_params,
            'req_body': req_body,
            'res_body': res_body,
            'is_json': is_json,
            'mime_type': mime_type
        })

    # Generate Report
    report_lines = []
    report_lines.append("# Аудит API та Архітектури Адмін-Панелі")
    report_lines.append(f"\nЗагалом унікальних маршрутів/ендпоінтів: {len(api_endpoints)}\n")

    if page_routes:
        report_lines.append("## Виявлені HTML Сторінки / Роути:")
        for r in sorted(page_routes):
            report_lines.append(f"- `{r}`")
        report_lines.append("")

    report_lines.append("## Детальний аналіз API Ендпоінтів:\n")

    for ep_key in sorted(api_endpoints.keys()):
        calls = api_endpoints[ep_key]
        method, path = ep_key.split(' ', 1)
        latest = calls[-1]

        report_lines.append(f"### `{method} {path}`")
        report_lines.append(f"- **Статус відповіді**: `{latest['status']}`")
        report_lines.append(f"- **Кількість викликів**: {len(calls)}")
        report_lines.append(f"- **MIME Type**: `{latest['mime_type']}`")

        if latest['query_params']:
            report_lines.append(f"- **Query Parameters**:")
            for qk, qv in latest['query_params'].items():
                report_lines.append(f"  - `{qk}`: `{qv}`")

        if latest['req_body']:
            report_lines.append("- **Тіло запиту (Request Body)**:")
            if isinstance(latest['req_body'], (dict, list)):
                schema = infer_schema(latest['req_body'])
                report_lines.append("```json\n" + json.dumps(schema, indent=2, ensure_ascii=False) + "\n```")
            else:
                report_lines.append(f"```\n{latest['req_body']}\n```")

        if latest['res_body']:
            report_lines.append("- **Схема відповіді (Response Schema)**:")
            if isinstance(latest['res_body'], (dict, list)):
                schema = infer_schema(latest['res_body'])
                report_lines.append("```json\n" + json.dumps(schema, indent=2, ensure_ascii=False) + "\n```")
            else:
                report_lines.append(f"```\n{str(latest['res_body'])[:300]}\n```")

        report_lines.append("\n---\n")

    report_text = "\n".join(report_lines)
    output_report_path = os.path.join(os.path.dirname(har_path), "API_AUDIT_REPORT.md")
    with open(output_report_path, 'w', encoding='utf-8') as f:
        f.write(report_text)

    print(f"Report generated successfully: {output_report_path}")
    return output_report_path

if __name__ == '__main__':
    if len(sys.argv) > 1:
        har_file = sys.argv[1]
    else:
        # Search for .har in current directory
        hars = glob.glob("*.har")
        if not hars:
            print("No .har files found in the current directory.")
            print("Please provide the HAR file path or place a .har file here.")
            sys.exit(1)
        har_file = hars[0]

    parse_har(har_file)
