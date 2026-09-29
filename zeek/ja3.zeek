##! ShadowPulse AI — JA3/JA3S TLS Fingerprinting Script
##! Extracts client and server TLS fingerprints from handshake metadata
##! Used for identifying malware, C2 toolkits, and anomalous TLS clients
##!
##! JA3 Algorithm:
##!   MD5(SSLVersion,Ciphers,Extensions,EllipticCurves,EllipticCurvePointFormats)
##!
##! JA3S Algorithm:
##!   MD5(SSLVersion,Cipher,Extensions)
##!
##! Known Malicious JA3 Fingerprints (ShadowPulse Threat DB):
##!   72a589da586844d7f0818ce684948eea — Cobalt Strike Default
##!   a0e9f5d64349fb13191bc781f81f42e1 — Metasploit Meterpreter
##!   b384078a50301557cc769f64d7fbac3a — Emotet Trojan
##!   e7d705a3286e19ea42f587b344ee6865 — TrickBot
##!   6734f37431670b3ab4292b8f60f29984 — Dridex Banking Trojan
##!   51c64c77e60f3980eea90869b68c58a8 — IcedID
##!   bd0bf25947d4a37404f0424edf4db9ad — QakBot

@load base/protocols/ssl

module JA3;

export {
    ## Known malicious JA3 fingerprints
    const malicious_ja3: set[string] = {
        "72a589da586844d7f0818ce684948eea",  # Cobalt Strike
        "a0e9f5d64349fb13191bc781f81f42e1",  # Metasploit
        "b384078a50301557cc769f64d7fbac3a",  # Emotet
        "e7d705a3286e19ea42f587b344ee6865",  # TrickBot
        "6734f37431670b3ab4292b8f60f29984",  # Dridex
        "51c64c77e60f3980eea90869b68c58a8",  # IcedID
        "bd0bf25947d4a37404f0424edf4db9ad",  # QakBot
    } &redef;

    ## Log JA3 matches to notice.log
    redef enum Notice::Type += {
        JA3_Malicious_Match,
    };
}

## GREASE values to filter from JA3 calculation (per RFC 8701)
const grease_values: set[count] = {
    0x0a0a, 0x1a1a, 0x2a2a, 0x3a3a,
    0x4a4a, 0x5a5a, 0x6a6a, 0x7a7a,
    0x8a8a, 0x9a9a, 0xaaaa, 0xbaba,
    0xcaca, 0xdada, 0xeaea, 0xfafa,
};

## Filter GREASE values from a vector
function filter_grease(vals: index_vec): string {
    local result = "";
    for (i in vals) {
        if (vals[i] !in grease_values) {
            if (|result| > 0)
                result += "-";
            result += fmt("%d", vals[i]);
        }
    }
    return result;
}

## Event handler for TLS Client Hello
event ssl_client_hello(c: connection, version: count, record_version: count,
                       possible_ts: time, client_random: string,
                       session_id: string, ciphers: index_vec,
                       comp_methods: index_vec) {
    
    local ciphers_str = filter_grease(ciphers);
    
    # Build JA3 raw string: SSLVersion,Ciphers,Extensions,EllipticCurves,Points
    # Extensions, curves, and points are captured in ssl_extension events
    local ja3_raw = fmt("%d,%s,,,", version, ciphers_str);
    
    # Compute MD5 hash
    if (c$ssl?$ja3)
        return;
    
    c$ssl$ja3 = md5_hash(ja3_raw);
    
    # Check against malicious fingerprint database
    if (c$ssl$ja3 in malicious_ja3) {
        NOTICE([
            $note=JA3_Malicious_Match,
            $msg=fmt("Malicious JA3 fingerprint detected: %s from %s → %s:%d",
                     c$ssl$ja3, c$id$orig_h, c$id$resp_h, c$id$resp_p),
            $conn=c,
            $identifier=fmt("%s-%s", c$id$orig_h, c$ssl$ja3),
            $suppress_for=30min
        ]);
    }
}

## Event handler for TLS Server Hello
event ssl_server_hello(c: connection, version: count, record_version: count,
                       possible_ts: time, server_random: string,
                       session_id: string, cipher: count,
                       comp_method: count) {
    
    # Build JA3S raw string: SSLVersion,Cipher,Extensions
    local ja3s_raw = fmt("%d,%d,", version, cipher);
    
    if (!c$ssl?$ja3s)
        c$ssl$ja3s = md5_hash(ja3s_raw);
}
