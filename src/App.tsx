/**
 * DigiLab Studio - Main Application Component
 * 
 * Simulador de circuitos digitales con sistema de EXPLORACIÓN JERÁRQUICA MULTINIVEL
 * (Drill-Down de abstracción) para CIs MSI y bloques modulares.
 * 
 * ─────────────────────────────────────────────────────────────
 * SECCIONES:
 * 1. MODELO DE DATOS: HIERARCHY_FAMILIES & NODE_TO_HIERARCHY_MAP
 * 2. SNAPSHOT Y RESTAURACIÓN SIMÉTRICA
 * 3. NAVEGACIÓN DE NIVELES Y DRILL-DOWN
 * 4. SIMULACIÓN LÓGICA EN TIEMPO REAL
 * 5. INTERFAZ DE USUARIO Y LIENZO INTERACTIVO
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CircuitNode,
  Wire,
  ActiveTool,
  DraggingWire,
  HierarchyOriginSnapshot,
  LogicValue,
} from './types';
import { HIERARCHY_FAMILIES, NODE_TO_HIERARCHY_MAP } from './constants/hierarchyData';
import { simulateCircuit } from './utils/simulator';
import { createNodeTemplate } from './utils/componentTemplates';
import { CanvasSubtoolbar } from './components/CanvasSubtoolbar';
import { NodeComponent } from './components/NodeComponent';
import { WiresRenderer } from './components/WiresRenderer';
import { InspectorPanel } from './components/InspectorPanel';
import { ComponentLibrary } from './components/ComponentLibrary';
import { TopBar } from './components/TopBar';
import { GuideModal } from './components/GuideModal';
import { QuickTipsPopup } from './components/QuickTipsPopup';
import { downloadStandaloneHtml } from './utils/exportHtml';

export default function App() {
  // ── ESTADO DEL CIRCUITO Y LIENZO ───────────────────────────
  const [nodes, setNodes] = useState<CircuitNode[]>(() => {
    // Circuito inicial predeterminado: Sumador de 4 Bits (CI 74LS283) listo para explorar
    return JSON.parse(JSON.stringify(HIERARCHY_FAMILIES.adder_4bit.levels[0].nodes));
  });

  const [wires, setWires] = useState<Wire[]>(() => {
    return JSON.parse(JSON.stringify(HIERARCHY_FAMILIES.adder_4bit.levels[0].wires));
  });

  const [circuitTitle, setCircuitTitle] = useState('Sumador de 4 Bits (CI 74LS283)');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('ic_74283_main');
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // Herramienta activa y vista de lienzo (Zoom & Pan)
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 40, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Arrastre de nodos
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, nodeX: 0, nodeY: 0 });

  // Creación interactiva de cables
  const [draggingWire, setDraggingWire] = useState<DraggingWire | null>(null);

  // ── ESTADO DE EXPLORACIÓN JERÁRQUICA ───────────────────────
  // Snapshot del circuito original del usuario antes de entrar al interior
  const [hierarchyOriginSnapshot, setHierarchyOriginSnapshot] = useState<HierarchyOriginSnapshot | null>(null);
  const [activeFamilyId, setActiveFamilyId] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelTransitionClass, setLevelTransitionClass] = useState('');

  // ── ESTADO DE GUÍA Y POPUPS EDUCATIVOS ─────────────────────
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [hierarchyToast, setHierarchyToast] = useState<{ title: string; message: string } | null>(null);

  // ── ESTADO DE SIMULACIÓN Y TEMA ────────────────────────────
  const [isSimulating, setIsSimulating] = useState(true);
  const [clockTick, setClockTick] = useState<LogicValue>(0);
  const [clockSpeed, setClockSpeed] = useState<number>(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────────────────────
  // 4. MOTOR DE SIMULACIÓN EN TIEMPO REAL
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSimulating) return;

    // Reloj digital periódico según clockSpeed
    const intervalMs = Math.round(1000 / clockSpeed);
    const clockInterval = setInterval(() => {
      setClockTick((prev) => (prev === 0 ? 1 : 0));
    }, intervalMs);

    return () => clearInterval(clockInterval);
  }, [isSimulating, clockSpeed]);

  // Ejecuta la resolución lógica continua cuando cambian nodos, cables o reloj
  useEffect(() => {
    if (!isSimulating) return;

    const { nodes: updatedNodes, wires: updatedWires } = simulateCircuit(nodes, wires, clockTick);

    // Actualiza solo si hubo cambio real en valores
    let hasNodeChange = false;
    for (let i = 0; i < updatedNodes.length; i++) {
      const orig = nodes[i];
      const next = updatedNodes[i];
      if (!orig || !next) {
        hasNodeChange = true;
        break;
      }
      if (orig.inputs.some((p, idx) => p.value !== next.inputs[idx]?.value)) hasNodeChange = true;
      if (orig.outputs.some((p, idx) => p.value !== next.outputs[idx]?.value)) hasNodeChange = true;
      if (orig.state?.value !== next.state?.value) hasNodeChange = true;
      if (orig.state?.displayValue !== next.state?.displayValue) hasNodeChange = true;
      if (hasNodeChange) break;
    }

    if (hasNodeChange) {
      setNodes(updatedNodes);
      setWires(updatedWires);
    }
  }, [nodes, wires, clockTick, isSimulating]);

  // ─────────────────────────────────────────────────────────────
  // 3. EXPLORACIÓN JERÁRQUICA MULTINIVEL (DRILL-DOWN)
  // ─────────────────────────────────────────────────────────────

  /**
   * Entra al circuito interior de un componente seleccionado
   */
  const handleDrillDown = useCallback((node: CircuitNode) => {
    const mapping = NODE_TO_HIERARCHY_MAP[node.type];
    if (!mapping) return;

    const targetFamilyId = mapping.family;
    const targetLevelNum = mapping.nextLevel;
    const family = HIERARCHY_FAMILIES[targetFamilyId];
    if (!family) return;

    const levelData = family.levels.find((l) => l.level === targetLevelNum);
    if (!levelData) return;

    // Transición visual suave (fade/zoom corto)
    setLevelTransitionClass('opacity-0 scale-98 transition-all duration-200');

    setTimeout(() => {
      // 3.a) Si no hay snapshot activo (se entra desde el lienzo del usuario), guardar snapshot completo
      if (!hierarchyOriginSnapshot) {
        setHierarchyOriginSnapshot({
          nodes: JSON.parse(JSON.stringify(nodes)),
          wires: JSON.parse(JSON.stringify(wires)),
          circuitTitle,
          selectedNodeId: node.id,
          familyId: targetFamilyId,
          canvasOffset: { ...panOffset },
          canvasZoom: zoom,
        });
      }

      // Bloquea la familia activa y establece el nuevo nivel
      setActiveFamilyId(targetFamilyId);
      setCurrentLevel(targetLevelNum);
      setCircuitTitle(`${family.name} · ${levelData.title}`);

      // Carga nodos y cables listos para simular
      setNodes(JSON.parse(JSON.stringify(levelData.nodes)));
      setWires(JSON.parse(JSON.stringify(levelData.wires)));
      setSelectedNodeId(null);
      setSelectedWireId(null);

      // Centra suavemente el lienzo
      setPanOffset({ x: 60, y: 40 });
      setZoom(1);

      setLevelTransitionClass('opacity-100 scale-100 transition-all duration-200');

      // Notificación emergente educativa para guiar al usuario
      setHierarchyToast({
        title: `Nivel ${targetLevelNum} · ${levelData.title}`,
        message: 'Explorando arquitectura interna. Usa las píldoras [N1...N4] o pulsa [Volver] para restaurar el circuito original.',
      });
      setTimeout(() => setHierarchyToast(null), 6000);
    }, 150);
  }, [nodes, wires, circuitTitle, panOffset, zoom, hierarchyOriginSnapshot]);

  /**
   * Navega directamente a un nivel específico dentro de la familia bloqueada
   */
  const handleGoToLevel = useCallback((levelNum: number) => {
    if (!activeFamilyId) return;
    const family = HIERARCHY_FAMILIES[activeFamilyId];
    if (!family) return;

    const levelData = family.levels.find((l) => l.level === levelNum);
    if (!levelData) return;

    setLevelTransitionClass('opacity-0 scale-98 transition-all duration-150');

    setTimeout(() => {
      setCurrentLevel(levelNum);
      setCircuitTitle(`${family.name} · ${levelData.title}`);
      setNodes(JSON.parse(JSON.stringify(levelData.nodes)));
      setWires(JSON.parse(JSON.stringify(levelData.wires)));
      setSelectedNodeId(null);
      setSelectedWireId(null);

      setLevelTransitionClass('opacity-100 scale-100 transition-all duration-200');
    }, 120);
  }, [activeFamilyId]);

  /**
   * Subir nivel (< Mayor)
   */
  const handleGoHigherLevel = useCallback(() => {
    if (!activeFamilyId) return;
    const family = HIERARCHY_FAMILIES[activeFamilyId];
    if (!family) return;

    const currentIdx = family.levels.findIndex((l) => l.level === currentLevel);
    if (currentIdx > 0) {
      handleGoToLevel(family.levels[currentIdx - 1].level);
    } else if (hierarchyOriginSnapshot) {
      // Si ya está en N1 y sube de regreso, restaurar origen
      handleReturnToOrigin();
    }
  }, [activeFamilyId, currentLevel, hierarchyOriginSnapshot, handleGoToLevel]);

  /**
   * Bajar nivel (Menor >)
   */
  const handleGoDeeperLevel = useCallback(() => {
    if (!activeFamilyId) return;
    const family = HIERARCHY_FAMILIES[activeFamilyId];
    if (!family) return;

    const currentIdx = family.levels.findIndex((l) => l.level === currentLevel);
    if (currentIdx >= 0 && currentIdx < family.levels.length - 1) {
      handleGoToLevel(family.levels[currentIdx + 1].level);
    }
  }, [activeFamilyId, currentLevel, handleGoToLevel]);

  /**
   * 3.c) Restaurar exactamente el circuito original del usuario y limpiar estado de jerarquía
   */
  const handleReturnToOrigin = useCallback(() => {
    if (!hierarchyOriginSnapshot) return;

    setLevelTransitionClass('opacity-0 scale-98 transition-all duration-150');

    setTimeout(() => {
      // Restaura nodos, cables, título, selección y vista originales
      setNodes(JSON.parse(JSON.stringify(hierarchyOriginSnapshot.nodes)));
      setWires(JSON.parse(JSON.stringify(hierarchyOriginSnapshot.wires)));
      setCircuitTitle(hierarchyOriginSnapshot.circuitTitle);
      setSelectedNodeId(hierarchyOriginSnapshot.selectedNodeId);
      setSelectedWireId(null);
      setPanOffset(hierarchyOriginSnapshot.canvasOffset);
      setZoom(hierarchyOriginSnapshot.canvasZoom);

      // Limpia por completo el estado de jerarquía
      setHierarchyOriginSnapshot(null);
      setActiveFamilyId(null);
      setCurrentLevel(1);

      setLevelTransitionClass('opacity-100 scale-100 transition-all duration-200');

      // Notificación de restauración completa
      setHierarchyToast({
        title: 'Circuito Original Restaurado',
        message: 'Has regresado a tu circuito con todos sus componentes, conexiones y estados intactos.',
      });
      setTimeout(() => setHierarchyToast(null), 4000);
    }, 120);
  }, [hierarchyOriginSnapshot]);

  // Carga un preset de familia completo directamente desde la barra superior
  const handleLoadFamilyPreset = useCallback((familyId: string) => {
    const family = HIERARCHY_FAMILIES[familyId];
    if (!family) return;

    const n1 = family.levels[0];
    setNodes(JSON.parse(JSON.stringify(n1.nodes)));
    setWires(JSON.parse(JSON.stringify(n1.wires)));
    setCircuitTitle(`${family.name} (${family.msiCode})`);
    setSelectedNodeId(n1.nodes[0]?.id || null);
    setSelectedWireId(null);
    setHierarchyOriginSnapshot(null);
    setActiveFamilyId(null);
    setCurrentLevel(1);
    setPanOffset({ x: 50, y: 40 });
    setZoom(1);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // INTERACCIÓN CON EL LIENZO: ARRASTRE, CABLEADO Y CLICS
  // ─────────────────────────────────────────────────────────────

  // Alterna un switch de 0 a 1 o de 1 a 0
  const handleToggleSwitch = useCallback((nodeId: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id !== nodeId) return n;
        const currentVal = n.state?.value ?? 0;
        const nextVal: LogicValue = currentVal === 1 ? 0 : 1;
        return {
          ...n,
          state: { ...(n.state || {}), value: nextVal },
        };
      })
    );
  }, []);

  // Selección de nodo sin destruirlo (preserva dblclick nativo)
  const handleSelectNode = useCallback((nodeId: string, e: React.MouseEvent) => {
    setSelectedNodeId(nodeId);
    setSelectedWireId(null);

    // Inicia arrastre solo si se usa la herramienta 'select'
    if (activeTool === 'select') {
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        setDraggingNodeId(nodeId);
        dragStartRef.current = {
          mouseX: e.clientX,
          mouseY: e.clientY,
          nodeX: node.x,
          nodeY: node.y,
        };
      }
    }
  }, [nodes, activeTool]);

  // Iniciar cable desde un pin
  const handlePinMouseDown = useCallback((nodeId: string, pinId: string, isOutput: boolean, e: React.MouseEvent) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const pins = isOutput ? node.outputs : node.inputs;
    const pin = pins.find((p) => p.id === pinId);
    if (!pin) return;

    const pinAbsX = node.x + node.width * pin.relX;
    const pinAbsY = node.y + node.height * pin.relY;

    if (isOutput) {
      // Inicia cable desde salida
      setDraggingWire({
        fromNodeId: nodeId,
        fromPinId: pinId,
        startX: pinAbsX,
        startY: pinAbsY,
        currentX: pinAbsX,
        currentY: pinAbsY,
      });
    }
  }, [nodes]);

  // Completar cable en un pin de destino
  const handlePinMouseUp = useCallback((nodeId: string, pinId: string, isOutput: boolean, e: React.MouseEvent) => {
    if (!draggingWire) return;

    // Solo se permite conectar salida a entrada de un nodo distinto
    if (!isOutput && draggingWire.fromNodeId !== nodeId) {
      const newWire: Wire = {
        id: `wire_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        fromNodeId: draggingWire.fromNodeId,
        fromPinId: draggingWire.fromPinId,
        toNodeId: nodeId,
        toPinId: pinId,
        value: 0,
      };

      setWires((prev) => [...prev, newWire]);
    }
    setDraggingWire(null);
  }, [draggingWire]);

  // Manejador global del ratón en lienzo (Pan, arrastre de nodo, cableado)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Si se presiona rueda central, botón derecho o herramienta Pan
    if (e.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      return;
    }

    // Deseleccionar si se hace clic en fondo vacío
    if ((e.target as HTMLElement).closest('.circuit-node') === null) {
      setSelectedNodeId(null);
      setSelectedWireId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    // Mover lienzo (Pan)
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
      return;
    }

    // Mover nodo seleccionado
    if (draggingNodeId) {
      const dx = (e.clientX - dragStartRef.current.mouseX) / zoom;
      const dy = (e.clientY - dragStartRef.current.mouseY) / zoom;

      // Snap a cuadrícula de 12px
      const rawX = dragStartRef.current.nodeX + dx;
      const rawY = dragStartRef.current.nodeY + dy;
      const snapX = Math.round(rawX / 12) * 12;
      const snapY = Math.round(rawY / 12) * 12;

      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x: Math.max(10, snapX), y: Math.max(10, snapY) } : n))
      );
      return;
    }

    // Actualizar extremo del cable en arrastre
    if (draggingWire && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - panOffset.x) / zoom;
      const currentY = (e.clientY - rect.top - panOffset.y) / zoom;
      setDraggingWire((prev) => (prev ? { ...prev, currentX, currentY } : null));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    if (draggingWire) setDraggingWire(null);
  };

  // Zoom con la rueda del ratón
  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(2.5, Math.max(0.4, prev * zoomFactor)));
  };

  // Atajos de teclado (Delete, V, W, H, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
          setWires((prev) => prev.filter((w) => w.fromNodeId !== selectedNodeId && w.toNodeId !== selectedNodeId));
          setSelectedNodeId(null);
        } else if (selectedWireId) {
          setWires((prev) => prev.filter((w) => w.id !== selectedWireId));
          setSelectedWireId(null);
        }
      } else if (e.key === 'v' || e.key === 'V') {
        setActiveTool('select');
      } else if (e.key === 'w' || e.key === 'W') {
        setActiveTool('wire');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveTool('pan');
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedWireId(null);
        setDraggingWire(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedWireId]);

  // Agregar componente al lienzo desde el catálogo
  const handleAddComponent = (type: string, label: string) => {
    const newId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const posX = Math.round((-panOffset.x + 350) / zoom / 12) * 12;
    const posY = Math.round((-panOffset.y + 200) / zoom / 12) * 12;

    const template = createNodeTemplate(type, label);

    const newNode: CircuitNode = {
      id: newId,
      type,
      label,
      x: Math.max(30, posX),
      y: Math.max(30, posY),
      width: template.width,
      height: template.height,
      inputs: template.inputs,
      outputs: template.outputs,
      state: template.state,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setSelectedWireId(null);
  };

  // Duplicar nodo seleccionado
  const handleDuplicateSelected = () => {
    if (!selectedNodeId) return;
    const source = nodes.find((n) => n.id === selectedNodeId);
    if (!source) return;

    const dupNode: CircuitNode = {
      ...JSON.parse(JSON.stringify(source)),
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      x: source.x + 30,
      y: source.y + 30,
      label: `${source.label} (Copia)`,
    };

    setNodes((prev) => [...prev, dupNode]);
    setSelectedNodeId(dupNode.id);
  };

  // Eliminar elemento seleccionado
  const handleDeleteSelected = () => {
    if (selectedNodeId) {
      setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
      setWires((prev) => prev.filter((w) => w.fromNodeId !== selectedNodeId && w.toNodeId !== selectedNodeId));
      setSelectedNodeId(null);
    } else if (selectedWireId) {
      setWires((prev) => prev.filter((w) => w.id !== selectedWireId));
      setSelectedWireId(null);
    }
  };

  // Alternar tema claro / oscuro
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Guardar proyecto completo en archivo JSON
  const handleSaveProjectJson = () => {
    const data = {
      project: 'AdaLab Studio',
      version: '2.0',
      circuitTitle,
      savedAt: new Date().toISOString(),
      nodes,
      wires,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuitTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.adalab.json`;
    a.click();
    URL.revokeObjectURL(url);
    setHierarchyToast({
      title: 'Proyecto Guardado',
      message: 'El archivo .adalab.json se ha descargado correctamente.',
    });
    setTimeout(() => setHierarchyToast(null), 3000);
  };

  // Cargar proyecto desde archivo JSON
  const handleLoadProjectJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.wires)) {
          setNodes(parsed.nodes);
          setWires(parsed.wires);
          if (parsed.circuitTitle) setCircuitTitle(parsed.circuitTitle);
          setSelectedNodeId(null);
          setSelectedWireId(null);
          setHierarchyOriginSnapshot(null);
          setActiveFamilyId(null);
          setCurrentLevel(1);
          setHierarchyToast({
            title: 'Proyecto Cargado',
            message: `Circuito "${parsed.circuitTitle || 'Importado'}" cargado con éxito.`,
          });
          setTimeout(() => setHierarchyToast(null), 4000);
        } else {
          alert('El archivo no tiene el formato JSON válido de AdaLab Studio.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Reiniciar interruptores a 0
  const handleResetSwitches = () => {
    setNodes((prev) =>
      prev.map((n) => (n.type === 'SWITCH' ? { ...n, state: { ...(n.state || {}), value: 0 } } : n))
    );
    setHierarchyToast({
      title: 'Interruptores Reiniciados',
      message: 'Todos los interruptores se han establecido en nivel lógico 0.',
    });
    setTimeout(() => setHierarchyToast(null), 3000);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedWire = wires.find((w) => w.id === selectedWireId) || null;

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden ${isDarkMode ? 'dark bg-[#281d35] text-pink-100' : 'light bg-[#fff8fb] text-[#59324c]'} font-sans`}>
      {/* ── TOP BAR (3-Zone Contract con Menús Desplegables) ── */}
      <TopBar
        isSimulating={isSimulating}
        onToggleSim={() => setIsSimulating((prev) => !prev)}
        onStepSim={() => setClockTick((prev) => (prev === 0 ? 1 : 0))}
        clockSpeed={clockSpeed}
        onChangeClockSpeed={setClockSpeed}
        onClearCanvas={() => {
          setNodes([]);
          setWires([]);
          setSelectedNodeId(null);
          setSelectedWireId(null);
          setHierarchyOriginSnapshot(null);
          setActiveFamilyId(null);
          setCurrentLevel(1);
        }}
        onSaveProjectJson={handleSaveProjectJson}
        onLoadProjectJson={handleLoadProjectJson}
        onDuplicateSelected={handleDuplicateSelected}
        onDeleteSelected={handleDeleteSelected}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
        onZoomOut={() => setZoom((z) => Math.max(0.4, z - 0.15))}
        onZoomReset={() => setZoom(1)}
        onResetSwitches={handleResetSwitches}
        onLoadFamilyPreset={handleLoadFamilyPreset}
        onExportStandaloneHtml={downloadStandaloneHtml}
        onAddComponent={handleAddComponent}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* ── ÁREA PRINCIPAL DE TRABAJO ────────────────────────── */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Panel Izquierdo: Catálogo de Componentes */}
        <ComponentLibrary onAddComponent={handleAddComponent} />

        {/* ── LIENZO INTERACTIVO DE SIMULACIÓN ────────────────── */}
        <div
          ref={canvasRef}
          className={`flex-1 h-full relative overflow-hidden select-none blueprint-grid ${
            activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onWheel={handleCanvasWheel}
        >
          {/* Sub-barra superior flotante (.canvas-subtoolbar) */}
          <CanvasSubtoolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom((z) => Math.max(0.4, z - 0.15))}
            onZoomReset={() => setZoom(1)}
            selectedNode={selectedNode}
            onDrillDown={handleDrillDown}
            onDuplicate={handleDuplicateSelected}
            onDeleteSelected={handleDeleteSelected}
            // Navegación de jerarquía
            activeFamilyId={activeFamilyId}
            currentLevel={currentLevel}
            hasSnapshot={!!hierarchyOriginSnapshot}
            onReturnToOrigin={handleReturnToOrigin}
            onGoToLevel={handleGoToLevel}
            onGoHigherLevel={handleGoHigherLevel}
            onGoDeeperLevel={handleGoDeeperLevel}
          />

          {/* Toast de Notificación y Guía en el Lienzo */}
          {hierarchyToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 max-w-md px-4 py-2.5 rounded-2xl bg-[#fff0f7]/95 dark:bg-[#342645]/95 border-2 border-[#f9a8d4] shadow-xl shadow-pink-200/70 dark:shadow-purple-950/60 backdrop-blur-md flex items-center gap-3 text-[#59324c] dark:text-pink-100 select-none animate-fadeIn">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#fbcfe8] to-[#e9d5ff] border border-[#f9a8d4] flex items-center justify-center shrink-0 text-[#be185d] font-bold text-xs shadow-sm">
                ✨
              </div>
              <div>
                <span className="text-xs font-bold text-[#be185d] dark:text-pink-200 block">
                  {hierarchyToast.title}
                </span>
                <span className="text-[11px] text-[#7d4e6d] dark:text-pink-200/80 leading-tight block">
                  {hierarchyToast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHierarchyToast(null)}
                className="ml-2 text-[#b07c9e] hover:text-[#be185d] dark:text-pink-300 text-xs p-1"
                title="Cerrar aviso"
              >
                ✕
              </button>
            </div>
          )}

          {/* Popup Emergente con Consejos Rápidos de Uso */}
          <QuickTipsPopup onOpenFullGuide={() => setIsGuideOpen(true)} />

          {/* Capa de transformación espacial (Zoom y Pan) con transición suave */}
          <div
            className={`w-full h-full absolute inset-0 origin-top-left transform-gpu ${levelTransitionClass}`}
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            }}
          >
            {/* Renderizado SVG de Cables */}
            <WiresRenderer
              wires={wires}
              nodes={nodes}
              selectedWireId={selectedWireId}
              onSelectWire={(wId) => {
                setSelectedWireId(wId);
                setSelectedNodeId(null);
              }}
              draggingWire={draggingWire}
            />

            {/* Renderizado de Nodos / Circuitos / Compuertas */}
            {nodes.map((node) => (
              <NodeComponent
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                onSelect={handleSelectNode}
                onDrillDown={handleDrillDown}
                onToggleSwitch={handleToggleSwitch}
                onPinMouseDown={handlePinMouseDown}
                onPinMouseUp={handlePinMouseUp}
              />
            ))}
          </div>
        </div>

        {/* Panel Derecho: Inspector de Propiedades */}
        <InspectorPanel
          selectedNode={selectedNode}
          selectedWire={selectedWire}
          nodes={nodes}
          onDrillDown={handleDrillDown}
          onUpdateNodeLabel={(nodeId, newLabel) => {
            setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, label: newLabel } : n)));
          }}
          onToggleSwitch={handleToggleSwitch}
          onUpdateNodeColor={(nodeId, color) => {
            setNodes((prev) =>
              prev.map((n) => (n.id === nodeId ? { ...n, state: { ...(n.state || {}), color } } : n))
            );
          }}
          onDeleteSelected={handleDeleteSelected}
          activeFamilyId={activeFamilyId}
          currentLevel={currentLevel}
        />
      </div>

      {/* ── MODAL DE GUÍA INTERACTIVA COMPLETA ──────────────── */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenPreset={handleLoadFamilyPreset}
      />
    </div>
  );
}
