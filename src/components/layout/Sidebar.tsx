import React from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Activity, 
  HardDriveDownload, 
  Zap, 
  RotateCcw, 
  Lock, 
  Bug, 
  Building2, 
  Ticket, 
  FileSpreadsheet, 
  FileCheck2, 
  Puzzle, 
  Settings, 
  Scale
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard'
  | 'inspector'
  | 'diagnostics'
  | 'firmware'
  | 'flashing'
  | 'factory_reset'
  | 'security_lock'
  | 'malware'
  | 'enterprise'
  | 'tickets'
  | 'audit_logs'
  | 'reports'
  | 'plugins'
  | 'settings'
  | 'compliance';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  ticketCount: number;
  unverifiedFirmwareCount: number;
  malwareAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  ticketCount,
  unverifiedFirmwareCount,
  malwareAlertCount
}) => {
  const navSections = [
    {
      group: 'DEVICE OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inspector', label: 'Device Inspector', icon: Smartphone },
        { id: 'diagnostics', label: 'Hardware Diagnostics', icon: Activity },
        { 
          id: 'firmware', 
          label: 'Firmware Manager', 
          icon: HardDriveDownload,
          badge: unverifiedFirmwareCount > 0 ? unverifiedFirmwareCount : undefined,
          badgeColor: 'bg-amber-900 text-amber-300'
        },
        { id: 'flashing', label: 'Official Flashing', icon: Zap },
        { id: 'factory_reset', label: 'Official Factory Reset', icon: RotateCcw, danger: true }
      ]
    },
    {
      group: 'SECURITY & DIAGNOSTICS',
      items: [
        { id: 'security_lock', label: 'Security & Lock Screen', icon: Lock },
        { 
          id: 'malware', 
          label: 'Malware & App Audit', 
          icon: Bug,
          badge: malwareAlertCount > 0 ? malwareAlertCount : undefined,
          badgeColor: 'bg-rose-900 text-rose-300'
        },
        { id: 'enterprise', label: 'Enterprise / MDM', icon: Building2 }
      ]
    },
    {
      group: 'MANAGEMENT & AUDIT',
      items: [
        { 
          id: 'tickets', 
          label: 'Service Tickets', 
          icon: Ticket,
          badge: ticketCount > 0 ? ticketCount : undefined,
          badgeColor: 'bg-blue-900 text-blue-300'
        },
        { id: 'audit_logs', label: 'Audit Ledger', icon: FileSpreadsheet },
        { id: 'reports', label: 'Reports & Certificates', icon: FileCheck2 },
        { id: 'plugins', label: 'OEM Plugins', icon: Puzzle },
        { id: 'settings', label: 'Settings & Drivers', icon: Settings },
        { id: 'compliance', label: 'Legal & Compliance', icon: Scale }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] overflow-y-auto select-none">
      <div className="p-3 space-y-5">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              {sec.group}
            </div>
            <div className="space-y-0.5">
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                        : item.danger
                        ? 'text-zinc-300 hover:bg-rose-950/40 hover:text-rose-300'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.danger ? 'text-rose-400' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${item.badgeColor || 'bg-zinc-800 text-zinc-300'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Bottom Notice */}
      <div className="p-3 border-t border-zinc-900 bg-zinc-950/60">
        <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Zero-Bypass Policy</span>
          </div>
          <p className="text-[10px] leading-relaxed text-zinc-400">
            FRP, MDM, Knox, screen lock & IMEI modifications are prohibited and blocked by application design.
          </p>
        </div>
      </div>
    </aside>
  );
};
