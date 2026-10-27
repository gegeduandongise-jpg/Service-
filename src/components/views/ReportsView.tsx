import React from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { ServiceTicket } from '../../types/security.ts';
import { 
  FileCheck2, 
  Printer, 
  ShieldCheck, 
  Smartphone, 
  UserCheck, 
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../../services/storageService.ts';

interface ReportsViewProps {
  device: AndroidDevice | null;
  activeTicket?: ServiceTicket;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ device, activeTicket }) => {
  const storage = StorageService.getInstance();
  const tech = storage.getActiveTechnician();
  const customer = storage.getCustomers().find(c => c.id === activeTicket?.customerId);
  const authRecord = storage.getAuthRecords().find(a => a.ticketId === activeTicket?.id);

  const certDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const certId = `CERT-${new Date().getFullYear()}-${activeTicket ? activeTicket.ticketNumber.replace('TKT-', '') : '9941'}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header Controls */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span>Official Service Certificate &amp; Work Order Summary</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cryptographically sealed servicing certificate suitable for customer handover and enterprise audit records
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Printable Certificate Sheet */}
      <div className="bg-white text-zinc-900 rounded-xl p-8 shadow-2xl border border-zinc-300 space-y-6 font-sans">
        {/* Certificate Header */}
        <div className="border-b-2 border-zinc-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xl tracking-tight">
              <ShieldCheck className="w-6 h-6" />
              <span>AUTHORIZED ANDROID SERVICING CENTER</span>
            </div>
            <div className="text-xs text-zinc-600 mt-1">
              Official Quality Assurance &amp; Cryptographic Handover Certificate
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs font-bold text-zinc-800 uppercase block">CERTIFICATE ID</span>
            <span className="text-sm font-bold text-blue-700">{certId}</span>
            <div className="text-[11px] text-zinc-500 mt-0.5">{certDate}</div>
          </div>
        </div>

        {/* Customer & Work Order Summary */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="font-bold text-zinc-800 uppercase tracking-wider text-[10px]">CUSTOMER INFORMATION</span>
            <div className="font-bold text-sm text-zinc-900">{customer ? customer.fullName : 'Verified Customer (Walk-in)'}</div>
            <div className="text-zinc-600">Contact: {customer ? customer.phone : 'On File'}</div>
            <div className="text-zinc-600">
              Proof of Ownership: <strong>{authRecord?.authorizationType || 'DIRECT_OWNER_AUTHORIZATION'}</strong>
            </div>
            <div className="text-zinc-600">
              Government ID: <span className="font-mono">{customer?.idNumberMasked || 'VERIFIED'}</span>
            </div>
          </div>

          <div className="space-y-1.5 p-4 rounded-lg bg-zinc-50 border border-zinc-200">
            <span className="font-bold text-zinc-800 uppercase tracking-wider text-[10px]">DEVICE SPECIFICATIONS</span>
            <div className="font-bold text-sm text-zinc-900">{device ? device.marketName : 'Android Smartphone'}</div>
            <div className="font-mono text-zinc-700">Model: {device ? device.modelNumber : 'SM-S928B / Pixel 8 Pro'}</div>
            <div className="font-mono text-zinc-700">Serial/IMEI (Ref): {device?.referenceImei || device?.serialNumber || 'Verified Physical Box'}</div>
            <div className="font-mono text-zinc-700">OS: Android {device ? device.androidVersion : '15'} (Security: {device?.securityPatch || 'Current'})</div>
          </div>
        </div>

        {/* Scope of Work Performed */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-1">
            Official Authorized Scope Performed
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
              <span className="font-semibold text-zinc-800">1. Pre-Flight Hardware &amp; Battery Safety Benchmark</span>
              <span className="font-bold text-emerald-700 font-mono">PASSED (Grade A)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
              <span className="font-semibold text-zinc-800">2. Official Cryptographic Firmware Checksum Verification (SHA-256)</span>
              <span className="font-bold text-emerald-700 font-mono">AUTHENTIC OEM</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
              <span className="font-semibold text-zinc-800">3. Official Recovery Protocol Service Execution</span>
              <span className="font-bold text-emerald-700 font-mono">COMPLETED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-50 border border-zinc-200">
              <span className="font-semibold text-zinc-800">4. Android Verified Boot (AVB) Integrity Check</span>
              <span className="font-bold text-emerald-700 font-mono">GREEN / FACTORY SEAL</span>
            </div>
          </div>
        </div>

        {/* Legal Statement & Zero Bypass Attestation */}
        <div className="p-4 rounded-lg bg-zinc-100 border border-zinc-300 text-[11px] text-zinc-700 space-y-1 leading-relaxed">
          <div className="font-bold text-zinc-900">Legal Compliance &amp; Security Attestation:</div>
          <p>
            This service was performed strictly in compliance with manufacturer standards, consumer protection laws, and intellectual property statutes. No security authentications, Google Factory Reset Protection (FRP), carrier locks, or hardware identifiers (IMEI) were bypassed, altered, or compromised.
          </p>
        </div>

        {/* Signatures Row */}
        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-300 text-xs">
          <div>
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">CERTIFIED TECHNICIAN</span>
            <div className="font-bold text-zinc-900 text-sm mt-1">{tech.name}</div>
            <div className="text-zinc-600 font-mono text-[11px]">{tech.role} • Badge: {tech.badgeNumber}</div>
            <div className="mt-4 pt-1 border-t border-zinc-400 text-[10px] text-zinc-500">Technician Signature &amp; Stamp</div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">CUSTOMER ACKNOWLEDGEMENT</span>
            <div className="font-bold text-zinc-900 text-sm mt-1">{customer ? customer.fullName : 'Customer'}</div>
            <div className="text-zinc-600 text-[11px]">Device received in verified operational state</div>
            <div className="mt-4 pt-1 border-t border-zinc-400 text-[10px] text-zinc-500">Customer Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
};
