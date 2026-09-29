import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

APP_METADATA = {
    "title": "ShadowPulse AI — Threat Intelligence Engine",
    "version": "2.0.0",
    "description": "NTRO-grade passive threat intelligence platform for unidirectional IP traffic"
}
