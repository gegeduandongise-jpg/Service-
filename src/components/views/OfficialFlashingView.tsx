import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { FirmwarePackage, FlashProgress } from '../../types/firmware.ts';
import { ServiceTicket } from '../../types/security.ts';
import { 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Play, 
  Check, 
  XCircle, 
  Info, 
  RefreshCw,
  Lock,
  Battery
} from 'lucide-react';
import { PreFlightSafetyEngine } from '../../services/preFlightEngine.ts';
import { FirmwareService } from '../../services/firmwareService.ts';
import { SafetyConfirmationModal } from '../modals/SafetyConfirmationModal.tsx';
import { StorageService } from '../../services/storageService.ts';

interface OfficialFlashingViewProps {
  device: AndroidDevice | null;
  selectedFirmware: FirmwarePackage | null;
  activeTicket?: ServiceTicket;
  onSelectFirmwareTab: () => void;
}

export const OfficialFlashingView: React.FC<OfficialFlashingViewProps> = ({
  device,
  selectedFirmware,
  activeTicket,
  onSelectFirmwareTab
}) => {
  const fwService = FirmwareService.getInstance();

  const [isDryRun, setIsDryRun] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [flashProgress, setFlashProgress] = useState<FlashProgress | null>(null);

  // Evaluate Pre-Flight
  const preFlight = PreFlightSafetyEngine.evaluatePreFlight(
    device,
    selectedFirmware,
    activeTicket
  );

  const handleStartFlashingSequence = () => {
    if (!preFlight.passedAllCritical || !device || !selectedFirmware) return;

    if (!isDryRun) {
      // Require explicit typed confirmation modal for live hardware writes
      setShowConfirmModal(true);
    } else {
      executeFlashingInternal(true);
    }
  };

  const executeFlashingInternal = async (dryRun: boolean) => {
    if (!device || !selectedFirmware) return;

    setIsFlashing(true);
    setFlashProgress({
      stage: 'PRE_FLIGHT',
      currentPartition: 'INIT',
      partitionIndex: 0,
      totalPartitions: 8,
      percent: 0,
      bytesSent: 0,
      totalBytes: selectedFirmware.fileSizeBytes,
      speedMbps: 0,
      logs: ['[INIT] Bootstrapping Official Servicing Protocol Interface...']
    });

    await fwService.executeOfficialFlashing(
      device,
      selectedFirmware,
      dryRun,
      (progress) => {
        setFlashProgress(progress);
        if (progress.stage === 'COMPLETED') {
          setIsFlashing(false);
        }
      }
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Official OEM Firmware Flashing Suite</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Strict verified flashing engine with pre-flight safety gating, dry-run simulation, and partition verification
          </p>
        </div>

        {selectedFirmware ? (
          <button
            onClick={onSelectFirmwareTab}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 font-mono"
          >
            Change Target Package ({selectedFirmware.buildId})
          </button>
        ) : (
          <button
            onClick={onSelectFirmwareTab}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
          >
            Select Firmware Package
          </button>
        )}
      </div>

      {/* Main Grid: Preflight on Left, Flashing Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pre-Flight Inspection Checklist (1 col) */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pre-Flight Safety Gate</span>
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                preFlight.passedAllCritical ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                {preFlight.passedAllCritical ? 'ALL CRITICAL PASSED' : 'BLOCKED'}
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5 text-xs">
              {/* Battery */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <Battery className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-zinc-300">Battery Level &ge; 50%</span>
                </div>
                <span className={`font-mono font-bold ${preFlight.batterySufficient ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {preFlight.batteryPercent}% {preFlight.batterySufficient ? '✓' : '✗'}
                </span>
              </div>

              {/* Hardware Model Match */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-zinc-300">Hardware Model Match</span>
                <span className={`font-mono font-bold ${preFlight.modelMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {preFlight.modelMatch ? 'MATCHED ✓' : 'MISMATCH ✗'}
                </span>
              </div>

              {/* Cryptographic Hash */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-zinc-300">Cryptographic Digest</span>
                <span className={`font-mono font-bold ${preFlight.firmwareVerified ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {preFlight.firmwareVerified ? 'VERIFIED ✓' : 'UNVERIFIED ✗'}
                </span>
              </div>

              {/* USB Bus Throughput */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-zinc-300">USB Driver Stability</span>
                <span className={`font-mono font-bold ${preFlight.usbSpeedSufficient ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {preFlight.usbSpeedSufficient ? 'OPTIMAL ✓' : 'WARNING ⚠'}
                </span>
              </div>

              {/* Ticket Authorization */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-zinc-300">Customer Intake Waiver</span>
                <span className={`font-mono font-bold ${preFlight.authorizedTicketPresent ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {preFlight.authorizedTicketPresent ? 'DOCUMENTED ✓' : 'MISSING ✗'}
                </span>
              </div>
            </div>

            {/* Blockers Display */}
            {preFlight.blockers.length > 0 && (
              <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-lg space-y-1.5 text-rose-200 text-xs">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Flashing Safety Invariant Tripped:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  {preFlight.blockers.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings Display */}
            {preFlight.warnings.length > 0 && (
              <div className="p-3 bg-amber-950/40 border border-amber-900/80 rounded-lg space-y-1.5 text-amber-200 text-xs">
                <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Operational Advisories:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  {preFlight.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Flashing Orchestrator & Live Terminal (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-sm text-zinc-100">Flashing Execution Controller</h2>
                <p className="text-[11px] text-zinc-400">
                  Target: {selectedFirmware ? `${selectedFirmware.marketingName} (${selectedFirmware.buildId})` : 'None Selected'}
                </p>
              </div>

              {/* Dry-Run Toggle */}
              <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <span className="text-xs font-semibold text-zinc-300">Dry-Run Mode:</span>
                <button
                  onClick={() => !isFlashing && setIsDryRun(!isDryRun)}
                  disabled={isFlashing}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isDryRun ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isDryRun ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-[10px] font-mono font-bold ${isDryRun ? 'text-blue-400' : 'text-rose-400'}`}>
                  {isDryRun ? 'SAFE SIMULATION' : 'LIVE FLASH'}
                </span>
              </div>
            </div>

            {/* Target Package Summary */}
            {selectedFirmware && (
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">OS VERSION</span>
                  <span className="text-zinc-200 font-semibold">{selectedFirmware.osVersion}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">BUILD ID</span>
                  <span className="text-zinc-200 font-semibold">{selectedFirmware.buildId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">REGION / CSC</span>
                  <span className="text-zinc-200 font-semibold">{selectedFirmware.regionCSC}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">DIGEST VERIFIED</span>
                  <span className="text-emerald-400 font-bold">SHA-256 ✓</span>
                </div>
              </div>
            )}

            {/* Progress Bar (during flashing) */}
            {flashProgress && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-200 font-semibold">
                    Partition [{flashProgress.partitionIndex}/{flashProgress.totalPartitions}]: {flashProgress.currentPartition}
                  </span>
                  <span className="text-emerald-400 font-bold">{flashProgress.percent}%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${flashProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Terminal Log Console */}
            <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-xs text-zinc-300 h-64 overflow-y-auto space-y-1 select-text">
              <div className="text-zinc-500 flex items-center gap-1.5 border-b border-zinc-800 pb-2 mb-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>OFFICIAL PROTOCOL EXECUTION TERMINAL</span>
              </div>
              {flashProgress ? (
                flashProgress.logs.map((log, idx) => (
                  <div key={idx} className={log.includes('OK') || log.includes('successful') ? 'text-emerald-400' : log.includes('DRY-RUN') ? 'text-cyan-300' : 'text-zinc-300'}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-zinc-600 italic">
                  Awaiting pre-flight verification and operator execution command...
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-zinc-400">
                {!isDryRun && (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    LIVE FLASH: Will rewrite device system partitions
                  </span>
                )}
              </div>

              <button
                onClick={handleStartFlashingSequence}
                disabled={!preFlight.passedAllCritical || isFlashing}
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                  preFlight.passedAllCritical && !isFlashing
                    ? isDryRun
                      ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                      : 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                }`}
              >
                {isFlashing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Flashing in Progress...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{isDryRun ? 'Run Flashing Dry-Run Simulation' : 'Execute Official Firmware Flash'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Safety Modal */}
      <SafetyConfirmationModal
        isOpen={showConfirmModal}
        title="CRITICAL AUTHORIZATION REQUIRED: LIVE HARDWARE FLASH"
        operationName="OFFICIAL FIRMWARE FLASH"
        targetPhrase="CONFIRM OFFICIAL FLASH"
        dataLossWarning="Executing this operation will rewrite system, vendor, radio, and boot partitions. All existing user data will be permanently wiped if clean-flash parameters are applied."
        frpWarning="Google Factory Reset Protection (FRP) is cryptographically sealed in hardware partition /persist. Flashing official firmware will NOT remove Google account binding."
        onConfirm={() => {
          setShowConfirmModal(false);
          executeFlashingInternal(false);
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
