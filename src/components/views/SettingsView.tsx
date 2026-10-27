import React, { useState } from 'react';
import { Technician, TechnicianRole } from '../../types/security.ts';
import { 
  Settings, 
  UserCheck, 
  ShieldCheck, 
  Wifi, 
  Usb, 
  Trash2, 
  HardDrive, 
  Check, 
  RefreshCw
} from 'lucide-react';
import { StorageService } from '../../services/storageService.ts';
import { ConnectivityManager, EndpointStatus } from '../../services/connectivityService.ts';

interface SettingsViewProps {
  technician: Technician;
  onTechnicianChange: (tech: Technician) => void;
  onOpenDriverHelp: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  technician,
  onTechnicianChange,
  onOpenDriverHelp
}) => {
  const storage = StorageService.getInstance();
  const conn = ConnectivityManager.getInstance();

  const [techName, setTechName] = useState(technician.name);
  const [techBadge, setTechBadge] = useState(technician.badgeNumber);
  const [techRole, setTechRole] = useState<TechnicianRole>(technician.role);
  const [saveSaved, setSaveSaved] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointStatus[]>(conn.getEndpoints());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Technician = {
      ...technician,
      name: techName,
      badgeNumber: techBadge,
      role: techRole
    };

    // Update in localStorage
    const all = storage.getTechnicians();
    const idx = all.findIndex(t => t.id === updated.id);
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    localStorage.setItem('adst_technicians', JSON.stringify(all));
    storage.setActiveTechnicianId(updated.id);

    onTechnicianChange(updated);
    setSaveSaved(true);
    setTimeout(() => setSaveSaved(false), 2000);
  };

  const handleTestConnectivity = async () => {
    await conn.refreshEndpoints();
    setEndpoints([...conn.getEndpoints()]);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Platform Configuration &amp; RBAC Identity</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Technician role-based permissions, connectivity endpoints, and hardware driver diagnostics
          </p>
        </div>

        <button
          onClick={onOpenDriverHelp}
          className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5"
        >
          <Usb className="w-3.5 h-3.5 text-blue-400" />
          <span>Official Driver Diagnostic Guide</span>
        </button>
      </div>

      {/* Technician Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Operator Profile &amp; Role-Based Access Control (RBAC)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
            TIER: {techRole}
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-zinc-400 font-semibold">Operator Legal Name:</label>
              <input
                type="text"
                required
                value={techName}
                onChange={(e) => setTechName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-zinc-400 font-semibold">Badge / Employee Serial #:</label>
              <input
                type="text"
                required
                value={techBadge}
                onChange={(e) => setTechBadge(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-zinc-400 font-semibold">Assigned Security Role:</label>
              <select
                value={techRole}
                onChange={(e) => setTechRole(e.target.value as TechnicianRole)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="TECHNICIAN">TECHNICIAN (Diagnostics, Tickets, Benchmarks)</option>
                <option value="SUPERVISOR">SUPERVISOR (Flashing, Firmware, Recovery Wipe)</option>
                <option value="ADMINISTRATOR">ADMINISTRATOR (Full Access, Pre-flight Override)</option>
                <option value="AUDITOR">AUDITOR (Compliance, Tamper Log Export)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-zinc-500">
              Role permissions are strictly enforced on all destructive write operations.
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
            >
              {saveSaved ? <Check className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{saveSaved ? 'Profile Saved' : 'Update Active Identity'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Connectivity & Endpoint Diagnostic Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
            <Wifi className="w-4 h-4 text-blue-400" />
            <span>OEM CDN &amp; Cloud Verification Endpoints</span>
          </div>
          <button
            onClick={handleTestConnectivity}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-test Endpoints</span>
          </button>
        </div>

        <div className="grid gap-2 text-xs font-mono">
          {endpoints.map((ep, idx) => (
            <div
              key={idx}
              className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-zinc-200 font-sans">{ep.name}</span>
                <div className="text-[10px] text-zinc-400 truncate">{ep.host}</div>
              </div>
              <div className="flex items-center gap-3">
                {ep.latencyMs && (
                  <span className="text-[10px] text-zinc-400">{ep.latencyMs} ms</span>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ep.status === 'ONLINE'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {ep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
