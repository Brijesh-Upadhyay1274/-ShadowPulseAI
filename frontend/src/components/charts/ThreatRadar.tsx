import React from 'react';
import { Radar } from 'react-chartjs-2';

interface ThreatRadarProps {
  dna?: { recon?: number; c2?: number; dns?: number; encrypted?: number; exfil?: number };
  coverage?: { recon?: number; c2?: number; dns?: number; encrypted?: number; exfil?: number };
}

const ThreatRadar: React.FC<ThreatRadarProps> = ({ dna = {}, coverage = {} }) => {
  const recon = dna.recon ?? 75;
  const c2 = dna.c2 ?? 80;
  const dns = dna.dns ?? 70;
  const encrypted = dna.encrypted ?? 85;
  const exfil = dna.exfil ?? 60;

  const covRecon = coverage.recon ?? 65;
  const covC2 = coverage.c2 ?? 85;
  const covDns = coverage.dns ?? 75;
  const covEncrypted = coverage.encrypted ?? 80;
  const covExfil = coverage.exfil ?? 70;

  const data = {
    labels: ['Reconnaissance', 'C2 Comms', 'DNS Abuse', 'Encrypted C2', 'Exfiltration'],
    datasets: [
      {
        label: 'Threat Intensity',
        data: [recon, c2, dns, encrypted, exfil],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
        borderWidth: 1.5,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#fff',
      },
      {
        label: 'Defense Coverage',
        data: [covRecon, covC2, covDns, covEncrypted, covExfil],
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderColor: '#06B6D4',
        borderWidth: 1.5,
        pointBackgroundColor: '#06B6D4',
        pointBorderColor: '#fff',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#94A3B8', font: { size: 11, family: 'Inter' } },
        ticks: { display: false },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#E2E8F0', font: { size: 11 } } },
    },
    maintainAspectRatio: false,
  };

  return <div className="h-64 w-full"><Radar data={data} options={options} /></div>;
};

export default ThreatRadar;
