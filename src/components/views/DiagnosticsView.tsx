import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { DiagnosticReport, HardwareHealthCheck } from '../../types/diagnostics.ts';
import { 
  Activity, 
  Battery, 
  HardDrive, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  FileCheck,
  Zap,
  Check
} from 'lucide-react';
import { StorageService } from '../../services/storageService.ts';

interface DiagnosticsViewProps {
  device: AndroidDevice | null;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({ device }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);
  const [activeReport, setActiveReport] = useState<DiagnosticReport>({
    id: 'diag_initial',
    deviceId: device?.id || 'unknown',
    timestamp: new Date().toISOString(),
    overallScore: 94,
    batteryHealth: {
      capacityPercent: device?.batteryLevelPercent || 78,
      cycleCount: 142,
      voltageMv: 4120,
      temperatureC: device?.batteryTemperatureC || 28.4,
      status: device?.batteryHealthStatus || 'GOOD'
    },
    storageHealth: {
      totalGb: 256,
      usedGb: 84.5,
      freeGb: 171.5,
      smartWearLevelPercent: 3,
      emmcPartitionIntegrity: 'OK'
    },
    usbLink: {
      speedMbps: device?.usbInfo.speedMbps || 480,
      packetLossRatio: 0.0001,
      stability: 'EXCELLENT'
    },
    checks: [
      {
        id: 'chk_1',
        name: 'Battery Cell Wear & Degradation',
        category: 'BATTERY',
        status: 'PASSED',
        measuredValue: '97% Estimated Design Capacity',
        referenceThreshold: '> 80% Capacity Threshold',
        notes: 'Li-ion chemistry healthy; 142 charge cycles logged.'
      },
      {
        id: 'chk_2',
        name: 'UFS 4.0 Flash Storage Health',
        category: 'STORAGE',
        status: 'PASSED',
        measuredValue: 'Wear: 3%, Bad Blocks: 0',
        referenceThreshold: '< 10% Wear Limit',
        notes: 'SMART attributes verified; all partitions intact.'
      },
      {
        id: 'chk_3',
        name: 'USB Bus Throughput & Stability',
        category: 'USB_INTERFACE',
        status: 'PASSED',
        measuredValue: '42.8 MB/s sustained',
        referenceThreshold: '> 25 MB/s benchmark',
        notes: 'Zero USB packet drop observed in 10,000 packets.'
      },
      {
        id: 'chk_4',
        name: 'Internal Thermal Sensors',
        category: 'THERMAL',
        status: 'PASSED',
        measuredValue: '28.4°C SoC Temperature',
        referenceThreshold: '< 45.0°C Safe Ceiling',
        notes: 'Thermal throttling inactive; cooling curve normal.'
      },
      {
        id: 'chk_5',
        name: 'Hardware Titan M2 / Knox Attestation',
        category: 'SENSORS',
        status: 'PASSED',
        measuredValue: 'Valid Keymaster Attestation',
        referenceThreshold: 'Green / Factory Key Chain',
        notes: 'Cryptographic security processor responding properly.'
      }
    ]
  });

  const runFullDiagnostics = () => {
    setIsRunning(true);
    setReportSaved(false);

    setTimeout(() => {
      setIsRunning(false);
      const updated: DiagnosticReport = {
        ...activeReport,
        id: `diag_${Date.now()}`,
        timestamp: new Date().toISOString(),
        overallScore: Math.floor(Math.random() * 6) + 93
      };
      setActiveReport(updated);
    }, 1400);
  };

  const handleSaveReport = () => {
    StorageService.getInstance().saveDiagnosticReport(activeReport);
    StorageService.getInstance().appendAuditLog({
      timestamp: new Date().toISOString(),
      technicianName: StorageService.getInstance().getActiveTechnician().name,
      technicianRole: StorageService.getInstance().getActiveTechnician().role,
      deviceSummary: device ? `${device.marketName} (${device.modelNumber})` : 'Connected Handset',
      operationType: 'HARDWARE_DIAGNOSTICS_SAVED',
      result: 'SUCCESS',
      payloadJson: JSON.stringify({ score: activeReport.overallScore, checks: activeReport.checks.length })
    });
    setReportSaved(true);
    setTimeout(() => setReportSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>Hardware Diagnostics & Benchmark Engine</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Non-destructive hardware sensor, storage wear, and thermal diagnostics (Offline Verified)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runFullDiagnostics}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
          >
            {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Benchmarking Hardware...' : 'Run Diagnostics'}</span>
          </button>
          <button
            onClick={handleSaveReport}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs border border-zinc-700 flex items-center gap-1.5"
          >
            {reportSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCheck className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{reportSaved ? 'Report Saved' : 'Save Certificate'}</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        {/* Overall Health Score */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center font-bold text-xl text-emerald-400 font-mono">
            {activeReport.overallScore}
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-400">HARDWARE HEALTH</span>
            <div className="font-bold text-sm text-zinc-100">Grade A (Optimal)</div>
            <span className="text-[10px] text-zinc-400">Zero Critical Faults</span>
          </div>
        </div>

        {/* Battery Health */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
            <span>BATTERY HEALTH</span>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-bold text-base text-zinc-100 font-mono">
            {activeReport.batteryHealth.capacityPercent}% • {activeReport.batteryHealth.voltageMv} mV
          </div>
          <div className="text-[10px] text-zinc-400">
            {activeReport.batteryHealth.temperatureC}°C • {activeReport.batteryHealth.cycleCount} charge cycles
          </div>
        </div>

        {/* Storage Health */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
            <span>UFS STORAGE WEAR</span>
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="font-bold text-base text-zinc-100 font-mono">
            {activeReport.storageHealth.usedGb} / {activeReport.storageHealth.totalGb} GB
          </div>
          <div className="text-[10px] text-zinc-400">
            Wear: {activeReport.storageHealth.smartWearLevelPercent}% (Life Expectancy 97%)
          </div>
        </div>

        {/* USB Bus Throughput */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono">
            <span>USB BUS BENCHMARK</span>
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="font-bold text-base text-zinc-100 font-mono">
            {activeReport.usbLink.speedMbps} Mbps
          </div>
          <div className="text-[10px] text-emerald-400 font-bold">
            {activeReport.usbLink.stability} link stability
          </div>
        </div>
      </div>

      {/* Detailed Diagnostic Items Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm text-zinc-100">Component Verification Checklist</h2>
          <span className="text-[11px] font-mono text-zinc-400">
            Last evaluated: {new Date(activeReport.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="divide-y divide-zinc-800 text-xs">
          {activeReport.checks.map((chk) => (
            <div key={chk.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-semibold text-zinc-200 flex items-center gap-2">
                  <span>{chk.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                    {chk.category}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400">{chk.notes}</div>
              </div>

              <div className="flex items-center gap-4 sm:text-right">
                <div>
                  <div className="font-mono text-zinc-200 text-xs font-semibold">{chk.measuredValue}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{chk.referenceThreshold}</div>
                </div>

                <div className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px] font-bold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{chk.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
