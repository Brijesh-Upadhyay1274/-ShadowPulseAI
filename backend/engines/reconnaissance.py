import math
import statistics
from collections import defaultdict
from typing import List
from models.alerts import Alert
from .base_engine import BaseEngine

class ReconnaissanceEngine(BaseEngine):
    def analyze(self, events: List[dict]) -> List[Alert]:
        alerts = []
        
        # Group by source
        src_targets = defaultdict(set)
        src_ports = defaultdict(set)
        src_conn_times = defaultdict(list)
        
        for e in events:
            if e['log_type'] != 'conn':
                continue
                
            src = e['source_ip']
            dst = e['dest_ip']
            port = e['dest_port']
            ts = e['timestamp']
            
            src_targets[src].add(dst)
            src_ports[src].add(port)
            src_conn_times[src].append(ts)
            
        for src, ports in src_ports.items():
            if len(ports) > 20: # Port scan threshold
                alerts.append(self.create_alert(
                    timestamp=src_conn_times[src][-1],
                    source_ip=src,
                    dest_ip="Multiple",
                    dest_port=0,
                    alert_type="Port Scan",
                    severity="High",
                    confidence=0.85,
                    mitre_technique="Network Service Discovery",
                    mitre_id="T1046",
                    description=f"Host scanned {len(ports)} unique ports.",
                    evidence=[f"Unique ports: {len(ports)}"],
                    related_events=[],
                    engine="ReconnaissanceEngine",
                    category="Reconnaissance"
                ))
                
        for src, targets in src_targets.items():
            if len(targets) > 10: # Host sweep
                alerts.append(self.create_alert(
                    timestamp=src_conn_times[src][-1],
                    source_ip=src,
                    dest_ip="Multiple",
                    dest_port=0,
                    alert_type="Host Sweep",
                    severity="Medium",
                    confidence=0.8,
                    mitre_technique="Network Service Discovery",
                    mitre_id="T1046",
                    description=f"Host scanned {len(targets)} unique IP addresses.",
                    evidence=[f"Unique IPs: {len(targets)}"],
                    related_events=[],
                    engine="ReconnaissanceEngine",
                    category="Reconnaissance"
                ))
                
        return alerts
