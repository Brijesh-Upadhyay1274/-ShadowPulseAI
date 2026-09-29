# ShadowPulse AI — SIH 2026 Presentation (5 Slides)

---

## Slide 1: The Problem

### 🔴 Critical Infrastructure is Blind

**NTRO Problem:** Detect cyber threats in **unidirectional IP traffic** — where you can only observe, never interact.

**Why it matters:**
- India's critical infrastructure (power grids, defense networks, nuclear facilities) uses air-gapped networks
- Traffic monitoring is **read-only** — no packets can be sent back
- Existing security tools (Splunk, QRadar) are **bidirectional** — they don't work here
- Nation-state APTs specifically target these networks knowing monitoring is limited

**Challenge:** Build an AI-powered threat detection system that works with **metadata only**, operates **completely offline**, and **never touches the production network**.

---

## Slide 2: Our Solution — ShadowPulse AI

### 🛡️ Passive Intelligence. Active Insight.

**What is ShadowPulse AI?**
An AI-powered passive threat intelligence platform that detects cyber threats using only network metadata from unidirectional traffic.

**5 Statistical Detection Engines:**
| Engine | Algorithm | Threats |
|--------|-----------|---------|
| Reconnaissance | Z-score anomaly | Port scans, brute force |
| C2 Beaconing | Coefficient of variation | Command & control callbacks |
| DNS Abuse | Shannon entropy | DGA domains, tunneling |
| Encrypted Traffic | JA3 fingerprinting | Malware over TLS |
| Exfiltration | IQR outlier detection | Data theft |

**Key Principle:** Zero payload decryption. Zero packets sent back. 100% metadata analysis.

---

## Slide 3: What Makes Us Different

### ⚡ Innovation Highlights

**1. Attack Story Reconstruction** *(Flagship)*
> Automatically chains isolated alerts into full attack narratives following MITRE ATT&CK kill chain.
> Reconnaissance → C2 Beacon → DNS Tunnel → Encrypted Malware → Exfiltration

**2. Threat DNA**
> Every incident gets a behavioral fingerprint — a 5-axis radar chart showing attack characteristics. Compare against known APT profiles.

**3. AI Confidence Engine**
> Every alert shows: confidence %, mathematical evidence, why flagged, related events. Fully **explainable AI** — critical for national security decisions.

**4. Threat Intelligence Graph**
> Interactive force-directed graph connecting IPs, domains, JA3 fingerprints with animated malicious traffic flow.

---

## Slide 4: Architecture & Tech Stack

### 🏗️ Production-Grade Pipeline

```
Network TAP (Read-Only) → Zeek (Metadata Extraction) → Wazuh (30+ Custom Rules)
    → n8n (5 Correlation Workflows) → FastAPI (5 Detection Engines)
    → React Dashboard (8 Pages, SOC-Grade UI)
```

**100% Open Source Stack:**
- **Zeek** — Network traffic analysis with JA3/JA3S fingerprinting
- **Wazuh** — SIEM with MITRE ATT&CK mapped custom rules
- **n8n** — Automated threat correlation workflows
- **FastAPI** — Python backend with real statistical algorithms
- **React + Tailwind** — Government-grade executive dashboard
- **Docker** — Air-gapped deployment ready

**Key Metric:** 12 threat categories covered, 30+ detection rules, 8 dashboard pages.

---

## Slide 5: Impact & Deployment

### 🇮🇳 Deployable for National Security

**Real-World Deployment:**
- Install behind a fiber TAP or data diode
- Single rack-mounted server in air-gapped facility
- Zero cloud dependencies, zero external APIs
- Operational in < 1 hour with Docker

**Impact:**
- Protects critical infrastructure from APT attacks
- Provides SOC analysts with explainable threat intelligence
- Reduces mean-time-to-detect from hours to minutes
- Enables executive-level threat reporting via Threat DNA

**Future Roadmap:**
- STIX/TAXII threat intelligence sharing
- ML-based JA3 clustering for zero-day malware families
- Geolocation attack visualization

> *"ShadowPulse AI sees everything and touches nothing — exactly what India's critical infrastructure needs."*

---

## Slide Design Notes
- **Background:** Deep navy (#0B1120)
- **Accents:** Cyan (#06B6D4) for highlights, Red (#EF4444) for threats
- **Font:** Inter for body, JetBrains Mono for technical content
- **Logo:** ShadowPulse AI shield icon with pulse line
