import numpy as np
from sklearn.ensemble import IsolationForest

class LogDetector:
    def __init__(self):
        # Initialize Isolation Forest model
        self.model = IsolationForest(contamination=0.2, random_state=42)
        
        # Pre-fit model on synthetic baseline telemetry features: [message_length, severity_weight]
        baseline_data = np.array([
            [25, 1], [30, 1], [22, 1], [35, 2], [28, 1],
            [120, 3], [150, 3], [200, 3], [180, 3] # Outliers
        ])
        self.model.fit(baseline_data)

    def predict(self, message: str, severity: str) -> tuple[bool, float]:
        severity_map = {"INFO": 1, "WARNING": 2, "CRITICAL": 3}
        weight = severity_map.get(severity, 1)
        features = np.array([[len(message), weight]])
        
        # Isolation Forest outputs -1 for anomalies, 1 for normal
        prediction = self.model.predict(features)[0]
        score = float(self.model.score_samples(features)[0])
        
        is_anomaly = bool(prediction == -1)
        return is_anomaly, score

    def explain(self, log_entry) -> dict:
        return {
            "root_cause": f"Payload length ({len(log_entry.message)} chars) combined with severity '{log_entry.severity}' produced an anomalous vector score of {log_entry.anomaly_score:.4f}.",
            "next_steps": f"Investigate source IP {log_entry.source} for rate-limit violations and inspect perimeter firewall logs."
        }

# Instantiate the singleton instance expected by routes/logs.py
detector = LogDetector()