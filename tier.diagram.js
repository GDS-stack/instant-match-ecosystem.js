// SECTION 1 — BASE LAYOUT + PHASE 1 CARD CONTENTS (+ FADE-OUT / PHASE WRAPPERS)
// This script injects the original Section 1 <style> into the page.
// All content from your provided <style> block is preserved 1:1.

(function () {
  'use strict';

  // Prevent duplicate injection if script is loaded more than once.
  if (document.getElementById('ss-mp-grid-section1-styles')) return;

  var css = `
  :root {
    --glass-blur: 16px;
    --glass-saturation: 140%;
    --glass-bg: rgba(255, 255, 255, 0.12);
    --glass-border: rgba(255, 255, 255, 0.28);
    --glass-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);

    /* layout engine timings */
    --phase-dur: 900ms;       /* stack -> phase1 layout */
    --phase-dur-fast: 600ms;  /* phase1 -> phase2/3 transitions */

    /* unified outer card corner radius for all surrounding cells */
    --card-radius: 12px;
  }

  .demo-wrap {
    display: grid;
    gap: 16px;
    justify-items: center;
    padding: 24px 0;
  }

  .replay-btn {
    appearance: none;
    border: 0;
    padding: 10px 16px;
    border-radius: 10px;
    font: 600 14px/1 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.28);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    cursor: pointer;
  }

  .layout-stage {
    position: relative;
    width: 673px;
    height: 658px;
    margin: 0 auto;
    overflow: visible;
  }

  .grid-3x3 {
    position: absolute;
    left: 95px;
    top: 88px;
    display: grid;
    width: 480px;
    grid-template-columns: 160px 160px 160px;
    grid-auto-rows: 160px;
    margin: 0;
  }

  .grid-3x3 > .cell {
    position: relative;
    width: 160px;
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: none;
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    overflow: hidden;
    color: #fff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
    transform-origin: 50% 50%;
    will-change: transform, width, height;
    backface-visibility: hidden;
    z-index: 1;
    contain: layout paint;

    /* unified outer-radius for all surrounding cards */
    border-radius: var(--card-radius);
  }

  .placeholder {
    width: 0;
    height: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .grid-3x3 > .cell--center {
    position: relative;
    width: 160px;
    height: 160px;
    background: transparent;
    z-index: 3;
  }

  /* Center pixel card anchored relative to center cell */
  .cell--center .pixel-card {
    position: absolute;
    left: -50px;
    top: -50px;
  }

  .pixel-card {
    width: 260px;
    height: 260px;
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    isolation: isolate;
    user-select: none;
    background: rgba(255, 255, 255, 0.10);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    transition: border-color 200ms cubic-bezier(.5, 1, .89, 1);
  }

  .pixel-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 3;
    transform: translateZ(0);
  }

  .pixel-center-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    pointer-events: none;
  }

  .pixel-center-icon-inner {
    position: relative;
    width: 96%;
    aspect-ratio: 1 / 1;
  }

  .mp-wrap {
    position: absolute;
    inset: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
    pointer-events: none;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    mask-position: 0 0;
    mask-mode: alpha;
    will-change: -webkit-mask-image, mask-image;
  }

  .mp-canvas {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* Animated layout engine transforms (phases/stack) */

  .anim-cell {
    transform:
      translate(var(--tx), var(--ty))
      translate(var(--anim-x, 0px), var(--anim-y, 0px))
      translate(var(--dx, 0px), var(--dy, 0px))
      translate(var(--ex, 0px), var(--ey, 0px))
      scale(var(--scale, 1));
    transition: transform var(--phase-dur) cubic-bezier(.2, .7, .15, 1);
  }

  .grid-3x3.prep .anim-cell {
    transition: none !important;
  }

  .grid-3x3.is-stacked .anim-cell {
    --anim-x: var(--ax);
    --anim-y: var(--ay);
    --scale: 0.7;
    z-index: 0;
  }

  .grid-3x3.phase2 .anim-cell,
  .grid-3x3.phase3 .anim-cell,
  .grid-3x3.size-armed .anim-cell {
    transition:
      transform var(--phase-dur-fast) cubic-bezier(.2, .7, .15, 1),
      width var(--phase-dur-fast) cubic-bezier(.2, .7, .15, 1),
      height var(--phase-dur-fast) cubic-bezier(.2, .7, .15, 1);
  }

  .grid-3x3.warmup {
    position: fixed;
    left: -99999px;
    top: 0;
    opacity: 0.001;
    pointer-events: none;
    z-index: -1;
  }

  .grid-3x3.warmup .anim-cell {
    transition: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .anim-cell {
      transition: none !important;
    }
    .grid-3x3.phase2 .anim-cell,
    .grid-3x3.phase3 .anim-cell,
    .grid-3x3.size-armed .anim-cell {
      transition: none !important;
    }
  }

  /* ============================
     LAYOUT 1 — BASE POSITIONS/SIZES
     (all use unified --card-radius via .cell)
     ============================ */

  .grid-3x3 > .pos-topwide {
    width: 305px;
    height: 160px;
    --tx: -43px;
    --ty: -88px;
    --ax: 130.5px;
    --ay: 248px;
  }

  .grid-3x3 > .pos-tr {
    width: 184px;
    margin-left: -24px;
    --tx: 48px;
    --ty: -78px;
    --ax: -196px;
    --ay: 238px;
  }

  .grid-3x3 > .pos-ml {
    width: 172px;
    height: 184px;
    margin-left: -12px;
    --tx: -83px;
    --ty: -24px;
    --ax: 249px;
    --ay: 12px;
  }

  .grid-3x3 > .pos-mr {
    width: 160px;
    height: 208px;
    --tx: 98px;
    --ty: -14px;
    --ax: -258px;
    --ay: -10px;
  }

  .grid-3x3 > .pos-bl {
    width: 184px;
    height: 172px;
    --tx: -78px;
    --ty: 78px;
    --ax: 226px;
    --ay: -244px;
  }

  .grid-3x3 > .pos-bottomwide {
    width: 290px;
    height: 152px;
    --tx: 45px;
    --ty: 83px;
    --ax: -110px;
    --ay: -239px;
  }

  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    .grid-3x3 > .cell,
    .cell--center .pixel-card {
      background: rgba(255, 255, 255, 0.55);
    }
  }

  /* ============================
     PHASE WRAPPERS (NO CONTENT YET)
     ============================ */

  .phase1-card {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 260ms ease;
  }

  /* Fade out Phase 1 when Phase 2/3 active */
  .grid-3x3.phase2 .phase1-card,
  .grid-3x3.phase3 .phase1-card {
    opacity: 0;
    pointer-events: none;
  }

  /* Ensure UI font inside Phase 1 */
  .phase1-card,
  .phase1-card * {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .phase2-card,
  .phase3-card {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 260ms ease;
    z-index: 2; /* above base cell, below pixel card */
  }

  .grid-3x3.phase2 .phase2-card {
    opacity: 1;
    pointer-events: auto;
  }

  .grid-3x3.phase3 .phase3-card {
    opacity: 1;
    pointer-events: auto;
  }

  .grid-3x3.phase3 .phase2-card {
    opacity: 0;
    pointer-events: none;
  }

  .sqs-block-code .sqs-block-content {
    padding: 0 !important;
  }

  /* ============================
     CARD 1+2 (TOP WIDE) — PHASE 1
     TRANSPARENT / DATA BACKED / $21
     ============================ */

  .img-cutout-bg-v2 {
    position: relative;
    width: 276px;
    height: 145px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 11px;

    --glass-bg-v2: rgba(255, 255, 255, 0.12);
    --glass-border-v2: rgba(255, 255, 255, 0.28);
    --glass-blur-v2: 16px;
    --glass-saturation-v2: 140%;

    --glass-offset-v2: 6.45px;
    --glass-height-v2: 52.85px;

    --circle-size-v2: calc(var(--glass-height-v2) * 0.68);
    --circle-gap-v2: calc((var(--glass-height-v2) - var(--circle-size-v2)) / 2);
  }

  .img-cutout-canvas-v2 {
    display: block;
    width: 100%;
    height: 100%;
  }

  .glass-rect-v2 {
    position: absolute;
    box-sizing: border-box;
    left: var(--glass-offset-v2);
    right: var(--glass-offset-v2);
    bottom: var(--glass-offset-v2);
    height: var(--glass-height-v2);

    display: flex;
    align-items: center;

    padding: 0;

    background: var(--glass-bg-v2);
    border: 1px solid var(--glass-border-v2);
    backdrop-filter: blur(var(--glass-blur-v2)) saturate(var(--glass-saturation-v2));
    -webkit-backdrop-filter: blur(var(--glass-blur-v2)) saturate(var(--glass-saturation-v2));
    border-radius: 10px;
    z-index: 3;
  }

  .glass-icon-circle-v2 {
    width: var(--circle-size-v2);
    height: var(--circle-size-v2);
    margin-left: var(--circle-gap-v2);

    border-radius: 999px;
    background: rgba(95, 222, 222, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .glass-icon-v2 {
    width: calc(var(--circle-size-v2) * 0.58);
    height: calc(var(--circle-size-v2) * 0.58);
    display: block;
    filter: brightness(0) invert(1);
  }

  .glass-labels-v2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    margin-left: var(--circle-gap-v2);

    color: #ffffff;
    opacity: 0.8;
    font-weight: 600;
    font-size: calc(var(--glass-height-v2) * 0.48 * 5 / 9 * 0.94);
    line-height: 1.1;
    gap: 1px;
  }

  .glass-price-v2 {
    margin-left: auto;
    margin-right: var(--circle-gap-v2);

    display: flex;
    align-items: center;
    gap: 3px;

    color: #ffffff;
    white-space: nowrap;
  }

  .glass-price-main-v2 {
    font-weight: 900;
    font-size: calc(var(--glass-height-v2) * 0.52);
    line-height: 1;
  }

  .glass-price-sub-v2 {
    font-weight: 600;
    font-size: calc(var(--glass-height-v2) * 0.52 * 5 / 9);
    line-height: 1;
    position: relative;
    top: 1px;
  }

  /* ============================
     CARD 8+9 (BOTTOM WIDE) — PHASE 1
     ============================ */

  .img-cutout-bg {
    position: relative;
    width: 290px;
    height: 152px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 11px;
  }

  .img-cutout-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* ============================
     CARD 4 (POS-ML) — PHASE 1 "Launch-ready"
     ============================ */

  .img-cutout-bg-v7 {
    position: relative;
    width: 175px;
    height: 152px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 11px;

    --glass-bg-v7: rgba(255, 255, 255, 0.12);
    --glass-border-v7: rgba(255, 255, 255, 0.28);
    --glass-blur-v7: 16px;
    --glass-saturation-v7: 140%;

    --glass-offset-v7: 6px;
    --glass-height-v7: 34px;
  }

  .img-cutout-canvas-v7 {
    display: block;
    width: 100%;
    height: 100%;
  }

  .glass-rect-v7 {
    position: absolute;
    box-sizing: border-box;
    left: var(--glass-offset-v7);
    right: var(--glass-offset-v7);
    bottom: var(--glass-offset-v7);
    height: var(--glass-height-v7);

    background: var(--glass-bg-v7);
    border: 1px solid var(--glass-border-v7);
    backdrop-filter: blur(var(--glass-blur-v7)) saturate(var(--glass-saturation-v7));
    -webkit-backdrop-filter: blur(var(--glass-blur-v7)) saturate(var(--glass-saturation-v7));
    border-radius: 10px;
    z-index: 3;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .glass-label-v7 {
    color: #ffffff;
    opacity: 1;
    font-weight: 600;
    font-size: 13.25px;
    line-height: 1.1;
    text-align: center;
    white-space: nowrap;
  }

  /* ============================
     CARD 6 (POS-MR) — PHASE 1 "Verified / Handpicked"
     ============================ */

  .verified-card-v11 {
    position: relative;
    width: 175px;
    height: 152px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 11px;
    background: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    box-sizing: border-box;
    padding: 8px 10px;
    gap: 8px;
  }

  .v11-icon-wrap {
    width: 84px;
    height: 84px;
    margin: 0;

    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/check-verified-02-svgrepo-com.svg");
    mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/check-verified-02-svgrepo-com.svg");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
  }

  .v11-subtext {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.25;
    color: #ffffff;
    margin: 0;
    max-width: 100%;
    white-space: normal;
  }

  /* ============================
     CARD 7 (POS-BL) — PHASE 1 "Go live in 30 days"
     ============================ */

  .go-live-card-v10 {
    position: relative;
    width: 175px;
    height: 152px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 11px;
    background: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    box-sizing: border-box;
    padding: 4px 10px 8px;
  }

  .go-live-top-v10 {
    font-weight: 800;
    font-size: 110px;
    line-height: 0.9;
    margin: 0 0 6px 0;

    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;

    white-space: nowrap;
  }

  .go-live-sub-v10 {
    font-weight: 700;
    font-size: 16px;
    line-height: 1.1;
    color: #ffffff;
    white-space: nowrap;
    margin: 0;
  }

  /* ============================
     CARD 3 (POS-TR) — PHASE 1 "No hidden fees / retainers"
     ============================ */

  .no-fees-card-v9 {
    position: relative;
    width: 175px;
    height: 152px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 11px;
    background: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;

    padding: 2px 10px 8px;
    box-sizing: border-box;
  }

  .no-fees-top-v9 {
    font-weight: 800;
    font-size: 102px;
    line-height: 0.9;
    margin: 0 0 6px 0;

    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;

    white-space: nowrap;
  }

  .no-fees-mid-v9,
  .no-fees-bot-v9 {
    font-weight: 700;
    font-size: 18px;
    line-height: 1.05;
    color: #ffffff;
    white-space: nowrap;
    margin: 0;
  }

  .no-fees-bot-v9 {
    margin-top: 6px;
  }

  /* ============================
     PHASE 1 — 10PX INSET FOR ALL CONTENT ROOTS
     ============================ */

  .grid-3x3 > .cell > .phase1-card {
    border-radius: inherit;
  }

  .phase1-card--1-2 .img-cutout-bg-v2,
  .phase1-card--8-9 .img-cutout-bg,
  .phase1-card--4 .img-cutout-bg-v7,
  .phase1-card--6 .verified-card-v11,
  .phase1-card--7 .go-live-card-v10,
  .phase1-card--3 .no-fees-card-v9 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;
  }

  .phase1-card--1-2 .img-cutout-canvas-v2,
  .phase1-card--8-9 .img-cutout-canvas,
  .phase1-card--4 .img-cutout-canvas-v7 {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  `;

  var style = document.createElement('style');
  style.id = 'ss-mp-grid-section1-styles';
  style.textContent = css;
  document.head.appendChild(style);
})();

// SECTION 2 — GRID + PHASE 1 / PHASE 2 / PHASE 3 CARD CONTENT
// Paste directly under Section 1 in the same file.

(function () {
  'use strict';

  // Prevent double init if script is included twice
  if (document.getElementById('ss-mp-grid-section2-init')) return;
  var initMarker = document.createElement('meta');
  initMarker.id = 'ss-mp-grid-section2-init';
  document.head.appendChild(initMarker);

  // Find or create mount container established by Section 1 / loader
  var mount = document.getElementById('ss-mp-grid');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'ss-mp-grid';
    document.body.appendChild(mount);
  }

  // Inject original SECTION 2 HTML structure 1:1
  mount.innerHTML = `
<div class="demo-wrap">
  <button class="replay-btn" id="test">Test animation</button>

  <div class="layout-stage">
    <div
      class="grid-3x3 is-stacked"
      id="grid"
      aria-label="3x3 glassmorphic grid with multi-phase animation"
    >
      <!-- ========== TOP ROW ========== -->

      <!-- CELL: 1+2 (pos-topwide) -->
      <div class="cell anim-cell pos-topwide" data-label="1+2">
        <!-- PHASE 1 CONTENT — Transparent / Data Backed / $21 CPM -->
        <div class="phase1-card phase1-card--1-2">
          <div class="img-cutout-bg-v2">
            <canvas class="img-cutout-canvas-v2"></canvas>

            <div class="glass-rect-v2">
              <div class="glass-icon-circle-v2">
                <img
                  src="https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/coins-stacked-03-svgrepo-com.svg"
                  alt=""
                  class="glass-icon-v2"
                />
              </div>

              <div class="glass-labels-v2">
                <div>Transparent</div>
                <div>Data Backed</div>
              </div>

              <div class="glass-price-v2">
                <span class="glass-price-main-v2">$21</span>
                <span class="glass-price-sub-v2">/cpm</span>
              </div>
            </div>
          </div>
        </div>

        <!-- PHASE 2 CONTENT — VARIATION 8 (Unified Dashboard) -->
        <div class="phase2-card phase2-card--1-2">
          <div class="img-cutout-bg-v8">
            <canvas class="img-cutout-canvas-v8"></canvas>

            <div class="v8-label-wrap">
              <div class="v8-label-line v8-label-unified">Unified</div>
              <div class="v8-label-line v8-label-dashboard">Dashboard</div>
            </div>

            <img
              class="v8-top-img"
              src="https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/721f4e1b-809a-4ce8-ac0c-d19a9f26dbea/AdobeStock_9952055%281%29.png?content-type=image%2Fpng"
              alt=""
            />
          </div>
        </div>

        <!-- PHASE 3 CONTENT — VARIATION 15 (Premium Creators) -->
        <div class="phase3-card phase3-card--1-2">
          <div class="premium-card-v15">
            <div class="v15-icon-wrap"></div>
            <div class="v15-subtext">
              Premium Creators<br />Top-tier YouTube
            </div>
          </div>
        </div>
      </div>

      <div class="placeholder"></div>

      <!-- CELL: 3 (pos-tr) -->
      <div class="cell anim-cell pos-tr" data-label="3">
        <!-- PHASE 1 CONTENT — NO HIDDEN FEES / RETAINERS -->
        <div class="phase1-card phase1-card--3">
          <div class="no-fees-card-v9">
            <h1 class="no-fees-top-v9">NO</h1>
            <div class="no-fees-mid-v9">HIDDEN FEES</div>
            <div class="no-fees-bot-v9">RETAINERS</div>
          </div>
        </div>

        <!-- PHASE 2 CONTENT — VARIATION 12 (Perfect For) -->
        <div class="phase2-card phase2-card--3">
          <div class="perfect-card-v12">
            <div class="v12-icon-wrap"></div>
            <div class="v12-subtext">
              Perfect For:<br />DTC · SaaS · Growth
            </div>
          </div>
        </div>

        <!-- PHASE 3 CONTENT — VARIATION 5 (Safety & Compliance) -->
        <div class="phase3-card phase3-card--3">
          <div class="img-cutout-bg-v5">
            <canvas class="img-cutout-canvas-v5"></canvas>

            <div class="glass-rect-top-v5 glass-rect-top-left-v5">
              <img
                src="https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/building-08-svgrepo-com.svg"
                alt=""
                class="glass-top-icon-v5"
              />
            </div>

            <div class="glass-rect-top-v5 glass-rect-top-right-v5">
              <img
                src="https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/shield-02-svgrepo-com.svg"
                alt=""
                class="glass-top-icon-v5"
              />
            </div>

            <div class="glass-rect-v5">
              <div class="glass-labels-v5">
                <div class="glass-label-top-v5">Safety &amp;</div>
                <div class="glass-label-bottom-v5">Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== MIDDLE ROW ========== -->

      <!-- CELL: 4 (pos-ml) -->
      <div class="cell anim-cell pos-ml" data-label="4">
        <!-- PHASE 1 CONTENT — Launch-ready -->
        <div class="phase1-card phase1-card--4">
          <div class="img-cutout-bg-v7">
            <canvas class="img-cutout-canvas-v7"></canvas>
            <div class="glass-rect-v7">
              <div class="glass-label-v7">Launch-ready</div>
            </div>
          </div>
        </div>

        <!-- PHASE 2 CONTENT — VARIATION 4 (3 images + Multi-Creator Campaigns) -->
        <div class="phase2-card phase2-card--4">
          <div class="img-stack-bg-v4">
            <div class="stack-item-v4 img-item-v4 img-1-v4">
              <img
                src="https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/8937739f-3960-4a47-9bf9-efe242a4b0b7/Screenshot+2025-11-09+at+12.55.07+copy.png?content-type=image%2Fpng"
                alt=""
              />
            </div>
            <div class="stack-item-v4 img-item-v4 img-2-v4">
              <img
                src="https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/74af96eb-3910-49f5-b84d-d7d9cc330b7b/Screenshot+2025-11-08+at+19.26.39.png?content-type=image%2Fpng"
                alt=""
              />
            </div>
            <div class="stack-item-v4 img-item-v4 img-3-v4">
              <img
                src="https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/ca91789a-4c08-4e2f-ac9c-aafd900f45db/Screenshot+2025-11-09+at+13.01.20.png?content-type=image%2Fpng"
                alt=""
              />
            </div>
            <div class="stack-item-v4 glass-rect-v4">
              <div class="glass-labels-v4">
                <div class="glass-label-top-v4">Multi-Creator</div>
                <div class="glass-label-bottom-v4">Campaigns</div>
              </div>
            </div>
          </div>
        </div>

        <!-- PHASE 3 CONTENT — VARIATION 17 (High-impact Storytelling) -->
        <div class="phase3-card phase3-card--4">
          <div class="img-cutout-bg-v17">
            <canvas class="img-cutout-canvas-v17"></canvas>
            <div class="v17-label-wrap">
              <div class="v17-label-line">High-impact</div>
              <div class="v17-label-line v17-label-story">Storytelling</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CENTER: pixel-card -->
      <div class="cell--center">
        <div class="pixel-card">
          <canvas class="pixel-canvas"></canvas>
          <div class="pixel-center-icon" aria-hidden="true">
            <div class="pixel-center-icon-inner">
              <div id="mpA" class="mp-wrap" data-tile="0"></div>
              <div id="mpB" class="mp-wrap" data-tile="1"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- CELL: 6 (pos-mr) -->
      <div class="cell anim-cell pos-mr" data-label="6">
        <!-- PHASE 1 CONTENT — Verified / Handpicked creators -->
        <div class="phase1-card phase1-card--6">
          <div class="verified-card-v11">
            <div class="v11-icon-wrap"></div>
            <div class="v11-subtext">
              Handpicked creators<br />Brand-safe every time
            </div>
          </div>
        </div>

        <!-- PHASE 2 CONTENT — VARIATION 3 (200K+ Impressions + bar chart) -->
        <div class="phase2-card phase2-card--6">
          <div class="img-cutout-bg-v3">
            <canvas class="img-cutout-canvas-v3"></canvas>

            <div class="glass-rect-v3">
              <div class="glass-labels-v3">
                <div class="label-top-v3">
                  <span class="label-top-num-v3">200K</span>
                  <span class="label-top-plus-v3">+</span>
                </div>
                <div class="label-bottom-v3">Impressions</div>
              </div>

              <div class="simple-bar-chart-wrap-v3">
                <div class="simple-bar-chart-v3">
                  <div class="axis-x-v3"></div>
                  <div class="bar-v3 bar-1-v3"></div>
                  <div class="bar-v3 bar-2-v3"></div>
                  <div class="bar-v3 bar-3-v3"></div>
                  <div class="bar-v3 bar-4-v3"></div>
                  <div class="bar-v3 bar-5-v3"></div>
                  <div class="bar-v3 bar-6-v3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PHASE 3 CONTENT — VARIATION 14 (Global Launches) -->
        <div class="phase3-card phase3-card--6">
          <div class="global-card-v14">
            <div class="v14-icon-wrap"></div>
            <div class="v14-subtext">
              Perfect for:<br />Global Launches
            </div>
          </div>
        </div>
      </div>

      <!-- ========== BOTTOM ROW ========== -->

      <!-- CELL: 7 (pos-bl) -->
      <div class="cell anim-cell pos-bl" data-label="7">
        <!-- PHASE 1 CONTENT — Go live in 30 days -->
        <div class="phase1-card phase1-card--7">
          <div class="go-live-card-v10">
            <h1 class="go-live-top-v10">30</h1>
            <div class="go-live-sub-v10">Go live in 30 days</div>
          </div>
        </div>

        <!-- PHASE 2 CONTENT — VARIATION 16 (Always-On toggle, phase-driven ON) -->
        <div class="phase2-card phase2-card--7">
          <div class="alwayson-card-v16">
            <div class="v16-toggle-wrap">
              <div class="v16-toggle">
                <span class="v16-toggle-bg"></span>
                <span class="v16-toggle-knob"></span>
              </div>
            </div>
            <div class="v16-subtext">Always-On Exposure</div>
          </div>
        </div>

        <!-- PHASE 3 CONTENT — VARIATION 6 (300K+ Impressions cut-out) -->
        <div class="phase3-card phase3-card--7">
          <div class="img-cutout-bg-v6">
            <canvas class="img-cutout-canvas-v6"></canvas>
          </div>
        </div>
      </div>

      <!-- CELL: 8+9 (pos-bottomwide) -->
      <div class="cell anim-cell pos-bottomwide" data-label="8+9">
        <!-- PHASE 1 CONTENT — Base stacked imagery / 100K+ -->
        <div class="phase1-card phase1-card--8-9">
          <div class="img-cutout-bg">
            <canvas class="img-cutout-canvas"></canvas>
          </div>
        </div>

        <!-- PHASE 2 CONTENT — VARIATION 13 (Smarter Targeting) -->
        <div class="phase2-card phase2-card--8-9">
          <div class="targeting-card-v13">
            <div class="v13-icon-wrap"></div>
            <div class="v13-subtext">
              Smarter Targeting<br />Match by Audience
            </div>
          </div>
        </div>

        <!-- PHASE 3 CONTENT — VARIATION 8b (CMO-Ready Reporting) -->
        <div class="phase3-card phase3-card--8-9">
          <div class="img-cutout-bg-v8b">
            <canvas class="img-cutout-canvas-v8b"></canvas>
            <div class="v8b-label-wrap">
              <div class="v8b-label-line v8b-label-top">CMO-Ready</div>
              <div class="v8b-label-line v8b-label-bottom">Reporting</div>
            </div>
            <img
              class="v8b-top-img"
              src="https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/6e606773-0677-46f8-8318-7f592683b7eb/AdobeStock_995204951+-+09-11-2025+02-55-50+-+09-11-2025+03-00-48.png?content-type=image%2Fpng"
              alt=""
            />
          </div>
        </div>
      </div>

      <div class="placeholder"></div>
    </div>
  </div>
</div>
  `;

  /* SECTION 2 — PHASE 1 CARD INITIALISERS
     (Phase 2 & 3 visuals are handled in later sections)
  */

  // 1+2 — Phase 1: v2 cutout + $21 count-up
  (function () {
    var container = document.querySelector(".phase1-card--1-2 .img-cutout-bg-v2");
    if (!container) return;
    var canvas = container.querySelector(".img-cutout-canvas-v2");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var IMG_BASE_SRC_V2 =
      "https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/27dc275d-c396-4496-8e0a-5188feb0c6bf/Screenshot+2025-11-08+at+13.31.27.png?content-type=image%2Fpng";
    var IMG_TOP_SRC_V2 =
      "https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/036025c1-93de-4d02-bf67-b787edaed6ff/uu1-2.png?content-type=image%2Fpng";

    var imgBase = new Image();
    var imgTop = new Image();
    imgBase.crossOrigin = "anonymous";
    imgTop.crossOrigin = "anonymous";
    imgBase.src = IMG_BASE_SRC_V2;
    imgTop.src = IMG_TOP_SRC_V2;

    var loaded = 0;
    function onLoad() {
      loaded++;
      if (loaded === 2) draw();
    }
    imgBase.onload = onLoad;
    imgTop.onload = onLoad;

    function draw() {
      var width = container.offsetWidth || 1;
      var height = container.offsetHeight || 1;

      var ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var imgRatio = imgBase.width / imgBase.height;
      var boxRatio = width / height;
      var drawWidth, drawHeight, dx, dy;

      if (imgRatio > boxRatio) {
        drawHeight = height;
        drawWidth = height * imgRatio;
        dx = (width - drawWidth) / 2;
        dy = 0;
      } else {
        drawWidth = width;
        drawHeight = width / imgRatio;
        dx = 0;
        dy = (height - drawHeight) / 2;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(imgBase, dx, dy, drawWidth, drawHeight);
      ctx.drawImage(imgTop, dx, dy, drawWidth, drawHeight);
    }

    function animateCount(el, target, duration) {
      var start = 0;
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = (ts - startTime) / duration;
        if (progress > 1) progress = 1;

        var value = Math.floor(start + (target - start) * progress);
        el.textContent = "$" + value;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = "$" + target;
        }
      }

      requestAnimationFrame(step);
    }

    function initCountUp() {
      var el = container.querySelector(".glass-price-main-v2");
      if (!el) return;
      var raw = el.textContent.replace(/[^0-9]/g, "") || "21";
      var target = parseInt(raw, 10) || 21;
      el.textContent = "$0";
      animateCount(el, target, 800);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCountUp, { once: true });
    } else {
      initCountUp();
    }
  })();

  // 8+9 — Phase 1 stacked image with 100K+ cut-out (canvas-based)
  (function () {
    var container = document.querySelector(".phase1-card--8-9 .img-cutout-bg");
    if (!container) return;
    var canvas = container.querySelector(".img-cutout-canvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var IMG_BASE_SRC =
      "https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/0469e91d-220d-4b21-9cf5-3936bb291af6/Screenshot+2025-11-08+at+11.48.53.png?content-type=image%2Fpng";
    var IMG_TOP_SRC =
      "https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/345afe09-3a6e-4258-af31-a71897768b03/Screenshot+11.48.53.png?content-type=image%2Fpng";

    var imgBase = new Image();
    var imgTop = new Image();
    imgBase.crossOrigin = "anonymous";
    imgTop.crossOrigin = "anonymous";
    imgBase.src = IMG_BASE_SRC;
    imgTop.src = IMG_TOP_SRC;

    var loaded = 0;
    function onLoad() {
      loaded++;
      if (loaded === 2) draw();
    }
    imgBase.onload = onLoad;
    imgTop.onload = onLoad;

    function draw() {
      var width = container.offsetWidth || 1;
      var height = container.offsetHeight || 1;

      var ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Base image cover-fit
      var imgRatio = imgBase.width / imgBase.height;
      var boxRatio = width / height;
      var drawWidth, drawHeight, dx, dy;

      if (imgRatio > boxRatio) {
        drawHeight = height;
        drawWidth = height * imgRatio;
        dx = (width - drawWidth) / 2;
        dy = 0;
      } else {
        drawWidth = width;
        drawHeight = width / imgRatio;
        dx = 0;
        dy = (height - drawHeight) / 2;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(imgBase, dx, dy, drawWidth, drawHeight);

      // Define square cut-out zone
      var margin = (40 / 900) * height;
      var radius = 10;
      var side = height - margin * 2;

      if (side > 0) {
        var x = width - margin - side;
        var y = margin;

        // Punch out rounded square
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        var r = Math.min(radius, side / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + side - r, y);
        ctx.quadraticCurveTo(x + side, y, x + side, y + r);
        ctx.lineTo(x + side, y + side - r);
        ctx.quadraticCurveTo(x + side, y + side, x + side - r, y + side);
        ctx.lineTo(x + r, y + side);
        ctx.quadraticCurveTo(x, y + side, x, y + side - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw top overlay
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(imgTop, dx, dy, drawWidth, drawHeight);

        // Text inside cut-out
        var textMain = "100K";
        var textPlus = "+";
        var text2 = "IMPRESSIONS";

        var fontSize1 = side * 0.31;
        var fontSizePlus = fontSize1 * (5 / 9);
        var fontSize2 = side * 0.13;

        ctx.textBaseline = "alphabetic";

        // 100K metrics
        ctx.font = "900 " + fontSize1 + "px system-ui,-apple-system,BlinkMacSystemFont,sans-serif";
        var mMain = ctx.measureText(textMain);
        var mainAscent = mMain.actualBoundingBoxAscent || fontSize1;
        var mainDescent = mMain.actualBoundingBoxDescent || 0;
        var mainWidth = mMain.width;

        // + metrics
        ctx.font = "700 " + fontSizePlus + "px system-ui,-apple-system,BlinkMacSystemFont,sans-serif";
        var mPlus = ctx.measureText(textPlus);
        var plusAscent = mPlus.actualBoundingBoxAscent || fontSizePlus;
        var plusDescent = mPlus.actualBoundingBoxDescent || 0;
        var plusWidth = mPlus.width;

        var line1Ascent = Math.max(mainAscent, plusAscent);
        var line1Descent = Math.max(mainDescent, plusDescent);

        // IMPRESSIONS metrics
        ctx.font = "600 " + fontSize2 + "px system-ui,-apple-system,BlinkMacSystemFont,sans-serif";
        var m2 = ctx.measureText(text2);
        var th2 = (m2.actualBoundingBoxAscent || fontSize2) + (m2.actualBoundingBoxDescent || 0);

        // Vertical spacing
        var innerSpace = side - (line1Ascent + line1Descent) - th2;
        var M = innerSpace / 2.5;
        if (M < 0) M = 0;
        var G = 0.5 * M;

        var xCenter = x + side / 2;
        var totalLine1Width = mainWidth + plusWidth;
        var startX = xCenter - totalLine1Width / 2;
        var baseline1 = y + M + line1Ascent;

        // Draw 100K
        ctx.font = "900 " + fontSize1 + "px system-ui,-apple-system,BlinkMacSystemFont,sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(textMain, startX, baseline1);

        // Draw +
        var mainTop = baseline1 - mainAscent;
        var mainBottom = baseline1 + mainDescent;
        var mainCenter = (mainTop + mainBottom) / 2;
        var plusCenterOffset = (plusAscent - plusDescent) / 2;
        var plusBaseline = mainCenter + plusCenterOffset;

        ctx.font = "700 " + fontSizePlus + "px system-ui,-apple-system,BlinkMacSystemFont,sans-serif";
        ctx.fillText(textPlus, startX + mainWidth, plusBaseline);

        // Draw IMPRESSIONS
        ctx.textAlign = "center";
        ctx.font = "600 " + fontSize2 + "px system-ui,-apple-system,BlinkMacSystemFont,sans-serif";
        var baseline2 = baseline1 + line1Descent + G + (m2.actualBoundingBoxAscent || fontSize2);
        ctx.fillText(text2, xCenter, baseline2);
      }
    }
  })();

  // 4 — Phase 1 Launch-ready background
  (function () {
    var container = document.querySelector(".phase1-card--4 .img-cutout-bg-v7");
    if (!container) return;
    var canvas = container.querySelector(".img-cutout-canvas-v7");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var IMG_BASE_SRC_V7 =
      "https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/d1005646-5a30-4861-a547-be8249902d59/Screenshot+2025-11-08+at+23.46.png?content-type=image%2Fpng";

    var imgBase = new Image();
    imgBase.crossOrigin = "anonymous";
    imgBase.src = IMG_BASE_SRC_V7;

    imgBase.onload = function () {
      var width = container.offsetWidth || 1;
      var height = container.offsetHeight || 1;
      var ratio = window.devicePixelRatio || 1;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      var imgRatio = imgBase.width / imgBase.height;
      var boxRatio = width / height;
      var drawWidth, drawHeight, dx, dy;

      if (imgRatio > boxRatio) {
        drawHeight = height;
        drawWidth = height * imgRatio;
        dx = (width - drawWidth) / 2;
        dy = 0;
      } else {
        drawWidth = width;
        drawHeight = width / imgRatio;
        dx = 0;
        dy = (height - drawHeight) / 2;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(imgBase, dx, dy, drawWidth, drawHeight);
    };
  })();

})();

// SECTION 3 — OUTER MULTI-PHASE LAYOUT ANIMATION (USING DATA-LABELS + PHASE 1 FADE-OUT)

(function () {
  const grid = document.getElementById('grid');
  const btn  = document.getElementById('test');
  if (!grid || !btn) return;

  const centerEl = grid.querySelector('.pixel-card');

  /* Layout 1 sizes, keyed by data-label (matches Section 1 layout) */
  const L1_SIZES = {
    '1+2': { w:305, h:160 },
    '3':   { w:184, h:160 },
    '4':   { w:172, h:184 },
    '6':   { w:160, h:208 },
    '7':   { w:184, h:172 },
    '8+9': { w:290, h:152 }
  };

  /* Phase 2 layout: offsets from center + target size */
  const L2_TARGETS = {
    '6':   { dx:248,  dy:-130.5, w:160, h:305 },
    '8+9': { dx:238,  dy:196,    w:160, h:184 },
    '3':   { dx:12,   dy:-249,   w:184, h:172 },
    '7':   { dx:-10,  dy:258,    w:208, h:160 },
    '1+2': { dx:-244, dy:-226,   w:172, h:184 },
    '4':   { dx:-239, dy:110,    w:152, h:290 }
  };

  /* Phase 3 layout: offsets from center + target size */
  const L3_TARGETS = {
    '3':   { dx:130.5, dy:-248, w:305, h:160 },
    '1+2': { dx:-196,  dy:-238, w:184, h:160 },
    '6':   { dx:249,   dy:12,   w:172, h:184 },
    '4':   { dx:-258,  dy:38,   w:160, h:208 },
    '8+9': { dx:226,   dy:256,  w:184, h:172 },
    '7':   { dx:-110,  dy:241,  w:290, h:152 }
  };

  /* Map data-label -> element (no reliance on inner text) */
  function getLabeledCells(root = grid) {
    const map = {};
    root.querySelectorAll('.cell.anim-cell').forEach(el => {
      const label = el.getAttribute('data-label');
      if (label) map[label] = el;
    });
    return map;
  }

  function getCenterPoint(el) {
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top  + r.height / 2
    };
  }

  /* Wait until all .anim-cell transform transitions complete, then cb() */
  function waitForTransformEndThen(cb) {
    const animCells = Array.from(grid.querySelectorAll('.cell.anim-cell'));
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || animCells.length === 0) {
      cb();
      return;
    }

    const waiting = new Set(animCells);
    let handled = false;

    function onEnd(e) {
      if (e.propertyName !== 'transform') return;
      waiting.delete(e.currentTarget);
      if (!handled && waiting.size === 0) {
        handled = true;
        animCells.forEach(el =>
          el.removeEventListener('transitionend', onEnd)
        );
        cb();
      }
    }

    animCells.forEach(el =>
      el.addEventListener('transitionend', onEnd)
    );
  }

  /* Reset cards back to Layout 1 & clear phase offsets */
  function resetToLayout1() {
    grid.classList.remove('phase2', 'phase3', 'size-armed', 'is-stacked', 'prep');

    const map = getLabeledCells();
    for (const label in map) {
      const el = map[label];

      el.style.removeProperty('--dx');
      el.style.removeProperty('--dy');
      el.style.removeProperty('--ex');
      el.style.removeProperty('--ey');

      if (L1_SIZES[label]) {
        el.style.width  = L1_SIZES[label].w + 'px';
        el.style.height = L1_SIZES[label].h + 'px';
      } else {
        el.style.width  = '';
        el.style.height = '';
      }
    }
  }

  /* One-time warm-up clone to pre-bake transitions (avoid first-run jank) */
  let warmed = false;
  function warmUpOnce() {
    if (warmed) return;
    warmed = true;

    const clone = grid.cloneNode(true);
    clone.id = 'grid-warmup';
    clone.classList.remove('is-stacked', 'phase2', 'phase3', 'size-armed');
    clone.classList.add('warmup', 'size-armed');

    // Hide any phase1 content inside the warmup clone
    clone.querySelectorAll('.phase1-card').forEach(el => {
      el.style.opacity = '0';
    });

    document.body.appendChild(clone);

    const map = getLabeledCells(clone);

    // Pre-apply Phase 3 sizes
    for (const label in L3_TARGETS) {
      const el = map[label];
      if (!el) continue;
      const t = L3_TARGETS[label];
      el.style.width  = t.w + 'px';
      el.style.height = t.h + 'px';
    }
    void clone.offsetWidth;

    // Then Phase 2 sizes
    for (const label in L2_TARGETS) {
      const el = map[label];
      if (!el) continue;
      const t = L2_TARGETS[label];
      el.style.width  = t.w + 'px';
      el.style.height = t.h + 'px';
    }
    void clone.offsetWidth;

    // Cleanup
    requestAnimationFrame(() => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
    });
  }

  /**
   * Animate a phase:
   * - targets: map of label -> {dx, dy, w, h}
   * - phaseClass: "phase2" or "phase3"
   * - xVar/yVar: which CSS vars to write ("dx","dy" or "ex","ey")
   *
   * Adding phaseClass also drives the Phase 1 / Phase 2 / Phase 3
   * content fades defined in your CSS.
   */
  function animatePhase(targets, phaseClass, xVar, yVar) {
    const map = getLabeledCells();
    const c = getCenterPoint(centerEl);

    // Add phase state so CSS (including fades) can react
    grid.classList.add(phaseClass);
    void grid.offsetWidth; // reflow

    // Measure current positions after class change
    const measures = {};
    for (const label in targets) {
      const el = map[label];
      if (!el) continue;
      measures[label] = el.getBoundingClientRect();
    }

    // Compute per-card deltas + apply CSS vars & sizes
    for (const label in targets) {
      const el = map[label];
      if (!el) continue;

      const r = measures[label];
      const t = targets[label];

      const currentTopLeft = { x: r.left, y: r.top };
      const targetCenter   = { x: c.x + t.dx, y: c.y + t.dy };
      const targetTopLeft  = {
        x: targetCenter.x - t.w / 2,
        y: targetCenter.y - t.h / 2
      };

      const dx = targetTopLeft.x - currentTopLeft.x;
      const dy = targetTopLeft.y - currentTopLeft.y;

      el.style.setProperty(`--${xVar}`, dx + 'px');
      el.style.setProperty(`--${yVar}`, dy + 'px');
      el.style.width  = t.w + 'px';
      el.style.height = t.h + 'px';
    }
  }

  /* Hook to the center pixel-card wipe system */
  function triggerCenterWipe() {
    if (window.__CENTER_PIXEL &&
        typeof window.__CENTER_PIXEL.startWipe === 'function') {
      window.__CENTER_PIXEL.startWipe();
    }
  }

  /**
   * Master timeline:
   * 1) Reset + stack
   * 2) Stack -> Layout 1 (Phase 1 visible)
   * 3) Phase 2:
   *      - trigger center wipe
   *      - morph to L2_TARGETS
   * 4) Phase 3:
   *      - trigger center wipe
   *      - morph to L3_TARGETS
   * Phase content fades are handled purely by CSS on .phase2/.phase3.
   */
  function play() {
    warmUpOnce();
    resetToLayout1();

    // Phase 1: stack -> Layout 1 (uses base --phase-dur)
    grid.classList.add('prep');
    grid.classList.add('is-stacked');
    void grid.offsetHeight;        // force reflow
    grid.classList.remove('prep'); // allow transition

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.classList.remove('is-stacked');

        // When stack -> layout1 ends…
        waitForTransformEndThen(() => {
          // Use fast transitions for upcoming phases
          grid.classList.add('size-armed');
          void grid.offsetWidth;

          // Pause before Phase 2
          setTimeout(() => {
            // Phase 2: wipe, then morph
            triggerCenterWipe();
            setTimeout(() => {
              animatePhase(L2_TARGETS, 'phase2', 'dx', 'dy');
            }, 200);

            // After Phase 2 motion completes, schedule Phase 3
            waitForTransformEndThen(() => {
              setTimeout(() => {
                triggerCenterWipe();
                setTimeout(() => {
                  animatePhase(L3_TARGETS, 'phase3', 'ex', 'ey');
                }, 200);
              }, 2000);
            });
          }, 2000);
        });
      });
    });
  }

  btn.addEventListener('click', play);

  if (document.readyState === 'complete') {
    warmUpOnce();
  } else {
    window.addEventListener('load', warmUpOnce, { once: true });
  }
})();

// SECTION 4 — CENTER PIXEL-CARD WAVE + LOGO WIPE (SYNCED WITH SECTION 2 + __MP)

(function () {
  'use strict';

  const GAP = 4;
  const COLORS = ['#88fbf4', '#5fdede', '#02c2cb'];

  const DELAY_MS_PER_PX  = 3.2;
  const SHIMMER_DURATION = 220;
  const SHIMMER_RATE_MS  = 0.00168;
  const APPEAR_RATE_MIN  = 0.006, APPEAR_RATE_MAX = 0.012;
  const FADE_RATE_MIN    = 0.010, FADE_RATE_MAX   = 0.018;

  // Controls how the wipe line moves over time and between front/back logos
  const ICON_WIPE_K_FACTOR  = 1.092;
  const ICON_WIPE_OFFSET_PX = 84;
  const ICON_WIPE_BLUR_PX   = 32;
  const THRESHOLD_GAP_PX    = 24;

  /* Pixel object for the cascading neon squares */
  class Pixel {
    constructor(x, y, colorIndex) {
      this.x = x;
      this.y = y;
      this.colorIndex = colorIndex;

      this.minSize = 0.5;
      this.maxSizeInteger = 2;
      this.maxSize = Math.random() * (this.maxSizeInteger - this.minSize) + this.minSize;

      this.appearRate = APPEAR_RATE_MIN + Math.random() * (APPEAR_RATE_MAX - APPEAR_RATE_MIN);
      this.fadeRate   = FADE_RATE_MIN   + Math.random() * (FADE_RATE_MAX   - FADE_RATE_MIN);

      this.shimmerRateMs   = SHIMMER_RATE_MS;
      this.shimmerDuration = SHIMMER_DURATION;

      this.size = 0;
      this.delayUnits = 0;
      this.counterMs = 0;
      this.phaseMs = 0;
      this.mode = 'waiting';
      this.isReverse = false;
    }

    reset() {
      this.size = 0;
      this.counterMs = 0;
      this.phaseMs = 0;
      this.isReverse = false;
      this.mode = 'waiting';
    }

    tick(dt) {
      switch (this.mode) {
        case 'waiting': {
          const needMs = this.delayUnits * DELAY_MS_PER_PX;
          if (this.counterMs < needMs) {
            this.counterMs += dt;
            return true;
          }
          this.mode = 'appearing';
          // fall through
        }
        case 'appearing': {
          this.size += this.appearRate * dt;
          if (this.size >= this.maxSize) {
            this.size = this.maxSize;
            this.mode = this.shimmerDuration > 0 ? 'shimmering' : 'disappearing';
            this.phaseMs = 0;
          }
          return true;
        }
        case 'shimmering': {
          if (this.phaseMs >= this.shimmerDuration) {
            this.mode = 'disappearing';
          } else {
            const step = this.shimmerRateMs * dt;
            if (this.size >= this.maxSize) this.isReverse = true;
            else if (this.size <= this.minSize) this.isReverse = false;

            this.size += this.isReverse ? -step : step;

            if (this.size < 0) this.size = 0;
            else if (this.size > this.maxSize) this.size = this.maxSize;

            this.phaseMs += dt;
            return true;
          }
        }
        // fall through into disappearing
        case 'disappearing': {
          this.size -= this.fadeRate * dt;
          if (this.size <= 0) {
            this.size = 0;
            this.mode = 'done';
            return false;
          }
          return true;
        }
        default:
          return false;
      }
    }
  }

  /* Mask helpers for the logo wipe */
  function maskNone(el) {
    if (!el) return;
    el.style.webkitMaskImage = 'none';
    el.style.maskImage = 'none';
  }

  function maskHidden(el) {
    if (!el) return;
    const grad = 'linear-gradient(to top, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)';
    el.style.webkitMaskImage = grad;
    el.style.maskImage = grad;
  }

  function maskGradient(el, hiddenPx, totalH, blurPx, invert) {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const h = rect.height || totalH || 1;

    const p = Math.max(0, Math.min(h, hiddenPx));
    const b = Math.max(0, blurPx);

    const p1 = Math.max(0, (p - b * 0.5) / h * 100);
    const p2 = Math.min(100, (p + b * 0.5) / h * 100);

    let grad;
    if (invert) {
      // Reveal from top downward (inverse)
      grad = 'linear-gradient(to top,' +
        'rgba(255,255,255,1) 0%,' +
        `rgba(255,255,255,1) ${p1}%,` +
        `rgba(255,255,255,0) ${p2}%,` +
        'rgba(255,255,255,0) 100%)';
    } else {
      // Reveal from bottom upward (normal)
      grad = 'linear-gradient(to top,' +
        'rgba(255,255,255,0) 0%,' +
        `rgba(255,255,255,0) ${p1}%,` +
        `rgba(255,255,255,1) ${p2}%,` +
        'rgba(255,255,255,1) 100%)';
    }

    el.style.webkitMaskImage = grad;
    el.style.maskImage = grad;
  }

  function initCard(container) {
    const canvas = container.querySelector('.pixel-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const frontEl = container.querySelector('#mpA');
    const backEl  = container.querySelector('#mpB');

    const state = {
      container,
      canvas,
      ctx,
      colors: COLORS,
      pixels: [],
      buckets: Array.from({ length: COLORS.length }, () => []),
      animationId: null,
      lastTs: performance.now(),
      startTime: null,
      frontEl,
      backEl,
      currentTile: 0,
      nextTile: 1,
      totalTiles: 3  // 3 logos in the sprite
    };

    if (state.frontEl) maskNone(state.frontEl);
    if (state.backEl)  maskHidden(state.backEl);

    function initPixels() {
      const rect = container.getBoundingClientRect();
      const width  = Math.max(1, rect.width | 0);
      const height = Math.max(1, rect.height | 0);

      if (canvas.width !== width)  canvas.width  = width;
      if (canvas.height !== height) canvas.height = height;
      canvas.style.width  = width + 'px';
      canvas.style.height = height + 'px';

      const pxs = [];
      for (let x = 0; x < width; x += GAP) {
        for (let y = 0; y < height; y += GAP) {
          const colorIndex = (Math.random() * state.colors.length) | 0;
          const p = new Pixel(x, y, colorIndex);
          // Delay from bottom to top: lower pixels start sooner
          p.delayUnits = (height - y);
          pxs.push(p);
        }
      }
      state.pixels = pxs;
      ctx.clearRect(0, 0, width, height);

      // If a wipe is underway, keep the mask aligned
      if (state.startTime !== null) {
        updateIconWipe(performance.now());
      }
    }

    function resetPixels() {
      for (let i = 0; i < state.pixels.length; i++) {
        state.pixels[i].reset();
      }
    }

    function drawBuckets() {
      const { ctx, colors, buckets } = state;
      for (let c = 0; c < buckets.length; c++) {
        const arr = buckets[c];
        if (!arr.length) continue;
        ctx.fillStyle = colors[c];
        // arr: [x, y, size, x, y, size, ...]
        for (let i = 0; i < arr.length; i += 3) {
          ctx.fillRect(arr[i], arr[i + 1], arr[i + 2], arr[i + 2]);
        }
        arr.length = 0;
      }
    }

    function updateIconWipe(now) {
      if (state.startTime === null) return;

      const elapsed = now - state.startTime;
      const basePx  = ICON_WIPE_K_FACTOR * (elapsed / DELAY_MS_PER_PX);
      const totalH  = state.canvas.height || 1;

      const frontLine = basePx - ICON_WIPE_OFFSET_PX;
      const backLine  = frontLine - THRESHOLD_GAP_PX;

      // Front logo: normal gradient; back logo: inverted gradient
      if (state.frontEl) {
        maskGradient(state.frontEl, frontLine, totalH, ICON_WIPE_BLUR_PX, false);
      }
      if (state.backEl) {
        maskGradient(state.backEl,  backLine,  totalH, ICON_WIPE_BLUR_PX, true);
      }
    }

    function loop() {
      state.animationId = requestAnimationFrame(loop);

      const now = performance.now();
      let dt = now - state.lastTs;
      state.lastTs = now;
      if (dt > 50) dt = 50;

      if (state.startTime !== null) {
        updateIconWipe(now);
      }

      const { ctx, canvas, pixels, buckets } = state;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let anyActive = false;

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        const active = p.tick(dt);
        if (active) anyActive = true;

        if (p.size > 0) {
          const offset = 1 - p.size * 0.5;
          const arr = buckets[p.colorIndex];
          arr.push(p.x + offset, p.y + offset, p.size);
        }
      }

      drawBuckets();

      // When all pixels are done, complete the wipe & advance logo
      if (!anyActive) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;

        // Advance tile index
        state.currentTile = state.nextTile;
        state.nextTile = (state.currentTile + 1) % state.totalTiles;

        // Swap front/back mp-wraps
        if (state.frontEl && state.backEl) {
          const tmp = state.frontEl;
          state.frontEl = state.backEl;
          state.backEl = tmp;

          maskNone(state.frontEl);
          maskHidden(state.backEl);
        }

        // Ask metallic renderer to prepare next tile on hidden side
        if (window.__MP &&
            typeof window.__MP.setTile === 'function' &&
            state.backEl) {
          window.__MP.setTile(state.backEl, state.nextTile);
        }

        state.startTime = null;
      }
    }

    function startWipe() {
      if (!state.pixels.length) {
        initPixels();
      } else {
        resetPixels();
      }

      state.lastTs = performance.now();
      state.startTime = state.lastTs;
      updateIconWipe(state.lastTs);

      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
      }
      state.animationId = requestAnimationFrame(loop);
    }

    // Expose single global entry point used by Section 3 layout script
    if (!window.__CENTER_PIXEL) {
      window.__CENTER_PIXEL = {};
    }
    window.__CENTER_PIXEL.startWipe = startWipe;

    // Initial setup
    initPixels();

    // Keep pixel grid & wipe aligned with card size on resize
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => {
        state.buckets = Array.from({ length: state.colors.length }, () => []);
        initPixels();
      });
      ro.observe(container);
    }

    // Initialize tile indices from data attributes if present
    if (state.frontEl) {
      const initA = parseInt(state.frontEl.getAttribute('data-tile') || '0', 10) || 0;
      state.currentTile = initA;
    }
    if (state.backEl) {
      const initB = parseInt(state.backEl.getAttribute('data-tile') || '1', 10) || 1;
      state.nextTile = initB;
    }
  }

  function initAll() {
    document.querySelectorAll('.pixel-card').forEach(initCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();

// SECTION 5 — METALLIC PAINT WEBGL LOGO RENDERER (SINGLE SOURCE OF TRUTH, A<->C SWAP)

(function () {
  'use strict';

  var LOGO_URL = 'https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/sponsource-icons2.svg';

  // Cache for fetched sprite text
  var SPRITE_TEXT_PROMISE = null;

  function fetchSpriteText() {
    if (!SPRITE_TEXT_PROMISE) {
      SPRITE_TEXT_PROMISE = fetch(LOGO_URL, { mode: 'cors' })
        .then(function (res) {
          if (!res.ok) throw new Error('Logo fetch ' + res.status);
          return res.text();
        });
    }
    return SPRITE_TEXT_PROMISE;
  }

  // Helper: construct a Blob/File from text
  function fileFromText(txt) {
    try {
      return new File([txt], 'logos.svg', { type: 'image/svg+xml' });
    } catch (e) {
      return new Blob([txt], { type: 'image/svg+xml' });
    }
  }

  // Per-tile caches
  var TILE_CACHE   = Object.create(null); // mappedIndex -> ImageData
  var TILE_PROMISE = Object.create(null); // mappedIndex -> Promise

  /**
   * Parse one logo tile from sprite into a heightfield ImageData.
   * Applies A<->C swap:
   *   request 0 -> use tile 2
   *   request 2 -> use tile 0
   *   request 1 -> use tile 1
   */
  function parseLogoImageFromSprite(tileIndex) {
    // Clamp input to valid [0,2]
    var idx = Math.max(0, Math.min((tileIndex | 0), 2));

    // A<->C swap mapping
    var mapped = idx;
    if (idx === 0) mapped = 2;
    else if (idx === 2) mapped = 0;

    // Serve from cache if available
    if (TILE_CACHE[mapped])   return Promise.resolve({ imageData: TILE_CACHE[mapped] });
    if (TILE_PROMISE[mapped]) return TILE_PROMISE[mapped];

    TILE_PROMISE[mapped] = fetchSpriteText().then(function (txt) {
      var file = fileFromText(txt);

      return new Promise(function (resolve, reject) {
        var img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = function () {
          try {
            var TILE = 800; // each logo tile is 800x800
            var sc = document.createElement('canvas');
            sc.width = TILE;
            sc.height = TILE;
            var sctx = sc.getContext('2d');
            if (!sctx) throw new Error('No 2D context for sprite');

            // Choose slice based on mapped index
            var sx = mapped * TILE;
            sctx.drawImage(img, sx, 0, TILE, TILE, 0, 0, TILE, TILE);

            var id = sctx.getImageData(0, 0, TILE, TILE);
            var data = id.data;
            var w = TILE, h = TILE;
            var size = w * h;

            // mask: true where logo exists
            var mask = new Array(size);
            for (var i = 0; i < size; i++) {
              var p = i * 4;
              var r = data[p];
              var g = data[p + 1];
              var b = data[p + 2];
              var a = data[p + 3];

              // Treat pure white or fully transparent as background
              mask[i] = !((r === 255 && g === 255 && b === 255 && a === 255) || a === 0);
            }

            // boundary: logo pixels adjacent to background
            var boundary = new Array(size).fill(false);

            function inside(x, y) {
              if (x < 0 || x >= w || y < 0 || y >= h) return false;
              return mask[y * w + x];
            }

            for (var y = 0; y < h; y++) {
              for (var x = 0; x < w; x++) {
                var idx1 = y * w + x;
                if (!mask[idx1]) continue;

                var isB = false;
                for (var ny = y - 1; ny <= y + 1 && !isB; ny++) {
                  for (var nx = x - 1; nx <= x + 1 && !isB; nx++) {
                    if (!inside(nx, ny)) isB = true;
                  }
                }
                if (isB) boundary[idx1] = true;
              }
            }

            // Solve a simple Laplace-like equation to get a smooth "heightfield"
            var u = new Float32Array(size);
            var nu = new Float32Array(size);
            var C = 0.01;
            var ITERS = 300;

            function getU(x, y, arr) {
              if (x < 0 || x >= w || y < 0 || y >= h) return 0;
              var idx2 = y * w + x;
              if (!mask[idx2]) return 0;
              return arr[idx2];
            }

            for (var it = 0; it < ITERS; it++) {
              for (var yy = 0; yy < h; yy++) {
                var row = yy * w;
                for (var xx = 0; xx < w; xx++) {
                  var id2 = row + xx;
                  if (!mask[id2] || boundary[id2]) {
                    nu[id2] = 0;
                    continue;
                  }
                  var sum =
                    getU(xx + 1, yy, u) +
                    getU(xx - 1, yy, u) +
                    getU(xx, yy + 1, u) +
                    getU(xx, yy - 1, u);

                  nu[id2] = (C + sum) / 4;
                }
              }
              u.set(nu);
            }

            // Normalize and map to grayscale (height -> dark, edges bright)
            var maxVal = 0;
            for (var k = 0; k < size; k++) {
              if (u[k] > maxVal) maxVal = u[k];
            }
            if (maxVal <= 0) maxVal = 1;

            var alpha = 2.0;
            var out = sctx.createImageData(w, h);

            for (var yy2 = 0; yy2 < h; yy2++) {
              var row2 = yy2 * w;
              for (var xx2 = 0; xx2 < w; xx2++) {
                var idx3 = row2 + xx2;
                var p2 = idx3 * 4;

                if (!mask[idx3]) {
                  // Background: solid white
                  out.data[p2]     = 255;
                  out.data[p2 + 1] = 255;
                  out.data[p2 + 2] = 255;
                  out.data[p2 + 3] = 255;
                } else {
                  var raw = u[idx3] / maxVal;
                  var remapped = Math.pow(raw, alpha);
                  var gray = 255 * (1 - remapped); // deeper -> darker
                  out.data[p2]     = gray;
                  out.data[p2 + 1] = gray;
                  out.data[p2 + 2] = gray;
                  out.data[p2 + 3] = 255;
                }
              }
            }

            TILE_CACHE[mapped] = out;
            resolve({ imageData: out });
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = function () {
          reject(new Error('Failed to load sprite image'));
        };

        img.src = URL.createObjectURL(file);
      });
    });

    return TILE_PROMISE[mapped];
  }

  /* Build shaders (GL2 or GL1) using a shared metallic core */
  function buildShaders(isGL2) {
    var FS_CORE =
"%varying% vec2 vUv;\n" +
"%fragout%\n" +
"uniform sampler2D u_image_texture;\n" +
"uniform float u_time, u_ratio, u_img_ratio, u_patternScale, u_refraction, u_edge, u_patternBlur, u_liquid;\n" +
"uniform vec3  u_overlay_color;\n" +
"uniform float u_overlay_alpha;\n" +
"uniform int   u_mode;\n" +
"uniform float u_logo_scale;\n" +
"#define PI 3.14159265358979323846\n" +
"vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}\n" +
"vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}\n" +
"vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} \n" +
"float snoise(vec2 v){\n" +
"  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);\n" +
"  vec2 i=floor(v+dot(v,C.yy));\n" +
"  vec2 x0=v-i+dot(i,C.xx);\n" +
"  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);\n" +
"  vec4 x12=x0.xyxy+C.xxzz;\n" +
"  x12.xy-=i1;\n" +
"  i=mod289(i);\n" +
"  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));\n" +
"  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);\n" +
"  m*=m;\n" +
"  m*=m;\n" +
"  vec3 x=2.0*fract(p*C.www)-1.0;\n" +
"  vec3 h=abs(x)-0.5;\n" +
"  vec3 ox=floor(x+0.5);\n" +
"  vec3 a0=x-ox;\n" +
"  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);\n" +
"  vec3 g;\n" +
"  g.x=a0.x*x0.x+h.x*x0.y;\n" +
"  g.yz=a0.yz*x12.xz+h.yz*x12.yw;\n" +
"  return 130.0*dot(m,g);\n" +
"}\n" +
"vec2 get_img_uv(){\n" +
"  vec2 img_uv=vUv;\n" +
"  img_uv-=0.5;\n" +
"  if(u_ratio>u_img_ratio){\n" +
"    img_uv.x=img_uv.x*u_ratio/u_img_ratio;\n" +
"  } else {\n" +
"    img_uv.y=img_uv.y*u_img_ratio/u_ratio;\n" +
"  }\n" +
"  img_uv*=u_logo_scale;\n" +
"  img_uv+=0.5;\n" +
"  img_uv.y=1.0-img_uv.y;\n" +
"  return img_uv;\n" +
"}\n" +
"vec2 rotate2d(vec2 uv,float th){\n" +
"  float c=cos(th), s=sin(th);\n" +
"  return mat2(c,s,-s,c)*uv;\n" +
"}\n" +
"float get_color_channel(float c1,float c2,float p,vec3 w,float extra,float b){\n" +
"  float ch=c2;\n" +
"  float border=0.0;\n" +
"  float blur=u_patternBlur+extra;\n" +
"  ch=mix(ch,c1,smoothstep(0.0,blur,p));\n" +
"  border=w[0];\n" +
"  ch=mix(ch,c2,smoothstep(border-blur,border+blur,p));\n" +
"  b=smoothstep(0.2,0.8,b);\n" +
"  border=w[0]+0.4*(1.0-b)*w[1];\n" +
"  ch=mix(ch,c1,smoothstep(border-blur,border+blur,p));\n" +
"  border=w[0]+0.5*(1.0-b)*w[1];\n" +
"  ch=mix(ch,c2,smoothstep(border-blur,border+blur,p));\n" +
"  border=w[0]+w[1];\n" +
"  ch=mix(ch,c1,smoothstep(border-blur,border+blur,p));\n" +
"  float t=(p-w[0]-w[1])/w[2];\n" +
"  float grad=mix(c1,c2,smoothstep(0.0,1.0,t));\n" +
"  ch=mix(ch,grad,smoothstep(border-blur,border+blur,p));\n" +
"  return ch;\n" +
"}\n" +
"float get_img_frame_alpha(vec2 uv,float w){\n" +
"  float a=smoothstep(0.0,w,uv.x)*smoothstep(1.0,1.0-w,uv.x);\n" +
"  a*=smoothstep(0.0,w,uv.y)*smoothstep(1.0,1.0-w,uv.y);\n" +
"  return a;\n" +
"}\n" +
"void main(){\n" +
"  vec2 uv=vec2(vUv.x,1.0-vUv.y);\n" +
"  uv.x*=u_ratio;\n" +
"  float diagonal=uv.x-uv.y;\n" +
"  float t=0.001*u_time;\n" +
"  vec2 img_uv=get_img_uv();\n" +
"  vec4 img=texture2D(u_image_texture,img_uv);\n" +
"  float edge=img.r;\n" +
"  vec2 guv=uv-0.5;\n" +
"  float dist=length(guv+vec2(0.0,0.2*diagonal));\n" +
"  guv=rotate2d(guv,(0.25-0.2*diagonal)*PI);\n" +
"  float bulge=pow(1.8*dist,1.2);\n" +
"  bulge=1.0-bulge;\n" +
"  bulge*=pow(uv.y,0.3);\n" +
"  float cycle=u_patternScale;\n" +
"  float r1=0.12/cycle*(1.0-0.4*bulge);\n" +
"  float r2=0.07/cycle*(1.0+0.4*bulge);\n" +
"  float rw=1.0-r1-r2;\n" +
"  float w1=cycle*r1;\n" +
"  float w2=cycle*r2;\n" +
"  float opacity=1.0-smoothstep(0.9-0.5*u_edge,1.0-0.5*u_edge,edge);\n" +
"  opacity*=get_img_frame_alpha(img_uv,0.01);\n" +
"  float n=snoise(uv-t);\n" +
"  edge+=(1.0-edge)*u_liquid*n;\n" +
"  float refr=clamp(1.0-bulge,0.0,1.0);\n" +
"  float dir=guv.x+diagonal-2.0*n*diagonal*(smoothstep(0.0,1.0,edge)*smoothstep(1.0,0.0,edge));\n" +
"  bulge*=clamp(pow(uv.y,0.1),0.3,1.0);\n" +
"  dir*=(0.1+(1.1-edge)*bulge);\n" +
"  dir*=smoothstep(1.0,0.7,edge);\n" +
"  dir+=0.18*(smoothstep(-0.1,0.2,uv.y)*smoothstep(0.5,0.1,uv.y));\n" +
"  dir+=0.03*(smoothstep(0.1,0.2,1.0-uv.y)*smoothstep(0.4,0.2,1.0-uv.y));\n" +
"  dir*=(0.5+0.5*pow(uv.y,2.0));\n" +
"  dir*=cycle;\n" +
"  dir-=t;\n" +
"  float rr=refr+0.03*bulge*n;\n" +
"  float rb=1.3*refr;\n" +
"  rr+=5.0*(smoothstep(-0.1,0.2,uv.y)*smoothstep(0.5,0.1,uv.y))*(smoothstep(0.4,0.6,bulge)*smoothstep(1.0,0.4,bulge));\n" +
"  rr-=diagonal;\n" +
"  rb+=(smoothstep(0.0,0.4,uv.y)*smoothstep(0.8,0.1,uv.y))*(smoothstep(0.4,0.6,bulge)*smoothstep(0.8,0.4,bulge));\n" +
"  rb-=0.2*edge;\n" +
"  rr*=u_refraction;\n" +
"  rb*=u_refraction;\n" +
"  vec3 w=vec3(w1,w2,rw);\n" +
"  w.y-=0.02*smoothstep(0.0,1.0,edge+bulge);\n" +
"  float pr=mod(dir+rr,1.0);\n" +
"  float pg=mod(dir,1.0);\n" +
"  float pb=mod(dir-rb,1.0);\n" +
"  vec3 c1=vec3(0.98,0.98,1.0);\n" +
"  vec3 c2=vec3(0.1,0.1,0.2);\n" +
"  float r=get_color_channel(c1.r,c2.r,pr,w,0.02+0.03*u_refraction*bulge,bulge);\n" +
"  float g=get_color_channel(c1.g,c2.g,pg,w,0.01/(1.0-diagonal),bulge);\n" +
"  float b=get_color_channel(c1.b,c2.b,pb,w,0.01,bulge);\n" +
"  vec3 baseCol=vec3(r,g,b);\n" +
"  vec3 outCol;\n" +
"  float outA;\n" +
"  if(u_mode==0){\n" +
"    outCol=baseCol*opacity;\n" +
"    outA=opacity;\n" +
"  } else {\n" +
"    outCol=u_overlay_color*(opacity*u_overlay_alpha);\n" +
"    outA=opacity*u_overlay_alpha;\n" +
"  }\n" +
"  %fragset%\n" +
"}\n";

    if (isGL2) {
      var vs2 =
"#version 300 es\n" +
"precision mediump float;\n" +
"in vec2 a_position;\n" +
"out vec2 vUv;\n" +
"void main(){ vUv=0.5*(a_position+1.0); gl_Position=vec4(a_position,0.0,1.0); }\n";

      var fs2 =
"#version 300 es\n" +
"precision mediump float;\n" +
FS_CORE
  .replace("%varying%", "in")
  .replace("%fragout%", "out vec4 fragColor;")
  .replace("%fragset%", "fragColor=vec4(outCol,outA);")
  .replace(/texture2D/g, "texture");

      return { vs: vs2, fs: fs2 };
    } else {
      var vs1 =
"precision mediump float;\n" +
"attribute vec2 a_position;\n" +
"varying vec2 vUv;\n" +
"void main(){ vUv=0.5*(a_position+1.0); gl_Position=vec4(a_position,0.0,1.0); }\n";

      var fs1 =
"precision mediump float;\n" +
FS_CORE
  .replace("%varying%", "varying")
  .replace("%fragout%", "")
  .replace("%fragset%", "gl_FragColor=vec4(outCol,outA);");

      return { vs: vs1, fs: fs1 };
    }
  }

  function makeShader(gl, src, type) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function makeProgram(gl, vsSrc, fsSrc) {
    var v = makeShader(gl, vsSrc, gl.VERTEX_SHADER);
    var f = makeShader(gl, fsSrc, gl.FRAGMENT_SHADER);
    if (!v || !f) return null;
    var p = gl.createProgram();
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      gl.deleteProgram(p);
      return null;
    }
    return p;
  }

  function initWrap(wrap) {
    if (!wrap || wrap.__mpInit) return;
    wrap.__mpInit = true;

    var canvas = document.createElement('canvas');
    canvas.className = 'mp-canvas';
    wrap.appendChild(canvas);

    var gl2 = canvas.getContext('webgl2', { antialias: true, alpha: true });
    var gl1 = gl2 ? null : canvas.getContext('webgl', { antialias: true, alpha: true });
    var isGL2 = !!gl2;
    var gl = gl2 || gl1;
    if (!gl) return;

    var shaders = buildShaders(isGL2);
    var program = makeProgram(gl, shaders.vs, shaders.fs);
    if (!program) return;

    gl.useProgram(program);

    // Fullscreen quad
    var verts = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    var u_image_texture = gl.getUniformLocation(program, 'u_image_texture');
    var u_time          = gl.getUniformLocation(program, 'u_time');
    var u_ratio         = gl.getUniformLocation(program, 'u_ratio');
    var u_img_ratio     = gl.getUniformLocation(program, 'u_img_ratio');
    var u_patternScale  = gl.getUniformLocation(program, 'u_patternScale');
    var u_refraction    = gl.getUniformLocation(program, 'u_refraction');
    var u_edge          = gl.getUniformLocation(program, 'u_edge');
    var u_patternBlur   = gl.getUniformLocation(program, 'u_patternBlur');
    var u_liquid        = gl.getUniformLocation(program, 'u_liquid');
    var u_overlay_color = gl.getUniformLocation(program, 'u_overlay_color');
    var u_overlay_alpha = gl.getUniformLocation(program, 'u_overlay_alpha');
    var u_mode          = gl.getUniformLocation(program, 'u_mode');
    var u_logo_scale    = gl.getUniformLocation(program, 'u_logo_scale');

    // Texture
    var tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.uniform1i(u_image_texture, 0);

    // Static uniforms (tuned to match original metallic look)
    gl.uniform1f(u_edge,         0.9);
    gl.uniform1f(u_patternBlur,  0.005);
    gl.uniform1f(u_patternScale, 2.0);
    gl.uniform1f(u_refraction,   0.015);
    gl.uniform1f(u_liquid,       0.07);
    gl.uniform3f(u_overlay_color, 0.0, 242.0/255.0, 1.0);
    gl.uniform1f(u_overlay_alpha, 0.6);

    var imgData = null;
    var lastTime = performance.now();
    var total = 0;
    var running = true;

    function uploadTexture(d) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, d.width, d.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, d.data);
      gl.uniform1f(u_img_ratio, d.width / d.height);
    }

    function resize() {
      var dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      var rect = wrap.getBoundingClientRect();
      var sideCSS = Math.max(2, Math.min(rect.width || 0, rect.height || 0) || rect.width || 64);
      var side = Math.max(2, Math.floor(sideCSS * dpr));

      canvas.width = side;
      canvas.height = side;
      canvas.style.width = sideCSS + 'px';
      canvas.style.height = sideCSS + 'px';

      gl.viewport(0, 0, side, side);
      gl.uniform1f(u_ratio, 1.0);

      if (imgData) {
        gl.uniform1f(u_img_ratio, imgData.width / imgData.height);
      }
    }

    function loop(now) {
      if (!running) return;
      requestAnimationFrame(loop);

      var dt = now - lastTime;
      lastTime = now;
      if (dt > 50) dt = 50;
      total += dt * 0.3;

      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(u_time, total);

      // Base metallic pass
      gl.disable(gl.BLEND);
      gl.uniform1i(u_mode, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Overlay glow pass
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ZERO, gl.ONE);
      gl.uniform1i(u_mode, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.disable(gl.BLEND);
    }

    function perTileScale(tileIndex) {
      // Small tweakable scalar; constant in original
      return 1.16;
    }

    function setTile(tileIndex) {
      tileIndex = tileIndex | 0;
      return parseLogoImageFromSprite(tileIndex).then(function (parsed) {
        imgData = parsed.imageData;
        gl.useProgram(program);
        uploadTexture(imgData);
        gl.uniform1f(u_logo_scale, perTileScale(tileIndex));
        wrap.setAttribute('data-tile-active', String(tileIndex));
        resize();
        return true;
      }).catch(function () {
        return false;
      });
    }

    // Expose per-element setter so __MP can target specific mp-wraps
    wrap.__mpSetTile = setTile;

    // Initial tile from data attribute or 0
    var initTile = parseInt(wrap.getAttribute('data-tile') || '0', 10) || 0;
    setTile(initTile).then(function () {
      resize();
      requestAnimationFrame(loop);

      // Prewarm all three tiles once globally
      if (!window.__MP.__prewarmed) {
        window.__MP.__prewarmed = true;
        setTimeout(function () {
          parseLogoImageFromSprite(0);
          parseLogoImageFromSprite(1);
          parseLogoImageFromSprite(2);
        }, 0);
      }
    });

    // Handle resizes
    window.addEventListener('resize', resize, { passive: true });
  }

  // Create global __MP once, with the API Section 3 expects.
  if (!window.__MP) {
    window.__MP = {
      /**
       * Set a logo tile on a specific .mp-wrap element.
       * Used by Section 3: __MP.setTile(backEl, nextTile)
       */
      setTile: function (el, idx) {
        if (el && el.__mpSetTile) {
          return el.__mpSetTile(idx);
        }
        return Promise.resolve(false);
      },
      ensureTile: function (idx) {
        return parseLogoImageFromSprite(idx).catch(function () {});
      },
      __prewarmed: false
    };
  }

  function initAll() {
    var nodes = document.querySelectorAll('.mp-wrap');
    for (var i = 0; i < nodes.length; i++) {
      initWrap(nodes[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
})();

// SECTION 6 — PHASE 2 & PHASE 3 CARD WRAPPERS + PHASE 3 CONTENT INJECTION

(function () {
  'use strict';

  var grid = document.getElementById('grid');
  if (!grid) return;

  /* -----------------------------------------------
   * SMALL HELPER: RESPONSIVE CANVAS REDRAW
   * Fix: images/glass align correctly without manual resize
   * ----------------------------------------------- */
  function setupResponsiveCanvas(container, canvas, img, drawImpl) {
    if (!container || !canvas || !img) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    function draw() {
      var width  = container.clientWidth  || container.offsetWidth  || 1;
      var height = container.clientHeight || container.offsetHeight || 1;
      var ratio  = window.devicePixelRatio || 1;

      if (width <= 0 || height <= 0) return;

      canvas.width  = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (img.complete && img.naturalWidth && img.naturalHeight) {
        drawImpl(ctx, width, height, img);
      }
    }

    // Initial draw
    if (img.complete && img.naturalWidth && img.naturalHeight) {
      requestAnimationFrame(draw);
    } else {
      img.addEventListener(
        'load',
        function () {
          requestAnimationFrame(draw);
        },
        { once: true }
      );
    }

    // Redraw on resize / layout change
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () {
        requestAnimationFrame(draw);
      });
      ro.observe(container);
    } else {
      window.addEventListener(
        'resize',
        function () {
          requestAnimationFrame(draw);
        },
        { passive: true }
      );
    }

    return draw;
  }

  /* ------------------------------------------------
   * 1) ENSURE PHASE 2 / PHASE 3 WRAPPER SHELLS EXIST
   *    (non-destructive: only adds if missing)
   * ------------------------------------------------ */
  var cells = grid.querySelectorAll('.cell.anim-cell');
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    var label = cell.getAttribute('data-label');
    if (!label) continue;

    var key = label.replace('+', '-');

    // Phase 2 wrapper (inherits parent cell radius=var(--card-radius))
    var p2 = cell.querySelector('.phase2-card--' + key);
    if (!p2) {
      p2 = document.createElement('div');
      p2.className = 'phase2-card phase2-card--' + key;
      cell.appendChild(p2);
    }

    // Phase 3 wrapper (inherits parent cell radius=var(--card-radius))
    var p3 = cell.querySelector('.phase3-card--' + key);
    if (!p3) {
      p3 = document.createElement('div');
      p3.className = 'phase3-card phase3-card--' + key;
      cell.appendChild(p3);
    }
  }

  /* ------------------------------------------------
   * 2) PHASE 3 CARD CONTENT TEMPLATES
   *    (ONLY fill .phase3-card--* if still empty)
   * ------------------------------------------------ */
  function setIfEmpty(el, html) {
    if (!el) return;
    if (!el.innerHTML || !el.innerHTML.trim()) {
      el.innerHTML = html;
    }
  }

  // CARD 1+2 (data-label="1+2") — VARIATION 15 (Premium Creators)
  (function () {
    var p3 = grid.querySelector('.phase3-card--1-2');
    setIfEmpty(
      p3,
      '<div class="premium-card-v15">' +
        '<div class="v15-icon-wrap"></div>' +
        '<div class="v15-subtext">Premium Creators<br>Top-tier YouTube</div>' +
      '</div>'
    );
  })();

  // CARD 3 (data-label="3") — VARIATION 5 (Safety & Compliance)
  (function () {
    var p3 = grid.querySelector('.phase3-card--3');
    setIfEmpty(
      p3,
      '<div class="img-cutout-bg-v5">' +
        '<canvas class="img-cutout-canvas-v5"></canvas>' +
        '<div class="glass-rect-top-v5 glass-rect-top-left-v5">' +
          '<img src="https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/building-08-svgrepo-com.svg" alt="" class="glass-top-icon-v5" />' +
        '</div>' +
        '<div class="glass-rect-top-v5 glass-rect-top-right-v5">' +
          '<img src="https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/shield-02-svgrepo-com.svg" alt="" class="glass-top-icon-v5" />' +
        '</div>' +
        '<div class="glass-rect-v5">' +
          '<div class="glass-labels-v5">' +
            '<div class="glass-label-top-v5">Safety &amp;</div>' +
            '<div class="glass-label-bottom-v5">Compliance</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  })();

  // CARD 4 (data-label="4") — VARIATION 17 (High-impact Storytelling)
  (function () {
    var p3 = grid.querySelector('.phase3-card--4');
    setIfEmpty(
      p3,
      '<div class="img-cutout-bg-v17">' +
        '<canvas class="img-cutout-canvas-v17"></canvas>' +
        '<div class="v17-label-wrap">' +
          '<div class="v17-label-line">High-impact</div>' +
          '<div class="v17-label-line v17-label-story">Storytelling</div>' +
        '</div>' +
      '</div>'
    );
  })();

  // CARD 6 (data-label="6") — VARIATION 14 (Global Launches)
  (function () {
    var p3 = grid.querySelector('.phase3-card--6');
    setIfEmpty(
      p3,
      '<div class="global-card-v14">' +
        '<div class="v14-icon-wrap"></div>' +
        '<div class="v14-subtext">Perfect for:<br>Global Launches</div>' +
      '</div>'
    );
  })();

  // CARD 7 (data-label="7") — VARIATION 6 (300K+ Impressions)
  (function () {
    var p3 = grid.querySelector('.phase3-card--7');
    setIfEmpty(
      p3,
      '<div class="img-cutout-bg-v6">' +
        '<canvas class="img-cutout-canvas-v6"></canvas>' +
      '</div>'
    );
  })();

  // CARD 8+9 (data-label="8+9") — VARIATION 8b (CMO-Ready Reporting)
  (function () {
    var p3 = grid.querySelector('.phase3-card--8-9');
    setIfEmpty(
      p3,
      '<div class="img-cutout-bg-v8b">' +
        '<canvas class="img-cutout-canvas-v8b"></canvas>' +
        '<div class="v8b-label-wrap">' +
          '<div class="v8b-label-line v8b-label-top">CMO-Ready</div>' +
          '<div class="v8b-label-line v8b-label-bottom">Reporting</div>' +
        '</div>' +
        '<img class="v8b-top-img" ' +
          'src="https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/6e606773-0677-46f8-8318-7f592683b7eb/AdobeStock_995204951+-+09-11-2025+02-55-50+-+09-11-2025+03-00-48.png?content-type=image%2Fpng" ' +
          'alt="" />' +
      '</div>'
    );
  })();

  /* ------------------------------------------------
   * 3) PHASE 3 STYLES (SCOPED; DO NOT TOUCH PHASE 1/2)
   * Notes:
   * - All outer phase3 content roots use border-radius: inherit
   *   so they match the parent .cell's 12px radius from Section 1.
   * ------------------------------------------------ */
  var css = `
  /*************************************************
   * PHASE 3 — CARD 1+2 (data-label="1+2")
   * VARIATION 15 — Premium Creators
   *************************************************/
  .phase3-card--1-2 > .premium-card-v15 {
    position:absolute;
    inset:10px;
    margin:0;
    width:auto;
    height:auto;
    border-radius:inherit;
    background:transparent;
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:4px;
    text-align:center;
    overflow:hidden;
  }
  .phase3-card--1-2 .v15-icon-wrap {
    width:100%;
    max-width:145px;
    aspect-ratio:1/1;
    margin:0;
    background:linear-gradient(135deg,#28e1d8,#049bc6,#0965b3,#070616);
    -webkit-mask-image:url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/star-03-svgrepo-com.svg");
    mask-image:url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/star-03-svgrepo-com.svg");
    -webkit-mask-repeat:no-repeat;
    mask-repeat:no-repeat;
    -webkit-mask-position:center;
    mask-position:center;
    -webkit-mask-size:contain;
    mask-size:contain;
  }
  .phase3-card--1-2 .v15-subtext {
    font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight:600;
    font-size:14px;
    line-height:1.2;
    color:#ffffff;
    margin:0;
    white-space:normal;
  }

  /*************************************************
   * PHASE 3 — CARD 3 (data-label="3")
   * VARIATION 5 — Safety & Compliance
   *************************************************/
  .phase3-card--3 > .img-cutout-bg-v5 {
    position:absolute;
    inset:10px;
    margin:0;
    width:auto;
    height:auto;
    border-radius:inherit;
    overflow:hidden;
    box-sizing:border-box;
    --glass-bg-v5:rgba(255,255,255,0.12);
    --glass-border-v5:rgba(255,255,255,0.28);
    --glass-blur-v5:16px;
    --glass-saturation-v5:140%;
    --gap-v5:6px;
    --glass-offset-v5:6px;
    --glass-height-top-v5:48px;
    --glass-height-bottom-v5:86px;
    --glass-width-v5:calc((100% - (var(--glass-offset-v5) * 2)) * 0.4);
    --glass-gap-h-v5:6px;
  }
  .phase3-card--3 .img-cutout-canvas-v5 {
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    display:block;
  }
  .phase3-card--3 .glass-rect-v5 {
    position:absolute;
    box-sizing:border-box;
    right:var(--glass-offset-v5);
    width:var(--glass-width-v5);
    bottom:var(--gap-v5);
    height:var(--glass-height-bottom-v5);
    background:var(--glass-bg-v5);
    border:1px solid var(--glass-border-v5);
    backdrop-filter:blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    -webkit-backdrop-filter:blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    border-radius:10px;
    z-index:3;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .phase3-card--3 .glass-labels-v5 {
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:8px;
    width:100%;
    height:100%;
    box-sizing:border-box;
  }
  .phase3-card--3 .glass-label-top-v5,
  .phase3-card--3 .glass-label-bottom-v5 {
    font-weight:600;
    font-size:15px;
    line-height:1.1;
    color:#ffffff;
  }
  .phase3-card--3 .glass-rect-top-v5 {
    position:absolute;
    box-sizing:border-box;
    height:var(--glass-height-top-v5);
    top:var(--gap-v5);
    background:rgba(95,222,222,0.36);
    border:0.5px solid rgba(95,222,222,0.7);
    border-radius:10px;
    backdrop-filter:blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    -webkit-backdrop-filter:blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:3;
    opacity:0;
    transform:translateY(10px);
  }
  .phase3-card--3 .glass-rect-top-left-v5 {
    left:calc(100% - var(--glass-offset-v5) - var(--glass-width-v5));
    width:calc((var(--glass-width-v5) - var(--glass-gap-h-v5)) / 2);
  }
  .phase3-card--3 .glass-rect-top-right-v5 {
    right:var(--glass-offset-v5);
    width:calc((var(--glass-width-v5) - var(--glass-gap-h-v5)) / 2);
  }
  .phase3-card--3 .glass-top-icon-v5 {
    width:28px;
    height:28px;
    display:block;
    filter:invert(82%) sepia(18%) saturate(1090%) hue-rotate(132deg) brightness(101%) contrast(98%);
  }
  @keyframes v5-rise-bounce {
    0% { opacity:0; transform:translateY(10px) scale(0.98); }
    55%{ opacity:1; transform:translateY(-4px) scale(1.02); }
    80%{ transform:translateY(2px) scale(0.995); }
    100%{ opacity:1; transform:translateY(0) scale(1); }
  }
  .grid-3x3.phase3 .phase3-card--3 .glass-rect-top-left-v5 {
    animation:v5-rise-bounce 0.7s cubic-bezier(0.22,0.61,0.36,1) forwards;
    animation-delay:0.05s;
  }
  .grid-3x3.phase3 .phase3-card--3 .glass-rect-top-right-v5 {
    animation:v5-rise-bounce 0.7s cubic-bezier(0.22,0.61,0.36,1) forwards;
    animation-delay:0.2s;
  }

  /*************************************************
   * PHASE 3 — CARD 4 (data-label="4")
   * VARIATION 17 — High-impact Storytelling
   *************************************************/
  .phase3-card--4 > .img-cutout-bg-v17 {
    position:absolute;
    inset:10px;
    margin:0;
    width:auto;
    height:auto;
    border-radius:inherit;
    overflow:hidden;
    box-sizing:border-box;
  }
  .phase3-card--4 .img-cutout-canvas-v17 {
    position:absolute;
    inset:0;
    display:block;
    width:100%;
    height:100%;
  }
  .phase3-card--4 .v17-label-wrap {
    position:absolute;
    left:50%;
    bottom:9px;
    transform:translateX(-50%);
    display:flex;
    flex-direction:column;
    align-items:center;
    z-index:1;
  }
  .phase3-card--4 .v17-label-line {
    font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight:600;
    font-size:14px;
    line-height:1.14;
    color:#ffffff;
    white-space:nowrap;
    text-align:center;
  }
  .phase3-card--4 .v17-label-story {
    margin-top:2px;
  }

  /*************************************************
   * PHASE 3 — CARD 6 (data-label="6")
   * VARIATION 14 — Global Launches
   *************************************************/
  .phase3-card--6 > .global-card-v14 {
    position:absolute;
    inset:10px;
    margin:0;
    width:auto;
    height:auto;
    border-radius:inherit;
    background:transparent;
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:4px;
    text-align:center;
    overflow:hidden;
  }
  .phase3-card--6 .v14-icon-wrap {
    width:100%;
    max-width:145px;
    aspect-ratio:1/1;
    margin:0;
    background:linear-gradient(135deg,#28e1d8,#049bc6,#0965b3,#070616);
    -webkit-mask-image:url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/globe-02-1-svgrepo-com.svg");
    mask-image:url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/globe-02-1-svgrepo-com.svg");
    -webkit-mask-repeat:no-repeat;
    mask-repeat:no-repeat;
    -webkit-mask-position:center;
    mask-position:center;
    -webkit-mask-size:contain;
    mask-size:contain;
  }
  .phase3-card--6 .v14-subtext {
    font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight:600;
    font-size:14px;
    line-height:1.2;
    color:#ffffff;
    margin:0;
    white-space:normal;
  }

  /*************************************************
   * PHASE 3 — CARD 7 (data-label="7")
   * VARIATION 6 — 0→300K+ Impressions (cut-out)
   *************************************************/
  .phase3-card--7 > .img-cutout-bg-v6 {
    position:absolute;
    inset:10px;
    margin:0;
    width:auto;
    height:auto;
    border-radius:inherit;
    overflow:hidden;
    box-sizing:border-box;
  }
  .phase3-card--7 .img-cutout-canvas-v6 {
    display:block;
    width:100%;
    height:100%;
  }

  /*************************************************
   * PHASE 3 — CARD 8+9 (data-label="8+9")
   * VARIATION 8b — CMO-Ready Reporting
   *************************************************/
  .phase3-card--8-9 > .img-cutout-bg-v8b {
    position:absolute;
    inset:10px;
    margin:0;
    width:auto;
    height:auto;
    border-radius:inherit;
    overflow:hidden;
    box-sizing:border-box;
  }
  .phase3-card--8-9 .img-cutout-canvas-v8b {
    position:absolute;
    inset:0;
    display:block;
    width:100%;
    height:100%;
    z-index:0;
  }
  .phase3-card--8-9 .v8b-label-wrap {
    position:absolute;
    top:10px;
    left:50%;
    transform:translateX(-50%);
    display:flex;
    flex-direction:column;
    align-items:center;
    z-index:1;
  }
  .phase3-card--8-9 .v8b-label-line {
    font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight:600;
    font-size:15px;
    line-height:1.08;
    color:#ffffff;
    white-space:nowrap;
    text-align:center;
  }
  .phase3-card--8-9 .v8b-label-bottom {
    margin-top:3px;
  }
  .phase3-card--8-9 .v8b-top-img {
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    object-fit:cover;
    transform:translateX(-3px) scale(1.26);
    transform-origin:center;
    z-index:2;
    pointer-events:none;
  }

  .sqs-block-code .sqs-block-content {
    padding:0 !important;
  }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ------------------------------------------------
   * 4) PHASE 3 JS BEHAVIOUR / DRAW LOGIC
   * ------------------------------------------------ */

  /* CARD 3 (v5) — Safety & Compliance background */
  (function () {
    var container = grid.querySelector('.phase3-card--3 .img-cutout-bg-v5');
    var canvas = container && container.querySelector('.img-cutout-canvas-v5');
    if (!container || !canvas) return;

    var IMG_BASE_SRC_V5 =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/0fdea2de-2967-42f7-b888-011f35dd20f2/Screenshot+2025-11-08+at+21.22.26.png?content-type=image%2Fpng';

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = IMG_BASE_SRC_V5;

    setupResponsiveCanvas(container, canvas, img, function (ctx, width, height, image) {
      var imgRatio = image.width / image.height;
      var boxRatio = width / height;
      var dw, dh, dx, dy;

      if (imgRatio > boxRatio) {
        dh = height;
        dw = dh * imgRatio;
        dx = (width - dw) / 2;
        dy = 0;
      } else {
        dw = width;
        dh = dw / imgRatio;
        dx = 0;
        dy = (height - dh) / 2;
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(image, dx, dy, dw, dh);
    });
  })();

  /* CARD 4 (v17) — High-impact Storytelling background */
  (function () {
    var container = grid.querySelector('.phase3-card--4 .img-cutout-bg-v17');
    var canvas = container && container.querySelector('.img-cutout-canvas-v17');
    if (!container || !canvas) return;

    var IMG_BASE_SRC_V17 =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/6a5b0cc8-596c-4352-aedd-497ac039f829/AdobeStock_1159033223.png?content-type=image%2Fpng';

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = IMG_BASE_SRC_V17;

    setupResponsiveCanvas(container, canvas, img, function (ctx, width, height, image) {
      var imgRatio = image.width / image.height;
      var boxRatio = width / height;
      var zoom = 1.12;
      var dw, dh, dx, dy;

      if (imgRatio > boxRatio) {
        dh = height * zoom;
        dw = dh * imgRatio;
      } else {
        dw = width * zoom;
        dh = dw / imgRatio;
      }

      dx = (width - dw) / 2;
      dy = (height - dh) / 2;

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(image, dx, dy, dw, dh);
    });
  })();

  /* CARD 8+9 (v8b) — CMO-Ready Reporting background */
  (function () {
    var container = grid.querySelector('.phase3-card--8-9 .img-cutout-bg-v8b');
    var canvas = container && container.querySelector('.img-cutout-canvas-v8b');
    if (!container || !canvas) return;

    var IMG_BASE_SRC_V8B =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/692d7d41-8b3e-434c-b714-a03409ec3747/AdobeStock_995204951+-+09-11-2025+02-55-50.png?content-type=image%2Fpng';

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = IMG_BASE_SRC_V8B;

    setupResponsiveCanvas(container, canvas, img, function (ctx, width, height, image) {
      var imgRatio = image.width / image.height;
      var boxRatio = width / height;
      var dw, dh, dx, dy;

      if (imgRatio > boxRatio) {
        dh = height;
        dw = dh * imgRatio;
        dx = (width - dw) / 2;
        dy = 0;
      } else {
        dw = width;
        dh = dw / imgRatio;
        dx = 0;
        dy = (height - dh) / 2;
      }

      var scale = 1.26;
      var shiftX = 3;
      dw *= scale;
      dh *= scale;
      dx = (width - dw) / 2 - shiftX;
      dy = (height - dh) / 2;

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(image, dx, dy, dw, dh);
    });
  })();

  /* CARD 7 (v6) — 0→300K+ Impressions count-up (Phase 3 only) */
  (function () {
    var container = grid.querySelector('.phase3-card--7 .img-cutout-bg-v6');
    var canvas = container && container.querySelector('.img-cutout-canvas-v6');
    if (!container || !canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var IMG_BASE_SRC_V6 =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/d9714628-111f-4f1f-9b64-810bb1f0376a/AdobeStock_381349355.jpeg?content-type=image%2Fjpeg';

    var imgBase = new Image();
    imgBase.crossOrigin = 'anonymous';
    imgBase.src = IMG_BASE_SRC_V6;

    var targetValue   = 300;   // 300K
    var animDuration  = 1200;
    var startTime     = null;
    var started       = false;
    var lastValueDraw = 0;

    function drawFrame(currentValue) {
      lastValueDraw = currentValue;

      var width  = container.clientWidth  || container.offsetWidth  || 1;
      var height = container.clientHeight || container.offsetHeight || 1;
      var ratio  = window.devicePixelRatio || 1;

      if (width <= 0 || height <= 0) return;

      canvas.width  = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Background image — cover
      if (imgBase.complete && imgBase.naturalWidth && imgBase.naturalHeight) {
        var imgRatio = imgBase.width / imgBase.height;
        var boxRatio = width / height;
        var dw, dh, dx, dy;

        if (imgRatio > boxRatio) {
          dh = height;
          dw = dh * imgRatio;
          dx = (width - dw) / 2;
          dy = 0;
        } else {
          dw = width;
          dh = dw / imgRatio;
          dx = 0;
          dy = (height - dh) / 2;
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(imgBase, dx, dy, dw, dh);
      }

      // Right-side cut-out
      var gap    = 6;
      var offset = 6;
      var cardW  = width;
      var cardH  = height;

      var cutHeight = cardH - gap * 2;
      var innerW    = cardW - offset * 2;
      var baseWidth = innerW * 0.4;
      var cutWidth  = baseWidth * 1.3;

      var cutX = cardW - offset - cutWidth;
      var cutY = gap;

      var radius = 10;
      var r = Math.min(radius, cutWidth / 2, cutHeight / 2);

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(cutX + r, cutY);
      ctx.lineTo(cutX + cutWidth - r, cutY);
      ctx.quadraticCurveTo(cutX + cutWidth, cutY, cutX + cutWidth, cutY + r);
      ctx.lineTo(cutX + cutWidth, cutY + cutHeight - r);
      ctx.quadraticCurveTo(
        cutX + cutWidth,
        cutY + cutHeight,
        cutX + cutWidth - r,
        cutY + cutHeight
      );
      ctx.lineTo(cutX + r, cutY + cutHeight);
      ctx.quadraticCurveTo(
        cutX,
        cutY + cutHeight,
        cutX,
        cutY + cutHeight - r
      );
      ctx.lineTo(cutX, cutY + r);
      ctx.quadraticCurveTo(cutX, cutY, cutX + r, cutY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Text inside cut-out
      var textMain = currentValue.toString() + 'K';
      var textPlus = '+';
      var text2    = 'IMPRESSIONS';

      var boxW    = cutWidth;
      var boxH    = cutHeight;
      var xCenter = cutX + boxW / 2;

      ctx.fillStyle = '#ffffff';
      ctx.textBaseline = 'alphabetic';

      var fontSizeMain = boxH * 0.28;
      var fontSizePlus = fontSizeMain * (5 / 9);

      ctx.font = '900 ' + fontSizeMain + 'px system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      var mMain = ctx.measureText(textMain);
      var mainAscent  = mMain.actualBoundingBoxAscent  || fontSizeMain;
      var mainDescent = mMain.actualBoundingBoxDescent || 0;
      var mainWidth   = mMain.width;

      ctx.font = '700 ' + fontSizePlus + 'px system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      var mPlus = ctx.measureText(textPlus);
      var plusAscent  = mPlus.actualBoundingBoxAscent  || fontSizePlus;
      var plusDescent = mPlus.actualBoundingBoxDescent || 0;
      var plusWidth   = mPlus.width;

      var line1Ascent    = Math.max(mainAscent, plusAscent);
      var line1Descent   = Math.max(mainDescent, plusDescent);
      var totalLine1Width = mainWidth + plusWidth;

      var fontSize2 = boxH * 0.14;
      ctx.font = '600 ' + fontSize2 + 'px system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      var m2   = ctx.measureText(text2);
      var asc2 = m2.actualBoundingBoxAscent  || fontSize2;
      var desc2= m2.actualBoundingBoxDescent || 0;
      var gap12 = boxH * 0.10;

      var blockHeight = line1Ascent + line1Descent + gap12 + asc2 + desc2;
      var topY        = cutY + (boxH - blockHeight) / 2;

      var baseline1 = topY + line1Ascent;
      var baseline2 = baseline1 + line1Descent + gap12 + asc2;

      // "300K"
      ctx.font = '900 ' + fontSizeMain + 'px system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      ctx.textAlign = 'left';
      var startX = xCenter - totalLine1Width / 2;
      ctx.fillText(textMain, startX, baseline1);

      // "+"
      var mainTop    = baseline1 - mainAscent;
      var mainBottom = baseline1 + mainDescent;
      var mainCenter = (mainTop + mainBottom) / 2;
      var plusCenterOffset = (plusAscent - plusDescent) / 2;
      var plusBaseline     = mainCenter + plusCenterOffset;

      ctx.font = '700 ' + fontSizePlus + 'px system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      ctx.fillText(textPlus, startX + mainWidth, plusBaseline);

      // "IMPRESSIONS"
      ctx.font = '600 ' + fontSize2 + 'px system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text2, xCenter, baseline2);
    }

    function animate(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      var t = Math.max(0, Math.min(1, elapsed / animDuration));
      var eased = 1 - Math.pow(1 - t, 3);
      var currentValue = Math.floor(targetValue * eased);
      drawFrame(currentValue);
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        drawFrame(targetValue);
      }
    }

    function maybeStart() {
      if (started) return;
      if (!imgBase.complete || !imgBase.naturalWidth) return;
      if (!grid.classList.contains('phase3')) return;
      started = true;
      setTimeout(function () {
        requestAnimationFrame(animate);
      }, 260);
    }

    imgBase.addEventListener('load', maybeStart);

    // Keep aligned on resize
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () {
        if (lastValueDraw > 0) {
          drawFrame(lastValueDraw);
        }
      });
      ro.observe(container);
    } else {
      window.addEventListener(
        'resize',
        function () {
          if (lastValueDraw > 0) {
            drawFrame(lastValueDraw);
          }
        },
        { passive: true }
      );
    }

    // Start when grid enters phase3
    var mo = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].attributeName === 'class') {
          maybeStart();
          break;
        }
      }
    });
    mo.observe(grid, { attributes: true });
  })();

  /* ------------------------------------------------
   * 5) PHASE 2 BACKGROUNDS NEEDED FOR VISIBILITY
   *    (Unified Dashboard & 200K+ Impressions)
   * ------------------------------------------------*/

  /* PHASE 2 — CARD 1+2 (v8) — Unified Dashboard background */
  (function () {
    var container = grid.querySelector('.phase2-card--1-2 .img-cutout-bg-v8');
    var canvas = container && container.querySelector('.img-cutout-canvas-v8');
    if (!container || !canvas) return;

    var IMG_BASE_SRC_V8 =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/6a311054-2bc5-42a7-b076-467c07d2abad/AdobeStock_995206055%281%29.png?content-type=image%2Fpng';

    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = IMG_BASE_SRC_V8;

    setupResponsiveCanvas(container, canvas, img, function (ctx, width, height, image) {
      var imgRatio = image.width / image.height;
      var boxRatio = width / height;
      var dw, dh, dx, dy;

      // cover-fit
      if (imgRatio > boxRatio) {
        dh = height;
        dw = dh * imgRatio;
        dx = (width - dw) / 2;
        dy = 0;
      } else {
        dw = width;
        dh = dw / imgRatio;
        dx = 0;
        dy = (height - dh) / 2;
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(image, dx, dy, dw, dh);
    });
  })();

  /* PHASE 2 — CARD 6 (v3) — 200K+ Impressions
   * Base + overlay both full-size; overlay under glass rect
   */
  (function () {
    var container = grid.querySelector('.phase2-card--6 .img-cutout-bg-v3');
    var canvas = container && container.querySelector('.img-cutout-canvas-v3');
    if (!container || !canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var IMG_BASE_SRC_V3 =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/af027ce7-f3d3-480d-a504-83ca07197646/AdobeStock_1481872479+-+08-11-2025+14-31-59.png?content-type=image%2Fpng';
    var IMG_OVERLAY_SRC_V3 =
      'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/3199e0ee-a3d1-4dfe-bc20-c317f5655fd2/Screenshot+2025-11-08+at+14.40.39.png?content-type=image%2Fpng';

    var baseImg = new Image();
    var overlayImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    overlayImg.crossOrigin = 'anonymous';
    baseImg.src = IMG_BASE_SRC_V3;
    overlayImg.src = IMG_OVERLAY_SRC_V3;

    var ready = { base: false, overlay: false };
    var redraw = null;

    function maybeInit() {
      if (!ready.base || !ready.overlay) return;
      if (redraw) {
        requestAnimationFrame(redraw);
        return;
      }

      // Use helper; inside draw we paint BOTH images full-size
      redraw = setupResponsiveCanvas(container, canvas, baseImg, function (ctx, width, height) {
        if (!baseImg.naturalWidth || !overlayImg.naturalWidth) return;

        var imgRatio = baseImg.width / baseImg.height;
        var boxRatio = width / height;
        var dw, dh, dx, dy;

        // Base image cover-fit
        if (imgRatio > boxRatio) {
          dh = height;
          dw = dh * imgRatio;
          dx = (width - dw) / 2;
          dy = 0;
        } else {
          dw = width;
          dh = dw / imgRatio;
          dx = 0;
          dy = (height - dh) / 2;
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(baseImg, dx, dy, dw, dh);

        // Overlay image: EXACT same size & position as base
        ctx.drawImage(overlayImg, dx, dy, dw, dh);
      });

      if (redraw) {
        requestAnimationFrame(redraw);
      }
    }

    baseImg.onload = function () {
      ready.base = true;
      maybeInit();
    };
    overlayImg.onload = function () {
      ready.overlay = true;
      maybeInit();
    };
  })();

})();

// SECTION 7 — PHASE 2 CONTENT (LIVE IMPLEMENTATION)

(function () {
  var css = `
  /* ----------------------------------------------
     Phase 2 / 3 wrappers
     (mirrors Section 1 so behaviour is consistent)
  ---------------------------------------------- */
  .phase2-card,
  .phase3-card {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 260ms ease;
    z-index: 2;
    border-radius: inherit; /* match parent cell radius */
  }

  .grid-3x3.phase2 .phase2-card {
    opacity: 1;
    pointer-events: auto;
  }

  .grid-3x3.phase3 .phase1-card,
  .grid-3x3.phase3 .phase2-card {
    opacity: 0;
    pointer-events: none;
  }

  .grid-3x3.phase3 .phase3-card {
    opacity: 1;
    pointer-events: auto;
  }

  /* =========================================================
   * PHASE 2 — CARD 6 (data-label="6") — VARIATION 3
   * 200K+ Impressions + bar chart
   * - 10px inset container for canvas
   * - Base + overlay image are drawn into canvas (Section 2 JS),
   *   so canvas is the full visual layer
   * - Glass rect + bars sit ABOVE the canvas
   * ========================================================= */

  .phase2-card--6 > .img-cutout-bg-v3 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: inherit;
  }

  .phase2-card--6 .img-cutout-canvas-v3 {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 0; /* full-size base+overlay image under glass */
  }

  .phase2-card--6 .glass-rect-v3 {
    --glass-offset-v3: 6px;
    --glass-bg-v3: rgba(255, 255, 255, 0.12);
    --glass-border-v3: rgba(255, 255, 255, 0.28);
    --glass-blur-v3: 16px;
    --glass-saturation-v3: 140%;

    position: absolute;
    box-sizing: border-box;
    left: var(--glass-offset-v3);
    right: var(--glass-offset-v3);
    bottom: var(--glass-offset-v3);
    height: 45%; /* matches reference ratio when scaled */

    background: var(--glass-bg-v3);
    border: 1px solid var(--glass-border-v3);
    backdrop-filter: blur(var(--glass-blur-v3)) saturate(var(--glass-saturation-v3));
    -webkit-backdrop-filter: blur(var(--glass-blur-v3)) saturate(var(--glass-saturation-v3));
    border-radius: 10px;
    z-index: 3; /* above canvas */
  }

  .phase2-card--6 .glass-labels-v3 {
    position: absolute;
    top: 7px;
    left: 9px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    color: #ffffff;
  }

  .phase2-card--6 .label-top-v3 {
    display: inline-flex;
    align-items: center;
  }

  .phase2-card--6 .label-top-num-v3 {
    font-weight: 900;
    font-size: 26px;
    line-height: 1;
  }

  .phase2-card--6 .label-top-plus-v3 {
    font-weight: 900;
    font-size: 15px;
    line-height: 1;
    margin-left: 2px;
    position: relative;
    top: -2px;
  }

  .phase2-card--6 .label-bottom-v3 {
    font-weight: 600;
    font-size: 12.5px;
    line-height: 1.1;
    opacity: 0.8;
  }

  .phase2-card--6 .simple-bar-chart-wrap-v3 {
    position: absolute;
    left: 50%;
    bottom: 8px;
    transform: translateX(-50%);
    width: 78%;
    max-width: 117px;
    height: 70px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 0;
  }

  .phase2-card--6 .simple-bar-chart-v3 {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .phase2-card--6 .axis-x-v3 {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 0.5px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 1px;
  }

  .phase2-card--6 .bar-v3 {
    position: absolute;
    bottom: 5px;
    width: 12%;
    height: 10px;
    background-color: rgba(95, 222, 222, 0.5);
    border: 0.5px solid rgba(95, 222, 222, 0.7);
    border-radius: 2px;
    transform-origin: bottom;
    animation: none;
  }

  .phase2-card--6 .bar-1-v3 { left: 5.6%;  --target-height: 24px; }
  .phase2-card--6 .bar-2-v3 { left: 21%;   --target-height: 34px; }
  .phase2-card--6 .bar-3-v3 { left: 36.3%; --target-height: 30px; }
  .phase2-card--6 .bar-4-v3 { left: 51.7%; --target-height: 41px; }
  .phase2-card--6 .bar-5-v3 { left: 67.1%; --target-height: 50px; }
  .phase2-card--6 .bar-6-v3 { left: 82.5%; --target-height: 56px; }

  @keyframes grow-bar-v3 {
    from { height: 10px; }
    to   { height: var(--target-height); }
  }

  .grid-3x3.phase2 .phase2-card--6 .bar-v3 {
    animation: grow-bar-v3 0.7s ease-out forwards;
  }
  .grid-3x3.phase2 .phase2-card--6 .bar-2-v3 { animation-delay: 0.07s; }
  .grid-3x3.phase2 .phase2-card--6 .bar-3-v3 { animation-delay: 0.14s; }
  .grid-3x3.phase2 .phase2-card--6 .bar-4-v3 { animation-delay: 0.21s; }
  .grid-3x3.phase2 .phase2-card--6 .bar-5-v3 { animation-delay: 0.28s; }
  .grid-3x3.phase2 .phase2-card--6 .bar-6-v3 { animation-delay: 0.35s; }

  /* =========================================================
   * PHASE 2 — CARD 4 (data-label="4") — VARIATION 4
   * Multi-Creator Campaigns
   * ========================================================= */

  .phase2-card--4 > .img-stack-bg-v4 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .phase2-card--4 .stack-item-v4 {
    width: 100%;
    height: calc((100% - 3 * 4px) / 4);
    border-radius: inherit;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  .phase2-card--4 .img-item-v4 img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .phase2-card--4 .glass-rect-v4 {
    background-color: rgba(95, 222, 222, 0.36);
    border: 0.5px solid rgba(95, 222, 222, 0.7);
  }

  .phase2-card--4 .glass-labels-v4 {
    position: absolute;
    inset: 0;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    box-sizing: border-box;
  }

  .phase2-card--4 .glass-label-top-v4,
  .phase2-card--4 .glass-label-bottom-v4 {
    font-weight: 600;
    font-size: 13px;
    line-height: 1.1;
    color: #ffffff;
  }

  @keyframes v4-slide-2 {
    from { transform: translateY(-70px); }
    to   { transform: translateY(0); }
  }
  @keyframes v4-slide-3 {
    from { transform: translateY(-140px); }
    to   { transform: translateY(0); }
  }
  @keyframes v4-slide-rect {
    from { transform: translateY(-210px); }
    to   { transform: translateY(0); }
  }

  .grid-3x3.phase2 .phase2-card--4 .img-2-v4 {
    animation: v4-slide-2 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
  .grid-3x3.phase2 .phase2-card--4 .img-3-v4 {
    animation: v4-slide-3 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
  .grid-3x3.phase2 .phase2-card--4 .glass-rect-v4 {
    animation: v4-slide-rect 1.2s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }

  /* =========================================================
   * PHASE 2 — CARD 1+2 (data-label="1+2") — VARIATION 8
   * Unified Dashboard
   * ========================================================= */

  .phase2-card--1-2 > .img-cutout-bg-v8 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;
  }

  .phase2-card--1-2 .img-cutout-canvas-v8 {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 0;
  }

  .phase2-card--1-2 .v8-label-wrap {
    position: absolute;
    top: 14px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 1;
  }

  .phase2-card--1-2 .v8-label-line {
    font-weight: 600;
    font-size: 13.25px;
    line-height: 1.08;
    color: #ffffff;
    white-space: nowrap;
    text-align: left;
  }

  .phase2-card--1-2 .v8-label-dashboard {
    margin-top: 5px;
  }

  .phase2-card--1-2 .v8-top-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
    pointer-events: none;
  }

  /* =========================================================
   * PHASE 2 — CARD 7 (data-label="7") — VARIATION 16
   * Always-On Exposure toggle
   * ========================================================= */

  .phase2-card--7 > .alwayson-card-v16 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    box-sizing: border-box;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-align: center;
    overflow: hidden;
  }

  .phase2-card--7 .v16-toggle-wrap {
    margin-bottom: 8px;
  }

  .phase2-card--7 .v16-toggle {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 148px;
    height: 56px;
    box-sizing: border-box;
  }

  .phase2-card--7 .v16-toggle-bg {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.7);
    transition: background 0.3s ease;
    z-index: 1;
  }

  .phase2-card--7 .v16-toggle-knob {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 56px;
    height: 44px;
    border-radius: 999px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #000000;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.28);
    transition: all 0.3s ease;
    z-index: 2;
  }

  .phase2-card--7 .v16-toggle-knob::before {
    content: "OFF";
  }

  .grid-3x3.phase2 .phase2-card--7 .v16-toggle-knob {
    left: calc(100% - 6px - 56px);
    background: #5fdede;
    color: #004889;
  }

  .grid-3x3.phase2 .phase2-card--7 .v16-toggle-knob::before {
    content: "ON";
  }

  .grid-3x3.phase2 .phase2-card--7 .v16-toggle-bg {
    background: rgba(0, 72, 137, 0.7);
  }

  .phase2-card--7 .v16-subtext {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
    color: #ffffff;
    white-space: nowrap;
  }

  /* =========================================================
   * PHASE 2 — CARD 8+9 (data-label="8+9") — VARIATION 13
   * Smarter Targeting
   * ========================================================= */

  .phase2-card--8-9 > .targeting-card-v13 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    overflow: hidden;
  }

  .phase2-card--8-9 .v13-icon-wrap {
    width: 68%;
    max-width: 145px;
    aspect-ratio: 1 / 1;
    margin: 0;
    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/marker-pin-06-svgrepo-com.svg");
    mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/marker-pin-06-svgrepo-com.svg");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
  }

  .phase2-card--8-9 .v13-subtext {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
    color: #ffffff;
    margin: 0;
    white-space: normal;
  }

  /* =========================================================
   * PHASE 2 — CARD 3 (data-label="3") — VARIATION 12
   * Perfect For
   * ========================================================= */

  .phase2-card--3 > .perfect-card-v12 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    overflow: hidden;
  }

  .phase2-card--3 .v12-icon-wrap {
    width: 68%;
    max-width: 145px;
    aspect-ratio: 1 / 1;
    margin: 0;
    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/maximize-svgrepo-com.svg");
    mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/maximize-svgrepo-com.svg");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
  }

  .phase2-card--3 .v12-subtext {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
    color: #ffffff;
    margin: 0;
    white-space: normal;
  }

  /* Squarespace padding reset */
  .sqs-block-code .sqs-block-content {
    padding: 0 !important;
  }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

// SECTION 8 — PHASE 3 CONTENT (LIVE IMPLEMENTATION)

// Inject SECTION 8 CSS
(function () {
  var css = `
  /*************************************************
   * PHASE 3 — CARD 1+2 (data-label="1+2")
   * VARIATION 15 — Premium Creators
   * Note:
   * - Uses border-radius: inherit so outer corners
   *   match the parent .cell (12px from Section 1).
   *************************************************/
  .phase3-card--1-2 > .premium-card-v15 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    overflow: hidden;
  }

  .phase3-card--1-2 .v15-icon-wrap {
    width: 100%;
    max-width: 145px;
    aspect-ratio: 1 / 1;
    margin: 0;
    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/star-03-svgrepo-com.svg");
    mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/star-03-svgrepo-com.svg");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
  }

  .phase3-card--1-2 .v15-subtext {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
    color: #ffffff;
    margin: 0;
    white-space: normal;
  }

  /*************************************************
   * PHASE 3 — CARD 3 (data-label="3")
   * VARIATION 5 — Safety & Compliance
   * Note:
   * - Outer wrapper uses border-radius: inherit (12px).
   * - Inner glass tiles use their own 10px radius by design.
   *************************************************/
  .phase3-card--3 > .img-cutout-bg-v5 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;

    --glass-bg-v5: rgba(255, 255, 255, 0.12);
    --glass-border-v5: rgba(255, 255, 255, 0.28);
    --glass-blur-v5: 16px;
    --glass-saturation-v5: 140%;

    --gap-v5: 6px;
    --glass-offset-v5: 6px;

    --glass-height-top-v5: 48px;
    --glass-height-bottom-v5: 86px;

    /* Bottom card width = 40% of inner width */
    --glass-width-v5: calc((100% - (var(--glass-offset-v5) * 2)) * 0.4);

    /* Gap between the two top cards */
    --glass-gap-h-v5: 6px;
  }

  .phase3-card--3 .img-cutout-canvas-v5 {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .phase3-card--3 .glass-rect-v5 {
    position: absolute;
    box-sizing: border-box;
    right: var(--glass-offset-v5);
    width: var(--glass-width-v5);
    bottom: var(--gap-v5);
    height: var(--glass-height-bottom-v5);
    background: var(--glass-bg-v5);
    border: 1px solid var(--glass-border-v5);
    backdrop-filter: blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    -webkit-backdrop-filter: blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    border-radius: 10px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .phase3-card--3 .glass-labels-v5 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .phase3-card--3 .glass-label-top-v5,
  .phase3-card--3 .glass-label-bottom-v5 {
    font-weight: 600;
    font-size: 15px;
    line-height: 1.1;
    color: #ffffff;
  }

  .phase3-card--3 .glass-rect-top-v5 {
    position: absolute;
    box-sizing: border-box;
    height: var(--glass-height-top-v5);
    top: var(--gap-v5);
    background: rgba(95, 222, 222, 0.36);
    border: 0.5px solid rgba(95, 222, 222, 0.7);
    border-radius: 10px;
    backdrop-filter: blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    -webkit-backdrop-filter: blur(var(--glass-blur-v5)) saturate(var(--glass-saturation-v5));
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;

    opacity: 0;
    transform: translateY(10px);
  }

  .phase3-card--3 .glass-rect-top-left-v5 {
    left: calc(100% - var(--glass-offset-v5) - var(--glass-width-v5));
    width: calc((var(--glass-width-v5) - var(--glass-gap-h-v5)) / 2);
  }

  .phase3-card--3 .glass-rect-top-right-v5 {
    right: var(--glass-offset-v5);
    width: calc((var(--glass-width-v5) - var(--glass-gap-h-v5)) / 2);
  }

  .phase3-card--3 .glass-top-icon-v5 {
    width: 28px;
    height: 28px;
    display: block;
    filter: invert(82%) sepia(18%) saturate(1090%) hue-rotate(132deg) brightness(101%) contrast(98%);
  }

  @keyframes v5-rise-bounce {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }
    55% {
      opacity: 1;
      transform: translateY(-4px) scale(1.02);
    }
    80% {
      transform: translateY(2px) scale(0.995);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .grid-3x3.phase3 .phase3-card--3 .glass-rect-top-left-v5 {
    animation: v5-rise-bounce 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    animation-delay: 0.05s;
  }

  .grid-3x3.phase3 .phase3-card--3 .glass-rect-top-right-v5 {
    animation: v5-rise-bounce 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
    animation-delay: 0.2s;
  }

  /*************************************************
   * PHASE 3 — CARD 4 (data-label="4")
   * VARIATION 17 — High-impact Storytelling
   *************************************************/
  .phase3-card--4 > .img-cutout-bg-v17 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;
  }

  .phase3-card--4 .img-cutout-canvas-v17 {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
  }

  .phase3-card--4 .v17-label-wrap {
    position: absolute;
    left: 50%;
    bottom: 9px;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }

  .phase3-card--4 .v17-label-line {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.14;
    color: #ffffff;
    white-space: nowrap;
    text-align: center;
  }

  .phase3-card--4 .v17-label-story {
    margin-top: 2px;
  }

  /*************************************************
   * PHASE 3 — CARD 6 (data-label="6")
   * VARIATION 14 — Global Launches
   *************************************************/
  .phase3-card--6 > .global-card-v14 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    background: transparent;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-align: center;
    overflow: hidden;
  }

  .phase3-card--6 .v14-icon-wrap {
    width: 100%;
    max-width: 145px;
    aspect-ratio: 1 / 1;
    margin: 0;
    background: linear-gradient(135deg, #28e1d8, #049bc6, #0965b3, #070616);
    -webkit-mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/globe-02-1-svgrepo-com.svg");
    mask-image: url("https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/globe-02-1-svgrepo-com.svg");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
  }

  .phase3-card--6 .v14-subtext {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
    color: #ffffff;
    margin: 0;
    white-space: normal;
  }

  /*************************************************
   * PHASE 3 — CARD 7 (data-label="7")
   * VARIATION 6 — 0→300K+ Impressions (cut-out)
   *************************************************/
  .phase3-card--7 > .img-cutout-bg-v6 {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;
  }

  .phase3-card--7 .img-cutout-canvas-v6 {
    display: block;
    width: 100%;
    height: 100%;
  }

  /*************************************************
   * PHASE 3 — CARD 8+9 (data-label="8+9")
   * VARIATION 8b — CMO-Ready Reporting
   *************************************************/
  .phase3-card--8-9 > .img-cutout-bg-v8b {
    position: absolute;
    inset: 10px;
    margin: 0;
    width: auto;
    height: auto;
    border-radius: inherit;
    overflow: hidden;
    box-sizing: border-box;
  }

  .phase3-card--8-9 .img-cutout-canvas-v8b {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .phase3-card--8-9 .v8b-label-wrap {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }

  .phase3-card--8-9 .v8b-label-line {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    font-size: 15px;
    line-height: 1.08;
    color: #ffffff;
    white-space: nowrap;
    text-align: center;
  }

  .phase3-card--8-9 .v8b-label-bottom {
    margin-top: 3px;
  }

  .phase3-card--8-9 .v8b-top-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translateX(-3px) scale(1.26);
    transform-origin: center;
    z-index: 2;
    pointer-events: none;
  }

  /* Squarespace padding reset */
  .sqs-block-code .sqs-block-content {
    padding: 0 !important;
  }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

/* PHASE 3 — SAFETY & COMPLIANCE (VARIATION 5) BACKGROUND */
(function () {
  var container = document.querySelector('.phase3-card--3 .img-cutout-bg-v5');
  var canvas = container ? container.querySelector('.img-cutout-canvas-v5') : null;
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var IMG_BASE_SRC_V5 =
    'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/0fdea2de-2967-42f7-b888-011f35dd20f2/Screenshot+2025-11-08+at+21.22.26.png?content-type=image%2Fpng';

  var imgBase = new Image();
  imgBase.crossOrigin = 'anonymous';
  imgBase.src = IMG_BASE_SRC_V5;
  imgBase.onload = draw;

  function draw() {
    var width = container.offsetWidth || 1;
    var height = container.offsetHeight || 1;
    var ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var imgRatio = imgBase.width / imgBase.height;
    var boxRatio = width / height;
    var dw, dh, dx, dy;

    if (imgRatio > boxRatio) {
      dh = height;
      dw = dh * imgRatio;
      dx = (width - dw) / 2;
      dy = 0;
    } else {
      dw = width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (height - dh) / 2;
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(imgBase, dx, dy, dw, dh);
  }

  window.addEventListener('resize', draw, { passive: true });
})();

/* PHASE 3 — HIGH-IMPACT STORYTELLING (VARIATION 17) BACKGROUND */
(function () {
  var container = document.querySelector('.phase3-card--4 .img-cutout-bg-v17');
  var canvas = container ? container.querySelector('.img-cutout-canvas-v17') : null;
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var IMG_BASE_SRC_V17 =
    'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/6a5b0cc8-596c-4352-aedd-497ac039f829/AdobeStock_1159033223.png?content-type=image%2Fpng';

  var imgBase = new Image();
  imgBase.crossOrigin = 'anonymous';
  imgBase.src = IMG_BASE_SRC_V17;
  imgBase.onload = draw;

  function draw() {
    var width = container.offsetWidth || 1;
    var height = container.offsetHeight || 1;
    var ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var imgRatio = imgBase.width / imgBase.height;
    var boxRatio = width / height;
    var dw, dh, dx, dy;
    var zoom = 1.12;

    if (imgRatio > boxRatio) {
      dh = height * zoom;
      dw = dh * imgRatio;
    } else {
      dw = width * zoom;
      dh = dw / imgRatio;
    }

    dx = (width - dw) / 2;
    dy = (height - dh) / 2;

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(imgBase, dx, dy, dw, dh);
  }

  window.addEventListener('resize', draw, { passive: true });
})();

/* PHASE 3 — CMO-READY REPORTING (VARIATION 8b) BACKGROUND */
(function () {
  var container = document.querySelector('.phase3-card--8-9 .img-cutout-bg-v8b');
  var canvas = container ? container.querySelector('.img-cutout-canvas-v8b') : null;
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var IMG_BASE_SRC_V8B =
    'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/692d7d41-8b3e-434c-b714-a03409ec3747/AdobeStock_995204951+-+09-11-2025+02-55-50.png?content-type=image%2Fpng';

  var imgBase = new Image();
  imgBase.crossOrigin = 'anonymous';
  imgBase.src = IMG_BASE_SRC_V8B;
  imgBase.onload = draw;

  function draw() {
    var width = container.offsetWidth || 1;
    var height = container.offsetHeight || 1;
    var ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var imgRatio = imgBase.width / imgBase.height;
    var boxRatio = width / height;
    var dw, dh, dx, dy;

    if (imgRatio > boxRatio) {
      dh = height;
      dw = dh * imgRatio;
      dx = (width - dw) / 2;
      dy = 0;
    } else {
      dw = width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (height - dh) / 2;
    }

    var scale = 1.26;
    var shiftX = 3;

    dw *= scale;
    dh *= scale;
    dx = (width - dw) / 2 - shiftX;
    dy = (height - dh) / 2;

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(imgBase, dx, dy, dw, dh);
  }

  window.addEventListener('resize', draw, { passive: true });
})();

/* PHASE 3 — 0→300K+ IMPRESSIONS (VARIATION 6) — COUNT-UP */
(function () {
  var grid = document.getElementById('grid');
  var container = document.querySelector('.phase3-card--7 .img-cutout-bg-v6');
  var canvas = container ? container.querySelector('.img-cutout-canvas-v6') : null;
  if (!grid || !container || !canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var IMG_BASE_SRC_V6 =
    'https://images.squarespace-cdn.com/content/6429ceedf3c1736950d2301a/d9714628-111f-4f1f-9b64-810bb1f0376a/AdobeStock_381349355.jpeg?content-type=image%2Fjpeg';

  var imgBase = new Image();
  imgBase.crossOrigin = 'anonymous';
  imgBase.src = IMG_BASE_SRC_V6;

  var targetValue = 300;      // 300K
  var animDuration = 1200;    // ms
  var started = false;
  var startTime = null;

  imgBase.onload = function () {
    if (grid.classList.contains('phase3')) {
      startCountUp();
    } else {
      var obs = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          if (muts[i].type === 'attributes' && muts[i].attributeName === 'class') {
            if (grid.classList.contains('phase3') && !started) {
              startCountUp();
            }
          }
        }
      });
      obs.observe(grid, { attributes: true });
    }
  };

  function startCountUp() {
    if (started) return;
    started = true;
    requestAnimationFrame(animate);
  }

  function animate(ts) {
    if (!startTime) startTime = ts;
    var elapsed = ts - startTime;
    var t = Math.max(0, Math.min(1, elapsed / animDuration));
    var eased = 1 - Math.pow(1 - t, 3);
    var currentValue = Math.floor(targetValue * eased);

    drawFrame(currentValue);

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      drawFrame(targetValue);
    }
  }

  function drawFrame(currentValue) {
    var width = container.offsetWidth || 1;
    var height = container.offsetHeight || 1;
    var ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    var imgRatio = imgBase.width / imgBase.height;
    var boxRatio = width / height;
    var dw, dh, dx, dy;

    if (imgRatio > boxRatio) {
      dh = height;
      dw = dh * imgRatio;
      dx = (width - dw) / 2;
      dy = 0;
    } else {
      dw = width;
      dh = dw / imgRatio;
      dx = 0;
      dy = (height - dh) / 2;
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(imgBase, dx, dy, dw, dh);

    var gap = 6;
    var offset = 6;
    var cardW = width;
    var cardH = height;

    var cutHeight = cardH - gap * 2;
    var innerW = cardW - offset * 2;
    var baseWidth = innerW * 0.4;
    var cutWidth = baseWidth * 1.3;

    var cutX = cardW - offset - cutWidth;
    var cutY = gap;

    var radius = 10;
    var r = Math.min(radius, cutWidth / 2, cutHeight / 2);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(cutX + r, cutY);
    ctx.lineTo(cutX + cutWidth - r, cutY);
    ctx.quadraticCurveTo(cutX + cutWidth, cutY, cutX + cutWidth, cutY + r);
    ctx.lineTo(cutX + cutWidth, cutY + cutHeight - r);
    ctx.quadraticCurveTo(
      cutX + cutWidth,
      cutY + cutHeight,
      cutX + cutWidth - r,
      cutY + cutHeight
    );
    ctx.lineTo(cutX + r, cutY + cutHeight);
    ctx.quadraticCurveTo(
      cutX,
      cutY + cutHeight,
      cutX,
      cutY + cutHeight - r
    );
    ctx.lineTo(cutX, cutY + r);
    ctx.quadraticCurveTo(cutX, cutY, cutX + r, cutY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    var textMain = currentValue.toString() + 'K';
    var textPlus = '+';
    var text2 = 'IMPRESSIONS';

    var boxW = cutWidth;
    var boxH = cutHeight;
    var xCenter = cutX + boxW / 2;

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';

    var fontSizeMain = boxH * 0.28;
    var fontSizePlus = fontSizeMain * (5 / 9);

    ctx.font =
      '900 ' +
      fontSizeMain +
      'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    var mMain = ctx.measureText(textMain);
    var mainAscent = mMain.actualBoundingBoxAscent || fontSizeMain;
    var mainDescent = mMain.actualBoundingBoxDescent || 0;
    var mainWidth = mMain.width;

    ctx.font =
      '700 ' +
      fontSizePlus +
      'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    var mPlus = ctx.measureText(textPlus);
    var plusAscent = mPlus.actualBoundingBoxAscent || fontSizePlus;
    var plusDescent = mPlus.actualBoundingBoxDescent || 0;
    var plusWidth = mPlus.width;

    var line1Ascent = Math.max(mainAscent, plusAscent);
    var line1Descent = Math.max(mainDescent, plusDescent);
    var totalLine1Width = mainWidth + plusWidth;

    var fontSize2 = boxH * 0.14;
    ctx.font =
      '600 ' +
      fontSize2 +
      'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    var m2 = ctx.measureText(text2);
    var asc2 = m2.actualBoundingBoxAscent || fontSize2;
    var desc2 = m2.actualBoundingBoxDescent || 0;

    var gap12 = boxH * 0.1;
    var blockHeight = line1Ascent + line1Descent + gap12 + asc2 + desc2;
    var topY = cutY + (boxH - blockHeight) / 2;

    var baseline1 = topY + line1Ascent;
    var baseline2 = baseline1 + line1Descent + gap12 + asc2;

    ctx.font =
      '900 ' +
      fontSizeMain +
      'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    var startX = xCenter - totalLine1Width / 2;
    ctx.fillText(textMain, startX, baseline1);

    var mainTop = baseline1 - mainAscent;
    var mainBottom = baseline1 + mainDescent;
    var mainCenter = (mainTop + mainBottom) / 2;
    var plusCenterOffset = (plusAscent - plusDescent) / 2;
    var plusBaseline = mainCenter + plusCenterOffset;

    ctx.font =
      '700 ' +
      fontSizePlus +
      'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(textPlus, startX + mainWidth, plusBaseline);

    ctx.font =
      '600 ' +
      fontSize2 +
      'px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text2, xCenter, baseline2);
  }
})();


(function(){if(document.querySelector("style[data-ss=\"perimeter-inset-override\"]"))return;const css="/* Perimeter cards inset override: 10px -> 6px (center unchanged) */\n.grid-3x3 .cell:not(.cell--center):not([data-row=\"2\"][data-col=\"2\"]):not([data-center=\"true\"]) .phase1-card > *,\n.grid-3x3 .cell:not(.cell--center):not([data-row=\"2\"][data-col=\"2\"]):not([data-center=\"true\"]) .phase2-card > *,\n.grid-3x3 .cell:not(.cell--center):not([data-row=\"2\"][data-col=\"2\"]):not([data-center=\"true\"]) .phase3-card > * { inset: 6px !important; }";const el=document.createElement("style");el.type="text/css";el.setAttribute("data-ss","perimeter-inset-override");el.appendChild(document.createTextNode(css));document.head.appendChild(el);})();
(function(){if(document.querySelector("style[data-ss=\"perimeter-inset-override\"]"))return;var css="/* Perimeter cards inset override: 10px -> 6px (center unchanged) */ .grid-3x3 .cell:not(.cell--center):not([data-row=\"2\"][data-col=\"2\"]):not([data-center=\"true\"]) .phase1-card > *, .grid-3x3 .cell:not(.cell--center):not([data-row=\"2\"][data-col=\"2\"]):not([data-center=\"true\"]) .phase2-card > *, .grid-3x3 .cell:not(.cell--center):not([data-row=\"2\"][data-col=\"2\"]):not([data-center=\"true\"]) .phase3-card > *{inset:6px !important;}";var el=document.createElement("style");el.type="text/css";el.setAttribute("data-ss","perimeter-inset-override");el.appendChild(document.createTextNode(css));document.head.appendChild(el);})();
(function(){var TARGETS=[{phase:1,must:[\"hand picked\",\"brand safe\"]},{phase:2,must:[\"perfect for\",\"dtc\",\"saas\",\"growth\"]},{phase:2,must:[\"smarter targeting\",\"audience\"]},{phase:3,must:[\"premium creators\"]},{phase:3,must:[\"perfect for\"]}];function norm(t){return (t||\"\").toLowerCase().replace(/\\s+/g,\" \").trim()}function textMatches(el,req){var txt=norm(el.textContent);for(var i=0;i<req.must.length;i++){if(txt.indexOf(req.must[i])===-1)return!1}return!0}function pickCards(){var r=[];[{sel:\".phase1-card\",p:1},{sel:\".phase2-card\",p:2},{sel:\".phase3-card\",p:3}].forEach(function(ph){document.querySelectorAll(ph.sel).forEach(function(card){TARGETS.forEach(function(t){if(t.phase&&t.phase!==ph.p)return;if(textMatches(card,t))r.push(card)})})});return r}var uidCounter=0;function uid(p){uidCounter++;return\"ssfx-\"+p+\"-\"+uidCounter}function getPathDataFromSvg(svg){var p=svg.querySelector(\"path\");if(p&&p.getAttribute(\"d\"))return{d:p.getAttribute(\"d\"),viewBox:svg.getAttribute(\"viewBox\")||\"0 0 24 24\"};var u=svg.querySelector(\"use\");if(u){var ref=u.getAttribute(\"href\")||u.getAttribute(\"xlink:href\");if(ref&&ref.charAt(0)===\"#\"){var sym=document.querySelector(ref);if(sym){var sp=sym.querySelector(\"path\");if(sp&&sp.getAttribute(\"d\")){var vb=sym.getAttribute(\"viewBox\")||svg.getAttribute(\"viewBox\")||\"0 0 24 24\";return{d:sp.getAttribute(\"d\"),viewBox:vb}}}}}return null}function enhanceIcon(svg){if(!svg||svg.dataset.ssEnhanced===\"1\")return;var data=getPathDataFromSvg(svg);if(!data)return;var baseId=uid(\"g\"),gradBaseId=baseId+\"-base\",gradShineId=baseId+\"-shine\",filtId=baseId+\"-shadow\";svg.setAttribute(\"viewBox\",data.viewBox||\"0 0 24 24\");svg.innerHTML=\"\";var NS=\"http://www.w3.org/2000/svg\";var defs=document.createElementNS(NS,\"defs\");var lg=document.createElementNS(NS,\"linearGradient\");lg.setAttribute(\"id\",gradBaseId);lg.setAttribute(\"x1\",\"0%\");lg.setAttribute(\"y1\",\"0%\");lg.setAttribute(\"x2\",\"100%\");lg.setAttribute(\"y2\",\"100%\");[[\"0%\",\"#acfcfc\"],[\"50%\",\"#5fdede\"],[\"100%\",\"#02c2cb\"]].forEach(function(s){var st=document.createElementNS(NS,\"stop\");st.setAttribute(\"offset\",s[0]);st.setAttribute(\"stop-color\",s[1]);lg.appendChild(st)});defs.appendChild(lg);var filt=document.createElementNS(NS,\"filter\");filt.setAttribute(\"id\",filtId);filt.setAttribute(\"x\",\"-80%\");filt.setAttribute(\"y\",\"-80%\");filt.setAttribute(\"width\",\"260%\");filt.setAttribute(\"height\",\"260%\");var fe=document.createElementNS(NS,\"feDropShadow\");fe.setAttribute(\"dx\",\"0\");fe.setAttribute(\"dy\",\"2\");fe.setAttribute(\"stdDeviation\",\"1.6\");fe.setAttribute(\"flood-color\",\"#000000\");fe.setAttribute(\"flood-opacity\",\"0.35\");filt.appendChild(fe);defs.appendChild(filt);var shine=document.createElementNS(NS,\"linearGradient\");shine.setAttribute(\"id\",gradShineId);shine.setAttribute(\"gradientUnits\",\"userSpaceOnUse\");shine.setAttribute(\"x1\",\"-10\");shine.setAttribute(\"y1\",\"-10\");shine.setAttribute(\"x2\",\"10\");shine.setAttribute(\"y2\",\"10\");var s1=document.createElementNS(NS,\"stop\");s1.setAttribute(\"offset\",\"0%\");s1.setAttribute(\"stop-color\",\"#FFFFFF\");s1.setAttribute(\"stop-opacity\",\"0\");shine.appendChild(s1);var s2=document.createElementNS(NS,\"stop\");s2.setAttribute(\"offset\",\"50%\");s2.setAttribute(\"stop-color\",\"#FFFFFF\");s2.setAttribute(\"stop-opacity\",\"0.9\");shine.appendChild(s2);var s3=document.createElementNS(NS,\"stop\");s3.setAttribute(\"offset\",\"100%\");s3.setAttribute(\"stop-color\",\"#FFFFFF\");s3.setAttribute(\"stop-opacity\",\"0\");shine.appendChild(s3);[[\"x1\",\"-10;10;30\"],[\"y1\",\"-10;10;30\"],[\"x2\",\"10;30;50\"],[\"y2\",\"10;30;50\"]].forEach(function(a){var an=document.createElementNS(NS,\"animate\");an.setAttribute(\"attributeName\",a[0]);an.setAttribute(\"values\",a[1]);an.setAttribute(\"dur\",\"2.6s\");an.setAttribute(\"repeatCount\",\"1\");an.setAttribute(\"begin\",\"indefinite\");shine.appendChild(an)});defs.appendChild(shine);svg.appendChild(defs);var g=document.createElementNS(NS,\"g\");g.setAttribute(\"filter\",\"url(#\"+filtId+\")\");var p1=document.createElementNS(NS,\"path\");p1.setAttribute(\"d\",data.d);p1.setAttribute(\"fill\",\"none\");p1.setAttribute(\"stroke\",\"url(#\"+gradBaseId+\")\");p1.setAttribute(\"stroke-width\",\"2\");p1.setAttribute(\"stroke-linecap\",\"round\");p1.setAttribute(\"stroke-linejoin\",\"round\");g.appendChild(p1);var p2=document.createElementNS(NS,\"path\");p2.setAttribute(\"d\",data.d);p2.setAttribute(\"fill\",\"none\");p2.setAttribute(\"stroke\",\"url(#\"+gradShineId+\")\");p2.setAttribute(\"stroke-width\",\"2.6\");p2.setAttribute(\"stroke-linecap\",\"round\");p2.setAttribute(\"stroke-linejoin\",\"round\");g.appendChild(p2);svg.appendChild(g);svg.dataset.ssEnhanced=\"1\";var armed=!1;function triggerShineOnce(){if(armed)return;armed=!0;shine.querySelectorAll(\"animate\").forEach(function(a){if(typeof a.beginElement===\"function\")a.beginElement()})}var phaseCard=svg.closest(\".phase1-card, .phase2-card, .phase3-card\");if(phaseCard){var onEnd=function(ev){if(ev.propertyName===\"opacity\"){var op=getComputedStyle(phaseCard).opacity;if(op===\"1\"){triggerShineOnce();phaseCard.removeEventListener(\"transitionend\",onEnd)}}};phaseCard.addEventListener(\"transitionend\",onEnd);if(getComputedStyle(phaseCard).opacity===\"1\"){setTimeout(triggerShineOnce,100)}}else{var io=new IntersectionObserver(function(es,obs){es.forEach(function(en){if(en.isIntersecting){triggerShineOnce();obs.unobserve(en.target)}})},{threshold:0.6});io.observe(svg)}}function process(){pickCards().forEach(function(card){var svg=card.querySelector(\"svg\");if(svg)enhanceIcon(svg)})}if(document.readyState===\"loading\"){document.addEventListener(\"DOMContentLoaded\",function(){setTimeout(process,50);setTimeout(process,400)})}else{setTimeout(process,50);setTimeout(process,400)}var root=document.querySelector(\".grid-3x3\")||document.body;var mo=new MutationObserver(function(){setTimeout(process,30)});mo.observe(root,{childList:!0,subtree:!0});})();
(function(){var root=document.querySelector(".grid-3x3");if(!root)return;function isCenter(c){return c.classList.contains("cell--center")||(c.getAttribute("data-row")==="2"&&c.getAttribute("data-col")==="2")||c.getAttribute("data-center")==="true";}function pxn(v){var n=parseFloat(v);return isNaN(n)?null:n;}function near10(n){return n!==null&&n>=9&&n<=11;}function fixPhase(phase){var all=phase.querySelectorAll("*");for(var i=0;i<all.length;i++){var el=all[i];var cs=getComputedStyle(el);if(cs.position==="absolute"){var t=pxn(cs.top),r=pxn(cs.right),b=pxn(cs.bottom),l=pxn(cs.left),hits=0;hits+=near10(t)?1:0;hits+=near10(r)?1:0;hits+=near10(b)?1:0;hits+=near10(l)?1:0;if(hits>=2){el.style.setProperty("inset","6px","important");el.style.setProperty("top","6px","important");el.style.setProperty("right","6px","important");el.style.setProperty("bottom","6px","important");el.style.setProperty("left","6px","important");}}var pt=pxn(cs.paddingTop),pr=pxn(cs.paddingRight),pb=pxn(cs.paddingBottom),pl=pxn(cs.paddingLeft);if(near10(pt)&&near10(pr)&&near10(pb)&&near10(pl)){el.style.setProperty("padding","6px","important");}}}function tweak(){root.querySelectorAll(".cell").forEach(function(cell){if(isCenter(cell))return;cell.querySelectorAll(".phase1-card,.phase2-card,.phase3-card").forEach(fixPhase);});}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",tweak);}else{tweak();}new MutationObserver(tweak).observe(root,{subtree:true,childList:true});})();
(function(){function R(){return document.getElementById("ss-mp-grid")||document.querySelector(".grid-3x3")||document.body}var root=R();if(!root)return;function px(v){var n=parseFloat(v);return isNaN(n)?null:n}function near(n,t){return n!=null&&Math.abs(n-t)<=1.5}function isCenter(cell){if(cell.classList.contains("cell--center"))return!0;var r=cell.getAttribute("data-row"),c=cell.getAttribute("data-col");if(r==="2"&&c==="2")return!0;if(cell.getAttribute("data-center")==="true")return!0;var p=cell.parentElement;if(p){var cells=Array.from(p.querySelectorAll(".cell"));if(cells.length===9&&cells[4]===cell)return!0}return!1}function fixAbs(el){var cs=getComputedStyle(el),t=px(cs.top),ri=px(cs.right),b=px(cs.bottom),l=px(cs.left),hits=0;hits+=near(t,10)?1:0;hits+=near(ri,10)?1:0;hits+=near(b,10)?1:0;hits+=near(l,10)?1:0;if(cs.position==="absolute"&&hits>=2){el.style.setProperty("inset","6px","important");el.style.setProperty("top","6px","important");el.style.setProperty("right","6px","important");el.style.setProperty("bottom","6px","important");el.style.setProperty("left","6px","important")}}function fixPadding(el){var cs=getComputedStyle(el),pt=px(cs.paddingTop),pr=px(cs.paddingRight),pb=px(cs.paddingBottom),pl=px(cs.paddingLeft);if(near(pt,10)&&near(pr,10)&&near(pb,10)&&near(pl,10)){el.style.setProperty("padding","6px","important");el.style.setProperty("box-sizing","border-box","important")}}function fixPhase(phase){var first=phase.firstElementChild;if(first){fixAbs(first);fixPadding(first)}phase.querySelectorAll("*").forEach(function(el){fixAbs(el)})}function tweak(){root.querySelectorAll(".cell").forEach(function(cell){if(isCenter(cell))return;fixPadding(cell);cell.querySelectorAll(".phase1-card,.phase2-card,.phase3-card").forEach(fixPhase)})}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",tweak)}else{tweak()}new MutationObserver(function(){tweak()}).observe(root,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["class","style"]});})();
(function(){if(typeof document==="undefined")return;if(window.__ssPerimeterInsetPatched)return;window.__ssPerimeterInsetPatched=true;try{var sheets=Array.prototype.slice.call(document.styleSheets||[]);sheets.forEach(function(sheet){var rules;try{rules=sheet.cssRules||sheet.rules;}catch(e){return;}if(!rules)return;for(var i=0;i<rules.length;i++){var rule=rules[i];if(!rule.style||!rule.selectorText)continue;var sel=rule.selectorText;var targetsPhaseCard=sel.indexOf("phase1-card")!==-1||sel.indexOf("phase2-card")!==-1||sel.indexOf("phase3-card")!==-1;if(!targetsPhaseCard)continue;var isCenter=sel.indexOf("cell--center")!==-1||sel.indexOf("[data-center=\"true\"]")!==-1;if(isCenter)continue;if(rule.style.inset==="10px"){rule.style.inset="6px";}if(rule.style.padding==="10px"){rule.style.padding="6px";}}});}catch(err){console.warn("ss-mp perimeter inset override failed",err);}})();
;(function(){if(typeof document==="undefined")return;try{if(document.querySelector("style[data-ss=perimeter-inset-override]"))return;var css="/* Perimeter cards inset override: 10px -> 6px (center card unchanged) */\n#ss-mp-grid .grid-3x3 .cell:not(.cell--center):not([data-center=\"true\"]) .phase1-card > *,\n#ss-mp-grid .grid-3x3 .cell:not(.cell--center):not([data-center=\"true\"]) .phase2-card > *,\n#ss-mp-grid .grid-3x3 .cell:not(.cell--center):not([data-center=\"true\"]) .phase3-card > * {\n  inset: 6px !important;\n  padding: 6px !important;\n}\n";var el=document.createElement("style");el.type="text/css";el.setAttribute("data-ss","perimeter-inset-override");el.appendChild(document.createTextNode(css));document.head.appendChild(el);}catch(e){console.warn("ss-mp perimeter inset override (style) failed",e);}})();