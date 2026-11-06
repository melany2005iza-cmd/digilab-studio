/**
 * AdaLab Studio - Component Node Templates Factory
 * Generates initial geometry, pins (inputs/outputs), and default state
 * for all catalog items.
 */

import { Pin, LogicValue } from '../types';
import { HIERARCHY_FAMILIES } from '../constants/hierarchyData';

export interface ComponentTemplate {
  width: number;
  height: number;
  inputs: Pin[];
  outputs: Pin[];
  state: Record<string, any>;
}

export function createNodeTemplate(type: string, label: string): ComponentTemplate {
  // First, check if there is an exact template from HIERARCHY_FAMILIES
  for (const fam of Object.values(HIERARCHY_FAMILIES)) {
    for (const lvl of fam.levels) {
      const match = lvl.nodes.find((n) => n.type === type);
      if (match) {
        return {
          width: match.width,
          height: match.height,
          inputs: JSON.parse(JSON.stringify(match.inputs)),
          outputs: JSON.parse(JSON.stringify(match.outputs)),
          state: JSON.parse(JSON.stringify(match.state || {})),
        };
      }
    }
  }

  // 1. INPUTS & SOURCES
  if (type === 'SWITCH') {
    return {
      width: 90,
      height: 50,
      inputs: [],
      outputs: [{ id: 'out', name: 'Out', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: { value: 0 },
    };
  }

  if (type === 'BUTTON') {
    return {
      width: 90,
      height: 50,
      inputs: [],
      outputs: [{ id: 'out', name: 'Out', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: { value: 0 },
    };
  }

  if (type === 'CLOCK') {
    return {
      width: 90,
      height: 50,
      inputs: [],
      outputs: [{ id: 'out', name: 'Clk', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: { value: 0 },
    };
  }

  if (type === 'HIGH_CONST' || type === 'VCC') {
    return {
      width: 90,
      height: 48,
      inputs: [],
      outputs: [{ id: 'out', name: 'VCC', type: 'out', value: 1, relX: 1, relY: 0.5 }],
      state: { value: 1 },
    };
  }

  if (type === 'LOW_CONST' || type === 'GND') {
    return {
      width: 90,
      height: 48,
      inputs: [],
      outputs: [{ id: 'out', name: 'GND', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: { value: 0 },
    };
  }

  if (type === 'DIP_SWITCH_4') {
    return {
      width: 110,
      height: 80,
      inputs: [],
      outputs: [0, 1, 2, 3].map((i) => ({
        id: `out${i}`,
        name: `S${i}`,
        type: 'out',
        value: 0,
        relX: 1,
        relY: (i + 1) / 5,
      })),
      state: { values: [0, 0, 0, 0] },
    };
  }

  if (type === 'HEX_INPUT') {
    return {
      width: 110,
      height: 80,
      inputs: [],
      outputs: [0, 1, 2, 3].map((i) => ({
        id: `b${i}`,
        name: `B${i}`,
        type: 'out',
        value: 0,
        relX: 1,
        relY: (i + 1) / 5,
      })),
      state: { hexValue: 0 },
    };
  }

  // 2. OUTPUTS & DISPLAYS
  if (type === 'LED') {
    return {
      width: 80,
      height: 50,
      inputs: [{ id: 'in', name: 'In', type: 'in', value: 0, relX: 0, relY: 0.5 }],
      outputs: [],
      state: { color: '#10b981', value: 0 },
    };
  }

  if (type === 'LED_BAR') {
    return {
      width: 90,
      height: 85,
      inputs: [0, 1, 2, 3].map((i) => ({
        id: `in${i}`,
        name: `L${i}`,
        type: 'in',
        value: 0,
        relX: 0,
        relY: (i + 1) / 5,
      })),
      outputs: [],
      state: { values: [0, 0, 0, 0] },
    };
  }

  if (type === 'SEVEN_SEG') {
    return {
      width: 140,
      height: 220,
      inputs: ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((s, idx) => ({
        id: `s${s}`,
        name: s,
        type: 'in',
        value: 0,
        relX: 0,
        relY: (idx + 1) / 8,
      })),
      outputs: [],
      state: { displayValue: '0', segments: { sa: 0, sb: 0, sc: 0, sd: 0, se: 0, sf: 0, sg: 0 } },
    };
  }

  if (type === 'BCD_DISPLAY') {
    return {
      width: 110,
      height: 120,
      inputs: ['a', 'b', 'c', 'd'].map((s, idx) => ({
        id: s,
        name: s.toUpperCase(),
        type: 'in',
        value: 0,
        relX: 0,
        relY: (idx + 1) / 5,
      })),
      outputs: [],
      state: { displayValue: '0' },
    };
  }

  if (type === 'PROBE') {
    return {
      width: 85,
      height: 50,
      inputs: [{ id: 'in', name: 'In', type: 'in', value: 0, relX: 0, relY: 0.5 }],
      outputs: [],
      state: { value: 0 },
    };
  }

  if (type === 'BUZZER') {
    return {
      width: 90,
      height: 50,
      inputs: [{ id: 'in', name: 'In', type: 'in', value: 0, relX: 0, relY: 0.5 }],
      outputs: [],
      state: { active: false },
    };
  }

  // 3. BASIC GATES (1 AND 2 INPUTS)
  if (type === 'NOT' || type === 'BUFFER') {
    return {
      width: 85,
      height: 50,
      inputs: [{ id: 'in', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.5 }],
      outputs: [{ id: 'out', name: 'Y', type: 'out', value: type === 'NOT' ? 1 : 0, relX: 1, relY: 0.5 }],
      state: {},
    };
  }

  if (['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].includes(type)) {
    return {
      width: 100,
      height: 65,
      inputs: [
        { id: 'i1', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.3 },
        { id: 'i2', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.7 },
      ],
      outputs: [{ id: 'out', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: {},
    };
  }

  // 4. MULTI-INPUT GATES
  if (['AND_3', 'OR_3', 'NAND_3', 'NOR_3', 'XOR_3'].includes(type)) {
    return {
      width: 110,
      height: 75,
      inputs: [
        { id: 'i1', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.25 },
        { id: 'i2', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.5 },
        { id: 'i3', name: 'C', type: 'in', value: 0, relX: 0, relY: 0.75 },
      ],
      outputs: [{ id: 'out', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: {},
    };
  }

  if (['AND_4', 'OR_4', 'NAND_4', 'NOR_4'].includes(type)) {
    return {
      width: 115,
      height: 85,
      inputs: [
        { id: 'i1', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.2 },
        { id: 'i2', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.4 },
        { id: 'i3', name: 'C', type: 'in', value: 0, relX: 0, relY: 0.6 },
        { id: 'i4', name: 'D', type: 'in', value: 0, relX: 0, relY: 0.8 },
      ],
      outputs: [{ id: 'out', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: {},
    };
  }

  if (type === 'NAND_8' || type === 'AND_8' || type === 'OR_8' || type === 'NOR_8') {
    const names = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return {
      width: 125,
      height: 130,
      inputs: names.map((nm, idx) => ({
        id: `i${idx + 1}`,
        name: nm,
        type: 'in',
        value: 0,
        relX: 0,
        relY: (idx + 1) / 9,
      })),
      outputs: [{ id: 'out', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: {},
    };
  }

  // 5. ARITHMETIC (ADDERS & SUBTRACTORS)
  if (type === 'HALF_ADDER') {
    return {
      width: 110,
      height: 70,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.35 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.65 },
      ],
      outputs: [
        { id: 's', name: 'Σ', type: 'out', value: 0, relX: 1, relY: 0.35 },
        { id: 'c', name: 'C', type: 'out', value: 0, relX: 1, relY: 0.65 },
      ],
      state: {},
    };
  }

  if (type === 'FULL_ADDER') {
    return {
      width: 120,
      height: 80,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.25 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.5 },
        { id: 'cin', name: 'Cin', type: 'in', value: 0, relX: 0, relY: 0.75 },
      ],
      outputs: [
        { id: 's', name: 'Σ', type: 'out', value: 0, relX: 1, relY: 0.35 },
        { id: 'cout', name: 'Cout', type: 'out', value: 0, relX: 1, relY: 0.65 },
      ],
      state: {},
    };
  }

  if (type === 'HALF_SUBTRACTOR') {
    return {
      width: 110,
      height: 70,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.35 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.65 },
      ],
      outputs: [
        { id: 'diff', name: 'D', type: 'out', value: 0, relX: 1, relY: 0.35 },
        { id: 'bout', name: 'Bout', type: 'out', value: 0, relX: 1, relY: 0.65 },
      ],
      state: {},
    };
  }

  if (type === 'FULL_SUBTRACTOR') {
    return {
      width: 120,
      height: 80,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.25 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.5 },
        { id: 'bin', name: 'Bin', type: 'in', value: 0, relX: 0, relY: 0.75 },
      ],
      outputs: [
        { id: 'diff', name: 'D', type: 'out', value: 0, relX: 1, relY: 0.35 },
        { id: 'bout', name: 'Bout', type: 'out', value: 0, relX: 1, relY: 0.65 },
      ],
      state: {},
    };
  }

  // 6. COMPARATORS
  if (type === 'COMP_1BIT') {
    return {
      width: 120,
      height: 75,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.35 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.65 },
      ],
      outputs: [
        { id: 'gt', name: 'A>B', type: 'out', value: 0, relX: 1, relY: 0.25 },
        { id: 'eq', name: 'A=B', type: 'out', value: 1, relX: 1, relY: 0.5 },
        { id: 'lt', name: 'A<B', type: 'out', value: 0, relX: 1, relY: 0.75 },
      ],
      state: {},
    };
  }

  if (type === 'COMP_2BIT') {
    return {
      width: 130,
      height: 85,
      inputs: [
        { id: 'a0', name: 'A0', type: 'in', value: 0, relX: 0, relY: 0.2 },
        { id: 'a1', name: 'A1', type: 'in', value: 0, relX: 0, relY: 0.4 },
        { id: 'b0', name: 'B0', type: 'in', value: 0, relX: 0, relY: 0.6 },
        { id: 'b1', name: 'B1', type: 'in', value: 0, relX: 0, relY: 0.8 },
      ],
      outputs: [
        { id: 'gt', name: 'A>B', type: 'out', value: 0, relX: 1, relY: 0.25 },
        { id: 'eq', name: 'A=B', type: 'out', value: 1, relX: 1, relY: 0.5 },
        { id: 'lt', name: 'A<B', type: 'out', value: 0, relX: 1, relY: 0.75 },
      ],
      state: {},
    };
  }

  // 7. DECODERS & BCD
  if (type === 'IC_74138') {
    return {
      width: 150,
      height: 130,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.18 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.32 },
        { id: 'c', name: 'C', type: 'in', value: 0, relX: 0, relY: 0.46 },
        { id: 'g1', name: 'G1', type: 'in', value: 1, relX: 0, relY: 0.60 },
        { id: 'g2a', name: '~G2A', type: 'in', value: 0, relX: 0, relY: 0.74 },
        { id: 'g2b', name: '~G2B', type: 'in', value: 0, relX: 0, relY: 0.88 },
      ],
      outputs: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        id: `y${i}`,
        name: `~Y${i}`,
        type: 'out',
        value: 1,
        relX: 1,
        relY: (i + 1) / 9,
      })),
      state: { displayValue: 'Y0 ACTIVA' },
    };
  }

  if (type === 'IC_7448' || type === 'IC_7447' || type === 'BCD_7SEG') {
    return {
      width: 150,
      height: 110,
      inputs: [
        { id: 'a', name: 'A (LSB)', type: 'in', value: 0, relX: 0, relY: 0.2 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.4 },
        { id: 'c', name: 'C', type: 'in', value: 0, relX: 0, relY: 0.6 },
        { id: 'd', name: 'D (MSB)', type: 'in', value: 0, relX: 0, relY: 0.8 },
      ],
      outputs: ['qa', 'qb', 'qc', 'qd', 'qe', 'qf', 'qg'].map((seg, idx) => ({
        id: seg,
        name: seg.substring(1),
        type: 'out',
        value: 0,
        relX: 1,
        relY: (idx + 1) / 8,
      })),
      state: { displayValue: '0' },
    };
  }

  if (type === 'IC_7442') {
    return {
      width: 150,
      height: 140,
      inputs: [
        { id: 'a', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.25 },
        { id: 'b', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.45 },
        { id: 'c', name: 'C', type: 'in', value: 0, relX: 0, relY: 0.65 },
        { id: 'd', name: 'D', type: 'in', value: 0, relX: 0, relY: 0.85 },
      ],
      outputs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
        id: `y${i}`,
        name: `Y${i}`,
        type: 'out',
        value: i === 0 ? 0 : 1,
        relX: 1,
        relY: (i + 1) / 11,
      })),
      state: {},
    };
  }

  // 8. ENCODERS & PRIORITY
  if (type === 'ENC_4_2') {
    return {
      width: 130,
      height: 85,
      inputs: [0, 1, 2, 3].map((i) => ({
        id: `i${i}`,
        name: `I${i}`,
        type: 'in',
        value: 0,
        relX: 0,
        relY: (i + 1) / 5,
      })),
      outputs: [
        { id: 'a0', name: 'A0', type: 'out', value: 0, relX: 1, relY: 0.3 },
        { id: 'a1', name: 'A1', type: 'out', value: 0, relX: 1, relY: 0.5 },
        { id: 'gs', name: 'GS', type: 'out', value: 0, relX: 1, relY: 0.7 },
      ],
      state: {},
    };
  }

  if (type === 'IC_74147') {
    return {
      width: 150,
      height: 130,
      inputs: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
        id: `i${i}`,
        name: `~${i}`,
        type: 'in',
        value: 0,
        relX: 0,
        relY: i / 10,
      })),
      outputs: [
        { id: 'a', name: 'A', type: 'out', value: 0, relX: 1, relY: 0.2 },
        { id: 'b', name: 'B', type: 'out', value: 0, relX: 1, relY: 0.4 },
        { id: 'c', name: 'C', type: 'out', value: 0, relX: 1, relY: 0.6 },
        { id: 'd', name: 'D', type: 'out', value: 0, relX: 1, relY: 0.8 },
      ],
      state: {},
    };
  }

  // 9. MULTIPLEXERS & DEMULTIPLEXERS
  if (type === 'MUX_2_1') {
    return {
      width: 120,
      height: 75,
      inputs: [
        { id: 'd0', name: 'D0', type: 'in', value: 0, relX: 0, relY: 0.25 },
        { id: 'd1', name: 'D1', type: 'in', value: 0, relX: 0, relY: 0.5 },
        { id: 's', name: 'S', type: 'in', value: 0, relX: 0, relY: 0.75 },
      ],
      outputs: [{ id: 'y', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.5 }],
      state: {},
    };
  }

  if (type === 'IC_74151') {
    return {
      width: 160,
      height: 140,
      inputs: [
        ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
          id: `d${i}`,
          name: `D${i}`,
          type: 'in' as const,
          value: 0 as LogicValue,
          relX: 0,
          relY: (i + 1) / 12,
        })),
        { id: 's0', name: 'S0', type: 'in' as const, value: 0 as LogicValue, relX: 0, relY: 9 / 12 },
        { id: 's1', name: 'S1', type: 'in' as const, value: 0 as LogicValue, relX: 0, relY: 10 / 12 },
        { id: 's2', name: 'S2', type: 'in' as const, value: 0 as LogicValue, relX: 0, relY: 11 / 12 },
      ],
      outputs: [
        { id: 'y', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.4 },
        { id: 'w', name: '~W', type: 'out', value: 1, relX: 1, relY: 0.6 },
      ],
      state: {},
    };
  }

  if (type === 'DEMUX_1_2') {
    return {
      width: 120,
      height: 70,
      inputs: [
        { id: 'in', name: 'IN', type: 'in', value: 0, relX: 0, relY: 0.35 },
        { id: 's', name: 'S', type: 'in', value: 0, relX: 0, relY: 0.65 },
      ],
      outputs: [
        { id: 'y0', name: 'Y0', type: 'out', value: 0, relX: 1, relY: 0.35 },
        { id: 'y1', name: 'Y1', type: 'out', value: 0, relX: 1, relY: 0.65 },
      ],
      state: {},
    };
  }

  if (type === 'DEMUX_1_4') {
    return {
      width: 130,
      height: 85,
      inputs: [
        { id: 'in', name: 'IN', type: 'in', value: 0, relX: 0, relY: 0.25 },
        { id: 's0', name: 'S0', type: 'in', value: 0, relX: 0, relY: 0.5 },
        { id: 's1', name: 'S1', type: 'in', value: 0, relX: 0, relY: 0.75 },
      ],
      outputs: [0, 1, 2, 3].map((i) => ({
        id: `y${i}`,
        name: `Y${i}`,
        type: 'out',
        value: 0,
        relX: 1,
        relY: (i + 1) / 5,
      })),
      state: {},
    };
  }

  if (type === 'DEMUX_1_8') {
    return {
      width: 150,
      height: 130,
      inputs: [
        { id: 'in', name: 'IN', type: 'in', value: 0, relX: 0, relY: 0.2 },
        { id: 's0', name: 'S0', type: 'in', value: 0, relX: 0, relY: 0.4 },
        { id: 's1', name: 'S1', type: 'in', value: 0, relX: 0, relY: 0.6 },
        { id: 's2', name: 'S2', type: 'in', value: 0, relX: 0, relY: 0.8 },
      ],
      outputs: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        id: `y${i}`,
        name: `Y${i}`,
        type: 'out',
        value: 0,
        relX: 1,
        relY: (i + 1) / 9,
      })),
      state: {},
    };
  }

  // Default fallback
  return {
    width: 120,
    height: 70,
    inputs: [
      { id: 'i1', name: 'A', type: 'in', value: 0, relX: 0, relY: 0.35 },
      { id: 'i2', name: 'B', type: 'in', value: 0, relX: 0, relY: 0.65 },
    ],
    outputs: [{ id: 'out', name: 'Y', type: 'out', value: 0, relX: 1, relY: 0.5 }],
    state: {},
  };
}
