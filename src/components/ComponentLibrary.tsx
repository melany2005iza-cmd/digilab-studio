/**
 * AdaLab Studio - Collapsible Component Library Sidebar
 * 
 * Catálogo de componentes digitales clasificado por categorías desplegables:
 * 1. Compuertas Básicas (1 y 2 Entradas)
 * 2. Compuertas Multi-Entradas (3, 4 y 8 Entradas)
 * 3. Aritmética, Sumadores y Restadores
 * 4. Comparadores de Magnitud
 * 5. Decodificadores y Conversores BCD
 * 6. Codificadores de Prioridad MSI
 * 7. Multiplexores y Demultiplexores
 * 8. Entradas y Generadores de Señal
 * 9. Salidas, Indicadores y Displays
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Layers,
  Cpu,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { NODE_TO_HIERARCHY_MAP } from '../constants/hierarchyData';

interface ComponentLibraryProps {
  onAddComponent: (type: string, label: string) => void;
}

export interface CatalogItem {
  type: string;
  label: string;
  code?: string;
  description: string;
  isHierarchical?: boolean;
}

export interface CategoryGroup {
  id: string;
  title: string;
  iconName: string;
  badgeColor?: string;
  items: CatalogItem[];
}

export const CATEGORIES: CategoryGroup[] = [
  // 1. COMPUERTAS BÁSICAS
  {
    id: 'basic_gates',
    title: 'Compuertas Básicas',
    iconName: 'gate',
    items: [
      { type: 'NOT', label: 'Inversor NOT', code: '74LS04', description: 'Y = ~A (Negación lógica)' },
      { type: 'BUFFER', label: 'Buffer Seguidor', code: '74LS07', description: 'Y = A (Aislamiento de señal)' },
      { type: 'AND', label: 'Compuerta AND (2 Entradas)', code: '74LS08', description: 'Y = A · B (Producto lógico)' },
      { type: 'OR', label: 'Compuerta OR (2 Entradas)', code: '74LS32', description: 'Y = A + B (Suma lógica)' },
      { type: 'NAND', label: 'Compuerta NAND (2 Entradas)', code: '74LS00', description: 'Y = ~(A · B) (Inversa de AND)' },
      { type: 'NOR', label: 'Compuerta NOR (2 Entradas)', code: '74LS02', description: 'Y = ~(A + B) (Inversa de OR)' },
      { type: 'XOR', label: 'Compuerta XOR (2 Entradas)', code: '74LS86', description: 'Y = A ⊕ B (OR Exclusiva)' },
      { type: 'XNOR', label: 'Compuerta XNOR (2 Entradas)', code: '74LS266', description: 'Y = A ⊙ B (Equivalencia)' },
    ],
  },

  // 2. COMPUERTAS MULTI-ENTRADAS
  {
    id: 'multi_gates',
    title: 'Compuertas Multi-Entradas',
    iconName: 'multi_gate',
    items: [
      { type: 'AND_3', label: 'AND de 3 Entradas', code: '74LS11', description: 'Y = A · B · C' },
      { type: 'AND_4', label: 'AND de 4 Entradas', code: '74LS21', description: 'Y = A · B · C · D' },
      { type: 'NAND_3', label: 'NAND de 3 Entradas', code: '74LS10', description: 'Y = ~(A · B · C)' },
      { type: 'NAND_4', label: 'NAND de 4 Entradas', code: '74LS20', description: 'Y = ~(A · B · C · D)' },
      { type: 'NAND_8', label: 'NAND de 8 Entradas', code: '74LS30', description: 'Y = ~(A · B · C · D · E · F · G · H)' },
      { type: 'OR_3', label: 'OR de 3 Entradas', code: 'OR 3-In', description: 'Y = A + B + C' },
      { type: 'OR_4', label: 'OR de 4 Entradas', code: 'OR 4-In', description: 'Y = A + B + C + D' },
      { type: 'NOR_3', label: 'NOR de 3 Entradas', code: '74LS27', description: 'Y = ~(A + B + C)' },
      { type: 'NOR_4', label: 'NOR de 4 Entradas', code: '74LS260', description: 'Y = ~(A + B + C + D)' },
      { type: 'XOR_3', label: 'XOR de 3 Entradas', code: 'XOR 3-In', description: 'Paridad impar de 3 entradas' },
    ],
  },

  // 3. ARITMÉTICA, SUMADORES Y RESTADORES
  {
    id: 'arithmetic',
    title: 'Sumadores y Aritmética',
    iconName: 'adder',
    items: [
      { type: 'HALF_ADDER', label: 'Medio Sumador (HA 1-bit)', code: 'Half Adder', description: 'Suma básica de 2 bits: Suma y Acarreo', isHierarchical: true },
      { type: 'FULL_ADDER', label: 'Sumador Completo (FA 1-bit)', code: 'Full Adder', description: 'Suma de 3 bits con acarreo de entrada (Cin)', isHierarchical: true },
      { type: 'IC_74283', label: 'Sumador de 4 Bits con Carry', code: 'CI 74LS283', description: 'Sumador binario comercial con acarreo anticipado (N1-N4)', isHierarchical: true },
      { type: 'HALF_SUBTRACTOR', label: 'Medio Restador (HS 1-bit)', code: 'Half Sub', description: 'Resta binaria: Diferencia y Préstamo (Bout)' },
      { type: 'FULL_SUBTRACTOR', label: 'Restador Completo (FS 1-bit)', code: 'Full Sub', description: 'Resta de 3 bits con préstamo previo (Bin)' },
    ],
  },

  // 4. COMPARADORES DE MAGNITUD
  {
    id: 'comparators',
    title: 'Comparadores de Magnitud',
    iconName: 'comparator',
    items: [
      { type: 'COMP_1BIT', label: 'Comparador de 1 Bit', code: '1-Bit CMP', description: 'Determina si A > B, A = B o A < B' },
      { type: 'COMP_2BIT', label: 'Comparador de 2 Bits', code: '2-Bit CMP', description: 'Compara dos palabras de 2 bits' },
      { type: 'IC_7485', label: 'Comparador de 4 Bits', code: 'CI 74LS85', description: 'Comparador de magnitud comercial con entradas en cascada (N1-N2)', isHierarchical: true },
    ],
  },

  // 5. DECODIFICADORES Y CONVERSORES BCD
  {
    id: 'decoders',
    title: 'Decodificadores y BCD',
    iconName: 'decoder',
    items: [
      { type: 'DEC_2_4', label: 'Decodificador 2 a 4', code: 'DEC 2:4', description: 'Decodifica 2 bits a 4 líneas con Enable', isHierarchical: true },
      { type: 'IC_74138', label: 'Decodificador 3 a 8', code: 'CI 74LS138', description: 'Decodificador/Demux de 3 a 8 con 3 entradas de Enable' },
      { type: 'IC_74154', label: 'Decodificador 4 a 16', code: 'CI 74LS154', description: 'Decodificador comercial de 4 a 16 líneas (DIP-24, N1-N3)', isHierarchical: true },
      { type: 'BCD_7SEG', label: 'Decodificador BCD a 7-Seg', code: 'CI 74LS47', description: 'Convierte código BCD (A, B, C, D) a salidas de display a–g', isHierarchical: true },
      { type: 'IC_7448', label: 'Decodificador BCD (Cátodo)', code: 'CI 74LS48', description: 'Decodificador BCD para displays de cátodo común' },
      { type: 'IC_7442', label: 'Decodificador BCD a Decimal', code: 'CI 74LS42', description: '1 de 10 salidas activas para dígitos 0 al 9' },
    ],
  },

  // 6. CODIFICADORES Y PRIORIDAD MSI
  {
    id: 'encoders',
    title: 'Codificadores y Prioridad',
    iconName: 'encoder',
    items: [
      { type: 'ENC_4_2', label: 'Codificador 4 a 2', code: 'ENC 4:2', description: 'Codifica 4 líneas a 2 bits de salida' },
      { type: 'ENC_8_3', label: 'Codificador de Prioridad 8:3', code: 'CI 74LS148', description: 'Codifica la entrada activa de mayor orden a 3 bits (N1-N2)', isHierarchical: true },
      { type: 'IC_74147', label: 'Codificador 10 a 4 (BCD)', code: 'CI 74LS147', description: 'Codificador de prioridad de 10 líneas decimales a BCD' },
    ],
  },

  // 7. MULTIPLEXORES Y DEMULTIPLEXORES
  {
    id: 'mux_demux',
    title: 'Multiplexores y Demux',
    iconName: 'mux',
    items: [
      { type: 'MUX_2_1', label: 'Multiplexor 2 a 1', code: 'MUX 2:1', description: 'Selector de 2 entradas de datos con 1 línea de selección' },
      { type: 'MUX_4_1', label: 'Multiplexor 4 a 1', code: 'MUX 4:1', description: 'Selector de 4 canales con 2 selectores S0, S1 (N1-N2)', isHierarchical: true },
      { type: 'IC_74151', label: 'Multiplexor 8 a 1', code: 'CI 74LS151', description: 'Selector de 8 entradas con salidas complementarias Y y W' },
      { type: 'DEMUX_1_2', label: 'Demultiplexor 1 a 2', code: 'DEMUX 1:2', description: 'Enruta 1 entrada a una de 2 salidas' },
      { type: 'DEMUX_1_4', label: 'Demultiplexor 1 a 4', code: 'DEMUX 1:4', description: 'Enruta 1 entrada a una de 4 salidas según selector' },
      { type: 'DEMUX_1_8', label: 'Demultiplexor 1 a 8', code: 'DEMUX 1:8', description: 'Distribuidor de datos de 1 a 8 líneas' },
    ],
  },

  // 8. ENTRADAS Y FUENTES
  {
    id: 'inputs_sources',
    title: 'Entradas y Fuentes',
    iconName: 'input',
    items: [
      { type: 'SWITCH', label: 'Interruptor Digital (Switch)', code: 'Switch', description: 'Entrada manual conmutable 0 o 1' },
      { type: 'BUTTON', label: 'Pulsador Momentáneo', code: 'Button', description: 'Emite 1 lógico solo mientras se pulsa' },
      { type: 'CLOCK', label: 'Generador de Reloj Digital', code: 'Clock', description: 'Pulsos de onda cuadrada a frecuencia constante' },
      { type: 'VCC', label: 'Alimentación VCC (+5V)', code: 'VCC', description: 'Nivel lógico ALTO permanente (+5V constante 1)' },
      { type: 'GND', label: 'Tierra GND (0V)', code: 'GND', description: 'Nivel de referencia a tierra (0V constante 0)' },
      { type: 'HIGH_CONST', label: 'Constante Alta (1)', code: 'HIGH', description: 'Nivel lógico ALTO (1)' },
      { type: 'LOW_CONST', label: 'Constante Baja (0)', code: 'LOW', description: 'Nivel lógico BAJO (0)' },
      { type: 'DIP_SWITCH_4', label: 'Dip-Switch de 4 Bits', code: 'DIP-4', description: 'Banco de 4 interruptores independientes' },
      { type: 'HEX_INPUT', label: 'Selector Hexadecimal (0-F)', code: 'HEX Bus', description: 'Genera una palabra binaria de 4 bits' },
    ],
  },

  // 9. SALIDAS, INDICADORES Y DISPLAYS
  {
    id: 'outputs_displays',
    title: 'Salidas y Displays',
    iconName: 'output',
    items: [
      { type: 'LED', label: 'Diodo LED Luminoso', code: 'LED', description: 'Indicador visual de estado lógico en rosa radiante' },
      { type: 'LED_BAR', label: 'Barra de 4 LEDs (Bus)', code: 'LED Bar', description: 'Monitor visual simultáneo para 4 bits' },
      { type: 'SEVEN_SEG', label: 'Display de 7 Segmentos', code: '7-Seg', description: 'Visualizador numérico a-g de cátodo/ánodo común' },
      { type: 'BCD_DISPLAY', label: 'Display BCD Integrado', code: 'BCD Num', description: 'Display con decodificador interno directo 0-F' },
      { type: 'PROBE', label: 'Sonda Lógica Digital', code: 'Probe', description: 'Punto de prueba con lectura de nivel 0 o 1' },
      { type: 'BUZZER', label: 'Zumbador Lógico', code: 'Buzzer', description: 'Indicador acústico/luminoso al activarse en 1' },
    ],
  },
];

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddComponent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado de los menús desplegables: por defecto, las categorías principales están abiertas
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    multi_gates: true,
    comparators: true,
    mux_demux: true,
  });

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    CATEGORIES.forEach((c) => {
      allCollapsed[c.id] = true;
    });
    setCollapsedCategories(allCollapsed);
  };

  // Filtrado reactivo de categorías y componentes
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES;

    const query = searchQuery.toLowerCase().trim();
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.code && item.code.toLowerCase().includes(query))
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  // Si hay búsqueda activa, expandir automáticamente las categorías con coincidencias
  const isSearching = searchQuery.trim().length > 0;

  return (
    <aside className="w-80 h-full bg-[#fff4f9]/95 dark:bg-[#312342]/95 border-r-2 border-[#f9a8d4]/60 dark:border-pink-400/30 p-3.5 flex flex-col justify-between select-none backdrop-blur-md shadow-sm">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Cabecera del catálogo */}
        <div className="pb-3 border-b border-[#f9a8d4]/50 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#59324c] dark:text-pink-100 tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#ec4899]" />
              <span>Biblioteca de Componentes</span>
            </h2>
            <span className="text-[10px] font-mono text-[#be185d] bg-[#fce7f3] dark:bg-pink-900/40 dark:text-pink-200 px-2 py-0.5 rounded-full border border-[#f9a8d4]/60">
              {CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)} Modelos
            </span>
          </div>

          {/* Buscador reactivo */}
          <div className="relative mt-2.5">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#d977a6]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar CI, compuerta, MUX, sumador..."
              className="w-full bg-white dark:bg-purple-950/40 border border-[#f9a8d4] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#59324c] dark:text-pink-100 placeholder-[#b886a6] focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-pink-200/60 transition-all shadow-inner"
            />
          </div>

          {/* Controles rápidos de despliegue */}
          <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-[#8a5a7a] dark:text-pink-300/70 font-semibold">
            <span>{filteredCategories.length} Categorías</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="hover:text-[#be185d] dark:hover:text-pink-100 transition-colors flex items-center gap-0.5"
                title="Expandir todas las categorías"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Expandir</span>
              </button>
              <span className="text-[#f9a8d4]">·</span>
              <button
                type="button"
                onClick={collapseAll}
                className="hover:text-[#be185d] dark:hover:text-pink-100 transition-colors flex items-center gap-0.5"
                title="Colapsar todas las categorías"
              >
                <Minimize2 className="w-3 h-3" />
                <span>Colapsar</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── LISTA DE MENÚS DESPLEGABLES / CATEGORÍAS ACCORDION ── */}
        <div className="flex-1 overflow-y-auto pt-2.5 space-y-2 pr-1">
          {filteredCategories.map((cat) => {
            const isCollapsed = isSearching ? false : !!collapsedCategories[cat.id];

            return (
              <div
                key={cat.id}
                className="border border-[#f9a8d4]/70 dark:border-pink-400/25 rounded-2xl overflow-hidden bg-[#fff9fc] dark:bg-purple-950/30 shadow-xs transition-colors"
              >
                {/* Cabecera desplegable de categoría */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full px-3 py-2 flex items-center justify-between text-left bg-gradient-to-r from-[#fdf2f8] to-[#faf5ff] dark:from-purple-900/40 dark:to-pink-950/30 hover:from-[#fce7f3] hover:to-[#f3e8ff] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-[#ec4899] shrink-0 transition-transform" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#ec4899] shrink-0 transition-transform" />
                    )}
                    <span className="text-xs font-bold text-[#59324c] dark:text-pink-100 tracking-tight">
                      {cat.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-white dark:bg-purple-900/60 text-[#be185d] dark:text-pink-200 border border-[#f9a8d4]">
                    {cat.items.length}
                  </span>
                </button>

                {/* Lista de componentes dentro de la categoría desplegada */}
                {!isCollapsed && (
                  <div className="p-2 space-y-1.5 border-t border-[#f9a8d4]/40 bg-[#fffafd] dark:bg-transparent">
                    {cat.items.map((item) => {
                      const hasHierarchy = item.isHierarchical || !!NODE_TO_HIERARCHY_MAP[item.type];

                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => onAddComponent(item.type, item.label)}
                          className="w-full text-left p-2 rounded-xl border border-[#fbcfe8] dark:border-pink-400/20 bg-white dark:bg-[#2a1d3a] hover:bg-gradient-to-r hover:from-[#fdf2f8] hover:to-[#faf5ff] dark:hover:bg-purple-900/50 hover:border-[#f472b6] hover:shadow-sm transition-all flex flex-col gap-0.5 group active:scale-98"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-[#59324c] dark:text-pink-100 group-hover:text-[#be185d] dark:group-hover:text-pink-200 transition-colors truncate">
                              {item.label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {item.code && (
                                <span className="text-[9px] font-mono text-[#9d6589] dark:text-pink-300/70 bg-[#fdf2f8] dark:bg-purple-950 px-1.5 py-0.2 rounded-md border border-[#fbcfe8]/70">
                                  {item.code}
                                </span>
                              )}
                              {hasHierarchy && (
                                <span
                                  className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-[#fce7f3] to-[#f3e8ff] dark:bg-rose-950/80 text-[#be185d] dark:text-rose-200 border border-[#f9a8d4] text-[9px] font-mono font-bold flex items-center gap-0.5"
                                  title="Exploración jerárquica multinivel (Doble Clic)"
                                >
                                  <Layers className="w-2.5 h-2.5 text-[#ec4899]" />
                                  <span>Interior</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[10px] text-[#8a5a7a] dark:text-pink-300/60 group-hover:text-[#6e4160] transition-colors line-clamp-1">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-xs text-[#a37092]">
              No se encontraron componentes para "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Pie informativo */}
      <div className="border-t border-[#f9a8d4]/50 pt-2.5 text-[11px] text-[#8a5a7a] dark:text-pink-300/60 flex items-center justify-between font-mono">
        <span>Clic para añadir</span>
        <span className="text-[#db2777] dark:text-pink-300 font-bold bg-[#fce7f3] dark:bg-pink-900/40 px-2 py-0.5 rounded-full">+ Lienzo</span>
      </div>
    </aside>
  );
};
