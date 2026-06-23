import urllib.request
import json
import re

url = "https://www.books.com.tw/web/sys_saletopb/books/"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')

# Find image urls in books.com.tw like:
# src="https://im1.book.com.tw/image/getImage?i=https://www.books.com.tw/img/001/094/39/0010943960.jpg&v=638dbf50k&w=348&h=348"
regex = r'https://im\d\.book\.com\.tw/image/getImage\?i=https://www\.books\.com\.tw/img/[^&"\'\s]+&v=[^&"\'\s]+'
matches = set(re.findall(regex, html))

urls = []
for m in matches:
    # replace w=348&h=348 with w=600&h=600
    base = m.split('&w=')[0]
    urls.append(m + '&w=400&h=600')

with open('urls_books_tw.json', 'w', encoding='utf-8') as f:
    json.dump(urls, f, indent=2)

print(len(urls))
