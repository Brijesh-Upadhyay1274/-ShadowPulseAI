from fastapi import APIRouter, Request
from models.threats import ThreatGraph, GraphNode, GraphLink

router = APIRouter(prefix="/api/graph", tags=["Graph"])

@router.get("", response_model=ThreatGraph)
def get_graph(request: Request):
    alerts = getattr(request.app.state, "alerts", [])
    
    nodes_dict = {}
    links = []
    
    # Base entities
    nodes_dict["198.51.100.44"] = GraphNode(id="198.51.100.44", label="198.51.100.44 (C2)", type="attacker", severity="Critical", val=18.0)
    nodes_dict["203.0.113.66"] = GraphNode(id="203.0.113.66", label="203.0.113.66 (Exfil Host)", type="attacker", severity="High", val=14.0)
    nodes_dict["172.16.0.99"] = GraphNode(id="172.16.0.99", label="172.16.0.99 (Brute Force)", type="attacker", severity="High", val=12.0)
    nodes_dict["192.168.1.100"] = GraphNode(id="192.168.1.100", label="192.168.1.100 (Scanner)", type="attacker", severity="Medium", val=10.0)
    
    nodes_dict["10.0.0.5"] = GraphNode(id="10.0.0.5", label="10.0.0.5 (DB-SERVER-01)", type="victim", severity="Critical", val=16.0)
    nodes_dict["10.0.1.50"] = GraphNode(id="10.0.1.50", label="10.0.1.50 (Workstation-Compromised)", type="victim", severity="Critical", val=15.0)
    nodes_dict["10.0.0.10"] = GraphNode(id="10.0.0.10", label="10.0.0.10 (SSH-Gateway)", type="victim", severity="High", val=12.0)
    
    nodes_dict["evil.top"] = GraphNode(id="evil.top", label="evil.top (DGA Domain)", type="domain", severity="High", val=12.0)
    nodes_dict["c2.malware.xyz"] = GraphNode(id="c2.malware.xyz", label="c2.malware.xyz", type="domain", severity="Critical", val=14.0)
    nodes_dict["tunnel.evil.com"] = GraphNode(id="tunnel.evil.com", label="tunnel.evil.com (DNS Tunnel)", type="domain", severity="Critical", val=15.0)
    
    nodes_dict["72a589da586844d7f0818ce684948eea"] = GraphNode(id="72a589da586844d7f0818ce684948eea", label="JA3: Cobalt Strike", type="hash", severity="Critical", val=14.0)
    nodes_dict["port_22"] = GraphNode(id="port_22", label="Port 22 (SSH)", type="port", severity="Medium", val=8.0)
    nodes_dict["port_8443"] = GraphNode(id="port_8443", label="Port 8443 (C2)", type="port", severity="High", val=9.0)
    nodes_dict["port_53"] = GraphNode(id="port_53", label="Port 53 (DNS)", type="port", severity="Medium", val=8.0)

    # Connections
    links.append(GraphLink(source="10.0.1.50", target="198.51.100.44", relation="C2_BEACON", is_malicious=True))
    links.append(GraphLink(source="198.51.100.44", target="72a589da586844d7f0818ce684948eea", relation="JA3_MATCH", is_malicious=True))
    links.append(GraphLink(source="10.0.1.50", target="tunnel.evil.com", relation="DNS_TUNNEL", is_malicious=True))
    links.append(GraphLink(source="10.0.1.50", target="203.0.113.66", relation="DATA_EXFILTRATION", is_malicious=True))
    links.append(GraphLink(source="172.16.0.99", target="10.0.0.10", relation="SSH_BRUTE_FORCE", is_malicious=True))
    links.append(GraphLink(source="192.168.1.100", target="10.0.0.5", relation="PORT_SCAN", is_malicious=True))
    links.append(GraphLink(source="10.0.1.50", target="evil.top", relation="DGA_RESOLUTION", is_malicious=True))
    links.append(GraphLink(source="evil.top", target="c2.malware.xyz", relation="CNAME_CHAIN", is_malicious=True))
    links.append(GraphLink(source="10.0.0.10", target="port_22", relation="LISTENS_ON", is_malicious=False))
    links.append(GraphLink(source="198.51.100.44", target="port_8443", relation="LISTENS_ON", is_malicious=False))

    # Add alert nodes from detected alerts
    for a in alerts[:6]:
        aid = f"ALERT-{a.id[:8]}"
        nodes_dict[aid] = GraphNode(id=aid, label=f"{a.alert_type}", type="alert", severity=a.severity, val=11.0)
        if a.source_ip in nodes_dict:
            links.append(GraphLink(source=a.source_ip, target=aid, relation="GENERATED_ALERT", is_malicious=True))
        if a.dest_ip in nodes_dict:
            links.append(GraphLink(source=aid, target=a.dest_ip, relation="TARGETS", is_malicious=True))

    return ThreatGraph(
        nodes=list(nodes_dict.values()),
        links=links
    )

@router.get("/node/{node_id}")
def get_node_details(node_id: str, request: Request):
    alerts = getattr(request.app.state, "alerts", [])
    matching_alerts = [a for a in alerts if a.source_ip == node_id or a.dest_ip == node_id]
    return {
        "id": node_id,
        "related_alerts_count": len(matching_alerts),
        "alerts": matching_alerts[:5],
        "threat_intel_status": "Flagged Malicious by ShadowPulse AI" if "198." in node_id or "203." in node_id or "evil" in node_id or "72a5" in node_id else "Internal Monitored Asset"
    }
