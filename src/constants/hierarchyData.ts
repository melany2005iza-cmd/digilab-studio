/**
 * DigiLab Studio - Multilevel Hierarchical Circuit Definitions
 * 
 * MODELO DE DATOS DE JERARQUÍAS MULTINIVEL:
 * - HIERARCHY_FAMILIES: Familias ordenadas desde N1 (mayor abstracción CI MSI)
 *   hasta compuertas elementales (AND, OR, XOR, NOT).
 * - NODE_TO_HIERARCHY_MAP: Vínculo entre tipos de componentes y su familia/niveles.
 */

import { HierarchyFamily, HierarchyMapping, CircuitNode, Wire } from '../types';

/**
 * Generador auxiliar de pines para componentes
 */
export function createPin(id: string, name: string, type: 'in' | 'out', relX: number, relY: number) {
  return { id, name, type, value: 0 as const, relX, relY };
}

/**
 * ─────────────────────────────────────────────────────────────
 * 1. MODELO DE DATOS: HIERARCHY_FAMILIES
 * ─────────────────────────────────────────────────────────────
 */
export const HIERARCHY_FAMILIES: Record<string, HierarchyFamily> = {
  // ── FAMILIA 1: SUMADOR BINARIO DE 4 BITS ────────────────────
  adder_4bit: {
    id: 'adder_4bit',
    name: 'Sumador de 4 Bits',
    msiCode: 'CI 74LS283',
    description: 'Suma de dos palabras binarias de 4 bits (A y B) con acarreo entrante (Cin) y acarreo saliente (Cout).',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'N1 · Encapsulado Comercial CI 74LS283',
        description: 'Circuito Integrado MSI de 16 pines con arquitectura de acarreo anticipado (Look-Ahead Carry).',
        nodes: [
          // Entradas A (Switches)
          { id: 'sw_a0', type: 'SWITCH', label: 'A0 (1)', x: 60, y: 80, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'A0', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'sw_a1', type: 'SWITCH', label: 'A1 (0)', x: 60, y: 150, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'A1', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'sw_a2', type: 'SWITCH', label: 'A2 (1)', x: 60, y: 220, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'A2', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'sw_a3', type: 'SWITCH', label: 'A3 (0)', x: 60, y: 290, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'A3', 'out', 1, 0.5)], state: { value: 0 } },
          
          // Entradas B (Switches)
          { id: 'sw_b0', type: 'SWITCH', label: 'B0 (1)', x: 60, y: 380, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'B0', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'sw_b1', type: 'SWITCH', label: 'B1 (1)', x: 60, y: 450, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'B1', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'sw_b2', type: 'SWITCH', label: 'B2 (0)', x: 60, y: 520, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'B2', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'sw_b3', type: 'SWITCH', label: 'B3 (0)', x: 60, y: 590, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'B3', 'out', 1, 0.5)], state: { value: 0 } },

          // Entrada Cin
          { id: 'sw_cin', type: 'SWITCH', label: 'Cin (0)', x: 220, y: 30, width: 90, height: 50, inputs: [], outputs: [createPin('out', 'Cin', 'out', 1, 0.5)], state: { value: 0 } },

          // CI 74LS283
          {
            id: 'ic_74283_main',
            type: 'IC_74283',
            label: '74LS283 · 4-BIT ADDER',
            x: 280,
            y: 180,
            width: 220,
            height: 380,
            inputs: [
              createPin('in_cin', 'Cin', 'in', 0.5, 0),
              createPin('in_a0', 'A0', 'in', 0, 0.15),
              createPin('in_b0', 'B0', 'in', 0, 0.25),
              createPin('in_a1', 'A1', 'in', 0, 0.35),
              createPin('in_b1', 'B1', 'in', 0, 0.45),
              createPin('in_a2', 'A2', 'in', 0, 0.55),
              createPin('in_b2', 'B2', 'in', 0, 0.65),
              createPin('in_a3', 'A3', 'in', 0, 0.75),
              createPin('in_b3', 'B3', 'in', 0, 0.85),
            ],
            outputs: [
              createPin('out_s0', 'Σ0', 'out', 1, 0.2),
              createPin('out_s1', 'Σ1', 'out', 1, 0.35),
              createPin('out_s2', 'Σ2', 'out', 1, 0.5),
              createPin('out_s3', 'Σ3', 'out', 1, 0.65),
              createPin('out_cout', 'Cout', 'out', 1, 0.8),
            ],
          },

          // Salidas LEDs
          { id: 'led_s0', type: 'LED', label: 'Σ0 (LSB)', x: 600, y: 150, width: 80, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_s1', type: 'LED', label: 'Σ1', x: 600, y: 220, width: 80, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_s2', type: 'LED', label: 'Σ2', x: 600, y: 290, width: 80, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_s3', type: 'LED', label: 'Σ3 (MSB)', x: 600, y: 360, width: 80, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_cout', type: 'LED', label: 'Cout (Carry)', x: 600, y: 440, width: 80, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w1', fromNodeId: 'sw_cin', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_cin' },
          { id: 'w2', fromNodeId: 'sw_a0', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_a0' },
          { id: 'w3', fromNodeId: 'sw_b0', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_b0' },
          { id: 'w4', fromNodeId: 'sw_a1', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_a1' },
          { id: 'w5', fromNodeId: 'sw_b1', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_b1' },
          { id: 'w6', fromNodeId: 'sw_a2', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_a2' },
          { id: 'w7', fromNodeId: 'sw_b2', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_b2' },
          { id: 'w8', fromNodeId: 'sw_a3', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_a3' },
          { id: 'w9', fromNodeId: 'sw_b3', fromPinId: 'out', toNodeId: 'ic_74283_main', toPinId: 'in_b3' },
          { id: 'w10', fromNodeId: 'ic_74283_main', fromPinId: 'out_s0', toNodeId: 'led_s0', toPinId: 'in' },
          { id: 'w11', fromNodeId: 'ic_74283_main', fromPinId: 'out_s1', toNodeId: 'led_s1', toPinId: 'in' },
          { id: 'w12', fromNodeId: 'ic_74283_main', fromPinId: 'out_s2', toNodeId: 'led_s2', toPinId: 'in' },
          { id: 'w13', fromNodeId: 'ic_74283_main', fromPinId: 'out_s3', toNodeId: 'led_s3', toPinId: 'in' },
          { id: 'w14', fromNodeId: 'ic_74283_main', fromPinId: 'out_cout', toNodeId: 'led_cout', toPinId: 'in' },
        ],
      },
      {
        level: 2,
        levelKey: 'N2',
        title: 'N2 · 4 Sumadores Completos en Cascada (Ripple Carry)',
        description: 'Descomposición en 4 bloques Full Adder (FA0 a FA3). El acarreo Cout de cada etapa alimenta el Cin de la siguiente.',
        nodes: [
          // Entradas A & B
          { id: 'fa_sw_cin', type: 'SWITCH', label: 'Cin', x: 40, y: 40, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'Cin', 'out', 1, 0.5)], state: { value: 0 } },
          
          { id: 'fa_sw_a0', type: 'SWITCH', label: 'A0', x: 40, y: 120, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A0', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'fa_sw_b0', type: 'SWITCH', label: 'B0', x: 40, y: 180, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B0', 'out', 1, 0.5)], state: { value: 1 } },

          { id: 'fa_sw_a1', type: 'SWITCH', label: 'A1', x: 40, y: 260, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A1', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'fa_sw_b1', type: 'SWITCH', label: 'B1', x: 40, y: 320, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B1', 'out', 1, 0.5)], state: { value: 1 } },

          { id: 'fa_sw_a2', type: 'SWITCH', label: 'A2', x: 40, y: 400, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A2', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'fa_sw_b2', type: 'SWITCH', label: 'B2', x: 40, y: 460, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B2', 'out', 1, 0.5)], state: { value: 0 } },

          { id: 'fa_sw_a3', type: 'SWITCH', label: 'A3', x: 40, y: 540, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A3', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'fa_sw_b3', type: 'SWITCH', label: 'B3', x: 40, y: 600, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B3', 'out', 1, 0.5)], state: { value: 0 } },

          // 4 Bloques Full Adder
          {
            id: 'fa_node_0',
            type: 'FULL_ADDER',
            label: 'FA0 (Bit 0)',
            x: 230,
            y: 120,
            width: 140,
            height: 100,
            inputs: [createPin('a', 'A', 'in', 0, 0.25), createPin('b', 'B', 'in', 0, 0.5), createPin('cin', 'Cin', 'in', 0, 0.75)],
            outputs: [createPin('s', 'Σ', 'out', 1, 0.35), createPin('cout', 'Cout', 'out', 1, 0.7)],
          },
          {
            id: 'fa_node_1',
            type: 'FULL_ADDER',
            label: 'FA1 (Bit 1)',
            x: 230,
            y: 260,
            width: 140,
            height: 100,
            inputs: [createPin('a', 'A', 'in', 0, 0.25), createPin('b', 'B', 'in', 0, 0.5), createPin('cin', 'Cin', 'in', 0, 0.75)],
            outputs: [createPin('s', 'Σ', 'out', 1, 0.35), createPin('cout', 'Cout', 'out', 1, 0.7)],
          },
          {
            id: 'fa_node_2',
            type: 'FULL_ADDER',
            label: 'FA2 (Bit 2)',
            x: 230,
            y: 400,
            width: 140,
            height: 100,
            inputs: [createPin('a', 'A', 'in', 0, 0.25), createPin('b', 'B', 'in', 0, 0.5), createPin('cin', 'Cin', 'in', 0, 0.75)],
            outputs: [createPin('s', 'Σ', 'out', 1, 0.35), createPin('cout', 'Cout', 'out', 1, 0.7)],
          },
          {
            id: 'fa_node_3',
            type: 'FULL_ADDER',
            label: 'FA3 (Bit 3)',
            x: 230,
            y: 540,
            width: 140,
            height: 100,
            inputs: [createPin('a', 'A', 'in', 0, 0.25), createPin('b', 'B', 'in', 0, 0.5), createPin('cin', 'Cin', 'in', 0, 0.75)],
            outputs: [createPin('s', 'Σ', 'out', 1, 0.35), createPin('cout', 'Cout', 'out', 1, 0.7)],
          },

          // Salidas LEDs
          { id: 'fa_led_s0', type: 'LED', label: 'Σ0', x: 500, y: 130, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'fa_led_s1', type: 'LED', label: 'Σ1', x: 500, y: 270, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'fa_led_s2', type: 'LED', label: 'Σ2', x: 500, y: 410, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'fa_led_s3', type: 'LED', label: 'Σ3', x: 500, y: 550, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'fa_led_cout', type: 'LED', label: 'Cout final', x: 500, y: 620, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_fa_cin', fromNodeId: 'fa_sw_cin', fromPinId: 'out', toNodeId: 'fa_node_0', toPinId: 'cin' },
          { id: 'w_fa_a0', fromNodeId: 'fa_sw_a0', fromPinId: 'out', toNodeId: 'fa_node_0', toPinId: 'a' },
          { id: 'w_fa_b0', fromNodeId: 'fa_sw_b0', fromPinId: 'out', toNodeId: 'fa_node_0', toPinId: 'b' },
          { id: 'w_fa_s0', fromNodeId: 'fa_node_0', fromPinId: 's', toNodeId: 'fa_led_s0', toPinId: 'in' },
          
          // Carry FA0 -> FA1
          { id: 'w_fa_c0', fromNodeId: 'fa_node_0', fromPinId: 'cout', toNodeId: 'fa_node_1', toPinId: 'cin' },
          { id: 'w_fa_a1', fromNodeId: 'fa_sw_a1', fromPinId: 'out', toNodeId: 'fa_node_1', toPinId: 'a' },
          { id: 'w_fa_b1', fromNodeId: 'fa_sw_b1', fromPinId: 'out', toNodeId: 'fa_node_1', toPinId: 'b' },
          { id: 'w_fa_s1', fromNodeId: 'fa_node_1', fromPinId: 's', toNodeId: 'fa_led_s1', toPinId: 'in' },

          // Carry FA1 -> FA2
          { id: 'w_fa_c1', fromNodeId: 'fa_node_1', fromPinId: 'cout', toNodeId: 'fa_node_2', toPinId: 'cin' },
          { id: 'w_fa_a2', fromNodeId: 'fa_sw_a2', fromPinId: 'out', toNodeId: 'fa_node_2', toPinId: 'a' },
          { id: 'w_fa_b2', fromNodeId: 'fa_sw_b2', fromPinId: 'out', toNodeId: 'fa_node_2', toPinId: 'b' },
          { id: 'w_fa_s2', fromNodeId: 'fa_node_2', fromPinId: 's', toNodeId: 'fa_led_s2', toPinId: 'in' },

          // Carry FA2 -> FA3
          { id: 'w_fa_c2', fromNodeId: 'fa_node_2', fromPinId: 'cout', toNodeId: 'fa_node_3', toPinId: 'cin' },
          { id: 'w_fa_a3', fromNodeId: 'fa_sw_a3', fromPinId: 'out', toNodeId: 'fa_node_3', toPinId: 'a' },
          { id: 'w_fa_b3', fromNodeId: 'fa_sw_b3', fromPinId: 'out', toNodeId: 'fa_node_3', toPinId: 'b' },
          { id: 'w_fa_s3', fromNodeId: 'fa_node_3', fromPinId: 's', toNodeId: 'fa_led_s3', toPinId: 'in' },

          // Carry final FA3 -> LED
          { id: 'w_fa_c3', fromNodeId: 'fa_node_3', fromPinId: 'cout', toNodeId: 'fa_led_cout', toPinId: 'in' },
        ],
      },
      {
        level: 3,
        levelKey: 'N3',
        title: 'N3 · Sumador Completo (2 Medios Sumadores + OR)',
        description: 'Estructura interna de 1 bit: dos Half Adders encadenados. HA1 procesa A y B; HA2 procesa la suma intermedia con Cin; la compuerta OR combina ambos acarreos.',
        nodes: [
          { id: 'n3_sw_a', type: 'SWITCH', label: 'A (Entrada)', x: 60, y: 120, width: 95, height: 48, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'n3_sw_b', type: 'SWITCH', label: 'B (Entrada)', x: 60, y: 190, width: 95, height: 48, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'n3_sw_cin', type: 'SWITCH', label: 'Cin (Acarreo)', x: 60, y: 320, width: 95, height: 48, inputs: [], outputs: [createPin('out', 'Cin', 'out', 1, 0.5)], state: { value: 0 } },

          // HA1
          {
            id: 'n3_ha1',
            type: 'HALF_ADDER',
            label: 'HA 1 (Medio Sumador)',
            x: 230,
            y: 120,
            width: 140,
            height: 90,
            inputs: [createPin('a', 'A', 'in', 0, 0.3), createPin('b', 'B', 'in', 0, 0.7)],
            outputs: [createPin('s', 'Σ1', 'out', 1, 0.3), createPin('c', 'C1', 'out', 1, 0.7)],
          },

          // HA2
          {
            id: 'n3_ha2',
            type: 'HALF_ADDER',
            label: 'HA 2 (Medio Sumador)',
            x: 430,
            y: 180,
            width: 140,
            height: 90,
            inputs: [createPin('a', 'Σ1', 'in', 0, 0.3), createPin('b', 'Cin', 'in', 0, 0.7)],
            outputs: [createPin('s', 'Σ Final', 'out', 1, 0.3), createPin('c', 'C2', 'out', 1, 0.7)],
          },

          // Compuerta OR
          {
            id: 'n3_gate_or',
            type: 'OR',
            label: 'OR (Acarreo)',
            x: 620,
            y: 280,
            width: 100,
            height: 70,
            inputs: [createPin('in1', 'C1', 'in', 0, 0.3), createPin('in2', 'C2', 'in', 0, 0.7)],
            outputs: [createPin('out', 'Cout', 'out', 1, 0.5)],
          },

          // LEDs Salida
          { id: 'n3_led_sum', type: 'LED', label: 'Σ (Suma)', x: 770, y: 190, width: 85, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'n3_led_cout', type: 'LED', label: 'Cout', x: 770, y: 290, width: 85, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_n3_1', fromNodeId: 'n3_sw_a', fromPinId: 'out', toNodeId: 'n3_ha1', toPinId: 'a' },
          { id: 'w_n3_2', fromNodeId: 'n3_sw_b', fromPinId: 'out', toNodeId: 'n3_ha1', toPinId: 'b' },
          { id: 'w_n3_3', fromNodeId: 'n3_ha1', fromPinId: 's', toNodeId: 'n3_ha2', toPinId: 'a' },
          { id: 'w_n3_4', fromNodeId: 'n3_sw_cin', fromPinId: 'out', toNodeId: 'n3_ha2', toPinId: 'b' },
          { id: 'w_n3_5', fromNodeId: 'n3_ha2', fromPinId: 's', toNodeId: 'n3_led_sum', toPinId: 'in' },
          { id: 'w_n3_6', fromNodeId: 'n3_ha1', fromPinId: 'c', toNodeId: 'n3_gate_or', toPinId: 'in1' },
          { id: 'w_n3_7', fromNodeId: 'n3_ha2', fromPinId: 'c', toNodeId: 'n3_gate_or', toPinId: 'in2' },
          { id: 'w_n3_8', fromNodeId: 'n3_gate_or', fromPinId: 'out', toNodeId: 'n3_led_cout', toPinId: 'in' },
        ],
      },
      {
        level: 4,
        levelKey: 'N4',
        title: 'N4 · Nivel Compuertas Elementales (XOR, AND, OR)',
        description: 'Implementación a nivel de transistores/compuertas básicas. Σ = A ⊕ B ⊕ Cin; Cout = (A·B) + Cin·(A ⊕ B).',
        nodes: [
          { id: 'n4_sw_a', type: 'SWITCH', label: 'A', x: 50, y: 100, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'n4_sw_b', type: 'SWITCH', label: 'B', x: 50, y: 180, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'n4_sw_cin', type: 'SWITCH', label: 'Cin', x: 50, y: 280, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'Cin', 'out', 1, 0.5)], state: { value: 0 } },

          // XOR 1: A ^ B
          { id: 'n4_xor1', type: 'XOR', label: 'XOR 1', x: 230, y: 120, width: 100, height: 60, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'A⊕B', 'out', 1, 0.5)] },
          // AND 1: A & B
          { id: 'n4_and1', type: 'AND', label: 'AND 1', x: 230, y: 240, width: 100, height: 60, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'A·B', 'out', 1, 0.5)] },

          // XOR 2: (A ^ B) ^ Cin -> Sum
          { id: 'n4_xor2', type: 'XOR', label: 'XOR 2 (Σ)', x: 440, y: 140, width: 100, height: 60, inputs: [createPin('in1', 'A⊕B', 'in', 0, 0.3), createPin('in2', 'Cin', 'in', 0, 0.7)], outputs: [createPin('out', 'Σ', 'out', 1, 0.5)] },
          // AND 2: (A ^ B) & Cin
          { id: 'n4_and2', type: 'AND', label: 'AND 2', x: 440, y: 320, width: 100, height: 60, inputs: [createPin('in1', 'A⊕B', 'in', 0, 0.3), createPin('in2', 'Cin', 'in', 0, 0.7)], outputs: [createPin('out', 'Cin·(A⊕B)', 'out', 1, 0.5)] },

          // OR 1: (A & B) | ((A ^ B) & Cin) -> Cout
          { id: 'n4_or1', type: 'OR', label: 'OR (Cout)', x: 630, y: 270, width: 100, height: 60, inputs: [createPin('in1', 'C1', 'in', 0, 0.3), createPin('in2', 'C2', 'in', 0, 0.7)], outputs: [createPin('out', 'Cout', 'out', 1, 0.5)] },

          // LEDs Salida
          { id: 'n4_led_sum', type: 'LED', label: 'Σ (Suma)', x: 650, y: 140, width: 85, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'n4_led_cout', type: 'LED', label: 'Cout', x: 790, y: 275, width: 85, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_n4_1', fromNodeId: 'n4_sw_a', fromPinId: 'out', toNodeId: 'n4_xor1', toPinId: 'in1' },
          { id: 'w_n4_2', fromNodeId: 'n4_sw_b', fromPinId: 'out', toNodeId: 'n4_xor1', toPinId: 'in2' },
          { id: 'w_n4_3', fromNodeId: 'n4_sw_a', fromPinId: 'out', toNodeId: 'n4_and1', toPinId: 'in1' },
          { id: 'w_n4_4', fromNodeId: 'n4_sw_b', fromPinId: 'out', toNodeId: 'n4_and1', toPinId: 'in2' },

          { id: 'w_n4_5', fromNodeId: 'n4_xor1', fromPinId: 'out', toNodeId: 'n4_xor2', toPinId: 'in1' },
          { id: 'w_n4_6', fromNodeId: 'n4_sw_cin', fromPinId: 'out', toNodeId: 'n4_xor2', toPinId: 'in2' },
          { id: 'w_n4_7', fromNodeId: 'n4_xor2', fromPinId: 'out', toNodeId: 'n4_led_sum', toPinId: 'in' },

          { id: 'w_n4_8', fromNodeId: 'n4_xor1', fromPinId: 'out', toNodeId: 'n4_and2', toPinId: 'in1' },
          { id: 'w_n4_9', fromNodeId: 'n4_sw_cin', fromPinId: 'out', toNodeId: 'n4_and2', toPinId: 'in2' },

          { id: 'w_n4_10', fromNodeId: 'n4_and1', fromPinId: 'out', toNodeId: 'n4_or1', toPinId: 'in1' },
          { id: 'w_n4_11', fromNodeId: 'n4_and2', fromPinId: 'out', toNodeId: 'n4_or1', toPinId: 'in2' },
          { id: 'w_n4_12', fromNodeId: 'n4_or1', fromPinId: 'out', toNodeId: 'n4_led_cout', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── FAMILIA 2: DECODIFICADOR BCD A 7 SEGMENTOS ───────────────
  bcd_7seg: {
    id: 'bcd_7seg',
    name: 'Decodificador BCD a 7 Segmentos',
    msiCode: 'CI 74LS47',
    description: 'Convierte código binario BCD de 4 bits (A, B, C, D) en las 7 señales de control de cátodo/ánodo para segmentos a–g.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'N1 · Encapsulado CI 74LS47 con Display 7 Segmentos',
        description: 'Decodificador BCD comercial con salidas activas en bajo y entradas de prueba de lámpara (LT) y blanking (RBI/BI).',
        nodes: [
          // Entradas BCD (D es MSB, A es LSB)
          { id: 'bcd_sw_a', type: 'SWITCH', label: 'A (LSB, 2⁰)', x: 60, y: 130, width: 100, height: 48, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'bcd_sw_b', type: 'SWITCH', label: 'B (2¹)', x: 60, y: 210, width: 100, height: 48, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'bcd_sw_c', type: 'SWITCH', label: 'C (2²)', x: 60, y: 290, width: 100, height: 48, inputs: [], outputs: [createPin('out', 'C', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'bcd_sw_d', type: 'SWITCH', label: 'D (MSB, 2³)', x: 60, y: 370, width: 100, height: 48, inputs: [], outputs: [createPin('out', 'D', 'out', 1, 0.5)], state: { value: 0 } },

          // CI 74LS47
          {
            id: 'ic_7447_main',
            type: 'BCD_7SEG',
            label: '74LS47 · BCD TO 7-SEG',
            x: 260,
            y: 120,
            width: 190,
            height: 330,
            inputs: [
              createPin('a', 'A (2⁰)', 'in', 0, 0.2),
              createPin('b', 'B (2¹)', 'in', 0, 0.4),
              createPin('c', 'C (2²)', 'in', 0, 0.6),
              createPin('d', 'D (2³)', 'in', 0, 0.8),
            ],
            outputs: [
              createPin('qa', 'a', 'out', 1, 0.15),
              createPin('qb', 'b', 'out', 1, 0.27),
              createPin('qc', 'c', 'out', 1, 0.39),
              createPin('qd', 'd', 'out', 1, 0.51),
              createPin('qe', 'e', 'out', 1, 0.63),
              createPin('qf', 'f', 'out', 1, 0.75),
              createPin('qg', 'g', 'out', 1, 0.87),
            ],
          },

          // Display 7 Segmentos
          {
            id: 'disp_7seg',
            type: 'SEVEN_SEG',
            label: 'Display 7-Seg',
            x: 550,
            y: 150,
            width: 140,
            height: 220,
            inputs: [
              createPin('sa', 'a', 'in', 0, 0.15),
              createPin('sb', 'b', 'in', 0, 0.27),
              createPin('sc', 'c', 'in', 0, 0.39),
              createPin('sd', 'd', 'in', 0, 0.51),
              createPin('se', 'e', 'in', 0, 0.63),
              createPin('sf', 'f', 'in', 0, 0.75),
              createPin('sg', 'g', 'in', 0, 0.87),
            ],
            outputs: [],
          },
        ],
        wires: [
          { id: 'w_b1', fromNodeId: 'bcd_sw_a', fromPinId: 'out', toNodeId: 'ic_7447_main', toPinId: 'a' },
          { id: 'w_b2', fromNodeId: 'bcd_sw_b', fromPinId: 'out', toNodeId: 'ic_7447_main', toPinId: 'b' },
          { id: 'w_b3', fromNodeId: 'bcd_sw_c', fromPinId: 'out', toNodeId: 'ic_7447_main', toPinId: 'c' },
          { id: 'w_b4', fromNodeId: 'bcd_sw_d', fromPinId: 'out', toNodeId: 'ic_7447_main', toPinId: 'd' },

          { id: 'w_b5', fromNodeId: 'ic_7447_main', fromPinId: 'qa', toNodeId: 'disp_7seg', toPinId: 'sa' },
          { id: 'w_b6', fromNodeId: 'ic_7447_main', fromPinId: 'qb', toNodeId: 'disp_7seg', toPinId: 'sb' },
          { id: 'w_b7', fromNodeId: 'ic_7447_main', fromPinId: 'qc', toNodeId: 'disp_7seg', toPinId: 'sc' },
          { id: 'w_b8', fromNodeId: 'ic_7447_main', fromPinId: 'qd', toNodeId: 'disp_7seg', toPinId: 'sd' },
          { id: 'w_b9', fromNodeId: 'ic_7447_main', fromPinId: 'qe', toNodeId: 'disp_7seg', toPinId: 'se' },
          { id: 'w_b10', fromNodeId: 'ic_7447_main', fromPinId: 'qf', toNodeId: 'disp_7seg', toPinId: 'sf' },
          { id: 'w_b11', fromNodeId: 'ic_7447_main', fromPinId: 'qg', toNodeId: 'disp_7seg', toPinId: 'sg' },
        ],
      },
      {
        level: 2,
        levelKey: 'N2',
        title: 'N2 · Red Combinacional SOP (Suma de Productos)',
        description: 'Matriz lógica de minitérminos simplificados por Mapas de Karnaugh para sintetizar las funciones de los segmentos a, b, c, d, e, f, g a partir de A, B, C, D.',
        nodes: [
          // Entradas BCD
          { id: 'sop_sw_a', type: 'SWITCH', label: 'A', x: 50, y: 100, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'sop_sw_b', type: 'SWITCH', label: 'B', x: 50, y: 180, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'sop_sw_c', type: 'SWITCH', label: 'C', x: 50, y: 260, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'C', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'sop_sw_d', type: 'SWITCH', label: 'D', x: 50, y: 340, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'D', 'out', 1, 0.5)], state: { value: 0 } },

          // Inversores NOT
          { id: 'sop_not_a', type: 'NOT', label: 'NOT A', x: 180, y: 100, width: 80, height: 45, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', '~A', 'out', 1, 0.5)] },
          { id: 'sop_not_b', type: 'NOT', label: 'NOT B', x: 180, y: 180, width: 80, height: 45, inputs: [createPin('in', 'B', 'in', 0, 0.5)], outputs: [createPin('out', '~B', 'out', 1, 0.5)] },
          { id: 'sop_not_c', type: 'NOT', label: 'NOT C', x: 180, y: 260, width: 80, height: 45, inputs: [createPin('in', 'C', 'in', 0, 0.5)], outputs: [createPin('out', '~C', 'out', 1, 0.5)] },

          // Generadores de Segmentos (Compuertas lógicas representativas de los minitérminos)
          { id: 'sop_gate_a', type: 'OR', label: 'Seg a: A+C+(B⊕D)', x: 380, y: 80, width: 110, height: 55, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', 'C', 'in', 0, 0.7)], outputs: [createPin('out', 'a', 'out', 1, 0.5)] },
          { id: 'sop_gate_b', type: 'OR', label: 'Seg b: ~B+(~C·~D)', x: 380, y: 160, width: 110, height: 55, inputs: [createPin('i1', '~B', 'in', 0, 0.3), createPin('i2', 'A', 'in', 0, 0.7)], outputs: [createPin('out', 'b', 'out', 1, 0.5)] },
          { id: 'sop_gate_c', type: 'OR', label: 'Seg c: B+~C+A', x: 380, y: 240, width: 110, height: 55, inputs: [createPin('i1', 'B', 'in', 0, 0.3), createPin('i2', '~C', 'in', 0, 0.7)], outputs: [createPin('out', 'c', 'out', 1, 0.5)] },
          { id: 'sop_gate_d', type: 'OR', label: 'Seg d: A+~B·C', x: 380, y: 320, width: 110, height: 55, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', 'C', 'in', 0, 0.7)], outputs: [createPin('out', 'd', 'out', 1, 0.5)] },
          { id: 'sop_gate_e', type: 'AND', label: 'Seg e: ~A·(B+~C)', x: 380, y: 400, width: 110, height: 55, inputs: [createPin('i1', '~A', 'in', 0, 0.3), createPin('i2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'e', 'out', 1, 0.5)] },
          { id: 'sop_gate_f', type: 'OR', label: 'Seg f: A+(~B·~C)', x: 380, y: 480, width: 110, height: 55, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', '~B', 'in', 0, 0.7)], outputs: [createPin('out', 'f', 'out', 1, 0.5)] },
          { id: 'sop_gate_g', type: 'OR', label: 'Seg g: A+(B⊕C)', x: 380, y: 560, width: 110, height: 55, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', 'C', 'in', 0, 0.7)], outputs: [createPin('out', 'g', 'out', 1, 0.5)] },

          // Display final conectado a las líneas sintetizadas
          {
            id: 'sop_disp',
            type: 'SEVEN_SEG',
            label: 'Display 7-Seg',
            x: 620,
            y: 240,
            width: 140,
            height: 220,
            inputs: [
              createPin('sa', 'a', 'in', 0, 0.15),
              createPin('sb', 'b', 'in', 0, 0.27),
              createPin('sc', 'c', 'in', 0, 0.39),
              createPin('sd', 'd', 'in', 0, 0.51),
              createPin('se', 'e', 'in', 0, 0.63),
              createPin('sf', 'f', 'in', 0, 0.75),
              createPin('sg', 'g', 'in', 0, 0.87),
            ],
            outputs: [],
          },
        ],
        wires: [
          { id: 'w_sop1', fromNodeId: 'sop_sw_a', fromPinId: 'out', toNodeId: 'sop_not_a', toPinId: 'in' },
          { id: 'w_sop2', fromNodeId: 'sop_sw_b', fromPinId: 'out', toNodeId: 'sop_not_b', toPinId: 'in' },
          { id: 'w_sop3', fromNodeId: 'sop_sw_c', fromPinId: 'out', toNodeId: 'sop_not_c', toPinId: 'in' },

          { id: 'w_sop4', fromNodeId: 'sop_sw_a', fromPinId: 'out', toNodeId: 'sop_gate_a', toPinId: 'i1' },
          { id: 'w_sop5', fromNodeId: 'sop_sw_c', fromPinId: 'out', toNodeId: 'sop_gate_a', toPinId: 'i2' },
          { id: 'w_sop6', fromNodeId: 'sop_gate_a', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'sa' },

          { id: 'w_sop7', fromNodeId: 'sop_not_b', fromPinId: 'out', toNodeId: 'sop_gate_b', toPinId: 'i1' },
          { id: 'w_sop8', fromNodeId: 'sop_sw_a', fromPinId: 'out', toNodeId: 'sop_gate_b', toPinId: 'i2' },
          { id: 'w_sop9', fromNodeId: 'sop_gate_b', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'sb' },

          { id: 'w_sop10', fromNodeId: 'sop_sw_b', fromPinId: 'out', toNodeId: 'sop_gate_c', toPinId: 'i1' },
          { id: 'w_sop11', fromNodeId: 'sop_not_c', fromPinId: 'out', toNodeId: 'sop_gate_c', toPinId: 'i2' },
          { id: 'w_sop12', fromNodeId: 'sop_gate_c', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'sc' },

          { id: 'w_sop13', fromNodeId: 'sop_sw_a', fromPinId: 'out', toNodeId: 'sop_gate_d', toPinId: 'i1' },
          { id: 'w_sop14', fromNodeId: 'sop_sw_c', fromPinId: 'out', toNodeId: 'sop_gate_d', toPinId: 'i2' },
          { id: 'w_sop15', fromNodeId: 'sop_gate_d', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'sd' },

          { id: 'w_sop16', fromNodeId: 'sop_not_a', fromPinId: 'out', toNodeId: 'sop_gate_e', toPinId: 'i1' },
          { id: 'w_sop17', fromNodeId: 'sop_sw_b', fromPinId: 'out', toNodeId: 'sop_gate_e', toPinId: 'i2' },
          { id: 'w_sop18', fromNodeId: 'sop_gate_e', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'se' },

          { id: 'w_sop19', fromNodeId: 'sop_sw_a', fromPinId: 'out', toNodeId: 'sop_gate_f', toPinId: 'i1' },
          { id: 'w_sop20', fromNodeId: 'sop_not_b', fromPinId: 'out', toNodeId: 'sop_gate_f', toPinId: 'i2' },
          { id: 'w_sop21', fromNodeId: 'sop_gate_f', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'sf' },

          { id: 'w_sop22', fromNodeId: 'sop_sw_a', fromPinId: 'out', toNodeId: 'sop_gate_g', toPinId: 'i1' },
          { id: 'w_sop23', fromNodeId: 'sop_sw_c', fromPinId: 'out', toNodeId: 'sop_gate_g', toPinId: 'i2' },
          { id: 'w_sop24', fromNodeId: 'sop_gate_g', fromPinId: 'out', toNodeId: 'sop_disp', toPinId: 'sg' },
        ],
      },
    ],
  },

  // ── FAMILIA 3: DECODIFICADOR 4 A 16 ──────────────────────────
  dec_4_16: {
    id: 'dec_4_16',
    name: 'Decodificador 4 a 16',
    msiCode: 'CI 74LS154',
    description: 'Decodifica 4 entradas binarias en 16 salidas mutuamente excluyentes con entradas de habilitación.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'N1 · Encapsulado Comercial CI 74LS154 (DIP 24)',
        description: 'Circuito integrado MSI de 24 pines con 4 líneas de dirección (A, B, C, D) y 16 salidas activas.',
        nodes: [
          { id: 'dec_sw_a', type: 'SWITCH', label: 'A (LSB)', x: 60, y: 140, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'dec_sw_b', type: 'SWITCH', label: 'B', x: 60, y: 210, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'dec_sw_c', type: 'SWITCH', label: 'C', x: 60, y: 280, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'C', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'dec_sw_d', type: 'SWITCH', label: 'D (MSB)', x: 60, y: 350, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'D', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'dec_sw_en', type: 'SWITCH', label: 'EN (Habilitar)', x: 60, y: 430, width: 95, height: 45, inputs: [], outputs: [createPin('out', 'EN', 'out', 1, 0.5)], state: { value: 1 } },

          // CI 74LS154
          {
            id: 'ic_74154_main',
            type: 'IC_74154',
            label: '74LS154 · 4:16 DECODER',
            x: 240,
            y: 120,
            width: 200,
            height: 380,
            inputs: [
              createPin('a', 'A', 'in', 0, 0.2),
              createPin('b', 'B', 'in', 0, 0.35),
              createPin('c', 'C', 'in', 0, 0.5),
              createPin('d', 'D', 'in', 0, 0.65),
              createPin('en', 'EN', 'in', 0, 0.8),
            ],
            outputs: Array.from({ length: 16 }, (_, i) => 
              createPin(`y${i}`, `Y${i}`, 'out', 1, (i + 0.5) / 16)
            ),
          },

          // LEDs para las salidas representativas (Y0 a Y7, Y5 activa)
          { id: 'led_y0', type: 'LED', label: 'Y0', x: 520, y: 130, width: 65, height: 40, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_y1', type: 'LED', label: 'Y1', x: 520, y: 180, width: 65, height: 40, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_y5', type: 'LED', label: 'Y5 (Activa)', x: 520, y: 240, width: 85, height: 40, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_y10', type: 'LED', label: 'Y10', x: 520, y: 310, width: 65, height: 40, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'led_y15', type: 'LED', label: 'Y15', x: 520, y: 380, width: 65, height: 40, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_dec1', fromNodeId: 'dec_sw_a', fromPinId: 'out', toNodeId: 'ic_74154_main', toPinId: 'a' },
          { id: 'w_dec2', fromNodeId: 'dec_sw_b', fromPinId: 'out', toNodeId: 'ic_74154_main', toPinId: 'b' },
          { id: 'w_dec3', fromNodeId: 'dec_sw_c', fromPinId: 'out', toNodeId: 'ic_74154_main', toPinId: 'c' },
          { id: 'w_dec4', fromNodeId: 'dec_sw_d', fromPinId: 'out', toNodeId: 'ic_74154_main', toPinId: 'd' },
          { id: 'w_dec5', fromNodeId: 'dec_sw_en', fromPinId: 'out', toNodeId: 'ic_74154_main', toPinId: 'en' },
          { id: 'w_dec_y0', fromNodeId: 'ic_74154_main', fromPinId: 'y0', toNodeId: 'led_y0', toPinId: 'in' },
          { id: 'w_dec_y1', fromNodeId: 'ic_74154_main', fromPinId: 'y1', toNodeId: 'led_y1', toPinId: 'in' },
          { id: 'w_dec_y5', fromNodeId: 'ic_74154_main', fromPinId: 'y5', toNodeId: 'led_y5', toPinId: 'in' },
          { id: 'w_dec_y10', fromNodeId: 'ic_74154_main', fromPinId: 'y10', toNodeId: 'led_y10', toPinId: 'in' },
          { id: 'w_dec_y15', fromNodeId: 'ic_74154_main', fromPinId: 'y15', toNodeId: 'led_y15', toPinId: 'in' },
        ],
      },
      {
        level: 2,
        levelKey: 'N2',
        title: 'N2 · Árbol de 5 Decodificadores 2:4 con Enable',
        description: 'Jerarquía modular: 1 decodificador primario (entradas C y D) selecciona cuál de los 4 decodificadores secundarios (entradas A y B) se activa.',
        nodes: [
          // Entradas
          { id: 'tree_sw_c', type: 'SWITCH', label: 'C', x: 40, y: 100, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'C', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'tree_sw_d', type: 'SWITCH', label: 'D', x: 40, y: 170, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'D', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'tree_sw_a', type: 'SWITCH', label: 'A', x: 40, y: 310, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'tree_sw_b', type: 'SWITCH', label: 'B', x: 40, y: 380, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },

          // Decodificador Primario (habilitador)
          {
            id: 'tree_dec_root',
            type: 'DEC_2_4',
            label: 'DEC Primario (C, D)',
            x: 180,
            y: 90,
            width: 150,
            height: 140,
            inputs: [createPin('in0', 'C', 'in', 0, 0.3), createPin('in1', 'D', 'in', 0, 0.6), createPin('en', 'EN', 'in', 0, 0.85)],
            outputs: [createPin('y0', 'EN0 (0-3)', 'out', 1, 0.2), createPin('y1', 'EN1 (4-7)', 'out', 1, 0.4), createPin('y2', 'EN2 (8-11)', 'out', 1, 0.6), createPin('y3', 'EN3 (12-15)', 'out', 1, 0.8)],
          },

          // 4 Decodificadores Secundarios
          {
            id: 'tree_dec_sec0',
            type: 'DEC_2_4',
            label: 'DEC Sec 0 (Y0-Y3)',
            x: 420,
            y: 60,
            width: 140,
            height: 110,
            inputs: [createPin('in0', 'A', 'in', 0, 0.3), createPin('in1', 'B', 'in', 0, 0.5), createPin('en', 'EN', 'in', 0, 0.75)],
            outputs: [createPin('y0', 'Y0', 'out', 1, 0.2), createPin('y1', 'Y1', 'out', 1, 0.4), createPin('y2', 'Y2', 'out', 1, 0.6), createPin('y3', 'Y3', 'out', 1, 0.8)],
          },
          {
            id: 'tree_dec_sec1',
            type: 'DEC_2_4',
            label: 'DEC Sec 1 (Y4-Y7)',
            x: 420,
            y: 200,
            width: 140,
            height: 110,
            inputs: [createPin('in0', 'A', 'in', 0, 0.3), createPin('in1', 'B', 'in', 0, 0.5), createPin('en', 'EN', 'in', 0, 0.75)],
            outputs: [createPin('y0', 'Y4', 'out', 1, 0.2), createPin('y1', 'Y5', 'out', 1, 0.4), createPin('y2', 'Y6', 'out', 1, 0.6), createPin('y3', 'Y7', 'out', 1, 0.8)],
          },
          {
            id: 'tree_dec_sec2',
            type: 'DEC_2_4',
            label: 'DEC Sec 2 (Y8-Y11)',
            x: 420,
            y: 340,
            width: 140,
            height: 110,
            inputs: [createPin('in0', 'A', 'in', 0, 0.3), createPin('in1', 'B', 'in', 0, 0.5), createPin('en', 'EN', 'in', 0, 0.75)],
            outputs: [createPin('y0', 'Y8', 'out', 1, 0.2), createPin('y1', 'Y9', 'out', 1, 0.4), createPin('y2', 'Y10', 'out', 1, 0.6), createPin('y3', 'Y11', 'out', 1, 0.8)],
          },
          {
            id: 'tree_dec_sec3',
            type: 'DEC_2_4',
            label: 'DEC Sec 3 (Y12-Y15)',
            x: 420,
            y: 480,
            width: 140,
            height: 110,
            inputs: [createPin('in0', 'A', 'in', 0, 0.3), createPin('in1', 'B', 'in', 0, 0.5), createPin('en', 'EN', 'in', 0, 0.75)],
            outputs: [createPin('y0', 'Y12', 'out', 1, 0.2), createPin('y1', 'Y13', 'out', 1, 0.4), createPin('y2', 'Y14', 'out', 1, 0.6), createPin('y3', 'Y15', 'out', 1, 0.8)],
          },

          // LED indicador para Y5
          { id: 'tree_led_y5', type: 'LED', label: 'Salida Y5 (Activa)', x: 640, y: 235, width: 110, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_t1', fromNodeId: 'tree_sw_c', fromPinId: 'out', toNodeId: 'tree_dec_root', toPinId: 'in0' },
          { id: 'w_t2', fromNodeId: 'tree_sw_d', fromPinId: 'out', toNodeId: 'tree_dec_root', toPinId: 'in1' },
          
          // Habilitaciones de salida del root a los secundarios
          { id: 'w_t3', fromNodeId: 'tree_dec_root', fromPinId: 'y0', toNodeId: 'tree_dec_sec0', toPinId: 'en' },
          { id: 'w_t4', fromNodeId: 'tree_dec_root', fromPinId: 'y1', toNodeId: 'tree_dec_sec1', toPinId: 'en' },
          { id: 'w_t5', fromNodeId: 'tree_dec_root', fromPinId: 'y2', toNodeId: 'tree_dec_sec2', toPinId: 'en' },
          { id: 'w_t6', fromNodeId: 'tree_dec_root', fromPinId: 'y3', toNodeId: 'tree_dec_sec3', toPinId: 'en' },

          // Bus A y B a los secundarios
          { id: 'w_t7', fromNodeId: 'tree_sw_a', fromPinId: 'out', toNodeId: 'tree_dec_sec1', toPinId: 'in0' },
          { id: 'w_t8', fromNodeId: 'tree_sw_b', fromPinId: 'out', toNodeId: 'tree_dec_sec1', toPinId: 'in1' },

          // Salida Y5
          { id: 'w_t9', fromNodeId: 'tree_dec_sec1', fromPinId: 'y1', toNodeId: 'tree_led_y5', toPinId: 'in' },
        ],
      },
      {
        level: 3,
        levelKey: 'N3',
        title: 'N3 · Interior del Decodificador 2:4 (Compuertas NOT y AND)',
        description: 'Estructura atómica: dos compuertas NOT generan las combinaciones complementarias ~A y ~B, y 4 compuertas AND decodifican los 4 minitérminos condicionados por Enable.',
        nodes: [
          { id: 'd24_sw_a', type: 'SWITCH', label: 'Entrada A (LSB)', x: 50, y: 120, width: 105, height: 48, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'd24_sw_b', type: 'SWITCH', label: 'Entrada B (MSB)', x: 50, y: 220, width: 105, height: 48, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'd24_sw_en', type: 'SWITCH', label: 'Enable (EN)', x: 50, y: 340, width: 105, height: 48, inputs: [], outputs: [createPin('out', 'EN', 'out', 1, 0.5)], state: { value: 1 } },

          // Inversores NOT
          { id: 'd24_not_a', type: 'NOT', label: 'NOT A', x: 200, y: 120, width: 75, height: 45, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', '~A', 'out', 1, 0.5)] },
          { id: 'd24_not_b', type: 'NOT', label: 'NOT B', x: 200, y: 220, width: 75, height: 45, inputs: [createPin('in', 'B', 'in', 0, 0.5)], outputs: [createPin('out', '~B', 'out', 1, 0.5)] },

          // 4 ANDs (decodificación de minitérminos)
          { id: 'd24_and0', type: 'AND', label: 'AND 0 (~A·~B)', x: 380, y: 80, width: 105, height: 55, inputs: [createPin('i1', '~A', 'in', 0, 0.3), createPin('i2', '~B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y0', 'out', 1, 0.5)] },
          { id: 'd24_and1', type: 'AND', label: 'AND 1 (A·~B)', x: 380, y: 170, width: 105, height: 55, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', '~B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y1', 'out', 1, 0.5)] },
          { id: 'd24_and2', type: 'AND', label: 'AND 2 (~A·B)', x: 380, y: 260, width: 105, height: 55, inputs: [createPin('i1', '~A', 'in', 0, 0.3), createPin('i2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y2', 'out', 1, 0.5)] },
          { id: 'd24_and3', type: 'AND', label: 'AND 3 (A·B)', x: 380, y: 350, width: 105, height: 55, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y3', 'out', 1, 0.5)] },

          // LEDs Salida
          { id: 'd24_led_y0', type: 'LED', label: 'Y0 (00)', x: 550, y: 85, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'd24_led_y1', type: 'LED', label: 'Y1 (01)', x: 550, y: 175, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'd24_led_y2', type: 'LED', label: 'Y2 (10)', x: 550, y: 265, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'd24_led_y3', type: 'LED', label: 'Y3 (11)', x: 550, y: 355, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_d1', fromNodeId: 'd24_sw_a', fromPinId: 'out', toNodeId: 'd24_not_a', toPinId: 'in' },
          { id: 'w_d2', fromNodeId: 'd24_sw_b', fromPinId: 'out', toNodeId: 'd24_not_b', toPinId: 'in' },

          { id: 'w_d3', fromNodeId: 'd24_not_a', fromPinId: 'out', toNodeId: 'd24_and0', toPinId: 'i1' },
          { id: 'w_d4', fromNodeId: 'd24_not_b', fromPinId: 'out', toNodeId: 'd24_and0', toPinId: 'i2' },
          { id: 'w_d5', fromNodeId: 'd24_and0', fromPinId: 'out', toNodeId: 'd24_led_y0', toPinId: 'in' },

          { id: 'w_d6', fromNodeId: 'd24_sw_a', fromPinId: 'out', toNodeId: 'd24_and1', toPinId: 'i1' },
          { id: 'w_d7', fromNodeId: 'd24_not_b', fromPinId: 'out', toNodeId: 'd24_and1', toPinId: 'i2' },
          { id: 'w_d8', fromNodeId: 'd24_and1', fromPinId: 'out', toNodeId: 'd24_led_y1', toPinId: 'in' },

          { id: 'w_d9', fromNodeId: 'd24_not_a', fromPinId: 'out', toNodeId: 'd24_and2', toPinId: 'i1' },
          { id: 'w_d10', fromNodeId: 'd24_sw_b', fromPinId: 'out', toNodeId: 'd24_and2', toPinId: 'i2' },
          { id: 'w_d11', fromNodeId: 'd24_and2', fromPinId: 'out', toNodeId: 'd24_led_y2', toPinId: 'in' },

          { id: 'w_d12', fromNodeId: 'd24_sw_a', fromPinId: 'out', toNodeId: 'd24_and3', toPinId: 'i1' },
          { id: 'w_d13', fromNodeId: 'd24_sw_b', fromPinId: 'out', toNodeId: 'd24_and3', toPinId: 'i2' },
          { id: 'w_d14', fromNodeId: 'd24_and3', fromPinId: 'out', toNodeId: 'd24_led_y3', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── FAMILIA 4: CODIFICADOR 8 A 3 ────────────────────────────
  enc_8_3: {
    id: 'enc_8_3',
    name: 'Codificador de Prioridad 8 a 3',
    msiCode: 'CI 74LS148',
    description: 'Codifica 8 líneas de entrada en una palabra binaria de 3 bits reflejando la línea activa con mayor orden de prioridad.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'N1 · Encapsulado Comercial CI 74LS148',
        description: 'Codificador de prioridad MSI de 8 a 3 líneas con entradas y salidas activas.',
        nodes: [
          { id: 'enc_sw_0', type: 'SWITCH', label: 'I0', x: 60, y: 80, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I0', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'enc_sw_1', type: 'SWITCH', label: 'I1', x: 60, y: 135, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I1', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'enc_sw_2', type: 'SWITCH', label: 'I2', x: 60, y: 190, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I2', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'enc_sw_3', type: 'SWITCH', label: 'I3', x: 60, y: 245, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I3', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'enc_sw_4', type: 'SWITCH', label: 'I4', x: 60, y: 300, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I4', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'enc_sw_5', type: 'SWITCH', label: 'I5', x: 60, y: 355, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I5', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'enc_sw_6', type: 'SWITCH', label: 'I6', x: 60, y: 410, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I6', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'enc_sw_7', type: 'SWITCH', label: 'I7', x: 60, y: 465, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'I7', 'out', 1, 0.5)], state: { value: 0 } },

          // CI 74LS148
          {
            id: 'ic_74148_main',
            type: 'ENC_8_3',
            label: '74LS148 · 8:3 ENCODER',
            x: 230,
            y: 120,
            width: 190,
            height: 380,
            inputs: Array.from({ length: 8 }, (_, i) => 
              createPin(`i${i}`, `I${i}`, 'in', 0, (i + 0.5) / 8)
            ),
            outputs: [
              createPin('a0', 'A0 (2⁰)', 'out', 1, 0.25),
              createPin('a1', 'A1 (2¹)', 'out', 1, 0.5),
              createPin('a2', 'A2 (2²)', 'out', 1, 0.75),
            ],
          },

          // Salidas LEDs
          { id: 'enc_led_a0', type: 'LED', label: 'A0 (1)', x: 500, y: 190, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'enc_led_a1', type: 'LED', label: 'A1 (0)', x: 500, y: 280, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'enc_led_a2', type: 'LED', label: 'A2 (1)', x: 500, y: 370, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_e0', fromNodeId: 'enc_sw_0', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i0' },
          { id: 'w_e1', fromNodeId: 'enc_sw_1', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i1' },
          { id: 'w_e2', fromNodeId: 'enc_sw_2', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i2' },
          { id: 'w_e3', fromNodeId: 'enc_sw_3', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i3' },
          { id: 'w_e4', fromNodeId: 'enc_sw_4', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i4' },
          { id: 'w_e5', fromNodeId: 'enc_sw_5', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i5' },
          { id: 'w_e6', fromNodeId: 'enc_sw_6', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i6' },
          { id: 'w_e7', fromNodeId: 'enc_sw_7', fromPinId: 'out', toNodeId: 'ic_74148_main', toPinId: 'i7' },
          { id: 'w_ea0', fromNodeId: 'ic_74148_main', fromPinId: 'a0', toNodeId: 'enc_led_a0', toPinId: 'in' },
          { id: 'w_ea1', fromNodeId: 'ic_74148_main', fromPinId: 'a1', toNodeId: 'enc_led_a1', toPinId: 'in' },
          { id: 'w_ea2', fromNodeId: 'ic_74148_main', fromPinId: 'a2', toNodeId: 'enc_led_a2', toPinId: 'in' },
        ],
      },
      {
        level: 2,
        levelKey: 'N2',
        title: 'N2 · Red de Compuertas OR de Codificación',
        description: 'Sintetiza directamente los bits de salida: A0 = I1 + I3 + I5 + I7, A1 = I2 + I3 + I6 + I7, A2 = I4 + I5 + I6 + I7 mediante compuertas OR de 4 entradas.',
        nodes: [
          { id: 'or_sw_i1', type: 'SWITCH', label: 'I1', x: 60, y: 100, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'I1', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'or_sw_i3', type: 'SWITCH', label: 'I3', x: 60, y: 170, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'I3', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'or_sw_i5', type: 'SWITCH', label: 'I5', x: 60, y: 240, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'I5', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'or_sw_i7', type: 'SWITCH', label: 'I7', x: 60, y: 310, width: 80, height: 45, inputs: [], outputs: [createPin('out', 'I7', 'out', 1, 0.5)], state: { value: 0 } },
          
          { id: 'or_gate_a0', type: 'OR', label: 'OR A0 (I1+I3+I5+I7)', x: 300, y: 120, width: 130, height: 70, inputs: [createPin('i1', 'I1', 'in', 0, 0.3), createPin('i5', 'I5', 'in', 0, 0.7)], outputs: [createPin('out', 'A0', 'out', 1, 0.5)] },
          { id: 'or_gate_a1', type: 'OR', label: 'OR A1 (I2+I3+I6+I7)', x: 300, y: 230, width: 130, height: 70, inputs: [createPin('i2', 'I2', 'in', 0, 0.3), createPin('i6', 'I6', 'in', 0, 0.7)], outputs: [createPin('out', 'A1', 'out', 1, 0.5)] },
          { id: 'or_gate_a2', type: 'OR', label: 'OR A2 (I4+I5+I6+I7)', x: 300, y: 340, width: 130, height: 70, inputs: [createPin('i4', 'I4', 'in', 0, 0.3), createPin('i5', 'I5', 'in', 0, 0.7)], outputs: [createPin('out', 'A2', 'out', 1, 0.5)] },

          { id: 'or_led_a0', type: 'LED', label: 'A0 (1)', x: 520, y: 130, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'or_led_a1', type: 'LED', label: 'A1 (0)', x: 520, y: 240, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'or_led_a2', type: 'LED', label: 'A2 (1)', x: 520, y: 350, width: 75, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_or_1', fromNodeId: 'or_sw_i5', fromPinId: 'out', toNodeId: 'or_gate_a0', toPinId: 'i5' },
          { id: 'w_or_2', fromNodeId: 'or_sw_i5', fromPinId: 'out', toNodeId: 'or_gate_a2', toPinId: 'i5' },
          { id: 'w_or_out0', fromNodeId: 'or_gate_a0', fromPinId: 'out', toNodeId: 'or_led_a0', toPinId: 'in' },
          { id: 'w_or_out1', fromNodeId: 'or_gate_a1', fromPinId: 'out', toNodeId: 'or_led_a1', toPinId: 'in' },
          { id: 'w_or_out2', fromNodeId: 'or_gate_a2', fromPinId: 'out', toNodeId: 'or_led_a2', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── FAMILIA 5: COMPARADOR DE MAGNITUD DE 4 BITS ─────────────
  comp_4bit: {
    id: 'comp_4bit',
    name: 'Comparador de 4 Bits',
    msiCode: 'CI 74LS85',
    description: 'Compara dos palabras binarias de 4 bits A y B, determinando si A > B, A = B o A < B.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'N1 · Encapsulado Comercial CI 74LS85',
        description: 'Comparador de magnitud binario de 4 bits con entradas de cascada para expansión a 8, 12 o 16 bits.',
        nodes: [
          { id: 'cmp_sw_a3', type: 'SWITCH', label: 'A3 (1)', x: 60, y: 100, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A3', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'cmp_sw_a2', type: 'SWITCH', label: 'A2 (0)', x: 60, y: 160, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A2', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'cmp_sw_b3', type: 'SWITCH', label: 'B3 (0)', x: 60, y: 240, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B3', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'cmp_sw_b2', type: 'SWITCH', label: 'B2 (1)', x: 60, y: 300, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B2', 'out', 1, 0.5)], state: { value: 1 } },

          // CI 74LS85
          {
            id: 'ic_7485_main',
            type: 'IC_7485',
            label: '74LS85 · 4-BIT COMPARATOR',
            x: 240,
            y: 120,
            width: 210,
            height: 280,
            inputs: [
              createPin('a3', 'A3', 'in', 0, 0.2),
              createPin('a2', 'A2', 'in', 0, 0.35),
              createPin('b3', 'B3', 'in', 0, 0.65),
              createPin('b2', 'B2', 'in', 0, 0.8),
            ],
            outputs: [
              createPin('gt', 'A > B', 'out', 1, 0.3),
              createPin('eq', 'A = B', 'out', 1, 0.5),
              createPin('lt', 'A < B', 'out', 1, 0.7),
            ],
          },

          // LEDs Salida
          { id: 'cmp_led_gt', type: 'LED', label: 'A > B (Activa)', x: 530, y: 150, width: 95, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'cmp_led_eq', type: 'LED', label: 'A = B', x: 530, y: 235, width: 95, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'cmp_led_lt', type: 'LED', label: 'A < B', x: 530, y: 320, width: 95, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_cmp_a3', fromNodeId: 'cmp_sw_a3', fromPinId: 'out', toNodeId: 'ic_7485_main', toPinId: 'a3' },
          { id: 'w_cmp_a2', fromNodeId: 'cmp_sw_a2', fromPinId: 'out', toNodeId: 'ic_7485_main', toPinId: 'a2' },
          { id: 'w_cmp_b3', fromNodeId: 'cmp_sw_b3', fromPinId: 'out', toNodeId: 'ic_7485_main', toPinId: 'b3' },
          { id: 'w_cmp_b2', fromNodeId: 'cmp_sw_b2', fromPinId: 'out', toNodeId: 'ic_7485_main', toPinId: 'b2' },

          { id: 'w_cmp_out1', fromNodeId: 'ic_7485_main', fromPinId: 'gt', toNodeId: 'cmp_led_gt', toPinId: 'in' },
          { id: 'w_cmp_out2', fromNodeId: 'ic_7485_main', fromPinId: 'eq', toNodeId: 'cmp_led_eq', toPinId: 'in' },
          { id: 'w_cmp_out3', fromNodeId: 'ic_7485_main', fromPinId: 'lt', toNodeId: 'cmp_led_lt', toPinId: 'in' },
        ],
      },
      {
        level: 2,
        levelKey: 'N2',
        title: 'N2 · Red Comparadora Bit a Bit con XNOR y AND',
        description: 'La igualdad de cada bit se detecta con compuertas XNOR: xi = Ai ⊙ Bi. La condición A > B se evalúa por precedencia del bit más significativo.',
        nodes: [
          { id: 'n2cmp_sw_a', type: 'SWITCH', label: 'Bit A', x: 60, y: 120, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'n2cmp_sw_b', type: 'SWITCH', label: 'Bit B', x: 60, y: 220, width: 85, height: 45, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },

          // XNOR para igualdad (A XNOR B)
          { id: 'n2cmp_xnor', type: 'XNOR', label: 'XNOR (A=B)', x: 240, y: 120, width: 100, height: 60, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'A⊙B', 'out', 1, 0.5)] },
          // NOT B para evaluar A > B
          { id: 'n2cmp_not_b', type: 'NOT', label: 'NOT B', x: 240, y: 220, width: 80, height: 45, inputs: [createPin('in', 'B', 'in', 0, 0.5)], outputs: [createPin('out', '~B', 'out', 1, 0.5)] },
          // AND para A > B: A · ~B
          { id: 'n2cmp_and_gt', type: 'AND', label: 'AND (A>B: A·~B)', x: 400, y: 200, width: 110, height: 60, inputs: [createPin('i1', 'A', 'in', 0, 0.3), createPin('i2', '~B', 'in', 0, 0.7)], outputs: [createPin('out', 'A>B', 'out', 1, 0.5)] },

          // LEDs
          { id: 'n2cmp_led_eq', type: 'LED', label: 'A = B', x: 570, y: 130, width: 85, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'n2cmp_led_gt', type: 'LED', label: 'A > B (Activa)', x: 570, y: 210, width: 95, height: 45, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_n2cmp1', fromNodeId: 'n2cmp_sw_a', fromPinId: 'out', toNodeId: 'n2cmp_xnor', toPinId: 'i1' },
          { id: 'w_n2cmp2', fromNodeId: 'n2cmp_sw_b', fromPinId: 'out', toNodeId: 'n2cmp_xnor', toPinId: 'i2' },
          { id: 'w_n2cmp3', fromNodeId: 'n2cmp_xnor', fromPinId: 'out', toNodeId: 'n2cmp_led_eq', toPinId: 'in' },

          { id: 'w_n2cmp4', fromNodeId: 'n2cmp_sw_b', fromPinId: 'out', toNodeId: 'n2cmp_not_b', toPinId: 'in' },
          { id: 'w_n2cmp5', fromNodeId: 'n2cmp_sw_a', fromPinId: 'out', toNodeId: 'n2cmp_and_gt', toPinId: 'i1' },
          { id: 'w_n2cmp6', fromNodeId: 'n2cmp_not_b', fromPinId: 'out', toNodeId: 'n2cmp_and_gt', toPinId: 'i2' },
          { id: 'w_n2cmp7', fromNodeId: 'n2cmp_and_gt', fromPinId: 'out', toNodeId: 'n2cmp_led_gt', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── FAMILIA 6: MULTIPLEXOR 4:1 ──────────────────────────────
  mux_4_1: {
    id: 'mux_4_1',
    name: 'Multiplexor 4 a 1',
    msiCode: 'MUX 4:1',
    description: 'Enruta una de cuatro líneas de datos de entrada (D0, D1, D2, D3) hacia una única salida según el selector binario (S0, S1).',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'N1 · Bloque Modular MUX 4:1',
        description: 'Selector de datos digital con 4 entradas de datos, 2 entradas de selección y 1 salida.',
        nodes: [
          // Entradas de Datos D0..D3
          { id: 'mux_sw_d0', type: 'SWITCH', label: 'D0 (0)', x: 60, y: 100, width: 85, height: 42, inputs: [], outputs: [createPin('out', 'D0', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'mux_sw_d1', type: 'SWITCH', label: 'D1 (0)', x: 60, y: 160, width: 85, height: 42, inputs: [], outputs: [createPin('out', 'D1', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'mux_sw_d2', type: 'SWITCH', label: 'D2 (1)', x: 60, y: 220, width: 85, height: 42, inputs: [], outputs: [createPin('out', 'D2', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'mux_sw_d3', type: 'SWITCH', label: 'D3 (0)', x: 60, y: 280, width: 85, height: 42, inputs: [], outputs: [createPin('out', 'D3', 'out', 1, 0.5)], state: { value: 0 } },

          // Líneas de Selección S0, S1 (S1=1, S0=0 selecciona D2)
          { id: 'mux_sw_s0', type: 'SWITCH', label: 'S0 (0)', x: 180, y: 380, width: 85, height: 42, inputs: [], outputs: [createPin('out', 'S0', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'mux_sw_s1', type: 'SWITCH', label: 'S1 (1)', x: 280, y: 380, width: 85, height: 42, inputs: [], outputs: [createPin('out', 'S1', 'out', 1, 0.5)], state: { value: 1 } },

          // MUX 4:1 Node
          {
            id: 'mux_main_node',
            type: 'MUX_4_1',
            label: 'MUX 4:1',
            x: 240,
            y: 110,
            width: 160,
            height: 230,
            inputs: [
              createPin('d0', 'D0', 'in', 0, 0.2),
              createPin('d1', 'D1', 'in', 0, 0.4),
              createPin('d2', 'D2', 'in', 0, 0.6),
              createPin('d3', 'D3', 'in', 0, 0.8),
              createPin('s0', 'S0', 'in', 0.35, 1),
              createPin('s1', 'S1', 'in', 0.65, 1),
            ],
            outputs: [createPin('y', 'Y', 'out', 1, 0.5)],
          },

          // LED Salida
          { id: 'mux_led_out', type: 'LED', label: 'Salida Y (D2=1)', x: 480, y: 190, width: 95, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_m_d0', fromNodeId: 'mux_sw_d0', fromPinId: 'out', toNodeId: 'mux_main_node', toPinId: 'd0' },
          { id: 'w_m_d1', fromNodeId: 'mux_sw_d1', fromPinId: 'out', toNodeId: 'mux_main_node', toPinId: 'd1' },
          { id: 'w_m_d2', fromNodeId: 'mux_sw_d2', fromPinId: 'out', toNodeId: 'mux_main_node', toPinId: 'd2' },
          { id: 'w_m_d3', fromNodeId: 'mux_sw_d3', fromPinId: 'out', toNodeId: 'mux_main_node', toPinId: 'd3' },
          { id: 'w_m_s0', fromNodeId: 'mux_sw_s0', fromPinId: 'out', toNodeId: 'mux_main_node', toPinId: 's0' },
          { id: 'w_m_s1', fromNodeId: 'mux_sw_s1', fromPinId: 'out', toNodeId: 'mux_main_node', toPinId: 's1' },
          { id: 'w_m_y', fromNodeId: 'mux_main_node', fromPinId: 'y', toNodeId: 'mux_led_out', toPinId: 'in' },
        ],
      },
      {
        level: 2,
        levelKey: 'N2',
        title: 'N2 · Decodificador de Selección + 4 AND + 1 OR',
        description: 'Estructura interna: Inversores para generar ~S0 y ~S1, 4 compuertas AND que habilitan el canal seleccionado y 1 compuerta OR combinadora.',
        nodes: [
          // Selectores
          { id: 'n2m_sw_s0', type: 'SWITCH', label: 'S0 (0)', x: 50, y: 60, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'S0', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'n2m_sw_s1', type: 'SWITCH', label: 'S1 (1)', x: 50, y: 120, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'S1', 'out', 1, 0.5)], state: { value: 1 } },

          // NOTs
          { id: 'n2m_not_s0', type: 'NOT', label: 'NOT S0', x: 180, y: 60, width: 75, height: 42, inputs: [createPin('in', 'S0', 'in', 0, 0.5)], outputs: [createPin('out', '~S0', 'out', 1, 0.5)] },
          { id: 'n2m_not_s1', type: 'NOT', label: 'NOT S1', x: 180, y: 120, width: 75, height: 42, inputs: [createPin('in', 'S1', 'in', 0, 0.5)], outputs: [createPin('out', '~S1', 'out', 1, 0.5)] },

          // Datos
          { id: 'n2m_sw_d2', type: 'SWITCH', label: 'D2 (1)', x: 50, y: 320, width: 80, height: 42, inputs: [], outputs: [createPin('out', 'D2', 'out', 1, 0.5)], state: { value: 1 } },

          // 4 ANDs de canal
          { id: 'n2m_and_0', type: 'AND', label: 'AND 0 (D0·~S1·~S0)', x: 340, y: 60, width: 120, height: 55, inputs: [createPin('i1', 'In', 'in', 0, 0.5)], outputs: [createPin('out', 'Y0', 'out', 1, 0.5)] },
          { id: 'n2m_and_1', type: 'AND', label: 'AND 1 (D1·~S1·S0)', x: 340, y: 140, width: 120, height: 55, inputs: [createPin('i1', 'In', 'in', 0, 0.5)], outputs: [createPin('out', 'Y1', 'out', 1, 0.5)] },
          { id: 'n2m_and_2', type: 'AND', label: 'AND 2 (D2·S1·~S0)', x: 340, y: 220, width: 120, height: 55, inputs: [createPin('i1', 'D2', 'in', 0, 0.3), createPin('i2', 'S1', 'in', 0, 0.7)], outputs: [createPin('out', 'Y2', 'out', 1, 0.5)] },
          { id: 'n2m_and_3', type: 'AND', label: 'AND 3 (D3·S1·S0)', x: 340, y: 300, width: 120, height: 55, inputs: [createPin('i1', 'In', 'in', 0, 0.5)], outputs: [createPin('out', 'Y3', 'out', 1, 0.5)] },

          // OR Final
          { id: 'n2m_or', type: 'OR', label: 'OR Colector (Y)', x: 540, y: 180, width: 100, height: 70, inputs: [createPin('i1', 'In1', 'in', 0, 0.3), createPin('i2', 'Y2', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          // LED Salida
          { id: 'n2m_led', type: 'LED', label: 'Salida Y (1)', x: 700, y: 190, width: 85, height: 50, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_n2m_1', fromNodeId: 'n2m_sw_s0', fromPinId: 'out', toNodeId: 'n2m_not_s0', toPinId: 'in' },
          { id: 'w_n2m_2', fromNodeId: 'n2m_sw_s1', fromPinId: 'out', toNodeId: 'n2m_not_s1', toPinId: 'in' },

          { id: 'w_n2m_3', fromNodeId: 'n2m_sw_d2', fromPinId: 'out', toNodeId: 'n2m_and_2', toPinId: 'i1' },
          { id: 'w_n2m_4', fromNodeId: 'n2m_sw_s1', fromPinId: 'out', toNodeId: 'n2m_and_2', toPinId: 'i2' },

          { id: 'w_n2m_5', fromNodeId: 'n2m_and_2', fromPinId: 'out', toNodeId: 'n2m_or', toPinId: 'i2' },
          { id: 'w_n2m_6', fromNodeId: 'n2m_or', fromPinId: 'out', toNodeId: 'n2m_led', toPinId: 'in' },
        ],
      },
    ],
  },

  // ═════════════════════════════════════════════════════════════
  // ── EJERCICIOS DEMO CON COMPUERTAS LÓGICAS (NIVEL ESQUEMÁTICO)
  // ═════════════════════════════════════════════════════════════

  // ── DEMO 1: SUMADOR COMPLETO CON COMPUERTAS (EXACTO AL ESQUEMA) ──
  demo_full_adder: {
    id: 'demo_full_adder',
    name: 'Demo 1: Sumador Completo (Full Adder)',
    msiCode: 'S = A ⊕ B ⊕ Cin',
    description: 'Implementación esquemática de un Sumador Completo de 1 bit con compuertas XOR (U1, U3), AND (U2, U5) y OR (U4).',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: S = A ⊕ B ⊕ Cin  |  Cout = A·B + Cin·(A ⊕ B)',
        description: 'Activa o desactiva las entradas A, B y Cin para comprobar las 8 combinaciones de la tabla de verdad de la suma binaria.',
        nodes: [
          { id: 'fa_a', type: 'SWITCH', label: 'A', x: 100, y: 100, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'fa_b', type: 'SWITCH', label: 'B', x: 100, y: 180, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'fa_cin', type: 'SWITCH', label: 'Cin', x: 100, y: 360, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'Cin', 'out', 1, 0.5)], state: { value: 1 } },

          { id: 'u1_xor', type: 'XOR', label: 'U1', x: 280, y: 105, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'u2_and', type: 'AND', label: 'U2', x: 310, y: 260, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'u3_xor', type: 'XOR', label: 'U3', x: 540, y: 180, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'u5_and', type: 'AND', label: 'U5', x: 460, y: 340, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'u4_or', type: 'OR', label: 'U4', x: 630, y: 310, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'out_s', type: 'LED', label: 'S', x: 790, y: 190, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'out_cout', type: 'LED', label: 'Cout', x: 790, y: 320, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'w_fa1', fromNodeId: 'fa_a', fromPinId: 'out', toNodeId: 'u1_xor', toPinId: 'in1' },
          { id: 'w_fa2', fromNodeId: 'fa_b', fromPinId: 'out', toNodeId: 'u1_xor', toPinId: 'in2' },
          { id: 'w_fa3', fromNodeId: 'fa_a', fromPinId: 'out', toNodeId: 'u2_and', toPinId: 'in1' },
          { id: 'w_fa4', fromNodeId: 'fa_b', fromPinId: 'out', toNodeId: 'u2_and', toPinId: 'in2' },
          { id: 'w_fa5', fromNodeId: 'u1_xor', fromPinId: 'out', toNodeId: 'u3_xor', toPinId: 'in1' },
          { id: 'w_fa6', fromNodeId: 'fa_cin', fromPinId: 'out', toNodeId: 'u3_xor', toPinId: 'in2' },
          { id: 'w_fa7', fromNodeId: 'u1_xor', fromPinId: 'out', toNodeId: 'u5_and', toPinId: 'in1' },
          { id: 'w_fa8', fromNodeId: 'fa_cin', fromPinId: 'out', toNodeId: 'u5_and', toPinId: 'in2' },
          { id: 'w_fa9', fromNodeId: 'u2_and', fromPinId: 'out', toNodeId: 'u4_or', toPinId: 'in1' },
          { id: 'w_fa10', fromNodeId: 'u5_and', fromPinId: 'out', toNodeId: 'u4_or', toPinId: 'in2' },
          { id: 'w_fa11', fromNodeId: 'u3_xor', fromPinId: 'out', toNodeId: 'out_s', toPinId: 'in' },
          { id: 'w_fa12', fromNodeId: 'u4_or', fromPinId: 'out', toNodeId: 'out_cout', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── DEMO 2: MEDIO RESTADOR BINARIO (HALF SUBTRACTOR) ─────────
  demo_subtractor: {
    id: 'demo_subtractor',
    name: 'Demo 2: Medio Restador Binario',
    msiCode: 'D = A ⊕ B, Bout = ~A·B',
    description: 'Calcula la resta binaria A - B generando la Diferencia (D) y el Préstamo de salida (Bout) cuando A < B.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: D = A ⊕ B  |  Bout = ~A · B',
        description: 'Con A=0 y B=1 se activa tanto la Diferencia (D=1) como el Préstamo (Bout=1) porque 0 - 1 requiere pedir prestado.',
        nodes: [
          { id: 'sub_a', type: 'SWITCH', label: 'A', x: 100, y: 120, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'sub_b', type: 'SWITCH', label: 'B', x: 100, y: 260, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 1 } },

          { id: 'sub_u1', type: 'XOR', label: 'U1', x: 360, y: 120, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'sub_u2', type: 'NOT', label: 'U2', x: 260, y: 230, width: 90, height: 54, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'sub_u3', type: 'AND', label: 'U3', x: 430, y: 250, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'sub_d', type: 'LED', label: 'D (Dif)', x: 640, y: 130, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'sub_bout', type: 'LED', label: 'Bout', x: 640, y: 260, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'ws1', fromNodeId: 'sub_a', fromPinId: 'out', toNodeId: 'sub_u1', toPinId: 'in1' },
          { id: 'ws2', fromNodeId: 'sub_b', fromPinId: 'out', toNodeId: 'sub_u1', toPinId: 'in2' },
          { id: 'ws3', fromNodeId: 'sub_a', fromPinId: 'out', toNodeId: 'sub_u2', toPinId: 'in' },
          { id: 'ws4', fromNodeId: 'sub_u2', fromPinId: 'out', toNodeId: 'sub_u3', toPinId: 'in1' },
          { id: 'ws5', fromNodeId: 'sub_b', fromPinId: 'out', toNodeId: 'sub_u3', toPinId: 'in2' },
          { id: 'ws6', fromNodeId: 'sub_u1', fromPinId: 'out', toNodeId: 'sub_d', toPinId: 'in' },
          { id: 'ws7', fromNodeId: 'sub_u3', fromPinId: 'out', toNodeId: 'sub_bout', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── DEMO 3: VOTADOR DE MAYORÍA DE 3 SENSORES ─────────────────
  demo_majority: {
    id: 'demo_majority',
    name: 'Demo 3: Votador de Mayoría (3 Entradas)',
    msiCode: 'Y = A·B + B·C + A·C',
    description: 'Sistema de decisión por mayoría: la salida Y se activa (1) cuando al menos 2 de los 3 sensores (A, B, C) están en 1.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: Y = A·B + B·C + A·C (3 AND + 1 OR de 3 entradas)',
        description: 'Prueba activar 0, 1, 2 o 3 entradas: verás que Y solo enciende con 2 o más entradas en estado alto (1).',
        nodes: [
          { id: 'maj_a', type: 'SWITCH', label: 'A', x: 90, y: 110, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'maj_b', type: 'SWITCH', label: 'B', x: 90, y: 220, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'maj_c', type: 'SWITCH', label: 'C', x: 90, y: 330, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'C', 'out', 1, 0.5)], state: { value: 0 } },

          { id: 'maj_u1', type: 'AND', label: 'U1 (A·B)', x: 320, y: 95, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'maj_u2', type: 'AND', label: 'U2 (B·C)', x: 320, y: 210, width: 100, height: 64, inputs: [createPin('in1', 'B', 'in', 0, 0.3), createPin('in2', 'C', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'maj_u3', type: 'AND', label: 'U3 (A·C)', x: 320, y: 325, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'C', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'maj_u4', type: 'OR_3', label: 'U4', x: 540, y: 200, width: 105, height: 76, inputs: [createPin('in1', 'I1', 'in', 0, 0.22), createPin('in2', 'I2', 'in', 0, 0.5), createPin('in3', 'I3', 'in', 0, 0.78)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'maj_y', type: 'LED', label: 'Mayoría Y', x: 730, y: 215, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'wm1', fromNodeId: 'maj_a', fromPinId: 'out', toNodeId: 'maj_u1', toPinId: 'in1' },
          { id: 'wm2', fromNodeId: 'maj_b', fromPinId: 'out', toNodeId: 'maj_u1', toPinId: 'in2' },
          { id: 'wm3', fromNodeId: 'maj_b', fromPinId: 'out', toNodeId: 'maj_u2', toPinId: 'in1' },
          { id: 'wm4', fromNodeId: 'maj_c', fromPinId: 'out', toNodeId: 'maj_u2', toPinId: 'in2' },
          { id: 'wm5', fromNodeId: 'maj_a', fromPinId: 'out', toNodeId: 'maj_u3', toPinId: 'in1' },
          { id: 'wm6', fromNodeId: 'maj_c', fromPinId: 'out', toNodeId: 'maj_u3', toPinId: 'in2' },
          { id: 'wm7', fromNodeId: 'maj_u1', fromPinId: 'out', toNodeId: 'maj_u4', toPinId: 'in1' },
          { id: 'wm8', fromNodeId: 'maj_u2', fromPinId: 'out', toNodeId: 'maj_u4', toPinId: 'in2' },
          { id: 'wm9', fromNodeId: 'maj_u3', fromPinId: 'out', toNodeId: 'maj_u4', toPinId: 'in3' },
          { id: 'wm10', fromNodeId: 'maj_u4', fromPinId: 'out', toNodeId: 'maj_y', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── DEMO 4: COMPARADOR DE MAGNITUD DE 1 BIT CON COMPUERTAS ───
  demo_comp_1bit: {
    id: 'demo_comp_1bit',
    name: 'Demo 4: Comparador de 1 Bit (A>B, A=B, A<B)',
    msiCode: 'XNOR + NOT + AND',
    description: 'Compara dos bits A y B mediante compuertas elementales: A>B = A·~B, A=B = ~(A⊕B), A<B = ~A·B.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: Comparador Completo de 1 Bit (A > B, A = B, A < B)',
        description: 'Cambia A y B para observar cómo solo una de las tres salidas (A>B, A=B o A<B) se pone en 1 a la vez.',
        nodes: [
          { id: 'c1_a', type: 'SWITCH', label: 'A', x: 90, y: 130, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'c1_b', type: 'SWITCH', label: 'B', x: 90, y: 290, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },

          { id: 'c1_not_a', type: 'NOT', label: 'U1 (~A)', x: 250, y: 340, width: 90, height: 54, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'c1_not_b', type: 'NOT', label: 'U2 (~B)', x: 250, y: 90, width: 90, height: 54, inputs: [createPin('in', 'B', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'c1_and_gt', type: 'AND', label: 'U3 (A·~B)', x: 440, y: 90, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', '~B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'c1_xnor_eq', type: 'XNOR', label: 'U4 (A⊙B)', x: 440, y: 210, width: 105, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'c1_and_lt', type: 'AND', label: 'U5 (~A·B)', x: 440, y: 330, width: 100, height: 64, inputs: [createPin('in1', '~A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'c1_led_gt', type: 'LED', label: 'A > B', x: 650, y: 100, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'c1_led_eq', type: 'LED', label: 'A = B', x: 650, y: 220, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'c1_led_lt', type: 'LED', label: 'A < B', x: 650, y: 340, width: 90, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'wc1', fromNodeId: 'c1_a', fromPinId: 'out', toNodeId: 'c1_and_gt', toPinId: 'in1' },
          { id: 'wc2', fromNodeId: 'c1_b', fromPinId: 'out', toNodeId: 'c1_not_b', toPinId: 'in' },
          { id: 'wc3', fromNodeId: 'c1_not_b', fromPinId: 'out', toNodeId: 'c1_and_gt', toPinId: 'in2' },
          { id: 'wc4', fromNodeId: 'c1_a', fromPinId: 'out', toNodeId: 'c1_xnor_eq', toPinId: 'in1' },
          { id: 'wc5', fromNodeId: 'c1_b', fromPinId: 'out', toNodeId: 'c1_xnor_eq', toPinId: 'in2' },
          { id: 'wc6', fromNodeId: 'c1_a', fromPinId: 'out', toNodeId: 'c1_not_a', toPinId: 'in' },
          { id: 'wc7', fromNodeId: 'c1_not_a', fromPinId: 'out', toNodeId: 'c1_and_lt', toPinId: 'in1' },
          { id: 'wc8', fromNodeId: 'c1_b', fromPinId: 'out', toNodeId: 'c1_and_lt', toPinId: 'in2' },
          { id: 'wc9', fromNodeId: 'c1_and_gt', fromPinId: 'out', toNodeId: 'c1_led_gt', toPinId: 'in' },
          { id: 'wc10', fromNodeId: 'c1_xnor_eq', fromPinId: 'out', toNodeId: 'c1_led_eq', toPinId: 'in' },
          { id: 'wc11', fromNodeId: 'c1_and_lt', fromPinId: 'out', toNodeId: 'c1_led_lt', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── DEMO 5: GENERADOR/DETECTOR DE PARIDAD DE 4 BITS ──────────
  demo_parity: {
    id: 'demo_parity',
    name: 'Demo 5: Detector de Paridad (4 Bits)',
    msiCode: 'P = D0 ⊕ D1 ⊕ D2 ⊕ D3',
    description: 'Árbol de compuertas XOR (U1, U2, U3) e inversor (U4) para detectar cantidad impar o par de unos en una palabra de 4 bits.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: Árbol XOR de Paridad Impar y Par (4 Bits)',
        description: 'P_Impar = 1 cuando hay 1 o 3 bits encendidos. P_Par = 1 cuando hay 0, 2 o 4 bits encendidos.',
        nodes: [
          { id: 'par_d0', type: 'SWITCH', label: 'D0', x: 90, y: 80, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'D0', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'par_d1', type: 'SWITCH', label: 'D1', x: 90, y: 150, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'D1', 'out', 1, 0.5)], state: { value: 0 } },
          { id: 'par_d2', type: 'SWITCH', label: 'D2', x: 90, y: 260, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'D2', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'par_d3', type: 'SWITCH', label: 'D3', x: 90, y: 330, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'D3', 'out', 1, 0.5)], state: { value: 1 } },

          { id: 'par_u1', type: 'XOR', label: 'U1', x: 280, y: 95, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'par_u2', type: 'XOR', label: 'U2', x: 280, y: 275, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'par_u3', type: 'XOR', label: 'U3', x: 470, y: 185, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'par_u4', type: 'NOT', label: 'U4', x: 610, y: 285, width: 90, height: 54, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'par_odd', type: 'LED', label: 'P_Impar', x: 750, y: 195, width: 95, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'par_even', type: 'LED', label: 'P_Par', x: 750, y: 290, width: 95, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'wp1', fromNodeId: 'par_d0', fromPinId: 'out', toNodeId: 'par_u1', toPinId: 'in1' },
          { id: 'wp2', fromNodeId: 'par_d1', fromPinId: 'out', toNodeId: 'par_u1', toPinId: 'in2' },
          { id: 'wp3', fromNodeId: 'par_d2', fromPinId: 'out', toNodeId: 'par_u2', toPinId: 'in1' },
          { id: 'wp4', fromNodeId: 'par_d3', fromPinId: 'out', toNodeId: 'par_u2', toPinId: 'in2' },
          { id: 'wp5', fromNodeId: 'par_u1', fromPinId: 'out', toNodeId: 'par_u3', toPinId: 'in1' },
          { id: 'wp6', fromNodeId: 'par_u2', fromPinId: 'out', toNodeId: 'par_u3', toPinId: 'in2' },
          { id: 'wp7', fromNodeId: 'par_u3', fromPinId: 'out', toNodeId: 'par_odd', toPinId: 'in' },
          { id: 'wp8', fromNodeId: 'par_u3', fromPinId: 'out', toNodeId: 'par_u4', toPinId: 'in' },
          { id: 'wp9', fromNodeId: 'par_u4', fromPinId: 'out', toNodeId: 'par_even', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── DEMO 6: COMPROBACIÓN DEL TEOREMA DE DE MORGAN ────────────
  demo_demorgan: {
    id: 'demo_demorgan',
    name: 'Demo 6: Teorema de De Morgan',
    msiCode: '~(A·B) = ~A + ~B',
    description: 'Demostración experimental en paralelo de la equivalencia entre una compuerta NAND y una compuerta OR con entradas invertidas.',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: ~(A · B)  ≡  ~A + ~B (Equivalencia de De Morgan)',
        description: 'Prueba las 4 combinaciones de A y B: comprobarás que las salidas Y1 (NAND) e Y2 (~A + ~B) son idénticas siempre.',
        nodes: [
          { id: 'dm_a', type: 'SWITCH', label: 'A', x: 90, y: 140, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'dm_b', type: 'SWITCH', label: 'B', x: 90, y: 270, width: 90, height: 44, inputs: [], outputs: [createPin('out', 'B', 'out', 1, 0.5)], state: { value: 0 } },

          { id: 'dm_nand', type: 'NAND', label: 'U1 (NAND)', x: 380, y: 100, width: 105, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'dm_not1', type: 'NOT', label: 'U2 (~A)', x: 270, y: 235, width: 90, height: 54, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'dm_not2', type: 'NOT', label: 'U3 (~B)', x: 270, y: 325, width: 90, height: 54, inputs: [createPin('in', 'B', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'dm_or', type: 'OR', label: 'U4 (~A+~B)', x: 450, y: 275, width: 100, height: 64, inputs: [createPin('in1', '~A', 'in', 0, 0.3), createPin('in2', '~B', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'dm_y1', type: 'LED', label: 'Y1 ~(A·B)', x: 640, y: 110, width: 95, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'dm_y2', type: 'LED', label: 'Y2 (~A+~B)', x: 640, y: 285, width: 95, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'wdm1', fromNodeId: 'dm_a', fromPinId: 'out', toNodeId: 'dm_nand', toPinId: 'in1' },
          { id: 'wdm2', fromNodeId: 'dm_b', fromPinId: 'out', toNodeId: 'dm_nand', toPinId: 'in2' },
          { id: 'wdm3', fromNodeId: 'dm_a', fromPinId: 'out', toNodeId: 'dm_not1', toPinId: 'in' },
          { id: 'wdm4', fromNodeId: 'dm_b', fromPinId: 'out', toNodeId: 'dm_not2', toPinId: 'in' },
          { id: 'wdm5', fromNodeId: 'dm_not1', fromPinId: 'out', toNodeId: 'dm_or', toPinId: 'in1' },
          { id: 'wdm6', fromNodeId: 'dm_not2', fromPinId: 'out', toNodeId: 'dm_or', toPinId: 'in2' },
          { id: 'wdm7', fromNodeId: 'dm_nand', fromPinId: 'out', toNodeId: 'dm_y1', toPinId: 'in' },
          { id: 'wdm8', fromNodeId: 'dm_or', fromPinId: 'out', toNodeId: 'dm_y2', toPinId: 'in' },
        ],
      },
    ],
  },

  // ── DEMO 7: SISTEMA DE ALARMA DE SEGURIDAD INDUSTRIAL ────────
  demo_alarm: {
    id: 'demo_alarm',
    name: 'Demo 7: Alarma de Seguridad Lógica',
    msiCode: 'Alarma = Armado · (Puerta + Ventana)',
    description: 'Caso práctico de control: la sirena se activa si el sistema está Armado (A=1) y se abre la Puerta (P=1) o la Ventana (V=1).',
    levels: [
      {
        level: 1,
        levelKey: 'N1',
        title: 'Esquemático: Alarma = Armado · (Puerta + Ventana)  |  Seguro = ~Alarma',
        description: 'Con Armado=1 y Puerta=1 (o Ventana=1), se activa la salida Alarma (1) y se apaga el indicador Seguro (0).',
        nodes: [
          { id: 'al_arm', type: 'SWITCH', label: 'Armado', x: 90, y: 100, width: 95, height: 44, inputs: [], outputs: [createPin('out', 'A', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'al_p', type: 'SWITCH', label: 'Puerta', x: 90, y: 220, width: 95, height: 44, inputs: [], outputs: [createPin('out', 'P', 'out', 1, 0.5)], state: { value: 1 } },
          { id: 'al_v', type: 'SWITCH', label: 'Ventana', x: 90, y: 310, width: 95, height: 44, inputs: [], outputs: [createPin('out', 'V', 'out', 1, 0.5)], state: { value: 0 } },

          { id: 'al_u1', type: 'OR', label: 'U1 (P+V)', x: 280, y: 245, width: 100, height: 64, inputs: [createPin('in1', 'P', 'in', 0, 0.3), createPin('in2', 'V', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'al_u2', type: 'AND', label: 'U2', x: 460, y: 160, width: 100, height: 64, inputs: [createPin('in1', 'A', 'in', 0, 0.3), createPin('in2', 'P+V', 'in', 0, 0.7)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },
          { id: 'al_u3', type: 'NOT', label: 'U3', x: 600, y: 270, width: 90, height: 54, inputs: [createPin('in', 'A', 'in', 0, 0.5)], outputs: [createPin('out', 'Y', 'out', 1, 0.5)] },

          { id: 'al_out', type: 'LED', label: 'Alarma', x: 740, y: 170, width: 95, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
          { id: 'al_ok', type: 'LED', label: 'Seguro', x: 740, y: 275, width: 95, height: 44, inputs: [createPin('in', 'In', 'in', 0, 0.5)], outputs: [], state: { color: '#10b981' } },
        ],
        wires: [
          { id: 'wal1', fromNodeId: 'al_p', fromPinId: 'out', toNodeId: 'al_u1', toPinId: 'in1' },
          { id: 'wal2', fromNodeId: 'al_v', fromPinId: 'out', toNodeId: 'al_u1', toPinId: 'in2' },
          { id: 'wal3', fromNodeId: 'al_arm', fromPinId: 'out', toNodeId: 'al_u2', toPinId: 'in1' },
          { id: 'wal4', fromNodeId: 'al_u1', fromPinId: 'out', toNodeId: 'al_u2', toPinId: 'in2' },
          { id: 'wal5', fromNodeId: 'al_u2', fromPinId: 'out', toNodeId: 'al_out', toPinId: 'in' },
          { id: 'wal6', fromNodeId: 'al_u2', fromPinId: 'out', toNodeId: 'al_u3', toPinId: 'in' },
          { id: 'wal7', fromNodeId: 'al_u3', fromPinId: 'out', toNodeId: 'al_ok', toPinId: 'in' },
        ],
      },
    ],
  },
};

/**
 * ─────────────────────────────────────────────────────────────
 * 1.b) MAPA DE ASOCIACIÓN: NODE_TO_HIERARCHY_MAP
 * ─────────────────────────────────────────────────────────────
 * Vincula cada tipo de componente con su familia de jerarquía,
 * el nivel de inicio en el que reside y el siguiente nivel al descender.
 */
export const NODE_TO_HIERARCHY_MAP: Record<string, HierarchyMapping> = {
  // Sumador 4 Bits
  IC_74283: { family: 'adder_4bit', startLevel: 1, nextLevel: 2 },
  FULL_ADDER: { family: 'adder_4bit', startLevel: 2, nextLevel: 3 },
  HALF_ADDER: { family: 'adder_4bit', startLevel: 3, nextLevel: 4 },

  // Decodificador BCD a 7 Segmentos
  BCD_7SEG: { family: 'bcd_7seg', startLevel: 1, nextLevel: 2 },
  IC_7447: { family: 'bcd_7seg', startLevel: 1, nextLevel: 2 },

  // Decodificador 4 a 16
  IC_74154: { family: 'dec_4_16', startLevel: 1, nextLevel: 2 },
  DEC_2_4: { family: 'dec_4_16', startLevel: 2, nextLevel: 3 },

  // Codificador 8 a 3
  ENC_8_3: { family: 'enc_8_3', startLevel: 1, nextLevel: 2 },
  IC_74148: { family: 'enc_8_3', startLevel: 1, nextLevel: 2 },

  // Comparador de 4 Bits
  IC_7485: { family: 'comp_4bit', startLevel: 1, nextLevel: 2 },

  // Multiplexor 4:1
  MUX_4_1: { family: 'mux_4_1', startLevel: 1, nextLevel: 2 },
};
