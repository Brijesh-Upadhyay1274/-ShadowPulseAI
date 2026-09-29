from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from config import APP_METADATA, CORS_ORIGINS, DATA_DIR
from parsers.zeek_parser import ZeekParser
from parsers.normalizer import Normalizer

from engines.reconnaissance import ReconnaissanceEngine
from engines.c2_beaconing import C2BeaconingEngine
from engines.dns_abuse import DNSAbuseEngine
from engines.encrypted_traffic import EncryptedTrafficEngine
from engines.exfiltration import ExfiltrationEngine

from correlation.attack_chain import AttackChainCorrelation

from api.dashboard import router as dashboard_router
from api.alerts import router as alerts_router
from api.graph import router as graph_router
from api.timeline import router as timeline_router
from api.replay import router as replay_router
from api.analytics import router as analytics_router

app = FastAPI(**APP_METADATA)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(alerts_router)
app.include_router(graph_router)
app.include_router(timeline_router)
app.include_router(replay_router)
app.include_router(analytics_router)

@app.on_event("startup")
async def startup_event():
    print("Loading sample data and running engines...")
    parser = ZeekParser()
    normalizer = Normalizer()
    
    conn_raw = parser.parse_file(os.path.join(DATA_DIR, "sample_conn.log"), "conn")
    dns_raw = parser.parse_file(os.path.join(DATA_DIR, "sample_dns.log"), "dns")
    ssl_raw = parser.parse_file(os.path.join(DATA_DIR, "sample_ssl.log"), "ssl")
    
    events = normalizer.normalize(conn_raw + dns_raw + ssl_raw)
    
    engines = [
        ReconnaissanceEngine(),
        C2BeaconingEngine(),
        DNSAbuseEngine(),
        EncryptedTrafficEngine(),
        ExfiltrationEngine()
    ]
    
    all_alerts = []
    for engine in engines:
        all_alerts.extend(engine.analyze(events))
        
    all_alerts.sort(key=lambda x: x.timestamp)
    
    chain_correlator = AttackChainCorrelation()
    chains = chain_correlator.correlate(all_alerts)
    
    app.state.alerts = all_alerts
    app.state.chains = chains
    app.state.events = events
    print(f"Generated {len(all_alerts)} alerts and {len(chains)} attack chains.")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
