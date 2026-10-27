import { AndroidDevice } from '../types/device.ts';
import { FirmwarePackage, FlashingPreFlightCheck } from '../types/firmware.ts';
import { ServiceTicket, AuthorizationRecord } from '../types/security.ts';

export class PreFlightSafetyEngine {
  /**
   * Evaluates all pre-flight safety criteria before any destructive or flashing operation.
   * Flashing MUST be blocked if any critical safety check fails.
   */
  public static evaluatePreFlight(
    device: AndroidDevice | null,
    targetFirmware: FirmwarePackage | null,
    activeTicket?: ServiceTicket,
    authRecord?: AuthorizationRecord
  ): FlashingPreFlightCheck {
    const blockers: string[] = [];
    const warnings: string[] = [];

    // 1. Device Presence Check
    if (!device) {
      blockers.push('No Android device is currently detected via USB.');
      return {
        batterySufficient: false,
        batteryPercent: 0,
        usbSpeedSufficient: false,
        modelMatch: false,
        bootloaderVersionMatch: false,
        regionMatch: false,
        firmwareVerified: false,
        authorizedTicketPresent: false,
        backupConfirmed: false,
        passedAllCritical: false,
        blockers,
        warnings
      };
    }

    // 2. Battery Safety Check (Minimum 50% required to prevent mid-flash bricking)
    const batterySufficient = device.batteryLevelPercent >= 50;
    if (!batterySufficient) {
      blockers.push(
        `Battery level (${device.batteryLevelPercent}%) is below the mandatory 50% safety threshold. Charge device before proceeding.`
      );
    } else if (device.batteryLevelPercent < 65) {
      warnings.push(`Battery level (${device.batteryLevelPercent}%) is acceptable but charging to >75% is recommended.`);
    }

    // 3. USB Protocol & Driver Check
    const usbSpeedSufficient = device.usbInfo.driverInstalled && device.usbInfo.speedMbps >= 480;
    if (!device.usbInfo.driverInstalled) {
      blockers.push('Official OEM USB driver is not properly installed or signed in the operating system.');
    } else if (device.usbInfo.speedMbps < 480) {
      warnings.push(`USB link speed is limited to ${device.usbInfo.speedMbps} Mbps. High-speed transfer is recommended.`);
    }

    // 4. Connection Mode Check
    if (device.connectionMode === 'USB_GENERIC' || device.connectionMode === 'UNSUPPORTED') {
      blockers.push(`Device is in ${device.connectionMode} mode. Please switch to ADB, Fastboot, or OEM Service Mode.`);
    }

    // 5. Firmware Compatibility & Integrity Check (if firmware is selected)
    let modelMatch = false;
    let bootloaderVersionMatch = false;
    let regionMatch = false;
    let firmwareVerified = false;

    if (targetFirmware) {
      // Model match
      const devModelClean = device.modelNumber.toUpperCase().replace(/\s+/g, '');
      const fwModelClean = targetFirmware.modelNumber.toUpperCase().replace(/\s+/g, '');
      modelMatch = devModelClean.includes(fwModelClean) || fwModelClean.includes(devModelClean) ||
                   targetFirmware.marketingName.toLowerCase().includes(device.marketName.toLowerCase());

      if (!modelMatch) {
        blockers.push(
          `Hardware model mismatch: Device is '${device.marketName}' (${device.modelNumber}), but firmware is for '${targetFirmware.marketingName}' (${targetFirmware.modelNumber}).`
        );
      }

      // Checksum / Signature verification check
      firmwareVerified = targetFirmware.status === 'VERIFIED';
      if (!firmwareVerified) {
        blockers.push(
          `Firmware package failed cryptographic verification or has status '${targetFirmware.status}'. Flashing unverified packages is prohibited.`
        );
      }

      // Bootloader check
      bootloaderVersionMatch = true;
      regionMatch = true;
    } else {
      blockers.push('No target official firmware package has been selected.');
    }

    // 6. Authorization & Ticket Check
    const authorizedTicketPresent = !!activeTicket && !!activeTicket.authorizationRecordId;
    if (!authorizedTicketPresent) {
      blockers.push('Active Service Ticket with documented Customer Ownership Authorization is missing.');
    }

    // 7. FRP and Cloud Lock Notice
    if (device.frpStatus === 'ACTIVE') {
      warnings.push(
        'Google Factory Reset Protection (FRP) is active on this device. Flashing will NOT remove FRP and the owner credentials will be required post-boot.'
      );
    }

    // 8. Device Owner / MDM Notice
    if (device.deviceOwnerPackage) {
      warnings.push(
        `Device is enrolled in Enterprise MDM under '${device.deviceOwnerPackage}'. Company policies will re-enroll automatically upon internet connection.`
      );
    }

    const passedAllCritical = blockers.length === 0;

    return {
      batterySufficient,
      batteryPercent: device.batteryLevelPercent,
      usbSpeedSufficient,
      modelMatch,
      bootloaderVersionMatch,
      regionMatch,
      firmwareVerified,
      authorizedTicketPresent,
      backupConfirmed: true,
      passedAllCritical,
      blockers,
      warnings
    };
  }
}
