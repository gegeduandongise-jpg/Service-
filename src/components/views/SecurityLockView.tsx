import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { LegalSecurityPolicyEngine } from '../../domain/policyEngine.ts';
import { StorageService } from '../../services/storageService.ts';
import { 
  ShieldAlert, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Smartphone,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface SecurityLockViewProps {
  device: AndroidDevice | null;
}

export const SecurityLockView: React.FC<SecurityLockViewProps> = ({ device }) => {
  const [activeRefusalModal, setActiveRefusalModal] = useState<any | null>(null);
  const storage = StorageService.getInstance();
  const tech = storage.getActiveTechnician();

  const handleAttemptProhibitedOp = (opType: 'FRP_BYPASS' | 'SCREEN_LOCK_BYPASS' | 'IMEI_REPAIR') => {
    // Pass through LegalSecurityPolicyEngine
    const check = LegalSecurityPolicyEngine.evaluateOperation(opType, {
      technician: tech,
      device
    });

    if (!check.isPermitted && check.errorDetail) {
      // Log refusal into tamper-evident audit ledger
      storage.appendAuditLog({
        timestamp: new Date().toISOString(),
        technicianName: tech.name,
        technicianRole: tech.role,
        deviceSummary: device ? `${device.marketName} (${device.modelNumber})` : 'Unknown Android Device',
        operationType: `ATTEMPTED_${opType}`,
        result: 'BLOCKED_BY_POLICY',
        error: check.errorDetail.humanMessage
      });

      setActiveRefusalModal(check.errorDetail);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-400" />
            <span>Security Lock Policies & Identity Enforcement</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Strict verification of Google FRP, screen-lock, Weaver hardware keystore, and non-negotiable policy rejection engine
          </p>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
          ZERO-BYPASS ARCHITECTURE
        </span>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-rose-950/20 border border-rose-900/60 rounded-xl p-4 flex items-start gap-3">
        <Scale className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-200 space-y-1">
          <span className="font-bold text-rose-300">Statutory and Anti-Circumvention Mandate:</span>
          <p className="text-rose-200/90 leading-relaxed text-[11px]">
            In compliance with 18 U.S.C. § 1030 (CFAA), DMCA Section 1201, and OEM authorization contracts, this tool <strong>strictly refuses</strong> any bypass of Google Factory Reset Protection (FRP), PIN/Pattern locks, Weaver encryption chips, or IMEI hardware serials. All requests trigger an immutable cryptographic audit record.
          </p>
        </div>
      </div>

      {/* Interactive Policy Validation Demonstrators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FRP Tile */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-zinc-200">Google Account / FRP</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              PROTECTED
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Persistent token partition in eMMC/UFS storage. Erasing token without owner credentials trips hardware attestation.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleAttemptProhibitedOp('FRP_BYPASS')}
              className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Test FRP Bypass Attempt</span>
            </button>
          </div>
        </div>

        {/* Lock Screen Credential Tile */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-zinc-200">Screen Lock / Weaver Keystore</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              HARDWARE ENCRYPTED
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Direct credential extraction or hash removal without cryptographic wipe is mathematically impossible without owner authentication.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleAttemptProhibitedOp('SCREEN_LOCK_BYPASS')}
              className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Test Screen Lock Bypass</span>
            </button>
          </div>
        </div>

        {/* IMEI Alteration Tile */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-zinc-200">IMEI / Baseband Calibration</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              PERMANENT CHIPSET NVRAM
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Rewriting, generating, or spoofing hardware IMEI numbers is a felony under telecommunications law and GSMA regulations.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleAttemptProhibitedOp('IMEI_REPAIR')}
              className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Test IMEI Modification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Authorized Solutions Guidance */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Official Manufacturer &amp; Authorized Recovery Protocols</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <span className="font-bold text-zinc-200">Official Google Account Recovery:</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              If the device owner cannot remember their Google password, direct them to Google&apos;s verified account recovery portal from a recognized browser.
            </p>
            <a
              href="https://g.co/recover"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold pt-1"
            >
              <span>g.co/recover</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <span className="font-bold text-zinc-200">Samsung SmartThings Find / Remote Unlock:</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              For Samsung devices registered to an active Samsung Account with Remote Unlock previously enabled, the owner can authenticate online.
            </p>
            <a
              href="https://smartthingsfind.samsung.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold pt-1"
            >
              <span>smartthingsfind.samsung.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal for Policy Refusal Notification */}
      {activeRefusalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-zinc-900 border border-rose-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-base text-zinc-100">{activeRefusalModal.title}</h3>
                <span className="text-[10px] font-mono text-rose-400">POLICY VIOLATION BLOCKED & AUDITED</span>
              </div>
            </div>

            <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-lg text-xs text-rose-200 leading-relaxed">
              {activeRefusalModal.humanMessage}
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300">
              <span className="font-bold text-zinc-200 block">Official Authorized Solution:</span>
              <div className="text-[11px] text-zinc-400">{activeRefusalModal.officialSolution}</div>
            </div>

            {activeRefusalModal.recoveryInstructions && (
              <div className="space-y-1.5 text-xs text-zinc-300">
                <span className="font-bold text-zinc-200 block">Prescribed Action:</span>
                <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-1">
                  {activeRefusalModal.recoveryInstructions.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setActiveRefusalModal(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                Acknowledge Policy Refusal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
