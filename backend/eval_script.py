import json
import os
import re
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

cert_dir = "sample_certificates"
files = [f for f in os.listdir(cert_dir) if f.endswith(('.pdf', '.png', '.jpg', '.jpeg', '.tiff')) and f != 'sample_cert.png']

results = {}
for fname in files:
    fpath = os.path.join(cert_dir, fname)
    with open(fpath, "rb") as f:
        mime = "application/pdf" if fname.endswith(".pdf") else "image/png"
        response = client.post("/extract", files={"file": (fname, f, mime)})
        if response.status_code == 200:
            data = response.json()
            results[fname] = {
                "fields": data.get("fields"),
                "raw_text": data.get("raw_text")
            }
        else:
            results[fname] = {"error": response.text}

with open("eval_results.json", "w") as out:
    json.dump(results, out, indent=2)

print("Evaluation done. Check eval_results.json")
