from models.threats import ThreatDNA
import random

class ThreatDNAEngine:
    def compute(self, incident_id: str) -> ThreatDNA:
        return ThreatDNA(
            incident_id=incident_id,
            recon_score=random.uniform(20, 90),
            c2_score=random.uniform(20, 90),
            dns_abuse_score=random.uniform(10, 80),
            encrypted_traffic_score=random.uniform(30, 95),
            exfiltration_score=random.uniform(10, 70)
        )
