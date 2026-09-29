from fastapi import APIRouter, Request
from typing import List
from models.alerts import TimelineEvent
from models.threats import AttackChain

router = APIRouter(prefix="/api/timeline", tags=["Timeline"])

@router.get("", response_model=List[TimelineEvent])
def get_timeline(request: Request):
    alerts = request.app.state.alerts
    events = []
    for a in alerts:
        events.append(TimelineEvent(
            timestamp=a.timestamp,
            title=a.alert_type,
            description=a.description,
            severity=a.severity,
            alert_type=a.alert_type,
            source_ip=a.source_ip,
            dest_ip=a.dest_ip
        ))
    return sorted(events, key=lambda x: x.timestamp)

@router.get("/attack-chains", response_model=List[AttackChain])
def get_attack_chains(request: Request):
    return request.app.state.chains

@router.get("/attack-chains/{chain_id}", response_model=AttackChain)
def get_attack_chain(request: Request, chain_id: str):
    for c in request.app.state.chains:
        if c.id == chain_id:
            return c
    return None
