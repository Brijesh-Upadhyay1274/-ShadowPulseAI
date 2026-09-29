from fastapi import APIRouter, Request
from typing import List, Optional
from models.alerts import Alert

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[Alert])
def get_alerts(request: Request, severity: Optional[str] = None, engine: Optional[str] = None, limit: int = 50, offset: int = 0):
    alerts = request.app.state.alerts
    filtered = alerts
    if severity:
        filtered = [a for a in filtered if a.severity.lower() == severity.lower()]
    if engine:
        filtered = [a for a in filtered if a.engine.lower() == engine.lower()]
    return filtered[offset:offset+limit]

@router.get("/count")
def get_alerts_count(request: Request):
    return {"count": len(request.app.state.alerts)}

@router.get("/{alert_id}", response_model=Alert)
def get_alert(request: Request, alert_id: str):
    alerts = request.app.state.alerts
    for a in alerts:
        if a.id == alert_id:
            return a
    return None
