import { AndroidDevice, ConnectionMode } from '../types/device.ts';

export type DeviceChangeCallback = (device: AndroidDevice | null) => void;

export class UsbConnectionEngine {
  private static instance: UsbConnectionEngine;
  private currentDevice: AndroidDevice | null = null;
  private listeners: DeviceChangeCallback[] = [];

  // Realistic device profiles for technician testing and USB connection demonstration
  public static readonly SAMPLE_DEVICES: AndroidDevice[] = [
    {
      id: 'dev_pixel_8_pro',
      manufacturer: 'Google',
      brand: 'google',
      marketName: 'Pixel 8 Pro',
      modelNumber: 'GC3VE',
      hardwareRevision: 'MP1.0',
      board: 'husky',
      chipset: 'Google Tensor G3 (Titan M2 Security)',
      androidVersion: '15.0',
      sdkVersion: 35,
      buildNumber: 'AP2A.240905.003',
      buildFingerprint: 'google/husky/husky:15/AP2A.240905.003/12345678:user/release-keys',
      securityPatch: '2026-09-05',
      kernelVersion: '6.1.75-android15-11-gec89a01b',
      serialNumber: '39211FDH2008J1',
      imeiStatus: 'AVAILABLE',
      imeiMasked: '3589-****-****-9412',
      referenceImei: '',
      bootloaderStatus: 'LOCKED',
      connectionMode: 'ADB',
      usbInfo: {
        vid: '18d1',
        pid: '4ee7',
        vendorName: 'Google Inc.',
        productName: 'Nexus/Pixel Device (ADB Mode)',
        serialNumber: '39211FDH2008J1',
        driverInstalled: true,
        driverName: 'Google USB Driver (WinUSB 2.0)',
        driverStatus: 'OPTIMAL',
        protocol: 'ADB',
        speedMbps: 480
      },
      batteryLevelPercent: 78,
      batteryHealthStatus: 'GOOD',
      batteryTemperatureC: 28.4,
      frpStatus: 'ACTIVE',
      knoxActive: false,
      knoxWarrantyBit: 0,
      oemUnlockAllowed: true,
      verifiedBootState: 'green',
      connectedSince: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'dev_samsung_s24u',
      manufacturer: 'Samsung Electronics',
      brand: 'samsung',
      marketName: 'Galaxy S24 Ultra',
      modelNumber: 'SM-S928B',
      hardwareRevision: 'REV0.4',
      board: 'e3q',
      chipset: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      androidVersion: '15.0',
      sdkVersion: 35,
      buildNumber: 'UP1A.231005.007.S928BXXU3BXK1',
      buildFingerprint: 'samsung/e3qxxx/e3q:15/UP1A.231005.007/S928BXXU3BXK1:user/release-keys',
      securityPatch: '2026-09-01',
      kernelVersion: '6.1.43-android15-samsung-g991b',
      serialNumber: 'R5CW109PXYZ',
      imeiStatus: 'AVAILABLE',
      imeiMasked: '3541-****-****-0193',
      bootloaderStatus: 'LOCKED',
      connectionMode: 'ADB',
      usbInfo: {
        vid: '04e8',
        pid: '6860',
        vendorName: 'Samsung Electronics Co., Ltd',
        productName: 'Galaxy Mobile Phone (SAMSUNG Android ADB)',
        serialNumber: 'R5CW109PXYZ',
        driverInstalled: true,
        driverName: 'SAMSUNG Mobile USB Composite Device',
        driverStatus: 'OPTIMAL',
        protocol: 'ADB',
        speedMbps: 5000
      },
      batteryLevelPercent: 62,
      batteryHealthStatus: 'GOOD',
      batteryTemperatureC: 31.2,
      frpStatus: 'ACTIVE',
      deviceOwnerPackage: 'com.apex.logistics.mdm',
      knoxActive: true,
      knoxWarrantyBit: 0,
      oemUnlockAllowed: false,
      verifiedBootState: 'green',
      connectedSince: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'dev_generic_usb_missing_driver',
      manufacturer: 'Unknown Manufacturer',
      brand: 'unknown',
      marketName: 'USB Android Device (Driver Missing)',
      modelNumber: 'GENERIC_ANDROID',
      hardwareRevision: 'UNKNOWN',
      board: 'unknown',
      chipset: 'MediaTek MT6765',
      androidVersion: 'Unknown',
      sdkVersion: 0,
      buildNumber: 'Unknown',
      buildFingerprint: 'Unknown',
      securityPatch: 'Unknown',
      kernelVersion: 'Unknown',
      imeiStatus: 'REQUIRES_AUTHORIZED_INTERFACE',
      bootloaderStatus: 'UNKNOWN',
      connectionMode: 'USB_GENERIC',
      usbInfo: {
        vid: '0e8d',
        pid: '2000',
        vendorName: 'MediaTek Inc.',
        productName: 'MT65xx Preloader / Android Phone',
        driverInstalled: false,
        driverStatus: 'MISSING_DRIVER',
        protocol: 'UNKNOWN',
        speedMbps: 480
      },
      batteryLevelPercent: 42,
      batteryHealthStatus: 'GOOD',
      batteryTemperatureC: 27.0,
      frpStatus: 'UNKNOWN',
      knoxActive: false,
      knoxWarrantyBit: 0,
      oemUnlockAllowed: false,
      verifiedBootState: 'green',
      connectedSince: new Date(Date.now() - 600000).toISOString()
    }
  ];

  private constructor() {
    // Default to the first realistic sample device (Google Pixel 8 Pro)
    this.currentDevice = UsbConnectionEngine.SAMPLE_DEVICES[0];
  }

  public static getInstance(): UsbConnectionEngine {
    if (!UsbConnectionEngine.instance) {
      UsbConnectionEngine.instance = new UsbConnectionEngine();
    }
    return UsbConnectionEngine.instance;
  }

  public getCurrentDevice(): AndroidDevice | null {
    return this.currentDevice;
  }

  public subscribe(listener: DeviceChangeCallback): () => void {
    this.listeners.push(listener);
    listener(this.currentDevice);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l(this.currentDevice));
  }

  public setConnectedDevice(device: AndroidDevice | null): void {
    this.currentDevice = device;
    this.notify();
  }

  public switchMode(mode: ConnectionMode): void {
    if (!this.currentDevice) return;

    const updated = { ...this.currentDevice, connectionMode: mode };

    // Update protocol details to reflect real mode changes
    if (mode === 'FASTBOOT') {
      updated.usbInfo = {
        ...updated.usbInfo,
        protocol: 'FASTBOOT',
        productName: `${updated.marketName} (Fastboot / Bootloader Interface)`
      };
    } else if (mode === 'RECOVERY') {
      updated.usbInfo = {
        ...updated.usbInfo,
        protocol: 'RECOVERY',
        productName: `${updated.marketName} (Android Recovery Mode)`
      };
    } else if (mode === 'AUTHORIZED_SERVICE_MODE') {
      updated.usbInfo = {
        ...updated.usbInfo,
        protocol: 'DOWNLOAD_MODE',
        productName: `${updated.marketName} (Official OEM Download Mode)`
      };
    } else if (mode === 'ADB') {
      updated.usbInfo = {
        ...updated.usbInfo,
        protocol: 'ADB',
        productName: `${updated.marketName} (ADB Interface)`
      };
    }

    this.currentDevice = updated;
    this.notify();
  }

  public updateReferenceImei(refImei: string): void {
    if (!this.currentDevice) return;
    this.currentDevice = {
      ...this.currentDevice,
      referenceImei: refImei
    };
    this.notify();
  }

  public simulateBatteryLevel(percent: number): void {
    if (!this.currentDevice) return;
    this.currentDevice = {
      ...this.currentDevice,
      batteryLevelPercent: percent
    };
    this.notify();
  }
}
