import numpy as np
from sklearn.ensemble import IsolationForest

class LogDetector:
    def __init__(self):
        # Baseline training set [message_length, severity_weight]
        X_train = np.array([
            [15, 1], [30, 1], [25, 1], [45, 1], [10, 1]
        ])
        self.model = IsolationForest(contamination=0.2, random_state=42)
        self.model.fit(X_train)

    def analyze(self, log_dict):
        sev_map = {"INFO": 1, "WARNING": 2, "CRITICAL": 3, "FATAL": 4}
        sev_val = sev_map.get(log_dict.get("severity", "INFO"), 1)
        msg_len = len(log_dict.get("message", ""))
        
        features = np.array([[msg_len, sev_val]])
        pred = self.model.predict(features)[0]
        score = self.model.decision_function(features)[0]
        
        is_anomaly = (pred == -1) or (sev_val >= 3)
        return {
            "is_anomaly": bool(is_anomaly),
            "anomaly_score": float(abs(score))
        }

    def explain(self, log):
        message = log.message if hasattr(log, "message") else log.get("message", "")
        if "SYN flood" in message or "brute force" in message or "CRITICAL" in message:
            root_cause = "Distributed Denial of Service (DDoS) or TCP packet flooding vector identified."
            recommended_action = "Apply edge IP rate-limiting and drop inbound packets from offending nodes."
            risk_level = "CRITICAL"
        elif "buffer overflow" in message or "memory write" in message:
            root_cause = "Malicious payload injection attempting stack/heap memory corruption."
            recommended_action = "Isolate process boundary, block source IP, and update web application firewall rules."
            risk_level = "FATAL"
        else:
            root_cause = "Statistical feature anomaly identified by Isolation Forest model."
            recommended_action = "Audit network interface logs and review current authorization token TTLs."
            risk_level = "WARNING"
            
        return {
            "root_cause": root_cause,
            "recommended_action": recommended_action,
            "risk_level": risk_level
        }