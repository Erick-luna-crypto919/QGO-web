// Módulo Carrito

function initCartDrawer() {
  const state = window.QgoState;
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const openBtn = document.getElementById('btnHeaderCart');
  const closeBtn = document.getElementById('btnCloseCartDrawer');

  if (openBtn) openBtn.onclick = () => openCartDrawer();
  if (closeBtn) closeBtn.onclick = () => closeCartDrawer();
  if (backdrop) {
    backdrop.onclick = (e) => {
      if (e.target === backdrop) closeCartDrawer();
    };
  }

  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.cart.tipPercentage = parseInt(btn.dataset.tip);
      updateCartTotals();
      updateSidebarCartUI();
    };
  });

  const btnDrawerCheckout = document.getElementById('btnCheckoutNow');
  if (btnDrawerCheckout) {
    btnDrawerCheckout.onclick = () => {
      if (state.cart.items.length === 0) return;
      closeCartDrawer();
      openCheckoutModal();
    };
  }

  const btnSidebarCheckout = document.getElementById('btnSidebarCheckout');
  if (btnSidebarCheckout) {
    btnSidebarCheckout.onclick = () => {
      if (state.cart.items.length === 0) return;
      openCheckoutModal();
    };
  }
}

function openCartDrawer() {
  updateCartUI();
  const drawer = document.getElementById('cartDrawerBackdrop');
  if (drawer) drawer.classList.add('active');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawerBackdrop');
  if (drawer) drawer.classList.remove('active');
}

function updateSidebarCartUI() {
  const state = window.QgoState;
  const listEl = document.getElementById('sidebarCartItemsList');
  const btnCheckout = document.getElementById('btnSidebarCheckout');
  if (!listEl || !btnCheckout) return;

  const subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const tip = Math.round(subtotal * (state.cart.tipPercentage / 100));
  const total = subtotal + state.cart.deliveryFee + state.cart.serviceFee + tip;

  if (state.cart.items.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🛒</div>
        <div style="font-weight: 700; font-size: 0.95rem;">Tu canasta está vacía</div>
        <div style="font-size: 0.8rem; margin-top: 4px;">Selecciona platillos del menú para agregarlos.</div>
      </div>
    `;
    btnCheckout.disabled = true;
    btnCheckout.style.opacity = '0.5';
    btnCheckout.textContent = 'Ir a Pagar ➔';
  } else {
    btnCheckout.disabled = false;
    btnCheckout.style.opacity = '1';
    btnCheckout.textContent = `Ir a Pagar (Q${total}) ➔`;

    listEl.innerHTML = state.cart.items.map((item, idx) => `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; padding:10px 0; border-bottom:1px solid var(--border-subtle);">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:0.92rem;">${escapeHTML(item.name)}</div>
          ${item.selectedOption ? `<div style="font-size:0.78rem; color:var(--text-muted);">+ ${escapeHTML(item.selectedOption)}</div>` : ''}
          <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
            <button class="btn-cart-mod" data-action="minus" data-idx="${idx}" style="background:#E5E7EB; border-radius:50%; width:24px; height:24px; font-weight:bold;">-</button>
            <span style="font-weight:700; font-size:0.9rem;">${item.quantity}</span>
            <button class="btn-cart-mod" data-action="plus" data-idx="${idx}" style="background:#E5E7EB; border-radius:50%; width:24px; height:24px; font-weight:bold;">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:800; font-size:0.95rem; color:var(--primary);">Q${item.price * item.quantity}</div>
          <button class="btn-cart-mod" data-action="remove" data-idx="${idx}" style="color:var(--text-muted); font-size:0.78rem; margin-top:6px;">Quitar</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.btn-cart-mod').forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.action;
        const idx = parseInt(btn.dataset.idx);
        if (action === 'plus') state.cart.items[idx].quantity++;
        else if (action === 'minus') {
          if (state.cart.items[idx].quantity > 1) state.cart.items[idx].quantity--;
          else state.cart.items.splice(idx, 1);
        } else if (action === 'remove') state.cart.items.splice(idx, 1);
        updateCartUI();
        updateSidebarCartUI();
      };
    });
  }

  const subEl = document.getElementById('sidebarSubtotal');
  const delEl = document.getElementById('sidebarDeliveryFee');
  const totEl = document.getElementById('sidebarTotal');
  if (subEl) subEl.textContent = `Q${subtotal}`;
  if (delEl) delEl.textContent = state.cart.deliveryFee === 0 ? 'Gratis' : `Q${state.cart.deliveryFee}`;
  if (totEl) totEl.textContent = `Q${total}`;
  updateMobileCartBar();
}

function updateCartUI() {
  const state = window.QgoState;
  const itemsList = document.getElementById('cartItemsList');
  const badge = document.getElementById('headerCartCount');
  const totalCount = state.cart.items.reduce((acc, i) => acc + i.quantity, 0);

  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  }

  const btnCheckout = document.getElementById('btnCheckoutNow');

  if (state.cart.items.length === 0) {
    if (itemsList) {
      itemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 10px;">🛒</div>
          <h4>Tu canasta está vacía</h4>
          <p style="font-size: 0.85rem; margin-top: 6px;">Agrega platillos deliciosos de los restaurantes.</p>
        </div>
      `;
    }
    if (btnCheckout) {
      btnCheckout.disabled = true;
      btnCheckout.style.opacity = '0.5';
    }
  } else {
    if (btnCheckout) {
      btnCheckout.disabled = false;
      btnCheckout.style.opacity = '1';
    }

    if (itemsList) {
      itemsList.innerHTML = state.cart.items.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h5 class="cart-item-name">${escapeHTML(item.name)}</h5>
            ${item.selectedOption ? `<div class="cart-item-sub">+ ${escapeHTML(item.selectedOption)}</div>` : ''}
            ${item.notes ? `<div class="cart-item-sub">Nota: "${escapeHTML(item.notes)}"</div>` : ''}
            <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
              <button class="btn-cart-mod" data-action="minus" data-idx="${idx}" style="background:#E5E7EB; border-radius:50%; width:26px; height:26px; font-weight:bold;">-</button>
              <span style="font-weight:700; font-size:0.95rem;">${item.quantity}</span>
              <button class="btn-cart-mod" data-action="plus" data-idx="${idx}" style="background:#E5E7EB; border-radius:50%; width:26px; height:26px; font-weight:bold;">+</button>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="cart-item-price">Q${item.price * item.quantity}</div>
            <button class="btn-cart-mod" data-action="remove" data-idx="${idx}" style="color:var(--primary); font-size:0.8rem; font-weight:700; margin-top:8px;">Eliminar</button>
          </div>
        </div>
      `).join('');

      itemsList.querySelectorAll('.btn-cart-mod').forEach(btn => {
        btn.onclick = () => {
          const action = btn.dataset.action;
          const idx = parseInt(btn.dataset.idx);
          if (action === 'plus') state.cart.items[idx].quantity++;
          else if (action === 'minus') {
            if (state.cart.items[idx].quantity > 1) state.cart.items[idx].quantity--;
            else state.cart.items.splice(idx, 1);
          } else if (action === 'remove') state.cart.items.splice(idx, 1);
          updateCartUI();
          updateSidebarCartUI();
        };
      });
    }
  }

  updateCartTotals();
}

function updateCartTotals() {
  const state = window.QgoState;
  const subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const tip = Math.round(subtotal * (state.cart.tipPercentage / 100));
  const total = subtotal + state.cart.deliveryFee + state.cart.serviceFee + tip;

  const subEl = document.getElementById('cartSubtotal');
  const feeEl = document.getElementById('cartDeliveryFee');
  const tipEl = document.getElementById('cartTip');
  const totEl = document.getElementById('cartTotal');

  if (subEl) subEl.textContent = `Q${subtotal}`;
  if (feeEl) feeEl.textContent = state.cart.deliveryFee === 0 ? 'Gratis' : `Q${state.cart.deliveryFee}`;
  if (tipEl) tipEl.textContent = `Q${tip}`;
  if (totEl) totEl.textContent = `Q${total}`;
  updateMobileCartBar();
  updateFloatingCartFab();
}

function initMobileCartBar() {
  const btn = document.getElementById('btnOpenMobileCart');
  if (btn) {
    btn.onclick = () => {
      openCartDrawer();
    };
  }
  const fab = document.getElementById('floatingCartFab');
  if (fab) {
    fab.onclick = () => {
      openCartDrawer();
    };
  }
}

function updateFloatingCartFab() {
  const state = window.QgoState;
  const fab = document.getElementById('floatingCartFab');
  if (!fab) return;

  const countEl = document.getElementById('floatingCartCount');
  const totalEl = document.getElementById('floatingCartTotal');
  const totalCount = state.cart.items.reduce((acc, i) => acc + i.quantity, 0);

  if (totalCount > 0 && state.currentUser && state.currentUser.rol === 'CLIENTE') {
    const subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const delivery = state.cart.deliveryFee || 0;
    const service = state.cart.serviceFee || 5;
    const tip = Math.round(subtotal * (state.cart.tipPercentage / 100));
    const total = subtotal + delivery + service + tip;

    if (countEl) countEl.textContent = totalCount;
    if (totalEl) totalEl.textContent = `Q${total.toFixed(2)}`;
    fab.style.display = 'flex';
  } else {
    fab.style.display = 'none';
  }
}

function updateMobileCartBar() {
  const state = window.QgoState;
  const bar = document.getElementById('mobileCartBar');
  if (!bar) return;

  const countEl = document.getElementById('mobileCartCount');
  const titleEl = document.getElementById('mobileCartRestName');
  const totalEl = document.getElementById('mobileCartTotal');
  const totalCount = state.cart.items.reduce((acc, i) => acc + i.quantity, 0);

  if (totalCount > 0 && state.currentUser && state.currentUser.rol === 'CLIENTE') {
    const subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const delivery = state.cart.deliveryFee || 0;
    const service = state.cart.serviceFee || 5;
    const tip = Math.round(subtotal * (state.cart.tipPercentage / 100));
    const total = subtotal + delivery + service + tip;

    if (countEl) countEl.textContent = totalCount;
    if (titleEl) titleEl.textContent = state.cart.restaurantName ? `Pedido en ${escapeHTML(state.cart.restaurantName)}` : 'Tu Pedido Chapín';
    if (totalEl) totalEl.textContent = `Q${total}`;
    bar.style.display = 'flex';
  } else {
    bar.style.display = 'none';
  }
}

function initCheckoutModal() {
  const state = window.QgoState;
  const modal = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('btnCloseCheckoutModal');
  const confirmBtn = document.getElementById('btnConfirmOrder');

  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  paymentRadios.forEach(radio => {
    radio.onchange = () => {
      const cardFields = document.getElementById('checkoutCardFields');
      const cashFields = document.getElementById('checkoutCashFields');
      const transferFields = document.getElementById('checkoutTransferFields');
      if (radio.value.includes('Tarjeta')) {
        if (cardFields) cardFields.style.display = 'block';
        if (cashFields) cashFields.style.display = 'none';
        if (transferFields) transferFields.style.display = 'none';
      } else if (radio.value.includes('Efectivo')) {
        if (cardFields) cardFields.style.display = 'none';
        if (cashFields) cashFields.style.display = 'block';
        if (transferFields) transferFields.style.display = 'none';
        updateCashChangeDisplay();
      } else {
        if (cardFields) cardFields.style.display = 'none';
        if (cashFields) cashFields.style.display = 'none';
        if (transferFields) transferFields.style.display = 'block';
      }
    };
  });

  const cashSelect = document.getElementById('checkoutCashSelect');
  if (cashSelect) {
    cashSelect.onchange = () => updateCashChangeDisplay();
  }

  const cardNumInput = document.getElementById('checkoutCardNumber');
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 16);
      e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
  }

  const cardExpInput = document.getElementById('checkoutCardExp');
  if (cardExpInput) {
    cardExpInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 4);
      if (val.length >= 2) {
        e.target.value = val.slice(0, 2) + '/' + val.slice(2);
      } else {
        e.target.value = val;
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.onclick = () => {
      executeCheckout();
    };
  }

  const checkoutAddrInput = document.getElementById('checkoutAddressInput');
  if (checkoutAddrInput) {
    const handleCheckoutAddrChange = () => {
      const text = checkoutAddrInput.value.trim();
      const resolved = resolveGuatemalaLocation(text);
      if (resolved) {
        state.clientHomeCoords = [...resolved.coords];
        localStorage.setItem('qgo_client_coords', JSON.stringify(state.clientHomeCoords));
        localStorage.setItem('qgo_client_address', text);

        const rest = state.selectedRestaurant || (getStoredRestaurants().find(r => r.name === state.cart.restaurantName) || getStoredRestaurants()[0]);
        if (rest) {
          state.selectedRestaurant = rest;
          state.selectedRestaurantBranch = getNearestRestaurantBranch(rest, state.clientHomeCoords);
          if (typeof updateRestaurantBranchUI === 'function') updateRestaurantBranchUI();
          showToast(`🏬 Sucursal reasignada automáticamente a: ${state.selectedRestaurantBranch.name} (${state.selectedRestaurantBranch.distanceKm} km)`, 'info');
        }
      }
    };
    checkoutAddrInput.addEventListener('input', debounce(handleCheckoutAddrChange, 300));
    checkoutAddrInput.addEventListener('change', handleCheckoutAddrChange);
  }

  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const inputCoupon = document.getElementById('checkoutCouponInput');
  const msgCoupon = document.getElementById('couponStatusMessage');

  function applyCouponCode(code) {
    const cleanCode = (code || '').toUpperCase().trim();
    if (!cleanCode) return;

    const dynamicCoupons = (window.QgoAPI && typeof window.QgoAPI.getCoupons === 'function')
      ? window.QgoAPI.getCoupons()
      : [
          { code: 'QGOCHAPIN', discount: 15, type: 'fixed', label: 'Q15 de descuento' },
          { code: 'ENVIOGRATIS', discount: 0, type: 'free_delivery', label: 'Envío Gratis' },
          { code: 'GUATE502', discount: 10, type: 'fixed', label: 'Q10 de descuento' },
          { code: 'BIENVENIDO', discount: 20, type: 'percent', label: '20% de descuento en comida' }
        ];

    const found = dynamicCoupons.find(c => c.code.toUpperCase() === cleanCode);

    if (found) {
      state.appliedCoupon = { ...found };
      if (msgCoupon) {
        msgCoupon.style.display = 'block';
        msgCoupon.style.color = '#166534';
        const labelText = found.label || (found.type === 'percent' ? `${found.discount}% de descuento` : (found.type === 'free_delivery' ? 'Envío Gratis' : `Q${found.discount} de descuento`));
        msgCoupon.innerHTML = `✓ ¡Cupón <b>${cleanCode}</b> aplicado con éxito! (${labelText})`;
      }
      calculateCheckoutTotals();
      showToast(`¡Cupón ${cleanCode} activado!`, 'success');
    } else {
      if (msgCoupon) {
        msgCoupon.style.display = 'block';
        msgCoupon.style.color = '#DC2626';
        msgCoupon.textContent = `✕ Cupón "${cleanCode}" no válido o expirado.`;
      }
      showToast('Cupón no válido', 'error');
    }
  }

  if (btnApplyCoupon && inputCoupon) {
    btnApplyCoupon.onclick = () => applyCouponCode(inputCoupon.value);
    inputCoupon.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCouponCode(inputCoupon.value);
      }
    };
  }

  document.querySelectorAll('.coupon-tag-hint').forEach(hint => {
    hint.onclick = () => {
      const code = hint.dataset.code;
      if (inputCoupon) inputCoupon.value = code;
      applyCouponCode(code);
    };
  });
}

function renderCheckoutSavedAddresses() {
  const state = window.QgoState;
  const container = document.getElementById('checkoutSavedAddrsRow');
  if (!container) return;
  if (!state.savedAddresses || state.savedAddresses.length === 0) {
    container.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted);">Sin direcciones guardadas</span>';
    return;
  }
  container.innerHTML = state.savedAddresses.map(sa => `
    <div class="saved-addr-chip-wrap" data-addr-id="${sa.id}" style="padding: 2px 4px 2px 8px; font-size: 0.74rem;">
      <button type="button" class="saved-addr-btn-select" data-addr-id="${sa.id}" style="font-size: 0.74rem;" title="${escapeHTML(sa.address)}">
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
        const addrInput = document.getElementById('checkoutAddressInput');
        if (addrInput) addrInput.value = sa.address;
        state.clientHomeCoords = [...sa.coords];
        localStorage.setItem('qgo_client_coords', JSON.stringify(state.clientHomeCoords));
        localStorage.setItem('qgo_client_address', sa.address);

        container.querySelectorAll('.saved-addr-chip-wrap').forEach(w => w.classList.remove('active'));
        const wrap = btn.closest('.saved-addr-chip-wrap');
        if (wrap) wrap.classList.add('active');

        const rest = state.selectedRestaurant || (getStoredRestaurants().find(r => r.name === state.cart.restaurantName) || getStoredRestaurants()[0]);
        if (rest) {
          state.selectedRestaurantBranch = getNearestRestaurantBranch(rest, state.clientHomeCoords);
          if (typeof updateRestaurantBranchUI === 'function') updateRestaurantBranchUI();
        }
        showToast(`Dirección seleccionada: ${sa.label}`, 'info');
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

function calculateCheckoutTotals() {
  const state = window.QgoState;
  const subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const tip = Math.round(subtotal * (state.cart.tipPercentage / 100));
  let delivery = state.cart.deliveryFee || 0;
  let discount = 0;

  if (state.appliedCoupon) {
    if (state.appliedCoupon.type === 'free_delivery') {
      discount = delivery;
      delivery = 0;
    } else if (state.appliedCoupon.type === 'percent') {
      discount = Math.round(subtotal * (state.appliedCoupon.discount / 100));
    } else {
      discount = Math.min(subtotal, state.appliedCoupon.discount);
    }
  }

  const total = Math.max(0, subtotal - discount) + delivery + (state.cart.serviceFee || 5) + tip;

  const totalEl = document.getElementById('checkoutSummaryTotal');
  if (totalEl) totalEl.textContent = `Q${total}`;

  const discRow = document.getElementById('checkoutDiscountRow');
  const discAmount = document.getElementById('checkoutDiscountAmount');
  if (discRow && discAmount) {
    if (discount > 0) {
      discRow.style.display = 'block';
      discAmount.textContent = `-Q${discount} (${state.appliedCoupon.code})`;
    } else {
      discRow.style.display = 'none';
    }
  }

  return { subtotal, tip, delivery, discount, total };
}

function openCheckoutModal() {
  const state = window.QgoState;
  state.appliedCoupon = null;
  const msgCoupon = document.getElementById('couponStatusMessage');
  if (msgCoupon) msgCoupon.style.display = 'none';
  const inputCoupon = document.getElementById('checkoutCouponInput');
  if (inputCoupon) inputCoupon.value = '';

  renderCheckoutSavedAddresses();
  calculateCheckoutTotals();

  const restNameEl = document.getElementById('checkoutRestName');
  if (restNameEl) restNameEl.textContent = state.cart.restaurantName;

  const addrInput = document.getElementById('checkoutAddressInput');
  const savedAddress = localStorage.getItem('qgo_client_address') || (state.currentUser && state.currentUser.direccion ? state.currentUser.direccion : '10ma Avenida 14-25, Zona 14, Edificio Las Américas');
  if (addrInput) {
    addrInput.value = savedAddress;
  }

  const rest = state.selectedRestaurant || (getStoredRestaurants().find(r => r.name === state.cart.restaurantName) || getStoredRestaurants()[0]);
  if (rest) {
    state.selectedRestaurant = rest;
    if (!state.selectedRestaurantBranch) {
      state.selectedRestaurantBranch = getNearestRestaurantBranch(rest, state.clientHomeCoords);
    }
    if (typeof updateRestaurantBranchUI === 'function') updateRestaurantBranchUI();
  }

  updateCashChangeDisplay();
  const modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('active');
}

function updateCashChangeDisplay() {
  const cashSelect = document.getElementById('checkoutCashSelect');
  const note = document.getElementById('checkoutCashChangeNote');
  if (!cashSelect || !note) return;
  const val = cashSelect.value;
  const totals = calculateCheckoutTotals();
  const total = totals.total;

  if (val === 'cabal') {
    note.textContent = 'Pago exacto sin vuelto';
    note.style.color = 'var(--text-muted)';
  } else {
    const bill = parseInt(val, 10);
    if (bill >= total) {
      note.textContent = `💵 Vuelto estimado que te llevará el motorista: Q${bill - total}`;
      note.style.color = 'var(--accent-green)';
    } else {
      note.textContent = `⚠️ El billete de Q${bill} no cubre el total (Q${total})`;
      note.style.color = 'var(--primary)';
    }
  }
}

function executeCheckout() {
  const state = window.QgoState;
  const totals = calculateCheckoutTotals();
  const subtotal = totals.subtotal;
  const tip = totals.tip;
  const deliveryFee = totals.delivery;
  const discount = totals.discount;
  const total = totals.total;

  const isGuest = !state.currentUser || !!state.currentUser.isGuest;
  const deliveryAddress = document.getElementById('checkoutAddressInput').value.trim() || 'Zona 14, Ciudad de Guatemala';
  const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
  const paymentMethod = paymentRadio ? paymentRadio.value : 'Tarjeta BAC Credomatic';

  const resolvedLoc = resolveGuatemalaLocation(deliveryAddress);
  const orderCoords = (state.clientHomeCoords && state.clientHomeCoords.length === 2)
    ? [...state.clientHomeCoords]
    : (resolvedLoc ? [...resolvedLoc.coords] : [14.4862, -90.6150]);

  const rest = state.selectedRestaurant || (getStoredRestaurants().find(r => r.name === state.cart.restaurantName) || getStoredRestaurants()[0]);

  let assignedBranch = state.selectedRestaurantBranch || getNearestRestaurantBranch(rest, orderCoords);
  state.selectedRestaurantBranch = assignedBranch;

  const estMins = assignedBranch.distanceKm ? Math.max(15, Math.round(10 + assignedBranch.distanceKm * 3.5)) : 25;

  const newOrder = {
    id: 'QGO-' + Math.floor(1000 + Math.random() * 9000),
    fecha: new Date().toISOString(),
    clienteId: state.currentUser ? state.currentUser.id : 1,
    isGuestOrder: isGuest,
    cliente: {
      id: state.currentUser ? state.currentUser.id : 1,
      nombre: state.currentUser ? state.currentUser.nombre : 'Cliente Chapín',
      correo: state.currentUser ? state.currentUser.correo : 'cliente@qgo.gt',
      direccion: deliveryAddress,
      telefono: (state.currentUser && state.currentUser.telefono) ? state.currentUser.telefono : '+502 5555-1234'
    },
    restaurante: {
      id: rest ? rest.id : 'rest-campero',
      name: state.cart.restaurantName || (rest ? rest.name : 'Pollo Campero'),
      address: assignedBranch.address || (rest ? rest.address : 'Guatemala'),
      coverImage: rest ? rest.coverImage : 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800'
    },
    sucursal: assignedBranch,
    clienteCoords: [...orderCoords],
    repartidor: {
      id: 3,
      nombre: 'Erick Morales (Repartidor Chapín)',
      vehiculo: 'Pulsar NS 200 - Placa M-789XYZ',
      calificacion: 4.9,
      telefono: '+502 4444-9988'
    },
    items: [...state.cart.items],
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    serviceFee: state.cart.serviceFee,
    tip: tip,
    cupon: state.appliedCoupon ? state.appliedCoupon.code : null,
    descuento: discount,
    total: total,
    metodoPago: paymentMethod,
    estado: 'CONFIRMADO',
    tiempoEstimadoMinutos: estMins,
    posicionRepartidorPct: 0
  };

  if (isGuest) {
    const guestStored = sessionStorage.getItem('qgo_guest_orders');
    let guestOrders = [];
    if (guestStored) {
      try { guestOrders = JSON.parse(guestStored); } catch(e){}
    }
    guestOrders.unshift(newOrder);
    sessionStorage.setItem('qgo_guest_orders', JSON.stringify(guestOrders));
    QgoAPI.saveOrder(newOrder);
  } else {
    QgoAPI.saveOrder(newOrder);
  }

  state.cart.items = [];
  state.appliedCoupon = null;
  updateCartUI();
  updateSidebarCartUI();

  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) checkoutModal.classList.remove('active');
  playNotificationSound();
  showToast(`¡Pedido ${newOrder.id} confirmado! Despachando desde ${assignedBranch.name}`, 'success');

  if (typeof openTrackingView === 'function') {
    openTrackingView(newOrder);
  }
}
