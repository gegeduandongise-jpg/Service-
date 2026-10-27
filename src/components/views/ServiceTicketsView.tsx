import React, { useState } from 'react';
import { AndroidDevice } from '../../types/device.ts';
import { 
  ServiceTicket, 
  TicketStatus, 
  AuthorizationType, 
  Customer 
} from '../../types/security.ts';
import { 
  ClipboardList, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Search, 
  UserCheck, 
  FileText, 
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import { StorageService } from '../../services/storageService.ts';

interface ServiceTicketsViewProps {
  device: AndroidDevice | null;
  activeTicket?: ServiceTicket;
  tickets: ServiceTicket[];
  onSelectActiveTicket: (ticket: ServiceTicket) => void;
  onRefreshTickets: () => void;
}

export const ServiceTicketsView: React.FC<ServiceTicketsViewProps> = ({
  device,
  activeTicket,
  tickets,
  onSelectActiveTicket,
  onRefreshTickets
}) => {
  const storage = StorageService.getInstance();
  const tech = storage.getActiveTechnician();
  const customers = storage.getCustomers();
  const authRecords = storage.getAuthRecords();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New ticket form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [govIdType, setGovIdType] = useState<'DRIVERS_LICENSE' | 'PASSPORT' | 'NATIONAL_ID' | 'ENTERPRISE_PO'>('DRIVERS_LICENSE');
  const [govIdMasked, setGovIdMasked] = useState('');
  const [authType, setAuthType] = useState<AuthorizationType>('DIRECT_OWNER_AUTHORIZATION');
  const [declaredIssue, setDeclaredIssue] = useState('');
  const [requestedOp, setRequestedOp] = useState('OFFICIAL_FIRMWARE_FLASH');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    const custId = `cust_${Date.now()}`;
    const newCustomer: Customer = {
      id: custId,
      fullName: customerName,
      phone: customerPhone,
      email: customerEmail,
      idType: govIdType,
      idNumberMasked: govIdMasked,
      verifiedByTechnicianId: tech.id,
      verifiedAt: new Date().toISOString()
    };
    storage.addCustomer(newCustomer);

    const ticketId = `ticket_${Date.now()}`;
    const ticketNum = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: ServiceTicket = {
      id: ticketId,
      ticketNumber: ticketNum,
      technicianId: tech.id,
      customerId: custId,
      deviceId: device?.id,
      deviceLabel: device ? `${device.marketName} (${device.modelNumber})` : 'Unconnected Device',
      declaredIssue,
      requestedOperation: requestedOp,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    storage.saveTicket(newTicket);
    storage.saveAuthRecord({
      id: `auth_${Date.now()}`,
      ticketId,
      authorizationType: authType,
      customerGovIdVerified: true,
      legalTermsAccepted: true,
      waiverSigned: true,
      recordedAt: new Date().toISOString()
    });

    storage.appendAuditLog({
      timestamp: new Date().toISOString(),
      technicianName: tech.name,
      technicianRole: tech.role,
      ticketNumber: ticketNum,
      deviceSummary: newTicket.deviceLabel,
      operationType: 'SERVICE_TICKET_INTAKE_AUTHORIZED',
      result: 'SUCCESS'
    });

    onRefreshTickets();
    onSelectActiveTicket(newTicket);
    setIsCreatingNew(false);

    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setGovIdMasked('');
    setDeclaredIssue('');
    setTermsAccepted(false);
  };

  const handleUpdateStatus = (ticket: ServiceTicket, newStatus: TicketStatus) => {
    const updated: ServiceTicket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined
    };
    storage.saveTicket(updated);
    onRefreshTickets();
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.deviceLabel.toLowerCase().includes(search.toLowerCase()) ||
      t.declaredIssue.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <span>Authorized Service Tickets &amp; Proof of Ownership Intake</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Legal pre-condition: Every servicing action requires verified government/enterprise ID and customer signed consent
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingNew ? 'Cancel Intake' : 'New Intake Work Order'}</span>
        </button>
      </div>

      {/* New Work Order Intake Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateTicket} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Customer Identification &amp; Statutory Proof of Ownership Intake</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
              TECH: {tech.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Customer Legal Full Name:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Phone Number:</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Email Address:</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Gov / Enterprise ID Type:</label>
              <select
                value={govIdType}
                onChange={(e) => setGovIdType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option value="DRIVERS_LICENSE">Driver&apos;s License</option>
                <option value="PASSPORT">Passport</option>
                <option value="NATIONAL_ID">National Identity Card</option>
                <option value="ENTERPRISE_PO">Enterprise Purchase Order / Dispatch</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Masked ID Number:</label>
              <input
                type="text"
                required
                value={govIdMasked}
                onChange={(e) => setGovIdMasked(e.target.value)}
                placeholder="DL-****-1234"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold block">Proof of Ownership Category:</label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value as AuthorizationType)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option value="DIRECT_OWNER_AUTHORIZATION">Direct Owner Authorization (Receipt / Account)</option>
                <option value="ENTERPRISE_ADMIN_DISPATCH">Enterprise Fleet Admin Dispatch</option>
                <option value="WARRANTY_OEM_AUTHORIZED_RMA">Warranty OEM Authorized RMA</option>
                <option value="INSURANCE_REPAIR_ORDER">Insurance Repair Order</option>
                <option value="RECYCLING_DISPOSAL_CLEARANCE">Recycling / Disposal Clearance</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-zinc-400 font-semibold block">Customer Declared Symptom &amp; Scope:</label>
            <textarea
              required
              rows={2}
              value={declaredIssue}
              onChange={(e) => setDeclaredIssue(e.target.value)}
              placeholder="e.g. Interrupted OTA update resulted in bootloop; authorized official factory reflash requested."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Legal Consent Acknowledgement */}
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 text-blue-600 focus:ring-0"
              />
              <span className="text-zinc-300 leading-relaxed text-[11px]">
                I verify that the customer has provided valid government/corporate identification and original purchase invoice. In accordance with legal policies, I certify that no FRP, screen lock, MDM, or IMEI circumvention will be attempted.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!termsAccepted}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm"
            >
              Register &amp; Authorize Ticket
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket #, device, issue..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-zinc-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="DIAGNOSTICS">DIAGNOSTICS</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid gap-3">
        {filteredTickets.map((t) => {
          const isActive = activeTicket?.id === t.id;
          const cust = customers.find(c => c.id === t.customerId);
          const auth = authRecords.find(a => a.ticketId === t.id);

          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-zinc-900 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-zinc-100 font-mono">{t.ticketNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    t.status === 'COMPLETED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : t.status === 'IN_PROGRESS'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {t.status}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                      ACTIVE TICKET
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => onSelectActiveTicket(t)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700"
                    >
                      Set Active
                    </button>
                  )}
                  {t.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleUpdateStatus(t, 'COMPLETED')}
                      className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold border border-emerald-800 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">CUSTOMER &amp; VERIFICATION</span>
                  <div className="font-semibold text-zinc-200">{cust?.fullName || 'Walk-in Customer'}</div>
                  <div className="text-[11px] text-zinc-400">{cust?.phone}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    {auth?.authorizationType || 'DIRECT_OWNER_AUTHORIZATION'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">DEVICE &amp; REQUEST</span>
                  <div className="font-semibold text-zinc-200">{t.deviceLabel}</div>
                  <div className="text-[11px] text-zinc-400">{t.requestedOperation}</div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">DECLARED ISSUE</span>
                  <p className="text-[11px] text-zinc-300 line-clamp-2">{t.declaredIssue}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
