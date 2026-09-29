from abc import ABC, abstractmethod
import uuid
from typing import List
from models.alerts import Alert

class BaseEngine(ABC):
    @abstractmethod
    def analyze(self, events: List[dict]) -> List[Alert]:
        pass
        
    def calculate_confidence(self, evidence_scores: List[float], weights: List[float]) -> float:
        if not evidence_scores or not weights or len(evidence_scores) != len(weights):
            return 0.0
        return sum(s * w for s, w in zip(evidence_scores, weights)) / sum(weights)
        
    def create_alert(self, timestamp: float, source_ip: str, dest_ip: str, dest_port: int,
                    alert_type: str, severity: str, confidence: float, mitre_technique: str,
                    mitre_id: str, description: str, evidence: List[str], related_events: List[dict],
                    engine: str, category: str) -> Alert:
        return Alert(
            id=str(uuid.uuid4()),
            timestamp=timestamp,
            source_ip=source_ip,
            dest_ip=dest_ip,
            dest_port=dest_port,
            alert_type=alert_type,
            severity=severity,
            confidence=confidence,
            mitre_technique=mitre_technique,
            mitre_id=mitre_id,
            description=description,
            evidence=evidence,
            related_events=related_events,
            engine=engine,
            category=category
        )
