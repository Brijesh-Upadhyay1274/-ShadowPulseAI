import React from 'react';
import ThreatIntelGraph from '../threat-graph/ThreatIntelGraph';
import { ThreatExplanationData } from './ExplainabilityPanel';

interface HeroThreatGraphProps {
  onSelectThreat?: (threat: ThreatExplanationData) => void;
  activeFilters?: {
    attacker: boolean;
    victim: boolean;
    domain: boolean;
    hash: boolean;
    alert: boolean;
    port: boolean;
  };
  searchTerm?: string;
  layoutMode?: 'force' | 'radial' | 'tree';
}

export const HeroThreatGraph: React.FC<HeroThreatGraphProps> = (props) => {
  return <ThreatIntelGraph {...props} />;
};

export default HeroThreatGraph;
