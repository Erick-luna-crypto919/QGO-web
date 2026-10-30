// Módulo Estado y Utilidades

window.QgoState = {
  currentUser: null,
  currentView: 'home',
  selectedRestaurant: null,
  selectedCategory: 'all',
  selectedFilter: 'all',
  searchQuery: '',
  cart: {
    restaurantId: null,
    restaurantName: null,
    items: [],
    tipPercentage: 10,
    deliveryFee: 0,
    serviceFee: 5
  },
  activeOrderForTracking: null,
  modalProduct: null,
  modalProductQuantity: 1,
  modalSelectedOption: null,
  leafletMap: null,
  leafletTileLayer: null,
  driverMarker: null,
  routeLine: null,
  mapMode: localStorage.getItem('qgo_map_mode') || 'direct',
  mapLayer: 'streets',
  googleApiKey: localStorage.getItem('qgo_google_maps_api_key') || '',
  googleMap: null,
  googleDriverMarker: null,
  googleRouteLine: null,
  activeRoutePoints: null,
  currentDriverPct: 0,
  clientHomeCoords: JSON.parse(localStorage.getItem('qgo_client_coords')) || [14.585671, -90.518528],
  tempPickerCoords: [14.585671, -90.518528],
  selectedRestaurantBranch: null,
  addressPickerMap: null,
  addressPickerMarker: null,
  autoSimInterval: null,
  favorites: JSON.parse(localStorage.getItem('qgo_favorites')) || ['rest-campero', 'rest-mc'],
  appliedCoupon: null,
  savedAddresses: JSON.parse(localStorage.getItem('qgo_saved_addresses')) || [
    { id: 'addr-casa', label: 'Casa', icon: '🏠', address: 'Amatitlán - Parque Central, 7ma Calle y 5ta Avenida', coords: [14.4793, -90.6198] },
    { id: 'addr-trabajo', label: 'Trabajo', icon: '🏢', address: 'Zona 10, Edificio Dubai Center, Boulevard Los Próceres', coords: [14.5985, -90.5100] },
    { id: 'addr-pareja', label: 'Pareja', icon: '❤️', address: 'Zona 14, 10ma Avenida 14-25, Las Américas', coords: [14.5856, -90.5185] }
  ]
};

// Utilidades generales
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop.active, .cart-drawer-backdrop.active, .modal.active').forEach(m => {
    m.classList.remove('active');
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) { }
}

async function initBackendStatus() {
  const statusPill = document.getElementById('backendStatusPill');
  if (!statusPill) return;

  const health = await QgoAPI.checkHealth();
  if (health.connected) {
    statusPill.className = 'backend-status-pill connected';
    statusPill.innerHTML = '🟢 Spring Boot Conectado';
  } else {
    statusPill.className = 'backend-status-pill offline';
    statusPill.innerHTML = '🟡 Modo Demo (Spring Boot Offline)';
  }

  statusPill.onclick = async () => {
    showToast('Comprobando conexión con backend...', 'info');
    const reCheck = await QgoAPI.checkHealth();
    if (reCheck.connected) {
      statusPill.className = 'backend-status-pill connected';
      statusPill.innerHTML = '🟢 Spring Boot Conectado';
      showToast('¡Backend Spring Boot conectado!', 'success');
    } else {
      statusPill.className = 'backend-status-pill offline';
      statusPill.innerHTML = '🟡 Modo Demo (Spring Boot Offline)';
      showToast('Backend no detectado en localhost:8080 (Modo autónomo activo)', 'info');
    }
  };
}
