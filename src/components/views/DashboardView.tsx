import React from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { ServiceTicket } from '../../types/security.ts';
import { 
  Smartphone, 
  ShieldCheck, 
  Activity, 
  HardDriveDownload, 
  RotateCcw, 
  Ticket, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Zap, 
  ArrowRight,
  Wifi
} from 'lucide-react';
import { ActiveTab } from '../layout/Sidebar.tsx';

interface DashboardViewProps {
  device: AndroidDevice | null;
  activeTicket?: ServiceTicket;
  tickets: ServiceTicket[];
  isOnline: boolean;
  onNavigate: (tab: ActiveTab) => void;
  onOpenDeviceSwitcher: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  device,
  activeTicket,
  tickets,
  isOnline,
  onNavigate,
  onOpenDeviceSwitcher
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Legal & Compliance Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-zinc-900 border border-blue-900/60 flex items-start justify-between shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base text-zinc-100 flex items-center gap-2">
              <span>Android Device Servicing Platform</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900 text-blue-300 font-semibold border border-blue-700">
                STRICT COMPLIANCE
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              Authorized repair environment designed exclusively for phone technicians, certified service centers, and enterprise IT administrators. This tool enforces official manufacturer recovery workflows and contains <strong>zero bypass mechanisms</strong> for FRP, screen locks, or MDM policies.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-[10px] font-mono text-zinc-400">SESSION AUTHENTICATED</span>
          <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> AUDIT LOGGING ACTIVE
          </span>
        </div>
      </div>

      {/* Main Grid: Connected Device Snapshot & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Device Card (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-sm text-zinc-100">Active USB Handset</h2>
            </div>
            <button
              onClick={onOpenDeviceSwitcher}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Change / Test Device</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {device ? (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <span>{device.marketName}</span>
                    <span className="text-xs font-normal font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {device.modelNumber}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono mt-1 flex flex-wrap items-center gap-2">
                    <span>Android {device.androidVersion} (API {device.sdkVersion})</span>
                    <span>•</span>
                    <span>Build {device.buildNumber}</span>
                    <span>•</span>
                    <span className="text-zinc-300">Security Patch: {device.securityPatch}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block font-mono">BATTERY STATUS</span>
                    <span className={`text-sm font-mono font-bold ${device.batteryLevelPercent < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {device.batteryLevelPercent}% ({device.batteryHealthStatus})
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-center">
                    <span className="text-[10px] text-zinc-400 block font-mono">USB INTERFACE</span>
                    <span className="text-xs font-mono font-bold text-blue-400">{device.connectionMode}</span>
                  </div>
                </div>
              </div>

              {/* Safety & Protection Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                  <span className="text-[10px] font-mono text-zinc-400 block">FRP PROTECTION</span>
                  <div className="font-bold font-mono text-xs mt-1 flex items-center gap-1.5 text-zinc-200">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{device.frpStatus}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Bypass strictly refused</span>
                </div>

                <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                  <span className="text-[10px] font-mono text-zinc-400 block">BOOTLOADER</span>
                  <div className="font-bold font-mono text-xs mt-1 flex items-center gap-1.5 text-zinc-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{device.bootloaderStatus}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">Verified Boot: {device.verifiedBootState}</span>
                </div>

                <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                  <span className="text-[10px] font-mono text-zinc-400 block">DEVICE OWNER / MDM</span>
                  <div className="font-bold font-mono text-xs mt-1 flex items-center gap-1.5 text-zinc-200 truncate">
                    <span>{device.deviceOwnerPackage ? 'ENROLLED' : 'NONE'}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">
                    {device.deviceOwnerPackage || 'Standard retail'}
                  </span>
                </div>

                <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg">
                  <span className="text-[10px] font-mono text-zinc-400 block">SECURITY CHIPSET</span>
                  <div className="font-bold font-mono text-xs mt-1 flex items-center gap-1.5 text-zinc-200 truncate">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                    <span className="truncate">{device.board}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">Titan M2 / TrustZone</span>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => onNavigate('inspector')}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Full Device Inspection</span>
                </button>

                <button
                  onClick={() => onNavigate('diagnostics')}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hardware & Battery Tests</span>
                </button>

                <button
                  onClick={() => onNavigate('firmware')}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Firmware Manager</span>
                </button>

                <button
                  onClick={() => onNavigate('factory_reset')}
                  className="px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-200 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Official Reset Procedure</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-lg border border-dashed border-zinc-800 space-y-3">
              <Smartphone className="w-10 h-10 text-zinc-600 mx-auto" />
              <div className="text-sm font-semibold text-zinc-300">No Android Device Detected via USB</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Connect an Android device via USB with USB debugging enabled, or boot into Fastboot/Recovery mode.
              </p>
              <button
                onClick={onOpenDeviceSwitcher}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Connect Simulated Test Device
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Active Service Ticket & Work Queue */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-zinc-100">Current Work Order</h3>
              </div>
              <button
                onClick={() => onNavigate('tickets')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                All Tickets ({tickets.length})
              </button>
            </div>

            {activeTicket ? (
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-zinc-100 text-sm">{activeTicket.ticketNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase font-bold">
                    {activeTicket.status}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300 font-medium">
                  {activeTicket.deviceLabel}
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  <strong>Issue:</strong> {activeTicket.declaredIssue}
                </p>
                <div className="pt-1 text-[10px] text-zinc-500 font-mono">
                  Created: {new Date(activeTicket.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 text-center text-xs text-zinc-500 space-y-2">
                <p>No active service ticket currently linked to this session.</p>
                <button
                  onClick={() => onNavigate('tickets')}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Create Intake Ticket
                </button>
              </div>
            )}
          </div>

          {/* Offline Ready Status Box */}
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
                <span>Offline-First Environment</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              All diagnostics, local firmware checksum verifications, package risk evaluations, and audit logging operate 100% locally without external network dependence.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Protocol Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="font-bold text-zinc-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Cryptographic Firmware Gating</span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Flashing is hard-blocked unless SHA-256 / SHA-512 hashes and digital signatures match official manufacturer manifests. Corrupted archives cannot be forced.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="font-bold text-zinc-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Bypass Policy Enforcement</span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Requests to circumvent Google FRP, unlock screen locks without owner authorization, or modify device IMEI are strictly rejected with official recovery instructions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="font-bold text-zinc-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Pre-Flight Safety Engine</span>
          </div>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Mandatory check of battery levels (&ge;50%), USB interface stability, model numbers, and technician ticket authorizations before high-risk procedures.
          </p>
        </div>
      </div>
    </div>
  );
};
