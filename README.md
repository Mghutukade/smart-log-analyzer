# 🛡️ Smart Log Analyzer & Anomaly Detector

A full-stack network telemetry monitor that ingests system logs, detects security anomalies using unsupervised Machine Learning, and provides plain-English AI diagnostics.

---

## 📌 Project Overview

Systems generate massive volumes of log data, making manual inspection slow and error-prone. This application automates log monitoring through a clear three-step pipeline:

1. **Stream & Store**: Ingests continuous log entries (timestamp, severity, source, event type, message) and saves them to a PostgreSQL database.
2. **Algorithmic Detection**: Evaluates incoming logs using a non-AI Machine Learning model (`IsolationForest`) to mathematically flag anomalies and calculate threat scores.
3. **AI Threat Diagnosis**: Takes flagged anomalies and generates plain-English explanations, probable root causes, and recommended next steps.

---

## ⚙️ How It Works (Step-by-Step)

```text
[ Incoming Log Packet ] 
          │
          ▼
 [ FastAPI & Pydantic ] ─── (Validates schema & auto-populates missing fields)
          │
          ├───> [ PostgreSQL Database ] ─── (Persists raw telemetry & scores)
          │
          ├───> [ Isolation Forest ML ] ─── (Calculates anomaly score & flag)
          │
          └─> [ AI Explanation Engine ] ── (Generates root cause & mitigation steps)