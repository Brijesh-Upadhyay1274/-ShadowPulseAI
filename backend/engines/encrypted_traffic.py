from typing import List
from models.alerts import Alert
from .base_engine import BaseEngine

class EncryptedTrafficEngine(BaseEngine):
    def analyze(self, events: List[dict]) -> List[Alert]:
        alerts = []
        KNOWN_MALICIOUS_JA3 = {
            "72a589da586844d7f0818ce684948eea" # Cobalt Strike example
        }
        
        for e in events:
            if e['log_type'] != 'ssl': continue
            
            ja3 = e['raw'].get('ja3')
            if ja3 in KNOWN_MALICIOUS_JA3:
                alerts.append(self.create_alert(
                    timestamp=e['timestamp'],
                    source_ip=e['source_ip'],
                    dest_ip=e['dest_ip'],
                    dest_port=e['dest_port'],
                    alert_type="Malicious JA3 Fingerprint",
                    severity="Critical",
                    confidence=0.95,
                    mitre_technique="Encrypted Channel",
                    mitre_id="T1573.002",
                    description=f"Connection matches known malicious JA3 fingerprint: {ja3}",
                    evidence=[f"JA3: {ja3}"],
                    related_events=[],
                    engine="EncryptedTrafficEngine",
                    category="Command and Control"
                ))
                
            cipher = e['raw'].get('cipher', '')
            if 'RC4' in cipher or 'DES' in cipher or 'NULL' in cipher:
                alerts.append(self.create_alert(
                    timestamp=e['timestamp'],
                    source_ip=e['source_ip'],
                    dest_ip=e['dest_ip'],
                    dest_port=e['dest_port'],
                    alert_type="Weak Cipher Suite",
                    severity="Low",
                    confidence=0.9,
                    mitre_technique="Network Sniffing",
                    mitre_id="T1040",
                    description=f"Deprecated or weak cipher suite used: {cipher}",
                    evidence=[f"Cipher: {cipher}"],
                    related_events=[],
                    engine="EncryptedTrafficEngine",
                    category="Defense Evasion"
                ))

        return alerts
