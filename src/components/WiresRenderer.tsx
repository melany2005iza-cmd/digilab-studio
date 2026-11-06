/**
 * AdaLab Studio - Wires SVG Renderer Component (Pastel Blossom Edition)
 * 
 * Renderizado de cables lógicos SIN CURVAS (Ortogonales tipo PCB / Manhattan).
 * Trazo rectilíneo a 90 grados sin curvas Bezier, con estado ALTO (1)
 * en rosa fresa pastel (#ec4899) y estado BAJO (0) en lavanda pastel (#d8b4e2).
 */

import React from 'react';
import { CircuitNode, Wire, DraggingWire } from '../types';

interface WiresRendererProps {
  wires: Wire[];
  nodes: CircuitNode[];
  selectedWireId: string | null;
  onSelectWire: (wireId: string) => void;
  draggingWire: DraggingWire | null;
}

/**
 * Genera el trazado rectilíneo ortogonal (sin curvas)
 */
export function getOrthogonalPath(x1: number, y1: number, x2: number, y2: number): string {
  const roundX1 = Math.round(x1);
  const roundY1 = Math.round(y1);
  const roundX2 = Math.round(x2);
  const roundY2 = Math.round(y2);

  if (roundX2 >= roundX1 + 24) {
    const midX = Math.round(roundX1 + (roundX2 - roundX1) / 2);
    return `M ${roundX1} ${roundY1} L ${midX} ${roundY1} L ${midX} ${roundY2} L ${roundX2} ${roundY2}`;
  } else {
    const exitX = roundX1 + 24;
    const enterX = roundX2 - 24;
    const midY = roundY1 < roundY2 
      ? Math.round(roundY1 + Math.abs(roundY2 - roundY1) / 2)
      : Math.round(roundY2 + Math.abs(roundY1 - roundY2) / 2);

    return `M ${roundX1} ${roundY1} L ${exitX} ${roundY1} L ${exitX} ${midY} L ${enterX} ${midY} L ${enterX} ${roundY2} L ${roundX2} ${roundY2}`;
  }
}

export const WiresRenderer: React.FC<WiresRendererProps> = ({
  wires,
  nodes,
  selectedWireId,
  onSelectWire,
  draggingWire,
}) => {
  const getPinPos = (nodeId: string, pinId: string, isOutput: boolean) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    const pins = isOutput ? node.outputs : node.inputs;
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return null;

    return {
      x: node.x + node.width * pin.relX,
      y: node.y + node.height * pin.relY,
      val: pin.value,
    };
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
      <defs>
        {/* Filtro de glow para cables con señal ALTA (1) en rosa pastel */}
        <filter id="wire-glow-high" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f472b6" floodOpacity="0.65" />
        </filter>
        {/* Filtro de selección en lila pastel */}
        <filter id="wire-glow-selected" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#c084fc" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Renderizado de cables existentes (sin curvas) */}
      {wires.map((wire) => {
        const fromPos = getPinPos(wire.fromNodeId, wire.fromPinId, true);
        const toPos = getPinPos(wire.toNodeId, wire.toPinId, false);

        if (!fromPos || !toPos) return null;

        const isHigh = wire.value === 1 || fromPos.val === 1;
        const isSelected = wire.id === selectedWireId;

        const pathData = getOrthogonalPath(fromPos.x, fromPos.y, toPos.x, toPos.y);

        return (
          <g key={wire.id} className="cursor-pointer group">
            <path
              d={pathData}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              strokeLinecap="square"
              className="pointer-events-stroke"
              onClick={(e) => {
                e.stopPropagation();
                onSelectWire(wire.id);
              }}
            />

            {/* Trazo rectilíneo del cable en tonos pastel */}
            <path
              d={pathData}
              fill="none"
              stroke={isSelected ? '#a855f7' : isHigh ? '#ec4899' : '#d8b4e2'}
              strokeWidth={isSelected ? '3' : isHigh ? '2.5' : '2'}
              strokeLinecap="square"
              strokeLinejoin="miter"
              filter={isSelected ? 'url(#wire-glow-selected)' : isHigh ? 'url(#wire-glow-high)' : undefined}
              className="transition-colors duration-150 group-hover:stroke-[#f472b6]"
            />

            {/* Animación rectilínea de flujo de señal para nivel alto (1) */}
            {isHigh && (
              <path
                d={pathData}
                fill="none"
                stroke="#fbcfe8"
                strokeWidth="1.5"
                strokeLinecap="square"
                strokeDasharray="4 8"
                className="animate-[dash_1s_linear_infinite]"
              />
            )}
          </g>
        );
      })}

      {/* Cable en proceso de arrastre (sin curvas, ortogonal) */}
      {draggingWire && (
        <g>
          {(() => {
            const pathData = getOrthogonalPath(
              draggingWire.startX,
              draggingWire.startY,
              draggingWire.currentX,
              draggingWire.currentY
            );
            return (
              <path
                d={pathData}
                fill="none"
                stroke="#f472b6"
                strokeWidth="2.5"
                strokeLinecap="square"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            );
          })()}
        </g>
      )}
    </svg>
  );
};
