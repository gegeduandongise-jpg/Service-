import { AndroidDevice } from '../types/device.ts';
import { Technician, Customer, ServiceTicket, AuthorizationRecord, AuditLogEntry } from '../types/security.ts';
import { FirmwarePackage, FirmwareDownloadState } from '../types/firmware.ts';
import { DiagnosticReport, AppPackageInfo } from '../types/diagnostics.ts';

const STORAGE_KEYS = {
  TECHNICIANS: 'adst_technicians',
  CUSTOMERS: 'adst_customers',
  TICKETS: 'adst_tickets',
  AUTH_RECORDS: 'adst_auth_records',
  DEVICES: 'adst_devices',
  FIRMWARE_PACKAGES: 'adst_firmware_packages',
  DOWNLOAD_STATES: 'adst_download_states',
  AUDIT_LOGS: 'adst_audit_logs',
  DIAGNOSTIC_REPORTS: 'adst_diagnostic_reports',
  ACTIVE_TECH_ID: 'adst_active_tech_id',
  ACTIVE_TICKET_ID: 'adst_active_ticket_id',
  APP_SETTINGS: 'adst_settings'
};

export class StorageService {
  private static instance: StorageService;

  private constructor() {
    this.seedDefaultDataIfEmpty();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // --- Technicians ---
  public getTechnicians(): Technician[] {
    const data = localStorage.getItem(STORAGE_KEYS.TECHNICIANS);
    return data ? JSON.parse(data) : [];
  }

  public getActiveTechnician(): Technician {
    const techs = this.getTechnicians();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TECH_ID);
    return techs.find(t => t.id === activeId) || techs[0];
  }

  public setActiveTechnicianId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TECH_ID, id);
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  }

  public addCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    customers.push(customer);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  // --- Tickets ---
  public getTickets(): ServiceTicket[] {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return data ? JSON.parse(data) : [];
  }

  public getActiveTicket(): ServiceTicket | undefined {
    const tickets = this.getTickets();
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TICKET_ID);
    return tickets.find(t => t.id === activeId);
  }

  public setActiveTicketId(id: string | null): void {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TICKET_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TICKET_ID);
    }
  }

  public saveTicket(ticket: ServiceTicket): void {
    const tickets = this.getTickets();
    const idx = tickets.findIndex(t => t.id === ticket.id);
    if (idx >= 0) {
      tickets[idx] = ticket;
    } else {
      tickets.unshift(ticket);
    }
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }

  // --- Authorization Records ---
  public getAuthRecords(): AuthorizationRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_RECORDS);
    return data ? JSON.parse(data) : [];
  }

  public saveAuthRecord(record: AuthorizationRecord): void {
    const records = this.getAuthRecords();
    records.push(record);
    localStorage.setItem(STORAGE_KEYS.AUTH_RECORDS, JSON.stringify(records));
  }

  // --- Firmware Packages ---
  public getFirmwarePackages(): FirmwarePackage[] {
    const data = localStorage.getItem(STORAGE_KEYS.FIRMWARE_PACKAGES);
    return data ? JSON.parse(data) : [];
  }

  public saveFirmwarePackage(pkg: FirmwarePackage): void {
    const list = this.getFirmwarePackages();
    const idx = list.findIndex(p => p.id === pkg.id);
    if (idx >= 0) {
      list[idx] = pkg;
    } else {
      list.push(pkg);
    }
    localStorage.setItem(STORAGE_KEYS.FIRMWARE_PACKAGES, JSON.stringify(list));
  }

  // --- Download States ---
  public getDownloadStates(): FirmwareDownloadState[] {
    const data = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_STATES);
    return data ? JSON.parse(data) : [];
  }

  public saveDownloadState(state: FirmwareDownloadState): void {
    const list = this.getDownloadStates();
    const idx = list.findIndex(s => s.id === state.id);
    if (idx >= 0) {
      list[idx] = state;
    } else {
      list.push(state);
    }
    localStorage.setItem(STORAGE_KEYS.DOWNLOAD_STATES, JSON.stringify(list));
  }

  // --- Audit Logs (Tamper Evident) ---
  public getAuditLogs(): AuditLogEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return data ? JSON.parse(data) : [];
  }

  public appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'prevHash' | 'recordHash'>): AuditLogEntry {
    const logs = this.getAuditLogs();
    const prevHash = logs.length > 0 ? logs[logs.length - 1].recordHash : 'GENESIS_HASH_00000000000000000000000000000000';
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Compute simple reproducible record hash simulation
    const rawPayload = `${prevHash}|${entry.timestamp}|${entry.technicianName}|${entry.operationType}|${entry.result}|${entry.deviceSummary || ''}`;
    let hash = 0;
    for (let i = 0; i < rawPayload.length; i++) {
      hash = ((hash << 5) - hash) + rawPayload.charCodeAt(i);
      hash |= 0;
    }
    const recordHash = `SHA256-${Math.abs(hash).toString(16).padStart(8, '0')}-${Date.now().toString(16)}`;

    const completeEntry: AuditLogEntry = {
      ...entry,
      id,
      prevHash,
      recordHash
    };

    logs.push(completeEntry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    return completeEntry;
  }

  // --- Diagnostic Reports ---
  public getDiagnosticReports(): DiagnosticReport[] {
    const data = localStorage.getItem(STORAGE_KEYS.DIAGNOSTIC_REPORTS);
    return data ? JSON.parse(data) : [];
  }

  public saveDiagnosticReport(report: DiagnosticReport): void {
    const list = this.getDiagnosticReports();
    list.unshift(report);
    localStorage.setItem(STORAGE_KEYS.DIAGNOSTIC_REPORTS, JSON.stringify(list));
  }

  // --- Default Seeding ---
  private seedDefaultDataIfEmpty(): void {
    if (!localStorage.getItem(STORAGE_KEYS.TECHNICIANS)) {
      const defaultTechnicians: Technician[] = [
        {
          id: 'tech_01',
          name: 'Alex Vance',
          role: 'ADMINISTRATOR',
          badgeNumber: 'OEM-CERT-8842',
          email: 'alex.vance@authorized-service.org',
          certifications: ['Google Pixel Certified Level 3', 'Samsung Master Tech', 'CompTIA A+'],
          active: true
        },
        {
          id: 'tech_02',
          name: 'Marcus Chen',
          role: 'TECHNICIAN',
          badgeNumber: 'REP-TECH-4109',
          email: 'm.chen@authorized-service.org',
          certifications: ['Android Enterprise Associate', 'Hardware Board Level 1'],
          active: true
        },
        {
          id: 'tech_03',
          name: 'Sarah Jenkins',
          role: 'AUDITOR',
          badgeNumber: 'COMPLIANCE-019',
          email: 's.jenkins@legal-compliance.org',
          certifications: ['ISO 27001 Auditor', 'Data Privacy Officer'],
          active: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(defaultTechnicians));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TECH_ID, 'tech_01');
    }

    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      const defaultCustomers: Customer[] = [
        {
          id: 'cust_01',
          fullName: 'Elena Rostova',
          phone: '+1 (555) 234-5678',
          email: 'elena.rostova@techcorp.io',
          idType: 'DRIVERS_LICENSE',
          idNumberMasked: 'DL-****-8831',
          verifiedByTechnicianId: 'tech_01',
          verifiedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'cust_02',
          fullName: 'David K. Miller',
          phone: '+1 (555) 890-1234',
          email: 'david.miller@apexlogistics.com',
          idType: 'ENTERPRISE_PO',
          idNumberMasked: 'PO-APEX-904',
          verifiedByTechnicianId: 'tech_01',
          verifiedAt: new Date(Date.now() - 86400000 * 5).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(defaultCustomers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
      const defaultTickets: ServiceTicket[] = [
        {
          id: 'ticket_1001',
          ticketNumber: 'TKT-2026-00412',
          technicianId: 'tech_01',
          customerId: 'cust_01',
          deviceLabel: 'Google Pixel 8 Pro (Model G1MNW)',
          declaredIssue: 'Bootloop after interrupted OTA update; customer requests official factory firmware reflash.',
          requestedOperation: 'OFFICIAL_FIRMWARE_FLASH',
          status: 'IN_PROGRESS',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'ticket_1002',
          ticketNumber: 'TKT-2026-00413',
          technicianId: 'tech_02',
          customerId: 'cust_02',
          deviceLabel: 'Samsung Galaxy S24 Ultra (SM-S928B)',
          declaredIssue: 'Device decommissioned from company fleet; employee offboarding complete, request official factory reset.',
          requestedOperation: 'OFFICIAL_FACTORY_RESET',
          status: 'DIAGNOSTICS',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
          updatedAt: new Date(Date.now() - 7200000).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(defaultTickets));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TICKET_ID, 'ticket_1001');
    }

    if (!localStorage.getItem(STORAGE_KEYS.FIRMWARE_PACKAGES)) {
      const defaultPackages: FirmwarePackage[] = [
        {
          id: 'fw_pixel8pro_qpr2',
          brand: 'Google',
          modelNumber: 'Pixel 8 Pro (husky)',
          marketingName: 'Google Pixel 8 Pro',
          regionCSC: 'Global / Unlocked',
          osVersion: 'Android 15.0',
          buildId: 'AP2A.240905.003',
          securityPatchDate: '2026-09-05',
          fileName: 'husky-factory-ap2a.240905.003-88cf1a90.zip',
          fileSizeBytes: 3421588902,
          sourceUrl: 'https://dl.google.com/dl/android/aosp/husky-factory-ap2a.240905.003-88cf1a90.zip',
          officialSource: true,
          sha256: '98cf1a9042b4bfa286395b4520970ebc64d852a42f6ba947ad56ca010b968561',
          sha512: '13f8981249b6574f07a78a635ef833a6fa99e900c14457e5e0326cb7871e4125b2938a9d82e1c945a57492c4217fa42d991b5c46e3e5b47a61d1ea0283c7423e',
          signatureCertIssuer: 'Google Android Production CA',
          status: 'VERIFIED',
          isCachedLocally: true,
          localFilePath: '/var/servicing/firmware/husky-ap2a.zip',
          minBootloaderVersion: 'husky-0.4-11849202',
          applicableHardwareRevs: ['MP1.0', 'MP1.1']
        },
        {
          id: 'fw_s24u_oneui7',
          brand: 'Samsung',
          modelNumber: 'SM-S928B',
          marketingName: 'Samsung Galaxy S24 Ultra',
          regionCSC: 'OXM / EUX',
          osVersion: 'Android 15.0 (One UI 7.0)',
          buildId: 'S928BXXU3BXK1',
          securityPatchDate: '2026-09-01',
          fileName: 'SM-S928B_1_20260901_EUX_S928BXXU3BXK1_fac.zip',
          fileSizeBytes: 8492104882,
          sourceUrl: 'https://fota-secure.samsungmobile.com/firmware/S928BXXU3BXK1.zip',
          officialSource: true,
          sha256: 'a4d52187f4625b902e88a011cd84e5264b38d684033c4ebc2fa58da81395b428',
          status: 'VERIFIED',
          isCachedLocally: true,
          localFilePath: '/var/servicing/firmware/SM-S928B_EUX.zip',
          minBootloaderVersion: 'S928BXXU3',
          applicableHardwareRevs: ['REV0.3', 'REV0.4']
        },
        {
          id: 'fw_xiaomi14_hyperos',
          brand: 'Xiaomi',
          modelNumber: 'Xiaomi 14 (houji)',
          marketingName: 'Xiaomi 14',
          regionCSC: 'Global (MI)',
          osVersion: 'Android 15.0 (HyperOS 2.0)',
          buildId: 'OS2.0.8.0.UNCMIXM',
          securityPatchDate: '2026-08-01',
          fileName: 'houji_global_images_OS2.0.8.0.UNCMIXM_20260801.tgz',
          fileSizeBytes: 7120489120,
          sourceUrl: 'https://bigota.d.miui.com/OS2.0.8.0.UNCMIXM/houji_global.tgz',
          officialSource: true,
          sha256: '55f891b2938a9d82e1c945a57492c4217fa42d991b5c46e3e5b47a61d1ea0283',
          status: 'NOT_VERIFIED',
          isCachedLocally: false,
          minBootloaderVersion: 'houji-1.0',
          applicableHardwareRevs: ['GLOBAL']
        }
      ];
      localStorage.setItem(STORAGE_KEYS.FIRMWARE_PACKAGES, JSON.stringify(defaultPackages));
    }

    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      const initialLogs: AuditLogEntry[] = [
        {
          id: 'audit_init_1',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          technicianName: 'Alex Vance',
          technicianRole: 'ADMINISTRATOR',
          ticketNumber: 'TKT-2026-00410',
          deviceSummary: 'Google Pixel 7 (panther)',
          operationType: 'HARDWARE_DIAGNOSTICS_RUN',
          result: 'SUCCESS',
          durationMs: 1420,
          payloadJson: JSON.stringify({ batteryHealth: 'GOOD', wearLevel: 94 }),
          prevHash: 'GENESIS_HASH_00000000000000000000000000000000',
          recordHash: 'SHA256-INIT-8942-001'
        },
        {
          id: 'audit_init_2',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          technicianName: 'Marcus Chen',
          technicianRole: 'TECHNICIAN',
          ticketNumber: 'TKT-2026-00411',
          deviceSummary: 'Samsung Galaxy A54 5G',
          operationType: 'FRP_BYPASS_REQUEST_REJECTED',
          result: 'BLOCKED_BY_POLICY',
          error: 'ERR_SECURITY_POLICY_REFUSAL: FRP circumvention attempt blocked. Provided official Google Account recovery link.',
          durationMs: 40,
          prevHash: 'SHA256-INIT-8942-001',
          recordHash: 'SHA256-POLICY-REFUSAL-002'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialLogs));
    }
  }
}
