class Normalizer:
    def normalize(self, records):
        normalized = []
        for r in records:
            event = {
                'timestamp': float(r.get('ts', 0)),
                'uid': r.get('uid'),
                'source_ip': r.get('id.orig_h'),
                'source_port': int(r.get('id.orig_p')) if r.get('id.orig_p') else None,
                'dest_ip': r.get('id.resp_h'),
                'dest_port': int(r.get('id.resp_p')) if r.get('id.resp_p') else None,
                'protocol': r.get('proto', 'unknown'),
                'log_type': r.get('_log_type', 'unknown'),
                'raw': r
            }
            normalized.append(event)
        return normalized
