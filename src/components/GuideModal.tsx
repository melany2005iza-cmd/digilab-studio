/**
 * AdaLab Studio - Interactive User Guide & Onboarding Tour Modal
 * 
 * Guía interactiva paso a paso para enseñar al usuario cómo:
 * 1. Agregar y organizar componentes desde las 9 categorías desplegables.
 * 2. Conectar cables ortogonales a 90° sin curvas (estilo PCB).
 * 3. Ejecutar la Exploración Jerárquica Multinivel ("Ver Interior" / Drill-Down).
 * 4. Navegar entre niveles de abstracción con las píldoras y regresar intacto.
 * 5. Consultar fichas técnicas, ecuaciones booleanas y tablas de verdad en el Inspector.
 * 6. Controlar la simulación en tiempo real y usar los atajos de teclado.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Zap,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Table,
  CheckCircle2,
  Sparkles,
  MousePointer,
  HelpCircle,
  Play,
  RotateCcw,
  Sliders,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPreset?: (familyId: string) => void;
}

interface Step {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  content: string;
  bullets: { title: string; desc: string; icon?: string }[];
  highlightTip: string;
  visualTag: string;
}

const GUIDE_STEPS: Step[] = [
  {
    id: 'intro',
    badge: 'Paso 1 · Bienvenida',
    title: 'Bienvenida a AdaLab Studio',
    subtitle: 'Simulador de circuitos lógicos con exploración jerárquica multinivel',
    content:
      'AdaLab Studio te permite diseñar, simular y descomponer circuitos integrados digitales MSI en tiempo real, con diseño elegante en amatista y oro rosa, conexiones Manhattan ortogonales sin curvas y análisis profundo de componentes.',
    bullets: [
      {
        title: 'Exploración Jerárquica ("Ver Interior")',
        desc: 'Desciende desde el encapsulado comercial comercial MSI (DIP) hasta sus compuertas lógicas elementales.',
      },
      {
        title: 'Conexiones PCB Ortogonales a 90°',
        desc: 'Trazos estrictamente rectilíneos sin curvas Bézier con animación de propagación en rosa neón.',
      },
      {
        title: 'Simulación Continua a 60 FPS',
        desc: 'Resolución lógica instantánea para entradas manuales, relojes, contadores y decodificadores.',
      },
    ],
    highlightTip: '💡 Puedes volver a abrir esta guía en cualquier momento pulsando el botón "¿Cómo Usar?" en la barra superior.',
    visualTag: 'INTRO',
  },
  {
    id: 'catalog',
    badge: 'Paso 2 · Componentes',
    title: 'Biblioteca de Componentes Desplegable',
    subtitle: '9 familias lógicas organizadas en menús acordeón colapsables',
    content:
      'En el panel izquierdo encontrarás más de 40 componentes organizados meticulosamente según su clasificación técnica:',
    bullets: [
      {
        title: 'Menús Accordion Desplegables',
        desc: 'Haz clic en cualquier categoría para expandir o contraer sus componentes. Usa los botones "Expandir" o "Colapsar" para gestionar todas a la vez.',
      },
      {
        title: 'Buscador Reactivo Inteligente',
        desc: 'Escribe el código comercial (ej: 74LS283, 74LS47, 74LS138) o el nombre funcional (ej: multiplexor, sumador, XOR) para filtrar al instante.',
      },
      {
        title: 'Insignia "Drill-Down"',
        desc: 'Los componentes con insignia de capas contienen arquitectura interna multinivel lista para explorar.',
      },
      {
        title: 'Agregar al Lienzo',
        desc: 'Haz un solo clic sobre cualquier elemento del catálogo y aparecerá centrado en tu pizarra de trabajo.',
      },
    ],
    highlightTip: '💡 Encuentras compuertas de hasta 8 entradas, restadores, displays de 7 segmentos y decodificadores MSI.',
    visualTag: 'CATALOG',
  },
  {
    id: 'wiring',
    badge: 'Paso 3 · Cableado Ortogonal',
    title: 'Conexiones Rectilíneas a 90° (Sin Curvas)',
    subtitle: 'Trazado Manhattan de alta precisión estilo pista de circuito impreso',
    content:
      'Las señales lógicas viajan a través de pistas perfectamente ortogonales para una visualización técnica limpia y profesional:',
    bullets: [
      {
        title: 'Iniciar un Cable',
        desc: 'Haz clic sobre cualquier terminal de Salida (lado derecho de compuertas y CIs con contacto metálico oro rosa) y arrastra el ratón.',
      },
      {
        title: 'Conectar a una Entrada',
        desc: 'Suelta el botón del ratón sobre un pin de Entrada (lado izquierdo) de otro componente para fijar la conexión.',
      },
      {
        title: 'Niveles Lógicos Visibles',
        desc: 'Las pistas en estado ALTO (1 / +5V) brillan con un resplandor rosa neón (#f43f5e), mientras que las líneas en estado BAJO (0 / 0V) permanecen en tono violeta oscuro.',
      },
      {
        title: 'Inspeccionar o Eliminar Conexiones',
        desc: 'Haz clic sobre cualquier cable para seleccionarlo, ver sus nodos de origen y destino en el Inspector, o eliminarlo con la tecla Supr.',
      },
    ],
    highlightTip: '💡 Presiona la tecla "W" para activar rápidamente la herramienta de cableado o "V" para volver a selección.',
    visualTag: 'WIRING',
  },
  {
    id: 'drilldown',
    badge: 'Paso 4 · Ver Interior',
    title: 'Exploración Jerárquica Multinivel (Drill-Down)',
    subtitle: 'Descompón circuitos MSI complejos hasta compuertas elementales',
    content:
      'La función central de AdaLab Studio permite desarmar la abstracción de los circuitos integrados en sus componentes internos:',
    bullets: [
      {
        title: 'Método 1: Doble Clic Directo',
        desc: 'Haz doble clic sobre el cuerpo cerámico de cualquier CI compatible (ej: Sumador 74LS283, BCD 74LS47, Comparador 74LS85, MUX 4:1).',
      },
      {
        title: 'Método 2: Botón Contextual en la Sub-barra',
        desc: 'Al seleccionar un CI jerárquico, aparecerá el botón "Ver Interior (N2)" con ícono de capas en la esquina superior izquierda.',
      },
      {
        title: 'Método 3: Tarjeta en el Inspector',
        desc: 'El panel derecho describe detalladamente qué contiene el interior del componente y ofrece un botón de acceso directo.',
      },
    ],
    highlightTip: '💡 Puedes probar de inmediato con el Sumador de 4 Bits que viene precargado en el lienzo.',
    visualTag: 'DRILLDOWN',
  },
  {
    id: 'navigation',
    badge: 'Paso 5 · Navegación Simétrica',
    title: 'Controles Compactos y Retorno Simétrico',
    subtitle: 'Navega con las píldoras de nivel y restaura tu circuito original intacto',
    content:
      'Al entrar a un nivel interior, la sub-barra compacta superior izquierda muestra la barra de navegación en una sola línea:',
    bullets: [
      {
        title: 'Píldoras Interactivas [N1] → [N2] → [N3] → [N4]',
        desc: 'Haz clic en cualquier píldora para saltar directamente a ese nivel de abstracción dentro de la misma familia.',
      },
      {
        title: 'Subir (< Mayor) y Bajar (Menor >)',
        desc: 'Avanza o retrocede paso a paso entre niveles sin saltar a otra familia de circuitos.',
      },
      {
        title: 'Botón [Volver] (Snapshot Simétrico)',
        desc: 'Al presionar "Volver" o regresar al nivel N1, se restaura exactamente tu circuito original previo con todos sus cables, interruptores y posiciones intactos.',
      },
      {
        title: 'Simulación Activa en Todos los Niveles',
        desc: 'Cada nivel intermedio e interior es un circuito 100% funcional: puedes activar interruptores y ver los LEDs responder en tiempo real.',
      },
    ],
    highlightTip: '💡 Cada nivel tiene un tooltip descriptivo al pasar el ratón (ej: "N2 · 4 Sumadores Completos en cascada").',
    visualTag: 'NAV',
  },
  {
    id: 'inspector',
    badge: 'Paso 6 · Inspector y Fichas',
    title: 'Fichas Técnicas, Ecuaciones y Tablas de Verdad',
    subtitle: 'Análisis detallado de características eléctricas y lógicas',
    content:
      'Al hacer clic en cualquier componente o cable en el lienzo, el Inspector lateral se actualiza con datos de ingeniería:',
    bullets: [
      {
        title: 'Ficha Técnica de Fabricante',
        desc: 'Código de CI, familia TTL Schottky, encapsulado DIP, tiempo de retardo de propagación (tpd), consumo en mW y tensión Vcc.',
      },
      {
        title: 'Ecuación Booleana',
        desc: 'Expresión algebraica de conmutación exacta en formato matemático.',
      },
      {
        title: 'Tabla de Verdad con Resaltado en Vivo',
        desc: 'Muestra todas las combinaciones de entrada/salida y resalta en tiempo real la fila correspondiente a las entradas actuales.',
      },
      {
        title: 'Monitor de Pines en Tiempo Real',
        desc: 'Monitorea con precisión de milisegundos el valor lógico (0 o 1) de cada terminal de entrada y salida.',
      },
      {
        title: 'Controles Rápidos',
        desc: 'Conmuta switches directamente desde el inspector, cambia la paleta de colores de los LEDs y edita etiquetas.',
      },
    ],
    highlightTip: '💡 Si haces clic en un cable de conexión, el inspector te indicará sus nodos extremos y estado de tensión.',
    visualTag: 'SPECS',
  },
  {
    id: 'shortcuts',
    badge: 'Paso 7 · Atajos y Exportación',
    title: 'Atajos de Teclado y Descarga Autónoma',
    subtitle: 'Flujo de trabajo ágil y portabilidad total',
    content:
      'Optimiza tu productividad en el laboratorio virtual con los atajos rápidos y guarda tus proyectos:',
    bullets: [
      {
        title: 'V — Herramienta Selección',
        desc: 'Permite seleccionar componentes, arrastrarlos y cambiar sus propiedades.',
      },
      {
        title: 'W — Herramienta Cableado',
        desc: 'Modo para trazar cables entre pines sin mover componentes accidentalmente.',
      },
      {
        title: 'H / Rueda Central — Mover Lienzo (Pan)',
        desc: 'Desplaza el lienzo infinito de trabajo con suavidad.',
      },
      {
        title: 'Supr / Backspace — Eliminar',
        desc: 'Elimina el componente o cable seleccionado.',
      },
      {
        title: 'Doble Clic — Ver Interior',
        desc: 'Desciende un nivel en la jerarquía del componente seleccionado.',
      },
      {
        title: 'Botón "Descargar HTML"',
        desc: 'Exporta toda la aplicación como un archivo HTML único autocontenido (sin dependencias externas) que funciona offline.',
      },
    ],
    highlightTip: '💡 Puedes cargar en cualquier instante 5 circuitos preconfigurados desde el menú superior (74LS283, 74LS47, 74LS154, 74LS85, MUX 4:1).',
    visualTag: 'KEYS',
  },
];

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onOpenPreset,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentStepIdx < GUIDE_STEPS.length - 1) {
        setCurrentStepIdx((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIdx > 0) {
        setCurrentStepIdx((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIdx, onClose]);

  if (!isOpen) return null;

  const currentStep = GUIDE_STEPS[currentStepIdx];
  const isLastStep = currentStepIdx === GUIDE_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#59324c]/35 backdrop-blur-sm animate-fadeIn">
      {/* Caja modal con diseño en rosa pastel y lavanda suave */}
      <div
        className="relative w-full max-w-2xl bg-[#fff7fb] dark:bg-[#312342] border-2 border-[#f9a8d4] rounded-3xl shadow-2xl shadow-pink-200/80 overflow-hidden flex flex-col max-h-[90vh] text-[#59324c] dark:text-pink-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        {/* Encabezado con efecto pastel */}
        <div className="px-6 py-4 border-b border-[#f9a8d4]/60 bg-gradient-to-r from-[#fce7f3] via-[#fdf2f8] to-[#f3e8ff] dark:from-purple-900/60 dark:to-pink-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f472b6] to-[#c084fc] flex items-center justify-center text-white shadow-md shadow-pink-300/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#be185d] dark:text-pink-300 font-bold block">
                Guía de Usuario Interactiva
              </span>
              <h2 id="guide-title" className="text-base font-bold text-[#59324c] dark:text-pink-100 leading-tight">
                Cómo Usar AdaLab Studio
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/80 hover:bg-[#fce7f3] text-[#be185d] border border-[#f9a8d4] flex items-center justify-center transition-colors"
            title="Cerrar guía (Esc)"
            aria-label="Cerrar guía"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de progreso de pasos */}
        <div className="px-6 py-2.5 bg-[#fdf2f8] dark:bg-[#2a1d3a] border-b border-[#f9a8d4]/50 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {GUIDE_STEPS.map((s, idx) => {
              const isActive = idx === currentStepIdx;
              const isPassed = idx < currentStepIdx;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] transition-all whitespace-nowrap flex items-center gap-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f472b6] to-[#c084fc] text-white font-bold shadow-xs'
                      : isPassed
                      ? 'bg-[#fce7f3] text-[#be185d] hover:bg-[#fbcfe8]'
                      : 'bg-white text-[#9d6589] hover:text-[#be185d] border border-[#fbcfe8]'
                  }`}
                  title={s.title}
                >
                  <span>{idx + 1}</span>
                  <span className="hidden sm:inline truncate max-w-[70px]">{s.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[#8a5a7a] dark:text-pink-300 text-[11px] font-bold shrink-0 ml-2">
            Paso {currentStepIdx + 1} de {GUIDE_STEPS.length}
          </span>
        </div>

        {/* Contenido deslizable del paso actual */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Título del paso */}
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#be185d] font-bold bg-[#fce7f3] border border-[#f9a8d4] px-2.5 py-0.5 rounded-full inline-block">
              {currentStep.badge}
            </span>
            <h3 className="text-lg font-bold text-[#59324c] dark:text-pink-50 mt-1.5">
              {currentStep.title}
            </h3>
            <p className="text-xs text-[#be185d] dark:text-pink-200 mt-0.5 font-semibold">
              {currentStep.subtitle}
            </p>
          </div>

          <p className="text-xs text-[#6e4160] dark:text-pink-200/90 leading-relaxed">
            {currentStep.content}
          </p>

          {/* Lista de características explicadas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {currentStep.bullets.map((b, bIdx) => (
              <div
                key={bIdx}
                className="p-3 rounded-2xl bg-white dark:bg-purple-950/30 border border-[#f9a8d4]/80 flex flex-col gap-1 transition-colors hover:border-[#f472b6] shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#be185d] dark:text-pink-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#ec4899] shrink-0" />
                  <span>{b.title}</span>
                </div>
                <p className="text-[11px] text-[#6e4160] dark:text-pink-200/80 leading-normal pl-5">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Tip destacado */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#fce7f3] via-[#faf5ff] to-white dark:from-rose-950/40 dark:to-purple-950/40 border border-[#f9a8d4] text-xs text-[#59324c] dark:text-pink-100 flex items-start gap-2">
            <span className="text-[#ec4899] text-sm leading-none shrink-0 mt-0.5">✨</span>
            <div className="text-[11px] leading-relaxed text-[#6e4160] dark:text-pink-200 font-medium">
              {currentStep.highlightTip}
            </div>
          </div>

          {/* Acceso rápido a presets si estamos en los pasos de drill-down */}
          {(currentStep.id === 'drilldown' || currentStep.id === 'intro') && onOpenPreset && (
            <div className="mt-3 pt-3 border-t border-[#f9a8d4]/50">
              <span className="text-[10px] font-mono uppercase text-[#8a5a7a] font-bold block mb-2">
                Pruébalo ahora con un circuito preconfigurado:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenPreset('adder_4bit');
                    onClose();
                  }}
                  className="px-3 py-1 rounded-full bg-[#fce7f3] hover:bg-[#f472b6] text-[#be185d] hover:text-white border border-[#f9a8d4] text-xs font-bold transition-colors"
                >
                  Sumador 4b (74LS283)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenPreset('bcd_7seg');
                    onClose();
                  }}
                  className="px-3 py-1 rounded-full bg-[#fce7f3] hover:bg-[#f472b6] text-[#be185d] hover:text-white border border-[#f9a8d4] text-xs font-bold transition-colors"
                >
                  Decodificador BCD (74LS47)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenPreset('dec_4_16');
                    onClose();
                  }}
                  className="px-3 py-1 rounded-full bg-[#f3e8ff] hover:bg-[#c084fc] text-[#7e22ce] hover:text-white border border-[#d8b4fe] text-xs font-bold transition-colors"
                >
                  Decodificador 4:16 (74LS154)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pie de navegación entre pasos */}
        <div className="px-6 py-3.5 border-t border-[#f9a8d4]/60 bg-[#fdf2f8] dark:bg-[#2a1d3a] flex items-center justify-between shrink-0">
          <button
            type="button"
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-[#b886a6]'
                : 'bg-white hover:bg-[#fce7f3] text-[#be185d] border border-[#f9a8d4]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#8a5a7a] hover:text-[#be185d] hover:bg-[#fce7f3] transition-colors"
            >
              Saltar Guía
            </button>

            {isLastStep ? (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#c084fc] hover:from-[#ec4899] hover:to-[#a855f7] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-300/50 transition-transform active:scale-98"
              >
                <span>¡Comenzar a Simular!</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStepIdx((prev) => Math.min(GUIDE_STEPS.length - 1, prev + 1))}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#f472b6] to-[#c084fc] hover:from-[#ec4899] hover:to-[#a855f7] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-pink-300/50 transition-transform active:scale-98"
              >
                <span>Siguiente Paso</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
