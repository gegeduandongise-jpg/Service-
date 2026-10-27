import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

interface SafetyConfirmationModalProps {
  isOpen: boolean;
  title: string;
  operationName: string;
  targetPhrase: string; // e.g. "ERASE USER DATA"
  dataLossWarning: string;
  frpWarning?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafetyConfirmationModal: React.FC<SafetyConfirmationModalProps> = ({
  isOpen,
  title,
  operationName,
  targetPhrase,
  dataLossWarning,
  frpWarning,
  onConfirm,
  onCancel
}) => {
  const [typedPhrase, setTypedPhrase] = useState('');
  const [understoodWaiver, setUnderstoodWaiver] = useState(false);

  if (!isOpen) return null;

  const isMatched = typedPhrase.trim().toUpperCase() === targetPhrase.toUpperCase() && understoodWaiver;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-rose-800/80 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-rose-950/80 border-b border-rose-800/80 px-5 py-4 flex items-center justify-between text-rose-200">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span className="font-bold text-sm tracking-wide uppercase">{title}</span>
          </div>
          <button 
            onClick={onCancel}
            className="text-rose-300/80 hover:text-rose-100 rounded-lg p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-zinc-300">
          {/* Critical Warnings */}
          <div className="p-3.5 bg-rose-950/40 border border-rose-900 rounded-lg space-y-2 text-rose-200">
            <div className="font-bold flex items-center gap-1.5 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>IRREVERSIBLE OPERATION: {operationName}</span>
            </div>
            <p className="leading-relaxed">{dataLossWarning}</p>
          </div>

          {/* FRP Warning */}
          {frpWarning && (
            <div className="p-3 bg-amber-950/40 border border-amber-900/80 rounded-lg space-y-1 text-amber-200">
              <div className="font-semibold text-amber-300">Important FRP (Device Protection) Notice:</div>
              <p className="leading-relaxed text-[11px]">{frpWarning}</p>
            </div>
          )}

          {/* Explicit Acknowledgement Checkbox */}
          <label className="flex items-start gap-2.5 p-2.5 rounded bg-zinc-800/60 border border-zinc-700/80 cursor-pointer">
            <input
              type="checkbox"
              checked={understoodWaiver}
              onChange={(e) => setUnderstoodWaiver(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 text-rose-600 focus:ring-rose-500"
            />
            <span className="text-[11px] text-zinc-300 leading-snug">
              I certify that I have verified legitimate customer ownership authorization and that all required backups have been offered or completed.
            </span>
          </label>

          {/* Confirmation String Input */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-[11px] font-semibold text-zinc-400">
              Type <span className="font-mono text-rose-400 font-bold bg-zinc-950 px-1.5 py-0.5 rounded border border-rose-950">{targetPhrase}</span> below to confirm:
            </label>
            <input
              type="text"
              value={typedPhrase}
              onChange={(e) => setTypedPhrase(e.target.value)}
              placeholder={targetPhrase}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono tracking-wider focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 placeholder:text-zinc-700"
              autoFocus
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (isMatched) {
                onConfirm();
                setTypedPhrase('');
                setUnderstoodWaiver(false);
              }
            }}
            disabled={!isMatched}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
              isMatched
                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
            }`}
          >
            CONFIRM AND EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
};
