// ========================================================
// QGO API CLIENT - INTEGRACIÓN CON SPRING BOOT
// ========================================================

const API_BASE_URL = (() => {
  if (window.location.origin.includes(':8080')) return '';
  if (!window.location.hostname || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    return 'http://localhost:8080';
  }
  return window.QGO_CLOUD_API_URL || 'https://qgo-backend-production.up.railway.app';
})();

const QgoAPI = {
  isBackendConnected: false,

  // Verificar estado del backend de Spring Boot
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/prueba`, {
        method: 'GET',
        headers: { 'Accept': 'application/json, text/plain' },
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) {
        this.isBackendConnected = true;
        return { connected: true, message: await response.text() };
      }
    } catch (e) {
      this.isBackendConnected = false;
    }
    return { connected: false, message: 'Spring Boot offline / Modo local' };
  },

  // Obtener usuarios desde el backend Java (UsuarioController.java)
  async getUsuarios() {
    const COMERCIO_MAP = {
      'pedidos@campero.com.gt': 'rest-campero',
      'pedidos@mcdonalds.com.gt': 'rest-mc',
      'pedidos@pizzahut.com.gt': 'rest-pizzahut',
      'pedidos@burgerking.com.gt': 'rest-burgerking',
      'pedidos@subway.com.gt': 'rest-subway',
      'pedidos@dominos.com.gt': 'rest-dominos'
    };

    const enrichUser = (u) => {
      const matchInit = (typeof INITIAL_USERS !== 'undefined')
        ? INITIAL_USERS.find(i => i.correo && u.correo && i.correo.toLowerCase() === u.correo.toLowerCase())
        : null;

      let enriched = matchInit ? { ...matchInit, ...u } : { ...u };

      if (enriched.rol === 'COMERCIO' && !enriched.comercioId && enriched.correo) {
        enriched.comercioId = COMERCIO_MAP[enriched.correo.toLowerCase()] || 'rest-campero';
      }
      return enriched;
    };

    if (this.isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/usuarios`);
        if (res.ok) {
          const remoteUsers = await res.json();
          if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
            const enriched = remoteUsers.map(enrichUser);
            localStorage.setItem('qgo_users', JSON.stringify(enriched));
            return enriched;
          }
        }
      } catch (e) {
        console.warn('Fallo al obtener usuarios remotos, usando locales:', e);
      }
    }

    // Fallback a LocalStorage o INITIAL_USERS
    const stored = localStorage.getItem('qgo_users');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (typeof INITIAL_USERS !== 'undefined') {
            INITIAL_USERS.forEach(initU => {
              if (!parsed.some(u => u.correo && u.correo.toLowerCase() === initU.correo.toLowerCase())) {
                parsed.push(initU);
              }
            });
          }
          const enriched = parsed.map(enrichUser);
          localStorage.setItem('qgo_users', JSON.stringify(enriched));
          return enriched;
        }
      } catch (e) {}
    }

    const defaultList = (typeof INITIAL_USERS !== 'undefined') ? INITIAL_USERS.map(enrichUser) : [];
    localStorage.setItem('qgo_users', JSON.stringify(defaultList));
    return defaultList;
  },

  // Guardar nuevo usuario vía POST /api/usuarios
  async guardarUsuario(nuevoUsuario) {
    let savedUser = null;

    if (this.isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario)
        });
        if (res.ok) {
          savedUser = await res.json();
        }
      } catch (e) {
        console.warn('Error al guardar en backend Java, usando almacenamiento local:', e);
      }
    }

    // Si el backend no respondió o no está activo, crearlo localmente
    if (!savedUser) {
      savedUser = {
        id: Date.now(),
        ...nuevoUsuario
      };
    }

    // Actualizar usuarios en localStorage
    const users = await this.getUsuarios();
    users.push(savedUser);
    localStorage.setItem('qgo_users', JSON.stringify(users));

    return savedUser;
  },

  // Actualizar usuario existente
  async actualizarUsuario(usuarioActualizado) {
    if (this.isBackendConnected && usuarioActualizado.id) {
      try {
        await fetch(`${API_BASE_URL}/api/usuarios/${usuarioActualizado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuarioActualizado)
        });
      } catch (e) {
        console.warn('Fallo al actualizar usuario en backend:', e);
      }
    }

    const users = await this.getUsuarios();
    const index = users.findIndex(u => String(u.id) === String(usuarioActualizado.id));
    if (index !== -1) {
      users[index] = { ...users[index], ...usuarioActualizado };
      localStorage.setItem('qgo_users', JSON.stringify(users));
      return users[index];
    }
    return null;
  },

  // Eliminar usuario
  async eliminarUsuario(userId) {
    if (this.isBackendConnected) {
      try {
        await fetch(`${API_BASE_URL}/api/usuarios/${userId}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.warn('Fallo al eliminar usuario en backend:', e);
      }
    }

    let users = await this.getUsuarios();
    users = users.filter(u => String(u.id) !== String(userId));
    localStorage.setItem('qgo_users', JSON.stringify(users));
    return true;
  },

  // Gestión de Cupones de Descuento de la Plataforma
  getCoupons() {
    const defaultCoupons = [
      { code: 'QGOCHAPIN', discount: 15, type: 'fixed', label: 'Q15 de descuento' },
      { code: 'ENVIOGRATIS', discount: 0, type: 'free_delivery', label: 'Envío Gratis' },
      { code: 'GUATE502', discount: 10, type: 'fixed', label: 'Q10 de descuento' },
      { code: 'BIENVENIDO', discount: 20, type: 'percent', label: '20% de descuento en comida' }
    ];
    const stored = localStorage.getItem('qgo_coupons');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    localStorage.setItem('qgo_coupons', JSON.stringify(defaultCoupons));
    return defaultCoupons;
  },

  saveCoupon(coupon) {
    const coupons = this.getCoupons();
    const existingIdx = coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (existingIdx !== -1) {
      coupons[existingIdx] = coupon;
    } else {
      coupons.push(coupon);
    }
    localStorage.setItem('qgo_coupons', JSON.stringify(coupons));
    return coupon;
  },

  deleteCoupon(code) {
    let coupons = this.getCoupons();
    coupons = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    localStorage.setItem('qgo_coupons', JSON.stringify(coupons));
    return true;
  },

  // Gestión de Pedidos (Almacenamiento reactivo en localStorage)
  getOrders() {
    const stored = localStorage.getItem('qgo_orders');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Si el pedido demo inicial tiene la sucursal antigua o desactualizada, actualizarlo a la sucursal más cercana
          const demo = parsed.find(o => o.id === 'QGO-7742');
          if (demo && (!demo.sucursal || demo.sucursal.id === 'camp-z10' || (demo.items && demo.items[0] && demo.items[0].price === 48) || !demo.clienteId)) {
            demo.sucursal = INITIAL_DEMO_ORDER.sucursal;
            demo.restaurante = INITIAL_DEMO_ORDER.restaurante;
            demo.clienteCoords = INITIAL_DEMO_ORDER.clienteCoords;
            demo.items = INITIAL_DEMO_ORDER.items;
            demo.subtotal = INITIAL_DEMO_ORDER.subtotal;
            demo.total = INITIAL_DEMO_ORDER.total;
            demo.cliente = INITIAL_DEMO_ORDER.cliente;
            demo.clienteId = 1;
            localStorage.setItem('qgo_orders', JSON.stringify(parsed));
          }
          return parsed;
        }
      } catch (e) {}
    }
    const defaultList = [INITIAL_DEMO_ORDER];
    localStorage.setItem('qgo_orders', JSON.stringify(defaultList));
    return defaultList;
  },

  saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem('qgo_orders', JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('orderUpdated', { detail: order }));
    return order;
  },

  updateOrderStatus(orderId, nuevoEstado, dataExtra = {}) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.estado = nuevoEstado;
      Object.assign(order, dataExtra);
      localStorage.setItem('qgo_orders', JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('orderUpdated', { detail: order }));
      return order;
    }
    return null;
  }
};

window.QgoAPI = QgoAPI;
