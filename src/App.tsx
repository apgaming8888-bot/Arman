import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sliders, 
  Target, 
  Crosshair, 
  Zap, 
  FileCode, 
  CheckCircle,
  HardDrive
} from 'lucide-react';
import { AppSettingsState, CrosshairSettings, SensitivitySettings, ToggleSettings } from './types/settings';
import { 
  getInitialState, 
  saveSettingsToStorage, 
  DEFAULT_TOGGLES, 
  DEFAULT_SENSITIVITIES, 
  DEFAULT_CROSSHAIR, 
  STORAGE_KEY,
  clearLocalStorage 
} from './utils/storage';
import { Header } from './components/Header';
import { TogglesSection } from './components/TogglesSection';
import { SensitivitySection } from './components/SensitivitySection';
import { CrosshairSection } from './components/CrosshairSection';
import { ReflexTargetTrainer } from './components/ReflexTargetTrainer';
import { ConfigInspector } from './components/ConfigInspector';

export default function App() {
  const [state, setState] = useState<AppSettingsState>(() => getInitialState());
  const [activeTab, setActiveTab] = useState<'toggles' | 'sensitivity' | 'crosshair' | 'reflex' | 'inspector'>('toggles');
  const [storageBytes, setStorageBytes] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate storage size in bytes
  const updateStorageMetrics = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setStorageBytes(new Blob([raw]).size);
      } else {
        setStorageBytes(0);
      }
    } catch {
      setStorageBytes(0);
    }
  }, []);

  // Update storage size on mount
  useEffect(() => {
    updateStorageMetrics();
  }, [updateStorageMetrics]);

  // Persist to local storage whenever state changes
  const persistState = useCallback((newState: AppSettingsState, message?: string) => {
    setState(newState);
    saveSettingsToStorage(newState);
    updateStorageMetrics();

    if (message) {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 2500);
    }
  }, [updateStorageMetrics]);

  // Toggle single feature switch
  const handleToggleChange = (key: keyof ToggleSettings, value: boolean) => {
    const updatedToggles = {
      ...state.toggles,
      [key]: value,
    };
    persistState(
      {
        ...state,
        toggles: updatedToggles,
      },
      `Saved toggle "${key}" (${value ? 'ENABLED' : 'DISABLED'}) to local storage`
    );
  };

  // Batch update toggles (preset apply)
  const handleBatchToggles = (updated: Partial<ToggleSettings>) => {
    const newToggles = {
      ...state.toggles,
      ...updated,
    };
    persistState(
      {
        ...state,
        toggles: newToggles,
      },
      'Batch toggle settings saved to local storage'
    );
  };

  // Sensitivity slider change
  const handleSensitivityChange = (key: keyof SensitivitySettings, value: number) => {
    const updated = {
      ...state.sensitivities,
      [key]: value,
    };
    persistState(
      {
        ...state,
        sensitivities: updated,
      }
    );
  };

  const handleApplySensPreset = (preset: SensitivitySettings) => {
    persistState(
      {
        ...state,
        sensitivities: { ...preset },
      },
      'Sensitivity preset loaded & saved to local storage'
    );
  };

  // Crosshair change
  const handleCrosshairChange = (updated: Partial<CrosshairSettings>) => {
    const newCrosshair = {
      ...state.crosshair,
      ...updated,
    };
    persistState(
      {
        ...state,
        crosshair: newCrosshair,
      }
    );
  };

  // Reset to factory defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all toggles, sensitivities, and crosshair reticle to factory defaults?')) {
      const resetState: AppSettingsState = {
        ...state,
        toggles: { ...DEFAULT_TOGGLES },
        sensitivities: { ...DEFAULT_SENSITIVITIES },
        crosshair: { ...DEFAULT_CROSSHAIR },
      };
      persistState(resetState, 'Restored factory defaults & synced to local storage');
    }
  };

  // Clear local storage
  const handleClearStorage = () => {
    if (window.confirm('Wipe local storage? All custom presets and preferences will be cleared.')) {
      clearLocalStorage();
      const fresh = getInitialState();
      setState(fresh);
      updateStorageMetrics();
      setToastMessage('Local storage wiped and reset.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const lastSavedText = state.lastSavedAt
    ? `Saved ${new Date(state.lastSavedAt).toLocaleTimeString()}`
    : 'Local persistence active';

  return (
    <div className="min-h-screen bg-[#090d16] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Sticky App Header */}
      <Header
        state={state}
        onUpdateState={(s) => persistState(s, 'Profile preset updated')}
        onResetDefaults={handleResetDefaults}
        storageBytes={storageBytes}
        lastSavedText={lastSavedText}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6 gap-2 overflow-x-auto">
          <nav className="flex items-center gap-1.5" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('toggles')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'toggles'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Feature Toggles</span>
            </button>

            <button
              onClick={() => setActiveTab('sensitivity')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'sensitivity'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Sensitivity &amp; DPI</span>
            </button>

            <button
              onClick={() => setActiveTab('crosshair')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'crosshair'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Reticle &amp; Crosshair</span>
            </button>

            <button
              onClick={() => setActiveTab('reflex')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'reflex'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Reflex Range Test</span>
            </button>

            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'inspector'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/80 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Config &amp; Storage</span>
            </button>
          </nav>

          {/* Quick status pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-xl">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
            <span>Persistence: <strong>localStorage</strong></span>
          </div>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'toggles' && (
          <TogglesSection
            toggles={state.toggles}
            onChangeToggle={handleToggleChange}
            onApplyBatch={handleBatchToggles}
          />
        )}

        {activeTab === 'sensitivity' && (
          <SensitivitySection
            sensitivities={state.sensitivities}
            onChangeSensitivity={handleSensitivityChange}
            onApplySensPreset={handleApplySensPreset}
          />
        )}

        {activeTab === 'crosshair' && (
          <CrosshairSection
            crosshair={state.crosshair}
            onChangeCrosshair={handleCrosshairChange}
            damageHitmarkerFX={state.toggles.damageHitmarkerFX}
          />
        )}

        {activeTab === 'reflex' && (
          <ReflexTargetTrainer
            crosshair={state.crosshair}
            toggles={state.toggles}
          />
        )}

        {activeTab === 'inspector' && (
          <ConfigInspector
            state={state}
            storageBytes={storageBytes}
            onClearStorage={handleClearStorage}
          />
        )}
      </main>

      {/* Floating Save Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 mt-8 bg-zinc-950/40 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Tactical Settings &amp; Configuration Studio · Client-side storage with zero external dependencies.
          </p>
          <div className="flex items-center gap-3">
            <span>Storage Key: <code className="text-zinc-400 font-mono text-[11px]">{STORAGE_KEY}</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
