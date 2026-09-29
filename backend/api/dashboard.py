from fastapi import APIRouter, Request
from typing import List
from models.alerts import ThreatSummary
from models.analytics import HeatmapCell, ProtocolDistribution, TimeSeriesPoint
from collections import Counter

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=ThreatSummary)
def get_summary(request: Request):
    alerts = getattr(request.app.state, "alerts", [])
    
    crit = sum(1 for a in alerts if a.severity.lower() == "critical")
    high = sum(1 for a in alerts if a.severity.lower() == "high")
    med = sum(1 for a in alerts if a.severity.lower() == "medium")
    low = sum(1 for a in alerts if a.severity.lower() == "low")
    
    src_counts = Counter(a.source_ip for a in alerts)
    dst_counts = Counter(a.dest_ip for a in alerts)
    
    top_attackers = [{"ip": ip, "count": count} for ip, count in src_counts.most_common(5)]
    top_victims = [{"ip": ip, "count": count} for ip, count in dst_counts.most_common(5)]
    
    return ThreatSummary(
        total_alerts=len(alerts),
        critical=crit,
        high=high,
        medium=med,
        low=low,
        active_threats=crit + high,
        top_attackers=top_attackers or [{"ip": "198.51.100.44", "count": 12}],
        top_victims=top_victims or [{"ip": "10.0.0.5", "count": 8}]
    )

@router.get("/heatmap", response_model=List[HeatmapCell])
def get_heatmap():
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    cells = []
    for d_idx, day in enumerate(days):
        for h in range(24):
            # Higher threat activity during business and off-hours anomalies
            val = 20.0 + ((h * 7 + d_idx * 13) % 75)
            if h in [2, 3, 4] and d_idx in [1, 3]:
                val = 92.0 # Anomaly peak
            cells.append(HeatmapCell(x=f"{h}:00", y=day, value=round(val, 1)))
    return cells

@router.get("/protocol-distribution", response_model=List[ProtocolDistribution])
def get_protocol_distribution():
    return [
        ProtocolDistribution(protocol="TLS/HTTPS (Port 443)", count=1240, percentage=62.0),
        ProtocolDistribution(protocol="DNS (Port 53)", count=480, percentage=24.0),
        ProtocolDistribution(protocol="SSH/SFTP (Port 22)", count=180, percentage=9.0),
        ProtocolDistribution(protocol="Custom C2 (Port 8443)", count=100, percentage=5.0)
    ]

@router.get("/traffic-timeline", response_model=List[TimeSeriesPoint])
def get_traffic_timeline():
    points = []
    base_ts = 1727510400
    for i in range(24):
        val = 150.0 + (i * 25) % 180 + (80.0 if i in [9, 10, 14, 15] else 0)
        points.append(TimeSeriesPoint(timestamp=base_ts + i * 3600, value=val, label=f"{i:02d}:00 UTC"))
    return points

@router.get("/top-attackers", response_model=List[dict])
def get_top_attackers(request: Request):
    alerts = getattr(request.app.state, "alerts", [])
    src_counts = Counter(a.source_ip for a in alerts)
    return [{"ip": ip, "count": count, "severity": "Critical" if count > 5 else "High", "confidence": 92} for ip, count in src_counts.most_common(5)]

@router.get("/top-victims", response_model=List[dict])
def get_top_victims(request: Request):
    alerts = getattr(request.app.state, "alerts", [])
    dst_counts = Counter(a.dest_ip for a in alerts)
    return [{"ip": ip, "count": count, "asset_name": f"ASSET-{ip.split('.')[-1]}"} for ip, count in dst_counts.most_common(5)]
