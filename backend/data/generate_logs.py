import time
import os

DATA_DIR = os.path.dirname(os.path.abspath(__file__))

def create_conn_log():
    lines = [
        "#separator \\x09",
        "#set_separator	,",
        "#empty_field	(empty)",
        "#unset_field	-",
        "#path	conn",
        "#open	2026-09-28-00-00-00",
        "#fields	ts	uid	id.orig_h	id.orig_p	id.resp_h	id.resp_p	proto	service	duration	orig_bytes	resp_bytes	conn_state	local_orig	local_resp	missed_bytes	history	orig_pkts	orig_ip_bytes	resp_pkts	resp_ip_bytes",
        "#types	time	string	addr	port	addr	port	enum	string	interval	count	count	string	bool	bool	count	string	count	count	count	count"
    ]
    
    base_ts = 1727510400.0
    uid_counter = 1000
    
    def add_entry(ts, orig_h, orig_p, resp_h, resp_p, proto, service, duration, orig_b, resp_b, state):
        nonlocal uid_counter
        uid_counter += 1
        uid = f"C{uid_counter}xyz"
        lines.append(f"{ts:.6f}\t{uid}\t{orig_h}\t{orig_p}\t{resp_h}\t{resp_p}\t{proto}\t{service}\t{duration}\t{orig_b}\t{resp_b}\t{state}\t-\t-\t0\tS\t1\t40\t1\t40")
        
    # Port scan
    for i in range(21, 80):
        add_entry(base_ts + i, "192.168.1.100", 50000+i, "10.0.0.5", i, "tcp", "-", "0.000", "0", "0", "REJ")
        
    # C2 Beacon
    for i in range(25):
        add_entry(base_ts + i*60.1, "10.0.1.50", 45000+i, "198.51.100.44", 8443, "tcp", "ssl", "0.500", "500", "200", "SF")
        
    # Brute force
    for i in range(35):
        add_entry(base_ts + i*2, "172.16.0.99", 35000+i, "10.0.0.10", 22, "tcp", "ssh", "0.100", "1500", "1200", "SF")
        
    # Exfiltration
    for i in range(5):
        add_entry(base_ts + 3600 + i*10, "10.0.1.50", 55000+i, "203.0.113.66", 443, "tcp", "ssl", "5.000", "12000000", "5000", "SF")
        
    # Normal traffic
    for i in range(50):
        add_entry(base_ts + i*15, "10.0.1.10", 10000+i, "8.8.8.8", 53, "udp", "dns", "0.010", "45", "100", "SF")
        
    with open(os.path.join(DATA_DIR, "sample_conn.log"), "w") as f:
        f.write("\n".join(lines) + "\n")

def create_dns_log():
    lines = [
        "#separator \\x09",
        "#set_separator	,",
        "#empty_field	(empty)",
        "#unset_field	-",
        "#path	dns",
        "#open	2026-09-28-00-00-00",
        "#fields	ts	uid	id.orig_h	id.orig_p	id.resp_h	id.resp_p	proto	trans_id	rtt	query	qclass	qclass_name	qtype	qtype_name	rcode	rcode_name	AA	TC	RD	RA	Z	answers	TTLs	rejected",
        "#types	time	string	addr	port	addr	port	enum	count	interval	string	count	string	count	string	count	string	bool	bool	bool	bool	count	vector[string]	vector[interval]	bool"
    ]
    base_ts = 1727510400.0
    uid_counter = 2000
    
    def add_entry(ts, orig_h, resp_h, query, qtype_name, rcode_name):
        nonlocal uid_counter
        uid_counter += 1
        uid = f"D{uid_counter}xyz"
        lines.append(f"{ts:.6f}\t{uid}\t{orig_h}\t53000\t{resp_h}\t53\tudp\t1234\t0.01\t{query}\t1\tC_INTERNET\t1\t{qtype_name}\t0\t{rcode_name}\tF\tF\tT\tT\t0\t-\t-\tF")
        
    # DGA
    dgas = ["xk7m9p2qr5.evil.top", "a8b3k1m7n4.xyz", "qwe123asdzxc.ru", "zxcvbnm123.com", "asdfghjkl456.net"] * 3
    for i, dga in enumerate(dgas):
        add_entry(base_ts + i*5, "10.0.1.100", "8.8.8.8", dga, "A", "NXDOMAIN")
        
    # Tunneling
    for i in range(5):
        add_entry(base_ts + 100 + i*10, "10.0.1.50", "8.8.4.4", f"aGVsbG8gd29ybGQ{i}.tunnel.evil.com", "TXT", "NOERROR")
        
    # Flood
    for i in range(55):
        add_entry(base_ts + 200 + i*0.5, "192.168.1.200", "8.8.8.8", "random.com", "A", "NOERROR")
        
    # Normal
    normals = ["google.com", "microsoft.com", "github.com", "apple.com"] * 10
    for i, n in enumerate(normals):
        add_entry(base_ts + i*20, "10.0.0.5", "1.1.1.1", n, "A", "NOERROR")
        
    with open(os.path.join(DATA_DIR, "sample_dns.log"), "w") as f:
        f.write("\n".join(lines) + "\n")

def create_ssl_log():
    lines = [
        "#separator \\x09",
        "#set_separator	,",
        "#empty_field	(empty)",
        "#unset_field	-",
        "#path	ssl",
        "#open	2026-09-28-00-00-00",
        "#fields	ts	uid	id.orig_h	id.orig_p	id.resp_h	id.resp_p	version	cipher	curve	server_name	resumed	last_alert	next_protocol	established	ssl_history	cert_chain_fps	client_cert_chain_fps	sni_matches_cert	ja3	ja3s",
        "#types	time	string	addr	port	addr	port	string	string	string	string	bool	string	string	bool	string	vector[string]	vector[string]	bool	string	string"
    ]
    base_ts = 1727510400.0
    uid_counter = 3000
    
    def add_entry(ts, orig_h, resp_h, cipher, server_name, sni_match, ja3):
        nonlocal uid_counter
        uid_counter += 1
        uid = f"S{uid_counter}xyz"
        lines.append(f"{ts:.6f}\t{uid}\t{orig_h}\t44300\t{resp_h}\t443\tTLSv12\t{cipher}\t-\t{server_name}\tF\t-\t-\tT\t-\t-\t-\t{sni_match}\t{ja3}\t-")
        
    # Malware
    for i in range(5):
        add_entry(base_ts + i*60, "10.0.1.50", "198.51.100.44", "TLS_AES_256_GCM_SHA384", "update.evil.com", "T", "72a589da586844d7f0818ce684948eea")
        
    # Self-signed
    add_entry(base_ts + 500, "192.168.1.100", "203.0.113.10", "TLS_AES_128_GCM_SHA256", "suspicious.xyz", "F", "normal_ja3")
    
    # Weak cipher
    add_entry(base_ts + 600, "10.0.0.5", "10.0.0.20", "TLS_RSA_WITH_RC4_128_SHA", "legacy.internal", "T", "old_ja3")
    
    # Normal
    for i in range(20):
        add_entry(base_ts + 1000 + i*10, "10.0.0.50", "142.250.190.46", "TLS_AES_256_GCM_SHA384", "google.com", "T", "chrome_ja3")
        
    with open(os.path.join(DATA_DIR, "sample_ssl.log"), "w") as f:
        f.write("\n".join(lines) + "\n")

if __name__ == "__main__":
    create_conn_log()
    create_dns_log()
    create_ssl_log()
    print("Logs generated.")
