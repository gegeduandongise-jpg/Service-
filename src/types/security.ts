export type TechnicianRole = 'TECHNICIAN' | 'SUPERVISOR' | 'ADMINISTRATOR' | 'AUDITOR';

export interface Technician {
  id: string;
  name: string;
  role: TechnicianRole;
  badgeNumber: string;
  email: string;
  certifications: string[];
  active: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  idType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID' | 'ENTERPRISE_PO';
  idNumberMasked: string;
  verifiedByTechnicianId: string;
  verifiedAt: string;
}

export type AuthorizationType = 
  | 'DIRECT_OWNER_AUTHORIZATION' 
  | 'ENTERPRISE_ADMIN_DISPATCH' 
  | 'WARRANTY_OEM_AUTHORIZED_RMA' 
  | 'INSURANCE_REPAIR_ORDER' 
  | 'RECYCLING_DISPOSAL_CLEARANCE';

export interface AuthorizationRecord {
  id: string;
  ticketId: string;
  authorizationType: AuthorizationType;
  customerGovIdVerified: boolean;
  legalTermsAccepted: boolean;
  waiverSigned: boolean;
  customerNotes?: string;
  referenceProofDocument?: string;
  recordedAt: string;
}

export type TicketStatus = 'NEW' | 'DIAGNOSTICS' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  technicianId: string;
  customerId: string;
  deviceId?: string;
  deviceLabel: string;
  declaredIssue: string;
  requestedOperation: string;
  status: TicketStatus;
  authorizationRecordId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  technicianName: string;
  technicianRole: TechnicianRole;
  ticketNumber?: string;
  deviceSummary?: string;
  operationType: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED' | 'BLOCKED_BY_POLICY';
  firmwareChecksum?: string;
  authorizationRef?: string;
  error?: string;
  durationMs?: number;
  payloadJson?: string;
  prevHash: string;
  recordHash: string;
}
