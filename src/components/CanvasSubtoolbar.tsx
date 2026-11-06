/**
 * AdaLab Studio - Canvas Sub-toolbar Component (Pastel Blossom Edition)
 * 
 * Barra flotante en la esquina superior izquierda del lienzo (.canvas-subtoolbar).
 * Rediseño pastel femenino con tonos rosa algodón, lavanda suave y cuarzo.
 * Incluye controles de navegación compactos en una sola línea:
 * [Volver] [< Mayor] [N1] → [N2] → [N3] → [N4] [Menor >]
 */

import React from 'react';
import { ActiveTool, CircuitNode } from '../types';
import { HIERARCHY_FAMILIES, NODE_TO_HIERARCHY_MAP } from '../constants/hierarchyData';
import {
  MousePointer2,
  GitCommitHorizontal,
  Hand,
  ZoomIn,
  ZoomOut,
  Layers,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
} from 'lucide-react';

interface CanvasSubtoolbarProps {
  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  selectedNode: CircuitNode | null;
  onDrillDown: (node: CircuitNode) => void;
  onDuplicate: () => void;
  onDeleteSelected: () => void;
  // Jerarquía
  activeFamilyId: string | null;
  currentLevel: number;
  hasSnapshot: boolean;
  onReturnToOrigin: () => void;
  onGoToLevel: (levelNum: number) => void;
  onGoHigherLevel: () => void;
  onGoDeeperLevel: () => void;
}

export const CanvasSubtoolbar: React.FC<CanvasSubtoolbarProps> = ({
  activeTool,
  setActiveTool,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  selectedNode,
  onDrillDown,
  onDuplicate,
  onDeleteSelected,
  activeFamilyId,
  currentLevel,
  hasSnapshot,
  onReturnToOrigin,
  onGoToLevel,
  onGoHigherLevel,
  onGoDeeperLevel,
}) => {
  const hierarchyMapping = selectedNode ? NODE_TO_HIERARCHY_MAP[selectedNode.type] : null;
  const canDrillDown = !!hierarchyMapping;

  const activeFamily = activeFamilyId ? HIERARCHY_FAMILIES[activeFamilyId] : null;
  const levels = activeFamily ? activeFamily.levels : [];
  const minLevel = levels.length > 0 ? levels[0].level : 1;
  const maxLevel = levels.length > 0 ? levels[levels.length - 1].level : 1;

  const isMinLevel = currentLevel <= minLevel;
  const isMaxLevel = currentLevel >= maxLevel;

  return (
    <div className="canvas-subtoolbar absolute top-4 left-4 z-30 flex items-center gap-2 max-w-[calc(100vw-360px)] flex-wrap">
      {/* ── BARRA PRINCIPAL DE HERRAMIENTAS Y ZOOM ──────────── */}
      <div className="flex items-center bg-[#fff5fa]/95 dark:bg-[#352647]/95 backdrop-blur-md border-2 border-[#f9a8d4] dark:border-pink-400/40 shadow-lg shadow-pink-200/60 rounded-2xl p-1 gap-1 text-[#59324c] dark:text-pink-100">
        {/* Herramientas de puntero */}
        <button
          type="button"
          onClick={() => setActiveTool('select')}
          className={`p-2 rounded-xl transition-colors flex items-center justify-center text-xs font-medium ${
            activeTool === 'select'
              ? 'bg-[#fce7f3] text-[#be185d] border border-[#f472b6] shadow-2xs'
              : 'hover:bg-[#fdf2f8] text-[#8a5a7a] hover:text-[#be185d] dark:text-pink-300/70'
          }`}
          title="Herramienta Selección (V)"
          aria-label="Seleccionar componentes"
        >
          <MousePointer2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('wire')}
          className={`p-2 rounded-xl transition-colors flex items-center justify-center text-xs font-medium ${
            activeTool === 'wire'
              ? 'bg-[#fce7f3] text-[#be185d] border border-[#f472b6] shadow-2xs'
              : 'hover:bg-[#fdf2f8] text-[#8a5a7a] hover:text-[#be185d] dark:text-pink-300/70'
          }`}
          title="Herramienta Cablear / Conectar Ortogonal (W)"
          aria-label="Cablear componentes"
        >
          <GitCommitHorizontal className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('pan')}
          className={`p-2 rounded-xl transition-colors flex items-center justify-center text-xs font-medium ${
            activeTool === 'pan'
              ? 'bg-[#fce7f3] text-[#be185d] border border-[#f472b6] shadow-2xs'
              : 'hover:bg-[#fdf2f8] text-[#8a5a7a] hover:text-[#be185d] dark:text-pink-300/70'
          }`}
          title="Mover Lienzo / Pan (H)"
          aria-label="Mover lienzo"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#f9a8d4]/60 mx-1" />

        {/* Zoom */}
        <button
          type="button"
          onClick={onZoomOut}
          className="p-2 rounded-xl hover:bg-[#fdf2f8] text-[#8a5a7a] hover:text-[#be185d] dark:text-pink-300/70 transition-colors"
          title="Alejar Zoom (-)"
          aria-label="Alejar zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onZoomReset}
          className="px-2 py-1 rounded-xl hover:bg-[#fdf2f8] text-xs font-mono font-bold text-[#6e4160] dark:text-pink-200 transition-colors"
          title="Restablecer Zoom al 100%"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={onZoomIn}
          className="p-2 rounded-xl hover:bg-[#fdf2f8] text-[#8a5a7a] hover:text-[#be185d] dark:text-pink-300/70 transition-colors"
          title="Acercar Zoom (+)"
          aria-label="Acercar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* ── BOTÓN CONTEXTUAL "VER INTERIOR" (SOLO SI TIENE JERARQUÍA) ── */}
        {selectedNode && canDrillDown && (
          <>
            <div className="w-px h-5 bg-[#f9a8d4]/60 mx-1" />
            <button
              type="button"
              onClick={() => onDrillDown(selectedNode)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#fce7f3] via-[#fae8ff] to-[#f3e8ff] hover:from-[#fbcfe8] hover:to-[#e9d5ff] text-[#be185d] border border-[#f472b6] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-pink-200/60 active:scale-95"
              title={`Ver circuito interno de ${selectedNode.label} (Doble Clic)`}
            >
              <Layers className="w-4 h-4 text-[#ec4899]" />
              <span>Ver Interior</span>
            </button>
          </>
        )}

        {/* Acciones de edición */}
        {selectedNode && (
          <>
            <div className="w-px h-5 bg-[#f9a8d4]/60 mx-1" />
            <button
              type="button"
              onClick={onDuplicate}
              className="p-2 rounded-xl hover:bg-[#fdf2f8] text-[#8a5a7a] hover:text-[#be185d] dark:text-pink-300/70 transition-colors"
              title="Duplicar componente seleccionado"
              aria-label="Duplicar"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDeleteSelected}
              className="p-2 rounded-xl hover:bg-[#ffe4e6] text-[#f43f5e] hover:text-[#be185d] transition-colors"
              title="Eliminar elemento seleccionado (Supr / Delete)"
              aria-label="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* ── 4. CONTROLES DE NAVEGACIÓN COMPACTOS EN UNA SOLA LÍNEA ── */}
      {activeFamily && (
        <div className="flex items-center bg-[#fff5fa]/95 dark:bg-[#352647]/95 backdrop-blur-md border-2 border-[#f9a8d4] shadow-lg shadow-pink-200/60 rounded-2xl px-2.5 py-1 gap-2 text-[#59324c] dark:text-pink-100">
          {/* Botón Volver */}
          {hasSnapshot && (
            <button
              type="button"
              onClick={onReturnToOrigin}
              className="px-2.5 py-1 rounded-xl bg-[#fce7f3] hover:bg-[#fbcfe8] text-[#be185d] border border-[#f472b6] text-xs font-bold flex items-center gap-1 transition-all"
              title="Volver al circuito original del usuario"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
          )}

          {/* Subir nivel (< Mayor) */}
          <button
            type="button"
            onClick={onGoHigherLevel}
            disabled={isMinLevel}
            className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-0.5 transition-colors ${
              isMinLevel
                ? 'text-[#d8b4cb] cursor-not-allowed'
                : 'text-[#6e4160] hover:text-[#be185d] hover:bg-[#fdf2f8]'
            }`}
            title={isMinLevel ? 'Nivel más alto alcanzado' : 'Subir a nivel de mayor abstracción'}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Mayor</span>
          </button>

          {/* Píldoras de nivel interactivas [N1] → [N2] → [N3] → [N4] */}
          <div className="flex items-center gap-1">
            {levels.map((lvl, idx) => {
              const isActive = lvl.level === currentLevel;
              return (
                <React.Fragment key={lvl.level}>
                  <button
                    type="button"
                    onClick={() => onGoToLevel(lvl.level)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#f472b6] to-[#c084fc] text-white shadow-sm shadow-pink-300/60 scale-105'
                        : 'bg-[#fdf2f8] dark:bg-purple-950/50 text-[#8a5a7a] dark:text-pink-300 hover:text-[#be185d] hover:bg-[#fce7f3] border border-[#fbcfe8]'
                    }`}
                    title={lvl.title}
                  >
                    {lvl.levelKey}
                  </button>
                  {idx < levels.length - 1 && (
                    <span className="text-[#f472b6] text-xs select-none font-bold">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Bajar nivel (Menor >) */}
          <button
            type="button"
            onClick={onGoDeeperLevel}
            disabled={isMaxLevel}
            className={`px-2 py-1 rounded-xl text-xs font-semibold flex items-center gap-0.5 transition-colors ${
              isMaxLevel
                ? 'text-[#d8b4cb] cursor-not-allowed'
                : 'text-[#6e4160] hover:text-[#be185d] hover:bg-[#fdf2f8]'
            }`}
            title={isMaxLevel ? 'Nivel más bajo alcanzado' : 'Descender a nivel de menor abstracción'}
          >
            <span>Menor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Nombre sutil de la familia activa */}
          <span className="text-[11px] font-mono font-bold text-[#be185d] dark:text-pink-300 border-l border-[#f9a8d4] pl-2 hidden sm:inline whitespace-nowrap">
            {activeFamily.name}
          </span>
        </div>
      )}
    </div>
  );
};
