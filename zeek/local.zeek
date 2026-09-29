##! ShadowPulse AI — Custom Zeek Configuration
##! Problem Statement: SIH 26145 — AI-Based Detection of Cyber Threats in Unidirectional IP Traffic
##!
##! Installation: Copy to /opt/zeek/share/zeek/site/local.zeek
##! This configuration enables passive traffic analysis for ShadowPulse AI

# ============================================
# Core Protocol Analyzers
# ============================================
@load base/protocols/conn
@load base/protocols/dns
@load base/protocols/http
@load base/protocols/ssl
@load base/protocols/ssh
@load base/protocols/ftp
@load base/protocols/smtp
@load base/protocols/dhcp

# ============================================
# File Analysis (detect file transfers)
# ============================================
@load base/files/hash-all-files
@load base/files/extract-all-files

# ============================================
# Security Frameworks
# ============================================
@load base/frameworks/notice
@load base/frameworks/intel
@load base/frameworks/software
@load base/frameworks/sumstats

# ============================================
# TLS/SSL Analysis & Certificates
# ============================================
@load base/protocols/ssl/validate-certs
@load policy/protocols/ssl/expiring-certs
@load policy/protocols/ssl/log-hostcerts-only

# ============================================
# JA3/JA3S Fingerprinting (CRITICAL for ShadowPulse)
# ============================================
@load packages/ja3

# ============================================  
# JA4+ Fingerprinting (Extended TLS Analysis)
# ============================================
# @load packages/ja4  # Uncomment when ja4 package is installed

# ============================================
# DNS Analysis
# ============================================
@load policy/protocols/dns/auth-addl
@load policy/protocols/dns/detect-external-names

# ============================================
# Connection Analysis
# ============================================
@load policy/protocols/conn/known-hosts
@load policy/protocols/conn/known-services
@load policy/protocols/conn/vlan-logging
@load policy/protocols/conn/mac-logging

# ============================================
# SSH Analysis
# ============================================
@load policy/protocols/ssh/detect-bruteforcing
@load policy/protocols/ssh/geo-data
@load policy/protocols/ssh/interesting-hostnames
@load policy/protocols/ssh/software

# ============================================
# HTTP Analysis  
# ============================================
@load policy/protocols/http/detect-sqli
@load policy/protocols/http/detect-webapps
@load policy/protocols/http/software

# ============================================
# Network Scan Detection
# ============================================
@load policy/misc/scan
@load policy/misc/detect-traceroute

# ============================================
# Tuning — JSON Output (for Wazuh integration)
# ============================================
@load policy/tuning/json-logs

# ============================================
# ShadowPulse Custom Settings
# ============================================

# Define local networks (adjust per deployment)
redef Site::local_nets += {
    10.0.0.0/8,
    172.16.0.0/12,
    192.168.0.0/16
};

# Enable connection duration logging
redef Conn::default_extract = T;

# Increase DNS logging detail
redef DNS::max_pending = 50;

# SSH brute-force thresholds
redef SSH::password_guesses_limit = 10;

# Scan detection thresholds
redef Scan::addr_scan_threshold = 15;
redef Scan::port_scan_threshold = 20;

# Log rotation (hourly for analysis)
redef Log::default_rotation_interval = 1hr;

# ============================================
# ShadowPulse Notice Policies
# ============================================

hook Notice::policy(n: Notice::Info) {
    # Automatically send all scan notices to ShadowPulse
    if (n$note == Scan::Address_Scan || n$note == Scan::Port_Scan) {
        add n$actions[Notice::ACTION_LOG];
    }
    
    # Flag SSH brute-force attempts
    if (n$note == SSH::Password_Guessing) {
        add n$actions[Notice::ACTION_LOG];
    }
    
    # Certificate validation failures
    if (n$note == SSL::Invalid_Server_Cert) {
        add n$actions[Notice::ACTION_LOG];
    }
}

# ============================================
# Unidirectional Mode Configuration
# ShadowPulse operates in passive/read-only mode
# Never inject packets back into the network
# ============================================
redef Pcap::snaplen = 65535;
redef Pcap::bufsize = 256;

# Disable active responses (critical for unidirectional deployment)
# Zeek should NEVER send RST or other response packets
redef PacketFilter::enable_auto_protocol_capture_filters = F;
