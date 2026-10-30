import os
import re
import urllib.request
import ssl
from concurrent.futures import ThreadPoolExecutor

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = set()
for root, dirs, files in os.walk("src"):
    for f in files:
        if f.endswith((".ts", ".tsx")):
            with open(os.path.join(root, f), errors="ignore") as fp:
                txt = fp.read()
                found = re.findall(r"https://i\.ibb\.co/[^\s\"\)\,\'\`]+", txt)
                urls.update(found)

with open("index.html") as fp:
    urls.update(re.findall(r"https://i\.ibb\.co/[^\s\"\)\,\'\`]+", fp.read()))

print(f"Total unique i.ibb.co URLs found in codebase: {len(urls)}")

def check_url(u):
    req = urllib.request.Request(
        u,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    )
    try:
        res = urllib.request.urlopen(req, context=ctx, timeout=10)
        code = res.getcode()
        return (u, code, "OK" if code == 200 else f"HTTP {code}")
    except Exception as e:
        return (u, 0, str(e))

with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(check_url, sorted(urls)))

working = [r for r in results if r[1] == 200]
broken = [r for r in results if r[1] != 200]

print(f"\n--- URL CHECK SUMMARY ---")
print(f"Working (200 OK): {len(working)}")
print(f"Broken / Unavailable: {len(broken)}")

if broken:
    print("\nBroken URLs:")
    for b in broken:
        print(f"  {b[0]} -> {b[2]}")
else:
    print("\nALL URLS LOAD CLEANLY WITH 200 OK! Zero broken URLs.")
