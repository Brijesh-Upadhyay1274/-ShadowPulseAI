import uuid
from typing import List
from models.alerts import Alert
from models.threats import AttackChain, AttackStep

class AttackChainCorrelation:
    def correlate(self, alerts: List[Alert]) -> List[AttackChain]:
        chains = []
        # Mock correlation - create a single chain from sample alerts
        if not alerts: return chains
        
        steps = []
        for i, a in enumerate(alerts[:5]):
            steps.append(AttackStep(
                phase=a.category,
                mitre_technique=a.mitre_technique,
                mitre_id=a.mitre_id,
                timestamp=a.timestamp,
                title=a.alert_type,
                description=a.description,
                severity=a.severity,
                evidence=a.evidence,
                status="Active"
            ))
            
        if steps:
            chains.append(AttackChain(
                id=str(uuid.uuid4()),
                name="Suspicious Campaign",
                steps=steps,
                start_time=steps[0].timestamp,
                end_time=steps[-1].timestamp,
                severity="High",
                confidence=0.85,
                source_ip=alerts[0].source_ip
            ))
            
        return chains
