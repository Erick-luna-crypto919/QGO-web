// Módulo Paneles

let newDishCustomImageData = null;
let editDishCustomImageData = null;
let lastComercioOrderCount = -1;

let currentAdminTab = 'orders';
let adminOrdersFilter = 'all';
let adminUserSearchQuery = '';
let adminUserRoleFilterVal = 'ALL';

function processUploadedDishImage(file, callback) {
  if (!file) return;
  if (!file.type || !file.type.startsWith('image/')) {
    showToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP)', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 600;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      callback(dataUrl);
    };
    img.onerror = () => {
      showToast('Error al procesar la imagen seleccionada', 'error');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function initComercioMenuManagement() {
  const tabOrders = document.getElementById('tabComercioOrders');
  const tabMenu = document.getElementById('tabComercioMenu');
  const secOrders = document.getElementById('comercioOrdersSection');
  const secMenu = document.getElementById('comercioMenuSection');

  if (tabOrders && tabMenu) {
    tabOrders.onclick = () => {
      tabOrders.classList.add('active');
      tabMenu.classList.remove('active');
      if (secOrders) secOrders.style.display = 'block';
      if (secMenu) secMenu.style.display = 'none';
      window.location.hash = '#comercio/orders';
      sessionStorage.setItem('qgo_current_hash', '#comercio/orders');
      renderComercioOrders();
    };

    tabMenu.onclick = () => {
      tabMenu.classList.add('active');
      tabOrders.classList.remove('active');
      if (secOrders) secOrders.style.display = 'none';
      if (secMenu) secMenu.style.display = 'block';
      window.location.hash = '#comercio/menu';
      sessionStorage.setItem('qgo_current_hash', '#comercio/menu');
      renderComercioMenuManagement();
    };
  }

  const newDishSelect = document.getElementById('newDishImageSelect');
  const newDishPreview = document.getElementById('newDishPreviewImg');
  const newDishFile = document.getElementById('newDishFileInput');
  const newDishLabel = document.getElementById('newDishFileLabel');

  if (newDishSelect && newDishPreview) {
    newDishSelect.onchange = () => {
      newDishCustomImageData = null;
      newDishPreview.src = newDishSelect.value;
      if (newDishLabel) newDishLabel.textContent = 'Foto predeterminada';
    };
  }

  if (newDishFile) {
    newDishFile.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      processUploadedDishImage(file, (dataUrl) => {
        newDishCustomImageData = dataUrl;
        if (newDishPreview) newDishPreview.src = dataUrl;
        if (newDishLabel) newDishLabel.textContent = `✅ ${file.name.slice(0, 16)}...`;
        showToast('¡Foto cargada exitosamente para este platillo!', 'success');
      });
    };
  }

  const formNewDish = document.getElementById('formAddNewDish');
  if (formNewDish) {
    formNewDish.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('newDishName').value.trim();
      const category = document.getElementById('newDishCategory').value.trim();
      const price = parseFloat(document.getElementById('newDishPrice').value) || 30;
      const image = newDishCustomImageData || (newDishSelect ? newDishSelect.value : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600');
      const desc = document.getElementById('newDishDesc').value.trim();

      const rest = getActiveComercioRestaurant();
      if (!rest) {
        showToast('No se encontró el restaurante asociado', 'info');
        return;
      }

      const newDish = {
        id: 'dish-' + Date.now(),
        name: name,
        category: category,
        price: price,
        description: desc,
        image: image,
        popular: true
      };

      const allRestaurants = getStoredRestaurants();
      const targetRest = allRestaurants.find(r => r.id === rest.id);
      if (targetRest) {
        targetRest.menu.unshift(newDish);
        saveStoredRestaurants(allRestaurants);

        formNewDish.reset();
        newDishCustomImageData = null;
        if (newDishPreview && newDishSelect) newDishPreview.src = newDishSelect.value;
        if (newDishLabel) newDishLabel.textContent = 'Foto predeterminada';

        renderComercioMenuManagement();
        playNotificationSound();
        showToast(`¡"${name}" agregado exitosamente al menú de ${targetRest.name}!`, 'success');
      }
    };
  }

  const editModal = document.getElementById('editDishModal');
  const btnCloseEditModal = document.getElementById('btnCloseEditDishModal');
  const btnCancelEditDish = document.getElementById('btnCancelEditDish');
  const formEditDish = document.getElementById('formEditDish');

  if (btnCloseEditModal && editModal) {
    btnCloseEditModal.onclick = () => editModal.classList.remove('active');
  }
  if (btnCancelEditDish && editModal) {
    btnCancelEditDish.onclick = () => editModal.classList.remove('active');
  }
  if (editModal) {
    editModal.onclick = (e) => {
      if (e.target === editModal) editModal.classList.remove('active');
    };
  }

  const editDishSelect = document.getElementById('editDishImageSelect');
  const editDishPreview = document.getElementById('editDishPreviewImg');
  const editDishFile = document.getElementById('editDishFileInput');
  const editDishLabel = document.getElementById('editDishFileLabel');

  if (editDishSelect && editDishPreview) {
    editDishSelect.onchange = () => {
      if (editDishSelect.value) {
        editDishCustomImageData = editDishSelect.value;
        editDishPreview.src = editDishSelect.value;
        if (editDishLabel) editDishLabel.textContent = 'Foto predeterminada elegida';
      }
    };
  }

  if (editDishFile) {
    editDishFile.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      processUploadedDishImage(file, (dataUrl) => {
        editDishCustomImageData = dataUrl;
        if (editDishPreview) editDishPreview.src = dataUrl;
        if (editDishLabel) editDishLabel.textContent = `✅ ${file.name.slice(0, 16)}...`;
        if (editDishSelect) editDishSelect.value = '';
        showToast('¡Foto actualizada con tu archivo!', 'success');
      });
    };
  }

  if (formEditDish) {
    formEditDish.onsubmit = (e) => {
      e.preventDefault();
      const dishId = document.getElementById('editDishId').value;
      const name = document.getElementById('editDishName').value.trim();
      const category = document.getElementById('editDishCategory').value.trim();
      const price = parseFloat(document.getElementById('editDishPrice').value) || 10;
      const desc = document.getElementById('editDishDesc').value.trim();

      const rest = getActiveComercioRestaurant();
      if (!rest) return;

      const allRestaurants = getStoredRestaurants();
      const targetRest = allRestaurants.find(r => r.id === rest.id);
      if (!targetRest) return;

      const targetDish = targetRest.menu.find(d => d.id === dishId);
      if (!targetDish) {
        showToast('No se encontró el platillo a modificar', 'error');
        return;
      }

      targetDish.name = name;
      targetDish.category = category;
      targetDish.price = price;
      targetDish.description = desc;
      if (editDishCustomImageData) {
        targetDish.image = editDishCustomImageData;
      }

      saveStoredRestaurants(allRestaurants);
      if (editModal) editModal.classList.remove('active');
      renderComercioMenuManagement();
      playNotificationSound();
      showToast(`¡Platillo "${name}" modificado exitosamente!`, 'success');
    };
  }
}

function getActiveComercioRestaurant() {
  const state = window.QgoState;
  const restaurants = getStoredRestaurants();
  if (state.currentUser && state.currentUser.comercioId) {
    const match = restaurants.find(r => r.id === state.currentUser.comercioId);
    if (match) return match;
  }
  return restaurants[0];
}

function renderComercioDashboard() {
  const rest = getActiveComercioRestaurant();
  const titleEl = document.getElementById('comercioTitle');
  const restNameText = document.getElementById('comercioRestNameText');

  if (titleEl && rest) titleEl.textContent = `Panel de Cocina: ${rest.name}`;
  if (restNameText && rest) restNameText.textContent = rest.name;

  const hash = window.location.hash || sessionStorage.getItem('qgo_current_hash');
  if (hash === '#comercio/menu') {
    const tabMenu = document.getElementById('tabComercioMenu');
    if (tabMenu) tabMenu.click();
  } else {
    const tabOrders = document.getElementById('tabComercioOrders');
    if (tabOrders) tabOrders.click();
  }
}

function renderComercioOrders() {
  const orders = QgoAPI.getOrders();
  const rest = getActiveComercioRestaurant();

  const restOrders = orders.filter(o => {
    if (!o.restaurante) return false;
    if (!rest) return true;
    return o.restaurante.id === rest.id || (o.restaurante.name && rest.name && o.restaurante.name.toLowerCase().includes(rest.name.toLowerCase()));
  });

  const colNuevos = document.getElementById('comercioColNuevos');
  const colCocina = document.getElementById('comercioColCocina');
  const colListos = document.getElementById('comercioColListos');
  if (!colNuevos || !colCocina || !colListos) return;

  const nuevos = restOrders.filter(o => o.estado === 'CONFIRMADO' || o.estado === 'PENDIENTE');
  const cocina = restOrders.filter(o => o.estado === 'EN_PREPARACION');
  const listos = restOrders.filter(o => o.estado === 'EN_CAMINO' || o.estado === 'ENTREGADO');

  if (lastComercioOrderCount !== -1 && nuevos.length > lastComercioOrderCount) {
    playNotificationSound();
    const clientName = nuevos[0].cliente ? nuevos[0].cliente.nombre : 'Cliente Chapín';
    showToast(`🔔 ¡Nuevo pedido ${nuevos[0].id} recibido de ${clientName}!`, 'info');
  }
  lastComercioOrderCount = nuevos.length;

  colNuevos.innerHTML = nuevos.length ? nuevos.map(o => renderComercioOrderCard(o, '👨‍🍳 Enviar a Cocina ➔', 'EN_PREPARACION')).join('') : '<p style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">No hay nuevos pedidos pendientes.</p>';
  colCocina.innerHTML = cocina.length ? cocina.map(o => renderComercioOrderCard(o, '📦 Listo para Entrega (Llamar Repartidor) ➔', 'EN_CAMINO')).join('') : '<p style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">Cocina libre. Sin platillos en preparación.</p>';
  colListos.innerHTML = listos.length ? listos.map(o => renderComercioOrderCard(o, null, null)).join('') : '<p style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">Sin pedidos despachados.</p>';

  document.querySelectorAll('.btn-comercio-action').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const targetState = btn.dataset.targetState;
      const extra = (targetState === 'EN_CAMINO')
        ? { posicionRepartidorPct: 10, tiempoEstimadoMinutos: 15 }
        : { posicionRepartidorPct: 5, tiempoEstimadoMinutos: 20 };

      QgoAPI.updateOrderStatus(orderId, targetState, extra);
      playNotificationSound();
      showToast(`Pedido ${orderId}: ${targetState === 'EN_PREPARACION' ? 'Enviado a cocina para preparación' : 'Despachado al repartidor'}`, 'success');
      renderComercioOrders();
    };
  });
}

function renderComercioOrderCard(order, actionText, nextState) {
  let statusBadge = '';
  if (order.estado === 'CONFIRMADO' || order.estado === 'PENDIENTE') {
    statusBadge = '<span style="font-size:0.75rem; background:#FEF3C7; color:#92400E; padding:3px 8px; border-radius:12px; font-weight:800;">🔔 Nuevo</span>';
  } else if (order.estado === 'EN_PREPARACION') {
    statusBadge = '<span style="font-size:0.75rem; background:#E0F2FE; color:#0369A1; padding:3px 8px; border-radius:12px; font-weight:800;">👨‍🍳 En Cocina</span>';
  } else if (order.estado === 'EN_CAMINO') {
    statusBadge = `<span style="font-size:0.75rem; background:#DCFCE7; color:#15803D; padding:3px 8px; border-radius:12px; font-weight:800;">🛵 En Ruta (${order.posicionRepartidorPct || 0}%)</span>`;
  } else if (order.estado === 'ENTREGADO') {
    statusBadge = '<span style="font-size:0.75rem; background:#DCFCE7; color:#15803D; padding:3px 8px; border-radius:12px; font-weight:800;">✅ Entregado</span>';
  }

  const clientName = order.cliente ? order.cliente.nombre : 'Cliente Chapín';
  const clientAddr = order.cliente ? order.cliente.direccion : 'Guatemala';

  return `
    <div class="kanban-order-card" style="background:white; border-radius:var(--radius-md); padding:14px; border:1px solid var(--border-subtle); margin-bottom:12px; box-shadow:var(--shadow-sm);">
      <div class="kanban-order-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; font-size:0.95rem;">${escapeHTML(order.id)}</span>
        ${statusBadge}
      </div>
      <div style="font-size:0.86rem; font-weight:700; color:var(--text-main); margin-bottom:4px;">
        Cliente: ${escapeHTML(clientName)}
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">
        📍 Entrega: ${escapeHTML(clientAddr)}
      </div>
      <div style="font-size:0.82rem; color:var(--text-main); background:var(--bg-subtle); padding:6px 10px; border-radius:6px; margin-bottom:10px;">
        ${(order.items || []).map(i => `<b>${i.quantity}x</b> ${escapeHTML(i.name)}`).join('<br>')}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
        <span style="color:var(--primary); font-weight:800; font-size:0.95rem;">Q${order.total}</span>
        ${actionText ? `
          <button class="btn-action-col btn-comercio-action" data-order-id="${escapeHTML(order.id)}" data-target-state="${escapeHTML(nextState)}" style="background:var(--primary); color:white; padding:7px 14px; border-radius:var(--radius-full); font-weight:700; font-size:0.82rem; border:none; cursor:pointer;">
            ${actionText}
          </button>
        ` : `<div style="font-size:0.76rem; color:var(--accent-green); font-weight:700;">✓ Despachado al repartidor</div>`}
      </div>
    </div>
  `;
}

function renderComercioMenuManagement() {
  const rest = getActiveComercioRestaurant();
  const container = document.getElementById('comercioDishesList');
  if (!container || !rest) return;

  if (!rest.menu || rest.menu.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 8px;">🍽️</div>
        <div style="font-weight: 700; font-size: 1rem; color: var(--text-main);">No hay platillos en el menú de ${escapeHTML(rest.name)}</div>
        <p style="font-size: 0.85rem;">Utiliza el formulario de arriba para agregar platillos con su fotografía.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = rest.menu.map(item => `
    <div class="comercio-dish-card" style="background: white; border-radius: var(--radius-md); padding: 14px; border: 1px solid var(--border-subtle); display: flex; flex-direction: column; justify-content: space-between; gap: 12px; box-shadow: var(--shadow-sm);">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <img src="${item.image}" alt="${escapeHTML(item.name)}" style="width: 70px; height: 70px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; border: 1px solid var(--border-subtle);" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 6px;">
            <h4 style="font-weight: 800; font-size: 0.95rem; margin: 0; color: var(--text-main); line-height: 1.3;">${escapeHTML(item.name)}</h4>
            <span style="font-size: 0.7rem; background: #DCFCE7; color: #15803D; padding: 2px 8px; border-radius: var(--radius-full); font-weight: 700; white-space: nowrap;">En Menú</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin: 3px 0 5px 0;">🏷️ ${escapeHTML(item.category || 'General')}</div>
          <div style="font-size: 0.8rem; color: var(--text-main); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; margin-bottom: 6px;">
            ${escapeHTML(item.description || 'Sin descripción.')}
          </div>
          <div style="font-size: 1.05rem; font-weight: 800; color: var(--primary);">Q${Number(item.price).toFixed(2)}</div>
        </div>
      </div>

      <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-subtle); padding-top: 10px; margin-top: 4px;">
        <button type="button" class="btn-edit-dish" data-dish-id="${escapeHTML(item.id)}" style="flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 12px; background: #F1F5F9; color: var(--text-main); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 700; cursor: pointer;">
          ✏️ Modificar
        </button>
        <button type="button" class="btn-delete-dish" data-dish-id="${escapeHTML(item.id)}" data-dish-name="${escapeHTML(item.name)}" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 12px; background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 700; cursor: pointer;">
          🗑️ Eliminar
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-delete-dish').forEach(btn => {
    btn.onclick = () => {
      const dishId = btn.dataset.dishId;
      const dishName = btn.dataset.dishName;
      if (!dishId) return;

      if (confirm(`¿Estás seguro de que deseas eliminar "${dishName}" del menú de ${rest.name}?`)) {
        const allRestaurants = getStoredRestaurants();
        const targetRest = allRestaurants.find(r => r.id === rest.id);
        if (targetRest) {
          targetRest.menu = targetRest.menu.filter(d => d.id !== dishId);
          saveStoredRestaurants(allRestaurants);
          renderComercioMenuManagement();
          playNotificationSound();
          showToast(`¡"${dishName}" ha sido eliminado del menú!`, 'info');
        }
      }
    };
  });

  container.querySelectorAll('.btn-edit-dish').forEach(btn => {
    btn.onclick = () => {
      const dishId = btn.dataset.dishId;
      if (!dishId) return;

      const currentRest = getActiveComercioRestaurant();
      if (!currentRest) return;

      const targetDish = currentRest.menu.find(d => d.id === dishId);
      if (!targetDish) return;

      document.getElementById('editDishId').value = targetDish.id;
      document.getElementById('editDishName').value = targetDish.name;
      document.getElementById('editDishCategory').value = targetDish.category;
      document.getElementById('editDishPrice').value = targetDish.price;
      document.getElementById('editDishDesc').value = targetDish.description || '';

      editDishCustomImageData = targetDish.image;
      const editDishPreview = document.getElementById('editDishPreviewImg');
      if (editDishPreview) editDishPreview.src = targetDish.image;
      const editDishLabel = document.getElementById('editDishFileLabel');
      if (editDishLabel) editDishLabel.textContent = 'Foto actual del platillo';
      const editDishSelect = document.getElementById('editDishImageSelect');
      if (editDishSelect) editDishSelect.value = '';

      const editModal = document.getElementById('editDishModal');
      if (editModal) editModal.classList.add('active');
    };
  });
}

function renderRepartidorDashboard() {
  const orders = QgoAPI.getOrders();
  const container = document.getElementById('repartidorOrdersList');
  if (!container) return;

  const delivered = orders.filter(o => o.estado === 'ENTREGADO');
  const earningsElem = document.getElementById('driverKpiEarnings');
  const tipsElem = document.getElementById('driverKpiTips');
  const countElem = document.getElementById('driverKpiCount');

  const deliveryFeeEarned = delivered.length * 18.00;
  const tipsEarned = delivered.length * 5.00;
  const totalEarnings = deliveryFeeEarned + tipsEarned;

  if (earningsElem) earningsElem.textContent = `Q${totalEarnings.toFixed(2)}`;
  if (tipsElem) tipsElem.textContent = `Q${tipsEarned.toFixed(2)}`;
  if (countElem) countElem.textContent = `${delivered.length}`;

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
        <div style="font-size:2.5rem; margin-bottom:10px;">🛵</div>
        <div style="font-weight:700; font-size:1.1rem; color:var(--text-main);">No hay pedidos activos asignados</div>
        <p style="font-size:0.88rem;">Cuando un cliente realice un pedido, aparecerá aquí inmediatamente para que lo recojas y entregues.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const isProgressiveActive = (typeof progressiveNavState !== 'undefined') && progressiveNavState.isDriving && progressiveNavState.orderId === order.id;
    const clientName = order.cliente ? order.cliente.nombre : 'Cliente Chapín';
    const clientAddr = order.cliente ? order.cliente.direccion : 'Guatemala';
    const restName = order.restaurante ? order.restaurante.name : 'Restaurante';
    const restAddr = order.restaurante ? order.restaurante.address : 'Guatemala';

    return `
      <div style="background:white; border-radius:var(--radius-md); padding:18px; border:1px solid var(--border-subtle); margin-bottom:16px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main);">Pedido ${order.id}</h4>
          <span class="badge-role REPARTIDOR" style="font-size:0.75rem; padding:4px 12px; font-weight:800;">${order.estado}</span>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px; line-height:1.6;">
          <div>🏬 <b>Restaurante (Origen):</b> <span style="color:var(--text-main); font-weight:700;">${escapeHTML(restName)}</span> (${escapeHTML(restAddr)})</div>
          <div>🏠 <b>Cliente (Destino):</b> <span style="color:var(--text-main); font-weight:700;">${escapeHTML(clientName)}</span> - ${escapeHTML(clientAddr)}</div>
          <div>💵 <b>Cobro / Facturación:</b> ${(order.metodoPago || '').includes('Efectivo') ? `<b style="color:var(--primary);">Cobrar Q${Number(order.total).toFixed(2)} en Efectivo al cliente</b>` : `Pagado Online con Tarjeta (Q${Number(order.total).toFixed(2)})`}</div>
          <div>🛵 <b>Progreso GPS sobre la calle:</b> <b style="color:#02a54b;">${order.posicionRepartidorPct || 0}%</b></div>
        </div>

        <div style="width:100%; height:8px; background:#E2E8F0; border-radius:4px; overflow:hidden; margin-bottom:14px;">
          <div style="width:${order.posicionRepartidorPct || 0}%; height:100%; background:linear-gradient(90deg, #02a54b 0%, #239414 100%); border-radius:4px; transition:width 0.2s ease;"></div>
        </div>

        <div style="display:flex; gap:8px; margin-top:8px; flex-wrap:wrap;">
          ${(order.estado === 'PENDIENTE' || order.estado === 'CONFIRMADO' || order.estado === 'EN_PREPARACION') ? `
            <button class="btn-repartidor-action" data-order-id="${order.id}" data-action="tomar" style="background:var(--primary); color:white; padding:9px 18px; border-radius:var(--radius-full); font-weight:700; font-size:0.84rem; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <span>🛵</span>
              <span>Aceptar Pedido y Esperar en Cocina</span>
            </button>
          ` : ''}

          ${order.estado === 'EN_CAMINO' ? `
            <button class="btn-repartidor-action" data-order-id="${order.id}" data-action="iniciar-progresivo" style="background:${isProgressiveActive ? '#FEF3C7' : '#02a54b'}; color:${isProgressiveActive ? '#B45309' : 'white'}; padding:9px 18px; border-radius:var(--radius-full); font-weight:700; font-size:0.84rem; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <span>${isProgressiveActive ? '⏸️' : '🚀'}</span>
              <span>${isProgressiveActive ? 'Pausar Recorrido GPS' : 'Iniciar Recorrido Progresivo GPS'}</span>
            </button>
            <button class="btn-repartidor-action" data-order-id="${order.id}" data-action="ver-mapa" style="background:#0284C7; color:white; padding:9px 16px; border-radius:var(--radius-full); font-weight:700; font-size:0.84rem; border:none; cursor:pointer;">
              🗺️ Ver Mapa en Vivo
            </button>
            <button class="btn-repartidor-action" data-order-id="${order.id}" data-action="entregar" style="background:var(--accent-green); color:white; padding:9px 18px; border-radius:var(--radius-full); font-weight:700; font-size:0.84rem; border:none; cursor:pointer;">
              ✓ Confirmar Entrega
            </button>
          ` : ''}

          ${order.estado === 'ENTREGADO' ? `
            <span style="font-size:0.84rem; color:var(--accent-green); font-weight:700; display:inline-flex; align-items:center; gap:6px; background:#DCFCE7; padding:6px 12px; border-radius:var(--radius-full);">
              ✅ Pedido Entregado al Cliente · Ganancia acreditada: Q23.00
            </span>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-repartidor-action').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const action = btn.dataset.action;
      const targetOrder = orders.find(o => o.id === orderId);

      if (action === 'tomar') {
        QgoAPI.updateOrderStatus(orderId, 'EN_CAMINO', { posicionRepartidorPct: 10, tiempoEstimadoMinutos: 15 });
        showToast(`🛵 Pedido aceptado. Ve a recogerlo a ${targetOrder && targetOrder.restaurante ? targetOrder.restaurante.name : 'el local'}.`, 'success');
        renderRepartidorDashboard();
      } else if (action === 'iniciar-progresivo') {
        if (targetOrder && typeof startProgressiveRouteNavigation === 'function') {
          startProgressiveRouteNavigation(targetOrder);
          renderRepartidorDashboard();
        }
      } else if (action === 'ver-mapa') {
        if (targetOrder && typeof openTrackingView === 'function') {
          openTrackingView(targetOrder);
        }
      } else if (action === 'entregar') {
        if (targetOrder && typeof finishOrderDelivery === 'function') {
          finishOrderDelivery(targetOrder);
          renderRepartidorDashboard();
        }
      }
    };
  });
}

function initAdminDashboard() {
  const tabOrders = document.getElementById('tabAdminOrders');
  const tabUsers = document.getElementById('tabAdminUsers');
  const tabRestaurants = document.getElementById('tabAdminRestaurants');
  const tabCoupons = document.getElementById('tabAdminCoupons');

  const secOrders = document.getElementById('adminSectionOrders');
  const secUsers = document.getElementById('adminSectionUsers');
  const secRestaurants = document.getElementById('adminSectionRestaurants');
  const secCoupons = document.getElementById('adminSectionCoupons');

  const tabs = [
    { btn: tabOrders, sec: secOrders, name: 'orders' },
    { btn: tabUsers, sec: secUsers, name: 'users' },
    { btn: tabRestaurants, sec: secRestaurants, name: 'restaurants' },
    { btn: tabCoupons, sec: secCoupons, name: 'coupons' }
  ];

  tabs.forEach(t => {
    if (!t.btn) return;
    t.btn.onclick = () => {
      tabs.forEach(o => {
        if (o.btn) o.btn.classList.remove('active');
        if (o.sec) o.sec.style.display = 'none';
      });
      t.btn.classList.add('active');
      if (t.sec) t.sec.style.display = 'block';
      currentAdminTab = t.name;
      renderAdminDashboard();
    };
  });

  document.querySelectorAll('.btn-filter-admin-orders').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.btn-filter-admin-orders').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      adminOrdersFilter = btn.dataset.filter || 'all';
      renderAdminOrdersTab();
    };
  });

  const searchInput = document.getElementById('adminUserSearchInput');
  if (searchInput) {
    searchInput.oninput = (e) => {
      adminUserSearchQuery = (e.target.value || '').toLowerCase().trim();
      renderAdminUsersTab();
    };
  }

  const roleFilter = document.getElementById('adminUserRoleFilter');
  if (roleFilter) {
    roleFilter.onchange = (e) => {
      adminUserRoleFilterVal = e.target.value;
      renderAdminUsersTab();
    };
  }

  const modalEditUser = document.getElementById('adminEditUserModal');
  const btnCloseEditModal = document.getElementById('btnCloseAdminEditUserModal');
  const btnCancelEditModal = document.getElementById('btnCancelAdminEditUser');
  const formEditUser = document.getElementById('formAdminEditUser');

  function closeEditUserModal() {
    if (modalEditUser) modalEditUser.classList.remove('active');
  }

  if (btnCloseEditModal) btnCloseEditModal.onclick = closeEditUserModal;
  if (btnCancelEditModal) btnCancelEditModal.onclick = closeEditUserModal;
  if (modalEditUser) {
    modalEditUser.onclick = (e) => {
      if (e.target === modalEditUser) closeEditUserModal();
    };
  }

  if (formEditUser) {
    formEditUser.onsubmit = async (e) => {
      e.preventDefault();
      const state = window.QgoState;
      const userId = document.getElementById('adminEditUserId').value;
      const nombre = document.getElementById('adminEditUserName').value.trim();
      const correo = document.getElementById('adminEditUserEmail').value.trim();
      const contrasena = document.getElementById('adminEditUserPass').value.trim();
      const rol = document.getElementById('adminEditUserRole').value;

      const updated = await QgoAPI.actualizarUsuario({
        id: userId,
        nombre,
        correo,
        contrasena,
        rol
      });

      if (updated) {
        showToast(`Usuario ${updated.nombre} actualizado con éxito`, 'success');
        if (state.currentUser && String(state.currentUser.id) === String(updated.id)) {
          state.currentUser = { ...state.currentUser, ...updated };
          localStorage.setItem('qgo_logged_user_id', updated.id);
          if (typeof setCurrentUser === 'function') setCurrentUser(state.currentUser);
        }
      }
      closeEditUserModal();
      renderAdminUsersTab();
    };
  }

  const formCreateUser = document.getElementById('adminCreateUserForm');
  if (formCreateUser) {
    formCreateUser.onsubmit = async (e) => {
      e.preventDefault();
      const nuevo = {
        nombre: document.getElementById('newUserName').value.trim(),
        correo: document.getElementById('newUserEmail').value.trim(),
        contrasena: document.getElementById('newUserPass').value.trim(),
        rol: document.getElementById('newUserRole').value
      };

      const saved = await QgoAPI.guardarUsuario(nuevo);
      showToast(`Usuario ${saved.nombre} registrado con rol ${saved.rol}`, 'success');
      formCreateUser.reset();
      renderAdminDashboard();
    };
  }

  const formCoupon = document.getElementById('adminCreateCouponForm');
  if (formCoupon) {
    formCoupon.onsubmit = (e) => {
      e.preventDefault();
      const code = document.getElementById('newCouponCode').value.trim().toUpperCase();
      const type = document.getElementById('newCouponType').value;
      const discount = Number(document.getElementById('newCouponValue').value);
      const label = document.getElementById('newCouponLabel').value.trim();

      if (!code) {
        showToast('Ingresa un código válido para el cupón', 'error');
        return;
      }

      QgoAPI.saveCoupon({
        code,
        type,
        discount,
        label: label || (type === 'percent' ? `${discount}% de descuento` : (type === 'free_delivery' ? 'Envío Gratis' : `Q${discount} de descuento`))
      });

      showToast(`¡Cupón ${code} creado y activado en checkout!`, 'success');
      formCoupon.reset();
      renderAdminCouponsTab();
    };
  }
}

function renderAdminOrdersTab() {
  const orders = QgoAPI.getOrders();
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const platformEarnings = orders.reduce((sum, o) => sum + ((o.serviceFee !== undefined ? Number(o.serviceFee) : 5) + Math.round((Number(o.subtotal) || Number(o.total)) * 0.05)), 0);
  const totalTips = orders.reduce((sum, o) => sum + (Number(o.tip) || Number(o.propina) || 0), 0);

  const kpiOrders = document.getElementById('adminKpiOrders');
  const kpiSales = document.getElementById('adminKpiSales');
  const kpiEarnings = document.getElementById('adminKpiPlatformEarnings');
  const kpiTips = document.getElementById('adminKpiTips');

  if (kpiOrders) kpiOrders.textContent = totalOrders;
  if (kpiSales) kpiSales.textContent = `Q${totalSales.toFixed(2)}`;
  if (kpiEarnings) kpiEarnings.textContent = `Q${platformEarnings.toFixed(2)}`;
  if (kpiTips) kpiTips.textContent = `Q${totalTips.toFixed(2)}`;

  let filtered = [...orders];
  if (adminOrdersFilter === 'active') {
    filtered = filtered.filter(o => o.estado === 'PENDIENTE' || o.estado === 'EN_PREPARACION' || o.estado === 'EN_CAMINO');
  } else if (adminOrdersFilter === 'completed') {
    filtered = filtered.filter(o => o.estado === 'ENTREGADO');
  }

  const tbody = document.getElementById('adminOrdersTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 28px; color: var(--text-muted); font-size: 0.9rem;">
          No hay pedidos registrados en este filtro.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const clientName = o.cliente ? o.cliente.nombre : (o.guestInfo ? o.guestInfo.nombre : 'Cliente Invitado');
    const clientPhone = o.cliente && o.cliente.telefono ? o.cliente.telefono : (o.guestInfo && o.guestInfo.telefono ? o.guestInfo.telefono : '502 5555-1234');
    const restName = o.restaurante ? o.restaurante.name : 'Restaurante';
    const branchName = o.sucursal ? o.sucursal.name : 'Sede Central';
    const driverName = o.repartidor ? o.repartidor.nombre : null;

    return `
      <tr>
        <td>
          <b style="color: var(--primary-color);">#${escapeHTML(o.id)}</b>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${o.fecha ? new Date(o.fecha).toLocaleDateString('es-GT', { hour: '2-digit', minute: '2-digit' }) : 'Hoy'}</div>
        </td>
        <td>
          <div style="font-weight: 700;">${escapeHTML(clientName)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">📱 ${escapeHTML(clientPhone)}</div>
        </td>
        <td>
          <div style="font-weight: 700;">${escapeHTML(restName)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">📍 ${escapeHTML(branchName)}</div>
        </td>
        <td>
          ${driverName ? `<span style="font-weight: 600;">🛵 ${escapeHTML(driverName)}</span>` : `<span style="color: #D97706; font-size: 0.78rem; font-weight: 700; background: #FEF3C7; padding: 2px 6px; border-radius: 4px;">⚠️ Sin Asignar</span>`}
        </td>
        <td>
          <b style="font-size: 0.95rem; color: var(--text-main);">Q${Number(o.total).toFixed(2)}</b>
        </td>
        <td>
          <span style="font-size: 0.78rem; background: #F1F5F9; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${escapeHTML(o.metodoPago || 'Efectivo')}</span>
        </td>
        <td>
          <select class="admin-change-status-select" data-order-id="${escapeHTML(o.id)}" style="padding: 5px 8px; font-size: 0.78rem; font-weight: 700; border-radius: 6px; border: 1.5px solid var(--border-subtle); background: white; cursor: pointer;">
            <option value="PENDIENTE" ${o.estado === 'PENDIENTE' ? 'selected' : ''}>⏳ Recibido</option>
            <option value="EN_PREPARACION" ${o.estado === 'EN_PREPARACION' ? 'selected' : ''}>🍳 En Preparación</option>
            <option value="EN_CAMINO" ${o.estado === 'EN_CAMINO' ? 'selected' : ''}>🛵 En Camino</option>
            <option value="ENTREGADO" ${o.estado === 'ENTREGADO' ? 'selected' : ''}>✅ Entregado</option>
            <option value="CANCELADO" ${o.estado === 'CANCELADO' ? 'selected' : ''}>❌ Cancelado</option>
          </select>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
            <button type="button" class="btn-admin-order-receipt" data-order-id="${escapeHTML(o.id)}" title="Ver Comprobante SAT FEL" style="padding: 5px 9px; font-size: 0.78rem; font-weight: 700; border: 1px solid var(--border-subtle); background: white; border-radius: 6px; cursor: pointer;">🧾 Ticket</button>
            <button type="button" class="btn-admin-order-track" data-order-id="${escapeHTML(o.id)}" title="Ver Ruta en Mapa Leaflet" style="padding: 5px 9px; font-size: 0.78rem; font-weight: 700; border: 1px solid var(--border-subtle); background: white; border-radius: 6px; cursor: pointer;">🗺️ GPS</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.admin-change-status-select').forEach(sel => {
    sel.onchange = () => {
      const orderId = sel.dataset.orderId;
      const newStatus = sel.value;
      const allOrders = QgoAPI.getOrders();
      const target = allOrders.find(ord => ord.id === orderId);
      if (target) {
        target.estado = newStatus;
        if (newStatus === 'ENTREGADO') {
          target.entregadoAt = new Date().toISOString();
        }
        localStorage.setItem('qgo_orders', JSON.stringify(allOrders));
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: target }));
        showToast(`Pedido #${target.id} actualizado a ${newStatus}`, 'success');
        renderAdminOrdersTab();
      }
    };
  });

  tbody.querySelectorAll('.btn-admin-order-receipt').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const allOrders = QgoAPI.getOrders();
      const target = allOrders.find(ord => ord.id === orderId);
      if (target && typeof openReceiptView === 'function') {
        openReceiptView(target);
      }
    };
  });

  tbody.querySelectorAll('.btn-admin-order-track').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const allOrders = QgoAPI.getOrders();
      const target = allOrders.find(ord => ord.id === orderId);
      if (target && typeof openTrackingView === 'function') {
        openTrackingView(target, true);
      }
    };
  });
}

async function renderAdminUsersTab() {
  const state = window.QgoState;
  let users = await QgoAPI.getUsuarios();
  const countEl = document.getElementById('adminUsersCountText');
  if (countEl) countEl.textContent = users.length;

  let filtered = [...users];
  if (adminUserRoleFilterVal !== 'ALL') {
    filtered = filtered.filter(u => u.rol === adminUserRoleFilterVal);
  }
  if (adminUserSearchQuery) {
    filtered = filtered.filter(u =>
      (u.nombre && u.nombre.toLowerCase().includes(adminUserSearchQuery)) ||
      (u.correo && u.correo.toLowerCase().includes(adminUserSearchQuery))
    );
  }

  const tbody = document.getElementById('adminUsersTableBody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.9rem;">
          No se encontraron cuentas con el criterio especificado.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td>#${escapeHTML(String(u.id))}</td>
      <td style="font-weight:700;">${escapeHTML(u.nombre)}</td>
      <td>
        <div>${escapeHTML(u.correo)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">Clave: <b>${escapeHTML(u.contrasena || '••••••')}</b></div>
      </td>
      <td><span class="badge-role ${escapeHTML(u.rol)}">${escapeHTML(u.rol)}</span></td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
          <button type="button" class="btn-admin-edit-user" data-user-id="${escapeHTML(String(u.id))}" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border: 1px solid var(--border-subtle); background: white; border-radius: 6px; cursor: pointer;">✏️ Editar</button>
          ${state.currentUser && String(state.currentUser.id) === String(u.id) ? `
            <span style="font-size: 0.75rem; color: var(--text-muted); padding: 5px 8px;">(Tu sesión)</span>
          ` : `
            <button type="button" class="btn-admin-delete-user" data-user-id="${escapeHTML(String(u.id))}" data-user-name="${escapeHTML(u.nombre)}" style="padding: 5px 10px; font-size: 0.78rem; font-weight: 700; border: 1px solid #FEE2E2; background: #FEF2F2; color: #DC2626; border-radius: 6px; cursor: pointer;">🗑️ Eliminar</button>
          `}
        </div>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-admin-edit-user').forEach(btn => {
    btn.onclick = () => {
      const uid = btn.dataset.userId;
      const target = users.find(u => String(u.id) === String(uid));
      if (target) {
        document.getElementById('adminEditUserId').value = target.id;
        document.getElementById('adminEditUserName').value = target.nombre || '';
        document.getElementById('adminEditUserEmail').value = target.correo || '';
        document.getElementById('adminEditUserPass').value = target.contrasena || '';
        document.getElementById('adminEditUserRole').value = target.rol || 'CLIENTE';

        const modal = document.getElementById('adminEditUserModal');
        if (modal) modal.classList.add('active');
      }
    };
  });

  tbody.querySelectorAll('.btn-admin-delete-user').forEach(btn => {
    btn.onclick = async () => {
      const uid = btn.dataset.userId;
      const uname = btn.dataset.userName;
      if (confirm(`¿Estás seguro de que deseas eliminar la cuenta de "${uname}"? Esta acción no se puede deshacer.`)) {
        await QgoAPI.eliminarUsuario(uid);
        showToast(`Usuario "${uname}" eliminado correctamente`, 'info');
        renderAdminUsersTab();
      }
    };
  });
}

function renderAdminRestaurantsTab() {
  const state = window.QgoState;
  const grid = document.getElementById('adminRestaurantsGrid');
  if (!grid) return;

  const restaurants = (window.QgoData && typeof window.QgoData.getRestaurants === 'function') ? window.QgoData.getRestaurants() : (getStoredRestaurants ? getStoredRestaurants() : []);

  if (restaurants.length === 0) {
    grid.innerHTML = '<div style="color: var(--text-muted); padding: 20px;">No hay restaurantes registrados.</div>';
    return;
  }

  grid.innerHTML = restaurants.map(r => {
    const isPaused = localStorage.getItem(`qgo_rest_paused_${r.id}`) === 'true';
    const sucursalesCount = r.sucursales ? r.sucursales.length : 1;
    const menuCount = r.menu ? r.menu.length : 0;
    const categoriesText = (r.categories || []).join(' • ');

    return `
      <div style="background: white; border: 1.5px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
        <div style="position: relative; height: 120px; overflow: hidden; background: #0F172A;">
          <img src="${r.image}" alt="${escapeHTML(r.name)}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'">
          <div style="position: absolute; top: 10px; right: 10px;">
            ${isPaused ? `
              <span style="background: #FEE2E2; color: #DC2626; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid #FCA5A5;">⏸️ Pausado</span>
            ` : `
              <span style="background: #DCFCE7; color: #166534; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid #86EFAC;">🟢 En Línea</span>
            `}
          </div>
          <div style="position: absolute; bottom: 8px; left: 10px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">
            ⭐ ${r.rating} (${r.reviewsCount || 100}+ reseñas)
          </div>
        </div>
        <div style="padding: 16px; display: flex; flex-direction: column; flex-grow: 1;">
          <h4 style="font-weight: 800; font-size: 1.1rem; margin: 0 0 4px 0; color: var(--text-main);">${escapeHTML(r.name)}</h4>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">${escapeHTML(categoriesText)}</div>

          <div style="display: flex; gap: 14px; font-size: 0.8rem; color: var(--text-main); margin-bottom: 16px; background: #F8FAFC; padding: 8px 12px; border-radius: 6px;">
            <span>📍 <b>${sucursalesCount}</b> sedes</span>
            <span>🍔 <b>${menuCount}</b> platillos</span>
            <span>⏱️ <b>${escapeHTML(r.deliveryTime || '25-35 min')}</b></span>
          </div>

          <div style="margin-top: auto; display: flex; gap: 8px;">
            <button type="button" class="btn-admin-rest-menu" data-rest-id="${escapeHTML(r.id)}" style="flex: 1; padding: 8px; font-size: 0.8rem; font-weight: 700; border: 1px solid var(--border-subtle); background: white; border-radius: 6px; cursor: pointer;">🍽️ Ver Menú</button>
            <button type="button" class="btn-admin-rest-toggle" data-rest-id="${escapeHTML(r.id)}" data-paused="${isPaused}" style="flex: 1; padding: 8px; font-size: 0.8rem; font-weight: 700; border: 1px solid ${isPaused ? '#86EFAC' : '#FCA5A5'}; background: ${isPaused ? '#F0FDF4' : '#FFF1F2'}; color: ${isPaused ? '#166534' : '#DC2626'}; border-radius: 6px; cursor: pointer;">
              ${isPaused ? '🟢 Reanudar' : '⏸️ Pausar'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.btn-admin-rest-menu').forEach(btn => {
    btn.onclick = () => {
      const restId = btn.dataset.restId;
      if (state.currentUser && state.currentUser.rol === 'ADMINISTRADOR') {
        const vAdmin = document.getElementById('viewAdmin');
        const vClient = document.getElementById('viewClient');
        if (vAdmin) vAdmin.style.display = 'none';
        if (vClient) vClient.style.display = 'block';
      }
      if (typeof openRestaurantView === 'function') openRestaurantView(restId, true);
    };
  });

  grid.querySelectorAll('.btn-admin-rest-toggle').forEach(btn => {
    btn.onclick = () => {
      const restId = btn.dataset.restId;
      const isPaused = btn.dataset.paused === 'true';
      localStorage.setItem(`qgo_rest_paused_${restId}`, isPaused ? 'false' : 'true');
      const rest = restaurants.find(r => r.id === restId);
      showToast(`${rest ? rest.name : 'Comercio'} ${isPaused ? 'reactivado en el sistema' : 'pausado temporalmente'}`, 'info');
      renderAdminRestaurantsTab();
    };
  });
}

function renderAdminCouponsTab() {
  const container = document.getElementById('adminCouponsListContainer');
  if (!container) return;

  const coupons = (window.QgoAPI && typeof window.QgoAPI.getCoupons === 'function') ? window.QgoAPI.getCoupons() : [];

  if (coupons.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); padding: 16px;">No hay cupones creados aún.</div>';
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
      ${coupons.map(c => {
        let badgeText = '';
        let badgeColor = '';
        if (c.type === 'free_delivery') {
          badgeText = '🛵 Envío Gratis';
          badgeColor = '#DCFCE7; color: #166534; border: 1px solid #86EFAC;';
        } else if (c.type === 'percent') {
          badgeText = `🏷️ ${c.discount}% OFF`;
          badgeColor = '#FEF3C7; color: #92400E; border: 1px solid #FCD34D;';
        } else {
          badgeText = `💰 -Q${c.discount}.00`;
          badgeColor = '#E0F2FE; color: #0369A1; border: 1px solid #7DD3FC;';
        }

        return `
          <div style="background: white; border: 1.5px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; box-shadow: var(--shadow-sm);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-family: monospace; font-size: 1.15rem; font-weight: 800; background: #F1F5F9; color: var(--primary-color); padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;">${escapeHTML(c.code)}</span>
                <span style="font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: ${badgeColor}">${badgeText}</span>
              </div>
              <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">${escapeHTML(c.label || 'Descuento oficial')}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Válido en la pasarela de compra para todos los clientes</div>
            </div>
            <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 10px;">
              <button type="button" class="btn-admin-delete-coupon" data-code="${escapeHTML(c.code)}" style="padding: 5px 12px; font-size: 0.78rem; font-weight: 700; border: 1px solid #FEE2E2; background: #FEF2F2; color: #DC2626; border-radius: 6px; cursor: pointer;">
                🗑️ Eliminar Cupón
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.querySelectorAll('.btn-admin-delete-coupon').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.code;
      if (confirm(`¿Deseas eliminar el cupón "${code}"? Ya no podrá ser canjeado por los clientes.`)) {
        QgoAPI.deleteCoupon(code);
        showToast(`Cupón ${code} eliminado`, 'info');
        renderAdminCouponsTab();
      }
    };
  });
}

async function renderAdminDashboard() {
  renderAdminOrdersTab();
  if (currentAdminTab === 'users') {
    await renderAdminUsersTab();
  } else if (currentAdminTab === 'restaurants') {
    renderAdminRestaurantsTab();
  } else if (currentAdminTab === 'coupons') {
    renderAdminCouponsTab();
  }
}
