import { AppSettingsState, ConfigProfile, CrosshairSettings, SensitivitySettings, ToggleSettings } from '../types/settings';

export const DEFAULT_TOGGLES: ToggleSettings = {
  ultraFps: true,
  antiAliasing: true,
  vSync: false,
  gyroscopeAlwaysOn: true,
  quickWeaponSwitch: true,
  leftFireButton: true,
  autoPickupLoot: true,
  damageHitmarkerFX: true,
  spatialAudio3D: true,
  footstepBoostEQ: true,
  vibrationFeedback: true,
  lowSpecMode: false,
  cameraAcceleration: false,
  freeLook360: true,
  streamerPrivacyMode: false,
  autoReloadOnEmpty: false,
};

export const DEFAULT_SENSITIVITIES: SensitivitySettings = {
  general: 95,
  redDot: 88,
  scope2x: 82,
  scope4x: 75,
  sniperScope: 58,
  freeLook: 70,
  deviceDpi: 440,
};

export const DEFAULT_CROSSHAIR: CrosshairSettings = {
  style: 'cross',
  color: '#10b981', // Emerald green
  size: 14,
  gap: 6,
  thickness: 2,
  centerDot: true,
  dynamicRecoilSpread: true,
  opacity: 0.95,
};

export const DEFAULT_PROFILES: ConfigProfile[] = [
  {
    id: 'pro-tournament',
    name: 'Tournament Rush',
    description: 'High responsiveness, 120Hz frame rates, quick weapon swaps and maximum footstep clarity.',
    updatedAt: new Date().toISOString(),
    toggles: { ...DEFAULT_TOGGLES },
    sensitivities: { ...DEFAULT_SENSITIVITIES },
    crosshair: { ...DEFAULT_CROSSHAIR },
  },
  {
    id: 'sniper-precision',
    name: 'Precision Marksman',
    description: 'Stabilized low camera acceleration, tighter crosshair gap, high gyro precision for long range.',
    updatedAt: new Date().toISOString(),
    toggles: {
      ...DEFAULT_TOGGLES,
      cameraAcceleration: false,
      quickWeaponSwitch: true,
      autoPickupLoot: false,
      vibrationFeedback: false,
    },
    sensitivities: {
      general: 78,
      redDot: 72,
      scope2x: 65,
      scope4x: 55,
      sniperScope: 42,
      freeLook: 60,
      deviceDpi: 400,
    },
    crosshair: {
      ...DEFAULT_CROSSHAIR,
      style: 'circle-dot',
      color: '#06b6d4', // Cyan
      size: 10,
      gap: 3,
      thickness: 1.5,
    },
  },
  {
    id: 'battery-saver',
    name: 'Low-Spec & Battery Saver',
    description: 'Optimized for thermal stability, anti-aliasing disabled, low spec particle optimization.',
    updatedAt: new Date().toISOString(),
    toggles: {
      ...DEFAULT_TOGGLES,
      ultraFps: false,
      antiAliasing: false,
      vSync: true,
      lowSpecMode: true,
      damageHitmarkerFX: false,
      spatialAudio3D: false,
      vibrationFeedback: false,
    },
    sensitivities: {
      general: 85,
      redDot: 80,
      scope2x: 75,
      scope4x: 70,
      sniperScope: 50,
      freeLook: 65,
      deviceDpi: 380,
    },
    crosshair: {
      ...DEFAULT_CROSSHAIR,
      style: 'dot',
      color: '#eab308', // Amber
      size: 6,
      gap: 0,
      thickness: 2,
    },
  },
];

export const STORAGE_KEY = 'tactical_gamer_config_preferences_v1';

export function getInitialState(): AppSettingsState {
  if (typeof window === 'undefined') {
    return {
      activeProfileId: 'pro-tournament',
      profiles: DEFAULT_PROFILES,
      toggles: { ...DEFAULT_TOGGLES },
      sensitivities: { ...DEFAULT_SENSITIVITIES },
      crosshair: { ...DEFAULT_CROSSHAIR },
      lastSavedAt: new Date().toISOString(),
      storageAutoSave: true,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: AppSettingsState = {
        activeProfileId: 'pro-tournament',
        profiles: DEFAULT_PROFILES,
        toggles: { ...DEFAULT_TOGGLES },
        sensitivities: { ...DEFAULT_SENSITIVITIES },
        crosshair: { ...DEFAULT_CROSSHAIR },
        lastSavedAt: new Date().toISOString(),
        storageAutoSave: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    return {
      activeProfileId: parsed.activeProfileId || 'pro-tournament',
      profiles: Array.isArray(parsed.profiles) && parsed.profiles.length > 0 ? parsed.profiles : DEFAULT_PROFILES,
      toggles: { ...DEFAULT_TOGGLES, ...(parsed.toggles || {}) },
      sensitivities: { ...DEFAULT_SENSITIVITIES, ...(parsed.sensitivities || {}) },
      crosshair: { ...DEFAULT_CROSSHAIR, ...(parsed.crosshair || {}) },
      lastSavedAt: parsed.lastSavedAt || new Date().toISOString(),
      storageAutoSave: parsed.storageAutoSave !== false,
    };
  } catch (err) {
    console.error('Failed to load settings from local storage, falling back to defaults:', err);
    return {
      activeProfileId: 'pro-tournament',
      profiles: DEFAULT_PROFILES,
      toggles: { ...DEFAULT_TOGGLES },
      sensitivities: { ...DEFAULT_SENSITIVITIES },
      crosshair: { ...DEFAULT_CROSSHAIR },
      lastSavedAt: new Date().toISOString(),
      storageAutoSave: true,
    };
  }
}

export function saveSettingsToStorage(state: AppSettingsState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const payload: AppSettingsState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
    return false;
  }
}

export function clearLocalStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function exportSettingsAsJson(state: AppSettingsState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `tactical_config_${state.activeProfileId}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportSettingsAsCfg(state: AppSettingsState): void {
  const profile = state.profiles.find((p) => p.id === state.activeProfileId) || state.profiles[0];
  const lines = [
    `# ==========================================`,
    `# TACTICAL PRO CONFIG PROFILE: ${profile.name.toUpperCase()}`,
    `# Generated: ${new Date().toISOString()}`,
    `# ==========================================`,
    ``,
    `[GRAPHICS_AND_ENGINE]`,
    `ultra_high_fps=${state.toggles.ultraFps ? '1' : '0'}`,
    `anti_aliasing_fxaa=${state.toggles.antiAliasing ? '1' : '0'}`,
    `vertical_sync=${state.toggles.vSync ? '1' : '0'}`,
    `low_spec_optimization=${state.toggles.lowSpecMode ? '1' : '0'}`,
    ``,
    `[CONTROLS_AND_TRIGGERS]`,
    `gyroscope_continuous=${state.toggles.gyroscopeAlwaysOn ? '1' : '0'}`,
    `quick_weapon_switch=${state.toggles.quickWeaponSwitch ? '1' : '0'}`,
    `dedicated_left_fire=${state.toggles.leftFireButton ? '1' : '0'}`,
    `auto_pickup_priority=${state.toggles.autoPickupLoot ? '1' : '0'}`,
    `auto_reload_empty_mag=${state.toggles.autoReloadOnEmpty ? '1' : '0'}`,
    `free_look_360_peek=${state.toggles.freeLook360 ? '1' : '0'}`,
    `camera_acceleration_curve=${state.toggles.cameraAcceleration ? '1' : '0'}`,
    ``,
    `[AUDIO_AND_HAPTICS]`,
    `binaural_spatial_audio=${state.toggles.spatialAudio3D ? '1' : '0'}`,
    `footstep_eq_boost=${state.toggles.footstepBoostEQ ? '1' : '0'}`,
    `tactile_vibration_fx=${state.toggles.vibrationFeedback ? '1' : '0'}`,
    `damage_hitmarker_indicator=${state.toggles.damageHitmarkerFX ? '1' : '0'}`,
    ``,
    `[SENSITIVITY_SCALING]`,
    `sens_general=${state.sensitivities.general}`,
    `sens_red_dot=${state.sensitivities.redDot}`,
    `sens_2x_scope=${state.sensitivities.scope2x}`,
    `sens_4x_scope=${state.sensitivities.scope4x}`,
    `sens_sniper_scope=${state.sensitivities.sniperScope}`,
    `sens_free_look=${state.sensitivities.freeLook}`,
    `dpi_hardware_reference=${state.sensitivities.deviceDpi}`,
    ``,
    `[RETICLE_CROSSHAIR]`,
    `crosshair_style=${state.crosshair.style}`,
    `crosshair_hex_color=${state.crosshair.color}`,
    `crosshair_size_px=${state.crosshair.size}`,
    `crosshair_gap_px=${state.crosshair.gap}`,
    `crosshair_thickness_px=${state.crosshair.thickness}`,
    `crosshair_center_dot=${state.crosshair.centerDot ? '1' : '0'}`,
    `crosshair_recoil_bloom=${state.crosshair.dynamicRecoilSpread ? '1' : '0'}`,
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_config.cfg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
