import React, { useState } from 'react';
import { FirmwarePackage, FirmwareDownloadState } from '../../types/firmware.ts';
import { AndroidDevice } from '../../types/device.ts';
import { 
  HardDriveDownload, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  FileCheck2,
  FolderOpen,
  Lock
} from 'lucide-react';
import { FirmwareService } from '../../services/firmwareService.ts';
import { StorageService } from '../../services/storageService.ts';

interface FirmwareManagerViewProps {
  device: AndroidDevice | null;
  onSelectFirmwareForFlashing: (pkg: FirmwarePackage) => void;
}

export const FirmwareManagerView: React.FC<FirmwareManagerViewProps> = ({
  device,
  onSelectFirmwareForFlashing
}) => {
  const storage = StorageService.getInstance();
  const fwService = FirmwareService.getInstance();

  const [packages, setPackages] = useState<FirmwarePackage[]>(storage.getFirmwarePackages());
  const [downloadStates, setDownloadStates] = useState<FirmwareDownloadState[]>(storage.getDownloadStates());
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const refreshState = () => {
    setPackages(storage.getFirmwarePackages());
    setDownloadStates(storage.getDownloadStates());
  };

  const handleStartDownload = (pkg: FirmwarePackage) => {
    fwService.startOrResumeDownload(pkg, () => {
      refreshState();
    });
  };

  const handlePauseDownload = (pkgId: string) => {
    fwService.pauseDownload(pkgId, () => {
      refreshState();
    });
  };

  const handleCancelDownload = (pkgId: string) => {
    fwService.cancelDownload(pkgId, () => {
      refreshState();
    });
  };

  const handleVerifyPackage = async (pkg: FirmwarePackage) => {
    setVerifyingId(pkg.id);
    await fwService.verifyPackageIntegrity(pkg);
    setVerifyingId(null);
    refreshState();
  };

  const filtered = packages.filter(p => 
    p.marketingName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.modelNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.buildId.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <HardDriveDownload className="w-5 h-5 text-blue-400" />
            <span>Official Firmware Manager & Cryptographic Verifier</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Discover, download via resumable HTTP Range streams, and cryptographically verify authentic OEM factory images
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search model, build ID..."
              className="bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 w-56"
            />
          </div>
        </div>
      </div>

      {/* Strict Cryptographic Verification Policy Note */}
      <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900 flex items-start gap-3 text-xs text-blue-200 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-blue-100">Cryptographic Pre-requisite Rule:</strong> Flashing will be unconditionally 
          blocked unless the firmware package status is <span className="font-mono text-emerald-400 font-bold">VERIFIED</span>. 
          Unverified packages or packages with mismatched SHA-256 signatures cannot be loaded or forced into the flashing pipeline.
        </div>
      </div>

      {/* Firmware Catalog List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          <span>Official Firmware Packages ({filtered.length})</span>
          <span className="text-[11px] font-mono lowercase">HTTP Range Resumable Engine Enabled</span>
        </div>

        <div className="grid gap-4">
          {filtered.map((pkg) => {
            const dlState = downloadStates.find(s => s.packageId === pkg.id);
            const isDownloading = dlState?.status === 'DOWNLOADING';
            const isPaused = dlState?.status === 'PAUSED';
            const percent = dlState ? Math.round((dlState.downloadedBytes / dlState.totalBytes) * 100) : (pkg.isCachedLocally ? 100 : 0);
            const isDeviceCompatible = device && (
              pkg.modelNumber.toLowerCase().includes(device.modelNumber.toLowerCase()) ||
              device.modelNumber.toLowerCase().includes(pkg.modelNumber.toLowerCase()) ||
              pkg.marketingName.toLowerCase().includes(device.marketName.toLowerCase())
            );

            return (
              <div
                key={pkg.id}
                className={`bg-zinc-900 border rounded-xl p-5 shadow-sm space-y-4 transition-all ${
                  isDeviceCompatible ? 'border-blue-700/60 ring-1 ring-blue-500/20' : 'border-zinc-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-zinc-100">{pkg.marketingName}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {pkg.modelNumber}
                      </span>
                      {isDeviceCompatible && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                          MATCHES CONNECTED DEVICE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono flex flex-wrap items-center gap-2">
                      <span>Region / CSC: {pkg.regionCSC}</span>
                      <span>•</span>
                      <span>OS: {pkg.osVersion}</span>
                      <span>•</span>
                      <span>Build ID: {pkg.buildId}</span>
                      <span>•</span>
                      <span>Security Patch: {pkg.securityPatchDate}</span>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold border flex items-center gap-1.5 ${
                      pkg.status === 'VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : pkg.status === 'VERIFYING'
                        ? 'bg-blue-950 text-blue-300 border-blue-800'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {pkg.status === 'VERIFIED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {pkg.status === 'VERIFYING' && <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                      {pkg.status === 'NOT_VERIFIED' && <Lock className="w-3.5 h-3.5 text-zinc-500" />}
                      <span>{pkg.status}</span>
                    </span>

                    <span className="text-xs text-zinc-400 font-mono">
                      {(pkg.fileSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
                    </span>
                  </div>
                </div>

                {/* File Details & Checksums */}
                <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                    <span className="truncate">File: {pkg.fileName}</span>
                    <span className="text-zinc-400 shrink-0 ml-2">
                      {pkg.isCachedLocally ? 'Locally Cached' : 'Remote CDN'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 break-all">
                    SHA-256: <span className="text-zinc-300">{pkg.sha256}</span>
                  </div>
                </div>

                {/* Download Progress (if active or paused) */}
                {dlState && dlState.status !== 'COMPLETED' && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-300 font-semibold">
                        {dlState.status}: {percent}% ({(dlState.downloadedBytes / (1024 * 1024)).toFixed(1)} MB / {(dlState.totalBytes / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                      {isDownloading && (
                        <span className="text-emerald-400 font-bold">
                          {(dlState.speedBytesPerSec / (1024 * 1024)).toFixed(1)} MB/s
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {!pkg.isCachedLocally ? (
                      <>
                        {!isDownloading ? (
                          <button
                            onClick={() => handleStartDownload(pkg)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>{isPaused ? 'Resume Download' : 'Download Package'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePauseDownload(pkg.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </button>
                        )}

                        {(isDownloading || isPaused) && (
                          <button
                            onClick={() => handleCancelDownload(pkg.id)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleVerifyPackage(pkg)}
                        disabled={verifyingId === pkg.id}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${verifyingId === pkg.id ? 'animate-spin text-blue-400' : 'text-zinc-400'}`} />
                        <span>Re-verify SHA-256</span>
                      </button>
                    )}
                  </div>

                  {/* Flash Handset Button (Active only when verified & device present) */}
                  <div>
                    {pkg.status === 'VERIFIED' && (
                      <button
                        onClick={() => onSelectFirmwareForFlashing(pkg)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Select for Official Flashing</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
