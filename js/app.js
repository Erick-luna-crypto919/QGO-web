// Módulo Principal y Catálogo

function initCategories() {
  const state = window.QgoState;
  const scrollContainer = document.getElementById('categoriesScroll');
  if (!scrollContainer) return;

  const categories = (typeof INITIAL_CATEGORIES !== 'undefined') ? INITIAL_CATEGORIES : [
    { id: 'all', name: 'Todos', icon: '🍽️' },
    { id: 'pollo', name: 'Pollo Frito', icon: '🍗' },
    { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'chapin', name: 'Comida Chapina', icon: '🌮' },
    { id: 'postres', name: 'Postres y Café', icon: '☕' }
  ];

  scrollContainer.innerHTML = categories.map(cat => `
    <div class="category-card ${cat.id === state.selectedCategory ? 'active' : ''}" data-cat-id="${cat.id}">
      <div class="category-icon-circle">${cat.icon}</div>
      <span class="category-name">${cat.name}</span>
    </div>
  `).join('');

  scrollContainer.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedCategory = card.dataset.catId;
      scrollContainer.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      renderRestaurants();
    });
  });
}

function initSearchAndFilters() {
  const state = window.QgoState;
  const searchInput = document.getElementById('globalSearchInput');
  const heroSearchInput = document.getElementById('heroCentralSearchInput');
  const btnHeroSearch = document.getElementById('btnHeroSearch');

  function handleSearchChange(val) {
    state.searchQuery = val.toLowerCase().trim();
    if (searchInput && searchInput.value !== val) searchInput.value = val;
    if (heroSearchInput && heroSearchInput.value !== val) heroSearchInput.value = val;
    renderRestaurants();
  }

  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      handleSearchChange(e.target.value);
    }, 200));
  }

  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', debounce((e) => {
      handleSearchChange(e.target.value);
    }, 200));
    heroSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const grid = document.getElementById('restaurantsGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (btnHeroSearch) {
    btnHeroSearch.addEventListener('click', () => {
      const grid = document.getElementById('restaurantsGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.hero-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.search) {
        handleSearchChange(btn.dataset.search);
      } else if (btn.dataset.filter) {
        state.selectedFilter = btn.dataset.filter;
        const matchingChip = document.querySelector(`.filter-chip[data-filter="${btn.dataset.filter}"]`);
        if (matchingChip) {
          document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          matchingChip.classList.add('active');
        }
        renderRestaurants();
      }
      const grid = document.getElementById('restaurantsGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.selectedFilter = chip.dataset.filter;
      renderRestaurants();
    });
  });

  const btnExplore = document.getElementById('btnExploreNow');
  if (btnExplore) {
    btnExplore.onclick = () => {
      const grid = document.getElementById('restaurantsGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
    };
  }

  const brandBtn = document.getElementById('brandLogoBtn');
  if (brandBtn) {
    brandBtn.addEventListener('click', async () => {
      if (state.currentUser && state.currentUser.rol === 'CLIENTE') {
        showClientHome();
      } else {
        const users = await QgoAPI.getUsuarios();
        const clientUser = users.find(u => u.rol === 'CLIENTE') || users[0];
        if (clientUser) {
          try {
            if (typeof setCurrentUser === 'function') setCurrentUser(clientUser);
          } catch (e) {
            console.error('Error al volver al menú principal:', e);
          }
          showClientHome();
          showToast(`Regresaste al menú principal como ${clientUser.nombre} (CLIENTE)`, 'success');
        }
      }
    });
  }
}

function initRestaurantsGrid() {
  renderRestaurants();
}

function renderRestaurants() {
  const state = window.QgoState;
  const grid = document.getElementById('restaurantsGrid');
  if (!grid) return;

  const restaurants = getStoredRestaurants();

  restaurants.forEach(r => {
    r.nearestBranch = getNearestRestaurantBranch(r, state.clientHomeCoords);
  });

  let filtered = restaurants.filter(r => {
    if (state.selectedCategory !== 'all' && r.category !== state.selectedCategory) return false;
    if (state.searchQuery) {
      const matchName = r.name.toLowerCase().includes(state.searchQuery);
      const matchMenu = r.menu.some(m => m.name.toLowerCase().includes(state.searchQuery) || (m.description && m.description.toLowerCase().includes(state.searchQuery)));
      if (!matchName && !matchMenu) return false;
    }
    if (state.selectedFilter === 'favorites' && !state.favorites.includes(r.id)) return false;
    if (state.selectedFilter === 'free_delivery' && r.deliveryFee > 0) return false;
    if (state.selectedFilter === 'fast' && parseInt(r.nearestBranch.deliveryTime || r.deliveryTime) > 25) return false;
    if (state.selectedFilter === 'promo' && !r.discountBadge) return false;
    if (state.selectedFilter === 'top' && r.rating < 4.8) return false;

    return true;
  });

  filtered.sort((a, b) => a.nearestBranch.distanceKm - b.nearestBranch.distanceKm);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
        <h3>No encontramos locales para tu búsqueda</h3>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(r => `
    <div class="restaurant-card" data-rest-id="${r.id}">
      <div class="card-cover">
        <img src="${r.coverImage}" alt="${escapeHTML(r.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'">
        ${r.discountBadge ? `<span class="badge-discount">${escapeHTML(r.discountBadge)}</span>` : ''}
        <button type="button" class="btn-favorite-heart ${state.favorites.includes(r.id) ? 'active' : ''}" data-fav-id="${r.id}" title="${state.favorites.includes(r.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
          ${state.favorites.includes(r.id) ? '❤️' : '🤍'}
        </button>
        <div class="card-logo-badge">
          <img src="${r.logo}" alt="Logo" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200'">
        </div>
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <h3 class="card-title">${escapeHTML(r.name)}</h3>
          <span class="rating-badge">★ ${r.rating}</span>
        </div>

        <div class="card-nearest-branch" title="${escapeHTML(r.nearestBranch.address)}">
          📍 Sucursal más cercana: <b>${escapeHTML(r.nearestBranch.name)}</b> (${r.nearestBranch.distanceKm} km)
        </div>

        <div class="card-meta-row">
          <span>⏱️ ${escapeHTML(r.nearestBranch.deliveryTime)}</span>
          <span>•</span>
          <span class="card-delivery-fee">${r.deliveryFee === 0 ? 'Envío Gratis' : `Envío Q${r.deliveryFee}`}</span>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: auto;">
          Cocina asignada: ${escapeHTML(r.nearestBranch.address)}
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', () => {
      const restId = card.dataset.restId;
      openRestaurantView(restId);
    });
  });

  grid.querySelectorAll('.btn-favorite-heart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rId = btn.dataset.favId;
      if (state.favorites.includes(rId)) {
        state.favorites = state.favorites.filter(id => id !== rId);
        showToast('Eliminado de tus favoritos', 'info');
      } else {
        state.favorites.push(rId);
        showToast('¡Guardado en tus favoritos ❤️!', 'success');
      }
      localStorage.setItem('qgo_favorites', JSON.stringify(state.favorites));
      renderRestaurants();
    });
  });
}

function updateRestaurantBranchUI() {
  const state = window.QgoState;
  if (!state.selectedRestaurant) return;
  const branch = state.selectedRestaurantBranch || getNearestRestaurantBranch(state.selectedRestaurant, state.clientHomeCoords);
  state.selectedRestaurantBranch = branch;

  const timeEl = document.getElementById('restTime');
  if (timeEl) timeEl.textContent = `⏱️ ${branch.deliveryTime}`;

  const feeEl = document.getElementById('restFee');
  if (feeEl) feeEl.textContent = state.selectedRestaurant.deliveryFee === 0 ? '🛵 Envío Gratis' : `🛵 Envío Q${state.selectedRestaurant.deliveryFee}`;

  const addrEl = document.getElementById('restAddress');
  if (addrEl) addrEl.innerHTML = `📍 Central: ${escapeHTML(state.selectedRestaurant.address)}`;

  const branchNameEl = document.getElementById('restCurrentBranchName');
  if (branchNameEl) branchNameEl.textContent = branch.name;

  const branchDistEl = document.getElementById('restCurrentBranchDistance');
  if (branchDistEl) {
    const tag = branch.isDynamic ? ' • ⚡ Auto-Detectada' : ' • ⚡ Auto GPS';
    branchDistEl.textContent = `(a ${branch.distanceKm} km${tag})`;
  }

  const checkoutBranchName = document.getElementById('checkoutBranchName');
  if (checkoutBranchName) checkoutBranchName.textContent = `${state.selectedRestaurant.name} - ${branch.name}`;
  const checkoutBranchDetails = document.getElementById('checkoutBranchDetails');
  if (checkoutBranchDetails) checkoutBranchDetails.textContent = `A ${branch.distanceKm} km de tu casa • Entrega estimada: ${branch.deliveryTime} (${branch.address})`;
}

function initBranchSelectionModal() {
  const state = window.QgoState;
  const modal = document.getElementById('branchSelectionModal');
  const btnOpenFromRest = document.getElementById('btnOpenBranchModal');
  const btnOpenFromCheckout = document.getElementById('btnChangeBranchFromCheckout');
  const btnClose = document.getElementById('btnCloseBranchModal');
  const btnCancel = document.getElementById('btnCancelBranchModal');

  function openModal() {
    const rest = state.selectedRestaurant || (getStoredRestaurants().find(r => r.name === state.cart.restaurantName) || getStoredRestaurants()[0]);
    if (!rest) return;

    const userLocText = localStorage.getItem('qgo_client_address') || (state.currentUser && state.currentUser.direccion ? state.currentUser.direccion : 'Zona 14, Ciudad de Guatemala');
    const userLocEl = document.getElementById('branchModalUserLocation');
    if (userLocEl) userLocEl.textContent = userLocText.split(',')[0];

    const subtitleEl = document.getElementById('branchModalSubtitle');
    if (subtitleEl) {
      subtitleEl.innerHTML = `Selecciona de qué sucursal de <b>${escapeHTML(rest.name)}</b> deseas que preparen y despachen tu comida. Están ordenadas de menor a mayor distancia según tu ubicación actual:`;
    }

    const branches = getAllRestaurantBranchesSorted(rest, state.clientHomeCoords);
    const container = document.getElementById('branchesListContainer');
    if (!container) return;

    const currentBranchId = state.selectedRestaurantBranch ? state.selectedRestaurantBranch.id : branches[0].id;
    const minDistance = branches[0].distanceKm;

    container.innerHTML = branches.map(b => {
      const isSelected = b.id === currentBranchId;
      const isNearest = b.distanceKm === minDistance;
      return `
        <div class="branch-card-item ${isSelected ? 'selected' : ''}" data-branch-id="${b.id}">
          <div class="branch-info-col">
            <div class="branch-title-row">
              <span class="branch-title-text">${escapeHTML(b.name)}</span>
              ${isNearest ? `<span class="branch-badge-nearest">⚡ Más cercana a ti</span>` : ''}
              ${b.isDynamic ? `<span class="branch-badge-nearest" style="background:#00A86B; color:white;">⚡ Auto-Generada por GPS</span>` : ''}
              ${isSelected ? `<span class="branch-badge-active">✓ Seleccionada</span>` : ''}
            </div>
            <div class="branch-address-text">📍 ${escapeHTML(b.address)}</div>
            <div class="branch-meta-row">
              <span>📏 <b>${b.distanceKm} km</b> de distancia</span>
              <span>•</span>
              <span>⏱️ Entrega en <b>${escapeHTML(b.deliveryTime)}</b></span>
            </div>
          </div>
          <button type="button" class="btn-select-branch-action">
            ${isSelected ? '✓ Seleccionada' : 'Elegir esta sucursal'}
          </button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.branch-card-item').forEach(card => {
      card.addEventListener('click', () => {
        const bId = card.dataset.branchId;
        const chosen = branches.find(b => b.id === bId);
        if (chosen) {
          state.selectedRestaurantBranch = chosen;
          updateRestaurantBranchUI();
          modal.classList.remove('active');
          showToast(`Sucursal asignada: ${chosen.name} (${chosen.distanceKm} km)`, 'success');
        }
      });
    });

    modal.classList.add('active');
  }

  if (btnOpenFromRest) btnOpenFromRest.onclick = openModal;
  if (btnOpenFromCheckout) btnOpenFromCheckout.onclick = openModal;
  if (btnClose) btnClose.onclick = () => modal.classList.remove('active');
  if (btnCancel) btnCancel.onclick = () => modal.classList.remove('active');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }
}

function openRestaurantView(restId, updateHash = true) {
  const state = window.QgoState;
  const restaurants = getStoredRestaurants();
  const restaurant = restaurants.find(r => r.id === restId);
  if (!restaurant) return;

  if (updateHash && window.location.hash !== `#restaurant/${restId}`) {
    window.location.hash = `#restaurant/${restId}`;
  }
  sessionStorage.setItem('qgo_current_hash', `#restaurant/${restId}`);

  state.selectedRestaurant = restaurant;
  state.selectedRestaurantBranch = getNearestRestaurantBranch(restaurant, state.clientHomeCoords);
  state.currentView = 'restaurant';

  const homeSec = document.getElementById('clientHomeSection');
  const trackSec = document.getElementById('clientTrackingSection');
  const restView = document.getElementById('clientRestaurantSection');

  if (homeSec) homeSec.style.display = 'none';
  if (trackSec) trackSec.style.display = 'none';
  if (restView) restView.style.display = 'block';

  const bannerImg = document.getElementById('restBannerImg');
  const restTitle = document.getElementById('restTitle');
  const restRating = document.getElementById('restRating');

  if (bannerImg) bannerImg.src = restaurant.coverImage;
  if (restTitle) restTitle.textContent = restaurant.name;
  if (restRating) restRating.textContent = `★ ${restaurant.rating} (${restaurant.reviewsCount || 100} opiniones)`;

  updateRestaurantBranchUI();

  const sidebarName = document.getElementById('sidebarRestaurantName');
  if (sidebarName) sidebarName.textContent = restaurant.name;

  const menuCategories = ['Todos', ...new Set((restaurant.menu || []).map(item => item.category))];

  const navTabs = document.getElementById('menuNavTabs');
  if (navTabs) {
    navTabs.innerHTML = menuCategories.map((cat, idx) => `
      <button class="menu-tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${escapeHTML(cat)}">${escapeHTML(cat)}</button>
    `).join('');

    navTabs.querySelectorAll('.menu-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navTabs.querySelectorAll('.menu-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenuItems(btn.dataset.cat);
      });
    });
  }

  renderMenuItems('Todos');
  if (typeof updateSidebarCartUI === 'function') updateSidebarCartUI();

  const btnBack = document.getElementById('btnBackToHome');
  if (btnBack) {
    btnBack.onclick = () => {
      showClientHome();
    };
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderMenuItems(selectedCategory) {
  const state = window.QgoState;
  const container = document.getElementById('menuItemsContainer');
  if (!container || !state.selectedRestaurant) return;

  let items = state.selectedRestaurant.menu || [];
  if (selectedCategory !== 'Todos') {
    items = items.filter(i => i.category === selectedCategory);
  }

  container.innerHTML = `
    <div class="menu-items-grid">
      ${items.map(item => `
        <div class="menu-item-card" data-item-id="${item.id}">
          <div class="item-info">
            <div>
              <h4 class="item-title">${escapeHTML(item.name)}</h4>
              <p class="item-desc">${escapeHTML(item.description || '')}</p>
            </div>
            <span class="item-price">Q${item.price}</span>
          </div>
          <div class="item-image-wrapper">
            <img src="${item.image}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'">
            <button class="btn-add-quick" title="Agregar">+</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.menu-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemId = card.dataset.itemId;
      const item = state.selectedRestaurant.menu.find(i => i.id === itemId);
      if (item) openProductModal(item);
    });
  });
}

function showClientHome(updateHash = true) {
  const state = window.QgoState;
  state.currentView = 'home';
  const isSpecialRoleHash = window.location.hash === '#repartidor' || window.location.hash === '#comercio' || window.location.hash === '#admin';
  if ((updateHash || isSpecialRoleHash) && window.location.hash !== '#home' && window.location.hash !== '') {
    window.location.hash = '#home';
  }
  sessionStorage.setItem('qgo_current_hash', '#home');

  const homeSec = document.getElementById('clientHomeSection');
  const restSec = document.getElementById('clientRestaurantSection');
  const trackSec = document.getElementById('clientTrackingSection');

  if (homeSec) homeSec.style.display = 'block';
  if (restSec) restSec.style.display = 'none';
  if (trackSec) trackSec.style.display = 'none';

  renderRestaurants();
  if (typeof updateMobileCartBar === 'function') updateMobileCartBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initProductModal() {
  const state = window.QgoState;
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('btnCloseProductModal');

  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('active');
    };
  }

  const btnMinus = document.getElementById('modalBtnMinus');
  if (btnMinus) {
    btnMinus.onclick = () => {
      if (state.modalProductQuantity > 1) {
        state.modalProductQuantity--;
        document.getElementById('modalStepValue').textContent = state.modalProductQuantity;
        updateModalAddButtonPrice();
      }
    };
  }

  const btnPlus = document.getElementById('modalBtnPlus');
  if (btnPlus) {
    btnPlus.onclick = () => {
      state.modalProductQuantity++;
      document.getElementById('modalStepValue').textContent = state.modalProductQuantity;
      updateModalAddButtonPrice();
    };
  }

  const btnAdd = document.getElementById('modalBtnAdd');
  if (btnAdd) {
    btnAdd.onclick = () => {
      if (!state.modalProduct) return;

      if (state.cart.restaurantId && state.cart.restaurantId !== state.selectedRestaurant.id) {
        if (!confirm('Tu pedido tiene platos de otro local. ¿Deseas vaciarlo e iniciar con este restaurante?')) {
          return;
        }
        state.cart.items = [];
      }

      state.cart.restaurantId = state.selectedRestaurant.id;
      state.cart.restaurantName = state.selectedRestaurant.name;
      state.cart.deliveryFee = state.selectedRestaurant.deliveryFee;

      const notes = document.getElementById('modalSpecialNotes') ? document.getElementById('modalSpecialNotes').value.trim() : '';
      let extraPrice = state.modalSelectedOption ? (state.modalSelectedOption.price || 0) : 0;
      let finalPrice = state.modalProduct.price + extraPrice;

      state.cart.items.push({
        id: state.modalProduct.id + '-' + Date.now(),
        productId: state.modalProduct.id,
        name: state.modalProduct.name,
        price: finalPrice,
        quantity: state.modalProductQuantity,
        selectedOption: state.modalSelectedOption ? state.modalSelectedOption.name : null,
        notes: notes
      });

      modal.classList.remove('active');
      playNotificationSound();
      if (typeof updateCartUI === 'function') updateCartUI();
      if (typeof updateSidebarCartUI === 'function') updateSidebarCartUI();
      showToast(`¡${state.modalProduct.name} agregado a tu canasta!`, 'success');
    };
  }
}

function openProductModal(item) {
  const state = window.QgoState;
  state.modalProduct = item;
  state.modalProductQuantity = 1;
  state.modalSelectedOption = item.options && item.options.length > 0 ? item.options[0] : null;

  const imgEl = document.getElementById('modalProductImg');
  const titleEl = document.getElementById('modalProductTitle');
  const descEl = document.getElementById('modalProductDesc');
  const stepValEl = document.getElementById('modalStepValue');
  const notesEl = document.getElementById('modalSpecialNotes');

  if (imgEl) imgEl.src = item.image;
  if (titleEl) titleEl.textContent = item.name;
  if (descEl) descEl.textContent = item.description || '';
  if (stepValEl) stepValEl.textContent = '1';
  if (notesEl) notesEl.value = '';

  const optionsContainer = document.getElementById('modalProductOptions');
  if (optionsContainer) {
    if (item.options && item.options.length > 0) {
      optionsContainer.style.display = 'block';
      optionsContainer.innerHTML = `
        <h4 class="options-title">Personaliza tu orden</h4>
        ${item.options.map((opt, idx) => `
          <label class="option-row">
            <span>
              <input type="radio" name="productOption" value="${idx}" ${idx === 0 ? 'checked' : ''}>
              ${escapeHTML(opt.name)}
            </span>
            <span style="font-weight: 700; color: var(--primary);">${opt.price > 0 ? `+Q${opt.price}` : 'Incluido'}</span>
          </label>
        `).join('')}
      `;

      optionsContainer.querySelectorAll('input[name="productOption"]').forEach(input => {
        input.addEventListener('change', (e) => {
          state.modalSelectedOption = item.options[parseInt(e.target.value)];
          updateModalAddButtonPrice();
        });
      });
    } else {
      optionsContainer.style.display = 'none';
    }
  }

  updateModalAddButtonPrice();
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.add('active');
}

function updateModalAddButtonPrice() {
  const state = window.QgoState;
  if (!state.modalProduct) return;
  let basePrice = state.modalProduct.price;
  if (state.modalSelectedOption && state.modalSelectedOption.price) {
    basePrice += state.modalSelectedOption.price;
  }
  const totalPrice = basePrice * state.modalProductQuantity;
  const btnText = document.getElementById('modalBtnAddText');
  if (btnText) btnText.textContent = `Agregar al pedido • Q${totalPrice}`;
}

function handleRoute() {
  const state = window.QgoState;
  if (!state.currentUser) return;

  const storedHash = sessionStorage.getItem('qgo_current_hash');
  const hash = window.location.hash || storedHash || '#home';

  const vClient = document.getElementById('viewClient');
  const vComercio = document.getElementById('viewComercio');
  const vRepartidor = document.getElementById('viewRepartidor');
  const vAdmin = document.getElementById('viewAdmin');

  if (state.currentUser.rol === 'COMERCIO') {
    if (vClient) vClient.style.display = 'none';
    if (vComercio) vComercio.style.display = 'block';
    if (vRepartidor) vRepartidor.style.display = 'none';
    if (vAdmin) vAdmin.style.display = 'none';
    if (!window.location.hash.startsWith('#comercio')) {
      window.location.hash = hash.startsWith('#comercio') ? hash : '#comercio';
    }
    sessionStorage.setItem('qgo_current_hash', window.location.hash);
    if (typeof renderComercioDashboard === 'function') renderComercioDashboard();
    return;
  }

  if (state.currentUser.rol === 'REPARTIDOR') {
    if (vClient) vClient.style.display = 'none';
    if (vComercio) vComercio.style.display = 'none';
    if (vRepartidor) vRepartidor.style.display = 'block';
    if (vAdmin) vAdmin.style.display = 'none';
    if (window.location.hash !== '#repartidor') {
      window.location.hash = '#repartidor';
    }
    sessionStorage.setItem('qgo_current_hash', '#repartidor');
    if (typeof renderRepartidorDashboard === 'function') renderRepartidorDashboard();
    return;
  }

  if (state.currentUser.rol === 'ADMINISTRADOR') {
    if (vClient) vClient.style.display = 'none';
    if (vComercio) vComercio.style.display = 'none';
    if (vRepartidor) vRepartidor.style.display = 'none';
    if (vAdmin) vAdmin.style.display = 'block';
    if (window.location.hash !== '#admin') {
      window.location.hash = '#admin';
    }
    sessionStorage.setItem('qgo_current_hash', '#admin');
    if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
    return;
  }

  if (vClient) vClient.style.display = 'block';
  if (vComercio) vComercio.style.display = 'none';
  if (vRepartidor) vRepartidor.style.display = 'none';
  if (vAdmin) vAdmin.style.display = 'none';

  if (hash.startsWith('#restaurant/')) {
    const restId = hash.replace('#restaurant/', '');
    openRestaurantView(restId, false);
  } else if (hash.startsWith('#tracking/')) {
    const orderId = hash.replace('#tracking/', '');
    const orders = QgoAPI.getOrders();
    let order = null;
    if (state.currentUser && state.currentUser.rol === 'CLIENTE') {
      const myOrders = (typeof getClientOrders === 'function') ? getClientOrders(state.currentUser) : [];
      order = myOrders.find(o => o.id === orderId) || myOrders[0];
    } else {
      order = orders.find(o => o.id === orderId) || orders[0];
    }
    if (order && typeof openTrackingView === 'function') {
      openTrackingView(order, false);
    } else {
      showClientHome(false);
    }
  } else {
    showClientHome(false);
  }
}

function initRouter() {
  window.addEventListener('hashchange', handleRoute);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  document.querySelectorAll('.modal-backdrop, .cart-drawer-backdrop, .modal').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });
}

async function initApp() {
  if (typeof initBackendStatus === 'function') await initBackendStatus();
  if (typeof initAuthModal === 'function') initAuthModal();
  if (typeof initAddressModal === 'function') initAddressModal();
  initCategories();
  initRestaurantsGrid();
  initSearchAndFilters();
  if (typeof initCartDrawer === 'function') initCartDrawer();
  initProductModal();
  if (typeof initCheckoutModal === 'function') initCheckoutModal();
  if (typeof initOrdersHistoryModal === 'function') initOrdersHistoryModal();
  initBranchSelectionModal();
  if (typeof initComercioMenuManagement === 'function') initComercioMenuManagement();
  if (typeof initAdminDashboard === 'function') initAdminDashboard();
  if (typeof initGoogleMapsControls === 'function') initGoogleMapsControls();
  if (typeof initMobileCartBar === 'function') initMobileCartBar();
  initRouter();
  if (typeof initUserSession === 'function') await initUserSession();
  if (typeof checkInitialOrder === 'function') checkInitialOrder();
  handleRoute();
}

document.addEventListener('DOMContentLoaded', async () => {
  await initApp();

  window.addEventListener('orderUpdated', (e) => {
    const state = window.QgoState;
    const updated = e.detail;
    if (state.activeOrderForTracking && state.activeOrderForTracking.id === updated.id) {
      state.activeOrderForTracking = updated;
      if (typeof renderTrackingView === 'function') renderTrackingView(updated);
    }
    if (state.currentUser && state.currentUser.rol === 'COMERCIO' && typeof renderComercioOrders === 'function') {
      renderComercioOrders();
    }
    if (state.currentUser && state.currentUser.rol === 'REPARTIDOR' && typeof renderRepartidorDashboard === 'function') {
      renderRepartidorDashboard();
    }
    if (state.currentUser && state.currentUser.rol === 'ADMINISTRADOR' && typeof renderAdminDashboard === 'function') {
      renderAdminDashboard();
    }
  });

  window.addEventListener('storage', (e) => {
    const state = window.QgoState;
    if (e.key === 'qgo_orders') {
      const orders = QgoAPI.getOrders();
      if (state.activeOrderForTracking) {
        const found = orders.find(o => o.id === state.activeOrderForTracking.id);
        if (found) {
          state.activeOrderForTracking = found;
          if (typeof renderTrackingView === 'function') renderTrackingView(found);
        }
      }
      if (state.currentUser && state.currentUser.rol === 'COMERCIO' && typeof renderComercioOrders === 'function') {
        renderComercioOrders();
      }
      if (state.currentUser && state.currentUser.rol === 'REPARTIDOR' && typeof renderRepartidorDashboard === 'function') {
        renderRepartidorDashboard();
      }
      if (state.currentUser && state.currentUser.rol === 'ADMINISTRADOR' && typeof renderAdminDashboard === 'function') {
        renderAdminDashboard();
      }
    }
  });
});
