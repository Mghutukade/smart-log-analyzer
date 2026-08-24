import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

const HARDCORE_PACKET_POOL = [
  { event_type: "NETWORK", severity: "INFO", source: "192.168.1.45:53", message: "DNS query resolution: api.cloud-sentinel.io" },
  { event_type: "TLS_SESSION", severity: "INFO", source: "10.0.4.102:443", message: "TLS v1.3 AES-256 GCM handshake established" },
  { event_type: "FIREWALL", severity: "CRITICAL", source: "185.220.101.5", message: "CRITICAL: TCP SYN flood detected on port 22 (SSH)" },
  { event_type: "INTRUSION", severity: "FATAL", source: "192.168.1.109", message: "FATAL: Out-of-bounds memory write via buffer overflow payload" },
  { event_type: "AUTH_GUARD", severity: "WARNING", source: "api-gateway", message: "Multiple invalid JWT signature authorization attempts" },
  { event_type: "PACKET_INSPECT", severity: "INFO", source: "172.16.0.22", message: "HTTP GET /v1/telemetry Status 200 OK (244 bytes)" }
];

export default function App() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [packetCount, setPacketCount] = useState(4892);
  const [threatCount, setThreatCount] = useState(14);
  const [securityScore, setSecurityScore] = useState(92);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/logs/`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('FastAPI Fetch Error:', err);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    let interval;
    if (isLiveStreaming) {
      interval = setInterval(async () => {
        const template = HARDCORE_PACKET_POOL[Math.floor(Math.random() * HARDCORE_PACKET_POOL.length)];
        const packet = [{ timestamp: new Date().toISOString(), ...template }];
        
        try {
          await fetch(`${API_BASE}/logs/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(packet)
          });
          
          setPacketCount(prev => prev + 1);
          if (template.severity === 'CRITICAL' || template.severity === 'FATAL') {
            setThreatCount(prev => prev + 1);
            setSecurityScore(prev => Math.max(70, prev - 1));
          }
          fetchLogs();
        } catch (err) {
          console.error('Packet push error:', err);
        }
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLiveStreaming, fetchLogs]);

  const openAIDiagnosisPage = async (logId) => {
    setLoadingExplain(true);
    try {
      const res = await fetch(`${API_BASE}/logs/${logId}/explain`);
      const data = await res.json();
      setSelectedLog(data);
    } catch (err) {
      console.error("AI Explanation Fetch Error:", err);
    } finally {
      setLoadingExplain(false);
    }
  };

  // Full Page AI Threat Scan View
  if (selectedLog) {
    return (
      <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans p-6 md:p-10">
        <div className="max-w-5xl mx-auto bg-[#0B1528] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-ping"></div>
              <h1 className="text-2xl font-bold tracking-tight text-white">AI Threat Scan Result</h1>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl border border-cyan-500/30 transition cursor-pointer"
            >
              ← Return to Security Console
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#070D19] border border-slate-800 p-6 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Severity</p>
              <p className="text-3xl font-extrabold text-red-400 mt-2">{selectedLog.analysis?.risk_level || "CRITICAL"}</p>
            </div>
            <div className="bg-[#070D19] border border-slate-800 p-6 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Isolation Forest Score</p>
              <p className="text-3xl font-extrabold text-amber-400 font-mono mt-2">
                {selectedLog.anomaly_score ? selectedLog.anomaly_score.toFixed(4) : "0.8420"}
              </p>
            </div>
            <div className="bg-[#070D19] border border-slate-800 p-6 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Intercept Packet ID</p>
              <p className="text-3xl font-extrabold text-cyan-400 font-mono mt-2">#{selectedLog.id}</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Raw Packet Stream Payload</p>
              <div className="p-4 bg-[#030712] border border-slate-800 font-mono text-xs text-slate-300 rounded-xl">
                {selectedLog.raw_message}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Root Cause Diagnosis</p>
              <div className="p-5 bg-red-950/30 border border-red-500/40 text-red-200 text-sm font-medium rounded-xl">
                🚨 {selectedLog.analysis?.root_cause || "Analyzing anomaly pattern via model..."}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recommended Countermeasure</p>
              <div className="p-5 bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 text-sm rounded-xl leading-relaxed">
                ✨ {selectedLog.analysis?.recommended_action || "Applying dynamic security policy..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Overview
  return (
    <div className="min-h-screen bg-[#050B14] text-slate-100 font-sans p-6 md:p-8 selection:bg-cyan-500 selection:text-black">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-cyan-400 block animate-pulse"></span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              CYBERA SENTINEL PRO
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">AI-Powered Real-Time Packet Inspection & Isolation Forest Anomaly Detection</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition shadow-lg cursor-pointer ${
              isLiveStreaming
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {isLiveStreaming ? '● LIVE PACKET INGESTION ON' : '○ STREAM PAUSED'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#0B1528] border border-slate-800 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Score</p>
              <h2 className="text-4xl font-extrabold text-white mt-1">{securityScore}<span className="text-sm font-normal text-slate-400">/100</span></h2>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                EXCELLENT
              </span>
            </div>
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
              <span className="text-xs font-bold text-cyan-300">92%</span>
            </div>
          </div>

          <div className="bg-[#0B1528] border border-slate-800 p-6 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Threats Blocked</p>
            <h2 className="text-4xl font-extrabold text-red-400 mt-1">{threatCount}</h2>
            <p className="text-xs text-emerald-400 mt-2 font-medium">↑ Real-time Active Defense</p>
          </div>

          <div className="bg-[#0B1528] border border-slate-800 p-6 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Packets Scanned</p>
            <h2 className="text-4xl font-extrabold text-cyan-400 font-mono mt-1">{packetCount.toLocaleString()}</h2>
            <p className="text-xs text-cyan-400/80 mt-2 font-medium">⚡ 800ms Ingestion Frequency</p>
          </div>

          <div className="bg-[#0B1528] border border-slate-800 p-6 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Model Status</p>
            <h2 className="text-xl font-bold text-indigo-400 mt-2">Isolation Forest</h2>
            <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              ONLINE (FastAPI)
            </span>
          </div>
        </div>

        <div className="bg-[#0B1528] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 bg-[#070D19] border-b border-slate-800/80 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <h3 className="text-sm font-bold text-white tracking-wider">LIVE NETWORK TELEMETRY INGESTION</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{logs.length} Total Logs Buffered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#050B14]/80 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4">Status</th>
                  <th className="p-4">ID</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Source Node</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Packet Payload</th>
                  <th className="p-4 text-right">AI Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {logs.map((log) => (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-slate-800/40 transition ${
                      log.is_anomaly ? 'bg-red-950/20 border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <td className="p-4 whitespace-nowrap">
                      {log.is_anomaly ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                          ANOMALY
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          NORMAL
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">{log.id}</td>
                    <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 text-indigo-300">{log.source}</td>
                    <td className="p-4">
                      <span className={
                        log.severity === 'CRITICAL' || log.severity === 'FATAL' 
                          ? 'text-red-400 font-bold' 
                          : log.severity === 'WARNING' 
                          ? 'text-amber-400' 
                          : 'text-slate-300'
                      }>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 max-w-md truncate">{log.message}</td>
                    <td className="p-4 text-right">
                      {log.is_anomaly && (
                        <button
                          onClick={() => openAIDiagnosisPage(log.id)}
                          disabled={loadingExplain}
                          className="px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          {loadingExplain ? 'Analyzing...' : 'Explain AI →'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}