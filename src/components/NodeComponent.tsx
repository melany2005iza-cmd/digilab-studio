/**
 * AdaLab Studio - Node Component (IEEE / ANSI Standard Schematic Symbols Edition)
 * 
 * Renderiza TODOS los elementos del simulador con su simbología esquemática real:
 * - Compuertas lógicas (AND, OR, XOR, NAND, NOR, XNOR, NOT, BUFFER y multi-entradas)
 *   con trazado vectorial IEEE/ANSI estándar, burbuja de inversión y terminales exactos.
 * - Entradas (SWITCH, BUTTON, CLOCK, VCC, GND, DIP-4, HEX) con simbología esquemática
 *   y badge circular interactivo (1 en verde esmeralda #10b981 / 0 en blanco con borde rosa #e11d48).
 * - Salidas (LED, PROBE, BUZZER, LED_BAR, 7-SEG, BCD_DISPLAY) con símbolo esquemático real.
 * - Multiplexores y Demultiplexores con símbolo trapezoidal IEEE.
 * - Bloques aritméticos y CIs MSI (Sumadores Σ, Comparadores A≷B, Decodificadores X→Y, Codificadores)
 *   con simbología normalizada IEEE Std 91 / IEC 60617.
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

  /**
   * Renderizado de los puntos de conexión (pines) estilo esquemático:
   * - Estado 1 (ALTO): círculo verde esmeralda (#10b981) con borde oscuro (#047857) y brillo suave
   * - Estado 0 (BAJO): círculo blanco (#ffffff) con borde rosa carmesí (#e11d48)
   */
  const renderPins = (pins: Pin[], isOutput: boolean, showPinLabels = false) => {
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
          <div
            className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-150 pointer-events-auto hover:scale-150 ${
              isHigh
                ? 'bg-[#10b981] border-[#047857] shadow-[0_0_8px_rgba(16,185,129,0.75)]'
                : 'bg-white border-[#e11d48] hover:border-[#be185d] shadow-2xs'
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
            title={`${pin.name}: ${isHigh ? '1 (ALTO)' : '0 (BAJO)'}`}
          />

          {showPinLabels && (
            <span
              className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-mono select-none pointer-events-none whitespace-nowrap ${
                isOutput ? 'right-3.5 text-right' : 'left-3.5 text-left'
              } ${isHigh ? 'text-[#047857] font-bold' : 'text-[#475569] font-semibold'}`}
            >
              {pin.name}
            </span>
          )}
        </div>
      );
    });
  };

  // Extrae un nombre corto o designador para mostrar limpio junto al símbolo
  const shortLabel = node.label.replace(/\s*\(.*?\)\s*/g, '').trim() || node.type;

  // ─────────────────────────────────────────────────────────────────────────
  // 1. ENTRADAS DIGITALES: SWITCH Y BUTTON (Estilo terminal esquemático A [1]—o)
  // ─────────────────────────────────────────────────────────────────────────
  if (node.type === 'SWITCH' || node.type === 'BUTTON') {
    const isHigh = (node.state?.value ?? 0) === 1;
    const isButton = node.type === 'BUTTON';

    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]' : ''
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
        {/* Pista horizontal esquemática desde el círculo hasta el pin de salida (relX=1, relY=0.5) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1="58"
            y1="50"
            x2="100"
            y2="50"
            stroke={isHigh ? '#10b981' : '#3b4252'}
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
          {isButton && (
            /* Símbolo de pulsador mecánico encima */
            <g stroke="#283044" strokeWidth="2" fill="none">
              <line x1="42" y1="16" x2="62" y2="16" />
              <line x1="52" y1="8" x2="52" y2="16" />
            </g>
          )}
        </svg>

        <div className="w-full h-full flex items-center justify-end pr-4 gap-2 relative z-10">
          {/* Etiqueta de la entrada a la izquierda (ej. A, B, Cin) */}
          <span
            className="text-xs font-mono font-extrabold text-[#1e293b] dark:text-pink-100 whitespace-nowrap select-none"
            title={node.label}
          >
            {shortLabel}
          </span>

          {/* Botón circular interactivo de nivel lógico (0 / 1) */}
          <button
            type="button"
            className={`interactive-switch-toggle w-6 h-6 rounded-full font-mono text-xs font-extrabold flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer ${
              isHigh
                ? 'bg-[#10b981] text-white border-2 border-[#047857] shadow-[0_0_12px_rgba(16,185,129,0.65)] ring-3 ring-[#10b981]/25'
                : 'bg-white text-[#be185d] border-2 border-[#e11d48] shadow-xs hover:bg-pink-50'
            }`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSwitch(node.id);
            }}
            title={`Conmutar ${node.label} a ${isHigh ? '0 (BAJO)' : '1 (ALTO)'}`}
          >
            {isHigh ? '1' : '0'}
          </button>
        </div>

        {renderPins(node.outputs, true, false)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. FUENTES DE ALIMENTACIÓN Y CONSTANTES: VCC (+5V) Y GND (0V)
  // ─────────────────────────────────────────────────────────────────────────
  if (node.type === 'VCC' || node.type === 'HIGH_CONST') {
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]' : ''
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
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60">
          {/* Símbolo esquemático de fuente VCC (flecha/triángulo superior + línea a salida) */}
          <line x1="48" y1="30" x2="100" y2="30" stroke="#10b981" strokeWidth="2.5" />
          <line x1="48" y1="16" x2="48" y2="30" stroke="#10b981" strokeWidth="2.5" />
          <polygon points="48,4 38,18 58,18" fill="#ffffff" stroke="#047857" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="48" cy="30" r="9" fill="#10b981" stroke="#047857" strokeWidth="2" />
          <text x="48" y="33.5" textAnchor="middle" className="font-mono text-[10px] font-bold fill-white">
            1
          </text>
          <text x="26" y="34" textAnchor="end" className="font-mono text-[11px] font-extrabold fill-[#047857]">
            VCC
          </text>
        </svg>
        {renderPins(node.outputs, true, false)}
      </div>
    );
  }

  if (node.type === 'GND' || node.type === 'LOW_CONST') {
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]' : ''
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
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60">
          {/* Símbolo esquemático clásico de Tierra GND (3 barras horizontales decrecientes) */}
          <line x1="50" y1="30" x2="100" y2="30" stroke="#3b4252" strokeWidth="2.5" />
          <line x1="50" y1="30" x2="50" y2="42" stroke="#283044" strokeWidth="2.5" />
          <line x1="36" y1="42" x2="64" y2="42" stroke="#283044" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="41" y1="48" x2="59" y2="48" stroke="#283044" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="54" x2="54" y2="54" stroke="#283044" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="24" r="8" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
          <text x="50" y="27.5" textAnchor="middle" className="font-mono text-[9px] font-bold fill-[#be185d]">
            0
          </text>
          <text x="34" y="28" textAnchor="end" className="font-mono text-[11px] font-extrabold fill-[#283044]">
            GND
          </text>
        </svg>
        {renderPins(node.outputs, true, false)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. GENERADOR DE RELOJ DIGITAL (CLOCK - Símbolo de onda cuadrada)
  // ─────────────────────────────────────────────────────────────────────────
  if (node.type === 'CLOCK') {
    const isHigh = (node.state?.value ?? 0) === 1;
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]' : ''
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
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60">
          {/* Línea de salida */}
          <line
            x1="68"
            y1="30"
            x2="100"
            y2="30"
            stroke={isHigh ? '#10b981' : '#3b4252'}
            strokeWidth="2.5"
          />
          {/* Cuerpo circular del generador de reloj */}
          <circle
            cx="48"
            cy="30"
            r="19"
            fill="#ffffff"
            stroke={isHigh ? '#10b981' : '#283044'}
            strokeWidth="2.5"
          />
          {/* Símbolo de tren de pulsos (onda cuadrada) */}
          <polyline
            points="35,35 39,35 39,23 47,23 47,35 55,35 55,23 61,23"
            fill="none"
            stroke={isHigh ? '#059669' : '#be185d'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="24" y="34" textAnchor="end" className="font-mono text-[10px] font-extrabold fill-[#1e293b]">
            CLK
          </text>
        </svg>
        {renderPins(node.outputs, true, false)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SALIDAS: LED, PROBE Y BUZZER (Estilo terminal esquemático o—(1) S)
  // ─────────────────────────────────────────────────────────────────────────
  if (node.type === 'LED' || node.type === 'PROBE') {
    const isHigh = (node.state?.value ?? 0) === 1 || (node.inputs[0]?.value ?? 0) === 1;
    const customColor = node.state?.color && node.state.color !== '#f472b6' ? node.state.color : '#10b981';

    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]' : ''
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
        {/* Pista horizontal esquemática desde el pin de entrada (relX=0, relY=0.5) hasta el indicador */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line
            x1="0"
            y1="50"
            x2="38"
            y2="50"
            stroke={isHigh ? '#10b981' : '#3b4252'}
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="w-full h-full flex items-center justify-start pl-3.5 gap-2 relative z-10">
          {/* Círculo indicador de estado lógico (igual a la imagen de referencia) */}
          <div
            className={`w-6 h-6 rounded-full font-mono text-xs font-extrabold flex items-center justify-center transition-all duration-150 shrink-0 ${
              isHigh
                ? 'text-white border-2 border-[#047857] ring-3 ring-[#10b981]/25'
                : 'bg-white text-[#be185d] border-2 border-[#e11d48] shadow-xs'
            }`}
            style={{
              backgroundColor: isHigh ? customColor : '#ffffff',
              boxShadow: isHigh ? `0 0 12px ${customColor}` : undefined,
            }}
          >
            {isHigh ? '1' : '0'}
          </div>

          {/* Etiqueta de la salida a la derecha (ej. S, Cout, Y0) */}
          <span
            className="text-xs font-mono font-extrabold text-[#1e293b] dark:text-pink-100 whitespace-nowrap select-none"
            title={node.label}
          >
            {shortLabel}
          </span>
        </div>

        {renderPins(node.inputs, false, false)}
      </div>
    );
  }

  if (node.type === 'BUZZER') {
    const isHigh = (node.inputs[0]?.value ?? 0) === 1;
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.45)]' : ''
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
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60">
          <line x1="0" y1="30" x2="32" y2="30" stroke={isHigh ? '#10b981' : '#3b4252'} strokeWidth="2.5" />
          {/* Símbolo esquemático de Zumbador / Altavoz piezoeléctrico */}
          <rect x="32" y="18" width="12" height="24" fill="#ffffff" stroke="#283044" strokeWidth="2.3" />
          <polygon points="44,18 62,8 62,52 44,42" fill={isHigh ? '#d1fae5' : '#ffffff'} stroke="#283044" strokeWidth="2.3" strokeLinejoin="round" />
          {isHigh && (
            <g stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M 68,20 Q 75,30 68,40" />
              <path d="M 74,14 Q 84,30 74,46" />
            </g>
          )}
        </svg>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#9d174d] whitespace-nowrap">
          {shortLabel}
        </div>
        {renderPins(node.inputs, false, false)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. DISPLAY DE 7 SEGMENTOS Y DISPLAY BCD
  // ─────────────────────────────────────────────────────────────────────────
  if (node.type === 'SEVEN_SEG') {
    const segs = node.state?.segments || { sa: 0, sb: 0, sc: 0, sd: 0, se: 0, sf: 0, sg: 0 };
    const charValue = node.state?.displayValue ?? '-';

    const segClass = (val: number) =>
      val === 1
        ? 'fill-[#10b981] drop-shadow-[0_0_6px_rgba(16,185,129,0.85)]'
        : 'fill-[#e2e8f0]';

    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'ring-2 ring-[#e11d48] rounded-xl shadow-lg' : ''
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
        <div className="w-full h-full bg-white border-[2.5px] border-[#283044] rounded-xl p-3 flex flex-col items-center justify-between shadow-md relative">
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#283044] font-bold border-b border-slate-200 pb-1">
            <span>7-SEG</span>
            <span className="text-[#047857] bg-[#d1fae5] px-1.5 rounded font-extrabold text-xs border border-[#10b981]">
              {charValue}
            </span>
          </div>

          <svg className="w-24 h-36 my-1" viewBox="0 0 100 150">
            <polygon points="20,10 80,10 70,22 30,22" className={segClass(segs.sa)} />
            <polygon points="82,12 82,68 70,60 70,24" className={segClass(segs.sb)} />
            <polygon points="82,78 82,134 70,122 70,86" className={segClass(segs.sc)} />
            <polygon points="20,136 80,136 70,124 30,124" className={segClass(segs.sd)} />
            <polygon points="18,78 18,134 30,122 30,86" className={segClass(segs.se)} />
            <polygon points="18,12 18,68 30,60 30,24" className={segClass(segs.sf)} />
            <polygon points="22,73 78,73 68,81 32,81" className={segClass(segs.sg)} />
          </svg>

          <span className="text-[9px] font-mono text-[#9d174d] font-bold">{shortLabel}</span>
        </div>
        {renderPins(node.inputs, false, true)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. COMPUERTAS LÓGICAS CON SIMBOLOGÍA IEEE / ANSI REAL
  //    (AND, NAND, OR, NOR, XOR, XNOR, NOT, BUFFER y versiones de 3, 4 y 8 entradas)
  // ─────────────────────────────────────────────────────────────────────────
  const isGate = [
    'AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR', 'BUFFER',
    'AND_3', 'AND_4', 'AND_8', 'OR_3', 'OR_4', 'OR_8',
    'NOR_3', 'NOR_4', 'NOR_8', 'NAND_3', 'NAND_4', 'NAND_8', 'XOR_3',
  ].includes(node.type);

  if (isGate) {
    const baseGate = node.type.split('_')[0]; // AND, OR, NAND, NOR, XOR, XNOR, NOT, BUFFER
    const isInverted = ['NAND', 'NOR', 'XNOR', 'NOT'].includes(baseGate);
    const isOrFamily = ['OR', 'NOR', 'XOR', 'XNOR'].includes(baseGate);
    const isXorFamily = ['XOR', 'XNOR'].includes(baseGate);
    const isTriangleFamily = ['NOT', 'BUFFER'].includes(baseGate);
    const isHighOut = node.outputs[0]?.value === 1;

    // Código corto tipo U1, U2 o etiqueta limpia debajo de la compuerta
    const gateDesignator = node.label.includes('·')
      ? node.label.split('·')[0].trim()
      : node.label;

    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.55)]' : 'drop-shadow-[0_2px_4px_rgba(40,48,68,0.12)]'
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
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* 1. Pistas de entrada desde los pines (x=0) hasta el cuerpo de la compuerta */}
          {node.inputs.map((pin) => {
            const py = pin.relY * 100;
            const normY = (py - 50) / 38;
            const curveOffset = Math.max(0, 1 - normY * normY) * 11;
            const stopX = isXorFamily
              ? 13 + curveOffset
              : isOrFamily
              ? 20 + curveOffset
              : 24;

            return (
              <line
                key={pin.id}
                x1="0"
                y1={py}
                x2={stopX}
                y2={py}
                stroke={pin.value === 1 ? '#10b981' : '#283044'}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {/* Barra vertical extensora si tiene 4 u 8 entradas */}
          {node.inputs.length >= 4 && (
            <line
              x1={isXorFamily ? '13' : isOrFamily ? '20' : '24'}
              y1={Math.min(12, node.inputs[0].relY * 100)}
              x2={isXorFamily ? '13' : isOrFamily ? '20' : '24'}
              y2={Math.max(88, node.inputs[node.inputs.length - 1].relY * 100)}
              stroke="#283044"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* 2. Pista de salida desde la punta/burbuja hasta el pin de salida (x=100, y=50) */}
          <line
            x1={isInverted ? '86' : '78'}
            y1="50"
            x2="100"
            y2="50"
            stroke={isHighOut ? '#10b981' : '#283044'}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />

          {/* 3. Cuerpo vectorial IEEE/ANSI según el tipo de compuerta */}
          {isTriangleFamily && (
            <polygon
              points="24,14 75,50 24,86"
              fill="#ffffff"
              stroke={isSelected ? '#e11d48' : '#283044'}
              strokeWidth="2.6"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {(baseGate === 'AND' || baseGate === 'NAND') && (
            <path
              d="M 24,12 L 53,12 A 25,38 0 0,1 53,88 L 24,88 Z"
              fill="#ffffff"
              stroke={isSelected ? '#e11d48' : '#283044'}
              strokeWidth="2.6"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {isOrFamily && (
            <>
              {isXorFamily && (
                <path
                  d="M 13,12 Q 31,50 13,88"
                  fill="none"
                  stroke={isSelected ? '#e11d48' : '#283044'}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <path
                d="M 21,12 Q 39,50 21,88 Q 55,88 78,50 Q 55,12 21,12 Z"
                fill="#ffffff"
                stroke={isSelected ? '#e11d48' : '#283044'}
                strokeWidth="2.6"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}

          {/* 4. Burbuja de negación lógica (NAND, NOR, XNOR, NOT) */}
          {isInverted && (
            <circle
              cx="81.5"
              cy="50"
              r="5"
              fill="#ffffff"
              stroke={isSelected ? '#e11d48' : '#283044'}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Designador / nombre debajo del símbolo (igual que U1, U2, U3, U4 en la imagen) */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#9d174d] dark:text-pink-200 whitespace-nowrap pointer-events-none">
          {gateDesignator}
        </div>

        {renderPins(node.inputs, false, false)}
        {renderPins(node.outputs, true, false)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. MULTIPLEXORES Y DEMULTIPLEXORES (Símbolo Trapezoidal IEEE Estándar)
  // ─────────────────────────────────────────────────────────────────────────
  const isMux = ['MUX_2_1', 'MUX_4_1', 'IC_74151'].includes(node.type);
  const isDemux = ['DEMUX_1_2', 'DEMUX_1_4', 'DEMUX_1_8'].includes(node.type);

  if (isMux || isDemux) {
    return (
      <div
        id={`node-${node.id}`}
        className={`circuit-node absolute cursor-move select-none ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(225,29,72,0.55)]' : 'drop-shadow-[0_2px_5px_rgba(40,48,68,0.14)]'
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
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Pistas de entrada */}
          {node.inputs.map((pin) => (
            <line
              key={pin.id}
              x1="0"
              y1={pin.relY * 100}
              x2="16"
              y2={pin.relY * 100}
              stroke={pin.value === 1 ? '#10b981' : '#283044'}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Pistas de salida */}
          {node.outputs.map((pin) => (
            <line
              key={pin.id}
              x1="84"
              y1={pin.relY * 100}
              x2="100"
              y2={pin.relY * 100}
              stroke={pin.value === 1 ? '#10b981' : '#283044'}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Cuerpo trapezoidal IEEE (MUX: ancho izq -> estrecho der | DEMUX: estrecho izq -> ancho der) */}
          <polygon
            points={isMux ? '16,4 84,18 84,82 16,96' : '16,18 84,4 84,96 16,82'}
            fill="#ffffff"
            stroke={isSelected ? '#e11d48' : '#283044'}
            strokeWidth="2.6"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Etiquetas internas y símbolo MUX/DMX */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-5">
          <span className="text-[11px] font-mono font-black text-[#283044]">
            {isMux ? 'MUX' : 'DMX'}
          </span>
          <span className="text-[9px] font-mono font-bold text-[#9d174d] truncate max-w-full">
            {shortLabel}
          </span>
          {hasHierarchy && (
            <span className="mt-0.5 px-1.5 py-0.2 rounded-full bg-[#fce7f3] border border-[#f9a8d4] text-[8px] font-mono font-bold text-[#be185d]">
              2×Clic
            </span>
          )}
        </div>

        {/* Nombres de pines dentro del trapecio */}
        {node.inputs.map((pin) => (
          <span
            key={pin.id}
            style={{ top: `${pin.relY * 100}%`, left: '19%' }}
            className="absolute -translate-y-1/2 text-[8px] font-mono font-bold text-[#475569] pointer-events-none"
          >
            {pin.name}
          </span>
        ))}
        {node.outputs.map((pin) => (
          <span
            key={pin.id}
            style={{ top: `${pin.relY * 100}%`, right: '19%' }}
            className="absolute -translate-y-1/2 text-[8px] font-mono font-bold text-[#475569] pointer-events-none"
          >
            {pin.name}
          </span>
        ))}

        {renderPins(node.inputs, false, false)}
        {renderPins(node.outputs, true, false)}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. CIRCUITOS INTEGRADOS MSI Y BLOQUES FUNCIONALES (IEEE Std 91 / IEC 60617)
  //    (Sumadores Σ, Restadores, Comparadores A≷B, Decodificadores, Codificadores, DIP-4, etc.)
  // ─────────────────────────────────────────────────────────────────────────
  const getFunctionalSymbol = (type: string): { symbol: string; sub: string } => {
    if (type.includes('ADDER') || type === 'IC_74283') return { symbol: 'Σ', sub: 'ADD' };
    if (type.includes('SUBTRACTOR')) return { symbol: 'Σ', sub: 'A−B' };
    if (type.includes('COMP') || type === 'IC_7485') return { symbol: 'A≷B', sub: 'COMP' };
    if (type === 'BCD_7SEG' || type === 'IC_7447' || type === 'IC_7448') return { symbol: 'BCD▸7', sub: 'DEC' };
    if (type.includes('DEC') || type === 'IC_74138' || type === 'IC_74154' || type === 'IC_7442') return { symbol: 'X▸2ⁿ', sub: 'DEC' };
    if (type.includes('ENC') || type === 'IC_74147') return { symbol: '2ⁿ▸X', sub: 'ENC' };
    if (type === 'DIP_SWITCH_4') return { symbol: 'DIP-4', sub: 'SW' };
    if (type === 'HEX_INPUT') return { symbol: '0..F', sub: 'HEX' };
    if (type === 'LED_BAR') return { symbol: '▮▮▮▮', sub: 'LED' };
    if (type === 'BCD_DISPLAY') return { symbol: '8.', sub: 'BCD' };
    return { symbol: 'IC', sub: type };
  };

  const funcSym = getFunctionalSymbol(node.type);

  return (
    <div
      id={`node-${node.id}`}
      className={`circuit-node absolute cursor-move select-none ${
        isSelected ? 'drop-shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 'drop-shadow-[0_2px_6px_rgba(40,48,68,0.14)]'
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
      {/* Trazo esquemático IEEE con terminales laterales y muesca superior de CI */}
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Pistas de pines de entrada */}
        {node.inputs.map((pin) => (
          <line
            key={pin.id}
            x1="0"
            y1={pin.relY * 100}
            x2="10"
            y2={pin.relY * 100}
            stroke={pin.value === 1 ? '#10b981' : '#283044'}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Pistas de pines de salida */}
        {node.outputs.map((pin) => (
          <line
            key={pin.id}
            x1="90"
            y1={pin.relY * 100}
            x2="100"
            y2={pin.relY * 100}
            stroke={pin.value === 1 ? '#10b981' : '#283044'}
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Cuerpo rectangular normalizado IEEE Std 91 */}
        <rect
          x="10"
          y="3"
          width="80"
          height="94"
          rx="4"
          fill="#ffffff"
          stroke={isSelected ? '#e11d48' : '#283044'}
          strokeWidth="2.6"
          vectorEffect="non-scaling-stroke"
        />

        {/* Muesca semicircular superior de Circuito Integrado */}
        <path
          d="M 43,3 A 7,5 0 0,0 57,3"
          fill="#fce7f3"
          stroke="#283044"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Contenido técnico interno del bloque esquemático */}
      <div className="absolute inset-y-[4%] inset-x-[12%] flex flex-col justify-between items-center py-1.5 px-2 pointer-events-none overflow-hidden">
        {/* Símbolo funcional IEEE (Σ, A≷B, X▸2ⁿ) */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-0.5 w-full justify-center">
          <span className="text-sm font-mono font-black text-[#be185d] leading-none">
            {funcSym.symbol}
          </span>
          <span className="text-[9px] font-mono font-bold text-[#283044] uppercase">
            {funcSym.sub}
          </span>
        </div>

        {/* Etiqueta y valor de estado en vivo */}
        <div className="my-auto text-center px-2">
          <div className="text-[10px] font-mono font-extrabold text-[#1e293b] leading-tight">
            {shortLabel}
          </div>
          {node.state?.displayValue && (
            <div className="mt-1 px-2 py-0.5 rounded bg-[#d1fae5] border border-[#10b981] text-[9px] font-mono font-bold text-[#047857] inline-block max-w-full truncate">
              {node.state.displayValue}
            </div>
          )}
        </div>

        {/* Indicador de exploración jerárquica */}
        {hasHierarchy ? (
          <div className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#fce7f3] border border-[#f9a8d4] text-[8px] font-mono font-bold text-[#be185d]">
            <Layers className="w-2.5 h-2.5 text-[#ec4899]" />
            <span>2×Clic Interior</span>
          </div>
        ) : (
          <div className="text-[8px] font-mono text-[#64748b] font-semibold">
            DIP-{node.inputs.length + node.outputs.length}
          </div>
        )}
      </div>

      {/* Nombres de pines alineados en el borde interno del bloque */}
      {node.inputs.map((pin) => (
        <span
          key={pin.id}
          style={{ top: `${pin.relY * 100}%`, left: '13%' }}
          className={`absolute -translate-y-1/2 text-[8px] font-mono pointer-events-none whitespace-nowrap ${
            pin.value === 1 ? 'text-[#047857] font-extrabold' : 'text-[#475569] font-semibold'
          }`}
        >
          {pin.name}
        </span>
      ))}
      {node.outputs.map((pin) => (
        <span
          key={pin.id}
          style={{ top: `${pin.relY * 100}%`, right: '13%' }}
          className={`absolute -translate-y-1/2 text-[8px] font-mono pointer-events-none whitespace-nowrap ${
            pin.value === 1 ? 'text-[#047857] font-extrabold' : 'text-[#475569] font-semibold'
          }`}
        >
          {pin.name}
        </span>
      ))}

      {renderPins(node.inputs, false, false)}
      {renderPins(node.outputs, true, false)}
    </div>
  );
});
