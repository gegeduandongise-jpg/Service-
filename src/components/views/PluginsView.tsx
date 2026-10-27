import React, { useState } from 'react';
import { OEM_PLUGINS } from '../../plugins/pluginRegistry.ts';
import { ManufacturerPlugin } from '../../types/plugins.ts';
import { 
  Puzzle, 
  ShieldCheck, 
  ExternalLink, 
  AlertTriangle, 
  Cpu, 
  Smartphone,
  CheckCircle2,
  Terminal,
  FileKey
} from 'lucide-react';

export const PluginsView: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<ManufacturerPlugin>(OEM_PLUGINS[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-blue-400" />
            <span>Official OEM Servicing Plugins & Specifications</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Architecture profiles, official flashing protocols, verified signatures, and recovery guidelines by manufacturer
          </p>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
          {OEM_PLUGINS.length} OEM PROFILES LOADED
        </span>
      </div>

      {/* OEM Plugin Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plugin list */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
            Registered Manufacturer Frameworks
          </div>

          <div className="space-y-1.5">
            {OEM_PLUGINS.map((plug) => {
              const isSelected = selectedPlugin.metadata.id === plug.metadata.id;
              return (
                <button
                  key={plug.metadata.id}
                  onClick={() => setSelectedPlugin(plug)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-md border-blue-500'
                      : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>{plug.metadata.vendorName}</span>
                    {plug.metadata.isVerifiedOemSigned && (
                      <ShieldCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                    )}
                  </div>
                  <div className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                    v{plug.metadata.pluginVersion} • {plug.capabilities.canOfficialFlash ? 'Official Flash' : 'Diagnostics'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected OEM Deep Dive */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div>
                <h2 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                  <span>{selectedPlugin.metadata.vendorName}</span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {selectedPlugin.metadata.id}
                  </span>
                </h2>
                <div className="text-xs text-zinc-400 mt-1">
                  Author: {selectedPlugin.metadata.author} • v{selectedPlugin.metadata.pluginVersion}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-500 block uppercase">SIGNATURE</span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ED25519 VERIFIED
                </span>
              </div>
            </div>

            {/* Supported Protocols & Official Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase font-sans">SUPPORTED PROTOCOLS</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedPlugin.metadata.supportedProtocols.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-blue-300 border border-zinc-700 text-[10px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
                <span className="text-[10px] text-zinc-500 block uppercase font-sans">OFFICIAL RECOVERY TOOLS</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedPlugin.metadata.officialRecoveryTools.map((tool, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryptographic Signature & Documentation */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200">Official Portal & Documentation:</span>
                <a
                  href={selectedPlugin.metadata.officialDocumentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold"
                >
                  <span>OEM Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="text-[11px] font-mono text-zinc-400 break-all">
                Fingerprint: {selectedPlugin.metadata.cryptographicSignature}
              </div>
            </div>

            {/* Diagnostic Commands */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>OEM-Specific Diagnostic Commands</span>
              </div>
              <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 space-y-1 font-mono text-xs text-zinc-300">
                {selectedPlugin.capabilities.oemSpecificDiagnosticCommands.map((cmd, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-zinc-500">$</span>
                    <span className="text-emerald-400">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery Key Sequence */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Physical Recovery Key Combo Sequence</span>
              </div>
              <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 text-xs text-zinc-300">
                {selectedPlugin.capabilities.recoveryKeyCombo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
