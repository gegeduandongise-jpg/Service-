export type MalwareRiskLevel = 
  | 'KNOWN_SYSTEM' 
  | 'USER_EXPECTED' 
  | 'POTENTIALLY_UNWANTED' 
  | 'SUSPICIOUS' 
  | 'CRITICAL_RISK';

export interface AppPackageInfo {
  packageName: string;
  appLabel: string;
  versionName: string;
  versionCode: number;
  installerPackage?: string; // e.g. com.android.vending (Play Store) or null (sideloaded)
  isSystemApp: boolean;
  isPrivilegedApp: boolean;
  targetSdkVersion: number;
  permissions: string[];
  dangerousPermissions: string[];
  certificateSha256: string;
  installTime: string;
  lastUpdateTime: string;
  riskClassification: MalwareRiskLevel;
  riskReasons: string[];
  selfReinstallRisk: boolean;
  selfReinstallLikelyTrigger?: string;
}

export interface EnterpriseMdmStatus {
  deviceOwnerActive: boolean;
  deviceOwnerPackage?: string;
  profileOwnerActive: boolean;
  profileOwnerPackage?: string;
  activeAdmins: string[];
  knoxEnrolled: boolean;
  knoxGuardActive: boolean;
  zeroTouchEnrolled: boolean;
  enterpriseWipeAllowed: boolean;
  officialDeprovisionWorkflow: string[];
}

export interface HardwareHealthCheck {
  id: string;
  name: string;
  category: 'BATTERY' | 'STORAGE' | 'THERMAL' | 'DISPLAY' | 'SENSORS' | 'USB_INTERFACE';
  status: 'PASSED' | 'WARNING' | 'FAILED' | 'NOT_TESTED';
  measuredValue: string;
  referenceThreshold: string;
  notes: string;
}

export interface DiagnosticReport {
  id: string;
  deviceId: string;
  ticketId?: string;
  timestamp: string;
  overallScore: number; // 0-100
  batteryHealth: {
    capacityPercent: number;
    cycleCount: number;
    voltageMv: number;
    temperatureC: number;
    status: string;
  };
  storageHealth: {
    totalGb: number;
    usedGb: number;
    freeGb: number;
    smartWearLevelPercent: number;
    emmcPartitionIntegrity: 'OK' | 'DEGRADED' | 'ERROR';
  };
  usbLink: {
    speedMbps: number;
    packetLossRatio: number;
    stability: 'EXCELLENT' | 'DEGRADED' | 'UNSTABLE';
  };
  checks: HardwareHealthCheck[];
  technicianNotes?: string;
}
