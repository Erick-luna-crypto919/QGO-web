// Módulo Mapa

const GT_COORDS = {
  restaurante: [14.59859, -90.510683],
  cliente: [14.585671, -90.518528]
};

const DEFAULT_GUATEMALA_STREET_PATH = [
  [14.59859, -90.510683],
  [14.598548, -90.510702],
  [14.598019, -90.51079],
  [14.598076, -90.510925],
  [14.598162, -90.511128],
  [14.598176, -90.511162],
  [14.597509, -90.511234],
  [14.59718, -90.511271],
  [14.596135, -90.51139],
  [14.595354, -90.511478],
  [14.595166, -90.5115],
  [14.594751, -90.511547],
  [14.594588, -90.511565],
  [14.594475, -90.511578],
  [14.594239, -90.511606],
  [14.592629, -90.511801],
  [14.592524, -90.511817],
  [14.592228, -90.511847],
  [14.591674, -90.511914],
  [14.590975, -90.511983],
  [14.590779, -90.512042],
  [14.590207, -90.512213],
  [14.590013, -90.512271],
  [14.599933, -90.512295],
  [14.589575, -90.512403],
  [14.58953, -90.512421],
  [14.58909, -90.512594],
  [14.588849, -90.512688],
  [14.588802, -90.512732],
  [14.588788, -90.512765],
  [14.588783, -90.512793],
  [14.588807, -90.512864],
  [14.588851, -90.512979],
  [14.588926, -90.513174],
  [14.588935, -90.51322],
  [14.588933, -90.513237],
  [14.588931, -90.513262],
  [14.588916, -90.513301],
  [14.588887, -90.513332],
  [14.588847, -90.513373],
  [14.58761, -90.514148],
  [14.585283, -90.515604],
  [14.584902, -90.515843],
  [14.58488, -90.515856],
  [14.584763, -90.51593],
  [14.584529, -90.516074],
  [14.58446, -90.516126],
  [14.584435, -90.516142],
  [14.584427, -90.516164],
  [14.584443, -90.51619],
  [14.584475, -90.516239],
  [14.584505, -90.516287],
  [14.584642, -90.516503],
  [14.584808, -90.516766],
  [14.585048, -90.517139],
  [14.585154, -90.517311],
  [14.585185, -90.517392],
  [14.58521, -90.517433],
  [14.58552, -90.517917],
  [14.585755, -90.518285],
  [14.585683, -90.518327],
  [14.585677, -90.518331],
  [14.585667, -90.518344],
  [14.58566, -90.518363],
  [14.585662, -90.51839],
  [14.585703, -90.51847],
  [14.585706, -90.518488],
  [14.585705, -90.518503],
  [14.585671, -90.518528]
];

const GOOGLE_TILE_LAYERS = {
  streets: {
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    name: 'Google Maps Calles',
    attribution: '© Google Maps - Guatemala'
  },
  satellite: {
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    name: 'Google Maps Satélite Híbrido',
    attribution: '© Google Maps Satélite - Guatemala'
  },
  terrain: {
    url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    name: 'Google Maps Relieve y Terreno',
    attribution: '© Google Maps Terreno - Guatemala'
  }
};

let progressiveNavState = {
  isDriving: false,
  animFrameId: null,
  speedMultiplier: 1.0,
  orderId: null
};

let driverAnimFrame = null;

function initAddressPickerMap() {
  const state = window.QgoState;
  const container = document.getElementById('addressPickerMap');
  if (!container || typeof L === 'undefined') return;

  if (state.addressPickerMap) {
    state.addressPickerMap.remove();
    state.addressPickerMap = null;
  }

  const startCoords = state.tempPickerCoords || state.clientHomeCoords || [14.585671, -90.518528];
  const map = L.map('addressPickerMap').setView(startCoords, 14);
  state.addressPickerMap = map;

  L.tileLayer(GOOGLE_TILE_LAYERS.streets.url, {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '© Google Maps'
  }).addTo(map);

  const iconHome = L.divIcon({
    html: '<div style="background:#00A86B; color:white; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 4px 14px rgba(0,168,107,0.5); border:3px solid white; cursor:grab;">🏠</div>',
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  const marker = L.marker(startCoords, {
    draggable: true,
    icon: iconHome
  }).addTo(map);
  state.addressPickerMarker = marker;

  const badgeCoords = document.getElementById('pinCoordsBadge');
  const inputCustom = document.getElementById('customAddressInput');

  function onLocationChanged(lat, lng) {
    state.tempPickerCoords = [lat, lng];
    if (badgeCoords) badgeCoords.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const zoneName = detectGuatemalaZone(lat, lng);
    if (inputCustom) {
      inputCustom.value = `${zoneName}`;
    }
  }

  marker.on('dragend', (e) => {
    const pos = e.target.getLatLng();
    onLocationChanged(pos.lat, pos.lng);
  });

  map.on('click', (e) => {
    marker.setLatLng(e.latlng);
    onLocationChanged(e.latlng.lat, e.latlng.lng);
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 150);
}

function detectGuatemalaZone(lat, lng) {
  if (typeof detectLocalityFromCoords === 'function') {
    const loc = detectLocalityFromCoords(lat, lng);
    if (loc && loc.zoneName) return loc.zoneName;
  }
  return 'Ciudad de Guatemala';
}

function checkInitialOrder() {
  const state = window.QgoState;
  if (state.currentUser && state.currentUser.rol === 'CLIENTE') {
    const myOrders = (typeof getClientOrders === 'function') ? getClientOrders(state.currentUser) : [];
    state.activeOrderForTracking = myOrders.length > 0 ? myOrders[0] : null;
  } else {
    const orders = QgoAPI.getOrders();
    state.activeOrderForTracking = orders.length > 0 ? orders[0] : null;
  }
}

function openTrackingView(order, updateHash = true) {
  if (!order) return;
  const state = window.QgoState;
  state.activeOrderForTracking = order;
  state.currentView = 'tracking';
  if (updateHash && window.location.hash !== `#tracking/${order.id}`) {
    window.location.hash = `#tracking/${order.id}`;
  }
  sessionStorage.setItem('qgo_current_hash', `#tracking/${order.id}`);

  if (state.currentUser && state.currentUser.rol === 'ADMINISTRADOR') {
    const vAdmin = document.getElementById('viewAdmin');
    const vClient = document.getElementById('viewClient');
    if (vAdmin) vAdmin.style.display = 'none';
    if (vClient) vClient.style.display = 'block';
  }

  const clientHome = document.getElementById('clientHomeSection');
  const clientRest = document.getElementById('clientRestaurantSection');
  const clientTrack = document.getElementById('clientTrackingSection');
  if (clientHome) clientHome.style.display = 'none';
  if (clientRest) clientRest.style.display = 'none';
  if (clientTrack) clientTrack.style.display = 'block';

  renderTrackingView(order);
  setTimeout(() => {
    initTrackingMap(order);
  }, 150);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTrackingView(order) {
  const state = window.QgoState;
  const orderIdEl = document.getElementById('trackOrderId');
  const restNameEl = document.getElementById('trackRestName');
  const timeEl = document.getElementById('trackTimeEstimate');
  if (orderIdEl) orderIdEl.textContent = order.id;
  if (restNameEl) restNameEl.textContent = order.restaurante ? order.restaurante.name : 'Restaurante';
  if (timeEl) timeEl.textContent = `Llegada aprox. en ${order.tiempoEstimadoMinutos || 15} min`;

  const branchBadge = document.getElementById('trackBranchBadge');
  const branchNameEl = document.getElementById('trackBranchName');
  if (branchNameEl && order.sucursal) {
    branchNameEl.textContent = `${order.sucursal.name} (${order.sucursal.distanceKm ? order.sucursal.distanceKm + ' km' : 'Cercana'})`;
    if (branchBadge) branchBadge.style.display = 'inline-flex';
  } else if (branchBadge) {
    branchBadge.style.display = 'none';
  }

  const driverNameEl = document.getElementById('trackDriverName');
  const driverVehEl = document.getElementById('trackDriverVehicle');
  const driverRatingEl = document.getElementById('trackDriverRating');
  if (driverNameEl) driverNameEl.textContent = order.repartidor ? order.repartidor.nombre : 'Repartidor Qgo';
  if (driverVehEl) driverVehEl.textContent = order.repartidor ? order.repartidor.vehiculo : 'Motocicleta';
  if (driverRatingEl) driverRatingEl.textContent = `★ ${order.repartidor ? order.repartidor.calificacion : 4.9} (340+ entregas)`;

  const btnChat = document.getElementById('btnChatDriver');
  if (btnChat) {
    btnChat.onclick = () => {
      const destZone = order.cliente && order.cliente.direccion ? order.cliente.direccion.split(',')[0] : 'tu dirección';
      const branchName = order.sucursal ? order.sucursal.name : 'el restaurante';
      alert(`Erick Morales dice: ¡Hola! Ya recogí tu comida en ${branchName}. Voy en camino hacia ${destZone}, llego en aproximadamente ${order.tiempoEstimadoMinutos || 15} minutos.`);
    };
  }

  const btnCall = document.getElementById('btnCallDriver');
  if (btnCall) {
    btnCall.onclick = () => {
      alert('Llamando a Erick Morales (Repartidor Qgo: +502 4444-9988)...');
    };
  }

  updateStepperProgress(order.estado);

  const itemsListEl = document.getElementById('trackOrderItemsList');
  if (itemsListEl && order.items) {
    itemsListEl.innerHTML = order.items.map(item => `
      <div style="display:flex; justify-content:space-between; font-size:0.88rem; padding:6px 0; border-bottom:1px solid var(--border-subtle);">
        <span>${item.quantity}x ${escapeHTML(item.name)}</span>
        <span style="font-weight:700;">Q${item.price * item.quantity}</span>
      </div>
    `).join('') + `
      <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.05rem; margin-top:10px;">
        <span>Total Pagado (${escapeHTML(order.metodoPago || 'Efectivo')}):</span>
        <span style="color:var(--primary);">Q${order.total}</span>
      </div>
    `;
  }

  const btnStartProg = document.getElementById('btnStartProgressiveRoute');
  if (btnStartProg) {
    btnStartProg.onclick = () => {
      startProgressiveRouteNavigation(order);
    };
  }

  const btnSpeed = document.getElementById('btnToggleSpeed');
  if (btnSpeed) {
    btnSpeed.onclick = () => {
      if (progressiveNavState.speedMultiplier === 1.0) {
        progressiveNavState.speedMultiplier = 2.5;
        btnSpeed.textContent = '⚡ Vel: 2.5x';
        btnSpeed.style.background = '#ffde59';
        btnSpeed.style.color = '#713F12';
      } else {
        progressiveNavState.speedMultiplier = 1.0;
        btnSpeed.textContent = '⚡ Vel: 1x';
        btnSpeed.style.background = 'rgba(255,255,255,0.22)';
        btnSpeed.style.color = 'white';
      }
    };
  }

  const btnDeliver = document.getElementById('btnDeliverNow');
  if (btnDeliver) {
    btnDeliver.onclick = () => {
      finishOrderDelivery(order);
    };
  }

  const autoSimBtn = document.getElementById('btnAutoSimulate');
  if (autoSimBtn) {
    autoSimBtn.onclick = () => {
      startProgressiveRouteNavigation(order);
    };
  }

  const btnStep = document.getElementById('btnSimulateStep');
  if (btnStep) {
    btnStep.onclick = () => {
      startProgressiveRouteNavigation(order);
    };
  }

  const initialPct = typeof order.posicionRepartidorPct === 'number' ? order.posicionRepartidorPct : 0;
  updateTrackingProgressUI(initialPct, order.tiempoEstimadoMinutos || 15);
  updateProgressiveControlsUI(progressiveNavState.isDriving && progressiveNavState.orderId === order.id);

  const reorderContainer = document.getElementById('reorderActionContainer');
  if (reorderContainer) {
    if (order.estado === 'ENTREGADO') {
      reorderContainer.style.display = 'block';
      const reorderBtn = document.getElementById('btnReorderOrder');
      if (reorderBtn) {
        reorderBtn.onclick = () => {
          const rest = getStoredRestaurants().find(r => r.name === order.restaurante.name || r.id === order.restaurante.id) || getStoredRestaurants()[0];
          state.cart.restaurantId = rest.id;
          state.cart.restaurantName = rest.name;
          state.cart.items = order.items.map(it => ({ ...it }));
          if (typeof updateCartUI === 'function') updateCartUI();
          if (typeof updateSidebarCartUI === 'function') updateSidebarCartUI();
          if (typeof updateMobileCartBar === 'function') updateMobileCartBar();
          showToast('¡Platillos agregados nuevamente a tu canasta!', 'success');
          if (typeof openRestaurantView === 'function') openRestaurantView(rest.id);
        };
      }
    } else {
      reorderContainer.style.display = 'none';
    }
  }

  const btnBack = document.getElementById('btnBackFromTracking');
  if (btnBack) {
    btnBack.onclick = () => {
      pauseProgressiveRouteNavigation();
      if (state.currentUser && state.currentUser.rol === 'ADMINISTRADOR') {
        window.location.hash = '#admin';
        if (typeof handleRoute === 'function') handleRoute();
        return;
      }
      if (typeof showClientHome === 'function') showClientHome();
    };
  }
}

function updateStepperProgress(estado) {
  const steps = [
    { id: 'step-1', name: 'CONFIRMADO', pct: '5%' },
    { id: 'step-2', name: 'EN_PREPARACION', pct: '38%' },
    { id: 'step-3', name: 'EN_CAMINO', pct: '70%' },
    { id: 'step-4', name: 'ENTREGADO', pct: '100%' }
  ];

  const fillBar = document.getElementById('stepperProgressFill');
  const stepNodes = document.querySelectorAll('.step-node');

  let currentIdx = steps.findIndex(s => s.name === estado);
  if (currentIdx === -1) currentIdx = 0;

  if (fillBar) fillBar.style.width = steps[currentIdx].pct;

  if (estado === 'ENTREGADO') {
    stepNodes.forEach((node) => {
      node.classList.remove('active');
      node.classList.add('completed');
    });
  } else {
    stepNodes.forEach((node, idx) => {
      node.classList.remove('completed', 'active');
      if (idx < currentIdx) {
        node.classList.add('completed');
      } else if (idx === currentIdx) {
        node.classList.add('active');
      }
    });
  }

  const stepImagesConfig = [
    { id: 'stepImg1', base: 'css/WEB/1.jpeg', done: 'css/WEB/1.1.jpeg' },
    { id: 'stepImg2', base: 'css/WEB/2.jpeg', done: 'css/WEB/2.1.jpeg' },
    { id: 'stepImg3', base: 'css/WEB/3.jpeg', done: 'css/WEB/3.1.jpeg' },
    { id: 'stepImg4', base: 'css/WEB/4.jpeg', done: 'css/WEB/4.1.jpeg' }
  ];

  stepImagesConfig.forEach((cfg, idx) => {
    const img = document.getElementById(cfg.id);
    const node = document.getElementById(`stepNode${idx + 1}`);
    if (img && node) {
      const isCompleted = node.classList.contains('completed');
      img.src = isCompleted ? cfg.done : cfg.base;
    }
  });

  const headline = document.getElementById('trackingHeadline');
  if (headline) {
    if (estado === 'CONFIRMADO') {
      headline.textContent = 'Pedido confirmado por el restaurante';
    } else if (estado === 'EN_PREPARACION') {
      headline.textContent = 'El local está preparando tu orden 👨‍🍳';
    } else if (estado === 'EN_CAMINO') {
      headline.textContent = '¡El repartidor va en camino con tu comida! 🛵';
    } else if (estado === 'ENTREGADO') {
      headline.textContent = '¡Pedido entregado! Buen provecho 🎉';
    }
  }
}

function startProgressiveRouteNavigation(order) {
  if (!order) return;
  const state = window.QgoState;

  if (progressiveNavState.isDriving && progressiveNavState.orderId === order.id) {
    pauseProgressiveRouteNavigation();
    return;
  }

  progressiveNavState.isDriving = true;
  progressiveNavState.orderId = order.id;

  if (order.estado !== 'EN_CAMINO' && order.estado !== 'ENTREGADO') {
    order.estado = 'EN_CAMINO';
    order.posicionRepartidorPct = Math.max(5, order.posicionRepartidorPct || 5);
    order.tiempoEstimadoMinutos = order.tiempoEstimadoMinutos || 15;
    QgoAPI.updateOrderStatus(order.id, 'EN_CAMINO', {
      posicionRepartidorPct: order.posicionRepartidorPct,
      tiempoEstimadoMinutos: order.tiempoEstimadoMinutos
    });
    updateStepperProgress('EN_CAMINO');
  }

  let currentPct = typeof state.currentDriverPct === 'number' && state.currentDriverPct < 100
    ? state.currentDriverPct
    : (order.posicionRepartidorPct || 0);

  if (currentPct >= 100) currentPct = 0;
  state.currentDriverPct = currentPct;

  let lastTime = performance.now();
  const baseSpeed = 4.0;

  updateProgressiveControlsUI(true);
  showToast('🛵 Repartidor en ruta: avanzando progresivamente por las calles...', 'success');

  function step(now) {
    if (!progressiveNavState.isDriving) return;

    const deltaSec = (now - lastTime) / 1000;
    lastTime = now;

    const increment = baseSpeed * progressiveNavState.speedMultiplier * deltaSec;
    currentPct = Math.min(100, currentPct + increment);
    state.currentDriverPct = currentPct;

    updateDriverPosition(currentPct);

    const remainingMins = Math.max(1, Math.round(15 * (1 - (currentPct / 100))));
    updateTrackingProgressUI(currentPct, remainingMins);

    if (Math.round(currentPct) % 4 === 0 && Math.round(currentPct) !== order.posicionRepartidorPct) {
      order.posicionRepartidorPct = Math.round(currentPct);
      order.tiempoEstimadoMinutos = remainingMins;
      QgoAPI.updateOrderStatus(order.id, 'EN_CAMINO', {
        posicionRepartidorPct: Math.round(currentPct),
        tiempoEstimadoMinutos: remainingMins
      });
    }

    if (currentPct < 100) {
      progressiveNavState.animFrameId = requestAnimationFrame(step);
    } else {
      progressiveNavState.isDriving = false;
      updateProgressiveControlsUI(false);
      finishOrderDelivery(order);
    }
  }

  progressiveNavState.animFrameId = requestAnimationFrame(step);
}

function pauseProgressiveRouteNavigation() {
  progressiveNavState.isDriving = false;
  if (progressiveNavState.animFrameId) {
    cancelAnimationFrame(progressiveNavState.animFrameId);
    progressiveNavState.animFrameId = null;
  }
  updateProgressiveControlsUI(false);
  showToast('Recorrido GPS en pausa', 'info');
}

function finishOrderDelivery(order) {
  const state = window.QgoState;
  if (progressiveNavState.animFrameId) {
    cancelAnimationFrame(progressiveNavState.animFrameId);
    progressiveNavState.animFrameId = null;
  }
  progressiveNavState.isDriving = false;
  state.currentDriverPct = 100;
  updateDriverPosition(100);
  updateTrackingProgressUI(100, 0);

  order.estado = 'ENTREGADO';
  order.posicionRepartidorPct = 100;
  order.tiempoEstimadoMinutos = 0;

  QgoAPI.updateOrderStatus(order.id, 'ENTREGADO', {
    posicionRepartidorPct: 100,
    tiempoEstimadoMinutos: 0
  });

  playNotificationSound();
  showToast(`🎉 ¡El repartidor ha llegado! Pedido ${order.id} entregado con éxito a tu puerta.`, 'success');
  renderTrackingView(order);
}

function updateProgressiveControlsUI(isDriving) {
  const textEl = document.getElementById('btnStartProgressiveText');
  const btnStart = document.getElementById('btnStartProgressiveRoute');
  if (textEl) {
    textEl.textContent = isDriving ? 'Pausar Recorrido' : 'Iniciar Recorrido en Vivo';
  }
  if (btnStart) {
    if (isDriving) {
      btnStart.style.background = '#FEF3C7';
      btnStart.style.color = '#B45309';
    } else {
      btnStart.style.background = 'white';
      btnStart.style.color = '#14532D';
    }
  }
}

function updateTrackingProgressUI(pct, mins) {
  const pctEl = document.getElementById('trackingGpsLivePct');
  const barEl = document.getElementById('trackingGpsProgressBar');
  const timeEl = document.getElementById('trackTimeEstimate');

  if (pctEl) pctEl.textContent = `${Math.round(pct)}% en ruta`;
  if (barEl) barEl.style.width = `${pct}%`;
  if (timeEl) {
    if (pct >= 100) {
      timeEl.textContent = '¡Llegó a tu puerta!';
    } else {
      timeEl.textContent = `Llegada aprox. en ${mins} min (${Math.round(pct)}% completado)`;
    }
  }
}

function simulateNextOrderStatus(order) {
  startProgressiveRouteNavigation(order);
}

async function fetchRealStreetRoute(originCoord, destinationCoord) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originCoord[1]},${originCoord[0]};${destinationCoord[1]},${destinationCoord[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(p => [p[1], p[0]]);
        if (coords.length > 5) return coords;
      }
    }
  } catch (e) {
    console.warn('OSRM no disponible en vivo, usando cartografía vial local de Guatemala:', e);
  }

  if (Math.abs(originCoord[0] - GT_COORDS.restaurante[0]) < 0.005 && Math.abs(destinationCoord[0] - GT_COORDS.cliente[0]) < 0.005) {
    return DEFAULT_GUATEMALA_STREET_PATH;
  }

  const fallbackPath = [];
  const steps = 25;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    fallbackPath.push([
      originCoord[0] + (destinationCoord[0] - originCoord[0]) * t,
      originCoord[1] + (destinationCoord[1] - originCoord[1]) * t
    ]);
  }
  return fallbackPath;
}

function initGoogleMapsControls() {
  const state = window.QgoState;
  const btnStreets = document.getElementById('btnLayerStreets');
  const btnSat = document.getElementById('btnLayerSat');
  const btnTerrain = document.getElementById('btnLayerTerrain');
  const btnOpenConfig = document.getElementById('btnOpenMapConfig');
  const modalConfig = document.getElementById('googleMapsModal');
  const btnCloseConfig = document.getElementById('btnCloseGoogleMapsModal');
  const btnCancelConfig = document.getElementById('btnCancelMapModal');
  const btnApplyConfig = document.getElementById('btnApplyMapSettings');
  const radioDirect = document.getElementById('radioMapDirect');
  const radioSdk = document.getElementById('radioMapSdk');
  const apiKeyContainer = document.getElementById('googleApiKeyContainer');
  const inputApiKey = document.getElementById('inputGoogleApiKey');
  const btnSaveApiKey = document.getElementById('btnSaveGoogleApiKey');
  const lblDirect = document.getElementById('lblModeDirect');
  const lblSdk = document.getElementById('lblModeSdk');

  if (inputApiKey && state.googleApiKey) {
    inputApiKey.value = state.googleApiKey;
  }

  if (state.mapMode === 'sdk' && radioSdk) {
    radioSdk.checked = true;
    if (apiKeyContainer) apiKeyContainer.style.display = 'block';
    if (lblSdk) {
      lblSdk.style.border = '2px solid var(--primary)';
      lblSdk.style.background = '#FFF5F7';
    }
    if (lblDirect) {
      lblDirect.style.border = '1px solid var(--border-subtle)';
      lblDirect.style.background = 'white';
    }
  }

  updateMapBadge();

  if (btnStreets) btnStreets.onclick = () => switchMapLayer('streets');
  if (btnSat) btnSat.onclick = () => switchMapLayer('satellite');
  if (btnTerrain) btnTerrain.onclick = () => switchMapLayer('terrain');

  if (btnOpenConfig && modalConfig) {
    btnOpenConfig.onclick = () => modalConfig.classList.add('active');
  }
  if (btnCloseConfig && modalConfig) {
    btnCloseConfig.onclick = () => modalConfig.classList.remove('active');
  }
  if (btnCancelConfig && modalConfig) {
    btnCancelConfig.onclick = () => modalConfig.classList.remove('active');
  }
  if (modalConfig) {
    modalConfig.onclick = (e) => {
      if (e.target === modalConfig) modalConfig.classList.remove('active');
    };
  }

  if (radioDirect && radioSdk) {
    radioDirect.onchange = () => {
      if (radioDirect.checked) {
        if (apiKeyContainer) apiKeyContainer.style.display = 'none';
        if (lblDirect) {
          lblDirect.style.border = '2px solid var(--primary)';
          lblDirect.style.background = '#FFF5F7';
        }
        if (lblSdk) {
          lblSdk.style.border = '1px solid var(--border-subtle)';
          lblSdk.style.background = 'white';
        }
      }
    };

    radioSdk.onchange = () => {
      if (radioSdk.checked) {
        if (apiKeyContainer) apiKeyContainer.style.display = 'block';
        if (lblSdk) {
          lblSdk.style.border = '2px solid var(--primary)';
          lblSdk.style.background = '#FFF5F7';
        }
        if (lblDirect) {
          lblDirect.style.border = '1px solid var(--border-subtle)';
          lblDirect.style.background = 'white';
        }
      }
    };
  }

  if (btnSaveApiKey && inputApiKey) {
    btnSaveApiKey.onclick = () => {
      const key = inputApiKey.value.trim();
      if (!key) {
        showToast('Ingresa una API Key válida de Google Cloud', 'error');
        return;
      }
      state.googleApiKey = key;
      localStorage.setItem('qgo_google_maps_api_key', key);
      showToast('Google Maps API Key guardada exitosamente', 'success');
    };
  }

  if (btnApplyConfig && modalConfig) {
    btnApplyConfig.onclick = async () => {
      const isSdk = radioSdk && radioSdk.checked;
      if (isSdk) {
        const key = inputApiKey ? inputApiKey.value.trim() : '';
        if (!key) {
          showToast('Para usar el SDK nativo, ingresa tu Google Cloud API Key', 'error');
          return;
        }
        state.googleApiKey = key;
        localStorage.setItem('qgo_google_maps_api_key', key);
        state.mapMode = 'sdk';
        localStorage.setItem('qgo_map_mode', 'sdk');
      } else {
        state.mapMode = 'direct';
        localStorage.setItem('qgo_map_mode', 'direct');
      }

      modalConfig.classList.remove('active');
      updateMapBadge();

      if (state.activeOrderForTracking) {
        await initTrackingMap(state.activeOrderForTracking);
      }
      showToast(`Mapa actualizado: ${state.mapMode === 'sdk' ? 'Google Maps SDK Oficial' : 'Google Maps Directo'}`, 'success');
    };
  }
}

function updateMapBadge() {
  const state = window.QgoState;
  const badge = document.getElementById('badgeMapMode');
  if (!badge) return;
  if (state.mapMode === 'sdk') {
    badge.textContent = 'SDK Oficial ($200 Gratis)';
    badge.style.background = '#E8F0FE';
    badge.style.color = '#1A73E8';
  } else {
    badge.textContent = 'Directo Gratis';
    badge.style.background = '#E6F4EA';
    badge.style.color = '#137333';
  }
}

function switchMapLayer(layerName) {
  const state = window.QgoState;
  if (!GOOGLE_TILE_LAYERS[layerName]) return;
  state.mapLayer = layerName;

  document.querySelectorAll('.btn-layer-toggle').forEach(btn => btn.classList.remove('active'));
  if (layerName === 'streets') document.getElementById('btnLayerStreets')?.classList.add('active');
  if (layerName === 'satellite') document.getElementById('btnLayerSat')?.classList.add('active');
  if (layerName === 'terrain') document.getElementById('btnLayerTerrain')?.classList.add('active');

  if (state.mapMode === 'direct' && state.leafletMap) {
    if (state.leafletTileLayer) {
      state.leafletMap.removeLayer(state.leafletTileLayer);
    }
    const layerConfig = GOOGLE_TILE_LAYERS[layerName];
    state.leafletTileLayer = L.tileLayer(layerConfig.url, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: layerConfig.attribution
    }).addTo(state.leafletMap);
  } else if (state.mapMode === 'sdk' && state.googleMap) {
    let gMapTypeId = 'roadmap';
    if (layerName === 'satellite') gMapTypeId = 'hybrid';
    if (layerName === 'terrain') gMapTypeId = 'terrain';
    state.googleMap.setMapTypeId(gMapTypeId);
  }

  showToast(`Capa cambiada a: ${GOOGLE_TILE_LAYERS[layerName].name}`, 'info');
}

async function initTrackingMap(order) {
  if (!order) return;
  const state = window.QgoState;

  if (state.mapMode === 'sdk' && state.googleApiKey) {
    try {
      await initGoogleMapsSdk(order);
      return;
    } catch (err) {
      console.warn('Fallo al inicializar Google Maps SDK. Alternando a Google Maps Directo:', err);
      showToast('No se pudo inicializar la API Key de Google. Usando Google Maps Directo Gratis.', 'error');
      state.mapMode = 'direct';
      updateMapBadge();
    }
  }

  await initGoogleDirectMap(order);
}

async function initGoogleDirectMap(order) {
  const state = window.QgoState;
  const leafletContainer = document.getElementById('leafletMapContainer');
  const sdkContainer = document.getElementById('googleMapsSdkContainer');

  if (leafletContainer) leafletContainer.style.display = 'block';
  if (sdkContainer) sdkContainer.style.display = 'none';

  if (!leafletContainer || typeof L === 'undefined') return;

  if (state.leafletMap) {
    state.leafletMap.remove();
    state.leafletMap = null;
  }

  const originCoords = (order.sucursal && order.sucursal.coords) ? order.sucursal.coords : GT_COORDS.restaurante;
  const destCoords = (order.clienteCoords && order.clienteCoords.length === 2) ? order.clienteCoords : (state.clientHomeCoords || GT_COORDS.cliente);

  state.activeRoutePoints = await fetchRealStreetRoute(originCoords, destCoords);

  const centerLat = (originCoords[0] + destCoords[0]) / 2;
  const centerLng = (originCoords[1] + destCoords[1]) / 2;
  const map = L.map('leafletMapContainer').setView([centerLat, centerLng], 14);
  state.leafletMap = map;

  const activeLayerConfig = GOOGLE_TILE_LAYERS[state.mapLayer || 'streets'];
  state.leafletTileLayer = L.tileLayer(activeLayerConfig.url, {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: activeLayerConfig.attribution
  }).addTo(map);

  const iconRest = L.divIcon({
    html: '<div style="background:#15803D; color:white; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 4px 12px rgba(0,0,0,0.3); border:2.5px solid white;">🍗</div>',
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  const branchLabel = order.sucursal ? order.sucursal.name : order.restaurante.name;
  const branchAddr = order.sucursal ? order.sucursal.address : (order.restaurante.address || 'Guatemala');

  L.marker(originCoords, { icon: iconRest })
    .addTo(map)
    .bindPopup(`<b>${order.restaurante.name}</b><br>📍 ${branchLabel}<br><small>${branchAddr}</small>`)
    .openPopup();

  const iconClient = L.divIcon({
    html: '<div style="background:#E31837; color:white; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 0 6px rgba(227,24,55,0.25), 0 6px 16px rgba(0,0,0,0.25); border:3px solid white; animation:deliveryRadarPulse 2s infinite;">🏠</div>',
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  L.marker(destCoords, { icon: iconClient })
    .addTo(map)
    .bindPopup(`<b>Tu Domicilio</b><br>${order.cliente ? order.cliente.direccion : 'Guatemala'}`);

  state.routeLine = L.polyline(state.activeRoutePoints, {
    color: '#02a54b',
    weight: 6,
    opacity: 0.95,
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(map);

  const iconDriver = L.divIcon({
    html: '<div style="background:linear-gradient(135deg, #02a54b 0%, #15803D 100%); color:white; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:23px; border:3px solid white; box-shadow:0 4px 16px rgba(2,165,75,0.5); animation:pulseBikeMarker 1.8s infinite;">🛵</div>',
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  const initPct = typeof order.posicionRepartidorPct === 'number' ? order.posicionRepartidorPct : 0;
  state.currentDriverPct = initPct;
  const initDriverCoord = getInterpolatedCoordinate(initPct);
  state.driverMarker = L.marker(initDriverCoord, { icon: iconDriver })
    .addTo(map)
    .bindPopup('<b>Erick Morales (Repartidor)</b><br>Moto Pulsar NS 200 • Siguiendo calles');

  map.fitBounds(state.routeLine.getBounds(), { padding: [40, 40] });
}

function loadGoogleMapsSdkScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      return resolve(window.google.maps);
    }
    const existingScript = document.getElementById('googleMapsApiScript');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'googleMapsApiScript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Error al cargar la librería de Google Maps'));
    document.head.appendChild(script);
  });
}

async function initGoogleMapsSdk(order) {
  const state = window.QgoState;
  await loadGoogleMapsSdkScript(state.googleApiKey);

  const leafletContainer = document.getElementById('leafletMapContainer');
  const sdkContainer = document.getElementById('googleMapsSdkContainer');

  if (leafletContainer) leafletContainer.style.display = 'none';
  if (sdkContainer) sdkContainer.style.display = 'block';

  const originCoords = (order.sucursal && order.sucursal.coords) ? order.sucursal.coords : GT_COORDS.restaurante;
  const destCoords = (order.clienteCoords && order.clienteCoords.length === 2) ? order.clienteCoords : (state.clientHomeCoords || GT_COORDS.cliente);

  state.activeRoutePoints = await fetchRealStreetRoute(originCoords, destCoords);

  let gMapTypeId = google.maps.MapTypeId.ROADMAP;
  if (state.mapLayer === 'satellite') gMapTypeId = google.maps.MapTypeId.HYBRID;
  if (state.mapLayer === 'terrain') gMapTypeId = google.maps.MapTypeId.TERRAIN;

  const centerLat = (originCoords[0] + destCoords[0]) / 2;
  const centerLng = (originCoords[1] + destCoords[1]) / 2;

  const map = new google.maps.Map(sdkContainer, {
    center: { lat: centerLat, lng: centerLng },
    zoom: 14,
    mapTypeId: gMapTypeId,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });
  state.googleMap = map;

  new google.maps.Marker({
    position: { lat: originCoords[0], lng: originCoords[1] },
    map: map,
    title: order.sucursal ? order.sucursal.name : order.restaurante.name,
    label: '🍗'
  });

  new google.maps.Marker({
    position: { lat: destCoords[0], lng: destCoords[1] },
    map: map,
    title: 'Tu Domicilio',
    label: '🏠'
  });

  const path = state.activeRoutePoints.map(p => ({ lat: p[0], lng: p[1] }));
  state.googleRouteLine = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#02a54b',
    strokeOpacity: 0.95,
    strokeWeight: 6,
    map: map
  });

  const initPct = typeof order.posicionRepartidorPct === 'number' ? order.posicionRepartidorPct : 0;
  state.currentDriverPct = initPct;
  const coord = getInterpolatedCoordinate(initPct);
  state.googleDriverMarker = new google.maps.Marker({
    position: { lat: coord[0], lng: coord[1] },
    map: map,
    title: 'Erick Morales (Repartidor Qgo)',
    label: '🛵'
  });

  const bounds = new google.maps.LatLngBounds();
  path.forEach(p => bounds.extend(p));
  map.fitBounds(bounds);
}

function getInterpolatedCoordinate(pct) {
  const state = window.QgoState;
  const pts = state.activeRoutePoints && state.activeRoutePoints.length > 1
    ? state.activeRoutePoints
    : DEFAULT_GUATEMALA_STREET_PATH;

  if (!pts || pts.length === 0) return [14.59859, -90.510683];
  if (pts.length === 1 || pct <= 0) return pts[0];
  if (pct >= 100) return pts[pts.length - 1];

  const dists = [0];
  for (let i = 0; i < pts.length - 1; i++) {
    const dLat = pts[i + 1][0] - pts[i][0];
    const dLng = pts[i + 1][1] - pts[i][1];
    dists.push(dists[i] + Math.hypot(dLat, dLng));
  }

  const totalDist = dists[dists.length - 1];
  const targetDist = (Math.max(0, Math.min(100, pct)) / 100) * totalDist;

  for (let i = 0; i < dists.length - 1; i++) {
    if (targetDist >= dists[i] && targetDist <= dists[i + 1]) {
      const segLen = dists[i + 1] - dists[i];
      const factor = segLen === 0 ? 0 : (targetDist - dists[i]) / segLen;
      const lat = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * factor;
      const lng = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * factor;
      return [lat, lng];
    }
  }

  return pts[pts.length - 1];
}

function updateDriverPosition(pct) {
  const state = window.QgoState;
  const newCoord = getInterpolatedCoordinate(pct);
  if (state.mapMode === 'sdk' && state.googleDriverMarker) {
    state.googleDriverMarker.setPosition({ lat: newCoord[0], lng: newCoord[1] });
  } else if (state.driverMarker && state.leafletMap) {
    state.driverMarker.setLatLng(newCoord);
  }
}

function animateDriverTo(targetPct, duration = 1600) {
  const state = window.QgoState;
  if (driverAnimFrame) cancelAnimationFrame(driverAnimFrame);
  const startPct = typeof state.currentDriverPct === 'number' ? state.currentDriverPct : 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const curPct = startPct + (targetPct - startPct) * ease;
    state.currentDriverPct = curPct;
    updateDriverPosition(curPct);

    if (progress < 1) {
      driverAnimFrame = requestAnimationFrame(step);
    } else {
      state.currentDriverPct = targetPct;
      updateDriverPosition(targetPct);
    }
  }

  driverAnimFrame = requestAnimationFrame(step);
}
