/**
 * AdaLab Studio - Comprehensive Component & Wire Inspector Panel
 * 
 * Estética Pastel Femenina (Rosa Algodón, Lavanda, Menta y Durazno Pastel)
 * Muestra detalladamente al usuario:
 * - Nombre comercial y código de CI (ej: CI 74LS08, 74LS283, 74LS47, 74LS154, etc.)
 * - Familia lógica y encapsulado (TTL Schottky, DIP-14, DIP-16, DIP-24)
 * - Ecuación booleana / Función lógica matemática
 * - Características eléctricas: Tensión Vcc, Retardo de propagación (tpd), Consumo
 * - Tabla de verdad interactiva con resaltado en vivo de la fila activa
 * - Monitor en tiempo real de todos los pines de Entrada y Salida
 * - Controles interactivos: alternar switch, cambiar color de LED, editar nombre
 * - Tarjeta de Exploración Jerárquica Multinivel (Drill-Down)
 * - Inspector de Cables de conexión cuando se selecciona un cable
 */

import React, { useState } from 'react';
import { CircuitNode, Wire } from '../types';
import { HIERARCHY_FAMILIES, NODE_TO_HIERARCHY_MAP } from '../constants/hierarchyData';
import { COMPONENT_SPECS } from '../constants/componentSpecs';
import {
  Layers,
  ArrowRight,
  Zap,
  Cpu,
  CheckCircle2,
  Trash2,
  Palette,
  Power,
} from 'lucide-react';

interface InspectorPanelProps {
  selectedNode: CircuitNode | null;
  selectedWire: Wire | null;
  nodes: CircuitNode[];
  onDrillDown: (node: CircuitNode) => void;
  onUpdateNodeLabel: (nodeId: string, newLabel: string) => void;
  onToggleSwitch?: (nodeId: string) => void;
  onUpdateNodeColor?: (nodeId: string, color: string) => void;
  onDeleteSelected?: () => void;
  activeFamilyId: string | null;
  currentLevel: number;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedNode,
  selectedWire,
  nodes,
  onDrillDown,
  onUpdateNodeLabel,
  onToggleSwitch,
  onUpdateNodeColor,
  onDeleteSelected,
  activeFamilyId,
  currentLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'truthTable'>('specs');

  // ── CASO 1: SELECCIÓN DE UN CABLE ──────────────────────────
  if (selectedWire) {
    const fromNode = nodes.find((n) => n.id === selectedWire.fromNodeId);
    const toNode = nodes.find((n) => n.id === selectedWire.toNodeId);
    const fromPin = fromNode?.outputs.find((p) => p.id === selectedWire.fromPinId);
    const toPin = toNode?.inputs.find((p) => p.id === selectedWire.toPinId);
    const isHigh = selectedWire.value === 1 || fromPin?.value === 1;

    return (
      <aside className="w-80 h-full bg-[#fff4f9]/95 dark:bg-[#312342]/95 border-l-2 border-[#f9a8d4]/60 dark:border-pink-400/30 p-4 flex flex-col justify-between text-[#59324c] dark:text-pink-100 overflow-y-auto select-none backdrop-blur-md shadow-sm">
        <div className="space-y-4">
          <div className="border-b border-[#f9a8d4]/50 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#be185d] dark:text-pink-300 font-bold bg-[#fce7f3] dark:bg-pink-900/40 px-2 py-0.5 rounded-full">
              Conexión de Señal (Pista PCB)
            </span>
            <h3 className="text-sm font-bold text-[#59324c] dark:text-pink-100 mt-1.5">
              Cable Ortogonal a 90°
            </h3>
            <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/60">
              ID: {selectedWire.id}
            </span>
          </div>

          {/* Estado de la señal en el cable */}
          <div className="border border-[#f9a8d4] rounded-2xl p-3 bg-white dark:bg-purple-950/30 shadow-xs">
            <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/70 uppercase">
              Estado Lógico en Tiempo Real
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-[#59324c] dark:text-pink-100">Nivel de Tensión:</span>
              <div
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                  isHigh
                    ? 'bg-[#fce7f3] text-[#be185d] border border-[#f472b6] shadow-xs'
                    : 'bg-[#f3e8ff]/70 text-[#7e22ce] border border-[#d8b4fe]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isHigh ? 'bg-[#ec4899]' : 'bg-[#c084fc]'}`} />
                <span>{isHigh ? 'ALTO (1 / +5V)' : 'BAJO (0 / 0V)'}</span>
              </div>
            </div>
          </div>

          {/* Extremos de la conexión */}
          <div className="border border-[#f9a8d4]/70 rounded-2xl p-3 space-y-2.5 bg-white dark:bg-purple-950/30 text-xs shadow-xs">
            <div>
              <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/70 uppercase">Origen (Salida):</span>
              <div className="font-bold text-[#59324c] dark:text-pink-200 mt-0.5">
                {fromNode?.label || 'Nodo Salida'} · Pin: {fromPin?.name || selectedWire.fromPinId}
              </div>
            </div>
            <div className="w-full h-px bg-[#f9a8d4]/40" />
            <div>
              <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/70 uppercase">Destino (Entrada):</span>
              <div className="font-bold text-[#59324c] dark:text-pink-200 mt-0.5">
                {toNode?.label || 'Nodo Entrada'} · Pin: {toPin?.name || selectedWire.toPinId}
              </div>
            </div>
          </div>

          {/* Botón para eliminar conexión */}
          {onDeleteSelected && (
            <button
              type="button"
              onClick={onDeleteSelected}
              className="w-full py-2 px-3 rounded-xl bg-[#ffe4e6] hover:bg-[#fecdd3] text-[#be185d] border border-[#fda4af] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Conexión</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-[#8a5a7a] dark:text-pink-300/60 border-t border-[#f9a8d4]/50 pt-3 flex items-center justify-between font-mono">
          <span>AdaLab Studio</span>
          <span>Trazos Ortogonales</span>
        </div>
      </aside>
    );
  }

  // ── CASO 2: NINGÚN ELEMENTO SELECCIONADO ───────────────────
  if (!selectedNode) {
    return (
      <aside className="w-80 h-full bg-[#fff4f9]/95 dark:bg-[#312342]/95 border-l-2 border-[#f9a8d4]/60 dark:border-pink-400/30 p-5 flex flex-col justify-between text-[#6e4160] dark:text-pink-200 select-none backdrop-blur-md shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-[#59324c] dark:text-pink-100 tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#ec4899]" />
            <span>Inspector de Propiedades</span>
          </h2>
          <div className="text-xs text-[#9d6589] dark:text-pink-300/70 mt-1 flex items-center gap-1.5 font-medium">
            <span>Listo</span>
            <span aria-hidden="true">·</span>
            <span>Sin selección</span>
          </div>

          <div className="mt-8 border-2 border-dashed border-[#f9a8d4] rounded-2xl p-5 text-center bg-gradient-to-b from-white to-[#fdf2f8] dark:from-purple-950/30 dark:to-pink-950/20 shadow-xs">
            <p className="text-xs text-[#6e4160] dark:text-pink-200 leading-relaxed">
              Selecciona cualquier componente o cable en el lienzo para inspeccionar sus características técnicas,
              ficha eléctrica, tabla de verdad y pines en vivo.
            </p>
            <div className="mt-4 pt-4 border-t border-[#f9a8d4]/50 text-[11px] text-[#8a5a7a] dark:text-pink-300/70 flex flex-col gap-1.5 text-left">
              <span className="font-bold text-[#be185d] dark:text-pink-200">Atajos rápidos:</span>
              <span>· Doble Clic: Explorar Interior (Drill-Down)</span>
              <span>· V: Herramienta Selección</span>
              <span>· W: Cableado Ortogonal</span>
              <span>· H: Mover Lienzo (Pan)</span>
              <span>· Supr: Eliminar componente</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#8a5a7a] dark:text-pink-300/60 border-t border-[#f9a8d4]/50 pt-3 flex items-center justify-between font-mono">
          <span>AdaLab Studio</span>
          <span>Fichas Técnicas Activas</span>
        </div>
      </aside>
    );
  }

  // ── CASO 3: NODO SELECCIONADO ──────────────────────────────
  const spec = COMPONENT_SPECS[selectedNode.type] || {
    name: selectedNode.label,
    code: selectedNode.type,
    category: 'Componente Lógico',
    family: 'Circuito Integrado Digital',
    packageType: `DIP-${selectedNode.inputs.length + selectedNode.outputs.length}`,
    logicEquation: selectedNode.type,
    description: 'Componente digital listo para simulación.',
    tpd: '10.0 ns',
    power: '25.0 mW',
    vcc: '+5.0 V',
  };

  const hierarchyMapping = NODE_TO_HIERARCHY_MAP[selectedNode.type];
  const family = hierarchyMapping ? HIERARCHY_FAMILIES[hierarchyMapping.family] : null;

  // Determinar fila activa en la tabla de verdad (si aplica)
  const currentInValues = selectedNode.inputs.map((p) => p.value);

  return (
    <aside className="w-80 h-full bg-[#fff4f9]/95 dark:bg-[#312342]/95 border-l-2 border-[#f9a8d4]/60 dark:border-pink-400/30 p-4 flex flex-col justify-between text-[#59324c] dark:text-pink-100 overflow-y-auto select-none backdrop-blur-md shadow-sm">
      <div className="space-y-4">
        {/* Encabezado del componente */}
        <div className="border-b border-[#f9a8d4]/50 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#be185d] dark:text-pink-200 font-bold bg-[#fce7f3] dark:bg-pink-900/50 px-2 py-0.5 rounded-full border border-[#f9a8d4]">
              {spec.code}
            </span>
            <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/60">
              ID: {selectedNode.id}
            </span>
          </div>

          <h3 className="text-sm font-bold text-[#59324c] dark:text-pink-100 mt-1.5 leading-snug">
            {spec.name}
          </h3>

          {/* Campo editable de etiqueta */}
          <div className="mt-2">
            <label className="text-[10px] font-mono text-[#8a5a7a] dark:text-pink-300/70 uppercase font-semibold">Etiqueta:</label>
            <input
              type="text"
              value={selectedNode.label}
              onChange={(e) => onUpdateNodeLabel(selectedNode.id, e.target.value)}
              className="mt-0.5 w-full bg-white dark:bg-purple-950/40 border border-[#f9a8d4] rounded-xl px-2.5 py-1 text-xs font-bold text-[#59324c] dark:text-pink-100 focus:outline-none focus:border-[#ec4899] font-mono transition-colors shadow-inner"
              placeholder="Nombre del componente"
            />
          </div>

          <div className="mt-2 text-xs text-[#8a5a7a] dark:text-pink-300/70 flex items-center gap-2 font-mono">
            <span>X: {Math.round(selectedNode.x)} px</span>
            <span aria-hidden="true">·</span>
            <span>Y: {Math.round(selectedNode.y)} px</span>
          </div>
        </div>

        {/* ── CONTROLES INTERACTIVOS RÁPIDOS ──────────────────── */}
        {selectedNode.type === 'SWITCH' && onToggleSwitch && (
          <div className="border border-[#f9a8d4] rounded-2xl p-3 bg-white dark:bg-purple-950/30 flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#59324c] dark:text-pink-100 flex items-center gap-1.5">
              <Power className="w-3.5 h-3.5 text-[#ec4899]" />
              <span>Conmutar Estado:</span>
            </span>
            <button
              type="button"
              onClick={() => onToggleSwitch(selectedNode.id)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
                selectedNode.state?.value === 1
                  ? 'bg-gradient-to-r from-[#f472b6] to-[#c084fc] text-white shadow-pink-300/50'
                  : 'bg-[#f3e8ff] text-[#7e22ce] hover:bg-[#e9d5ff]'
              }`}
            >
              {selectedNode.state?.value === 1 ? 'ALTO (1)' : 'BAJO (0)'}
            </button>
          </div>
        )}

        {selectedNode.type === 'LED' && onUpdateNodeColor && (
          <div className="border border-[#f9a8d4] rounded-2xl p-3 bg-white dark:bg-purple-950/30 shadow-xs">
            <span className="text-[10px] font-mono text-[#8a5a7a] dark:text-pink-300/70 uppercase font-bold flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#ec4899]" />
              <span>Tono Pastel del Diodo:</span>
            </span>
            <div className="flex items-center gap-2.5 mt-2">
              {['#f472b6', '#c084fc', '#6ee7b7', '#fdba74', '#7dd3fc'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onUpdateNodeColor(selectedNode.id, c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    selectedNode.state?.color === c ? 'scale-125 border-[#be185d] shadow-md' : 'border-white shadow-xs'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Seleccionar color pastel ${c}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── TARJETA DE EXPLORACIÓN JERÁRQUICA MULTINIVEL ────── */}
        {family && (
          <div className="border-2 border-[#f9a8d4] bg-gradient-to-br from-[#fff0f7] via-[#fdf4ff] to-[#f5f3ff] dark:from-rose-950/40 dark:via-purple-950/40 dark:to-[#281d35] rounded-2xl p-3.5 shadow-md shadow-pink-200/50 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#ec4899] shrink-0" />
              <h3 className="text-xs font-bold text-[#be185d] dark:text-pink-200 tracking-tight">
                Exploración Jerárquica
              </h3>
            </div>

            <p className="text-[11px] text-[#6e4160] dark:text-pink-200/90 mt-2 leading-relaxed">
              {family.description}
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#f9a8d4]/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#be185d] dark:text-pink-300 font-bold">
                Interior del Componente:
              </span>
              <p className="text-[11px] text-[#59324c] dark:text-pink-100 mt-1 font-sans">
                {family.levels.find((l) => l.level === hierarchyMapping.nextLevel)?.description ||
                  'Descomposición modular interna a compuertas elementales.'}
              </p>
            </div>

            {/* Niveles de la familia */}
            <div className="mt-3 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#be185d] dark:text-pink-300 font-bold">
                Niveles Disponibles:
              </span>
              {family.levels.map((lvl) => {
                const isCurrent = activeFamilyId === family.id && currentLevel === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    className={`p-1.5 rounded-xl text-[11px] font-mono flex items-center justify-between transition-colors ${
                      isCurrent
                        ? 'bg-[#fce7f3] text-[#be185d] border border-[#f472b6] font-bold'
                        : 'bg-white/80 dark:bg-purple-950/40 text-[#8a5a7a] dark:text-pink-300/70 border border-[#fbcfe8]/60'
                    }`}
                  >
                    <span className="truncate pr-2">{lvl.title}</span>
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#ec4899] shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Botón directo de acceso */}
            <button
              type="button"
              onClick={() => onDrillDown(selectedNode)}
              className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-[#f472b6] via-[#fb7185] to-[#c084fc] hover:from-[#ec4899] hover:to-[#a855f7] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-pink-300/50 active:scale-98"
            >
              <span>Ver Interior ({family.levels.find((l) => l.level === hierarchyMapping.nextLevel)?.levelKey})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── PESTAÑAS: CARACTERÍSTICAS TÉCNICAS / TABLA DE VERDAD */}
        <div className="flex border-b border-[#f9a8d4]/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-1.5 px-2.5 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-[#ec4899] text-[#be185d] dark:text-pink-200 font-bold'
                : 'border-transparent text-[#9d6589] hover:text-[#59324c]'
            }`}
          >
            Características
          </button>
          {spec.truthTable && (
            <button
              type="button"
              onClick={() => setActiveTab('truthTable')}
              className={`pb-1.5 px-2.5 border-b-2 transition-colors ${
                activeTab === 'truthTable'
                  ? 'border-[#ec4899] text-[#be185d] dark:text-pink-200 font-bold'
                  : 'border-transparent text-[#9d6589] hover:text-[#59324c]'
              }`}
            >
              Tabla de Verdad
            </button>
          )}
        </div>

        {/* Pestaña: Características y Ficha Técnica */}
        {activeTab === 'specs' && (
          <div className="space-y-2.5 text-xs">
            {/* Función lógica */}
            <div className="border border-[#f9a8d4]/80 rounded-2xl p-2.5 bg-white dark:bg-purple-950/30 shadow-xs">
              <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/70 uppercase font-bold">Ecuación Lógica</span>
              <div className="font-mono font-bold text-[#be185d] dark:text-pink-200 mt-1 text-[13px] bg-[#fdf2f8] dark:bg-purple-950/60 px-2.5 py-1 rounded-xl border border-[#fbcfe8]">
                {spec.logicEquation}
              </div>
            </div>

            {/* Especificaciones eléctricas */}
            <div className="border border-[#f9a8d4]/80 rounded-2xl p-2.5 bg-white dark:bg-purple-950/30 space-y-1.5 font-mono text-[11px] shadow-xs">
              <div className="flex justify-between">
                <span className="text-[#9d6589] dark:text-pink-300/70">Familia:</span>
                <span className="text-[#59324c] dark:text-pink-100 font-bold truncate max-w-[170px]">{spec.family}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9d6589] dark:text-pink-300/70">Encapsulado:</span>
                <span className="text-[#59324c] dark:text-pink-100 font-semibold">{spec.packageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9d6589] dark:text-pink-300/70">Retardo (tpd):</span>
                <span className="text-[#59324c] dark:text-pink-100 font-semibold">{spec.tpd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9d6589] dark:text-pink-300/70">Consumo Potencia:</span>
                <span className="text-[#59324c] dark:text-pink-100 font-semibold">{spec.power}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9d6589] dark:text-pink-300/70">Tensión Vcc:</span>
                <span className="text-[#be185d] dark:text-pink-200 font-bold">{spec.vcc}</span>
              </div>
            </div>

            {/* Descripción funcional */}
            <p className="text-[11px] text-[#6e4160] dark:text-pink-200/80 leading-relaxed bg-[#fdf2f8]/70 dark:bg-purple-950/20 p-2.5 rounded-2xl border border-[#fbcfe8]">
              {spec.description}
            </p>
          </div>
        )}

        {/* Pestaña: Tabla de Verdad Interactiva */}
        {activeTab === 'truthTable' && spec.truthTable && (
          <div className="border border-[#f9a8d4] rounded-2xl overflow-hidden bg-white dark:bg-purple-950/30 shadow-xs">
            <div className="px-3 py-1.5 bg-[#fdf2f8] dark:bg-purple-950/60 border-b border-[#f9a8d4]/60 flex items-center justify-between text-[10px] font-mono text-[#be185d] dark:text-pink-200 font-bold">
              <span>TABLA DE VERDAD</span>
              <span className="text-[#ec4899]">Resaltado en vivo</span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-[11px] font-mono text-center border-collapse">
                <thead>
                  <tr className="bg-[#faf5ff] dark:bg-purple-900/40 text-[#6e4160] dark:text-pink-200 border-b border-[#f9a8d4]/50">
                    {spec.truthTable.headers.map((h, i) => (
                      <th key={i} className="py-1 px-1.5 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spec.truthTable.rows.map((row, rIdx) => {
                    const numInputs = spec.truthTable!.headers.length - 1;
                    const matchesCurrent =
                      currentInValues.length >= numInputs &&
                      row.slice(0, numInputs).every((val, idx) => val === currentInValues[idx]);

                    return (
                      <tr
                        key={rIdx}
                        className={`border-b border-[#fce7f3] transition-colors ${
                          matchesCurrent
                            ? 'bg-[#fce7f3] dark:bg-rose-500/30 text-[#be185d] dark:text-pink-100 font-bold'
                            : 'hover:bg-[#fdf2f8] text-[#6e4160] dark:text-pink-100/80'
                        }`}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-1 px-1.5">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MONITOR DE PINES EN TIEMPO REAL ─────────────────── */}
        <div className="border border-[#f9a8d4]/80 rounded-2xl p-3 bg-white dark:bg-purple-950/30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#59324c] dark:text-pink-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Terminales / Pines en Vivo</span>
            </span>
            <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/60">
              {selectedNode.inputs.length} In / {selectedNode.outputs.length} Out
            </span>
          </div>

          {/* Entradas */}
          {selectedNode.inputs.length > 0 && (
            <div className="mb-2">
              <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/70 uppercase font-semibold">Entradas</span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {selectedNode.inputs.map((pin) => (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between px-2 py-1 rounded-xl bg-[#fdf2f8] dark:bg-[#251736] text-xs font-mono border border-[#fbcfe8]"
                  >
                    <span className="text-[#6e4160] dark:text-pink-200 truncate">{pin.name}</span>
                    <span
                      className={`font-bold ml-1.5 ${
                        pin.value === 1 ? 'text-[#db2777] dark:text-pink-300' : 'text-[#b886a6]'
                      }`}
                    >
                      {pin.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salidas */}
          {selectedNode.outputs.length > 0 && (
            <div>
              <span className="text-[10px] font-mono text-[#9d6589] dark:text-pink-300/70 uppercase font-semibold">Salidas</span>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {selectedNode.outputs.map((pin) => (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between px-2 py-1 rounded-xl bg-[#fdf2f8] dark:bg-[#251736] text-xs font-mono border border-[#fbcfe8]"
                  >
                    <span className="text-[#6e4160] dark:text-pink-200 truncate">{pin.name}</span>
                    <span
                      className={`font-bold ml-1.5 ${
                        pin.value === 1 ? 'text-[#db2777] dark:text-pink-300' : 'text-[#b886a6]'
                      }`}
                    >
                      {pin.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pie del inspector */}
      <div className="text-[11px] text-[#8a5a7a] dark:text-pink-300/60 border-t border-[#f9a8d4]/50 pt-3 flex items-center justify-between font-mono">
        <span>AdaLab Studio</span>
        <span>Simulación Pastel 60 FPS</span>
      </div>
    </aside>
  );
};
