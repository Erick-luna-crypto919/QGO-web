// Módulo Pedidos y Facturación

function getClientOrders(user) {
  if (!user) return [];
  try {
    if (user.isGuest) {
      const guestStored = sessionStorage.getItem('qgo_guest_orders');
      if (guestStored) {
        const parsed = JSON.parse(guestStored);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    }

    const allOrders = QgoAPI.getOrders();
    if (!Array.isArray(allOrders)) return [];
    return allOrders.filter(order => {
      if (!order || order.isGuestOrder) return false;
      if (order.clienteId && String(order.clienteId) === String(user.id)) return true;
      if (order.cliente && typeof order.cliente === 'object' && order.cliente.id && String(order.cliente.id) === String(user.id)) return true;
      if (order.cliente && typeof order.cliente === 'object' && order.cliente.correo && user.correo &&
          order.cliente.correo.trim().toLowerCase() === user.correo.trim().toLowerCase()) return true;
      if (order.cliente && typeof order.cliente === 'object' && order.cliente.nombre && user.nombre &&
          order.cliente.nombre.trim().toLowerCase() === user.nombre.trim().toLowerCase()) return true;
      return false;
    });
  } catch (e) {
    console.warn('Error al filtrar pedidos del cliente:', e);
    return [];
  }
}

function initOrdersHistoryModal() {
  const modal = document.getElementById('ordersHistoryModal');
  const btnOpen = document.getElementById('btnHeaderOrdersHistory');
  const btnClose = document.getElementById('btnCloseOrdersHistoryModal');
  const receiptModal = document.getElementById('receiptModal');
  const btnCloseReceipt = document.getElementById('btnCloseReceiptModal');
  const btnCloseReceipt2 = document.getElementById('btnCloseReceiptBtn');
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');

  if (btnOpen) {
    btnOpen.onclick = () => {
      const user = window.QgoState.currentUser;
      if (!user || user.rol !== 'CLIENTE') {
        showToast('El historial de pedidos solo está disponible para cuentas de cliente.', 'info');
        return;
      }
      renderOrdersHistoryList();
      modal.classList.add('active');
    };
  }
  if (btnClose) btnClose.onclick = () => modal.classList.remove('active');
  if (modal) {
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
  }

  if (btnCloseReceipt) btnCloseReceipt.onclick = () => receiptModal.classList.remove('active');
  if (btnCloseReceipt2) btnCloseReceipt2.onclick = () => receiptModal.classList.remove('active');
  if (receiptModal) {
    receiptModal.onclick = (e) => { if (e.target === receiptModal) receiptModal.classList.remove('active'); };
  }

  if (btnPrintReceipt) {
    btnPrintReceipt.onclick = () => {
      window.print();
    };
  }
}

function renderOrdersHistoryList() {
  const state = window.QgoState;
  const container = document.getElementById('ordersHistoryListContainer');
  const countEl = document.getElementById('ordersHistoryCount');
  if (!container) return;

  if (!state.currentUser || state.currentUser.rol !== 'CLIENTE') {
    if (countEl) countEl.textContent = '0 pedidos';
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 8px;">🔒</div>
        <h4>Acceso exclusivo para Clientes</h4>
        <p style="font-size: 0.85rem;">Inicia sesión con una cuenta de cliente para ver tu historial de pedidos.</p>
      </div>
    `;
    return;
  }

  const orders = getClientOrders(state.currentUser);
  if (countEl) countEl.textContent = `${orders.length} pedidos`;

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 8px;">🛒</div>
        <h4>Aún no tienes pedidos registrados, ${escapeHTML(state.currentUser.nombre || 'Cliente')}</h4>
        <p style="font-size: 0.85rem;">Tus pedidos aparecerán aquí exclusivamente para tu cuenta personal.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const dateFormatted = order.fecha ? new Date(order.fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente';
    const itemsSummary = (order.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');

    let statusColor = '#E0F2FE';
    let statusTextColor = '#0369A1';
    if (order.estado === 'ENTREGADO') {
      statusColor = '#DCFCE7';
      statusTextColor = '#166534';
    } else if (order.estado === 'EN_CAMINO') {
      statusColor = '#FEF3C7';
      statusTextColor = '#92400E';
    }

    return `
      <div class="history-order-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h4 style="margin: 0; font-size: 1rem; font-weight: 800;">${escapeHTML(order.restaurante ? order.restaurante.name : 'Restaurante')}</h4>
              <span style="font-size: 0.75rem; font-weight: 800; background: ${statusColor}; color: ${statusTextColor}; padding: 3px 8px; border-radius: 20px;">
                ${order.estado}
              </span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 3px;">
              Pedido <b>#${order.id}</b> • ${dateFormatted}
            </div>
          </div>
          <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">
            Q${order.total}
          </div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px; background: var(--bg-subtle); padding: 8px 12px; border-radius: 6px;">
          <div>🍽️ <b>Artículos:</b> ${escapeHTML(itemsSummary) || 'Varios platillos'}</div>
          <div style="margin-top: 2px;">📍 <b>Entrega:</b> ${escapeHTML(order.cliente ? order.cliente.direccion : 'Guatemala')}</div>
          ${order.sucursal ? `<div style="margin-top: 2px;">🏬 <b>Sucursal:</b> ${escapeHTML(order.sucursal.name)}</div>` : ''}
          ${order.cupon ? `<div style="margin-top: 2px; color: #166534; font-weight: 700;">🏷️ <b>Cupón Aplicado:</b> ${order.cupon} (-Q${order.descuento || 0})</div>` : ''}
        </div>

        <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
          <button type="button" class="btn-view-receipt" data-order-id="${order.id}"
            style="background: white; border: 1.5px solid var(--border-subtle); color: var(--text-main); padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.78rem; cursor: pointer;">
            🧾 Ver Ticket / Factura
          </button>
          <button type="button" class="btn-track-from-history" data-order-id="${order.id}"
            style="background: #E8F0FE; border: 1px solid #BFDBFE; color: #1D4ED8; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.78rem; cursor: pointer;">
            🗺️ Rastrear Pedido
          </button>
          <button type="button" class="btn-reorder-history" data-order-id="${order.id}"
            style="background: var(--primary); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: 700; font-size: 0.78rem; cursor: pointer;">
            🔄 Volver a Pedir
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-view-receipt').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const order = orders.find(o => o.id === orderId);
      if (order) openReceiptView(order);
    };
  });

  container.querySelectorAll('.btn-track-from-history').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const order = orders.find(o => o.id === orderId);
      if (order) {
        document.getElementById('ordersHistoryModal').classList.remove('active');
        if (typeof openTrackingView === 'function') openTrackingView(order);
      }
    };
  });

  container.querySelectorAll('.btn-reorder-history').forEach(btn => {
    btn.onclick = () => {
      const orderId = btn.dataset.orderId;
      const order = orders.find(o => o.id === orderId);
      if (order && order.items && order.items.length > 0) {
        state.cart.restaurantId = order.restaurante ? order.restaurante.id : 'rest-campero';
        state.cart.restaurantName = order.restaurante ? order.restaurante.name : 'Pollo Campero';
        state.cart.deliveryFee = order.deliveryFee || 0;
        state.cart.items = order.items.map(i => ({ ...i }));
        if (typeof updateCartUI === 'function') updateCartUI();
        if (typeof updateSidebarCartUI === 'function') updateSidebarCartUI();
        document.getElementById('ordersHistoryModal').classList.remove('active');
        document.getElementById('cartDrawerBackdrop').classList.add('active');
        showToast(`¡Platillos de ${order.restaurante.name} cargados en tu carrito!`, 'success');
      }
    };
  });
}

function openReceiptView(order) {
  const container = document.getElementById('receiptContent');
  const modal = document.getElementById('receiptModal');
  if (!container || !modal) return;

  const dateFormatted = order.fecha ? new Date(order.fecha).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha actual';
  const clientName = order.cliente ? order.cliente.nombre : (order.guestInfo ? order.guestInfo.nombre : 'Cliente Chapín');
  const clientAddr = order.cliente ? order.cliente.direccion : (order.guestInfo ? order.guestInfo.direccion : 'Guatemala');
  const subtotal = order.subtotal || 0;
  const deliveryFee = order.deliveryFee || 0;
  const serviceFee = order.serviceFee || 5;
  const tip = order.tip || 0;
  const discount = order.descuento || 0;
  const total = order.total || (subtotal + deliveryFee + serviceFee + tip - discount);

  container.innerHTML = `
    <div class="receipt-paper">
      <div style="text-align: center; margin-bottom: 8px;">
        <div style="font-size: 1.8rem; line-height: 1;">🇬🇹</div>
        <div class="receipt-header-title">QGO GUATEMALA</div>
        <div style="font-size: 0.72rem; color: #475569;">QGO DELIVERY SERVICES, S.A.</div>
        <div style="font-size: 0.72rem; color: #475569;">NIT: 10849201-9 • SAT RESOLUCIÓN: FEL-2026-GT</div>
      </div>

      <div class="receipt-divider"></div>

      <div class="receipt-row">
        <span>COMPROBANTE / FACTURA:</span>
        <b>FEL-${order.id}</b>
      </div>
      <div class="receipt-row">
        <span>FECHA Y HORA:</span>
        <span>${dateFormatted}</span>
      </div>
      <div class="receipt-row">
        <span>RESTAURANTE:</span>
        <b>${escapeHTML(order.restaurante ? order.restaurante.name : 'Restaurante')}</b>
      </div>
      ${order.sucursal ? `
      <div class="receipt-row">
        <span>SUCURSAL COCINA:</span>
        <span>${escapeHTML(order.sucursal.name)}</span>
      </div>` : ''}
      <div class="receipt-row">
        <span>CLIENTE:</span>
        <span>${escapeHTML(clientName)}</span>
      </div>
      <div class="receipt-row">
        <span>NIT:</span>
        <span>C/F (Consumidor Final)</span>
      </div>
      <div class="receipt-row">
        <span>DIRECCIÓN:</span>
        <span style="max-width: 200px; text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHTML(clientAddr)}</span>
      </div>
      <div class="receipt-row">
        <span>MÉTODO DE PAGO:</span>
        <span>${escapeHTML(order.metodoPago || 'Tarjeta')}</span>
      </div>

      <div class="receipt-divider"></div>

      <div style="font-weight: 700; font-size: 0.8rem; margin-bottom: 6px;">DETALLE DE PRODUCTOS:</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin-bottom: 8px;">
        <thead>
          <tr style="border-bottom: 1px solid #CBD5E1; text-align: left;">
            <th style="padding: 4px 0;">CANT</th>
            <th style="padding: 4px 0;">DESCRIPCIÓN</th>
            <th style="padding: 4px 0; text-align: right;">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(i => `
            <tr>
              <td style="padding: 4px 0;">${i.quantity}</td>
              <td style="padding: 4px 0;">${escapeHTML(i.name)}</td>
              <td style="padding: 4px 0; text-align: right;">Q${i.price * i.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="receipt-divider"></div>

      <div class="receipt-row">
        <span>SUBTOTAL:</span>
        <span>Q${subtotal}</span>
      </div>
      <div class="receipt-row">
        <span>ENVÍO A DOMICILIO:</span>
        <span>${deliveryFee === 0 ? 'GRATIS' : `Q${deliveryFee}`}</span>
      </div>
      <div class="receipt-row">
        <span>TARIFA SERVICIO QGO:</span>
        <span>Q${serviceFee}</span>
      </div>
      ${tip > 0 ? `
      <div class="receipt-row">
        <span>PROPINA AL MOTORISTA:</span>
        <span>Q${tip}</span>
      </div>` : ''}
      ${discount > 0 ? `
      <div class="receipt-row" style="color: #166534; font-weight: 700;">
        <span>DESCUENTO CUPÓN (${order.cupon || 'PROMO'}):</span>
        <span>-Q${discount}</span>
      </div>` : ''}

      <div class="receipt-total-row">
        <span>TOTAL PAGADO:</span>
        <span>Q${total}</span>
      </div>

      <div class="receipt-divider"></div>

      <div style="text-align: center; font-size: 0.72rem; color: #64748B; margin-top: 10px;">
        <div>MOTORISTA ASIGNADO: ${escapeHTML(order.repartidor ? order.repartidor.nombre : 'Erick Morales')}</div>
        <div style="margin-top: 4px;">¡GRACIAS POR PEDIR CON QGO GUATEMALA! 🇬🇹</div>
        <div>Comprobante digital válido de entrega a domicilio.</div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}
