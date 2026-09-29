from fastapi import APIRouter, Request
from typing import List, Optional
from models.alerts import TimelineEvent

router = APIRouter(prefix="/api/replay", tags=["Replay"])

@router.get("/events", response_model=List[TimelineEvent])
def get_replay_events(request: Request, start_time: Optional[float] = None, end_time: Optional[float] = None):
    alerts = request.app.state.alerts
    events = []
    for a in alerts:
        if start_time and a.timestamp < start_time: continue
        if end_time and a.timestamp > end_time: continue
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

@router.get("/markers")
def get_replay_markers(request: Request):
    alerts = request.app.state.alerts
    return [a.timestamp for a in alerts if a.severity in ["High", "Critical"]]
