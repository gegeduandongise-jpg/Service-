import React from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { AlertTriangle, Download, ExternalLink, ShieldCheck, Terminal, X } from 'lucide-react';

interface DriverHelpModalProps {
  isOpen: boolean;
  device: AndroidDevice | null;
  onClose: () => void;
}

export const DriverHelpModal: React.FC<DriverHelpModalProps> = ({
  isOpen,
  device,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-zinc-800/80 border-b border-zinc-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-sm text-zinc-100">Official OEM USB Driver Diagnostic & Guidance</h2>
              <p className="text-[11px] text-zinc-400">Official vendor links & configuration instructions (Zero unsigned drivers)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-zinc-300 max-h-[80vh] overflow-y-auto">
          {/* Hardware Endpoint Diagnostic Card */}
          {device && (
            <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
              <div className="font-semibold text-zinc-200 text-xs flex items-center justify-between">
                <span>Hardware USB Endpoint Diagnostics</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  device.usbInfo.driverInstalled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {device.usbInfo.driverStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-zinc-400 pt-1">
                <div>
                  <span className="text-zinc-400 block text-[10px]">VENDOR ID (VID)</span>
                  <span className="text-blue-400 font-bold">0x{device.usbInfo.vid}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">PRODUCT ID (PID)</span>
                  <span className="text-blue-400 font-bold">0x{device.usbInfo.pid}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">PROTOCOL</span>
                  <span className="text-zinc-200">{device.usbInfo.protocol}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">LINK SPEED</span>
                  <span className="text-zinc-200">{device.usbInfo.speedMbps} Mbps</span>
                </div>
              </div>
            </div>
          )}

          {/* Strict Security Policy Notice */}
          <div className="p-3 bg-blue-950/40 border border-blue-900 rounded-lg flex items-start gap-2.5 text-[11px] text-blue-200 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              <strong>Security Invariant:</strong> This application never bundles or automatically installs third-party unsigned kernel drivers. Technicians must acquire official, WHQL-signed drivers directly from the device manufacturer to ensure integrity and host workstation security.
            </p>
          </div>

          {/* Official Manufacturer Driver Links */}
          <div className="space-y-2">
            <div className="font-semibold text-zinc-200 uppercase tracking-wider text-[10px]">
              Official Manufacturer Driver Portals
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://developer.android.com/studio/run/win-usb"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400">Google USB Driver</div>
                  <div className="text-[10px] text-zinc-400">For Pixel, Nexus & generic Fastboot</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400" />
              </a>

              <a
                href="https://developer.samsung.com/android-usb-driver"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400">Samsung Mobile USB Driver</div>
                  <div className="text-[10px] text-zinc-400">Official Smart Switch & Odin driver</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400" />
              </a>

              <a
                href="https://en.miui.com/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400">Xiaomi Mi Driver</div>
                  <div className="text-[10px] text-zinc-400">Qualcomm & MediaTek Mi Flash suites</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400" />
              </a>

              <a
                href="https://support.motorola.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="font-bold text-zinc-200 group-hover:text-blue-400">Motorola RSA Assistant</div>
                  <div className="text-[10px] text-zinc-400">Rescue and Smart Assistant official suite</div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400" />
              </a>
            </div>
          </div>

          {/* Linux udev Instructions */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="font-semibold text-zinc-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Linux Workstation udev Configuration</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              If running Linux (Ubuntu, Debian, Fedora), grant permission to the USB endpoint by adding rules to <code className="text-blue-300 font-mono bg-zinc-950 px-1 py-0.5 rounded">/etc/udev/rules.d/51-android.rules</code>:
            </p>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto space-y-1">
              <div># Google Pixel (ADB / Fastboot)</div>
              <div className="text-emerald-400">SUBSYSTEM==&quot;usb&quot;, ATTR&#123;idVendor&#125;==&quot;18d1&quot;, MODE=&quot;0666&quot;, GROUP=&quot;plugdev&quot;</div>
              <div className="pt-1"># Samsung Galaxy</div>
              <div className="text-emerald-400">SUBSYSTEM==&quot;usb&quot;, ATTR&#123;idVendor&#125;==&quot;04e8&quot;, MODE=&quot;0666&quot;, GROUP=&quot;plugdev&quot;</div>
              <div className="pt-1 text-zinc-500"># Reload udev: sudo udevadm control --reload-rules && sudo udevadm trigger</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-zinc-950/80 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
