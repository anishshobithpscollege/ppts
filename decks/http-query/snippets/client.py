import json
import urllib.request

req = urllib.request.Request(
    "http://localhost:8787/contacts",
    method="QUERY",
    data=json.dumps({"q": "example", "limit": 10}).encode(),
    headers={"Content-Type": "application/json"},
)
with urllib.request.urlopen(req) as res:
    print(res.status, res.headers["Location"], json.load(res))
