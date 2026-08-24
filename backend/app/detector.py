import numpy as np
from sklearn.ensemble import IsolationForest

class LogAnomalyDetector:
    def __init__(self):
        # Initialize Isolation Forest model
        self.model = IsolationForest(contamination=0.1, random_state=42)
        
    def _extract_features(self, logs: list) -> np.ndarray:
        # Extract lightweight numerical features for scoring
        features = []
        severity_map = {"INFO": 1, "WARNING": 2, "ERROR": 3, "CRITICAL": 4, "FATAL": 5}
        
        for log in logs:
            msg_len = len(log.get("message", ""))
            sev_score = severity_map.get(str(log.get("severity", "")).upper(), 1)
            is_sec_alert = 1 if log.get("event_type") == "SECURITY_ALERT" else 0
            features.append([msg_len, sev_score, is_sec_alert])
            
        return np.array(features)

    def predict(self, logs: list) -> list:
        if not logs:
            return logs
            
        features = self._extract_features(logs)
        
        # Fit & Predict (-1 is anomaly, 1 is normal)
        self.model.fit(features)
        predictions = self.model.predict(features)
        scores = self.model.decision_function(features)
        
        # Attach results back to log objects
        for i, log in enumerate(logs):
            log["is_anomaly"] = bool(predictions[i] == -1)
            log["anomaly_score"] = float(scores[i])
            
        return logs

detector = LogAnomalyDetector()