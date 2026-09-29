from typing import List
from models.alerts import Alert
from .base_engine import BaseEngine

class ExfiltrationEngine(BaseEngine):
    def analyze(self, events: List[dict]) -> List[Alert]:
        alerts = []
        
        for e in events:
            if e['log_type'] != 'conn': continue
            
            try:
                orig_bytes = int(e['raw'].get('orig_bytes', 0) or 0)
                resp_bytes = int(e['raw'].get('resp_bytes', 0) or 0)
            except ValueError:
                continue
                
            if orig_bytes > 50000000: # > 50MB
                alerts.append(self.create_alert(
                    timestamp=e['timestamp'],
                    source_ip=e['source_ip'],
                    dest_ip=e['dest_ip'],
                    dest_port=e['dest_port'],
                    alert_type="Large Data Transfer",
                    severity="High",
                    confidence=0.85,
                    mitre_technique="Exfiltration Over Alternative Protocol",
                    mitre_id="T1048",
                    description=f"Large outbound transfer detected: {orig_bytes/1000000:.2f} MB",
                    evidence=[f"Orig Bytes: {orig_bytes}"],
                    related_events=[],
                    engine="ExfiltrationEngine",
                    category="Exfiltration"
                ))
                
            if resp_bytes > 0 and (orig_bytes / resp_bytes) > 10 and orig_bytes > 1000000:
                alerts.append(self.create_alert(
                    timestamp=e['timestamp'],
                    source_ip=e['source_ip'],
                    dest_ip=e['dest_ip'],
                    dest_port=e['dest_port'],
                    alert_type="Asymmetric Traffic",
                    severity="Medium",
                    confidence=0.8,
                    mitre_technique="Exfiltration Over C2 Channel",
                    mitre_id="T1041",
                    description=f"Upload-heavy connection ratio: {orig_bytes/resp_bytes:.2f}:1",
                    evidence=[f"Orig Bytes: {orig_bytes}", f"Resp Bytes: {resp_bytes}"],
                    related_events=[],
                    engine="ExfiltrationEngine",
                    category="Exfiltration"
                ))

        return alerts
