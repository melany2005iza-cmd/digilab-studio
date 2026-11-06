/**
 * AdaLab Studio - Real-time Digital Logic Simulation Engine
 * 
 * Propaga señales lógicas a través de la topología de nodos y cables.
 * Soporta compuertas elementales, compuertas multi-entradas, sumadores,
 * restadores, comparadores, decodificadores, codificadores de prioridad,
 * multiplexores, demultiplexores, fuentes y displays.
 */

import { CircuitNode, Wire, LogicValue } from '../types';

// Tabla de decodificación estándar BCD a 7 Segmentos (a, b, c, d, e, f, g)
export const BCD_7SEG_DECODE: Record<number, Record<string, LogicValue>> = {
  0: { qa: 1, qb: 1, qc: 1, qd: 1, qe: 1, qf: 1, qg: 0 },
  1: { qa: 0, qb: 1, qc: 1, qd: 0, qe: 0, qf: 0, qg: 0 },
  2: { qa: 1, qb: 1, qc: 0, qd: 1, qe: 1, qf: 0, qg: 1 },
  3: { qa: 1, qb: 1, qc: 1, qd: 1, qe: 0, qf: 0, qg: 1 },
  4: { qa: 0, qb: 1, qc: 1, qd: 0, qe: 0, qf: 1, qg: 1 },
  5: { qa: 1, qb: 0, qc: 1, qd: 1, qe: 0, qf: 1, qg: 1 },
  6: { qa: 1, qb: 0, qc: 1, qd: 1, qe: 1, qf: 1, qg: 1 },
  7: { qa: 1, qb: 1, qc: 1, qd: 0, qe: 0, qf: 0, qg: 0 },
  8: { qa: 1, qb: 1, qc: 1, qd: 1, qe: 1, qf: 1, qg: 1 },
  9: { qa: 1, qb: 1, qc: 1, qd: 1, qe: 0, qf: 1, qg: 1 },
  10: { qa: 1, qb: 1, qc: 1, qd: 0, qe: 1, qf: 1, qg: 1 }, // A
  11: { qa: 0, qb: 0, qc: 1, qd: 1, qe: 1, qf: 1, qg: 1 }, // b
  12: { qa: 1, qb: 0, qc: 0, qd: 1, qe: 1, qf: 1, qg: 0 }, // C
  13: { qa: 0, qb: 1, qc: 1, qd: 1, qe: 1, qf: 0, qg: 1 }, // d
  14: { qa: 1, qb: 0, qc: 0, qd: 1, qe: 1, qf: 1, qg: 1 }, // E
  15: { qa: 1, qb: 0, qc: 0, qd: 0, qe: 1, qf: 1, qg: 1 }, // F
};

/**
 * Ejecuta una pasada de resolución completa para la red de circuito
 */
export function simulateCircuit(
  nodes: CircuitNode[],
  wires: Wire[],
  clockPulse: LogicValue = 0
): { nodes: CircuitNode[]; wires: Wire[] } {
  const newNodes = nodes.map((node) => ({
    ...node,
    inputs: node.inputs.map((pin) => ({ ...pin })),
    outputs: node.outputs.map((pin) => ({ ...pin })),
    state: { ...(node.state || {}) },
  }));

  const newWires = wires.map((wire) => ({ ...wire }));

  // Hasta 10 pasadas de relajación para propagación completa
  const MAX_PASSES = 10;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let changed = false;

    // 1. Propagar valores de salidas a entradas mediante cables
    for (const wire of newWires) {
      const fromNode = newNodes.find((n) => n.id === wire.fromNodeId);
      const toNode = newNodes.find((n) => n.id === wire.toNodeId);

      if (!fromNode || !toNode) continue;

      const fromPin = fromNode.outputs.find((p) => p.id === wire.fromPinId);
      const toPin = toNode.inputs.find((p) => p.id === wire.toPinId);

      if (fromPin && toPin) {
        wire.value = fromPin.value;
        if (toPin.value !== fromPin.value) {
          toPin.value = fromPin.value;
          changed = true;
        }
      }
    }

    // 2. Evaluar la función lógica de cada componente
    for (const node of newNodes) {
      const getIn = (pinId: string, defaultVal: LogicValue = 0): LogicValue => {
        const p = node.inputs.find((pin) => pin.id === pinId);
        return p ? p.value : defaultVal;
      };

      const setOut = (pinId: string, val: LogicValue) => {
        const p = node.outputs.find((pin) => pin.id === pinId);
        if (p && p.value !== val) {
          p.value = val;
          changed = true;
        }
      };

      const activeInputs = node.inputs.map((p) => p.value);

      switch (node.type) {
        // ── ENTRADAS Y GENERADORES ──────────────────────────
        case 'SWITCH':
        case 'BUTTON': {
          const swVal = (node.state?.value ?? 0) as LogicValue;
          setOut('out', swVal);
          break;
        }
        case 'CLOCK': {
          setOut('out', clockPulse);
          if (node.state) node.state.value = clockPulse;
          break;
        }
        case 'VCC':
        case 'HIGH_CONST': {
          setOut('out', 1);
          break;
        }
        case 'GND':
        case 'LOW_CONST': {
          setOut('out', 0);
          break;
        }
        case 'DIP_SWITCH_4': {
          const vals = node.state?.values || [0, 0, 0, 0];
          setOut('out0', vals[0] ? 1 : 0);
          setOut('out1', vals[1] ? 1 : 0);
          setOut('out2', vals[2] ? 1 : 0);
          setOut('out3', vals[3] ? 1 : 0);
          break;
        }
        case 'HEX_INPUT': {
          const hexVal = (node.state?.hexValue ?? 0) % 16;
          setOut('b0', (hexVal & 1) as LogicValue);
          setOut('b1', ((hexVal >> 1) & 1) as LogicValue);
          setOut('b2', ((hexVal >> 2) & 1) as LogicValue);
          setOut('b3', ((hexVal >> 3) & 1) as LogicValue);
          break;
        }

        // ── COMPUERTAS BÁSICAS (1 Y 2 ENTRADAS) ─────────────
        case 'BUFFER': {
          setOut('out', node.inputs[0]?.value ?? 0);
          break;
        }
        case 'NOT': {
          const inVal = node.inputs[0]?.value ?? 0;
          setOut('out', inVal === 1 ? 0 : 1);
          break;
        }
        case 'AND': {
          const result: LogicValue = activeInputs.length > 0 && activeInputs.every((v) => v === 1) ? 1 : 0;
          setOut('out', result);
          break;
        }
        case 'OR': {
          const result: LogicValue = activeInputs.some((v) => v === 1) ? 1 : 0;
          setOut('out', result);
          break;
        }
        case 'XOR': {
          const in1 = node.inputs[0]?.value ?? 0;
          const in2 = node.inputs[1]?.value ?? 0;
          setOut('out', (in1 ^ in2) as LogicValue);
          break;
        }
        case 'NAND': {
          const andRes = activeInputs.length > 0 && activeInputs.every((v) => v === 1);
          setOut('out', andRes ? 0 : 1);
          break;
        }
        case 'NOR': {
          const orRes = activeInputs.some((v) => v === 1);
          setOut('out', orRes ? 0 : 1);
          break;
        }
        case 'XNOR': {
          const in1 = node.inputs[0]?.value ?? 0;
          const in2 = node.inputs[1]?.value ?? 0;
          setOut('out', in1 === in2 ? 1 : 0);
          break;
        }

        // ── COMPUERTAS MULTI-ENTRADAS (3, 4 Y 8 ENTRADAS) ───
        case 'AND_3':
        case 'AND_4':
        case 'AND_8': {
          const res = activeInputs.length > 0 && activeInputs.every((v) => v === 1);
          setOut('out', res ? 1 : 0);
          break;
        }
        case 'OR_3':
        case 'OR_4':
        case 'OR_8': {
          const res = activeInputs.some((v) => v === 1);
          setOut('out', res ? 1 : 0);
          break;
        }
        case 'NAND_3':
        case 'NAND_4':
        case 'NAND_8': {
          const andRes = activeInputs.length > 0 && activeInputs.every((v) => v === 1);
          setOut('out', andRes ? 0 : 1);
          break;
        }
        case 'NOR_3':
        case 'NOR_4':
        case 'NOR_8': {
          const orRes = activeInputs.some((v) => v === 1);
          setOut('out', orRes ? 0 : 1);
          break;
        }
        case 'XOR_3': {
          const countOnes = activeInputs.filter((v) => v === 1).length;
          setOut('out', (countOnes % 2 === 1 ? 1 : 0) as LogicValue);
          break;
        }

        // ── SUMADORES Y ARITMÉTICA ───────────────────────────
        case 'HALF_ADDER': {
          const a = getIn('a');
          const b = getIn('b');
          setOut('s', (a ^ b) as LogicValue);
          setOut('c', (a & b) as LogicValue);
          break;
        }
        case 'FULL_ADDER': {
          const a = getIn('a');
          const b = getIn('b');
          const cin = getIn('cin');
          const sum = a ^ b ^ cin;
          const cout = (a & b) | (cin & (a ^ b));
          setOut('s', sum as LogicValue);
          setOut('cout', cout ? 1 : 0);
          break;
        }
        case 'HALF_SUBTRACTOR': {
          const a = getIn('a');
          const b = getIn('b');
          setOut('diff', (a ^ b) as LogicValue);
          setOut('bout', (a === 0 && b === 1 ? 1 : 0) as LogicValue);
          break;
        }
        case 'FULL_SUBTRACTOR': {
          const a = getIn('a');
          const b = getIn('b');
          const bin = getIn('bin');
          const diff = a ^ b ^ bin;
          const bout = ((a === 0 && b === 1) || ((a ^ b) === 0 && bin === 1)) ? 1 : 0;
          setOut('diff', diff as LogicValue);
          setOut('bout', bout as LogicValue);
          break;
        }
        case 'IC_74283': {
          const cin = getIn('in_cin');
          const a0 = getIn('in_a0');
          const b0 = getIn('in_b0');
          const a1 = getIn('in_a1');
          const b1 = getIn('in_b1');
          const a2 = getIn('in_a2');
          const b2 = getIn('in_b2');
          const a3 = getIn('in_a3');
          const b3 = getIn('in_b3');

          const valA = a0 + a1 * 2 + a2 * 4 + a3 * 8;
          const valB = b0 + b1 * 2 + b2 * 4 + b3 * 8;
          const total = valA + valB + cin;

          setOut('out_s0', (total & 1) as LogicValue);
          setOut('out_s1', ((total >> 1) & 1) as LogicValue);
          setOut('out_s2', ((total >> 2) & 1) as LogicValue);
          setOut('out_s3', ((total >> 3) & 1) as LogicValue);
          setOut('out_cout', (total >= 16 ? 1 : 0) as LogicValue);

          if (node.state) {
            node.state.displayValue = `${valA} + ${valB} + ${cin} = ${total}`;
          }
          break;
        }

        // ── COMPARADORES DE MAGNITUD ─────────────────────────
        case 'COMP_1BIT': {
          const a = getIn('a');
          const b = getIn('b');
          setOut('gt', a > b ? 1 : 0);
          setOut('eq', a === b ? 1 : 0);
          setOut('lt', a < b ? 1 : 0);
          break;
        }
        case 'COMP_2BIT': {
          const a = getIn('a0') + getIn('a1') * 2;
          const b = getIn('b0') + getIn('b1') * 2;
          setOut('gt', a > b ? 1 : 0);
          setOut('eq', a === b ? 1 : 0);
          setOut('lt', a < b ? 1 : 0);
          break;
        }
        case 'IC_7485': {
          const a = getIn('a0') + getIn('a1') * 2 + getIn('a2') * 4 + getIn('a3') * 8;
          const b = getIn('b0') + getIn('b1') * 2 + getIn('b2') * 4 + getIn('b3') * 8;
          setOut('gt', a > b ? 1 : 0);
          setOut('eq', a === b ? 1 : 0);
          setOut('lt', a < b ? 1 : 0);
          if (node.state) {
            node.state.displayValue = a > b ? 'A > B' : a === b ? 'A = B' : 'A < B';
          }
          break;
        }

        // ── DECODIFICADORES Y CONVERSORES BCD ────────────────
        case 'DEC_2_4': {
          const in0 = getIn('in0');
          const in1 = getIn('in1');
          const enPin = node.inputs.find((p) => p.id === 'en');
          const isEnabled = enPin ? enPin.value === 1 : true;
          const idx = in0 + in1 * 2;
          for (let i = 0; i < 4; i++) {
            setOut(`y${i}`, isEnabled && idx === i ? 1 : 0);
          }
          break;
        }
        case 'IC_74138': {
          const a = getIn('a');
          const b = getIn('b');
          const c = getIn('c');
          const g1 = getIn('g1', 1);
          const g2a = getIn('g2a', 0);
          const g2b = getIn('g2b', 0);
          const enabled = g1 === 1 && g2a === 0 && g2b === 0;
          const sel = a + b * 2 + c * 4;
          for (let i = 0; i < 8; i++) {
            // Salidas activas bajas (active-low standard 74138)
            setOut(`y${i}`, enabled && sel === i ? 0 : 1);
          }
          if (node.state) {
            node.state.displayValue = enabled ? `Y${sel} ACTIVA` : 'DISABLED';
          }
          break;
        }
        case 'IC_74154': {
          const a = getIn('a');
          const b = getIn('b');
          const c = getIn('c');
          const d = getIn('d');
          const enPin = node.inputs.find((p) => p.id === 'en');
          const isEnabled = enPin ? enPin.value === 1 : true;
          const activeIdx = a + b * 2 + c * 4 + d * 8;
          for (let i = 0; i < 16; i++) {
            setOut(`y${i}`, isEnabled && activeIdx === i ? 1 : 0);
          }
          if (node.state) {
            node.state.displayValue = isEnabled ? `Y${activeIdx}` : 'DISABLED';
          }
          break;
        }
        case 'BCD_7SEG':
        case 'IC_7447':
        case 'IC_7448': {
          const a = getIn('a');
          const b = getIn('b');
          const c = getIn('c');
          const d = getIn('d');
          const digit = a + b * 2 + c * 4 + d * 8;
          const segments = BCD_7SEG_DECODE[digit] || BCD_7SEG_DECODE[0];
          setOut('qa', segments.qa);
          setOut('qb', segments.qb);
          setOut('qc', segments.qc);
          setOut('qd', segments.qd);
          setOut('qe', segments.qe);
          setOut('qf', segments.qf);
          setOut('qg', segments.qg);
          if (node.state) {
            node.state.displayValue = digit <= 9 ? `${digit}` : `${digit.toString(16).toUpperCase()}`;
          }
          break;
        }
        case 'IC_7442': {
          const a = getIn('a') + getIn('b') * 2 + getIn('c') * 4 + getIn('d') * 8;
          for (let i = 0; i < 10; i++) {
            setOut(`y${i}`, a === i ? 0 : 1);
          }
          break;
        }

        // ── CODIFICADORES Y PRIORIDAD ────────────────────────
        case 'ENC_4_2': {
          let highest = -1;
          for (let i = 3; i >= 0; i--) {
            if (getIn(`i${i}`) === 1) {
              highest = i;
              break;
            }
          }
          setOut('a0', highest >= 0 ? ((highest & 1) as LogicValue) : 0);
          setOut('a1', highest >= 0 ? (((highest >> 1) & 1) as LogicValue) : 0);
          setOut('gs', highest >= 0 ? 1 : 0);
          break;
        }
        case 'ENC_8_3':
        case 'IC_74148': {
          let highest = -1;
          for (let i = 7; i >= 0; i--) {
            if (getIn(`i${i}`) === 1) {
              highest = i;
              break;
            }
          }
          if (highest >= 0) {
            setOut('a0', (highest & 1) as LogicValue);
            setOut('a1', ((highest >> 1) & 1) as LogicValue);
            setOut('a2', ((highest >> 2) & 1) as LogicValue);
          } else {
            setOut('a0', 0);
            setOut('a1', 0);
            setOut('a2', 0);
          }
          if (node.state) {
            node.state.displayValue = highest >= 0 ? `I${highest} → ${highest}` : 'None';
          }
          break;
        }
        case 'IC_74147': {
          let highest = 0;
          for (let i = 9; i >= 1; i--) {
            if (getIn(`i${i}`) === 1) {
              highest = i;
              break;
            }
          }
          setOut('a', (highest & 1) as LogicValue);
          setOut('b', ((highest >> 1) & 1) as LogicValue);
          setOut('c', ((highest >> 2) & 1) as LogicValue);
          setOut('d', ((highest >> 3) & 1) as LogicValue);
          break;
        }

        // ── MULTIPLEXORES Y DEMULTIPLEXORES ──────────────────
        case 'MUX_2_1': {
          const d0 = getIn('d0');
          const d1 = getIn('d1');
          const s = getIn('s');
          setOut('y', s === 1 ? d1 : d0);
          break;
        }
        case 'MUX_4_1': {
          const d0 = getIn('d0');
          const d1 = getIn('d1');
          const d2 = getIn('d2');
          const d3 = getIn('d3');
          const s0 = getIn('s0');
          const s1 = getIn('s1');
          const sel = s0 + s1 * 2;
          const res = sel === 0 ? d0 : sel === 1 ? d1 : sel === 2 ? d2 : d3;
          setOut('y', res);
          if (node.state) {
            node.state.displayValue = `D${sel} = ${res}`;
          }
          break;
        }
        case 'IC_74151': {
          const sel = getIn('s0') + getIn('s1') * 2 + getIn('s2') * 4;
          const strobe = getIn('strobe', 0);
          const selVal = getIn(`d${sel}`);
          const yVal = strobe === 0 ? selVal : 0;
          setOut('y', yVal as LogicValue);
          setOut('w', (yVal === 1 ? 0 : 1) as LogicValue);
          break;
        }
        case 'DEMUX_1_2': {
          const inputVal = getIn('in');
          const s = getIn('s');
          setOut('y0', s === 0 ? inputVal : 0);
          setOut('y1', s === 1 ? inputVal : 0);
          break;
        }
        case 'DEMUX_1_4': {
          const inputVal = getIn('in');
          const s0 = getIn('s0');
          const s1 = getIn('s1');
          const sel = s0 + s1 * 2;
          for (let i = 0; i < 4; i++) {
            setOut(`y${i}`, sel === i ? inputVal : 0);
          }
          break;
        }
        case 'DEMUX_1_8': {
          const inputVal = getIn('in');
          const s0 = getIn('s0');
          const s1 = getIn('s1');
          const s2 = getIn('s2');
          const sel = s0 + s1 * 2 + s2 * 4;
          for (let i = 0; i < 8; i++) {
            setOut(`y${i}`, sel === i ? inputVal : 0);
          }
          break;
        }

        // ── SALIDAS VISUALES E INDICADORES ───────────────────
        case 'LED': {
          const inVal = node.inputs[0]?.value ?? 0;
          if (node.state) node.state.value = inVal;
          break;
        }
        case 'LED_BAR': {
          if (node.state) {
            node.state.values = node.inputs.map((p) => p.value);
          }
          break;
        }
        case 'SEVEN_SEG': {
          const sa = getIn('sa');
          const sb = getIn('sb');
          const sc = getIn('sc');
          const sd = getIn('sd');
          const se = getIn('se');
          const sf = getIn('sf');
          const sg = getIn('sg');

          if (node.state) {
            node.state.segments = { sa, sb, sc, sd, se, sf, sg };
            let matched = '-';
            for (let d = 0; d < 16; d++) {
              const ref = BCD_7SEG_DECODE[d];
              if (
                ref.qa === sa &&
                ref.qb === sb &&
                ref.qc === sc &&
                ref.qd === sd &&
                ref.qe === se &&
                ref.qf === sf &&
                ref.qg === sg
              ) {
                matched = d <= 9 ? `${d}` : d.toString(16).toUpperCase();
                break;
              }
            }
            node.state.displayValue = matched;
          }
          break;
        }
        case 'BCD_DISPLAY': {
          const val = getIn('a') + getIn('b') * 2 + getIn('c') * 4 + getIn('d') * 8;
          if (node.state) {
            node.state.displayValue = val <= 9 ? `${val}` : val.toString(16).toUpperCase();
          }
          break;
        }
        case 'PROBE': {
          const inVal = node.inputs[0]?.value ?? 0;
          if (node.state) node.state.value = inVal;
          break;
        }
        case 'BUZZER': {
          const inVal = node.inputs[0]?.value ?? 0;
          if (node.state) node.state.active = inVal === 1;
          break;
        }

        default:
          break;
      }
    }

    if (!changed) break;
  }

  return { nodes: newNodes, wires: newWires };
}
