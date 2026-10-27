import { ServicingErrorCode, ServicingErrorDetail } from '../types/errors.ts';

export class ErrorCatalog {
  public static createError(code: ServicingErrorCode, customDetails?: string): ServicingErrorDetail {
    const timestamp = new Date().toISOString();

    switch (code) {
      case ServicingErrorCode.BATTERY_LOW:
        return {
          code,
          title: 'Battery Level Too Low for Servicing',
          humanMessage: 'The device battery level is below the minimum required 50% safety threshold. Flashing or resetting with a low battery risks irreversible device bricking.',
          technicalDetails: customDetails || 'Current battery percentage < 50%.',
          possibleCause: 'Device has been discharging during diagnostics or has a degraded battery cell.',
          officialSolution: 'Connect device to a high-output power adapter and charge until battery reaches at least 60% before continuing.',
          recoveryInstructions: [
            'Disconnect device from flashing interface.',
            'Plug into an official OEM fast charger for at least 20 minutes.',
            'Verify battery level via diagnostics view before retrying.'
          ],
          timestamp
        };

      case ServicingErrorCode.MODEL_MISMATCH:
        return {
          code,
          title: 'Firmware Hardware Model Mismatch',
          humanMessage: 'The selected firmware package is incompatible with the connected device hardware model.',
          technicalDetails: customDetails || 'Device ro.product.model does not match target package manifest.',
          possibleCause: 'Cross-flashing another carrier variant or different hardware revision.',
          officialSolution: 'Download the exact official firmware matching the device model number and CSC region code.',
          recoveryInstructions: [
            'Inspect the device back panel or SIM tray for exact regulatory model number.',
            'Query ro.product.model and ro.boot.hardware via Device Inspector.',
            'Locate and verify matching official package in Firmware Manager.'
          ],
          timestamp
        };

      case ServicingErrorCode.CHECKSUM_ERROR:
        return {
          code,
          title: 'Firmware Cryptographic Hash Verification Failed',
          humanMessage: 'The firmware package file failed SHA-256 / SHA-512 cryptographic verification. Flashing corrupted firmware is blocked.',
          technicalDetails: customDetails || 'Computed digest does not match expected OEM manifest hash.',
          possibleCause: 'Incomplete download, storage drive bit rot, or file tampering.',
          officialSolution: 'Delete corrupted file and re-download via official HTTPS repository with range verification.',
          recoveryInstructions: [
            'Click "Re-verify" or re-download package in Firmware Manager.',
            'Check local workstation disk health for bad sectors.',
            'Ensure download completes without proxy interruptions.'
          ],
          timestamp
        };

      case ServicingErrorCode.USB_ERROR:
        return {
          code,
          title: 'USB Bus Transmission Instability',
          humanMessage: 'USB communication link dropped or experienced excessive packet re-transmissions.',
          technicalDetails: customDetails || 'libusb pipe error or transfer timeout during protocol payload transfer.',
          possibleCause: 'Faulty USB cable, unpowered USB hub, or front-panel computer port impedance.',
          officialSolution: 'Use an OEM certified USB 3.0/Type-C cable plugged directly into the motherboard rear USB port.',
          recoveryInstructions: [
            'Avoid passive USB hubs or extension cables.',
            'Clean the phone USB Type-C port with an anti-static brush.',
            'Run the USB Throughput Stability Test in Diagnostics view.'
          ],
          timestamp
        };

      case ServicingErrorCode.DRIVER_ERROR:
        return {
          code,
          title: 'Missing or Unsigned Manufacturer USB Driver',
          humanMessage: 'The operating system does not have the required official manufacturer USB driver installed.',
          technicalDetails: customDetails || 'WinUSB / udev interface endpoint not accessible.',
          possibleCause: 'Windows generic driver installed or Linux udev permissions missing.',
          officialSolution: 'Install official OEM driver package (e.g. Google USB Driver, Samsung USB Driver) or configure udev rules.',
          recoveryInstructions: [
            'Open Driver Assistance in Settings / Help view.',
            'On Windows: Install WHQL-certified OEM USB driver.',
            'On Linux: Add udev rules to /etc/udev/rules.d/51-android.rules and restart udev.'
          ],
          timestamp
        };

      case ServicingErrorCode.AUTHORIZATION_ERROR:
        return {
          code,
          title: 'Service Ticket Authorization Missing',
          humanMessage: 'High-risk and destructive operations require documented customer authorization and an active service ticket.',
          technicalDetails: customDetails || 'Missing AuthorizationRecord with customer Gov ID verification.',
          possibleCause: 'Technician attempted to flash or reset without completing intake documentation.',
          officialSolution: 'Create or select an active Service Ticket and record customer ownership authorization.',
          recoveryInstructions: [
            'Navigate to Service Tickets view.',
            'Record customer name, contact details, ID verification, and signed intake waiver.',
            'Re-attempt operation with verified ticket authorization.'
          ],
          timestamp
        };

      case ServicingErrorCode.DEVICE_DISCONNECTED:
        return {
          code,
          title: 'Device Unexpectedly Disconnected',
          humanMessage: 'The device was disconnected during an active servicing session.',
          technicalDetails: customDetails || 'USB physical connection terminated unexpectedly.',
          possibleCause: 'Physical cable disconnection, device crash, or battery discharge.',
          officialSolution: 'Safely inspect device state and re-connect in official recovery or bootloader mode.',
          recoveryInstructions: [
            'Do NOT panic. Most modern devices with A/B partitioning will reboot safely to the inactive slot.',
            'Re-attach official USB cable.',
            'Power device on using manufacturer recovery key combination.',
            'Consult the Manufacturer Plugin recovery guidelines for specific emergency steps.'
          ],
          timestamp
        };

      default:
        return {
          code: ServicingErrorCode.UNSUPPORTED_DEVICE,
          title: 'Servicing Exception Encountered',
          humanMessage: customDetails || 'An unexpected servicing error occurred.',
          possibleCause: 'Device state or interface responded with an unhandled status code.',
          officialSolution: 'Consult official manufacturer service manual and device logs.',
          recoveryInstructions: [
            'Check Device Inspector for connection state.',
            'Review recent audit logs for detailed exception trace.',
            'Restart ADB server or reboot device into official bootloader.'
          ],
          timestamp
        };
    }
  }
}
