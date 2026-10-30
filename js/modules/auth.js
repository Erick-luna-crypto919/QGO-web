// Módulo Autenticación

function createGuestUser() {
  let guestId = sessionStorage.getItem('qgo_guest_id');
  if (!guestId) {
    guestId = 'guest-' + Date.now();
    sessionStorage.setItem('qgo_guest_id', guestId);
  }
  return {
    id: guestId,
    nombre: 'Invitado',
    correo: 'invitado@qgo.gt',
    rol: 'CLIENTE',
    isGuest: true
  };
}

async function initUserSession() {
  const users = await QgoAPI.getUsuarios();
  const storedUserId = localStorage.getItem('qgo_logged_user_id');

  let user = null;
  if (storedUserId) {
    user = users.find(u => String(u.id) === String(storedUserId));
  }

  if (!user) {
    user = createGuestUser();
  }

  setCurrentUser(user);

  if (user.isGuest && !sessionStorage.getItem('qgo_welcome_guest_dismissed')) {
    setTimeout(() => {
      openAccountSelector();
    }, 350);
  }
}

function setCurrentUser(user) {
  const state = window.QgoState;
  state.currentUser = user;
  if (!user.isGuest) {
    localStorage.setItem('qgo_logged_user_id', user.id);
  } else {
    localStorage.removeItem('qgo_logged_user_id');
  }

  const nameEl = document.getElementById('headerUserName');
  const roleEl = document.getElementById('headerUserRole');
  const logoutBtn = document.getElementById('btnLogoutBtn');
  if (nameEl) nameEl.textContent = user.nombre;
  if (roleEl) roleEl.textContent = user.isGuest ? 'Iniciar Sesión' : user.rol;
  if (logoutBtn) logoutBtn.textContent = user.isGuest ? 'Entrar' : 'Cambiar';

  const roleBanner = document.getElementById('activeRoleBannerText');
  if (roleBanner) {
    if (user.isGuest) {
      roleBanner.innerHTML = `Navegando como: <b style="color:var(--primary);">Invitado</b> · <a href="javascript:void(0)" onclick="openAccountSelector()" style="color:var(--primary); font-weight:700; text-decoration:underline;">Inicia sesión o regístrate para guardar tu historial</a>`;
    } else {
      roleBanner.innerHTML = `Sesión activa como: <b style="color:var(--primary);">${escapeHTML(user.nombre)}</b> (<span class="badge-role ${user.rol}">${user.rol}</span>)`;
    }
  }

  if (user.direccion) {
    const addrEl = document.getElementById('currentAddressText');
    if (addrEl) addrEl.textContent = user.direccion.split(',')[0] + ' • Inmediato';
  } else if (user.isGuest) {
    const addrEl = document.getElementById('currentAddressText');
    if (addrEl) addrEl.textContent = 'Zona 14, Ciudad de Guatemala';
  }

  if (user.rol === 'CLIENTE') {
    if (typeof getClientOrders === 'function') {
      const myOrders = getClientOrders(user);
      state.activeOrderForTracking = myOrders.length > 0 ? myOrders[0] : null;
    }
    const historyModal = document.getElementById('ordersHistoryModal');
    if (historyModal && historyModal.classList.contains('active') && typeof renderOrdersHistoryList === 'function') {
      renderOrdersHistoryList();
    }
  }

  applyRoleView(user.rol);
}

function applyRoleView(rol) {
  const vClient = document.getElementById('viewClient');
  const vComercio = document.getElementById('viewComercio');
  const vRepartidor = document.getElementById('viewRepartidor');
  const vAdmin = document.getElementById('viewAdmin');

  if (vClient) vClient.style.display = 'none';
  if (vComercio) vComercio.style.display = 'none';
  if (vRepartidor) vRepartidor.style.display = 'none';
  if (vAdmin) vAdmin.style.display = 'none';

  const cartBtn = document.getElementById('btnHeaderCart');
  if (cartBtn) {
    cartBtn.style.display = (rol === 'CLIENTE') ? 'flex' : 'none';
  }

  const ordersHistoryBtn = document.getElementById('btnHeaderOrdersHistory');
  if (ordersHistoryBtn) {
    ordersHistoryBtn.style.display = (rol === 'CLIENTE') ? 'flex' : 'none';
  }

  const mobileCartBar = document.getElementById('mobileCartBar');
  if (mobileCartBar && rol !== 'CLIENTE') {
    mobileCartBar.style.display = 'none';
  }

  if (rol !== 'CLIENTE') {
    const ordersModal = document.getElementById('ordersHistoryModal');
    if (ordersModal) ordersModal.classList.remove('active');
    const receiptModal = document.getElementById('receiptModal');
    if (receiptModal) receiptModal.classList.remove('active');
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) checkoutModal.classList.remove('active');
  } else {
    const curHash = window.location.hash;
    if (curHash === '#repartidor' || curHash === '#comercio' || curHash === '#admin') {
      window.location.hash = '#home';
      sessionStorage.setItem('qgo_current_hash', '#home');
    }
  }

  if (typeof handleRoute === 'function') {
    handleRoute();
  }
}

function openAccountSelector() {
  const authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.classList.add('active');
    renderDemoAccountsList();
    const logoutSec = document.getElementById('authLogoutSection');
    if (logoutSec) {
      logoutSec.style.display = (window.QgoState.currentUser && !window.QgoState.currentUser.isGuest) ? 'block' : 'none';
    }
  }
}
window.openAccountSelector = openAccountSelector;

async function renderDemoAccountsList() {
  const container = document.getElementById('demoAccountsList');
  if (!container) return;

  const users = await QgoAPI.getUsuarios();
  container.innerHTML = users.map(u => `
    <div class="demo-account-card" data-user-id="${u.id}">
      <div>
        <div style="font-weight:700; font-size:0.92rem;">${escapeHTML(u.nombre)}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(u.correo)} • Clave: <b>${escapeHTML(u.contrasena)}</b></div>
      </div>
      <span class="badge-role ${escapeHTML(u.rol)}">${escapeHTML(u.rol)}</span>
    </div>
  `).join('');

  container.querySelectorAll('.demo-account-card').forEach(card => {
    card.onclick = () => {
      const uid = card.dataset.userId;
      const target = users.find(u => String(u.id) === String(uid));
      if (target) {
        sessionStorage.setItem('qgo_welcome_guest_dismissed', 'true');
        setCurrentUser(target);
        const authModal = document.getElementById('authModal');
        if (authModal) authModal.classList.remove('active');
        showToast(`Sesión: ${target.nombre} (${target.rol})`, 'success');
      }
    };
  });
}

function initAuthModal() {
  const authModal = document.getElementById('authModal');
  const btnOpenAuth = document.getElementById('btnAccountSelector');
  const btnCloseAuth = document.getElementById('btnCloseAuthModal');

  if (btnOpenAuth) btnOpenAuth.onclick = () => openAccountSelector();
  if (btnCloseAuth) btnCloseAuth.onclick = () => authModal.classList.remove('active');

  const tabLogin = document.getElementById('tabAuthLogin');
  const tabRegister = document.getElementById('tabAuthRegister');
  const formLogin = document.getElementById('formAuthLogin');
  const formRegister = document.getElementById('formAuthRegister');

  if (tabLogin && tabRegister) {
    tabLogin.onclick = () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.style.display = 'block';
      formRegister.style.display = 'none';
    };
    tabRegister.onclick = () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formLogin.style.display = 'none';
      formRegister.style.display = 'block';
    };
  }

  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmailInput').value.trim();
      const pass = document.getElementById('loginPassInput').value.trim();
      const users = await QgoAPI.getUsuarios();

      const found = users.find(u => u.correo.toLowerCase() === email.toLowerCase() && u.contrasena === pass);
      if (found) {
        setCurrentUser(found);
        authModal.classList.remove('active');
        showToast(`¡Bienvenido, ${found.nombre}!`, 'success');
      } else {
        showToast('Credenciales incorrectas. Usa las cuentas de acceso rápido.', 'info');
      }
    };
  }

  if (formRegister) {
    formRegister.onsubmit = async (e) => {
      e.preventDefault();
      const nuevo = {
        nombre: document.getElementById('regNameInput').value.trim(),
        correo: document.getElementById('regEmailInput').value.trim(),
        contrasena: document.getElementById('regPassInput').value.trim(),
        rol: document.getElementById('regRoleSelect').value
      };

      const saved = await QgoAPI.guardarUsuario(nuevo);
      sessionStorage.setItem('qgo_welcome_guest_dismissed', 'true');
      setCurrentUser(saved);
      authModal.classList.remove('active');
      showToast(`Cuenta creada como ${saved.rol}`, 'success');
    };
  }

  const btnContinueGuest = document.getElementById('btnContinueAsGuest');
  if (btnContinueGuest) {
    btnContinueGuest.onclick = () => {
      sessionStorage.setItem('qgo_welcome_guest_dismissed', 'true');
      if (!window.QgoState.currentUser || !window.QgoState.currentUser.isGuest) {
        setCurrentUser(createGuestUser());
      }
      authModal.classList.remove('active');
      showToast('Navegando como Invitado. ¡Bienvenido a Qgo!', 'info');
    };
  }

  const btnLogoutActive = document.getElementById('btnLogoutActiveUser');
  if (btnLogoutActive) {
    btnLogoutActive.onclick = () => {
      localStorage.removeItem('qgo_logged_user_id');
      setCurrentUser(createGuestUser());
      authModal.classList.remove('active');
      showToast('Has cerrado sesión. Ahora navegas como Invitado.', 'info');
    };
  }

  const btnLogout = document.getElementById('btnLogoutBtn');
  if (btnLogout) {
    btnLogout.onclick = (e) => {
      e.stopPropagation();
      openAccountSelector();
    };
  }
}

// Módulo Direcciones
function openEditAddressModal(addressId) {
  const sa = window.QgoState.savedAddresses.find(a => a.id === addressId);
  if (!sa) return;
  const modal = document.getElementById('editAddressModal');
  const idInput = document.getElementById('editAddressId');
  const labelInput = document.getElementById('editAddressLabelInput');
  const fullInput = document.getElementById('editAddressFullInput');

  if (idInput) idInput.value = sa.id;
  if (labelInput) labelInput.value = sa.label;
  if (fullInput) fullInput.value = sa.address;

  if (modal) modal.classList.add('active');
}

function deleteSavedAddress(addressId) {
  const state = window.QgoState;
  const sa = state.savedAddresses.find(a => a.id === addressId);
  if (!sa) return;
  if (confirm(`¿Deseas eliminar "${sa.label}" de tus direcciones frecuentes guardadas?`)) {
    state.savedAddresses = state.savedAddresses.filter(a => a.id !== addressId);
    localStorage.setItem('qgo_saved_addresses', JSON.stringify(state.savedAddresses));
    renderSavedAddressesPills();
    if (typeof renderCheckoutSavedAddresses === 'function') renderCheckoutSavedAddresses();
    showToast(`Dirección "${sa.label}" eliminada`, 'info');
  }
}

function initEditAddressModal() {
  const modal = document.getElementById('editAddressModal');
  const btnClose = document.getElementById('btnCloseEditAddressModal');
  const btnCancel = document.getElementById('btnCancelEditAddress');
  const form = document.getElementById('formEditAddress');

  if (btnClose && modal) btnClose.onclick = () => modal.classList.remove('active');
  if (btnCancel && modal) btnCancel.onclick = () => modal.classList.remove('active');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const state = window.QgoState;
      const id = document.getElementById('editAddressId').value;
      const newLabel = document.getElementById('editAddressLabelInput').value.trim();
      const newAddress = document.getElementById('editAddressFullInput').value.trim();

      const sa = state.savedAddresses.find(a => a.id === id);
      if (sa) {
        sa.label = newLabel || sa.label;
        sa.address = newAddress || sa.address;
        localStorage.setItem('qgo_saved_addresses', JSON.stringify(state.savedAddresses));
        if (modal) modal.classList.remove('active');
        renderSavedAddressesPills();
        if (typeof renderCheckoutSavedAddresses === 'function') renderCheckoutSavedAddresses();
        showToast(`¡Dirección "${sa.label}" actualizada con éxito!`, 'success');
      }
    };
  }
}

function renderSavedAddressesPills() {
  const state = window.QgoState;
  const container = document.getElementById('savedAddressesRow');
  if (!container) return;
  if (!state.savedAddresses || state.savedAddresses.length === 0) {
    container.innerHTML = '<span style="font-size:0.78rem; color:var(--text-muted);">No tienes direcciones frecuentes guardadas.</span>';
    return;
  }
  container.innerHTML = state.savedAddresses.map(sa => `
    <div class="saved-addr-chip-wrap" data-addr-id="${sa.id}">
      <button type="button" class="saved-addr-btn-select" data-addr-id="${sa.id}" title="${escapeHTML(sa.address)}">
        <span>${sa.icon || '📍'}</span>
        <span>${escapeHTML(sa.label)}</span>
      </button>
      <div class="saved-addr-actions">
        <button type="button" class="btn-addr-action edit btn-edit-saved-addr" data-addr-id="${sa.id}" title="Modificar ${escapeHTML(sa.label)}">✏️</button>
        <button type="button" class="btn-addr-action delete btn-delete-saved-addr" data-addr-id="${sa.id}" title="Eliminar ${escapeHTML(sa.label)}">🗑️</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.saved-addr-btn-select').forEach(btn => {
    btn.onclick = () => {
      const sa = state.savedAddresses.find(a => a.id === btn.dataset.addrId);
      if (sa) {
        state.tempPickerCoords = [...sa.coords];
        const inputCustom = document.getElementById('customAddressInput');
        if (inputCustom) inputCustom.value = sa.address;
        const badgeCoords = document.getElementById('pinCoordsBadge');
        if (badgeCoords) badgeCoords.textContent = `${sa.coords[0].toFixed(4)}, ${sa.coords[1].toFixed(4)}`;
        if (state.addressPickerMap && state.addressPickerMarker) {
          state.addressPickerMarker.setLatLng(sa.coords);
          state.addressPickerMap.flyTo(sa.coords, 15);
        }
        container.querySelectorAll('.saved-addr-chip-wrap').forEach(w => w.classList.remove('active'));
        const wrap = btn.closest('.saved-addr-chip-wrap');
        if (wrap) wrap.classList.add('active');
        showToast(`Ubicación seleccionada: ${sa.label}`, 'info');
      }
    };
  });

  container.querySelectorAll('.btn-edit-saved-addr').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openEditAddressModal(btn.dataset.addrId);
    };
  });

  container.querySelectorAll('.btn-delete-saved-addr').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      deleteSavedAddress(btn.dataset.addrId);
    };
  });
}

function initAddressModal() {
  initEditAddressModal();
  const modal = document.getElementById('addressModal');
  const btnOpen = document.getElementById('btnAddressSelector');
  const btnClose = document.getElementById('btnCloseAddressModal');
  const inputSearch = document.getElementById('addressSearchInput');
  const btnGps = document.getElementById('btnGeolocateMe');
  const inputCustom = document.getElementById('customAddressInput');
  const btnSave = document.getElementById('btnSaveCustomAddress');
  const badgeCoords = document.getElementById('pinCoordsBadge');
  const state = window.QgoState;

  if (btnOpen) {
    btnOpen.onclick = () => {
      modal.classList.add('active');
      state.tempPickerCoords = [...state.clientHomeCoords];
      renderSavedAddressesPills();
      setTimeout(() => {
        if (typeof initAddressPickerMap === 'function') initAddressPickerMap();
      }, 200);
    };
  }

  if (btnClose) btnClose.onclick = () => modal.classList.remove('active');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  if (btnGps) {
    btnGps.onclick = () => {
      if ('geolocation' in navigator) {
        showToast('Obteniendo ubicación del dispositivo...', 'info');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = [pos.coords.latitude, pos.coords.longitude];
            state.tempPickerCoords = coords;
            if (badgeCoords) badgeCoords.textContent = `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
            if (inputCustom) inputCustom.value = 'Mi Ubicación Actual (GPS Detectado)';
            if (state.addressPickerMap && state.addressPickerMarker) {
              state.addressPickerMarker.setLatLng(coords);
              state.addressPickerMap.flyTo(coords, 16);
            }
            showToast('Ubicación GPS detectada con éxito', 'success');
          },
          (err) => {
            showToast('No se pudo acceder al GPS. Usando ubicación en Zona 14.', 'info');
          },
          { enableHighAccuracy: true, timeout: 6000 }
        );
      } else {
        showToast('Geolocalización no soportada por el navegador.', 'info');
      }
    };
  }

  if (btnSave) {
    btnSave.onclick = () => {
      const addressText = inputCustom ? inputCustom.value.trim() : '';
      if (!addressText) {
        showToast('Por favor escribe o selecciona una dirección.', 'info');
        return;
      }
      state.clientHomeCoords = [...state.tempPickerCoords];
      localStorage.setItem('qgo_client_coords', JSON.stringify(state.clientHomeCoords));
      localStorage.setItem('qgo_client_address', addressText);

      const addrEl = document.getElementById('currentAddressText');
      if (addrEl) addrEl.textContent = addressText.split(',')[0] + ' • Inmediato';

      modal.classList.remove('active');
      showToast('¡Dirección de entrega actualizada!', 'success');
    };
  }
}
