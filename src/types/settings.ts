export interface ToggleSettings {
  ultraFps: boolean;
  antiAliasing: boolean;
  vSync: boolean;
  gyroscopeAlwaysOn: boolean;
  quickWeaponSwitch: boolean;
  leftFireButton: boolean;
  autoPickupLoot: boolean;
  damageHitmarkerFX: boolean;
  spatialAudio3D: boolean;
  footstepBoostEQ: boolean;
  vibrationFeedback: boolean;
  lowSpecMode: boolean;
  cameraAcceleration: boolean;
  freeLook360: boolean;
  streamerPrivacyMode: boolean;
  autoReloadOnEmpty: boolean;
}

export interface SensitivitySettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
  deviceDpi: number;
}

export interface CrosshairSettings {
  style: 'cross' | 'dot' | 'circle' | 't-shape' | 'circle-dot';
  color: string;
  size: number;
  gap: number;
  thickness: number;
  centerDot: boolean;
  dynamicRecoilSpread: boolean;
  opacity: number;
}

export interface ConfigProfile {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  toggles: ToggleSettings;
  sensitivities: SensitivitySettings;
  crosshair: CrosshairSettings;
}

export interface AppSettingsState {
  activeProfileId: string;
  profiles: ConfigProfile[];
  toggles: ToggleSettings;
  sensitivities: SensitivitySettings;
  crosshair: CrosshairSettings;
  lastSavedAt: string | null;
  storageAutoSave: boolean;
}
