from fastapi import APIRouter
from typing import List
from models.analytics import DetectionStats
from models.threats import ThreatDNA
from correlation.threat_dna import ThreatDNAEngine

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])
dna_engine = ThreatDNAEngine()

@router.get("/detection-stats", response_model=List[DetectionStats])
def get_detection_stats():
    return [
        DetectionStats(engine="ReconnaissanceEngine", total_detections=50, critical=5, high=10, medium=20, low=15, false_positive_rate=0.05),
        DetectionStats(engine="C2BeaconingEngine", total_detections=20, critical=10, high=10, medium=0, low=0, false_positive_rate=0.02)
    ]

@router.get("/threat-dna", response_model=List[ThreatDNA])
def get_threat_dna_list():
    return [dna_engine.compute("INC-001"), dna_engine.compute("INC-002")]

@router.get("/threat-dna/{incident_id}", response_model=ThreatDNA)
def get_threat_dna(incident_id: str):
    return dna_engine.compute(incident_id)

@router.get("/confidence-distribution", response_model=List[dict])
def get_confidence_distribution():
    return [{"bin": "90-100", "count": 15}, {"bin": "80-89", "count": 30}]

@router.get("/ja3-stats", response_model=List[dict])
def get_ja3_stats():
    return [{"ja3": "72a589da586844d7f0818ce684948eea", "count": 5, "malicious": True}]

@router.get("/dns-stats", response_model=List[dict])
def get_dns_stats():
    return [{"domain": "xk7m9p2qr5.evil.top", "count": 10, "type": "DGA"}]
