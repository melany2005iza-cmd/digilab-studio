/**
 * AdaLab Studio - Top Navigation Bar with Rich Dropdown Menus
 * 
 * Estética Pastel Femenina (Rosa Algodón, Lavanda Pastel, Durazno y Menta Suave)
 * Cumple con el Top Bar Contract de 3 zonas y añade menús desplegables completos:
 * - Archivo (Nuevo, Guardar JSON, Cargar JSON, Exportar HTML)
 * - Editar (Duplicar, Eliminar, Deseleccionar, Limpiar)
 * - Herramientas (Selección, Cableado, Pan, Zoom +, Zoom -, Zoom 100%)
 * - Simulación (Play/Pausa, Paso a paso, Velocidad de reloj, Reset switches)
 * - Circuitos MSI (Sumador 4b, BCD 7-Seg, Dec 4:16, Comparador, Codificador, MUX)
 * - Buscador rápido de componentes con autocompletado y colocación en 1 clic
 * - Ayuda (Guía interactiva, Atajos, Acerca de)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  FileCode,
  FilePlus,
  Trash2,
  Copy,
  MousePointer,
  Zap,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
  Search,
  Layers,
  Power,
  X,
  Keyboard,
} from 'lucide-react';
import { ActiveTool } from '../types';
import { CATEGORIES } from './ComponentLibrary';

interface TopBarProps {
  isSimulating: boolean;
  onToggleSim: () => void;
  onStepSim: () => void;
  clockSpeed?: number;
  onChangeClockSpeed?: (speed: number) => void;
  onClearCanvas: () => void;
  onSaveProjectJson: () => void;
  onLoadProjectJson: (file: File) => void;
  onDuplicateSelected?: () => void;
  onDeleteSelected?: () => void;
  activeTool?: ActiveTool;
  onSelectTool?: (tool: ActiveTool) => void;
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onResetSwitches?: () => void;
  onLoadFamilyPreset: (familyId: string) => void;
  onExportStandaloneHtml: () => void;
  onAddComponent?: (type: string, label: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isSimulating,
  onToggleSim,
  onStepSim,
  clockSpeed = 1,
  onChangeClockSpeed,
  onClearCanvas,
  onSaveProjectJson,
  onLoadProjectJson,
  onDuplicateSelected,
  onDeleteSelected,
  activeTool = 'select',
  onSelectTool,
  zoom = 1,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onResetSwitches,
  onLoadFamilyPreset,
  onExportStandaloneHtml,
  onAddComponent,
  isDarkMode,
  onToggleTheme,
  onOpenGuide,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
    setIsSearchOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadProjectJson(file);
    }
    e.target.value = '';
    setActiveDropdown(null);
  };

  // Filtrado de componentes para el buscador rápido del TopBar
  const allComponents = React.useMemo(() => {
    return CATEGORIES.flatMap((c) => c.items);
  }, []);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return allComponents.slice(0, 10);
    const q = searchQuery.toLowerCase().trim();
    return allComponents
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          (item.code && item.code.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [searchQuery, allComponents]);

  return (
    <header className="h-14 bg-[#fff2f8]/95 dark:bg-[#312342]/95 border-b-2 border-[#f9a8d4]/60 dark:border-pink-400/30 px-4 lg:px-6 flex items-center justify-between gap-4 select-none z-40 shrink-0 backdrop-blur-md shadow-sm shadow-pink-100/70 relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* ── ZONA 1: BRAND WORDMARK ──────────────────────────── */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-[#59324c] dark:text-pink-100 flex items-center gap-2.5 whitespace-nowrap group">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#f472b6] via-[#f9a8d4] to-[#c084fc] flex items-center justify-center text-white font-black text-xs shadow-md shadow-pink-300/60 group-hover:scale-105 transition-transform border border-white/60">
            A
          </div>
          <span className="font-bold text-[#59324c] dark:text-pink-50">
            AdaLab <span className="font-medium text-[#db2777] dark:text-pink-300 text-xs bg-[#fce7f3] dark:bg-pink-900/50 px-2 py-0.5 rounded-full border border-[#f9a8d4]/60">Pastel Studio</span>
          </span>
        </a>
      </div>

      {/* ── ZONA 2: MENÚS DESPLEGABLES (DROPDOWNS) Y BUSCADOR ─── */}
      <nav ref={dropdownRef} className="flex items-center gap-1 sm:gap-2 text-xs font-semibold text-[#6e4160] dark:text-pink-200">
        {/* ── 1. MENÚ ARCHIVO ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('archivo')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeDropdown === 'archivo'
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] dark:text-pink-100 border border-[#f9a8d4]'
                : 'hover:bg-[#fce7f3]/70 dark:hover:bg-purple-900/40 hover:text-[#be185d] text-[#6e4160] dark:text-pink-200'
            }`}
          >
            <span>Archivo</span>
            <ChevronDown className="w-3 h-3 text-[#d977a6]" />
          </button>

          {activeDropdown === 'archivo' && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl shadow-xl shadow-pink-200/70 p-1.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  onClearCanvas();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FilePlus className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>Nuevo Circuito</span>
                </div>
                <span className="text-[10px] font-mono text-[#a37092]">Limpiar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSaveProjectJson();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>Guardar Proyecto</span>
                </div>
                <span className="text-[10px] font-mono text-[#a37092]">.JSON</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Cargar Proyecto</span>
                </div>
                <span className="text-[10px] font-mono text-[#a37092]">.JSON</span>
              </button>

              <div className="my-1 border-t border-[#f9a8d4]/40" />

              <button
                type="button"
                onClick={() => {
                  onExportStandaloneHtml();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#fdf2f8] hover:bg-[#fce7f3] text-[#be185d] dark:bg-pink-500/20 dark:text-pink-200 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span className="font-bold">Descargar HTML</span>
                </div>
                <span className="text-[10px] font-mono text-[#db2777]">Pastel</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 2. MENÚ EDITAR ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('editar')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeDropdown === 'editar'
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] dark:text-pink-100 border border-[#f9a8d4]'
                : 'hover:bg-[#fce7f3]/70 dark:hover:bg-purple-900/40 hover:text-[#be185d] text-[#6e4160] dark:text-pink-200'
            }`}
          >
            <span>Editar</span>
            <ChevronDown className="w-3 h-3 text-[#d977a6]" />
          </button>

          {activeDropdown === 'editar' && (
            <div className="absolute left-0 top-full mt-1.5 w-52 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl shadow-xl shadow-pink-200/70 p-1.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              {onDuplicateSelected && (
                <button
                  type="button"
                  onClick={() => {
                    onDuplicateSelected();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-[#a855f7]" />
                    <span>Duplicar Elemento</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#a37092]">Ctrl+D</span>
                </button>
              )}

              {onDeleteSelected && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteSelected();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5 text-[#ec4899]" />
                    <span>Eliminar Selección</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#a37092]">Supr</span>
                </button>
              )}

              <div className="my-1 border-t border-[#f9a8d4]/40" />

              <button
                type="button"
                onClick={() => {
                  onClearCanvas();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#ffe4e6] text-[#be185d] dark:text-rose-300 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-[#f43f5e]" />
                  <span>Limpiar Pizarra</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* ── 3. MENÚ HERRAMIENTAS ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('herramientas')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeDropdown === 'herramientas'
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] dark:text-pink-100 border border-[#f9a8d4]'
                : 'hover:bg-[#fce7f3]/70 dark:hover:bg-purple-900/40 hover:text-[#be185d] text-[#6e4160] dark:text-pink-200'
            }`}
          >
            <span>Herramientas</span>
            <ChevronDown className="w-3 h-3 text-[#d977a6]" />
          </button>

          {activeDropdown === 'herramientas' && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl shadow-xl shadow-pink-200/70 p-1.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              {onSelectTool && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTool('select');
                      setActiveDropdown(null);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      activeTool === 'select' ? 'bg-[#fce7f3] text-[#be185d] font-bold' : 'hover:bg-[#fce7f3]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-3.5 h-3.5 text-[#ec4899]" />
                      <span>Seleccionar / Mover</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a37092]">V</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTool('wire');
                      setActiveDropdown(null);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      activeTool === 'wire' ? 'bg-[#fce7f3] text-[#be185d] font-bold' : 'hover:bg-[#fce7f3]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#ec4899]" />
                      <span>Cablear a 90°</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a37092]">W</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTool('pan');
                      setActiveDropdown(null);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      activeTool === 'pan' ? 'bg-[#fce7f3] text-[#be185d] font-bold' : 'hover:bg-[#fce7f3]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hand className="w-3.5 h-3.5 text-[#a855f7]" />
                      <span>Mover Lienzo (Pan)</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a37092]">H</span>
                  </button>

                  <div className="my-1 border-t border-[#f9a8d4]/40" />
                </>
              )}

              {onZoomIn && (
                <button
                  type="button"
                  onClick={() => {
                    onZoomIn();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ZoomIn className="w-3.5 h-3.5 text-[#a855f7]" />
                    <span>Acercar Zoom</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#a37092]">+</span>
                </button>
              )}

              {onZoomOut && (
                <button
                  type="button"
                  onClick={() => {
                    onZoomOut();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ZoomOut className="w-3.5 h-3.5 text-[#a855f7]" />
                    <span>Alejar Zoom</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#a37092]">-</span>
                </button>
              )}

              {onZoomReset && (
                <button
                  type="button"
                  onClick={() => {
                    onZoomReset();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-[#ec4899]" />
                    <span>Restablecer 100%</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#a37092]">{Math.round(zoom * 100)}%</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── 4. MENÚ SIMULACIÓN ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('simulacion')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeDropdown === 'simulacion'
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] dark:text-pink-100 border border-[#f9a8d4]'
                : 'hover:bg-[#fce7f3]/70 dark:hover:bg-purple-900/40 hover:text-[#be185d] text-[#6e4160] dark:text-pink-200'
            }`}
          >
            <span>Simulación</span>
            <ChevronDown className="w-3 h-3 text-[#d977a6]" />
          </button>

          {activeDropdown === 'simulacion' && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl shadow-xl shadow-pink-200/70 p-1.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  onToggleSim();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isSimulating ? <Pause className="w-3.5 h-3.5 text-[#f59e0b]" /> : <Play className="w-3.5 h-3.5 text-[#ec4899]" />}
                  <span>{isSimulating ? 'Pausar Simulación' : 'Iniciar Simulación'}</span>
                </div>
                <span className="text-[10px] font-mono text-[#a37092]">Espacio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStepSim();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Avanzar 1 Ciclo de Reloj</span>
                </div>
                <span className="text-[10px] font-mono text-[#a37092]">Paso</span>
              </button>

              <div className="my-1 border-t border-[#f9a8d4]/40" />

              {/* Frecuencia de reloj */}
              {onChangeClockSpeed && (
                <div className="px-2.5 py-1">
                  <span className="text-[10px] font-mono text-[#9d6589] uppercase block mb-1">Velocidad Reloj:</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 5].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => {
                          onChangeClockSpeed(spd);
                          setActiveDropdown(null);
                        }}
                        className={`py-1 rounded-lg text-center font-mono text-[11px] transition-colors ${
                          clockSpeed === spd
                            ? 'bg-gradient-to-r from-[#f472b6] to-[#c084fc] text-white font-bold shadow-sm'
                            : 'bg-[#fce7f3]/70 hover:bg-[#fbcfe8] text-[#6e4160]'
                        }`}
                      >
                        {spd} Hz
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {onResetSwitches && (
                <button
                  type="button"
                  onClick={() => {
                    onResetSwitches();
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center gap-2 text-left transition-colors mt-1"
                >
                  <Power className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>Reiniciar Interruptores a 0</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── 5. MENÚ CIRCUITOS MSI JERÁRQUICOS ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('msi')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeDropdown === 'msi'
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] dark:text-pink-100 border border-[#f9a8d4]'
                : 'hover:bg-[#fce7f3]/70 dark:hover:bg-purple-900/40 hover:text-[#be185d] text-[#6e4160] dark:text-pink-200'
            }`}
          >
            <span>Circuitos MSI</span>
            <ChevronDown className="w-3 h-3 text-[#d977a6]" />
          </button>

          {activeDropdown === 'msi' && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl shadow-xl shadow-pink-200/70 p-1.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              <span className="text-[10px] font-mono text-[#be185d] dark:text-pink-300 px-2 py-0.5 block uppercase font-bold">
                Presets Jerárquicos con Drill-Down:
              </span>

              <button
                type="button"
                onClick={() => {
                  onLoadFamilyPreset('adder_4bit');
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>Sumador 4 Bits (74LS283)</span>
                </div>
                <span className="text-[10px] font-mono text-[#db2777] bg-[#fce7f3] px-1.5 rounded-full">N1-N4</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadFamilyPreset('bcd_7seg');
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>BCD a 7-Seg (74LS47)</span>
                </div>
                <span className="text-[10px] font-mono text-[#db2777] bg-[#fce7f3] px-1.5 rounded-full">N1-N2</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadFamilyPreset('dec_4_16');
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Decodificador 4:16 (74LS154)</span>
                </div>
                <span className="text-[10px] font-mono text-[#7e22ce] bg-[#f3e8ff] px-1.5 rounded-full">N1-N3</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadFamilyPreset('comp_4bit');
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>Comparador 4 Bits (74LS85)</span>
                </div>
                <span className="text-[10px] font-mono text-[#db2777] bg-[#fce7f3] px-1.5 rounded-full">N1-N2</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadFamilyPreset('enc_8_3');
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Codificador 8:3 (74LS148)</span>
                </div>
                <span className="text-[10px] font-mono text-[#7e22ce] bg-[#f3e8ff] px-1.5 rounded-full">N1-N2</span>
              </button>

               <button
                type="button"
                onClick={() => {
                  onLoadFamilyPreset('mux_4_1');
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#ec4899]" />
                  <span>Multiplexor 4 a 1</span>
                </div>
                <span className="text-[10px] font-mono text-[#db2777] bg-[#fce7f3] px-1.5 rounded-full">N1-N2</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 5B. MENÚ EJERCICIOS DEMOS CON COMPUERTAS ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('demos')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all font-bold ${
              activeDropdown === 'demos'
                ? 'bg-gradient-to-r from-[#f472b6] to-[#c084fc] text-white shadow-sm'
                : 'bg-[#fdf2f8] hover:bg-[#fce7f3] text-[#be185d] border border-[#f9a8d4] dark:bg-pink-500/20 dark:text-pink-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#ec4899]" />
            <span>Demos Compuertas</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {activeDropdown === 'demos' && (
            <div className="absolute left-0 top-full mt-1.5 w-76 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl shadow-xl shadow-pink-200/70 p-2 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn space-y-1">
              <span className="text-[10px] font-mono text-[#be185d] dark:text-pink-300 px-2 py-0.5 block uppercase font-bold">
                7 Ejercicios con Compuertas IEEE:
              </span>

              {[
                { id: 'demo_full_adder', title: '1. Sumador Completo (Full Adder)', eq: 'S = A⊕B⊕Cin' },
                { id: 'demo_subtractor', title: '2. Medio Restador Binario', eq: 'D = A⊕B, Bout = ~A·B' },
                { id: 'demo_majority', title: '3. Votador de Mayoría (3 Sensores)', eq: 'Y = AB + BC + AC' },
                { id: 'demo_comp_1bit', title: '4. Comparador de 1 Bit', eq: 'A>B, A=B, A<B' },
                { id: 'demo_parity', title: '5. Detector de Paridad (4 Bits)', eq: 'Árbol XOR + NOT' },
                { id: 'demo_demorgan', title: '6. Teorema de De Morgan', eq: '~(A·B) ≡ ~A + ~B' },
                { id: 'demo_alarm', title: '7. Alarma de Seguridad Lógica', eq: 'A · (P + V)' },
              ].map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => {
                    onLoadFamilyPreset(demo.id);
                    setActiveDropdown(null);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 flex items-center justify-between text-left transition-colors gap-2"
                >
                  <span className="font-semibold text-[#59324c] dark:text-pink-100 truncate">
                    {demo.title}
                  </span>
                  <span className="text-[9px] font-mono text-[#be185d] bg-[#fce7f3] dark:bg-pink-950 px-1.5 py-0.5 rounded-md border border-[#f9a8d4] shrink-0">
                    {demo.eq}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── 6. BUSCADOR RÁPIDO DE COMPONENTES ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              setActiveDropdown(null);
            }}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              isSearchOpen
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] border border-[#f9a8d4]'
                : 'bg-[#fdf2f8] hover:bg-[#fce7f3] text-[#8a5076] border border-[#f9a8d4]/50 dark:bg-purple-900/40 dark:text-pink-200'
            }`}
            title="Buscar y agregar componentes directamente al lienzo"
          >
            <Search className="w-3.5 h-3.5 text-[#ec4899]" />
            <span className="hidden sm:inline">Buscar...</span>
          </button>

          {isSearchOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] rounded-2xl shadow-xl shadow-pink-200/70 p-2.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#d977a6]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar VCC, GND, 74LS283, AND..."
                  className="w-full bg-white dark:bg-purple-950/60 border border-[#f9a8d4] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[#59324c] dark:text-pink-100 placeholder-[#b886a6] focus:outline-none focus:border-[#ec4899] font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#b886a6] hover:text-[#be185d]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-56 overflow-y-auto space-y-1 pr-1">
                {searchResults.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      if (onAddComponent) {
                        onAddComponent(item.type, item.label);
                      }
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-1.5 rounded-xl hover:bg-[#fce7f3] dark:hover:bg-purple-900/50 text-left flex items-center justify-between transition-colors group"
                  >
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-xs font-semibold text-[#59324c] dark:text-pink-100 group-hover:text-[#be185d] truncate">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#9d6b8c] dark:text-pink-300/60 truncate">
                        {item.description}
                      </span>
                    </div>
                    {item.code && (
                      <span className="text-[9px] font-mono text-[#be185d] shrink-0 bg-[#fce7f3] dark:bg-purple-950 px-1.5 py-0.5 rounded-md border border-[#f9a8d4]">
                        {item.code}
                      </span>
                    )}
                  </button>
                ))}

                {searchResults.length === 0 && (
                  <div className="text-center py-4 text-xs text-[#b886a6]">
                    No se encontró "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 7. MENÚ AYUDA ── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('ayuda')}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
              activeDropdown === 'ayuda'
                ? 'bg-[#fce7f3] dark:bg-pink-500/25 text-[#be185d] dark:text-pink-100 border border-[#f9a8d4]'
                : 'hover:bg-[#fce7f3]/70 dark:hover:bg-purple-900/40 hover:text-[#be185d] text-[#6e4160] dark:text-pink-200'
            }`}
          >
            <span>Ayuda</span>
            <ChevronDown className="w-3 h-3 text-[#d977a6]" />
          </button>

          {activeDropdown === 'ayuda' && (
            <div className="absolute left-0 top-full mt-1.5 w-56 bg-[#fff7fb] dark:bg-[#352647] border-2 border-[#f9a8d4] rounded-2xl shadow-xl shadow-pink-200/70 p-1.5 z-50 text-xs text-[#59324c] dark:text-pink-100 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  onOpenGuide();
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#fdf2f8] hover:bg-[#fce7f3] text-[#be185d] font-bold flex items-center gap-2 text-left transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#ec4899]" />
                <span>Guía Interactiva</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(
                    "ATAJOS DE TECLADO EN ADALAB STUDIO:\n\n" +
                    "· V: Herramienta Selección y Arrastre\n" +
                    "· W: Herramienta Cableado Ortogonal (90°)\n" +
                    "· H: Herramienta Mover Lienzo (Pan)\n" +
                    "· Supr / Backspace: Eliminar componente o cable\n" +
                    "· Doble Clic en CI: Entrar al interior (Drill-Down)\n" +
                    "· Rueda del Ratón: Zoom In / Zoom Out\n" +
                    "· Rueda Pulsada (Botón 2): Mover Lienzo"
                  );
                  setActiveDropdown(null);
                }}
                className="w-full px-2.5 py-1.5 rounded-xl hover:bg-[#fce7f3] flex items-center justify-between text-left transition-colors mt-1"
              >
                <div className="flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-[#a855f7]" />
                  <span>Atajos de Teclado</span>
                </div>
                <span className="text-[10px] font-mono text-[#a37092]">Teclas</span>
              </button>

              <div className="my-1 border-t border-[#f9a8d4]/40" />

              <div className="px-2.5 py-1 text-[10px] text-[#a37092] font-mono">
                AdaLab Studio · Pastel Edition
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── ZONA 3: ACCIONES PRINCIPALES Y SIMULACIÓN ──────── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Botón Simulación Play/Pausa */}
        <button
          type="button"
          onClick={onToggleSim}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
            isSimulating
              ? 'bg-gradient-to-r from-[#f472b6] via-[#fb7185] to-[#c084fc] hover:from-[#ec4899] hover:to-[#a855f7] text-white shadow-pink-300/60'
              : 'bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#be185d] border border-[#f9a8d4]'
          }`}
          title={isSimulating ? 'Pausar simulación lógica (Espacio)' : 'Iniciar simulación lógica continua (Espacio)'}
        >
          {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isSimulating ? 'Simulando' : 'Simular'}</span>
        </button>

        {/* Paso a paso */}
        <button
          type="button"
          onClick={onStepSim}
          className="p-1.5 rounded-xl bg-[#fdf2f8] hover:bg-[#fce7f3] dark:bg-purple-900/40 text-[#be185d] dark:text-pink-200 border border-[#f9a8d4] transition-colors"
          title="Avanzar 1 ciclo de reloj / paso lógico"
          aria-label="Paso a paso"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Modo Pastel Claro / Pastel Nocturno */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-1.5 rounded-xl bg-[#fdf2f8] hover:bg-[#fce7f3] dark:bg-purple-900/40 text-[#be185d] dark:text-pink-200 border border-[#f9a8d4] transition-colors"
          title={isDarkMode ? 'Cambiar a modo Pastel Algodón (Claro)' : 'Cambiar a modo Pastel Lavanda (Nocturno)'}
          aria-label="Alternar tema"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#a855f7]" />}
        </button>

        {/* Botón "¿Cómo Usar?" destacado */}
        <button
          type="button"
          onClick={onOpenGuide}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#fce7f3] to-[#f3e8ff] hover:from-[#fbcfe8] hover:to-[#e9d5ff] text-[#be185d] border border-[#f9a8d4] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-pink-200/50 active:scale-95 whitespace-nowrap"
          title="Abrir guía interactiva paso a paso"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#ec4899]" />
          <span className="hidden sm:inline">¿Cómo Usar?</span>
        </button>
      </div>
    </header>
  );
};
