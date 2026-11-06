/**
 * AdaLab Studio - Node Component (Pastel Blossom Edition)
 * 
 * Renderizado de precisión con estética pastel femenina, delicada y elegante:
 * - CIs DIP en cerámica rosa algodón y lavanda pastel con contactos en cuarzo rosa
 * - Compuertas lógicas ANSI en tarjetas crema-rubor con bordes rosa pastel
 * - Interruptores con palanca táctil en fresa pastel y lila
 * - LEDs y Displays de 7 segmentos en rosa pastel luminoso
 * 
 * Requisito 2a: Soporta DOBLE CLIC directo sin destruir nodos en mousedown.
 */

import React, { memo } from 'react';
import { CircuitNode, Pin } from '../types';
import { NODE_TO_HIERARCHY_MAP } from '../constants/hierarchyData';
import { Layers } from 'lucide-react';

interface NodeComponentProps {
  node: CircuitNode;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDrillDown: (node: CircuitNode) => void;
  onToggleSwitch: (nodeId: string) => void;
  onPinMouseDown: (nodeId: string, pinId: string, isOutput: boolean, e: React.MouseEvent) => void;
  onPinMouseUp: (nodeId: string, pinId: string, isOutput: boolean, e: React.MouseEvent) => void;
}

export const NodeComponent: React.FC<NodeComponentProps> = memo(({
  node,
  isSelected,
  onSelect,
  onDrillDown,
  onToggleSwitch,
  onPinMouseDown,
  onPinMouseUp,
}) => {
  const hasHierarchy = !!NODE_TO_HIERARCHY_MAP[node.type];

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-switch-toggle')) {
      return;
    }
    onSelect(node.id, e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasHierarchy) {
      onDrillDown(node);
    }
  };

  // Renderizado de pines rectilíneos con anclaje espacial absoluto locked a 90°
  const renderPins = (pins: Pin[], isOutput: boolean) => {
    return pins.map((pin) => {
      const isHigh = pin.value === 1;
      return (
        <div
          key={pin.id}
          className="absolute z-20 cursor-crosshair select-none pointer-events-none"
          style={{
            left: `${pin.relX * 100}%`,
            top: `${pin.relY * 100}%`,
          }}
        >
          {/* Terminal pastel centrado matemáticamente */}
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 transition-colors duration-150 flex items-center justify-center pointer-events-auto hover:scale-125 shadow-xs ${
              isHigh
                ? 'bg-[#ec4899] border-[#fbcfe8] shadow-pink-400/50 shadow-md ring-2 ring-pink-300/50'
                : 'bg-[#fdf2f8] dark:bg-[#3a284c] border-[#f472b6] hover:border-[#ec4899]'
            }`}
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              onPinMouseDown(node.id, pin.id, isOutput, e);
            }}
            onMouseUp={(e) => {
              e.stopPropagation();
              onPinMouseUp(node.id, pin.id, isOutput, e);
            }}
            title={`${pin.name}: ${isHigh ? 'ALTO (1)' : 'BAJO (0)'}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-white' : 'bg-[#f9a8d4]'}`} />
          </div>

          {/* Etiqueta del pin posicionada de forma fija */}
          <span
            className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-mono px-1 select-none pointer-events-none transition-colors whitespace-nowrap ${
              isOutput ? 'right-2.5 text-right' : 'left-2.5 text-left'
            } ${isHigh ? 'text-[#be185d] dark:text-pink-300 font-bold' : 'text-[#8a5a7a] dark:text-pink-200/70 font-semibold'}`}
          >
            {pin.name}
          </span>
        </div>
      );
    });
  };

  // ── 1. RENDERIZADO DE INTERRUPTORES (SWITCH) ──────────────
  if (node.type === 'SWITCH') {
    const isHigh = (node.state?.value ?? 0) === 1;
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-[#fff5fa] dark:bg-[#352647] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl px-2.5 py-1.5 flex items-center justify-between shadow-md shadow-pink-200/50 overflow-hidden">
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-[11px] font-mono font-bold text-[#59324c] dark:text-pink-100 truncate">{node.label}</span>
            <span className={`text-[10px] font-mono font-bold tracking-wider ${isHigh ? 'text-[#db2777] dark:text-pink-300' : 'text-[#a37092] dark:text-pink-300/50'}`}>
              {isHigh ? 'NIVEL 1' : 'NIVEL 0'}
            </span>
          </div>

          {/* Toggle conmutador pastel */}
          <button
            type="button"
            className={`interactive-switch-toggle relative w-11 h-6 rounded-full border focus:outline-none transition-colors p-0.5 shrink-0 ${
              isHigh
                ? 'bg-[#fce7f3] border-[#f472b6] shadow-xs'
                : 'bg-[#f3e8ff] dark:bg-purple-950/60 border-[#d8b4fe]'
            }`}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSwitch(node.id);
            }}
            title={`Conmutar a ${isHigh ? '0 (BAJO)' : '1 (ALTO)'}`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-extrabold transition-transform duration-150 shadow-xs ${
                isHigh
                  ? 'translate-x-5 bg-gradient-to-r from-[#f472b6] to-[#c084fc] text-white'
                  : 'translate-x-0 bg-[#d8b4fe] text-[#581c87]'
              }`}
            >
              {isHigh ? '1' : '0'}
            </div>
          </button>
        </div>
        {renderPins(node.outputs, true)}
      </div>
    );
  }

  // ── 1.B. RENDERIZADO DE FUENTES DE ALIMENTACIÓN: VCC (+5V) Y GND (0V) ──
  if (node.type === 'VCC' || node.type === 'HIGH_CONST') {
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-gradient-to-r from-[#fff0f6] to-[#fce7f3] dark:from-[#3d2647] dark:to-[#311f3d] border-2 border-[#f472b6] rounded-2xl px-2.5 py-1 flex items-center justify-between shadow-md shadow-pink-200/50">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-[#fbcfe8] border border-[#f472b6] flex items-center justify-center text-[#be185d] font-black text-xs">
              ▲
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-bold text-[#be185d] dark:text-pink-100">VCC</span>
              <span className="text-[9px] font-mono font-bold text-[#db2777] dark:text-pink-300">+5V (1)</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#ec4899] animate-pulse shadow-xs mr-2" />
        </div>
        {renderPins(node.outputs, true)}
      </div>
    );
  }

  if (node.type === 'GND' || node.type === 'LOW_CONST') {
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-[#faf5ff] dark:bg-[#312342] border-2 border-[#d8b4fe] rounded-2xl px-2.5 py-1 flex items-center justify-between shadow-md shadow-purple-100/60">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg bg-[#f3e8ff] border border-[#c084fc] flex items-center justify-center text-[#7e22ce] font-mono text-xs">
              ⏚
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-bold text-[#581c87] dark:text-pink-100">GND</span>
              <span className="text-[9px] font-mono font-semibold text-[#9333ea] dark:text-pink-300/70">0V (0)</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#c084fc] mr-2" />
        </div>
        {renderPins(node.outputs, true)}
      </div>
    );
  }

  // ── 1.C. RENDERIZADO DE RELOJ DIGITAL (CLOCK) ──────────────
  if (node.type === 'CLOCK') {
    const isHigh = (node.state?.value ?? 0) === 1;
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-[#fff5fa] dark:bg-[#352647] border-2 border-[#f9a8d4] rounded-2xl px-2.5 py-1.5 flex items-center justify-between shadow-md shadow-pink-200/50">
          <div className="flex flex-col min-w-0 pr-1">
            <span className="text-[11px] font-mono font-bold text-[#59324c] dark:text-pink-100 truncate">{node.label}</span>
            <span className={`text-[9px] font-mono font-bold ${isHigh ? 'text-[#db2777]' : 'text-[#a37092]'}`}>
              CLK: {isHigh ? '1' : '0'}
            </span>
          </div>
          <div
            className={`w-3.5 h-3.5 rounded-full border transition-all mr-2 ${
              isHigh
                ? 'bg-[#f472b6] border-[#fbcfe8] shadow-sm shadow-pink-400 ring-2 ring-pink-300/50'
                : 'bg-[#f3e8ff] border-[#d8b4fe]'
            }`}
          />
        </div>
        {renderPins(node.outputs, true)}
      </div>
    );
  }

  // ── 2. RENDERIZADO DE LEDS ─────────────────────────────────
  if (node.type === 'LED') {
    const isHigh = (node.state?.value ?? 0) === 1;
    const ledColor = node.state?.color || '#f472b6';
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-[#fff5fa]/95 dark:bg-[#352647]/95 border-2 border-[#f9a8d4] rounded-2xl p-1.5 flex items-center gap-2 shadow-md shadow-pink-200/50">
          {/* Lente difusor LED en rosa pastel luminoso */}
          <div
            className={`w-6 h-6 rounded-full border-2 border-[#f9a8d4] flex items-center justify-center transition-all duration-150 ${
              isHigh ? 'shadow-md ring-4 ring-pink-300/40' : 'bg-[#fce7f3] opacity-75'
            }`}
            style={{
              backgroundColor: isHigh ? ledColor : '#fce7f3',
              boxShadow: isHigh ? `0 0 14px ${ledColor}` : 'none',
            }}
          >
            <div className={`w-2 h-2 rounded-full ${isHigh ? 'bg-white opacity-95' : 'bg-white/70'}`} />
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-mono font-bold text-[#59324c] dark:text-pink-100 truncate">{node.label}</span>
            <span className={`text-[9px] font-mono ${isHigh ? 'text-[#db2777] font-bold' : 'text-[#a37092]'}`}>
              {isHigh ? 'HIGH (1)' : 'LOW (0)'}
            </span>
          </div>
        </div>
        {renderPins(node.inputs, false)}
      </div>
    );
  }

  // ── 3. RENDERIZADO DE DISPLAY DE 7 SEGMENTOS ───────────────
  if (node.type === 'SEVEN_SEG') {
    const segs = node.state?.segments || { sa: 0, sb: 0, sc: 0, sd: 0, se: 0, sf: 0, sg: 0 };
    const charValue = node.state?.displayValue ?? '-';

    const segClass = (val: number) =>
      val === 1
        ? 'fill-[#ec4899] drop-shadow-[0_0_6px_rgba(244,114,182,0.85)]'
        : 'fill-[#f5d0fe]/65 dark:fill-[#4a325c]/60';

    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-gradient-to-b from-[#fff0f7] to-[#fae8ff] dark:from-[#352447] dark:to-[#291b38] border-2 border-[#f9a8d4] rounded-2xl p-3 flex flex-col items-center justify-between shadow-lg shadow-pink-200/60 relative">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#8a5a7a] dark:text-pink-200 font-bold">
            <span>7-SEG</span>
            <span className="text-[#be185d] dark:text-pink-200 bg-[#fce7f3] dark:bg-pink-900/50 px-1.5 rounded-full font-extrabold text-xs border border-[#f9a8d4]">{charValue}</span>
          </div>

          {/* Matriz SVG de los 7 segmentos */}
          <svg className="w-24 h-36 my-1" viewBox="0 0 100 150">
            <polygon points="20,10 80,10 70,22 30,22" className={segClass(segs.sa)} />
            <polygon points="82,12 82,68 70,60 70,24" className={segClass(segs.sb)} />
            <polygon points="82,78 82,134 70,122 70,86" className={segClass(segs.sc)} />
            <polygon points="20,136 80,136 70,124 30,124" className={segClass(segs.sd)} />
            <polygon points="18,78 18,134 30,122 30,86" className={segClass(segs.se)} />
            <polygon points="18,12 18,68 30,60 30,24" className={segClass(segs.sf)} />
            <polygon points="22,73 78,73 68,81 32,81" className={segClass(segs.sg)} />
          </svg>

          <span className="text-[9px] font-mono text-[#9d6589] dark:text-pink-300/60 font-semibold">PASTEL DISPLAY</span>
        </div>
        {renderPins(node.inputs, false)}
      </div>
    );
  }

  // ── 4. RENDERIZADO DE COMPUERTAS ANSI (AND, OR, NOT, XOR, BUFFER, MULTI-INPUT...)
  const isGate = [
    'AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR', 'BUFFER',
    'AND_3', 'AND_4', 'AND_8', 'OR_3', 'OR_4', 'NOR_3', 'NOR_4', 'NAND_3', 'NAND_4', 'NAND_8', 'XOR_3',
  ].includes(node.type);
  if (isGate) {
    const isHighOut = node.outputs[0]?.value === 1;

    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none rounded-2xl group/gate ${
          isSelected ? 'ring-2 ring-[#f472b6] shadow-lg shadow-pink-300/50' : ''
        }`}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="w-full h-full bg-gradient-to-br from-[#fff5fa] to-[#faf5ff] dark:from-[#38274a] dark:to-[#2e203d] border-2 border-[#f9a8d4] dark:border-pink-400/40 rounded-2xl p-2 flex flex-col items-center justify-center shadow-md shadow-pink-200/50 relative backdrop-blur-sm">
          <div className="flex items-center justify-center">
            <span className="text-xs font-mono font-extrabold tracking-wider text-[#be185d] dark:text-pink-200">
              {node.type}
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#8a5a7a] dark:text-pink-300/70 mt-1 truncate max-w-full font-medium">
            {node.label}
          </span>

          {/* Indicador de salida luminosa */}
          <div
            className={`absolute right-1.5 bottom-1.5 w-2 h-2 rounded-full ${
              isHighOut ? 'bg-[#ec4899] shadow-xs shadow-pink-400' : 'bg-[#f5d0fe]'
            }`}
          />
        </div>

        {renderPins(node.inputs, false)}
        {renderPins(node.outputs, true)}
      </div>
    );
  }

  // ── 5. RENDERIZADO DE CIRCUITOS INTEGRADOS MSI Y BLOQUES ──
  // (CI 74LS283, CI 74LS47, CI 74LS154, FULL_ADDER, HALF_ADDER, MUX 4:1...)
  return (
    <div
      id={`node-${node.id}`}
      className={`circuit-node absolute cursor-move select-none transition-all rounded-2xl ${
        isSelected
          ? 'ring-2 ring-[#f472b6] shadow-xl shadow-pink-300/60'
          : 'hover:border-[#f472b6]'
      }`}
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Encapsulado cerámico pastel rosa algodón y lavanda suave */}
      <div className="w-full h-full bg-gradient-to-b from-[#fff0f7] via-[#fdf4ff] to-[#fae8ff] dark:from-[#39274c] dark:via-[#2f2040] dark:to-[#39274c] border-2 border-[#f9a8d4] dark:border-pink-400/50 rounded-2xl p-2.5 flex flex-col justify-between shadow-lg shadow-pink-200/60 dark:shadow-purple-950/60 relative overflow-hidden">
        {/* Muesca (notch) superior en lila pastel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-[#f3e8ff] dark:bg-purple-900/80 border-b border-x border-[#d8b4fe] rounded-b-lg" />

        {/* Header con serigrafía técnica en rosa frambuesa pastel */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f472b6] border border-white shadow-xs" />
            <span className="text-xs font-mono font-black text-[#be185d] dark:text-pink-200 tracking-tight">
              {node.type.startsWith('IC_') ? node.label.split('·')[0] : node.type}
            </span>
          </div>

          {/* Badge si tiene jerarquía interna */}
          {hasHierarchy && (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 dark:bg-rose-950/70 border border-[#f9a8d4] text-[9px] font-mono font-bold text-[#be185d] dark:text-pink-200 shadow-2xs"
              title="Doble clic para ver interior jerárquico"
            >
              <Layers className="w-2.5 h-2.5 text-[#ec4899]" />
              <span>NIVEL</span>
            </div>
          )}
        </div>

        {/* Título y descripción serigrafiada central */}
        <div className="my-auto text-center px-1">
          <div className="text-[11px] font-mono font-bold text-[#59324c] dark:text-pink-100 truncate">
            {node.label}
          </div>
          {node.state?.displayValue && (
            <div className="text-[10px] font-mono font-bold text-[#be185d] dark:text-pink-200 mt-1 bg-white/90 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-[#f9a8d4] inline-block max-w-full truncate shadow-2xs">
              {node.state.displayValue}
            </div>
          )}
        </div>

        {/* Pie de encapsulado */}
        <div className="text-[9px] font-mono text-[#8a5a7a] dark:text-pink-300/70 flex justify-between items-center border-t border-[#f9a8d4]/60 pt-1 font-semibold">
          <span>DIP-{node.inputs.length + node.outputs.length}</span>
          <span className="text-[8px] text-[#db2777] dark:text-pink-300 font-bold">Ver Interior ↗</span>
        </div>
      </div>

      {renderPins(node.inputs, false)}
      {renderPins(node.outputs, true)}
    </div>
  );
});
