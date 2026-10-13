import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  HardDrive, 
  Plus, 
  Trash2,
  FileCode
} from 'lucide-react';
import { AppSettingsState, ConfigProfile } from '../types/settings';
import { exportSettingsAsCfg, exportSettingsAsJson } from '../utils/storage';

interface HeaderProps {
  state: AppSettingsState;
  onUpdateState: (newState: AppSettingsState) => void;
  onResetDefaults: () => void;
  storageBytes: number;
  lastSavedText: string;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onUpdateState,
  onResetDefaults,
  storageBytes,
  lastSavedText,
}) => {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) || state.profiles[0];

  const handleProfileChange = (profileId: string) => {
    const selected = state.profiles.find((p) => p.id === profileId);
    if (!selected) return;

    onUpdateState({
      ...state,
      activeProfileId: profileId,
      toggles: { ...selected.toggles },
      sensitivities: { ...selected.sensitivities },
      crosshair: { ...selected.crosshair },
    });
    showNotification(`Switched to profile: ${selected.name}`);
  };

  const handleSaveActiveToProfile = () => {
    const updatedProfiles = state.profiles.map((p) => {
      if (p.id === state.activeProfileId) {
        return {
          ...p,
          updatedAt: new Date().toISOString(),
          toggles: { ...state.toggles },
          sensitivities: { ...state.sensitivities },
          crosshair: { ...state.crosshair },
        };
      }
      return p;
    });

    onUpdateState({
      ...state,
      profiles: updatedProfiles,
    });
    showNotification(`Saved changes to profile "${activeProfile.name}" & localStorage`);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const newId = 'prof-' + Date.now();
    const newProf: ConfigProfile = {
      id: newId,
      name: newProfileName.trim(),
      description: 'Custom configuration preset created by player.',
      updatedAt: new Date().toISOString(),
      toggles: { ...state.toggles },
      sensitivities: { ...state.sensitivities },
      crosshair: { ...state.crosshair },
    };

    onUpdateState({
      ...state,
      profiles: [...state.profiles, newProf],
      activeProfileId: newId,
    });
    setNewProfileName('');
    setIsCreatingProfile(false);
    showNotification(`Created new profile: ${newProf.name}`);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (state.profiles.length <= 1) {
      showNotification('Cannot delete the only remaining profile.');
      return;
    }
    const filtered = state.profiles.filter((p) => p.id !== profileId);
    const newActive = filtered[0].id;
    onUpdateState({
      ...state,
      profiles: filtered,
      activeProfileId: newActive,
      toggles: { ...filtered[0].toggles },
      sensitivities: { ...filtered[0].sensitivities },
      crosshair: { ...filtered[0].crosshair },
    });
    showNotification('Profile deleted and saved.');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.toggles && parsed.sensitivities) {
          onUpdateState({
            ...state,
            toggles: { ...state.toggles, ...parsed.toggles },
            sensitivities: { ...state.sensitivities, ...parsed.sensitivities },
            crosshair: { ...state.crosshair, ...(parsed.crosshair || {}) },
          });
          showNotification('Configuration successfully imported & saved to localStorage!');
        } else {
          showNotification('Invalid config file structure.');
        }
      } catch (err) {
        showNotification('Failed to read config file. Must be valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        {/* Top bar with branding & storage persistence badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Tactical Config &amp; Preferences Studio
                </h1>
                <span className="text-xs font-mono text-zinc-400 hidden sm:inline">v2.4</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  LocalStorage Active
                </span>
                <span aria-hidden="true">·</span>
                <span title="Preferences are automatically saved to your browser local storage">
                  {lastSavedText}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-zinc-500">{(storageBytes / 1024).toFixed(1)} KB stored</span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Profile Dropdown */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
              <span className="text-zinc-500 pl-2 font-medium">Preset:</span>
              <select
                aria-label="Configuration Profile Preset"
                value={state.activeProfileId}
                onChange={(e) => handleProfileChange(e.target.value)}
                className="bg-transparent text-zinc-200 font-semibold focus:outline-none cursor-pointer py-1 pr-2"
              >
                {state.profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsCreatingProfile(true)}
                title="Create new profile preset"
                className="p-1 hover:text-emerald-400 text-zinc-400 hover:bg-zinc-800 rounded transition"
              >
                <Plus className="w-4 h-4" />
              </button>

              {state.profiles.length > 1 && (
                <button
                  onClick={() => handleDeleteProfile(state.activeProfileId)}
                  title="Delete current preset"
                  className="p-1 hover:text-rose-400 text-zinc-400 hover:bg-zinc-800 rounded transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Save current snapshot to active profile button */}
            <button
              onClick={handleSaveActiveToProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow-sm transition"
              title="Save current toggle settings to local profile and localStorage"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>

            {/* Export & Import dropdown / buttons */}
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => exportSettingsAsJson(state)}
                title="Export configuration as JSON file"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded text-xs transition"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => exportSettingsAsCfg(state)}
                title="Export game config format (.cfg file)"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded text-xs transition"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>.CFG</span>
              </button>

              <label
                title="Import configuration JSON file"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded text-xs cursor-pointer transition"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileImport}
                />
              </label>
            </div>

            {/* Reset button */}
            <button
              onClick={onResetDefaults}
              title="Reset all settings to clean defaults"
              className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-800 transition text-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Notification Toast Banner */}
        {statusNotice && (
          <div className="mt-2 py-1.5 px-3 bg-emerald-950/80 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {statusNotice}
            </span>
          </div>
        )}

        {/* Modal for creating a new profile */}
        {isCreatingProfile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-sm w-full shadow-2xl">
              <h3 className="text-sm font-semibold text-white mb-2">Create New Config Preset</h3>
              <p className="text-xs text-zinc-400 mb-4">
                This will save your current active toggles, sensitivities, and crosshair reticle as a new named preset in local storage.
              </p>
              <form onSubmit={handleCreateProfile}>
                <input
                  type="text"
                  placeholder="e.g., Ranked Squad Pro, FGC Tournament"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProfile(false)}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newProfileName.trim()}
                    className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition"
                  >
                    Save Preset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
