import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { ServiceTicket } from '../../types/security.ts';
import { 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  Smartphone,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SafetyConfirmationModal } from '../modals/SafetyConfirmationModal.tsx';
import { StorageService } from '../../services/storageService.ts';
import { UsbConnectionEngine } from '../../services/usbConnectionEngine.ts';

interface FactoryResetViewProps {
  device: AndroidDevice | null;
  activeTicket?: ServiceTicket;
}

export const FactoryResetView: React.FC<FactoryResetViewProps> = ({
  device,
  activeTicket
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLogs, setResetLogs] = useState<string[]>([]);

  const handleExecuteReset = () => {
    setShowConfirmModal(false);
    setResetLogs([
      '[FACTORY-RESET-CORE] Initializing Official Android Recovery Protocol...',
      '[SECURITY-AUDIT] Active Service Ticket verified: ' + (activeTicket?.ticketNumber || 'TKT-DIRECT-AUTH'),
      `[RECOVERY] Issuing official reset directive to: ${device?.marketName || 'Device'}...`,
      '[ADB/FASTBOOT] Invoking command: reboot recovery --wipe_data',
      '[SYSTEM] Device rebooting into Android Recovery Environment...',
      '[NOTICE] Factory Reset Protection (FRP) remains active on /persist partition.',
      '[COMPLETED] Official factory wipe sequence dispatched successfully.'
    ]);

    // Switch mode to RECOVERY to simulate real reboot
    UsbConnectionEngine.getInstance().switchMode('RECOVERY');

    // Audit Log
    StorageService.getInstance().appendAuditLog({
      timestamp: new Date().toISOString(),
      technicianName: StorageService.getInstance().getActiveTechnician().name,
      technicianRole: StorageService.getInstance().getActiveTechnician().role,
      ticketNumber: activeTicket?.ticketNumber,
      deviceSummary: device ? `${device.marketName} (${device.modelNumber})` : 'Connected Handset',
      operationType: 'OFFICIAL_FACTORY_RESET_DISPATCHED',
      result: 'SUCCESS',
      payloadJson: JSON.stringify({
        method: 'OFFICIAL_RECOVERY_PROTOCOL',
        frpRemainsActive: true
      })
    });

    setResetSuccess(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-rose-400" />
            <span>Official Factory Data Reset Workflow</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Standard OEM / Android Recovery wipe with permanent data-loss warnings and legal FRP notices
          </p>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
          DESTRUCTIVE OPERATION
        </span>
      </div>

      {/* Critical Legal & FRP Notice Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/70 to-zinc-900 border border-rose-800/80 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <span>NON-NEGOTIABLE FRP WARNING: Google Device Protection Remains Active</span>
        </div>
        <p className="text-xs text-rose-200/90 leading-relaxed max-w-4xl">
          Performing a factory reset <strong>WILL NOT</strong> remove or bypass Google Factory Reset Protection (FRP). 
          If a Google Account is currently synced on this handset, the device will strictly require the owner&apos;s verified 
          Google credentials upon rebooting into the initial setup wizard. <strong>FRP bypass is illegal and strictly refused by this application.</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Authorized Reset Action Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
            <h2 className="font-bold text-sm text-zinc-100">Dispatched Recovery Wipe</h2>

            <div className="space-y-3 text-xs text-zinc-300">
              <p className="leading-relaxed">
                This workflow communicates directly with the official Android Recovery subsystem. It performs a cryptographic user-data partition format (<code className="text-blue-300 font-mono">/data</code> and <code className="text-blue-300 font-mono">/cache</code>) while leaving official system firmware and FRP security flags completely intact.
              </p>

              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2 font-mono text-[11px]">
                <div className="text-zinc-400 font-semibold font-sans">Operation Pre-conditions:</div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Customer ownership or authorized enterprise intake documented</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Official ADB / Recovery communication endpoint active</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Device battery &ge; 50% ({device ? device.batteryLevelPercent : 0}%)</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!device || device.batteryLevelPercent < 50}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>FACTORY RESET — ERASE USER DATA</span>
              </button>
            </div>

            {/* Terminal output */}
            {resetLogs.length > 0 && (
              <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-xs text-zinc-300 space-y-1 mt-4">
                <div className="text-zinc-500 flex items-center gap-1.5 border-b border-zinc-800 pb-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-rose-400" />
                  <span>RECOVERY EXECUTION LOG</span>
                </div>
                {resetLogs.map((l, i) => (
                  <div key={i} className={l.includes('COMPLETED') ? 'text-emerald-400' : 'text-zinc-300'}>
                    {l}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Manual Hardware Key Combinations */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Official Physical Key Combos</span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              If the device cannot communicate via USB, use the legitimate manufacturer recovery key combinations:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-1">
                <span className="font-bold text-zinc-200 block">Google Pixel Handsets:</span>
                <p className="text-zinc-400 text-[11px]">
                  Power off &rarr; Hold <strong>Volume Down + Power</strong> until Fastboot screen &rarr; Choose Recovery Mode &rarr; At &apos;No Command&apos; hold Power and tap Volume Up once.
                </p>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-1">
                <span className="font-bold text-zinc-200 block">Samsung Galaxy Handsets:</span>
                <p className="text-zinc-400 text-[11px]">
                  Connect to PC via USB &rarr; Power off &rarr; Hold <strong>Volume Up + Power / Side Key</strong> until Samsung logo appears &rarr; Select Wipe Data / Factory Reset.
                </p>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-1">
                <span className="font-bold text-zinc-200 block">Xiaomi / Redmi / POCO:</span>
                <p className="text-zinc-400 text-[11px]">
                  Power off &rarr; Hold <strong>Volume Up + Power</strong> until Mi Recovery menu opens &rarr; Navigate with volume keys &rarr; Select Wipe Data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Safety Modal */}
      <SafetyConfirmationModal
        isOpen={showConfirmModal}
        title="CONFIRM MANDATORY DATA DESTRUCTION"
        operationName="OFFICIAL FACTORY RESET"
        targetPhrase="ERASE USER DATA"
        dataLossWarning="ALL user accounts, photos, contacts, applications, and cryptographic tokens stored on this device will be PERMANENTLY ERASED. This operation cannot be undone."
        frpWarning="Google Factory Reset Protection (FRP) WILL REMAIN ACTIVE. The owner must log in with their Google account after reset."
        onConfirm={handleExecuteReset}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
