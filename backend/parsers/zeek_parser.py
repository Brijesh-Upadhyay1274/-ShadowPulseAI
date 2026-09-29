import os

class ZeekParser:
    def parse_file(self, filepath: str, log_type: str):
        if not os.path.exists(filepath):
            return []
            
        records = []
        headers = []
        
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                if line.startswith('#'):
                    if line.startswith('#fields'):
                        headers = line.split('\t')[1:]
                    continue
                
                parts = line.split('\t')
                record = {}
                for i, h in enumerate(headers):
                    val = parts[i] if i < len(parts) else None
                    if val == '-':
                        val = None
                    record[h] = val
                record['_log_type'] = log_type
                records.append(record)
                
        return records
