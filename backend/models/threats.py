from pydantic import BaseModel
from typing import List, Optional

class AttackStep(BaseModel):
    phase: str
    mitre_technique: str
    mitre_id: str
    timestamp: float
    title: str
    description: str
    severity: str
    evidence: List[str]
    status: str

class AttackChain(BaseModel):
    id: str
    name: str
    steps: List[AttackStep]
    start_time: float
    end_time: float
    severity: str
    confidence: float
    source_ip: str

class ThreatDNA(BaseModel):
    incident_id: str
    recon_score: float
    c2_score: float
    dns_abuse_score: float
    encrypted_traffic_score: float
    exfiltration_score: float

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    severity: str
    val: float

class GraphLink(BaseModel):
    source: str
    target: str
    relation: str
    is_malicious: bool

class ThreatGraph(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]
