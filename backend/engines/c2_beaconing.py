import statistics
from collections import defaultdict
from typing import List
from models.alerts import Alert
from .base_engine import BaseEngine

class C2BeaconingEngine(BaseEngine):
    def analyze(self, events: List[dict]) -> List[Alert]:
        alerts = []
        conn_pairs = defaultdict(list)
        
        for e in events:
            if e['log_type'] != 'conn': continue
            pair = (e['source_ip'], e['dest_ip'], e['dest_port'])
            conn_pairs[pair].append(e['timestamp'])
            
        for (src, dst, port), times in conn_pairs.items():
            if len(times) < 5: continue
            
            times.sort()
            intervals = [times[i] - times[i-1] for i in range(1, len(times))]
            
            mean_int = statistics.mean(intervals)
            if mean_int == 0: continue
            
            std_int = statistics.stdev(intervals) if len(intervals) > 1 else 0
            cv = std_int / mean_int
            
            if cv < 0.3 and mean_int > 10:
                alerts.append(self.create_alert(
                    timestamp=times[-1],
                    source_ip=src,
                    dest_ip=dst,
                    dest_port=port,
                    alert_type="C2 Beaconing",
                    severity="Critical",
                    confidence=0.9,
                    mitre_technique="Application Layer Protocol",
                    mitre_id="T1071",
                    description=f"Strong beaconing behavior detected to {dst}:{port}. CV={cv:.2f}, Mean Interval={mean_int:.2f}s",
                    evidence=[f"CV: {cv:.2f}", f"Connections: {len(times)}", f"Interval: {mean_int:.2f}s"],
                    related_events=[],
                    engine="C2BeaconingEngine",
                    category="Command and Control"
                ))
                
        return alerts
