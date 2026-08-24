# 🛡️ Smart Log Analyzer & Anomaly Detector

A full-stack cybersecurity application that ingests live network logs, detects anomalies using unsupervised machine learning, and generates plain-English AI root-cause explanations with actionable countermeasures.

---

## 🚀 Key Features

* **Real-Time Data Ingestion:** Streams network logs with built-in Pydantic validation and timestamp auto-filling.
* **Algorithmic Anomaly Detection:** Utilizes `IsolationForest` (scikit-learn) to score packet anomalies independently of AI rules.
* **AI Diagnostic Engine:** Generates plain-English threat breakdowns, root-cause analyses, and mitigation steps.
* **Persistent Storage:** Fully backed by PostgreSQL (`smart_logs` schema) via SQLAlchemy ORM.
* **Cyber SOC Dashboard:** High-tech React + Tailwind CSS frontend featuring dynamic threat counters and detailed diagnostic views.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Lucide Icons
* **Backend:** FastAPI, Python 3.10, Pydantic
* **Database:** PostgreSQL, SQLAlchemy ORM
* **Machine Learning & AI:** scikit-learn (`IsolationForest`), Custom AI Explanation Engine

---

## 📦 Quick Setup Guide

### 1. Database Setup
Create a PostgreSQL database named `smart_logs` in pgAdmin or psql:
```sql
CREATE DATABASE smart_logs;