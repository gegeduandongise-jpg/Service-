export type ConnectionMode = 
  | 'NO_DEVICE' 
  | 'USB_GENERIC' 
  | 'ANDROID_DEVICE' 
  | 'ADB' 
  | 'FASTBOOT' 
  | 'RECOVERY' 
  | 'AUTHORIZED_SERVICE_MODE' 
  | 'UNSUPPORTED';

export type ImeiExposureStatus = 
  | 'AVAILABLE' 
  | 'NOT_AVAILABLE' 
  | 'PERMISSION_DENIED' 
  | 'NOT_SUPPORTED' 
  | 'REQUIRES_AUTHORIZED_INTERFACE';

export type BootloaderStatus = 
  | 'LOCKED' 
  | 'UNLOCKED' 
  | 'VERIFIED_BOOT_GREEN' 
  | 'VERIFIED_BOOT_ORANGE' 
  | 'VERIFIED_BOOT_RED' 
  | 'UNKNOWN' 
  | 'NOT_SUPPORTED';

export type FrpStatus = 
  | 'ACTIVE' 
  | 'INACTIVE' 
  | 'UNKNOWN' 
  | 'NOT_AVAILABLE';

export interface UsbInterfaceInfo {
  vid: string;
  pid: string;
  vendorName: string;
  productName: string;
  serialNumber?: string;
  driverInstalled: boolean;
  driverName?: string;
  driverStatus: 'OPTIMAL' | 'COMPATIBLE' | 'MISSING_DRIVER' | 'PERMISSION_REQUIRED';
  protocol: 'ADB' | 'FASTBOOT' | 'MTP' | 'PTP' | 'DOWNLOAD_MODE' | 'RECOVERY' | 'UNKNOWN';
  speedMbps: number;
}

export interface AndroidDevice {
  id: string;
  manufacturer: string;
  brand: string;
  marketName: string;
  modelNumber: string;
  hardwareRevision: string;
  board: string;
  chipset: string;
  androidVersion: string;
  sdkVersion: number;
  buildNumber: string;
  buildFingerprint: string;
  securityPatch: string;
  kernelVersion: string;
  serialNumber?: string;
  imeiStatus: ImeiExposureStatus;
  imeiMasked?: string;
  referenceImei?: string; // Manual technician reference only, NEVER modifies hardware
  bootloaderStatus: BootloaderStatus;
  connectionMode: ConnectionMode;
  usbInfo: UsbInterfaceInfo;
  batteryLevelPercent: number;
  batteryHealthStatus: 'GOOD' | 'OVERHEAT' | 'DEAD' | 'OVER_VOLTAGE' | 'UNSPECIFIED_FAILURE';
  batteryTemperatureC: number;
  frpStatus: FrpStatus;
  deviceOwnerPackage?: string;
  profileOwnerPackage?: string;
  knoxActive: boolean;
  knoxWarrantyBit: number; // 0 = intact, 1 = tripped
  oemUnlockAllowed: boolean;
  verifiedBootState: 'green' | 'yellow' | 'orange' | 'red';
  connectedSince: string;
  lastDiagnosticHealthScore?: number;
}
