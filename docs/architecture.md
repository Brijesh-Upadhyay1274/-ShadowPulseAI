# ShadowPulse AI — Architecture Documentation

## System Overview

ShadowPulse AI is a passive threat intelligence platform designed for NTRO's unidirectional IP traffic analysis requirement. The system operates in a completely offline, read-only mode — it receives network metadata through a network TAP or data diode and never sends packets back to the production network.

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION NETWORK                            │
│  [Critical Infrastructure: Power Grid, Defense, Nuclear]        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Fiber TAP / Data Diode
                           │ (Unidirectional — read only)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                LAYER 1: DATA INGESTION                           │
│                                                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │              Zeek Network Analyzer            │               │
│  │  • Passive packet analysis (no responses)     │               │
│  │  • Generates: conn.log, dns.log, ssl.log      │               │
│  │  • JA3/JA3S fingerprint extraction            │               │
│  │  • Protocol identification                    │               │
│  │  • File hash extraction                       │               │
│  └────────────────────┬─────────────────────────┘               │
│                       │ TSV/JSON logs                            │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────┐               │
│  │              Wazuh SIEM Engine                │               │
│  │  • Custom decoders parse Zeek log format      │               │
│  │  • 30+ detection rules with thresholds        │               │
│  │  • MITRE ATT&CK technique mapping             │               │
│  │  • Composite rules for attack correlation     │               │
│  │  • Alert generation with severity levels      │               │
│  └────────────────────┬─────────────────────────┘               │
│                       │ Structured alerts                        │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────┐               │
│  │          n8n Workflow Automation              │               │
│  │  • Port Scan → Create Incident                │               │
│  │  • Beaconing → Confidence Escalation          │               │
│  │  • DNS + JA3 → Merge Attack Chain             │               │
│  │  • Exfiltration → Executive Notification      │               │
│  │  • Multi-Alert → Threat DNA Generation        │               │
│  └────────────────────┬─────────────────────────┘               │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                LAYER 2: ANALYSIS ENGINE                           │
│                                                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │          FastAPI Backend (Python)             │               │
│  │                                               │               │
│  │  ┌─────────────┐  ┌─────────────┐            │               │
│  │  │ Zeek Parser  │  │ Normalizer  │            │               │
│  │  │ (TSV → Dict) │  │ (Unified)   │            │               │
│  │  └──────┬───────┘  └──────┬──────┘            │               │
│  │         └────────┬────────┘                    │               │
│  │                  ▼                             │               │
│  │  ┌─────────────────────────────────────────┐  │               │
│  │  │      5 Statistical Detection Engines     │  │               │
│  │  │                                          │  │               │
│  │  │  ┌───────────────┐  ┌───────────────┐   │  │               │
│  │  │  │ Reconnaissance│  │ C2 Beaconing  │   │  │               │
│  │  │  │ • Z-score     │  │ • CV analysis │   │  │               │
│  │  │  │ • Fan-out     │  │ • IAT jitter  │   │  │               │
│  │  │  └───────────────┘  └───────────────┘   │  │               │
│  │  │  ┌───────────────┐  ┌───────────────┐   │  │               │
│  │  │  │  DNS Abuse    │  │  Encrypted    │   │  │               │
│  │  │  │ • Entropy     │  │ • JA3 match   │   │  │               │
│  │  │  │ • N-gram      │  │ • Cipher check│   │  │               │
│  │  │  └───────────────┘  └───────────────┘   │  │               │
│  │  │  ┌───────────────┐                      │  │               │
│  │  │  │ Exfiltration  │                      │  │               │
│  │  │  │ • IQR outlier │                      │  │               │
│  │  │  │ • Asymmetric  │                      │  │               │
│  │  │  └───────────────┘                      │  │               │
│  │  └──────────────┬──────────────────────────┘  │               │
│  │                 ▼                              │               │
│  │  ┌─────────────────────────────────────────┐  │               │
│  │  │      Threat Correlation Layer            │  │               │
│  │  │                                          │  │               │
│  │  │  ┌─────────────┐  ┌─────────────────┐   │  │               │
│  │  │  │Attack Chain  │  │ Threat DNA      │   │  │               │
│  │  │  │Reconstruction│  │ Fingerprinting  │   │  │               │
│  │  │  └─────────────┘  └─────────────────┘   │  │               │
│  │  │  ┌─────────────────────────────────────┐│  │               │
│  │  │  │  AI Confidence Engine                ││  │               │
│  │  │  │  6-factor weighted scoring           ││  │               │
│  │  │  └─────────────────────────────────────┘│  │               │
│  │  └──────────────┬──────────────────────────┘  │               │
│  │                 ▼                              │               │
│  │  REST API: /api/dashboard, /api/alerts,       │               │
│  │            /api/graph, /api/timeline,          │               │
│  │            /api/replay, /api/analytics         │               │
│  └──────────────────────────────────────────────┘               │
└───────────────────────┼─────────────────────────────────────────┘
                        │ JSON API
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                LAYER 3: PRESENTATION                             │
│                                                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │       React Executive Dashboard               │               │
│  │                                               │               │
│  │  Pages:                                       │               │
│  │  1. Executive Dashboard (KPIs, heatmap)       │               │
│  │  2. Threat Timeline (event stream)            │               │
│  │  3. Threat Investigation (evidence chains)    │               │
│  │  4. Threat Intelligence Graph (force graph)   │               │
│  │  5. Replay Mode (time scrubbing)              │               │
│  │  6. Threat DNA (radar charts)                 │               │
│  │  7. Alert Explorer (data table)               │               │
│  │  8. Detection Analytics (statistics)          │               │
│  │                                               │               │
│  │  Technology: React 19 + Tailwind CSS          │               │
│  │  Charts: Chart.js + react-force-graph-2d      │               │
│  │  Theme: Navy/Cyan SOC Glassmorphism           │               │
│  └──────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## Detection Algorithm Details

### 1. Shannon Entropy (DGA Detection)
```
H(X) = -Σ p(xᵢ) × log₂(p(xᵢ))

Where p(xᵢ) = frequency of character xᵢ / total characters

Thresholds:
  English text: H ≈ 3.0 - 3.5 bits
  DGA domain:   H > 3.5 bits (flagged)
  Random string: H ≈ 4.0 - 4.7 bits (high confidence)
```

### 2. Coefficient of Variation (C2 Beaconing)
```
CV = σ(intervals) / μ(intervals)

Where:
  intervals = time gaps between consecutive connections (same src-dst pair)
  σ = standard deviation
  μ = mean

Thresholds:
  CV < 0.1: Almost perfect periodicity (very high confidence)
  CV < 0.3: Strong beaconing (high confidence)
  CV < 0.5: Possible beaconing (medium confidence)
  CV > 1.0: Normal human behavior
```

### 3. Z-Score Anomaly (Reconnaissance)
```
z = (x - μ) / σ

Where:
  x = observed connection count from source IP
  μ = mean connection count across all IPs
  σ = standard deviation

Thresholds:
  |z| > 3: Strong anomaly
  |z| > 2: Moderate anomaly
```

### 4. IQR Outlier Detection (Exfiltration)
```
Q1 = 25th percentile of outbound byte volumes
Q3 = 75th percentile
IQR = Q3 - Q1

Outlier if: value > Q3 + 1.5 × IQR
```

### 5. Multi-Factor Confidence Score
```
C = Σ(wᵢ × eᵢ) / Σ(wᵢ)

Factors (wᵢ):
  Statistical deviation:    0.30
  Temporal correlation:     0.20
  MITRE technique match:    0.15
  Destination reputation:   0.15
  Pattern repetition:       0.10
  Cross-engine correlation: 0.10
```

## Security Considerations

1. **No outbound capability**: System has no route back to production network
2. **Air-gapped deployment**: All components run offline, no external dependencies
3. **Data retention**: Logs are stored locally with configurable rotation
4. **Access control**: Dashboard behind authentication in production
5. **Audit logging**: All analyst actions are logged for compliance
