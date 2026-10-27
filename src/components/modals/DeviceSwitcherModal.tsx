import React from 'react';
import { UsbConnectionEngine } from '../../services/usbConnectionEngine.ts';
import { AndroidDevice, ConnectionMode } from '../../types/device.ts';
import { Usb, Battery, X, Check, Laptop } from 'lucide-react';

interface DeviceSwitcherModalProps {
  isOpen: boolean;
  currentDevice: AndroidDevice | null;
  onClose: () => void;
}

export const DeviceSwitcherModal: React.FC<DeviceSwitcherModalProps> = ({
  isOpen,
  currentDevice,
  onClose
}) => {
  if (!isOpen) return null;

  const engine = UsbConnectionEngine.getInstance();
  const sampleDevices = UsbConnectionEngine.SAMPLE_DEVICES;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-zinc-800/80 border-b border-zinc-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Laptop className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-sm text-zinc-100">Hardware Connection & Device Simulator</h2>
              <p className="text-[11px] text-zinc-400">Select connected test handset, mode, or battery state</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-zinc-300 max-h-[80vh] overflow-y-auto">
          {/* Handset Profiles */}
          <div className="space-y-2">
            <div className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
              Available USB Devices / Profiles
            </div>
            <div className="grid gap-2">
              {sampleDevices.map((dev) => {
                const isSelected = currentDevice?.id === dev.id;
                return (
                  <button
                    key={dev.id}
                    onClick={() => {
                      engine.setConnectedDevice(dev);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-600 text-blue-100'
                        : 'bg-zinc-800/60 border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                        <span>{dev.marketName}</span>
                        <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                          {dev.modelNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                        VID:PID {dev.usbInfo.vid}:{dev.usbInfo.pid} • {dev.usbInfo.driverName || 'No Driver'} • {dev.chipset}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
                        <Check className="w-4 h-4" /> Connected
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Disconnect Button */}
              <button
                onClick={() => engine.setConnectedDevice(null)}
                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  currentDevice === null
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100'
                    : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-900 text-zinc-400'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">Disconnect All USB Devices</div>
                  <div className="text-[11px] text-zinc-500">Simulate physical cable unplugging / IDLE state</div>
                </div>
                {currentDevice === null && <Check className="w-4 h-4 text-zinc-300" />}
              </button>
            </div>
          </div>

          {currentDevice && (
            <>
              {/* Connection Mode Controls */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
                  Switch Protocol Interface Mode
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['ADB', 'FASTBOOT', 'RECOVERY', 'AUTHORIZED_SERVICE_MODE'] as ConnectionMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => engine.switchMode(mode)}
                      className={`px-3 py-2 rounded-lg border text-center font-mono text-[11px] font-bold transition-all ${
                        currentDevice.connectionMode === mode
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {mode.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery Level Slider */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Battery Level Simulation</span>
                  </div>
                  <span className={`font-mono font-bold text-sm ${currentDevice.batteryLevelPercent < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentDevice.batteryLevelPercent}% {currentDevice.batteryLevelPercent < 50 ? '(BLOCKS FLASHING)' : '(SAFE)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={currentDevice.batteryLevelPercent}
                  onChange={(e) => engine.simulateBatteryLevel(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <p className="text-[10px] text-zinc-500">
                  Slide below 50% to test the Pre-Flight Safety Engine refusal (preventing bricking during flash).
                </p>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-3.5 bg-zinc-950/80 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
