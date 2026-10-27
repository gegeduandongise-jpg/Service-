export type FirmwareVerificationStatus = 
  | 'NOT_VERIFIED' 
  | 'VERIFYING' 
  | 'VERIFIED' 
  | 'CHECKSUM_MISMATCH' 
  | 'SIGNATURE_INVALID' 
  | 'CORRUPT_ARCHIVE' 
  | 'UNKNOWN';

export interface FirmwarePackage {
  id: string;
  brand: string;
  modelNumber: string;
  marketingName: string;
  regionCSC: string;
  osVersion: string;
  buildId: string;
  securityPatchDate: string;
  fileName: string;
  fileSizeBytes: number;
  sourceUrl: string;
  officialSource: boolean;
  sha256: string;
  sha512?: string;
  signatureCertIssuer?: string;
  status: FirmwareVerificationStatus;
  isCachedLocally: boolean;
  localFilePath?: string;
  minBootloaderVersion: string;
  applicableHardwareRevs: string[];
}

export type DownloadStatus = 'QUEUED' | 'DOWNLOADING' | 'PAUSED' | 'VERIFYING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface FirmwareDownloadState {
  id: string;
  packageId: string;
  fileName: string;
  targetPath: string;
  totalBytes: number;
  downloadedBytes: number;
  speedBytesPerSec: number;
  status: DownloadStatus;
  etag?: string;
  acceptRanges: boolean;
  resumedCount: number;
  lastOffset: number;
  error?: string;
  startedAt: string;
  updatedAt: string;
}

export interface FlashingPreFlightCheck {
  batterySufficient: boolean;
  batteryPercent: number;
  usbSpeedSufficient: boolean;
  modelMatch: boolean;
  bootloaderVersionMatch: boolean;
  regionMatch: boolean;
  firmwareVerified: boolean;
  authorizedTicketPresent: boolean;
  backupConfirmed: boolean;
  passedAllCritical: boolean;
  blockers: string[];
  warnings: string[];
}

export interface FlashProgress {
  stage: 'PRE_FLIGHT' | 'PREPARING_PARTITIONS' | 'SENDING_PAYLOAD' | 'FLASHING' | 'VERIFYING_PARTITION' | 'FINALIZING' | 'COMPLETED' | 'FAILED';
  currentPartition: string;
  partitionIndex: number;
  totalPartitions: number;
  percent: number;
  bytesSent: number;
  totalBytes: number;
  speedMbps: number;
  logs: string[];
}
