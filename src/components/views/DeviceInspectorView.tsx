import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { 
  Smartphone, 
  Cpu, 
  ShieldCheck, 
  Usb, 
  Lock, 
  Info, 
  AlertTriangle, 
  Check, 
  Save, 
  ExternalLink,
  Layers,
  FileKey
} from 'lucide-react';
import { UsbConnectionEngine } from '../../services/usbConnectionEngine.ts';

interface DeviceInspectorViewProps {
  device: AndroidDevice | null;
  onOpenDriverHelp: () => void;
  onOpenDeviceSwitcher: () => void;
}

export const DeviceInspectorView: React.FC<DeviceInspectorViewProps> = ({
  device,
  onOpenDriverHelp,
  onOpenDeviceSwitcher
}) => {
  const [manualImeiInput, setManualImeiInput] = useState(device?.referenceImei || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!device) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4">
        <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 mx-auto">
          <Smartphone className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-zinc-200">No Android Device Connected</h2>
        <p className="text-xs text-zinc-400">
          Connect an Android phone via USB cable and ensure USB Debugging or Fastboot mode is active.
        </p>
        <button
          onClick={onOpenDeviceSwitcher}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
        >
          Select Simulated Test Handset
        </button>
      </div>
    );
  }

  const handleSaveReferenceImei = () => {
    UsbConnectionEngine.getInstance().updateReferenceImei(manualImeiInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span>Hardware & Property Inspector</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Read-only hardware characteristics queried via legitimate official USB/ADB interfaces
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDeviceSwitcher}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700"
          >
            Change Mode / Handset
          </button>
          <button
            onClick={onOpenDriverHelp}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5"
          >
            <Usb className="w-3.5 h-3.5 text-blue-400" />
            <span>Driver Diagnostics</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Hardware Properties & Platform */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Properties Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Platform & Build Specifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Manufacturer & Brand</span>
                <span className="text-sm font-bold text-zinc-100 font-sans">{device.manufacturer} ({device.brand})</span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Commercial Model & Regulatory</span>
                <span className="text-sm font-bold text-zinc-100">{device.marketName} • {device.modelNumber}</span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Android OS & SDK API Level</span>
                <span className="text-zinc-200">Android {device.androidVersion} (API Level {device.sdkVersion})</span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Security Patch Level</span>
                <span className="text-emerald-400 font-bold">{device.securityPatch}</span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg sm:col-span-2">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Build Fingerprint (ro.build.fingerprint)</span>
                <span className="text-zinc-300 text-[11px] break-all">{device.buildFingerprint}</span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg sm:col-span-2">
                <span className="text-[10px] text-zinc-400 block uppercase font-sans">Kernel Version</span>
                <span className="text-zinc-400 text-[11px] break-all">{device.kernelVersion}</span>
              </div>
            </div>
          </div>

          {/* Hardware Chipset & Security Architecture */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Silicon & Verified Boot Subsystem</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase">Board / Hardware</span>
                <span className="font-mono font-bold text-zinc-200">{device.board} ({device.hardwareRevision})</span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase">Bootloader Status</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{device.bootloaderStatus}</span>
                </span>
              </div>

              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg">
                <span className="text-[10px] text-zinc-400 block uppercase">Android Verified Boot (AVB)</span>
                <span className="font-mono font-bold text-zinc-200 uppercase">State: {device.verifiedBootState}</span>
              </div>

              {device.knoxActive && (
                <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg sm:col-span-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase">Samsung Knox Hardware Fuse</span>
                    <span className="font-mono text-zinc-200 text-xs">
                      Warranty Bit: <strong className={device.knoxWarrantyBit === 0 ? 'text-emerald-400' : 'text-rose-400'}>0x{device.knoxWarrantyBit}</strong> ({device.knoxWarrantyBit === 0 ? 'Intact / Factory Sealed' : 'Tripped'})
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                    KNOX 3.10
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Col 3: USB Endpoint & IMEI Policy Enforcement */}
        <div className="space-y-6">
          {/* USB Endpoint Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <Usb className="w-4 h-4 text-blue-400" />
              <span>USB Interface Endpoint</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">USB Mode</span>
                <span className="font-mono font-bold text-blue-400">{device.connectionMode}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Vendor ID (VID)</span>
                <span className="font-mono text-zinc-200">0x{device.usbInfo.vid}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Product ID (PID)</span>
                <span className="font-mono text-zinc-200">0x{device.usbInfo.pid}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Link Bus Speed</span>
                <span className="font-mono text-zinc-200">{device.usbInfo.speedMbps} Mbps</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-400">Driver State</span>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                  device.usbInfo.driverInstalled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {device.usbInfo.driverStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Legal IMEI Handling Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
              <FileKey className="w-4 h-4 text-emerald-400" />
              <span>IMEI & Identifier Policy</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-zinc-400 block text-[10px] uppercase font-mono">Legitimately Exposed Hardware IMEI</span>
                <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-zinc-100 font-bold mt-1 flex items-center justify-between">
                  <span>{device.imeiMasked || 'NOT AVAILABLE (REDACTED)'}</span>
                  <span className="text-[10px] font-normal text-emerald-400 px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 rounded">
                    {device.imeiStatus}
                  </span>
                </div>
              </div>

              {/* Technician Reference IMEI Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold text-zinc-300">
                  Manual Technician Reference Note (Optional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualImeiInput}
                    onChange={(e) => setManualImeiInput(e.target.value)}
                    placeholder="Enter IMEI from SIM tray / Box"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSaveReferenceImei}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shrink-0 flex items-center gap-1"
                  >
                    {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{saveSuccess ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
                <span className="text-[10px] text-zinc-400 block">
                  Used strictly for service ticket & customer documentation tracking.
                </span>
              </div>

              {/* Absolute Legal Proviso */}
              <div className="p-3 rounded-lg bg-zinc-950 border border-rose-900/60 text-rose-200/90 text-[10px] space-y-1 leading-relaxed">
                <div className="font-bold flex items-center gap-1 text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>NON-NEGOTIABLE LEGAL DIRECTIVE</span>
                </div>
                <p>
                  This application <strong>NEVER</strong> modifies, erases, generates, spoofs, or patches hardware IMEI or baseband NVRAM under any circumstances. Such operations violate federal telecommunications law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
