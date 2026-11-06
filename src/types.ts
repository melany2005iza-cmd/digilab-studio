/**
 * DigiLab Studio - TypeScript Types & Interfaces
 * Digital Circuit Simulator with Multilevel Hierarchical Exploration
 */

export type LogicValue = 0 | 1;

export interface Pin {
  id: string;
  name: string;
  type: 'in' | 'out';
  value: LogicValue;
  relX: number; // Percentage or absolute offset relative to node
  relY: number;
}

export interface CircuitNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: Pin[];
  outputs: Pin[];
  state?: {
    value?: LogicValue;
    color?: string;
    frequency?: number;
    inverted?: boolean;
    activeLow?: boolean;
    displayValue?: string;
    segments?: Record<string, LogicValue>;
    [key: string]: any;
  };
  customProps?: Record<string, any>;
}

export interface Wire {
  id: string;
  fromNodeId: string;
  fromPinId: string;
  toNodeId: string;
  toPinId: string;
  value?: LogicValue;
}

export interface HierarchyLevel {
  level: number;
  levelKey: string; // 'N1', 'N2', 'N3', 'N4'
  title: string;
  description: string;
  nodes: CircuitNode[];
  wires: Wire[];
}

export interface HierarchyFamily {
  id: string;
  name: string;
  msiCode: string;
  description: string;
  levels: HierarchyLevel[];
}

export interface HierarchyOriginSnapshot {
  nodes: CircuitNode[];
  wires: Wire[];
  circuitTitle: string;
  selectedNodeId: string | null;
  familyId: string;
  canvasOffset: { x: number; y: number };
  canvasZoom: number;
}

export interface HierarchyMapping {
  family: string;
  startLevel: number;
  nextLevel: number;
}

export type ActiveTool = 'select' | 'wire' | 'pan' | 'delete';

export interface DraggingWire {
  fromNodeId: string;
  fromPinId: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}
