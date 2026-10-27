import React from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { Technician, ServiceTicket } from '../../types/security.ts';
import { Usb, ShieldCheck, Wifi, WifiOff, AlertTriangle, Smartphone, FileText, UserCheck, RefreshCw } from 'lucide-react';
import { ConnectivityManager } from '../../services/connectivityService.ts';

interface HeaderProps {
  device: AndroidDevice | null;
  technician: Technician;
  activeTicket?: ServiceTicket;
  isOnline: boolean;
  onOpenDeviceSwitcher: () => void;
  onOpenDriverHelp: () => void;
  onOpenTicketSelector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  device,
  technician,
  activeTicket,
  isOnline,
  onOpenDeviceSwitcher,
  onOpenDriverHelp,
  onOpenTicketSelector
}) => {
  const connectivity = ConnectivityManager.getInstance();

  const getModeBadgeClass = (mode: string) => {
    switch (mode) {
      case 'ADB':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-700/50';
      case 'FASTBOOT':
        return 'bg-amber-950/70 text-amber-400 border-amber-700/50';
      case 'RECOVERY':
        return 'bg-purple-950/70 text-purple-400 border-purple-700/50';
      case 'AUTHORIZED_SERVICE_MODE':
        return 'bg-cyan-950/70 text-cyan-400 border-cyan-700/50';
      case 'USB_GENERIC':
        return 'bg-yellow-950/70 text-yellow-400 border-yellow-700/50';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <header className="h-14 bg-zinc-900/95 border-b border-zinc-800 px-4 flex items-center justify-between select-none z-20 backdrop-blur-sm">
      {/* Brand & Legal Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-zinc-100">Android Servicing Tool</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                PRO v4.2
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>LEGAL & AUTHORIZED USE ONLY • ZERO BYPASS ENFORCED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Hardware Connection Pill */}
      <div className="flex items-center gap-2">
        {device ? (
          <button
            onClick={onOpenDeviceSwitcher}
            title="Click to switch simulated device profile or test connection"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/80 transition-colors text-xs text-zinc-200 group"
          >
            <Usb className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-zinc-100">{device.marketName}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${getModeBadgeClass(device.connectionMode)}`}>
              {device.connectionMode}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              BAT: <span className={device.batteryLevelPercent < 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{device.batteryLevelPercent}%</span>
            </span>
            <RefreshCw className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 ml-1" />
          </button>
        ) : (
          <button
            onClick={onOpenDeviceSwitcher}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-400"
          >
            <Usb className="w-3.5 h-3.5 text-zinc-500" />
            <span>No Android Device Connected</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              IDLE
            </span>
          </button>
        )}

        {device && !device.usbInfo.driverInstalled && (
          <button
            onClick={onOpenDriverHelp}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-300 text-xs font-medium animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Driver Missing</span>
          </button>
        )}
      </div>

      {/* Right: Active Ticket, Offline Status, RBAC Profile */}
      <div className="flex items-center gap-2.5">
        {/* Active Service Ticket Indicator */}
        <button
          onClick={onOpenTicketSelector}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 transition-colors"
          title="Active Service Ticket"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono text-[11px] font-semibold">
            {activeTicket ? activeTicket.ticketNumber : 'No Active Ticket'}
          </span>
          {activeTicket && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase font-bold">
              {activeTicket.status}
            </span>
          )}
        </button>

        {/* Network Reachability Pill */}
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium ${
            isOnline 
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
          }`}
          title={isOnline ? 'Online: OEM catalogs & official services reachable' : 'Offline: Local servicing & verification active'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400" /> : <WifiOff className="w-3.5 h-3.5 text-zinc-500" />}
          <span className="text-[11px] font-mono">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>

        {/* Technician RBAC Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-left leading-tight hidden lg:block">
            <div className="text-xs font-semibold text-zinc-200">{technician.name}</div>
            <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
              <span className="text-blue-400 font-bold">{technician.role}</span>
              <span>•</span>
              <span>{technician.badgeNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
