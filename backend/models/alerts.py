from pydantic import BaseModel
from typing import List, Optional

class Alert(BaseModel):
    id: str
    timestamp: float
    source_ip: str
    dest_ip: str
    dest_port: int
    alert_type: str
    severity: str
    confidence: float
    mitre_technique: str
    mitre_id: str
    description: str
    evidence: List[str]
    related_events: List[dict]
    engine: str
    category: str

class ThreatSummary(BaseModel):
    total_alerts: int
    critical: int
    high: int
    medium: int
    low: int
    active_threats: int
    top_attackers: List[dict]
    top_victims: List[dict]

class TimelineEvent(BaseModel):
    timestamp: float
    title: str
    description: str
    severity: str
    alert_type: str
    source_ip: str
    dest_ip: str
