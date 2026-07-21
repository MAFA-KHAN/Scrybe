import json
import re
from app.api.routes import extract
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

cert_path = "sample_certificates/certificate_sports_championship.pdf"
with open(cert_path, "rb") as f:
    response = client.post("/extract", files={"file": ("cert.pdf", f, "application/pdf")})
    
data = response.json()
print("FIELDS:", json.dumps(data.get("fields"), indent=2))
print("\nRAW TEXT:\n", data.get("raw_text"))
