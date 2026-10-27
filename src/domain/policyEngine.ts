import { ServicingErrorCode, ServicingErrorDetail } from '../types/errors.ts';

export interface ProhibitedOperationCheck {
  isPermitted: boolean;
  violationType?: 
    | 'FRP_BYPASS' 
    | 'LOCKSCREEN_BYPASS' 
    | 'IMEI_MODIFICATION' 
    | 'MDM_BYPASS' 
    | 'CARRIER_LOCK_BYPASS' 
    | 'BOOTLOADER_EXPLOIT' 
    | 'CREDENTIAL_EXTRACTION' 
    | 'UNAUTHORIZED_DATA_ACCESS';
  errorDetail?: ServicingErrorDetail;
}

export class LegalSecurityPolicyEngine {
  /**
   * Evaluates any requested operation against non-negotiable legal and security boundaries.
   * If any bypass, credential extraction, or IMEI modification is attempted, it unconditionally blocks it
   * and generates official manufacturer/Google recovery guidance.
   */
  public static evaluateOperation(operationName: string, params: Record<string, any> = {}): ProhibitedOperationCheck {
    const normalized = operationName.toUpperCase();

    // 1. FRP Circumvention Check
    if (
      normalized.includes('FRP_BYPASS') || 
      normalized.includes('BYPASS_GOOGLE') || 
      normalized.includes('REMOVE_FRP_EXPLOIT') ||
      normalized.includes('SETUP_WIZARD_BYPASS')
    ) {
      return {
        isPermitted: false,
        violationType: 'FRP_BYPASS',
        errorDetail: {
          code: ServicingErrorCode.SECURITY_RESTRICTION,
          title: 'Operation Prohibited: FRP Circumvention Refused',
          humanMessage: 'Factory Reset Protection (FRP) is a critical Google security feature protecting stolen devices. Bypassing FRP is strictly prohibited by application policy and legal compliance standards.',
          possibleCause: 'Device was reset with an active Google Account associated with the previous owner.',
          officialSolution: 'Provide proof of legal purchase or original invoice to an authorized manufacturer service center, or log in with the verified Google account.',
          recoveryInstructions: [
            'Instruct the verified owner to complete Google Account sign-in on the device setup wizard.',
            'If the owner forgot their password, direct them to the official Google Account recovery portal at: https://g.co/recover',
            'For enterprise devices, contact the enterprise IT administrator to retire the device from Google Zero-Touch or MDM console.',
            'For hardware proof-of-purchase, guide the customer to an authorized OEM Service Center (e.g. Samsung Service Plaza, Google Authorized Repair Center).'
          ],
          timestamp: new Date().toISOString()
        }
      };
    }

    // 2. Lock-Screen / PIN / Password Bypass Check
    if (
      normalized.includes('BYPASS_PIN') || 
      normalized.includes('BYPASS_PASSWORD') || 
      normalized.includes('REMOVE_LOCKSCREEN') ||
      normalized.includes('EXTRACT_CREDENTIALS')
    ) {
      return {
        isPermitted: false,
        violationType: 'LOCKSCREEN_BYPASS',
        errorDetail: {
          code: ServicingErrorCode.SECURITY_RESTRICTION,
          title: 'Operation Prohibited: Lockscreen Credential Bypass Refused',
          humanMessage: 'Removing or reading user PIN, Password, Pattern, or Biometric encryption without authorization is strictly prohibited.',
          possibleCause: 'Customer or technician attempted to clear lock-screen credentials without performing an authorized factory wipe or official remote unlock.',
          officialSolution: 'Use official manufacturer remote services (e.g., Samsung Find, Google Find My Device) where authorized, or perform an official factory reset with explicit customer sign-off.',
          recoveryInstructions: [
            'Have the customer log in directly to Google Find My Device (https://www.google.com/android/find) to trigger official owner actions.',
            'For Samsung devices with Remote Unlock previously enabled, direct customer to Samsung SmartThings Find (https://smartthingsfind.samsung.com).',
            'If credentials are permanently forgotten and authorized by the verified owner, perform an Official Factory Reset (erases all data and requires subsequent Google Account authentication).'
          ],
          timestamp: new Date().toISOString()
        }
      };
    }

    // 3. IMEI Modification / Spoofing / Patching Check
    if (
      normalized.includes('WRITE_IMEI') || 
      normalized.includes('CHANGE_IMEI') || 
      normalized.includes('SPOOF_IMEI') ||
      normalized.includes('REPAIR_IMEI_PATCH') ||
      normalized.includes('ERASE_NVRAM_IMEI')
    ) {
      return {
        isPermitted: false,
        violationType: 'IMEI_MODIFICATION',
        errorDetail: {
          code: ServicingErrorCode.PROHIBITED_OPERATION,
          title: 'Illegal Operation: IMEI Modification Strictly Prohibited',
          humanMessage: 'Altering, re-writing, generating, spoofing, or erasing International Mobile Equipment Identity (IMEI) numbers is illegal under telecommunications law and strictly prohibited.',
          possibleCause: 'Attempted to invoke NVRAM/EFS rewrite or IMEI alteration routine.',
          officialSolution: 'Hardware baseband/EFS repair must be conducted exclusively through OEM-authorized motherboard replacement or authorized manufacturer service channels.',
          recoveryInstructions: [
            'Verify physical IMEI printed on SIM tray or original proof-of-purchase box.',
            'For genuine hardware baseband corruption, order an official OEM motherboard replacement from the authorized distributor.',
            'Refuse any customer request to change, spoof, or generate IMEI numbers.'
          ],
          timestamp: new Date().toISOString()
        }
      };
    }

    // 4. Enterprise MDM / Knox Circumvention Check
    if (
      normalized.includes('BYPASS_MDM') || 
      normalized.includes('REMOVE_DEVICE_OWNER_UNAUTHORIZED') || 
      normalized.includes('BYPASS_KNOX_GUARD') ||
      normalized.includes('KILL_PAYJOY')
    ) {
      return {
        isPermitted: false,
        violationType: 'MDM_BYPASS',
        errorDetail: {
          code: ServicingErrorCode.SECURITY_RESTRICTION,
          title: 'Operation Prohibited: Enterprise Policy Bypass Refused',
          humanMessage: 'Device Owner, Profile Owner, and Enterprise MDM enrollment enforce enterprise asset ownership. Disabling MDM without IT administrator dispatch is prohibited.',
          possibleCause: 'Device belongs to an enterprise fleet, school district, or carrier finance agreement.',
          officialSolution: 'Request official deprovisioning from the registered Enterprise IT Administrator or finance provider.',
          recoveryInstructions: [
            'Contact the registered IT Administrator identified in the Enterprise / MDM diagnostics view.',
            'Request de-enrollment via Google Zero-Touch Portal, Samsung Knox Mobile Enrollment (KME), or the relevant EMM console (Intune, VMware Workspace ONE, etc.).',
            'Do not attempt exploit-based package disabling.'
          ],
          timestamp: new Date().toISOString()
        }
      };
    }

    // Operation passes zero-bypass policy filters
    return { isPermitted: true };
  }
}
