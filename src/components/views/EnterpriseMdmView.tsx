import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { LegalSecurityPolicyEngine } from '../../domain/policyEngine.ts';
import { StorageService } from '../../services/storageService.ts';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  ExternalLink, 
  FileText, 
  Smartphone,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface EnterpriseMdmViewProps {
  device: AndroidDevice | null;
}

export const EnterpriseMdmView: React.FC<EnterpriseMdmViewProps> = ({ device }) => {
  const [refusalModal, setRefusalModal] = useState<any | null>(null);
  const storage = StorageService.getInstance();
  const tech = storage.getActiveTechnician();

  const handleAttemptBypassMdm = () => {
    const check = LegalSecurityPolicyEngine.evaluateOperation('BYPASS_MDM', {
      technician: tech,
      device
    });

    if (!check.isPermitted && check.errorDetail) {
      storage.appendAuditLog({
        timestamp: new Date().toISOString(),
        technicianName: tech.name,
        technicianRole: tech.role,
        deviceSummary: device ? `${device.marketName} (${device.modelNumber})` : 'Unknown Device',
        operationType: 'ATTEMPTED_MDM_BYPASS',
        result: 'BLOCKED_BY_POLICY',
        error: check.errorDetail.humanMessage
      });

      setRefusalModal(check.errorDetail);
    }
  };

  const hasDeviceOwner = Boolean(device?.deviceOwnerPackage);
  const isKnoxActive = Boolean(device?.knoxActive);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Enterprise MDM, Device Owner &amp; Knox Guard Inspection</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cryptographic inspection of enterprise profiles, Samsung Knox enrollment, and official IT administrator deprovisioning workflows
          </p>
        </div>

        <span className={`text-[11px] font-mono px-2.5 py-1 rounded border font-bold ${
          hasDeviceOwner || isKnoxActive
            ? 'bg-amber-950 text-amber-300 border-amber-800'
            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
        }`}>
          {hasDeviceOwner || isKnoxActive ? 'MANAGED ENTERPRISE ASSET' : 'UNMANAGED DEVICE'}
        </span>
      </div>

      {/* Enterprise Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Device Owner Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-zinc-200">Device Owner (DO)</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              hasDeviceOwner
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {hasDeviceOwner ? 'ACTIVE' : 'NONE'}
            </span>
          </div>
          <div className="text-xs text-zinc-400 space-y-1">
            <div>Package: <code className="text-zinc-300 font-mono">{device?.deviceOwnerPackage || 'Not Assigned'}</code></div>
            <div className="text-[11px] text-zinc-500">Device Owner enforces complete hardware policy control and remote wipes.</div>
          </div>
        </div>

        {/* Samsung Knox Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-zinc-200">Samsung Knox Enrollment</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              isKnoxActive
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-zinc-800 text-zinc-400'
            }`}>
              {isKnoxActive ? 'ENROLLED' : 'NOT ENROLLED'}
            </span>
          </div>
          <div className="text-xs text-zinc-400 space-y-1">
            <div>Knox Warranty Bit: <code className="text-emerald-400 font-mono">0x{device?.knoxWarrantyBit ?? 0} (Official Factory Seal)</code></div>
            <div className="text-[11px] text-zinc-500">Enforces hardware-backed cryptographic attestation with Samsung cloud.</div>
          </div>
        </div>

        {/* Zero-Touch / EMM */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-zinc-200">Google Zero-Touch (ZTE)</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
              PORTAL CHECK
            </span>
          </div>
          <div className="text-xs text-zinc-400 space-y-1">
            <div>Attestation: <span className="text-zinc-300 font-mono">DPC Clouddpc Provisioner</span></div>
            <div className="text-[11px] text-zinc-500">Auto-downloads MDM upon initial Wi-Fi setup after any factory reset.</div>
          </div>
        </div>
      </div>

      {/* Prohibited Operation Refusal Button */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>MDM Removal / Deprovisioning Gate</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Testing circumvention triggers the policy engine to reject and record unauthorized tampering
            </p>
          </div>

          <button
            onClick={handleAttemptBypassMdm}
            className="px-4 py-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Attempt MDM / Device Owner Removal</span>
          </button>
        </div>
      </div>

      {/* Official IT Deprovisioning Protocol */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Official Authorized IT Administrator Deprovisioning Process</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <span className="font-bold text-zinc-200">1. Google Zero-Touch Portal Deprovisioning:</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              The enterprise customer must log into their verified Google Zero-Touch reseller portal and remove the device IMEI/Serial from their fleet assignment.
            </p>
            <a
              href="https://partner.android.com/zerotouch"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold"
            >
              <span>Zero-Touch Customer Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <span className="font-bold text-zinc-200">2. Samsung Knox Mobile Enrollment (KME):</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Samsung fleet devices must be cleared from the Samsung Knox Cloud portal profile before clean re-enrollment or handover to secondary owners.
            </p>
            <a
              href="https://www.samsungknox.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold"
            >
              <span>Samsung Knox Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Refusal Modal */}
      {refusalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-rose-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <Lock className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-base text-zinc-100">{refusalModal.title}</h3>
                <span className="text-[10px] font-mono text-rose-400">ENTERPRISE POLICY INVIOLABLE</span>
              </div>
            </div>

            <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-lg text-xs text-rose-200 leading-relaxed">
              {refusalModal.humanMessage}
            </div>

            <div className="space-y-1.5 text-xs text-zinc-300">
              <span className="font-bold text-zinc-200 block">Prescribed Solution:</span>
              <div className="text-[11px] text-zinc-400">{refusalModal.officialSolution}</div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setRefusalModal(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                Close &amp; Return to Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
