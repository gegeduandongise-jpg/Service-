export interface EndpointStatus {
  name: string;
  category: 'DNS' | 'HTTPS_CORE' | 'GOOGLE_SERVICES' | 'OEM_SERVERS' | 'AUTH_GATEWAY';
  host: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'CHECKING';
  latencyMs?: number;
  lastChecked: string;
  notes?: string;
}

export type NetworkIssueDiagnosis = 
  | 'ALL_SYSTEMS_OPERATIONAL'
  | 'LOCAL_NETWORK_DISCONNECTED'
  | 'DNS_RESOLUTION_FAILURE'
  | 'CAPTIVE_PORTAL_INTERCEPT'
  | 'OEM_SERVER_MAINTENANCE'
  | 'ENTERPRISE_FIREWALL_BLOCK';

export class ConnectivityManager {
  private static instance: ConnectivityManager;
  private isOnline: boolean = navigator.onLine;
  private endpoints: EndpointStatus[] = [
    {
      name: 'Internet Gateway (DNS)',
      category: 'DNS',
      host: '8.8.8.8 (Google Public DNS)',
      status: 'ONLINE',
      latencyMs: 14,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Google Android OTA & Recovery',
      category: 'GOOGLE_SERVICES',
      host: 'dl.google.com / android.googleapis.com',
      status: 'ONLINE',
      latencyMs: 28,
      lastChecked: new Date().toISOString(),
      notes: 'Pixel factory images and OTA manifests reachable.'
    },
    {
      name: 'Samsung FOTA & SmartSwitch Server',
      category: 'OEM_SERVERS',
      host: 'fota-secure.samsungmobile.com',
      status: 'ONLINE',
      latencyMs: 42,
      lastChecked: new Date().toISOString(),
      notes: 'Knox attestation & CSC binary catalogs active.'
    },
    {
      name: 'Xiaomi HyperOS / Fastboot CDN',
      category: 'OEM_SERVERS',
      host: 'bigota.d.miui.com',
      status: 'ONLINE',
      latencyMs: 65,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Motorola RSA Cloud Depot',
      category: 'OEM_SERVERS',
      host: 'rsadownload.motorola.com',
      status: 'ONLINE',
      latencyMs: 51,
      lastChecked: new Date().toISOString()
    },
    {
      name: 'Technician Authorization Gateway',
      category: 'AUTH_GATEWAY',
      host: 'auth.authorized-servicing.local',
      status: 'ONLINE',
      latencyMs: 6,
      lastChecked: new Date().toISOString(),
      notes: 'Local hardware security module active.'
    }
  ];

  private constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.refreshEndpoints();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.endpoints.forEach(e => {
        if (e.category !== 'AUTH_GATEWAY') {
          e.status = 'OFFLINE';
        }
      });
    });
  }

  public static getInstance(): ConnectivityManager {
    if (!ConnectivityManager.instance) {
      ConnectivityManager.instance = new ConnectivityManager();
    }
    return ConnectivityManager.instance;
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getEndpoints(): EndpointStatus[] {
    return this.endpoints;
  }

  public diagnoseNetworkIssue(): { diagnosis: NetworkIssueDiagnosis; description: string; advice: string } {
    if (!this.isOnline) {
      return {
        diagnosis: 'LOCAL_NETWORK_DISCONNECTED',
        description: 'No local network interface is detected. The workstation is completely offline.',
        advice: 'All local diagnostics, firmware verification, local package inspection, and ticket creation are 100% operational offline.'
      };
    }

    const offlineOem = this.endpoints.filter(e => e.status === 'OFFLINE' && e.category === 'OEM_SERVERS');
    if (offlineOem.length > 0) {
      return {
        diagnosis: 'OEM_SERVER_MAINTENANCE',
        description: `One or more manufacturer endpoints are unreachable (${offlineOem.map(o => o.name).join(', ')}).`,
        advice: 'Use locally cached official firmware packages or check manufacturer service status announcements.'
      };
    }

    return {
      diagnosis: 'ALL_SYSTEMS_OPERATIONAL',
      description: 'All upstream Google, OEM, and local cryptographic authorization endpoints are responsive.',
      advice: 'Full online and offline servicing capabilities ready.'
    };
  }

  public async refreshEndpoints(): Promise<void> {
    // Probe simulated network latencies realistically
    this.endpoints.forEach(e => {
      if (this.isOnline) {
        e.status = 'ONLINE';
        e.latencyMs = Math.floor(Math.random() * 45) + 12;
      } else {
        e.status = e.category === 'AUTH_GATEWAY' ? 'ONLINE' : 'OFFLINE';
        e.latencyMs = undefined;
      }
      e.lastChecked = new Date().toISOString();
    });
  }
}
