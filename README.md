<div align="center">

# 🛡️ ShadowPulse AI

### *Passive Intelligence. Active Insight.*

**AI-Based Detection of Cyber Threats in Unidirectional IP Traffic**

[![SIH 2026](https://img.shields.io/badge/SIH_2026-Problem_26145-blue?style=for-the-badge)](https://sih.gov.in)
[![NTRO](https://img.shields.io/badge/NTRO-Cyber_Security-darkblue?style=for-the-badge)](https://ntro.gov.in)
[![Python](https://img.shields.io/badge/Python-3.14-green?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)

</div>

---

## 📋 Problem Statement

**PS ID:** 26145 | **Organization:** NTRO (National Technical Research Organisation)  
**Category:** Software | **Theme:** Smart Automation

> Design an AI-powered passive threat intelligence platform that analyzes **one-way (read-only) network traffic** and detects cyber threats in near real-time using only metadata — without ever sending packets back to the production network.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  PCAP / Network TAP                      │
│              (Unidirectional Traffic Feed)                │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      Zeek IDS                            │
│         conn.log │ dns.log │ ssl.log (JA3/JA3S)         │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Wazuh SIEM                            │
│          Custom Rules │ Decoders │ MITRE Mapping         │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│               n8n Workflow Automation                    │
│     Threat Correlation │ Attack Chain │ Notifications    │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Detection Backend                    │
│  ┌───────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ │
│  │   Recon   │ │ C2 Beacon│ │ DNS Abuse │ │ Encrypted│ │
│  │  Engine   │ │  Engine  │ │  Engine   │ │  Engine  │ │
│  └───────────┘ └──────────┘ └───────────┘ └──────────┘ │
│  ┌───────────┐ ┌──────────────────────────────────────┐ │
│  │  Exfil    │ │  Threat Correlation & Confidence     │ │
│  │  Engine   │ │  Attack Chains │ Threat DNA │ Scorer │ │
│  └───────────┘ └──────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│           React Executive Dashboard                      │
│   8 Pages │ Threat Graph │ Attack Replay │ Analytics    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Detection Engines

| Engine | Threats Detected | Algorithm | MITRE ATT&CK |
|--------|-----------------|-----------|---------------|
| **Reconnaissance** | Port scans, host sweeps, brute force | Z-score anomaly detection, fan-out ratio | T1046, T1110, T1595 |
| **C2 Beaconing** | Periodic callbacks, abnormal outbound | Coefficient of variation (IAT), periodicity | T1071, T1573 |
| **DNS Abuse** | DGA domains, tunneling, floods | Shannon entropy, n-gram analysis | T1568.002, T1572 |
| **Encrypted Traffic** | Malware TLS, JA3 anomalies | JA3/JA3S fingerprint matching | T1573.002, T1090 |
| **Exfiltration** | Data theft, slow exfil, rare destinations | IQR outlier detection, asymmetric ratio | T1041, T1048 |

---

## ✨ Key Features

### 🔗 Attack Story Reconstruction
Automatically chains individual alerts into full attack narratives following the MITRE ATT&CK kill chain.

### 🧬 Threat DNA
Behavioral fingerprinting per incident across 5 dimensions — visualized as radar charts.

### 🎯 AI Confidence Engine
Every alert includes: confidence score, supporting evidence, why flagged, related events, MITRE mapping.

### 🕸️ Threat Intelligence Graph
Interactive force-directed graph connecting IPs, domains, JA3 fingerprints, and alerts with animated particle flow.

### ⏪ Replay Mode
Time-scrubbing attack playback with Play/Pause/Speed controls — like CCTV for your network.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+ (`py` command)
- Node.js 20+ (`node` command)
- npm 10+

### Backend Setup
```bash
cd backend
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- **Dashboard:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs
- **API Health:** http://localhost:8000/api/health

### Docker Deployment (Linux)
```bash
docker compose up -d
```

---

## 📁 Project Structure

```
SIH26145/
├── backend/                    # FastAPI Python Backend
│   ├── main.py                 # Application entry point
│   ├── engines/                # 5 Detection engines
│   ├── correlation/            # Attack chain + Threat DNA
│   ├── parsers/                # Zeek log parsers
│   ├── api/                    # REST API routes
│   ├── models/                 # Pydantic data models
│   └── data/                   # Sample Zeek logs
├── frontend/                   # React + Tailwind Dashboard
│   └── src/
│       ├── pages/              # 8 Dashboard pages
│       ├── components/         # Reusable UI components
│       └── api/                # API client + mock data
├── wazuh/                      # Wazuh SIEM Configuration
│   ├── rules/                  # 30+ custom detection rules
│   ├── decoders/               # Zeek log decoders
│   └── sample_alerts/          # Example alert outputs
├── n8n/                        # 5 n8n Workflow JSONs
├── zeek/                       # Zeek IDS configuration
├── docs/                       # Documentation
├── docker-compose.yml          # Container orchestration
└── README.md
```

---

## 🖥️ Dashboard Pages

| Page | Description |
|------|-------------|
| **Executive Dashboard** | KPI counters, severity distribution, attack heatmap, traffic trends |
| **Threat Timeline** | Chronological event stream with severity filtering |
| **Threat Investigation** | Deep-dive analysis with evidence chains and MITRE mapping |
| **Threat Intelligence Graph** | Interactive force-directed graph of all threat relationships |
| **Replay Mode** | Time-scrubbing attack playback with speed controls |
| **Threat DNA** | Behavioral radar charts for incident fingerprinting |
| **Alert Explorer** | Sortable/filterable table of all detection alerts |
| **Detection Analytics** | Per-engine statistics, JA3 analytics, DNS analytics |

---

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Traffic Analysis | **Zeek** | Passive metadata extraction from network traffic |
| SIEM | **Wazuh** | Custom rules, decoders, alert generation |
| Automation | **n8n** | Workflow-based threat correlation |
| Backend | **FastAPI** (Python) | Detection engines, API endpoints |
| Frontend | **React** + **Tailwind CSS** | Executive SOC dashboard |
| Visualization | **Chart.js** + **react-force-graph** | Charts, graphs, heatmaps |
| Deployment | **Docker** | Container orchestration |

---

## 👥 Team

**SIH 2026 Grand Finale** | Problem Statement 26145 | NTRO

---

## 📜 License

This project is developed for the Smart India Hackathon 2026 under Problem Statement ID 26145 by NTRO.

---

<div align="center">

**ShadowPulse AI** — *Because the best defense sees everything and touches nothing.*

</div>
