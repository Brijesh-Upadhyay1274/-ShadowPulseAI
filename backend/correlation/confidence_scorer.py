class ConfidenceScorer:
    def score(self, factors: dict) -> float:
        weights = {
            'statistical_deviation': 0.30,
            'temporal_correlation': 0.20,
            'mitre_match': 0.15,
            'destination_reputation': 0.15,
            'pattern_repetition': 0.10,
            'cross_engine_correlation': 0.10
        }
        
        total_score = 0.0
        for k, w in weights.items():
            total_score += factors.get(k, 0) * w
            
        return min(max(total_score, 0.0), 100.0)
