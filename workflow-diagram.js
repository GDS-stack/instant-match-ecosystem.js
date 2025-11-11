// Edited by GPT helper.
(function () {
  // Prevent double-loading
  if (window.InstantMatchEcoLoaded) return;
  window.InstantMatchEcoLoaded = true;

  const SPRITE_URL = 'https://raw.githubusercontent.com/GDS-stack/svgPaths.js/refs/heads/main/sponsource-icons.svg';

  /* ---------- Helpers: sprite + styles + markup ---------- */

  function ensureSprite() {
    return new Promise(function (resolve) {
      if (document.getElementById('ss-icons-sprite')) {
        resolve();
        return;
      }
      fetch(SPRITE_URL, { mode: 'cors' })
        .then(function (r) { return r.text(); })
        .then(function (txt) {
          const div = document.createElement('div');
          div.id = 'ss-icons-sprite';
          div.style.display = 'none';
          div.setAttribute('aria-hidden', 'true');
          div.innerHTML = txt;
          document.body.prepend(div);
          resolve();
        })
        .catch(function (err) {
          console.error('Icon sprite failed to load:', err);
          resolve(); // fail gracefully, still init layout
        });
    });
  }

  function injectStyles() {
    if (document.getElementById('ss-ecosys-styles')) return;
    const style = document.createElement('style');
    style.id = 'ss-ecosys-styles';
    style.textContent = `
      .ss-ecosys.mECO{
        background:transparent;
        position:relative;
        width:100%;
        padding:24.1231px;
        box-sizing:border-box;
        font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,"Helvetica Neue",Arial,sans-serif;
      }

      .eco-map{
        position:relative;
        width:560px;
        height:560px;
        margin-left:24.1231px;
        margin-top:24.1231px;
      }

      .tile{
        position:absolute;
        z-index:3;
        width:86.1538px;
        height:86.1538px;
        background-color:#161617;
        color:#7f848c;
        border-style:solid;
        border-color:#7f848c;
        border-width:1.2923px;
        border-radius:13.7846px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        text-align:center;
        pointer-events:auto;
        user-select:none;
        transition:
          transform .2s ease,
          box-shadow .2s ease,
          border-color .2s ease,
          border-width .2s ease,
          background-color .25s ease,
          filter .2s ease;
        overflow:hidden;
      }

      .tile.grad-me,
      .tile.grad-cu,
      .tile.grad-live{
        border-color:transparent;
        background-origin: padding-box, border-box;
        background-clip: padding-box, border-box;
        border-radius:13.7846px;
        background-color:#0B0B0C;
      }
      .tile.grad-me{
        background-image:
          linear-gradient(#0B0B0C,#0B0B0C),
          linear-gradient(45deg,#5fdede,#02c2cb,#009ed3,#0075dc,#0052e3);
      }
      .tile.grad-cu{
        background-image:
          linear-gradient(#0B0B0C,#0B0B0C),
          linear-gradient(45deg,#0b80ff,#206eff,#355cff,#5045ff,#682fff);
      }
      .tile.grad-live{
        background-image:
          linear-gradient(#0B0B0C,#0B0B0C),
          linear-gradient(45deg,#eeacff,#db8cff,#c465ff,#a94aff,#8a4bff);
      }

      .tile .ico{
        width:68.9231px;
        height:68.9231px;
        margin:0 auto 0 auto;
        display:block;
        transition: width .25s ease, height .25s ease, margin .25s ease;
      }
      .tile .ico path,
      .tile .ico circle,
      .tile .ico rect,
      .tile .ico polyline,
      .tile .ico polygon,
      .tile .ico line,
      .tile .ico ellipse{
        fill:none;
        stroke: var(--ico-stroke, currentColor);
        stroke-width:3.1015px;
        stroke-linecap:round;
        stroke-linejoin:round;
        vector-effect:non-scaling-stroke;
        transition: stroke .25s ease, stroke-opacity .25s ease, stroke-width .25s ease;
      }

      .tile.is-sender .ico path,
      .tile.is-sender .ico circle,
      .tile.is-sender .ico rect,
      .tile.is-sender .ico polyline,
      .tile.is-sender .ico polygon,
      .tile.is-sender .ico line,
      .tile.is-sender .ico ellipse,
      .tile.is-recipient .ico path,
      .tile.is-recipient .ico circle,
      .tile.is-recipient .ico rect,
      .tile.is-recipient .ico polyline,
      .tile.is-recipient .ico polygon,
      .tile.is-recipient .ico line,
      .tile.is-recipient .ico ellipse{
        stroke-width:1.8954px;
      }

      .tile .label{
        color:#ffffff;
        opacity:0;
        max-height:0;
        margin-top:0;
        overflow:hidden;
        pointer-events:none;
        transition: opacity .25s ease, max-height .25s ease;
        font-weight:600;
        font-size:10.3385px;
        line-height:1.1;
        letter-spacing:0.1723px;
        width:100%;
      }

      .tile.is-sender{
        transform:scale(1.10);
        box-shadow:none;
        border-width:1.2923px;
      }
      .tile.is-recipient{
        transform:none;
        border-width:1.2923px;
      }

      .tile.is-sender .ico{
        width:44.8px;
        height:44.8px;
        margin-bottom:6.7692px;
      }
      .tile.is-recipient .ico{
        width:39.6308px;
        height:39.6308px;
        margin-bottom:5.1692px;
      }

      .tile.is-sender .label,
      .tile.is-recipient .label{
        opacity:1;
        max-height:24.1231px;
        pointer-events:auto;
      }

      .tile:hover{
        transform:translateY(-2.5846px);
        box-shadow:0 6.8923px 20.6769px rgba(0,0,0,.35);
      }

      .wires{
        position:absolute;
        inset:0;
        width:560px;
        height:560px;
        z-index:1;
      }
      .wire{
        fill:none;
        stroke:#7f848c;
        stroke-width:1.7231px;
        stroke-linecap:round;
        stroke-linejoin:round;
        opacity:0;
        transition:opacity .35s ease, stroke-dashoffset .45s ease;
      }
      .wire.show{ opacity:1; }
      .wire.active{ filter:url(#ecoGlow); }

      @media (max-width:600px){
        .eco-map{
          max-width:100%;
          overflow:auto;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectMarkup(container) {
    container.innerHTML = `
      <div class="ss-ecosys mECO" role="img"
        aria-label="Sponsource instant match ecosystem on a 6x6 grid: Match Engine connects to Audience Fit, Brand Safety, Perf Score, Fraud Check, ROI Model, and Timing Fit. Curated List connects to Creator Outreach, Contract Signed, Product Seeding, and Review QA. Go Live connects to Live Analytics, Attribution Hub, and Guarantee Meter.">
        <div class="eco-map" id="ecoMap" style="visibility:hidden;">

          <div id="t-core" data-type="core" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-match-engine" xlink:href="#ico-match-engine"></use>
            </svg>
            <span class="label">Match Engine</span>
          </div>
          <div id="t-curate" data-type="core" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-curated-list" xlink:href="#ico-curated-list"></use>
            </svg>
            <span class="label">Curated List</span>
          </div>

          <div id="t-aud" data-type="signal" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-audience-fit" xlink:href="#ico-audience-fit"></use>
            </svg>
            <span class="label">Audience Fit</span>
          </div>
          <div id="t-safety" data-type="signal" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-brand-safety" xlink:href="#ico-brand-safety"></use>
            </svg>
            <span class="label">Brand Safety</span>
          </div>
          <div id="t-perf" data-type="signal" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-perf-model" xlink:href="#ico-perf-model"></use>
            </svg>
            <span class="label">Perf Score</span>
          </div>
          <div id="t-fraud" data-type="signal" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-fraud-check" xlink:href="#ico-fraud-check"></use>
            </svg>
            <span class="label">Fraud Check</span>
          </div>
          <div id="t-roi" data-type="signal" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-roi-model" xlink:href="#ico-roi-model"></use>
            </svg>
            <span class="label">ROI Model</span>
          </div>
          <div id="t-time" data-type="signal" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-timing-fit" xlink:href="#ico-timing-fit"></use>
            </svg>
            <span class="label">Timing Fit</span>
          </div>

          <div id="t-outreach" data-type="ops" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-creator-outreach" xlink:href="#ico-creator-outreach"></use>
            </svg>
            <span class="label">Creator Outreach</span>
          </div>
          <div id="t-contract" data-type="ops" class="tile has-icon">
            <svg class="ico is-pen" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-contract-signed" xlink:href="#ico-contract-signed"></use>
            </svg>
            <span class="label">Contract<br>Signed</span>
          </div>
          <div id="t-seed" data-type="ops" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-product-seeding" xlink:href="#ico-product-seeding"></use>
            </svg>
            <span class="label">Product Seeding</span>
          </div>
          <div id="t-qa" data-type="ops" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-review-qa" xlink:href="#ico-review-qa"></use>
            </svg>
            <span class="label">Review QA</span>
          </div>
          <div id="t-live" data-type="ops" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-go-live" xlink:href="#ico-go-live"></use>
            </svg>
            <span class="label">Go Live</span>
          </div>

          <div id="t-analytics" data-type="measure" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-live-analytics" xlink:href="#ico-live-analytics"></use>
            </svg>
            <span class="label">Live Analytics</span>
          </div>
          <div id="t-attr" data-type="measure" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-attribution-hub" xlink:href="#ico-attribution-hub"></use>
            </svg>
            <span class="label">Attribution<br>Hub</span>
          </div>
          <div id="t-guar" data-type="measure" class="tile has-icon">
            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
              <use href="#ico-guaranteed-impressions" xlink:href="#ico-guaranteed-impressions"></use>
            </svg>
            <span class="label">Guarantee Meter</span>
          </div>

          <svg class="wires" preserveAspectRatio="none" aria-hidden="true"></svg>
        </div>
      </div>
    `;
  }

  /* ---------- Original animation logic (slightly wrapped) ---------- */

  const MAP_W = 560;
  const MAP_H = 560;
  const NODE_W = 86.1538;
  const NODE_H = 86.1538;
  const STEP   = 94.7692;
  const SRC_GAP = 15.5077;
  const CURVE_R = 24.1231;

  const TILE_POS = {
    't-aud':      {x:0*STEP,   y:0*STEP},
    't-attr':     {x:2*STEP,   y:0*STEP},
    't-guar':     {x:4*STEP,   y:0*STEP},
    't-analytics':{x:1*STEP,   y:1*STEP},
    't-safety':   {x:4*STEP,   y:1*STEP},
    't-outreach': {x:5*STEP,   y:1*STEP},
    't-core':     {x:2*STEP,   y:2*STEP},
    't-curate':   {x:4*STEP,   y:2*STEP},
    't-roi':      {x:0*STEP,   y:3*STEP},
    't-perf':     {x:1*STEP,   y:3*STEP},
    't-contract': {x:5*STEP,   y:3*STEP},
    't-live':     {x:3*STEP,   y:4*STEP},
    't-seed':     {x:5*STEP,   y:4*STEP},
    't-time':     {x:3*STEP,   y:5*STEP},
    't-qa':       {x:4*STEP,   y:5*STEP},
    't-fraud':    {x:1*STEP,   y:5*STEP}
  };

  const EDGES = [
    ['t-core','t-aud','HVT'],
    ['t-core','t-roi','HVT'],
    ['t-core','t-safety','VH'],
    ['t-core','t-perf','HVT'],
    ['t-core','t-fraud','VH'],
    ['t-core','t-time','VH'],
    ['t-live','t-analytics','VH'],
    ['t-live','t-attr','VH'],
    ['t-live','t-guar','VH']
  ];

  const SENDER_STEPS = [
    { sender:'t-core',   recips:['t-aud','t-roi','t-safety','t-perf','t-fraud','t-time'], group:'me' },
    { sender:'t-curate', recips:['t-outreach','t-contract','t-seed','t-qa'], group:'cu' },
    { sender:'t-live',   recips:['t-analytics','t-attr','t-guar'], group:'live' }
  ];

  let wiresMeta = [];
  let seqTimers = [];

  function inlineSpriteIcons(retries=20){
    const sprite = document.getElementById('ss-icons-sprite');
    const map = document.getElementById('ecoMap');
    if (!map) return;
    const uses = map.querySelectorAll('svg.ico use');
    if (!sprite || uses.length === 0){
      if (retries > 0) setTimeout(()=>inlineSpriteIcons(retries-1), 100);
      return;
    }
    uses.forEach(use=>{
      const ref = use.getAttribute('href') || use.getAttribute('xlink:href');
      if(!ref || !ref.startsWith('#')) return;
      const sym = sprite.querySelector(ref);
      if(!sym) return;
      const svgEl = use.closest('svg.ico');
      const vb = sym.getAttribute('viewBox');
      if (vb) svgEl.setAttribute('viewBox', vb);

      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      Array.from(sym.childNodes).forEach(node=>{
        const clone = node.cloneNode(true);
        if (clone.nodeType === 1){
          const stack=[clone];
          while(stack.length){
            const el=stack.pop();
            el.removeAttribute('stroke');
            el.removeAttribute('fill');
            el.removeAttribute('stroke-width');
            Array.from(el.children||[]).forEach(ch=>stack.push(ch));
          }
        }
        g.appendChild(clone);
      });
      use.replaceWith(g);
    });
  }

  function port(id, side, offset=0){
    const n = TILE_POS[id];
    if(!n) return {x:0,y:0};
    const L = n.x;
    const T = n.y;
    const w = NODE_W;
    const h = NODE_H;
    if(side === 'left')   return {x:L,      y:T + h/2 + offset};
    if(side === 'right')  return {x:L + w,  y:T + h/2 + offset};
    if(side === 'top')    return {x:L + w/2 + offset, y:T};
    if(side === 'bottom') return {x:L + w/2 + offset, y:T + h};
    return {x:L + w/2, y:T + h/2};
  }

  function roundedPath(points, r){
    const pts = points.slice();
    if(pts.length < 2) return '';
    const R = Math.max(4, r);
    let d = `M ${pts[0].x},${pts[0].y}`;
    for(let i=1; i<pts.length; i++){
      const a = pts[i-1], b = pts[i], c = pts[i+1];
      if(!c){
        d += ` L ${b.x},${b.y}`;
        break;
      }
      const v1 = {x:b.x-a.x, y:b.y-a.y};
      const v2 = {x:c.x-b.x, y:c.y-b.y};
      const l1 = Math.hypot(v1.x,v1.y);
      const l2 = Math.hypot(v2.x,v2.y);
      const rr = Math.min(R, l1/2, l2/2);
      const pa = {x:b.x-(v1.x/l1)*rr, y:b.y-(v1.y/l1)*rr};
      const pb = {x:b.x+(v2.x/l2)*rr, y:b.y+(v2.y/l2)*rr};
      d += ` L ${pa.x},${pa.y} Q ${b.x},${b.y} ${pb.x},${pb.y}`;
    }
    return d;
  }

  function getSourceSide(from, to, mode){
    const f = TILE_POS[from];
    const t = TILE_POS[to];
    if(!f || !t) return 'right';
    if(mode === 'H' || mode === 'HVT') return (f.x <= t.x) ? 'right' : 'left';
    if(mode === 'V' || mode === 'VH')  return (f.y <= t.y) ? 'bottom' : 'top';
    return (f.y <= t.y) ? 'bottom' : 'top';
  }

  function pathH(from,to,srcSide,srcOffset){
    const A = port(from, srcSide, srcOffset);
    const f = TILE_POS[from], t = TILE_POS[to];
    const toLeft = (f.x <= t.x);
    const B = port(to, toLeft ? 'left' : 'right', 0);
    const y = A.y;
    return roundedPath([{x:A.x,y},{x:B.x,y}], CURVE_R);
  }

  function pathV(from,to,srcSide,srcOffset){
    const A = port(from, srcSide, srcOffset);
    const f = TILE_POS[from], t = TILE_POS[to];
    const B = port(to, (f.y <= t.y) ? 'top' : 'bottom', 0);
    return roundedPath([A,{x:A.x,y:B.y},B], CURVE_R);
  }

  function pathVH_lr(from,to,srcSide,srcOffset){
    const A = port(from, srcSide, srcOffset);
    const f = TILE_POS[from], t = TILE_POS[to];
    const B = port(to, (f.x <= t.x) ? 'left' : 'right', 0);
    const mid = {x:A.x,y:B.y};
    return roundedPath([A,mid,B], CURVE_R);
  }

  function pathHVT_tb(from,to,srcSide,srcOffset){
    const A = port(from, srcSide, srcOffset);
    const f = TILE_POS[from], t = TILE_POS[to];
    const B = port(to, (f.y <= t.y) ? 'top' : 'bottom', 0);
    const mid = {x:B.x,y:A.y};
    return roundedPath([A,mid,B], CURVE_R);
  }

  function mkGrad(id, colors){
    const lg = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    lg.id = id;
    lg.setAttribute('x1','0');
    lg.setAttribute('y1','0');
    lg.setAttribute('x2','1');
    lg.setAttribute('y2','1');
    const n = colors.length;
    colors.forEach((c,i)=>{
      const stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
      stop.setAttribute('offset', (i/(n-1))*100 + '%');
      stop.setAttribute('stop-color', c);
      lg.appendChild(stop);
    });
    return lg;
  }

  function paletteFor(group){
    return (group === 'me')
      ? ['#5fdede','#02c2cb','#009ed3','#0075dc','#0052e3']
      : (group === 'cu')
      ? ['#0b80ff','#206eff','#355cff','#5045ff','#682fff']
      : ['#eeacff','#db8cff','#c465ff','#a94aff','#8a4bff'];
  }

  function applyIconPalette(tileId, group, on){
    const ico = document.querySelector(`#${tileId} svg.ico`);
    if(!ico) return;
    const lg = ico.querySelector(`#ico-grad-${tileId}`);
    if(!lg) return;
    const stops = [...lg.querySelectorAll('stop')];
    if(on){
      const pal = paletteFor(group);
      stops.forEach((st,i)=>{
        const idx = Math.min(
          pal.length-1,
          Math.round(i*(pal.length-1)/(stops.length-1))
        );
        st.setAttribute('stop-color', pal[idx]);
      });
    }else{
      stops.forEach(st=>st.setAttribute('stop-color','#7f848c'));
    }
    if(on){
      ico.style.setProperty('--ico-stroke', `url(#ico-grad-${tileId})`);
    }else{
      ico.style.removeProperty('--ico-stroke');
    }
  }

  function setTileGradient(tileId, group, on){
    const tile = document.getElementById(tileId);
    if(!tile) return;
    tile.classList.remove('grad-me','grad-cu','grad-live');
    if(on){
      tile.classList.add(
        group === 'me' ? 'grad-me'
        : group === 'cu' ? 'grad-cu'
        : 'grad-live'
      );
    }
    applyIconPalette(tileId, group, on);
  }

  function clearSeq(){
    seqTimers.forEach(clearTimeout);
    seqTimers = [];
  }

  function clearAll(){
    document.querySelectorAll('.tile').forEach(t=>{
      t.classList.remove('is-sender','is-recipient','grad-me','grad-cu','grad-live');
      const ico = t.querySelector('svg.ico');
      if(ico){
        const lg = ico.querySelector('defs[data-kind="ico-grad"] linearGradient');
        if(lg){
          lg.querySelectorAll('stop').forEach(st=>{
            st.setAttribute('stop-color','#7f848c');
          });
        }
        ico.style.removeProperty('--ico-stroke');
      }
    });
    wiresMeta.forEach(w=>{
      w.el.classList.remove('show','active');
      w.el.style.strokeDashoffset = w.len;
      w.el.style.stroke = '';
    });
  }

  function prelightSender(step){
    const sEl = document.getElementById(step.sender);
    if(sEl){
      sEl.classList.add('is-sender');
      setTileGradient(step.sender, step.group, true);
    }
  }

  function runSequence(){
    clearSeq();
    clearAll();

    const STEP_SHOW_MS = 2200;
    const STEP_HIDE_MS = 450;
    const WIRE_REVEAL_MS = 450;
    const PREEMPT_FRACTION = 0.8;
    const LIFT_LEAD_MS = 300;

    const wireLookup = {};
    wiresMeta.forEach(w=>{
      wireLookup[w.from + '|' + w.to] = w;
    });

    function showWires(senderId, recips, group){
      recips.forEach(id=>{
        const w = wireLookup[senderId + '|' + id];
        if(!w) return;
        const p = w.el;
        const preemptDelay = Math.max(0, WIRE_REVEAL_MS * PREEMPT_FRACTION);

        p.classList.add('show','active');
        p.style.stroke = `url(#wire-grad-${group})`;
        void p.getBoundingClientRect();

        const preTimer = setTimeout(()=>{
          const rEl = document.getElementById(id);
          if(rEl){
            rEl.classList.add('is-recipient');
            setTileGradient(id, group, true);
          }
        }, preemptDelay);

        const fallback = setTimeout(()=>{
          const rEl = document.getElementById(id);
          if(rEl){
            rEl.classList.add('is-recipient');
            setTileGradient(id, group, true);
          }
        }, WIRE_REVEAL_MS + 50);

        p.style.strokeDashoffset = 0;
        p.addEventListener('transitionend', e=>{
          if(e.propertyName === 'stroke-dashoffset'){
            clearTimeout(preTimer);
            clearTimeout(fallback);
          }
        }, {once:true});
      });
    }

    function hideWires(senderId, recips){
      recips.forEach(id=>{
        const w = wiresMeta.find(x=>x.from===senderId && x.to===id);
        if(!w) return;
        const p = w.el;
        p.style.strokeDashoffset = w.len;
        setTimeout(()=>{
          p.classList.remove('show','active');
          p.style.stroke = '';
        }, STEP_HIDE_MS);
      });
    }

    let curIdx = 0;
    const first = SENDER_STEPS[curIdx];
    prelightSender(first);
    showWires(first.sender, first.recips, first.group);

    function scheduleFromCurrent(idx){
      const nextIdx = (idx + 1) % SENDER_STEPS.length;
      const cur = SENDER_STEPS[idx];
      const next = SENDER_STEPS[nextIdx];

      seqTimers.push(setTimeout(()=>{
        prelightSender(next);
      }, Math.max(0, STEP_SHOW_MS - LIFT_LEAD_MS)));

      seqTimers.push(setTimeout(()=>{
        hideWires(cur.sender, cur.recips);
        const sEl = document.getElementById(cur.sender);
        if(sEl){
          sEl.classList.remove('is-sender');
          setTileGradient(cur.sender, cur.group, false);
        }
        cur.recips.forEach(id=>{
          const rEl = document.getElementById(id);
          if(rEl){
            rEl.classList.remove('is-recipient');
            setTileGradient(id, cur.group, false);
          }
        });

        showWires(next.sender, next.recips, next.group);
        scheduleFromCurrent(nextIdx);
      }, STEP_SHOW_MS));
    }

    scheduleFromCurrent(curIdx);
  }

  function initDiagram(){
    const map = document.getElementById('ecoMap');
    if (!map) return;
    const svg = map.querySelector('svg.wires');

    map.style.width  = MAP_W + 'px';
    map.style.height = MAP_H + 'px';

    Object.entries(TILE_POS).forEach(([id,pos])=>{
      const el = document.getElementById(id);
      if(!el) return;
      el.style.left  = pos.x + 'px';
      el.style.top   = pos.y + 'px';
      el.style.width = NODE_W + 'px';
      el.style.height= NODE_H + 'px';

      const ico = el.querySelector('svg.ico');
      if(ico && !ico.querySelector('defs[data-kind="ico-grad"]')){
        const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
        defs.setAttribute('data-kind','ico-grad');
        const lg = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
        lg.id = `ico-grad-${id}`;
        lg.setAttribute('x1','0');
        lg.setAttribute('y1','0');
        lg.setAttribute('x2','1');
        lg.setAttribute('y2','1');
        [0,0.25,0.5,0.75,1].forEach(off=>{
          const st = document.createElementNS('http://www.w3.org/2000/svg','stop');
          st.setAttribute('offset', (off*100) + '%');
          st.setAttribute('stop-color','#7f848c');
          st.style.transition = 'stop-color .25s ease';
          lg.appendChild(st);
        });
        defs.appendChild(lg);
        ico.insertBefore(defs, ico.firstChild);
      }
    });

    svg.innerHTML = '';
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');

    const glow = document.createElementNS('http://www.w3.org/2000/svg','filter');
    glow.id = 'ecoGlow';
    const gBlur = document.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur');
    gBlur.setAttribute('stdDeviation','2.7569');
    const gMerge = document.createElementNS('http://www.w3.org/2000/svg','feMerge');
    const m1 = document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
    m1.setAttribute('in','SourceGraphic');
    const m2 = document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
    m2.setAttribute('in','SourceGraphic');
    gMerge.appendChild(m1);
    gMerge.appendChild(m2);
    glow.appendChild(gBlur);
    glow.appendChild(gMerge);
    defs.appendChild(glow);

    defs.appendChild(mkGrad('wire-grad-me',['#5fdede','#02c2cb','#009ed3','#0075dc','#0052e3']));
    defs.appendChild(mkGrad('wire-grad-cu',['#0b80ff','#206eff','#355cff','#5045ff','#682fff']));
    defs.appendChild(mkGrad('wire-grad-live',['#eeacff','#db8cff','#c465ff','#a94aff','#8a4bff']));
    svg.appendChild(defs);

    const gWires = document.createElementNS('http://www.w3.org/2000/svg','g');
    svg.appendChild(gWires);

    const preparedNonCurated = EDGES.map(([a,b,mode])=>({
      from:a,
      to:b,
      mode,
      side:getSourceSide(a,b,mode)
    }));

    const curatedRight = [
      {from:'t-curate', to:'t-outreach', mode:'HVT', side:'right', srcOffset:0}
    ];

    const curatedBottom = [
      {from:'t-curate', to:'t-qa',       mode:'V',   side:'bottom', srcOffset:0},
      {from:'t-curate', to:'t-seed',     mode:'VH',  side:'bottom', srcOffset:0},
      {from:'t-curate', to:'t-contract', mode:'VH',  side:'bottom', srcOffset:SRC_GAP}
    ];

    (function assignOffsets(list){
      const groupsBySide = {};
      list.forEach(e=>{
        const key = e.from + '|' + e.side;
        (groupsBySide[key] ||= []).push(e);
      });
      Object.values(groupsBySide).forEach(arr=>{
        const side = arr[0].side;
        if(side === 'left' || side === 'right'){
          arr.sort((e1,e2)=> TILE_POS[e1.to].y - TILE_POS[e2.to].y);
        }else{
          arr.sort((e1,e2)=> TILE_POS[e1.to].x - TILE_POS[e2.to].x);
        }
        const n = arr.length;
        const span = (n-1)*SRC_GAP;
        const start = -span/2;
        arr.forEach((e,i)=>{
          if (e.srcOffset === undefined){
            e.srcOffset = start + i*SRC_GAP;
          }
        });
      });
    })(preparedNonCurated);

    const preparedAll = preparedNonCurated.concat(curatedRight, curatedBottom);

    wiresMeta = [];
    preparedAll.forEach(({from,to,mode,side,srcOffset=0})=>{
      let d = '';

      if(from === 't-curate' && to === 't-qa'){
        const s = port('t-curate','bottom',0);
        const e = port('t-qa','top',0);
        d = `M ${s.x},${s.y} L ${e.x},${e.y}`;
      } else {
        if(mode === 'H')    d = pathH(from,to,side,srcOffset);
        else if(mode === 'V')   d = pathV(from,to,side,srcOffset);
        else if(mode === 'VH')  d = pathVH_lr(from,to,side,srcOffset);
        else if(mode === 'HVT') d = pathHVT_tb(from,to,side,srcOffset);
        else d = pathVH_lr(from,to,side,srcOffset);
      }

      const p = document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d', d);
      p.setAttribute('class','wire');
      gWires.appendChild(p);

      const L = p.getTotalLength ? p.getTotalLength() : 320;
      p.style.strokeDasharray = `${L} ${L}`;
      p.style.strokeDashoffset = L;
      wiresMeta.push({from,to,el:p,len:L});
    });

    const touchMap = {};
    Object.keys(TILE_POS).forEach(id=>touchMap[id]=[]);
    wiresMeta.forEach((w,i)=>{
      (touchMap[w.from]||[]).push(i);
      (touchMap[w.to]||[]).push(i);
    });
    Object.keys(TILE_POS).forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('mouseenter',()=>{
        (touchMap[id]||[]).forEach(i=>wiresMeta[i].el.classList.add('active'));
      });
      el.addEventListener('mouseleave',()=>{
        (touchMap[id]||[]).forEach(i=>wiresMeta[i].el.classList.remove('active'));
      });
    });

    svg.setAttribute('viewBox', `0 0 ${MAP_W} ${MAP_H}`);
    svg.setAttribute('width', MAP_W);
    svg.setAttribute('height', MAP_H);

    map.style.visibility = 'visible';

    runSequence();
  }

  function start() {
    ensureSprite().then(function () {
      inlineSpriteIcons();
      initDiagram();
    });
  }

  function boot() {
    const container = document.querySelector('[data-eco="instant-match"]');
    if (!container) return;
    injectStyles();
    injectMarkup(container);
    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();