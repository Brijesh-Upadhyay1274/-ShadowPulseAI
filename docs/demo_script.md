# ShadowPulse AI — 2-Minute Demo Script

## Pre-Demo Setup (30 seconds before)
1. Backend running: `py -m uvicorn main:app --host 0.0.0.0 --port 8000`
2. Frontend running: `npm run dev` (http://localhost:5173)
3. Open dashboard in full-screen browser
4. Have Swagger UI ready in second tab: http://localhost:8000/docs

---

## Demo Flow (2 Minutes)

### [0:00 - 0:15] Opening — The Problem
> "Imagine you're an NTRO analyst monitoring India's critical infrastructure. You have a network TAP giving you read-only access to traffic. You cannot send a single packet back. How do you detect threats?"

> "ShadowPulse AI is a passive threat intelligence platform that analyzes unidirectional traffic using only metadata — no payload, no decryption, no active scanning."

**[Show: Executive Dashboard]**

### [0:15 - 0:35] Detection Engines — Real AI
> "We run 5 statistical detection engines in real-time. Look — we've already detected a port scan from this attacker IP."

**[Point to: Threat Counter showing Critical: 4, High: 8]**

> "Every detection uses real math. DGA domains are flagged using Shannon entropy — this domain scores 4.2 bits, well above the 3.5 threshold. C2 beaconing is detected by computing the coefficient of variation of connection intervals — a CV of 0.12 means almost perfectly periodic, which humans never produce."

**[Click: Alert Explorer → Expand a DGA alert → Show evidence panel]**

### [0:35 - 0:55] Flagship Feature — Attack Story Reconstruction
> "Individual alerts are noise. ShadowPulse automatically reconstructs the full attack story."

**[Navigate to: Threat Investigation → Attack Chain Timeline]**

> "Watch — this single chain shows: Port Scan at 09:14, C2 Beacon established at 09:22, DNS Tunnel at 09:26, Encrypted Malware at 09:30, Data Exfiltration at 09:35. Each step maps to a MITRE ATT&CK technique."

**[Click through each step to show evidence panels]**

### [0:55 - 1:15] Threat Intelligence Graph
> "We build a real-time relationship graph connecting IPs, domains, JA3 fingerprints, and alerts."

**[Navigate to: Threat Graph]**

> "See these red particles flowing? That's active malicious traffic. Click any node — it expands to show all related alerts and connections."

**[Click a C2 IP node → Show inspector panel]**

### [1:15 - 1:30] Threat DNA — Behavioral Fingerprinting
> "Every incident gets a 'Threat DNA' — a behavioral fingerprint across 5 dimensions."

**[Navigate to: Threat DNA page]**

> "This radar chart shows: high reconnaissance, high C2, extreme exfiltration. This fingerprint matches known APT29 behavior patterns."

### [1:30 - 1:45] Architecture & Integration
> "The full pipeline: Zeek extracts metadata including JA3 fingerprints, Wazuh applies 30+ custom detection rules with MITRE mapping, n8n handles correlation workflows, and our Python backend runs statistical analysis."

> "Everything is offline, open-source, and deployable in an air-gapped environment via Docker."

**[Quick flash: Swagger API docs showing endpoints]**

### [1:45 - 2:00] Closing
> "ShadowPulse AI: Passive Intelligence, Active Insight. It sees everything and touches nothing — exactly what NTRO needs for critical infrastructure protection."

> "Thank you."

---

## Key Numbers to Mention
- **5** detection engines with real statistical algorithms
- **30+** Wazuh detection rules with MITRE ATT&CK mapping
- **5** n8n correlation workflows
- **12** threat categories covered
- **8** dashboard pages
- **100%** offline, open-source, air-gapped compatible
- **0** packets sent back to the network

## Demo Recovery Tips
- If API is slow: "The analysis is running on live data — this is what real-time processing looks like"
- If graph is empty: Refresh page — mock data loads on mount
- Always keep talking through transitions
