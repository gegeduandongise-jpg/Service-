import { AndroidDevice } from './device.ts';
import { FlashProgress } from './firmware.ts';

export interface OemPluginMetadata {
  id: string;
  vendorName: string;
  pluginVersion: string;
  author: string;
  cryptographicSignature: string;
  supportedChipsets: string[];
  supportedProtocols: Array<'ADB' | 'FASTBOOT' | 'ODIN_DOWNLOAD_MODE' | 'EDL_AUTHORIZED' | 'RECOVERY_SIDELOAD'>;
  officialDocumentationUrl: string;
  officialRecoveryTools: string[];
  isVerifiedOemSigned: boolean;
}

export interface OemServicingCapabilities {
  canReadFullProps: boolean;
  canExecuteRecoveryReset: boolean;
  canOfficialFlash: boolean;
  requiresOnlineToken: boolean;
  tokenPortalUrl?: string;
  oemSpecificDiagnosticCommands: string[];
  recoveryKeyCombo: string;
}

export interface ManufacturerPlugin {
  metadata: OemPluginMetadata;
  capabilities: OemServicingCapabilities;
  detectDevice(vid: string, pid: string): boolean;
  formatModelLabel(device: AndroidDevice): string;
  getRecoveryInstructions(device: AndroidDevice, failureStage?: string): string[];
  getOfficialServicePortalUrl(): string;
  validateCompatibility(device: AndroidDevice, buildId: string): { compatible: boolean; reason?: string };
}
