import React from 'react';
import { 
  X, ShieldAlert, Cpu, Database, Terminal, GitBranch, 
  CheckCircle2, Zap, Download 
} from 'lucide-react';

export interface ThreatExplanationData {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  mitreId: string;
  mitreTactic: string;
  mitreTechnique: string;
  // 1. Why detected?
  whyDetected: string;
  // 2. Which metadata triggered it?
  metadataTrigger: {
    key: string;
    value: string;
    threshold: string;
    deviation: string;
  }[];
  // 3. Which Zeek logs support it?
  zeekLogType: 'conn.log' | 'dns.log' | 'ssl.log';
  zeekRawRecord: string;
  // 4. Which Wazuh rule fired?
  wazuhRuleId: string;
  wazuhRuleLevel: number;
  wazuhRuleDescription: string;
  // 5. Which n8n workflow processed it?
  n8nWorkflowName: string;
  n8nActionTaken: string;
  // 6. Confidence score calculation
  confidenceFactors: {
    factor: string;
    weight: string;
    score: number;
  }[];
}

export const SAMPLE_EXPLANATIONS: Record<string, ThreatExplanationData> = {
  'c2-beacon': {
    id: 'INC-C2-8443',
    title: 'Deterministic C2 Beaconing to Suspicious Foreign ASN',
    category: 'Command and Control',
    severity: 'critical',
    confidence: 94,
    mitreId: 'T1071.001',
    mitreTactic: 'Command and Control',
    mitreTechnique: 'Application Layer Protocol: Web Protocols',
    whyDetected: 'Inter-Arrival Time (IAT) analysis revealed periodic connection check-ins with an extremely low Coefficient of Variation (CV = 0.12). Human network browsing exhibits CV > 1.0; CV < 0.30 indicates automated botnet heartbeat activity.',
    metadataTrigger: [
      { key: 'Inter-Arrival Variance (CV)', value: '0.12', threshold: '< 0.30', deviation: '-76% variance from normal' },
      { key: 'Beacon Interval Mean', value: '59.8 sec', threshold: 'Regular 60s ±2s', deviation: 'Strict periodicity' },
      { key: 'Target Port', value: '8443/TCP', threshold: 'Non-standard TLS', deviation: 'Unapproved egress' },
      { key: 'Destination ASN', value: 'AS9009 Bulletproof', threshold: 'Untrusted ASN', deviation: 'Classified IOC match' }
    ],
    zeekLogType: 'conn.log',
    zeekRawRecord: '1727510400.124\tC1001xyz\t10.0.1.50\t44300\t198.51.100.44\t8443\ttcp\tssl\t2.100\t256\t512\tSF\tT\tF\t0\tShADadFf\t8\t640\t6\t480\t-',
    wazuhRuleId: '100520',
    wazuhRuleLevel: 10,
    wazuhRuleDescription: 'ShadowPulse C2: Periodic beaconing suspected — 10.0.1.50 → 198.51.100.44:8443 (20+ regular connections in 20 min)',
    n8nWorkflowName: 'ShadowPulse — C2 Beaconing Detection → Increase Confidence',
    n8nActionTaken: 'Escalated incident severity to P1-CRITICAL, tagged source asset for active containment, generated Threat DNA vector.',
    confidenceFactors: [
      { factor: 'Statistical IAT Regularity (CV < 0.2)', weight: '30%', score: 98 },
      { factor: 'Destination Reputation (Classified C2 ASN)', weight: '20%', score: 95 },
      { factor: 'Temporal Correlation with Prior Scan', weight: '20%', score: 90 },
      { factor: 'MITRE ATT&CK T1071 Signature Match', weight: '15%', score: 95 },
      { factor: 'Cross-Engine TLS Fingerprint Match', weight: '15%', score: 92 }
    ]
  },
  'dns-tunnel': {
    id: 'INC-DNS-TUNNEL',
    title: 'DNS Tunneling & Base64 Data Exfiltration',
    category: 'Exfiltration',
    severity: 'critical',
    confidence: 95,
    mitreId: 'T1572',
    mitreTactic: 'Command and Control / Exfiltration',
    mitreTechnique: 'Protocol Tunneling: DNS Tunneling',
    whyDetected: 'DNS TXT queries exhibited abnormally high Shannon Entropy (4.22 bits, English baseline is ~3.2 bits) and length > 64 chars, containing Base64 encoded reconnaissance dumps.',
    metadataTrigger: [
      { key: 'Domain Shannon Entropy', value: '4.22 bits', threshold: '> 3.50 bits', deviation: '+31% randomness' },
      { key: 'Subdomain Length', value: '78 chars', threshold: '> 50 chars', deviation: 'Exceeds standard FQDN' },
      { key: 'DNS Record Type', value: 'TXT (Type 16)', threshold: 'Non-cached TXT', deviation: 'Tunnel signature' }
    ],
    zeekLogType: 'dns.log',
    zeekRawRecord: '1727510500.442\tD2001xyz\t10.0.1.50\t53124\t8.8.8.8\t53\tudp\t18402\t0.021\taGVsbG8gd29ybGQgZnJvbSBzaGFkb3dwdWxzZQ.tunnel.evil.com\t1\tC_INTERNET\t16\tTXT\t0\tNOERROR\tF\tF\tT\tT\t0\t-',
    wazuhRuleId: '100530',
    wazuhRuleLevel: 10,
    wazuhRuleDescription: 'ShadowPulse TUNNEL: Abnormally long DNS query detected from 10.0.1.50',
    n8nWorkflowName: 'ShadowPulse — DNS Tunnel + JA3 Match → Merge Attack Chain',
    n8nActionTaken: 'Correlated DNS abuse with Cobalt Strike JA3 session from 10.0.1.50 and automatically merged into unified Attack Story.',
    confidenceFactors: [
      { factor: 'Shannon Entropy Threshold (H > 4.0)', weight: '35%', score: 99 },
      { factor: 'Payload Length & Base64 Grammar', weight: '25%', score: 96 },
      { factor: 'Unusual Query Frequency to Single Domain', weight: '20%', score: 92 },
      { factor: 'MITRE ATT&CK T1572 Pattern Match', weight: '20%', score: 94 }
    ]
  },
  'ja3-anomaly': {
    id: 'INC-TLS-JA3',
    title: 'Cobalt Strike TLS Client Hello Signature Match',
    category: 'Encrypted Malware',
    severity: 'critical',
    confidence: 98,
    mitreId: 'T1573.002',
    mitreTactic: 'Defense Evasion / Command and Control',
    mitreTechnique: 'Encrypted Channel: Asymmetric Cryptography',
    whyDetected: 'Passive TLS Client Hello fingerprint extracted from unidirectionally captured ssl.log matched known Cobalt Strike malleability profile JA3 hash.',
    metadataTrigger: [
      { key: 'JA3 Fingerprint Hash', value: '72a589da586844d7f0818ce684948eea', threshold: 'Known Malware Hash', deviation: '100% Binary Match' },
      { key: 'SNI vs Certificate Match', value: 'MISMATCH (F)', threshold: 'Valid (T)', deviation: 'Spoofed SNI header' },
      { key: 'TLS Cipher Suites', value: 'TLS_RSA_WITH_RC4_128_SHA', threshold: 'TLS 1.3 Recommended', deviation: 'Deprecated weak cipher' }
    ],
    zeekLogType: 'ssl.log',
    zeekRawRecord: '1727510600.891\tS3001xyz\t10.0.1.50\t44301\t198.51.100.44\t8443\tTLSv12\tTLS_RSA_WITH_AES_128_CBC_SHA\tc2.malware.xyz\t-\t-\t-\tT\t-\t72a589da586844d7f0818ce684948eea\t-',
    wazuhRuleId: '100540',
    wazuhRuleLevel: 10,
    wazuhRuleDescription: 'ShadowPulse TLS: Known malicious JA3 fingerprint detected — Cobalt Strike (72a589da...)',
    n8nWorkflowName: 'ShadowPulse — High Confidence Alert → Notify SOC & Contain',
    n8nActionTaken: 'Pushed IOC to sovereign threat database and broadcast alert to SOC command bridge.',
    confidenceFactors: [
      { factor: 'Exact JA3 Hash Database Match', weight: '40%', score: 100 },
      { factor: 'SNI Mismatch Validation', weight: '25%', score: 95 },
      { factor: 'Association with C2 Endpoint', weight: '20%', score: 98 },
      { factor: 'MITRE ATT&CK T1573 Signature', weight: '15%', score: 96 }
    ]
  },
  'port-scan': {
    id: 'INC-SCAN-RECON',
    title: 'High-Density TCP Port Sweep & Service Discovery',
    category: 'Reconnaissance',
    severity: 'high',
    confidence: 89,
    mitreId: 'T1046',
    mitreTactic: 'Reconnaissance / Discovery',
    mitreTechnique: 'Network Service Scanning',
    whyDetected: 'Source host generated over 60 connection attempts across 220 unique destination ports in under 60 seconds with predominantly REJ/RST flags.',
    metadataTrigger: [
      { key: 'Fan-Out Ratio', value: '68 ports / min', threshold: '> 20 ports / min', deviation: '+240% scan rate' },
      { key: 'TCP Connection States', value: '94% REJ / S0', threshold: '< 10% REJ', deviation: 'Probing signatures' },
      { key: 'Z-Score Deviation', value: '4.8 σ', threshold: '> 2.0 σ', deviation: 'Extreme anomaly' }
    ],
    zeekLogType: 'conn.log',
    zeekRawRecord: '1727510300.012\tC0001xyz\t192.168.1.100\t51234\t10.0.0.5\t22\ttcp\t-\t0.001\t0\t0\tREJ\tT\tT\t0\tSr\t1\t40\t1\t40\t-',
    wazuhRuleId: '100500',
    wazuhRuleLevel: 7,
    wazuhRuleDescription: 'ShadowPulse SCAN: Horizontal port scan detected from 192.168.1.100 (68 ports in 60s)',
    n8nWorkflowName: 'ShadowPulse — Statistical Engine Alert Normalization',
    n8nActionTaken: 'Tagged origin IP for behavioral tracking and added to temporal scan matrix.',
    confidenceFactors: [
      { factor: 'Z-Score Anomaly Deviation (4.8σ)', weight: '35%', score: 95 },
      { factor: 'Fan-Out Ratio Density', weight: '30%', score: 92 },
      { factor: 'Connection State Rejection Rate', weight: '20%', score: 88 },
      { factor: 'MITRE ATT&CK T1046 Match', weight: '15%', score: 85 }
    ]
  },
  'exfiltration': {
    id: 'INC-EXFIL-ASYMM',
    title: 'Asymmetric Outbound Bulk Data Egress',
    category: 'Exfiltration',
    severity: 'critical',
    confidence: 96,
    mitreId: 'T1048',
    mitreTactic: 'Exfiltration',
    mitreTechnique: 'Exfiltration Over Alternative Protocol',
    whyDetected: 'Host transmitted 52.4MB of outbound data with an extreme upload-to-download asymmetry ratio (43.2x), flagged by the passive IQR outlier engine.',
    metadataTrigger: [
      { key: 'Outbound Byte Volume', value: '52,428,800 B', threshold: '> 10,000,000 B', deviation: '+424% above baseline' },
      { key: 'Asymmetric Ratio', value: '43.2 : 1', threshold: '> 5.0 : 1', deviation: 'Heavy egress dominance' },
      { key: 'Destination ASN', value: 'AS13335 Cloudflare', threshold: 'External Drop', deviation: 'Unapproved proxy drop' }
    ],
    zeekLogType: 'conn.log',
    zeekRawRecord: '1727510700.551\tC4001xyz\t10.0.1.50\t49152\t203.0.113.66\t443\ttcp\tssl\t45.200\t52428800\t1214000\tSF\tT\tF\t0\tShADadFf\t36200\t52800000\t18400\t1280000\t-',
    wazuhRuleId: '100550',
    wazuhRuleLevel: 10,
    wazuhRuleDescription: 'ShadowPulse EXFIL: Large outbound transfer detected — 52428800 bytes from 10.0.1.50 → 203.0.113.66:443',
    n8nWorkflowName: 'ShadowPulse — Data Exfiltration → Executive Notification',
    n8nActionTaken: 'Executed P1 executive broadcast notification, isolated workstation from internal routing VLAN.',
    confidenceFactors: [
      { factor: 'IQR Statistical Byte Outlier (Z > 8.0)', weight: '35%', score: 98 },
      { factor: 'Asymmetric Flow Directional Ratio', weight: '25%', score: 95 },
      { factor: 'Off-Hours Egress Time Window', weight: '20%', score: 88 },
      { factor: 'MITRE ATT&CK T1048 Match', weight: '20%', score: 90 }
    ]
  }
};

export interface ExplainabilityPanelProps {
  threat?: ThreatExplanationData | null;
  data?: ThreatExplanationData | null;
  onClose: () => void;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({ 
  threat, 
  data, 
  onClose 
}) => {
  const activeData = threat || data;
  if (!activeData) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#060913]/98 border-l border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col font-mono text-xs text-gray-300 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#0B1020]/90">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
            <ShieldAlert size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                AI EXPLAINABILITY ENGINE
              </span>
              <span className="text-gray-500">{activeData.id}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{activeData.title}</h3>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body: 6 Core Explainability Pillars */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 1. Why Was This Threat Detected? */}
        <div className="glass-card p-4 rounded-xl border border-cyan-500/20 bg-[#0B1020]/80">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2 uppercase tracking-wider">
            <Cpu size={16} /> 1. Detection Rationale & Mathematical Formulations
          </div>
          <p className="text-gray-200 text-xs leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
            {activeData.whyDetected}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>MITRE ATT&CK Technique:</span>
            <span className="text-yellow-400 font-bold">{activeData.mitreId} ({activeData.mitreTechnique})</span>
          </div>
        </div>

        {/* 2. Which Metadata Triggered It? */}
        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3 uppercase tracking-wider">
            <Database size={16} /> 2. Unidirectional Metadata Telemetry
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="text-gray-500 uppercase border-b border-white/10">
                <tr>
                  <th className="pb-2">Metric Feature</th>
                  <th className="pb-2">Observed Value</th>
                  <th className="pb-2">Baseline Threshold</th>
                  <th className="pb-2">Anomaly Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeData.metadataTrigger.map((m, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-white font-medium">{m.key}</td>
                    <td className="py-2 text-red-400 font-bold">{m.value}</td>
                    <td className="py-2 text-gray-400">{m.threshold}</td>
                    <td className="py-2 text-cyan-300">{m.deviation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Which Zeek Log Record Supports It? */}
        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
              <Terminal size={16} /> 3. Zeek Passive Log Evidence ({activeData.zeekLogType})
            </div>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
              RX TAP PROOF
            </span>
          </div>
          <div className="bg-[#030712] p-3 rounded-lg border border-white/10 overflow-x-auto">
            <pre className="text-[11px] text-emerald-400 select-all font-mono leading-relaxed">
              {activeData.zeekRawRecord}
            </pre>
          </div>
        </div>

        {/* 4. Which Wazuh Rule Fired? */}
        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
              <ShieldAlert size={16} /> 4. Wazuh SIEM Rule Correlation
            </div>
            <span className="text-red-400 font-bold bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40 text-[10px]">
              RULE LEVEL {activeData.wazuhRuleLevel}
            </span>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Rule ID:</span>
              <span className="text-cyan-300 font-bold">{activeData.wazuhRuleId}</span>
            </div>
            <div className="text-xs text-gray-200">
              {activeData.wazuhRuleDescription}
            </div>
          </div>
        </div>

        {/* 5. Which n8n Workflow Handled It? */}
        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-2 uppercase tracking-wider">
            <GitBranch size={16} /> 5. n8n Automation & Threat Correlation Workflow
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-2">
            <div className="text-white font-semibold text-xs">{activeData.n8nWorkflowName}</div>
            <div className="flex items-start gap-2 text-[11px] text-gray-300">
              <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
              <span>{activeData.n8nActionTaken}</span>
            </div>
          </div>
        </div>

        {/* 6. How Was Confidence Calculated? */}
        <div className="glass-card p-4 rounded-xl border border-cyan-500/30 bg-[#0B1020]/90">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
              <Zap size={16} /> 6. Confidence Score Mathematical Breakdown
            </div>
            <div className="text-base font-bold text-cyan-400 text-glow-cyan">
              {activeData.confidence}% TOTAL CONFIDENCE
            </div>
          </div>
          <div className="space-y-2.5">
            {activeData.confidenceFactors.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300">{f.factor} ({f.weight} weight)</span>
                  <span className="text-cyan-300 font-bold">{f.score}%</span>
                </div>
                <div className="w-full bg-[#030712] h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-400" style={{ width: `${f.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Tactical Containment Controls */}
      <div className="p-4 border-t border-cyan-500/20 bg-[#0B1020] flex items-center justify-between gap-3">
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition flex items-center gap-2">
          <Download size={14} /> Export Forensic Dossier (PDF/JSON)
        </button>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition flex items-center gap-2 shadow-[0_0_15px_rgba(255,59,48,0.4)]">
          <Zap size={14} /> Execute SOAR Containment Trigger
        </button>
      </div>
    </div>
  );
};

export default ExplainabilityPanel;
