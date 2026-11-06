/**
 * AdaLab Studio - Floating Contextual Quick Tips Popup (Pastel Blossom Edition)
 * 
 * Tarjeta emergente no invasiva en el lienzo que guía al usuario en tiempo real
 * con consejos prácticos y microtutoriales conmutables en estética pastel femenina.
 */

import React, { useState } from 'react';
import { Lightbulb, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface QuickTipsPopupProps {
  onOpenFullGuide: () => void;
}

const TIPS = [
  {
    title: 'Doble Clic para "Ver Interior"',
    text: 'Haz doble clic directo sobre cualquier CI (como el 74LS283 en tu pantalla) para descomponer su encapsulado en compuertas lógicas elementales.',
    badge: 'Drill-Down',
  },
  {
    title: 'Conexiones 100% Ortogonales a 90°',
    text: 'Arrastra desde cualquier pin de salida (derecha) hacia una entrada (izquierda). Los trazos son rectilíneos estilo PCB sin curvas.',
    badge: 'Cableado',
  },
  {
    title: 'Tablas de Verdad y Fichas Técnicas',
    text: 'Selecciona cualquier componente o cable para ver su ecuación lógica, retardo tpd, consumo y tabla de verdad con fila activa en vivo.',
    badge: 'Inspector',
  },
  {
    title: 'Biblioteca Desplegable de 9 Familias',
    text: 'Despliega o colapsa las categorías del panel izquierdo para encontrar compuertas de hasta 8 entradas, multiplexores y displays.',
    badge: 'Catálogo',
  },
  {
    title: 'Conmuta Interruptores en Vivo',
    text: 'Haz clic sobre el botón de cualquier interruptor para alternar entre 0 (0V) y 1 (+5V) y ver fluir la señal en rosa pastel.',
    badge: 'Simulación',
  },
];

export const QuickTipsPopup: React.FC<QuickTipsPopupProps> = ({ onOpenFullGuide }) => {
  const [currentTipIdx, setCurrentTipIdx] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        type="button"
        onClick={() => setIsDismissed(false)}
        className="absolute bottom-4 right-4 z-30 px-3.5 py-1.5 rounded-2xl bg-[#fff5fa]/95 dark:bg-[#352647]/95 hover:bg-[#fce7f3] text-[#be185d] dark:text-pink-200 border-2 border-[#f9a8d4] text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-200/60 backdrop-blur-md transition-all active:scale-95"
        title="Mostrar consejos de uso"
      >
        <Lightbulb className="w-3.5 h-3.5 text-[#ec4899]" />
        <span>Consejos de Uso</span>
      </button>
    );
  }

  const tip = TIPS[currentTipIdx];

  return (
    <div className="absolute bottom-4 right-4 z-30 w-80 max-w-[calc(100vw-32px)] bg-[#fff5fa]/95 dark:bg-[#352647]/95 border-2 border-[#f9a8d4] rounded-2xl p-3.5 shadow-xl shadow-pink-200/70 dark:shadow-purple-950/70 backdrop-blur-md text-[#59324c] dark:text-pink-100 select-none animate-fadeIn transition-all">
      {/* Cabecera del popup */}
      <div className="flex items-center justify-between pb-2 border-b border-[#f9a8d4]/50">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-[#fce7f3] border border-[#f9a8d4] flex items-center justify-center">
            <Lightbulb className="w-3 h-3 text-[#ec4899]" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#be185d] dark:text-pink-300 font-bold">
            Consejo {currentTipIdx + 1} de {TIPS.length}
          </span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#f3e8ff] dark:bg-purple-900/50 text-[9px] font-mono font-bold text-[#7e22ce] dark:text-pink-200 border border-[#d8b4fe]">
            {tip.badge}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenFullGuide}
            className="text-[10px] text-[#be185d] dark:text-pink-300 hover:text-[#ec4899] underline underline-offset-2 pr-1 font-bold transition-colors"
            title="Abrir guía completa interactiva"
          >
            Guía completa
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-5 h-5 rounded-lg hover:bg-[#fce7f3] text-[#8a5a7a] hover:text-[#be185d] flex items-center justify-center transition-colors"
            title="Ocultar consejos"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Contenido del consejo */}
      <div className="mt-2.5">
        <h4 className="text-xs font-bold text-[#59324c] dark:text-pink-50 leading-snug">
          {tip.title}
        </h4>
        <p className="text-[11px] text-[#6e4160] dark:text-pink-200/80 mt-1 leading-relaxed">
          {tip.text}
        </p>
      </div>

      {/* Controles de navegación */}
      <div className="mt-3 pt-2 border-t border-[#f9a8d4]/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          {TIPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentTipIdx(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentTipIdx ? 'w-4 bg-[#ec4899]' : 'bg-[#f9a8d4]/70 hover:bg-[#f472b6]'
              }`}
              title={`Ir al consejo ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentTipIdx((prev) => (prev > 0 ? prev - 1 : TIPS.length - 1))}
            className="p-1 rounded-lg hover:bg-[#fce7f3] text-[#8a5a7a] hover:text-[#be185d] transition-colors"
            title="Consejo anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentTipIdx((prev) => (prev < TIPS.length - 1 ? prev + 1 : 0))}
            className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#fce7f3] to-[#f3e8ff] hover:from-[#fbcfe8] hover:to-[#e9d5ff] text-[#be185d] border border-[#f9a8d4] text-[10px] font-bold flex items-center gap-0.5 transition-colors"
            title="Siguiente consejo"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
