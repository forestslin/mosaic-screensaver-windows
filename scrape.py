import urllib.request
import re
import json

req = urllib.request.Request('https://www.books.com.tw/web/sys_saletopb/books', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req).read().decode('utf-8')
urls = set(re.findall(r'https://im[12]\.book\.com\.tw/image/getImage\?i=[^&\"\' ]+&v=[^&\"\' ]+', html))
urls = [u.replace('&amp;', '&') + "&w=400&h=600" for u in urls if 'image/getImage' in u]
print(json.dumps(urls[:100], indent=2))
