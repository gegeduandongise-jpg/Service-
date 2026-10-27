import React from 'react';
import { 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  FileText,
  Lock,
  Building
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span>Legal, Regulatory & Security Compliance Charter</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Statutory framework governing authorized electronic device servicing and non-negotiable architectural invariants
          </p>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
          AUDITED COMPLIANCE
        </span>
      </div>

      {/* Zero Bypass Invariants Charter */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Non-Negotiable System Invariants (Zero-Bypass Architecture)</span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          This servicing suite is built on a mathematical &amp; legal principle: it operates exclusively through official, documented manufacturer protocols. Every request is filtered through the <code className="text-blue-400 font-mono">LegalSecurityPolicyEngine</code>, which unconditionally refuses the following prohibited operations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>1. Google FRP / Account Bypass</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Strictly refused. Erasing or modifying the <code className="text-zinc-300 font-mono">/persist</code>, <code className="text-zinc-300 font-mono">/frp</code>, or NVRAM partition tokens without authentic owner authentication is blocked.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>2. PIN / Pattern / Biometric Bypass</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Strictly refused. Hardware-backed Keystore, Weaver token, and Gatekeeper authentication limits cannot be circumvented without cryptographic loss of data.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>3. MDM / Enterprise Profile Bypass</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Strictly refused. Device Owner (DO) and Samsung Knox Mobile Enrollment protections can only be de-enrolled by authorized enterprise IT administrators.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>4. IMEI Modification / Spoofing</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Strictly refused. Hardware IMEI rewriting, NVRAM patching, or baseband IMEI spoofing violate telecommunications statutes and are permanently banned.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>5. Unsigned Bootloader / AVB Exploit</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Strictly refused. Flashing requires authentic, OEM-signed firmware packages matching official SHA-256 digests. Cracked firehose loaders are rejected.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>6. Unauthorized Credential Extraction</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Strictly refused. No raw memory dumping, keystore key exfiltration, or forensic extraction tools are bundled or executed.
            </p>
          </div>
        </div>
      </div>

      {/* Statutory References */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Statutory & International Legal Authorities</span>
        </div>

        <div className="space-y-3 text-xs text-zinc-300">
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-zinc-100">18 U.S.C. § 1030 — Computer Fraud and Abuse Act (CFAA)</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Prohibits intentionally accessing a protected computer without authorization or exceeding authorized access. Technicians must strictly maintain proof of ownership before initiating servicing.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-zinc-100">17 U.S.C. § 1201 — Digital Millennium Copyright Act (DMCA)</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Prohibits circumvention of technological measures that effectively control access to copyrighted works. The application operates strictly within OEM diagnostics exemptions and refuses circumvention tools.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-1">
            <div className="font-bold text-zinc-100">European Directive (EU) 2024/1799 on Common Rules for Repair of Goods</div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Protects consumers&apos; right to repair consumer electronic goods using official software, original parts, and transparent diagnostic data while respecting device privacy protections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
