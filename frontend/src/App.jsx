import React, { useState, useEffect } from "react";

export default function App() {
  const [logs, setLogs] = useState([
    { id: "1787558125559", time: "1:25:25 PM", score: 0.66, status: "ANOMALY" },
    { id: "1787558121563", time: "1:25:21 PM", score: 0.50, status: "NORMAL" },
    { id: "1787558117556", time: "1:25:17 PM", score: 0.59, status: "WARNING" }
  ]);

  // Simulate real-time log updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const score = parseFloat((Math.random() * (0.85 - 0.45) + 0.45).toFixed(2));
      const status = score > 0.62 ? "ANOMALY" : score > 0.55 ? "WARNING" : "NORMAL";
      const id = Date.now().toString();

      setLogs((prev) => [{ id, time, score, status }, ...prev.slice(0, 9)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const latestScore = logs[0]?.score || 0.50;
  const isHighRisk = latestScore > 0.62;

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>⚡ ISOLATION FOREST MONITOR</h1>
          <p style={styles.subtitle}>FastAPI Engine • Port 8000 • PostgreSQL Active</p>
        </div>
        <div style={styles.badgeGroup}>
          <span style={styles.badgeSuccess}>● Worker: Operational</span>
          <span style={styles.badgeInfo}>● DB: Connected</span>
        </div>
      </header>

      {/* Hero Alert Banner */}
      <div style={{
        ...styles.alertBanner,
        borderColor: isHighRisk ? "#ef4444" : "#10b981",
        backgroundColor: isHighRisk ? "#450a0a" : "#064e3b"
      }}>
        <div style={{ fontSize: "14px", color: isHighRisk ? "#fca5a5" : "#6ee7b7" }}>
          SYSTEM STATUS OVERVIEW
        </div>
        <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "4px" }}>
          {isHighRisk ? "🚨 CRITICAL ANOMALY DETECTED" : "✅ SYSTEM NORMAL"}
        </div>
        <div style={{ fontSize: "13px", marginTop: "4px", opacity: 0.9 }}>
          Latest Payload Anomaly Score: <strong>{latestScore.toFixed(2)}</strong> (Threshold: 0.60)
        </div>
      </div>

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>CURRENT ANOMALY SCORE</div>
          <div style={{
            ...styles.cardValue,
            color: latestScore > 0.62 ? "#ef4444" : latestScore > 0.55 ? "#f59e0b" : "#10b981"
          }}>
            {latestScore.toFixed(2)}
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>PROCESSED PAYLOADS</div>
          <div style={styles.cardValue}>1,248</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>CLASSIFICATION MODEL</div>
          <div style={{ ...styles.cardValue, fontSize: "18px", color: "#60a5fa" }}>
            Scikit-Learn IsolationForest
          </div>
        </div>
      </div>

      {/* Execution Log Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableTitle}>LIVE EXECUTION STREAM</div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>TIMESTAMP</th>
              <th style={styles.th}>PAYLOAD ID</th>
              <th style={styles.th}>SCORE</th>
              <th style={styles.th}>SCORE BAR</th>
              <th style={styles.th}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => {
              const bg = log.status === "ANOMALY" ? "#ef4444" : log.status === "WARNING" ? "#f59e0b" : "#10b981";
              return (
                <tr key={log.id} style={styles.tr}>
                  <td style={styles.td}>{log.time}</td>
                  <td style={styles.tdCode}>#{log.id}</td>
                  <td style={{ ...styles.td, fontWeight: "bold" }}>{log.score.toFixed(2)}</td>
                  <td style={styles.td}>
                    {/* Visual Score Bar */}
                    <div style={styles.barBackground}>
                      <div style={{
                        height: "100%",
                        width: `${log.score * 100}%`,
                        backgroundColor: bg,
                        borderRadius: "4px",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusChip,
                      backgroundColor: `${bg}20`,
                      color: bg,
                      borderColor: `${bg}50`
                    }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Inline CSS Styles (No External Libraries Needed)
const styles = {
  container: {
    backgroundColor: "#090d16",
    color: "#f3f4f6",
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "Courier New, monospace, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1f2937",
    paddingBottom: "16px",
    marginBottom: "20px"
  },
  title: { fontSize: "22px", margin: 0, color: "#38bdf8", letterSpacing: "1px" },
  subtitle: { fontSize: "12px", margin: "4px 0 0 0", color: "#9ca3af" },
  badgeGroup: { display: "flex", gap: "10px" },
  badgeSuccess: { backgroundColor: "#064e3b", color: "#6ee7b7", padding: "4px 8px", borderRadius: "4px", fontSize: "11px" },
  badgeInfo: { backgroundColor: "#1e3a8a", color: "#93c5fd", padding: "4px 8px", borderRadius: "4px", fontSize: "11px" },
  alertBanner: { border: "1px solid", borderRadius: "8px", padding: "16px", marginBottom: "20px" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" },
  card: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", padding: "16px" },
  cardLabel: { fontSize: "11px", color: "#9ca3af", letterSpacing: "1px" },
  cardValue: { fontSize: "28px", fontWeight: "bold", marginTop: "4px" },
  tableCard: { backgroundColor: "#111827", border: "1px solid #1f2937", borderRadius: "8px", overflow: "hidden" },
  tableTitle: { padding: "12px 16px", borderBottom: "1px solid #1f2937", fontSize: "13px", fontWeight: "bold", color: "#9ca3af" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" },
  thRow: { backgroundColor: "#1f2937" },
  th: { padding: "10px 16px", color: "#9ca3af", fontSize: "11px", letterSpacing: "1px" },
  tr: { borderBottom: "1px solid #111827" },
  td: { padding: "12px 16px" },
  tdCode: { padding: "12px 16px", color: "#60a5fa" },
  barBackground: { width: "100px", height: "8px", backgroundColor: "#374151", borderRadius: "4px", overflow: "hidden" },
  statusChip: { border: "1px solid", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }
};