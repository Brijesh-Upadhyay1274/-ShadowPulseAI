from pydantic import BaseModel
from typing import List

class DetectionStats(BaseModel):
    engine: str
    total_detections: int
    critical: int
    high: int
    medium: int
    low: int
    false_positive_rate: float

class ProtocolDistribution(BaseModel):
    protocol: str
    count: int
    percentage: float

class TimeSeriesPoint(BaseModel):
    timestamp: float
    value: float
    label: str

class HeatmapCell(BaseModel):
    x: str
    y: str
    value: float
