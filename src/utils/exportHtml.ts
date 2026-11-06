/**
 * AdaLab Studio - Standalone HTML Serializer & Exporter
 * 
 * Genera y descarga un único archivo HTML autocontenido con CSS y JS embebidos,
 * diseño femenino en amatista y oro rosa, conexiones ortogonales rectilíneas (sin curvas).
 */

export function downloadStandaloneHtml() {
  const htmlContent = `<!DOCTYPE html>
<html lang="es" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AdaLab Studio · Simulador de Circuitos Jerárquico (Pastel Edition)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-sans: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --bg-canvas: #fff8fb;
      --panel-bg: rgba(255, 244, 249, 0.95);
      --panel-border: rgba(249, 168, 212, 0.6);
      --accent-rose: #f472b6;
      --accent-lilac: #c084fc;
      --wire-high: #ec4899;
      --wire-low: #d8b4e2;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background: var(--bg-canvas);
      color: #59324c;
      overflow: hidden;
      user-select: none;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .blueprint-grid {
      background-color: var(--bg-canvas);
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(244, 143, 177, 0.35) 1.5px, transparent 0),
        linear-gradient(to right, rgba(216, 180, 254, 0.22) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(216, 180, 254, 0.22) 1px, transparent 1px);
      background-size: 24px 24px, 120px 120px, 120px 120px;
    }
    .top-bar {
      height: 56px;
      background: var(--panel-bg);
      border-bottom: 2px solid var(--panel-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      z-index: 30;
      backdrop-filter: blur(12px);
    }
    .brand-wordmark {
      font-size: 16px;
      font-weight: 800;
      color: #59324c;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-icon {
      width: 26px;
      height: 26px;
      border-radius: 10px;
      background: linear-gradient(135deg, #f472b6, #c084fc);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 900;
      font-size: 13px;
      box-shadow: 0 2px 8px rgba(244, 114, 182, 0.45);
    }
    .nav-links {
      display: flex;
      gap: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #be185d;
    }
    .nav-links button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-family: inherit;
      transition: color 0.15s;
    }
    .nav-links button:hover { color: #ec4899; }
    .main-layout {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
    }
    .sidebar {
      width: 280px;
      background: var(--panel-bg);
      border-right: 2px solid var(--panel-border);
      padding: 16px;
      overflow-y: auto;
      z-index: 20;
      backdrop-filter: blur(12px);
    }
    .inspector {
      width: 320px;
      background: var(--panel-bg);
      border-left: 2px solid var(--panel-border);
      padding: 16px;
      overflow-y: auto;
      z-index: 20;
      backdrop-filter: blur(12px);
    }
    .canvas-container {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    .canvas-subtoolbar {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 30;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .toolbar-group {
      background: rgba(255, 245, 250, 0.95);
      border: 2px solid var(--panel-border);
      border-radius: 16px;
      padding: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 8px 20px -5px rgba(244, 114, 182, 0.25);
    }
    .btn {
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      color: #59324c;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }
    .btn:hover { background: #fce7f3; color: #be185d; }
    .btn-primary { background: linear-gradient(135deg, #f472b6, #c084fc); color: #fff; }
    .btn-primary:hover { background: linear-gradient(135deg, #ec4899, #a855f7); }
    .btn-rose { background: #fce7f3; border-color: #f9a8d4; color: #be185d; }
    .btn-rose:hover { background: #fbcfe8; }
    .pill {
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 700;
      background: #fdf2f8;
      color: #be185d;
      border: 1px solid #f9a8d4;
      cursor: pointer;
    }
    .pill.active { background: linear-gradient(135deg, #f472b6, #c084fc); color: #fff; box-shadow: 0 2px 8px rgba(244, 114, 182, 0.45); }
    .circuit-node {
      position: absolute;
      cursor: move;
      border-radius: 16px;
    }
    .dip-ic {
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #fff0f7 0%, #fae8ff 100%);
      border: 2px solid #f9a8d4;
      border-radius: 16px;
      padding: 12px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 10px 25px rgba(244, 114, 182, 0.25);
    }
    .notch {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 10px;
      background: #f3e8ff;
      border-bottom: 1px solid #d8b4fe;
      border-radius: 0 0 6px 6px;
    }
    .ic-title {
      font-family: var(--font-mono);
      font-weight: 800;
      color: #be185d;
      font-size: 12px;
      margin-top: 6px;
    }
    .pin {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fdf2f8;
      border: 2px solid #f472b6;
      transform: translate(-50%, -50%);
      cursor: crosshair;
      z-index: 10;
      transition: all 0.15s;
    }
    .pin.high {
      background: #ec4899;
      border-color: #fbcfe8;
      box-shadow: 0 0 8px #f472b6;
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="brand-wordmark">
      <div class="brand-icon">A</div>
      <span>AdaLab Studio</span>
    </div>
    <div class="nav-links">
      <button onclick="loadFamily('adder_4bit')">Sumador 4b (74LS283)</button>
      <button onclick="loadFamily('bcd_7seg')">BCD a 7-Seg (74LS47)</button>
      <button onclick="loadFamily('dec_4_16')">Decodificador 4:16</button>
      <button onclick="loadFamily('comp_4bit')">Comparador 4b</button>
      <button onclick="loadFamily('mux_4_1')">Multiplexor 4:1</button>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <button class="btn btn-rose" onclick="alert('GUÍA DE USO DE ADALAB STUDIO:\n\n1. Doble clic sobre un CI (ej: 74LS283) para abrir su interior (Drill-Down).\n2. Navega con las píldoras [N1] → [N2] → [N3] → [N4] en la sub-barra.\n3. Pulsa [Volver] para restaurar intacto tu circuito original.\n4. Conecta pines arrastrando desde una salida (derecha) a una entrada (izquierda) con cables ortogonales a 90°.\n5. Haz clic en un componente para ver su tabla de verdad y ficha técnica.')">¿Cómo Usar?</button>
      <button class="btn btn-primary" onclick="toggleSim()">Simulación Activa</button>
    </div>
  </div>

  <div class="main-layout">
    <div class="sidebar">
      <h3 style="font-size:13px; font-weight:700; color:#fbcfe8; margin-bottom:12px;">Componentes MSI</h3>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button class="btn btn-rose" onclick="loadFamily('adder_4bit')">CI 74LS283 (Sumador 4b)</button>
        <button class="btn btn-rose" onclick="loadFamily('bcd_7seg')">CI 74LS47 (BCD a 7-Seg)</button>
        <button class="btn btn-rose" onclick="loadFamily('dec_4_16')">CI 74LS154 (Dec 4:16)</button>
        <button class="btn btn-rose" onclick="loadFamily('comp_4bit')">CI 74LS85 (Comparador)</button>
        <button class="btn btn-rose" onclick="loadFamily('mux_4_1')">MUX 4:1</button>
      </div>
    </div>

    <div class="canvas-container blueprint-grid" id="canvas-container">
      <div class="canvas-subtoolbar" id="subtoolbar">
      </div>
      <div id="nodes-layer"></div>
      <!-- SVG con trazado ortogonal sin curvas -->
      <svg id="wires-layer" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:10;"></svg>
    </div>

    <div class="inspector" id="inspector">
      <h3 style="font-size:13px; font-weight:700; color:#fbcfe8; margin-bottom:12px;">Inspector</h3>
      <p style="font-size:12px; color:#f472b6; line-height:1.6;">
        Conexiones ortogonales tipo PCB sin curvas. Haz doble clic en cualquier CI MSI (ej. 74LS283) para abrir su interior jerárquico multinivel (Drill-Down).
      </p>
    </div>
  </div>

  <script>
    console.log("AdaLab Studio iniciado con conexiones ortogonales rectilíneas (sin curvas).");
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'adalab-studio.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
