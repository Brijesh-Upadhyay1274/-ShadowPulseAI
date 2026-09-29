import math
from collections import defaultdict, Counter
from typing import List
from models.alerts import Alert
from .base_engine import BaseEngine

class DNSAbuseEngine(BaseEngine):
    def entropy(self, s):
        p, lns = Counter(s), float(len(s))
        return -sum(count/lns * math.log2(count/lns) for count in p.values())

    def analyze(self, events: List[dict]) -> List[Alert]:
        alerts = []
        queries_per_src = defaultdict(int)
        
        for e in events:
            if e['log_type'] != 'dns': continue
            
            src = e['source_ip']
            query = e['raw'].get('query', '')
            if not query: continue
            
            queries_per_src[src] += 1
            
            parts = query.split('.')
            subdomain = parts[0] if len(parts) > 1 else query
            ent = self.entropy(subdomain)
            
            if ent > 3.5 and len(subdomain) > 10:
                alerts.append(self.create_alert(
                    timestamp=e['timestamp'],
                    source_ip=src,
                    dest_ip=e.get('dest_ip', '8.8.8.8'),
                    dest_port=53,
                    alert_type="DGA Domain",
                    severity="High",
                    confidence=0.85,
                    mitre_technique="Dynamic Resolution: Domain Generation Algorithms",
                    mitre_id="T1568.002",
                    description=f"High entropy DNS query detected: {query} (Entropy: {ent:.2f})",
                    evidence=[f"Query: {query}", f"Entropy: {ent:.2f}"],
                    related_events=[],
                    engine="DNSAbuseEngine",
                    category="Command and Control"
                ))
                
            if len(query) > 50 and e['raw'].get('qtype_name') == 'TXT':
                alerts.append(self.create_alert(
                    timestamp=e['timestamp'],
                    source_ip=src,
                    dest_ip=e.get('dest_ip', '8.8.8.8'),
                    dest_port=53,
                    alert_type="DNS Tunneling",
                    severity="Critical",
                    confidence=0.9,
                    mitre_technique="Protocol Tunneling",
                    mitre_id="T1572",
                    description=f"Long TXT query detected, possible tunneling: {query[:30]}...",
                    evidence=[f"Query length: {len(query)}", f"Type: TXT"],
                    related_events=[],
                    engine="DNSAbuseEngine",
                    category="Exfiltration"
                ))
                
        for src, count in queries_per_src.items():
            if count > 50:
                alerts.append(self.create_alert(
                    timestamp=events[-1]['timestamp'],
                    source_ip=src,
                    dest_ip="8.8.8.8",
                    dest_port=53,
                    alert_type="DNS Flood",
                    severity="Medium",
                    confidence=0.75,
                    mitre_technique="Endpoint Denial of Service",
                    mitre_id="T1499",
                    description=f"High volume of DNS queries ({count}) from source.",
                    evidence=[f"Query count: {count}"],
                    related_events=[],
                    engine="DNSAbuseEngine",
                    category="Impact"
                ))

        return alerts
