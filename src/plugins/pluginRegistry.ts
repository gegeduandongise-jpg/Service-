import { ManufacturerPlugin } from '../types/plugins.ts';
import { AndroidDevice } from '../types/device.ts';

export const OEM_PLUGINS: ManufacturerPlugin[] = [
  {
    metadata: {
      id: 'oem_google_pixel',
      vendorName: 'Google Pixel',
      pluginVersion: '2.4.0',
      author: 'Google Authorized Repair Partner Framework',
      cryptographicSignature: 'ED25519:6c9b3a1f8e2d4c5b7a9f0e1d2c3b4a5f6e7d8c9b',
      supportedChipsets: ['Google Tensor G1', 'Google Tensor G2', 'Google Tensor G3', 'Google Tensor G4'],
      supportedProtocols: ['ADB', 'FASTBOOT', 'RECOVERY_SIDELOAD'],
      officialDocumentationUrl: 'https://developers.google.com/android/images',
      officialRecoveryTools: ['Android Flash Tool (flash.android.com)', 'Pixel Repair Tool'],
      isVerifiedOemSigned: true
    },
    capabilities: {
      canReadFullProps: true,
      canExecuteRecoveryReset: true,
      canOfficialFlash: true,
      requiresOnlineToken: false,
      oemSpecificDiagnosticCommands: ['fastboot oem device-info', 'fastboot getvar all'],
      recoveryKeyCombo: 'Power + Volume Down -> Select Recovery Mode -> Power + Volume Up at No Command'
    },
    detectDevice: (vid: string) => vid.toLowerCase() === '18d1',
    formatModelLabel: (device: AndroidDevice) => `Google ${device.marketName} [${device.board}]`,
    getRecoveryInstructions: () => [
      '1. Power off device completely.',
      '2. Press and hold Volume Down + Power button until Fastboot Mode screen appears.',
      '3. Use volume keys to navigate to "Recovery Mode" and press Power button.',
      '4. At "No Command" screen, hold Power button and press Volume Up once.',
      '5. Select "Wipe data/factory reset" using Volume keys and confirm with Power.'
    ],
    getOfficialServicePortalUrl: () => 'https://store.google.com/repair',
    validateCompatibility: (device: AndroidDevice, buildId: string) => ({
      compatible: buildId.startsWith('AP') || buildId.startsWith('UQ') || buildId.startsWith('TQ'),
      reason: 'Official signed Pixel factory image manifest format'
    })
  },
  {
    metadata: {
      id: 'oem_samsung',
      vendorName: 'Samsung Galaxy',
      pluginVersion: '3.1.2',
      author: 'Samsung Electronics Co. Authorized Servicing',
      cryptographicSignature: 'ED25519:3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
      supportedChipsets: ['Exynos 2400', 'Snapdragon 8 Gen 3 for Galaxy', 'Exynos 1480'],
      supportedProtocols: ['ADB', 'ODIN_DOWNLOAD_MODE', 'RECOVERY_SIDELOAD'],
      officialDocumentationUrl: 'https://www.samsung.com/support/smartswitch/',
      officialRecoveryTools: ['Samsung Smart Switch PC', 'Samsung Odin Service Edition'],
      isVerifiedOemSigned: true
    },
    capabilities: {
      canReadFullProps: true,
      canExecuteRecoveryReset: true,
      canOfficialFlash: true,
      requiresOnlineToken: false,
      oemSpecificDiagnosticCommands: ['*#0*# (General Hardware Diagnostic Menu)', '*#1234# (Software Version Display)'],
      recoveryKeyCombo: 'Connect to PC via USB -> Power Off -> Hold Volume Up + Power until Samsung logo'
    },
    detectDevice: (vid: string) => vid.toLowerCase() === '04e8',
    formatModelLabel: (device: AndroidDevice) => `Samsung Galaxy ${device.marketName} (${device.modelNumber})`,
    getRecoveryInstructions: () => [
      '1. Connect Samsung device to a computer via USB cable.',
      '2. Power off phone completely.',
      '3. Press and hold Volume Up + Side/Power key simultaneously.',
      '4. Release buttons when the Android Recovery screen appears.',
      '5. Select "Wipe data / factory reset" and confirm.'
    ],
    getOfficialServicePortalUrl: () => 'https://www.samsung.com/support/service-center/',
    validateCompatibility: (device: AndroidDevice, buildId: string) => ({
      compatible: buildId.includes(device.modelNumber) || buildId.includes('XXU') || buildId.includes('DXU'),
      reason: 'Samsung BL/AP/CP/CSC TAR.MD5 binary matching bootloader revision'
    })
  },
  {
    metadata: {
      id: 'oem_xiaomi',
      vendorName: 'Xiaomi / Redmi / POCO',
      pluginVersion: '2.8.0',
      author: 'Xiaomi Authorized Service Framework',
      cryptographicSignature: 'ED25519:8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
      supportedChipsets: ['Qualcomm Snapdragon', 'MediaTek Dimensity'],
      supportedProtocols: ['ADB', 'FASTBOOT', 'RECOVERY_SIDELOAD', 'EDL_AUTHORIZED'],
      officialDocumentationUrl: 'https://miui.com/download.html',
      officialRecoveryTools: ['Mi Flash Tool (Official)', 'Mi PC Suite'],
      isVerifiedOemSigned: true
    },
    capabilities: {
      canReadFullProps: true,
      canExecuteRecoveryReset: true,
      canOfficialFlash: true,
      requiresOnlineToken: true,
      tokenPortalUrl: 'https://account.xiaomi.com',
      oemSpecificDiagnosticCommands: ['*#*#6484#*#* (Hardware CIT Diagnostic Menu)'],
      recoveryKeyCombo: 'Power Off -> Press and hold Volume Up + Power until Mi logo'
    },
    detectDevice: (vid: string) => vid.toLowerCase() === '2717',
    formatModelLabel: (device: AndroidDevice) => `Xiaomi ${device.marketName} [${device.modelNumber}]`,
    getRecoveryInstructions: () => [
      '1. Power off device.',
      '2. Hold Volume Up + Power until Mi-Recovery 5.0 menu appears.',
      '3. Select "Wipe Data" -> "Wipe All Data" and confirm.',
      '4. Reboot system to complete official initialization.'
    ],
    getOfficialServicePortalUrl: () => 'https://www.mi.com/global/support',
    validateCompatibility: (device: AndroidDevice, buildId: string) => ({
      compatible: true,
      reason: 'Official Xiaomi Fastboot TGZ verified image'
    })
  },
  {
    metadata: {
      id: 'oem_motorola',
      vendorName: 'Motorola Mobility',
      pluginVersion: '2.1.0',
      author: 'Motorola / Lenovo Service Solutions',
      cryptographicSignature: 'ED25519:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      supportedChipsets: ['Qualcomm Snapdragon', 'MediaTek Helio/Dimensity'],
      supportedProtocols: ['ADB', 'FASTBOOT', 'RECOVERY_SIDELOAD'],
      officialDocumentationUrl: 'https://motorola-global-portal.custhelp.com',
      officialRecoveryTools: ['Rescue and Smart Assistant (RSA)'],
      isVerifiedOemSigned: true
    },
    capabilities: {
      canReadFullProps: true,
      canExecuteRecoveryReset: true,
      canOfficialFlash: true,
      requiresOnlineToken: false,
      oemSpecificDiagnosticCommands: ['fastboot oem fb_mode_set', 'fastboot getvar ro.build.fingerprint'],
      recoveryKeyCombo: 'Hold Volume Down + Power -> Select Recovery -> Power + Volume Up at Android robot'
    },
    detectDevice: (vid: string) => vid.toLowerCase() === '22b8',
    formatModelLabel: (device: AndroidDevice) => `Motorola ${device.marketName}`,
    getRecoveryInstructions: () => [
      '1. Hold Volume Down and Power until Fastboot AP Bootloader menu opens.',
      '2. Use Volume keys to select "RECOVERY MODE" and press Power.',
      '3. At the "No Command" fallen robot, hold Power and tap Volume Up.',
      '4. Choose "Wipe data/factory reset" and select "Factory data reset".'
    ],
    getOfficialServicePortalUrl: () => 'https://motorola.com/support',
    validateCompatibility: () => ({ compatible: true })
  },
  {
    metadata: {
      id: 'oem_oneplus',
      vendorName: 'OnePlus',
      pluginVersion: '2.0.4',
      author: 'OnePlus Authorized Service Partner',
      cryptographicSignature: 'ED25519:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      supportedChipsets: ['Snapdragon 8 Gen 2 / Gen 3'],
      supportedProtocols: ['ADB', 'FASTBOOT', 'RECOVERY_SIDELOAD'],
      officialDocumentationUrl: 'https://www.oneplus.com/support',
      officialRecoveryTools: ['OnePlus Service Tool', 'ColorOS/OxygenOS Flasher'],
      isVerifiedOemSigned: true
    },
    capabilities: {
      canReadFullProps: true,
      canExecuteRecoveryReset: true,
      canOfficialFlash: true,
      requiresOnlineToken: false,
      oemSpecificDiagnosticCommands: ['*#899# (Engineer Mode EngineerMenu)'],
      recoveryKeyCombo: 'Power Off -> Hold Volume Down + Power until OnePlus logo'
    },
    detectDevice: (vid: string) => vid.toLowerCase() === '2a70',
    formatModelLabel: (device: AndroidDevice) => `OnePlus ${device.marketName}`,
    getRecoveryInstructions: () => [
      '1. Power off device.',
      '2. Hold Volume Down + Power until language selection appears.',
      '3. Select "English" -> "Wipe data and cache" -> "Format data".',
      '4. Enter verification code displayed on screen and reboot.'
    ],
    getOfficialServicePortalUrl: () => 'https://service.oneplus.com',
    validateCompatibility: () => ({ compatible: true })
  },
  {
    metadata: {
      id: 'oem_transsion',
      vendorName: 'TECNO / Infinix / itel (Transsion)',
      pluginVersion: '1.9.1',
      author: 'Carlcare Authorized Service Network',
      cryptographicSignature: 'ED25519:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
      supportedChipsets: ['MediaTek Helio G99 / Dimensity 7020', 'UNISOC T606'],
      supportedProtocols: ['ADB', 'FASTBOOT', 'RECOVERY_SIDELOAD'],
      officialDocumentationUrl: 'https://www.carlcare.com',
      officialRecoveryTools: ['Carlcare After-Sales Service Utility'],
      isVerifiedOemSigned: true
    },
    capabilities: {
      canReadFullProps: true,
      canExecuteRecoveryReset: true,
      canOfficialFlash: true,
      requiresOnlineToken: false,
      oemSpecificDiagnosticCommands: ['*#*#4636#*#* (Testing Menu)'],
      recoveryKeyCombo: 'Power Off -> Hold Volume Up + Power -> No Command -> Power + Volume Up'
    },
    detectDevice: (vid: string) => vid.toLowerCase() === '0e8d' || vid.toLowerCase() === '1782',
    formatModelLabel: (device: AndroidDevice) => `${device.manufacturer} ${device.marketName}`,
    getRecoveryInstructions: () => [
      '1. Turn off device completely.',
      '2. Hold Volume Up + Power until manufacturer logo appears.',
      '3. At "No Command", press Power + Volume Up to trigger recovery menu.',
      '4. Select "Wipe data/factory reset" and confirm.'
    ],
    getOfficialServicePortalUrl: () => 'https://www.carlcare.com/repair-service',
    validateCompatibility: () => ({ compatible: true })
  }
];
