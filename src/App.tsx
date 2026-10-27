import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.tsx';
import { Sidebar, ActiveTab } from './components/layout/Sidebar.tsx';
import { DashboardView } from './components/views/DashboardView.tsx';
import { DeviceInspectorView } from './components/views/DeviceInspectorView.tsx';
import { DiagnosticsView } from './components/views/DiagnosticsView.tsx';
import { FirmwareManagerView } from './components/views/FirmwareManagerView.tsx';
import { OfficialFlashingView } from './components/views/OfficialFlashingView.tsx';
import { FactoryResetView } from './components/views/FactoryResetView.tsx';
import { SecurityLockView } from './components/views/SecurityLockView.tsx';
import { MalwareDiagnosticView } from './components/views/MalwareDiagnosticView.tsx';
import { EnterpriseMdmView } from './components/views/EnterpriseMdmView.tsx';
import { ServiceTicketsView } from './components/views/ServiceTicketsView.tsx';
import { AuditLedgerView } from './components/views/AuditLedgerView.tsx';
import { ReportsView } from './components/views/ReportsView.tsx';
import { PluginsView } from './components/views/PluginsView.tsx';
import { SettingsView } from './components/views/SettingsView.tsx';
import { ComplianceView } from './components/views/ComplianceView.tsx';

import { DeviceSwitcherModal } from './components/modals/DeviceSwitcherModal.tsx';
import { DriverHelpModal } from './components/modals/DriverHelpModal.tsx';

import { UsbConnectionEngine } from './services/usbConnectionEngine.ts';
import { StorageService } from './services/storageService.ts';
import { ConnectivityManager } from './services/connectivityService.ts';
import { MalwareDiagnosticEngine } from './services/malwareDiagnosticEngine.ts';

import { AndroidDevice } from './types/device.ts';
import { Technician, ServiceTicket } from './types/security.ts';
import { FirmwarePackage } from './types/firmware.ts';

export function App() {
  const usbEngine = UsbConnectionEngine.getInstance();
  const storage = StorageService.getInstance();
  const connectivity = ConnectivityManager.getInstance();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentDevice, setCurrentDevice] = useState<AndroidDevice | null>(usbEngine.getCurrentDevice());
  const [technician, setTechnician] = useState<Technician>(storage.getActiveTechnician());
  const [tickets, setTickets] = useState<ServiceTicket[]>(storage.getTickets());
  const [activeTicket, setActiveTicket] = useState<ServiceTicket | undefined>(storage.getActiveTicket());
  const [isOnline, setIsOnline] = useState<boolean>(connectivity.getIsOnline());
  const [selectedFirmware, setSelectedFirmware] = useState<FirmwarePackage | null>(null);

  // Modals
  const [isDeviceSwitcherOpen, setIsDeviceSwitcherOpen] = useState(false);
  const [isDriverHelpOpen, setIsDriverHelpOpen] = useState(false);

  // Subscribe to USB connection changes
  useEffect(() => {
    const unsub = usbEngine.subscribe((device) => {
      setCurrentDevice(device ? { ...device } : null);
    });
    return () => unsub();
  }, [usbEngine]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync active ticket on tickets update
  const refreshTickets = () => {
    const updated = storage.getTickets();
    setTickets([...updated]);
    setActiveTicket(storage.getActiveTicket());
  };

  const handleSelectFirmwareForFlashing = (pkg: FirmwarePackage) => {
    setSelectedFirmware(pkg);
    setActiveTab('flashing');
  };

  const targetDevice = currentDevice || UsbConnectionEngine.SAMPLE_DEVICES[0];
  const highRiskMalwareCount = MalwareDiagnosticEngine.analyzeDevicePackages(targetDevice)
    .filter(p => p.riskClassification === 'CRITICAL_RISK').length;
  const unverifiedFirmwareCount = storage.getFirmwarePackages().filter(p => p.status !== 'VERIFIED').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Application Bar */}
      <Header
        device={currentDevice}
        technician={technician}
        activeTicket={activeTicket}
        isOnline={isOnline}
        onOpenDeviceSwitcher={() => setIsDeviceSwitcherOpen(true)}
        onOpenDriverHelp={() => setIsDriverHelpOpen(true)}
        onOpenTicketSelector={() => setActiveTab('tickets')}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          ticketCount={tickets.length}
          unverifiedFirmwareCount={unverifiedFirmwareCount}
          malwareAlertCount={highRiskMalwareCount}
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/50">
          {activeTab === 'dashboard' && (
            <DashboardView
              device={currentDevice}
              activeTicket={activeTicket}
              tickets={tickets}
              isOnline={isOnline}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenDeviceSwitcher={() => setIsDeviceSwitcherOpen(true)}
            />
          )}

          {activeTab === 'inspector' && (
            <DeviceInspectorView
              device={currentDevice}
              onOpenDriverHelp={() => setIsDriverHelpOpen(true)}
              onOpenDeviceSwitcher={() => setIsDeviceSwitcherOpen(true)}
            />
          )}

          {activeTab === 'diagnostics' && (
            <DiagnosticsView device={currentDevice} />
          )}

          {activeTab === 'firmware' && (
            <FirmwareManagerView
              device={currentDevice}
              onSelectFirmwareForFlashing={handleSelectFirmwareForFlashing}
            />
          )}

          {activeTab === 'flashing' && (
            <OfficialFlashingView
              device={currentDevice}
              selectedFirmware={selectedFirmware}
              activeTicket={activeTicket}
              onSelectFirmwareTab={() => setActiveTab('firmware')}
            />
          )}

          {activeTab === 'factory_reset' && (
            <FactoryResetView
              device={currentDevice}
              activeTicket={activeTicket}
            />
          )}

          {activeTab === 'security_lock' && (
            <SecurityLockView device={currentDevice} />
          )}

          {activeTab === 'malware' && (
            <MalwareDiagnosticView device={currentDevice} />
          )}

          {activeTab === 'enterprise' && (
            <EnterpriseMdmView device={currentDevice} />
          )}

          {activeTab === 'tickets' && (
            <ServiceTicketsView
              device={currentDevice}
              activeTicket={activeTicket}
              tickets={tickets}
              onSelectActiveTicket={(t) => setActiveTicket(t)}
              onRefreshTickets={refreshTickets}
            />
          )}

          {activeTab === 'audit_logs' && (
            <AuditLedgerView />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              device={currentDevice}
              activeTicket={activeTicket}
            />
          )}

          {activeTab === 'plugins' && (
            <PluginsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              technician={technician}
              onTechnicianChange={(tech) => setTechnician(tech)}
              onOpenDriverHelp={() => setIsDriverHelpOpen(true)}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <DeviceSwitcherModal
        isOpen={isDeviceSwitcherOpen}
        currentDevice={currentDevice}
        onClose={() => setIsDeviceSwitcherOpen(false)}
      />

      <DriverHelpModal
        isOpen={isDriverHelpOpen}
        device={currentDevice}
        onClose={() => setIsDriverHelpOpen(false)}
      />
    </div>
  );
}

export default App;
