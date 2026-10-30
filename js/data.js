// ========================================================
// QGO GUATEMALA - CATÁLOGO REAL EN QUETZALES (Q)
// Restaurantes y marcas oficiales con Multizona y Sucursales
// ========================================================

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Todos', icon: '🍽️' },
  { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔' },
  { id: 'pollo', name: 'Pollo Frito', icon: '🍗' },
  { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
  { id: 'sandwiches', name: 'Sándwiches & Subs', icon: '🥪' },
  { id: 'postres', name: 'Postres & Helados', icon: '🍦' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
];

// Ubicaciones predeterminadas populares en Ciudad de Guatemala con coordenadas GPS exactas
const PRESET_GUATEMALA_LOCATIONS = [
  {
    id: 'loc-z14',
    name: 'Zona 14 - Las Américas',
    address: '10ma Avenida 14-25, Zona 14, Edificio Las Américas',
    coords: [14.585671, -90.518528]
  },
  {
    id: 'loc-z10',
    name: 'Zona 10 - Zona Viva / Próceres',
    address: 'Boulevard Los Próceres 12-40, Zona 10, Edificio Dubai Center',
    coords: [14.59859, -90.510683]
  },
  {
    id: 'loc-z16',
    name: 'Zona 16 - Paseo Cayalá',
    address: 'Paseo Cayalá, Zona 16, Apartamentos Cardales de Cayalá',
    coords: [14.6120, -90.4850]
  },
  {
    id: 'loc-z11',
    name: 'Zona 11 - Miraflores / Roosevelt',
    address: 'Calzada Roosevelt 22-00, Zona 11, Miraflores',
    coords: [14.6220, -90.5510]
  },
  {
    id: 'loc-z1',
    name: 'Zona 1 - Centro Histórico',
    address: '6ta Avenida 9-20, Zona 1, Paseo de la Sexta',
    coords: [14.6360, -90.5135]
  },
  {
    id: 'loc-z4',
    name: 'Zona 4 - Cuatro Grados Norte',
    address: '4ta Grados Norte, Zona 4, Edificio Granat',
    coords: [14.6185, -90.5152]
  },
  {
    id: 'loc-z15',
    name: 'Zona 15 - Vista Hermosa',
    address: 'Boulevard Vista Hermosa 23-40, Zona 15',
    coords: [14.5975, -90.4890]
  },
  {
    id: 'loc-z9',
    name: 'Zona 9 - Plaza España',
    address: '7ma Avenida 12-15, Zona 9, Plaza España',
    coords: [14.6040, -90.5160]
  },
  {
    id: 'loc-z12',
    name: 'Zona 12 - Aguilar Batres',
    address: 'Calzada Aguilar Batres 32-00, Zona 12',
    coords: [14.5920, -90.5520]
  },
  {
    id: 'loc-z7',
    name: 'Zona 7 - Peri Roosevelt / San Juan',
    address: 'Calzada San Juan 14-20, Zona 7',
    coords: [14.6310, -90.5520]
  },
  {
    id: 'loc-ces',
    name: 'Carretera a El Salvador (Km 14.5)',
    address: 'Km 14.5 Carretera a El Salvador, Plaza Concepción',
    coords: [14.5450, -90.4700]
  },
  {
    id: 'loc-mixco',
    name: 'Mixco - San Cristóbal',
    address: 'Boulevard Principal San Cristóbal 11-40, Mixco',
    coords: [14.5940, -90.5790]
  },
  {
    id: 'loc-amatitlan',
    name: 'Amatitlán - Parque Central / Centro',
    address: '7ma Calle y 5ta Avenida, Parque Central, Amatitlán',
    coords: [14.4793, -90.6198]
  },
  {
    id: 'loc-villanueva',
    name: 'Villa Nueva - Metrocentro / Santa Clara',
    address: 'C.C. Metrocentro, 5ta Calle 5-47, Villa Nueva',
    coords: [14.5240, -90.5890]
  },
  {
    id: 'loc-antigua',
    name: 'Antigua Guatemala - Centro / Calle del Arco',
    address: '5ta Avenida Norte No. 22, Antigua Guatemala',
    coords: [14.5580, -90.7340]
  }
];

// ========================================================
// LOGOTIPOS VECTORIALES OFICIALES PARA LAS MARCAS REALES
// 100% nítidos, alta resolución y renderizado offline garantizado
// ========================================================
const BRAND_LOGOS = {
  mc: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="4" y="4" width="92" height="92" rx="22" fill="#DA291C"/>
      <path d="M26 80 C26 50, 36 28, 48 58 C60 28, 70 50, 70 80 C70 54, 62 34, 51 34 C41 34, 38 52, 38 68 C38 52, 35 34, 25 34 C15 34, 11 54, 11 80" stroke="#FFC72C" stroke-width="9.5" stroke-linecap="round" fill="none" transform="translate(7,-2)"/>
    </svg>
  `),
  pizzahut: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M22 46 C28 30, 72 30, 78 46 L88 52 C70 49, 30 49, 12 52 Z" fill="#EE3124"/>
      <path d="M38 27 L62 27 L56 35 L44 35 Z" fill="#EE3124"/>
      <path d="M18 55 L82 55 L78 60 L22 60 Z" fill="#00A86B"/>
      <path d="M22 60 L78 60 L74 65 L26 65 Z" fill="#FDB813"/>
      <text x="50" y="81" font-family="'Brush Script MT', 'Arial Black', cursive, sans-serif" font-size="14.5" fill="#231F20" text-anchor="middle" font-weight="900">Pizza Hut</text>
    </svg>
  `),
  burgerking: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#FFFBF5" stroke="#E2E8F0" stroke-width="1.5"/>
      <path d="M16 41 C16 18, 84 18, 84 41 Z" fill="#F48B28"/>
      <text x="50" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" fill="#D62300" text-anchor="middle" font-weight="900" letter-spacing="-0.5">BURGER</text>
      <text x="50" y="65" font-family="system-ui, -apple-system, sans-serif" font-size="13.5" fill="#D62300" text-anchor="middle" font-weight="900" letter-spacing="-0.5">KING</text>
      <path d="M18 71 C18 87, 82 87, 82 71 Z" fill="#F48B28"/>
    </svg>
  `),
  subway: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect x="4" y="4" width="92" height="92" rx="20" fill="#005A36"/>
      <g transform="translate(10, 32)">
        <text x="3" y="30" font-family="Impact, Arial Black, sans-serif" font-size="28" font-style="italic" font-weight="900">
          <tspan fill="#FFC220">SUB</tspan><tspan fill="#FFFFFF">WAY</tspan>
        </text>
        <polygon points="-1,17 7,11 7,23" fill="#FFC220"/>
        <polygon points="76,23 84,17 76,11" fill="#FFFFFF"/>
      </g>
    </svg>
  `),
  campero: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#F9A825" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="50" cy="50" r="43" fill="#F57F17"/>
      <path d="M42 22 C46 16, 54 16, 58 22 C64 24, 68 30, 66 38 C64 42, 60 46, 56 48 L56 52 L62 52 L60 56 L40 56 L38 52 L44 52 L44 48 C40 46, 36 42, 34 38 C32 30, 36 24, 42 22 Z" fill="#FFFFFF"/>
      <polygon points="50,30 58,34 50,38" fill="#E65100"/>
      <circle cx="46" cy="28" r="2.5" fill="#212121"/>
      <path d="M48 16 C50 12, 54 12, 56 16 C58 13, 62 14, 62 18" fill="#D50000"/>
      <rect x="12" y="62" width="76" height="24" rx="6" fill="#D50000"/>
      <text x="50" y="79" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#FFFFFF" text-anchor="middle" font-weight="900" letter-spacing="0.5">CAMPERO</text>
    </svg>
  `),
  dominos: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
      <g transform="translate(50,50) rotate(-45) translate(-36,-36)">
        <rect x="6" y="6" width="60" height="28" rx="5" fill="#E31837"/>
        <circle cx="36" cy="20" r="4.5" fill="#FFFFFF"/>
        <rect x="6" y="38" width="60" height="28" rx="5" fill="#006491"/>
        <circle cx="24" cy="52" r="4.5" fill="#FFFFFF"/>
        <circle cx="48" cy="52" r="4.5" fill="#FFFFFF"/>
      </g>
    </svg>
  `)
};

const INITIAL_RESTAURANTS_BASE = [
  // ========================================================
  // 1. MCDONALD'S
  // ========================================================
  {
    id: 'rest-mc',
    name: "McDonald's",
    category: 'hamburguesas',
    rating: 4.8,
    reviewsCount: 2890,
    deliveryTime: '15-25 min',
    deliveryFee: 15,
    minOrder: 35,
    discountBadge: '20% en Combos',
    coverImage: 'css/Comercios/MC/1.png',
    logo: 'css/Comercios/MC/1.png',
    address: 'Zona 14, Avenida Las Américas 18-02, Guatemala',
    isPromoted: true,
    branches: [
      { id: 'mc-z14',   name: 'Sucursal Las Américas (Zona 14)', address: 'Av. Las Américas 18-02, Zona 14', zone: 'Zona 14', coords: [14.5825, -90.5198] },
      { id: 'mc-z10',   name: 'Sucursal Zona Viva (Zona 10)', address: '2da Ave 12-40, Zona 10', zone: 'Zona 10', coords: [14.6012, -90.5098] },
      { id: 'mc-z11',   name: 'Sucursal Roosevelt (Zona 11)', address: 'Calzada Roosevelt 25-50, Zona 11', zone: 'Zona 11', coords: [14.6240, -90.5530] },
      { id: 'mc-z16',   name: 'Sucursal Paseo Cayalá (Zona 16)', address: 'Paseo Cayalá, Zona 16', zone: 'Zona 16', coords: [14.6130, -90.4855] },
      { id: 'mc-z1',    name: 'Sucursal Parque Central (Zona 1)', address: '6ta Calle y 6ta Ave, Zona 1', zone: 'Zona 1', coords: [14.6390, -90.5120] },
      { id: 'mc-z4',    name: 'Sucursal Cuatro Grados Norte (Zona 4)', address: '7ma Ave y Vía 4, Zona 4', zone: 'Zona 4', coords: [14.6175, -90.5145] },
      { id: 'mc-ces',   name: 'Sucursal Pradera Concepción (Carretera a El Salvador)', address: 'Km 15.5 Carretera a El Salvador', zone: 'Carretera a El Salvador', coords: [14.5420, -90.4680] },
      { id: 'mc-z15',   name: 'Sucursal Vista Hermosa (Zona 15)', address: 'Blvd. Vista Hermosa 21-10, Zona 15', zone: 'Zona 15', coords: [14.5990, -90.4910] },
      { id: 'mc-z9',    name: 'Sucursal Montúfar (Zona 9)', address: '12 Calle 5-55, Zona 9', zone: 'Zona 9', coords: [14.6025, -90.5180] },
      { id: 'mc-z12',   name: 'Sucursal Aguilar Batres (Zona 12)', address: 'Calzada Aguilar Batres 35-10, Zona 12', zone: 'Zona 12', coords: [14.5910, -90.5535] },
      { id: 'mc-z7',    name: 'Sucursal San Juan (Zona 7)', address: 'Calzada San Juan 34-00, Zona 7', zone: 'Zona 7', coords: [14.6330, -90.5540] },
      { id: 'mc-mixco', name: 'Sucursal San Cristóbal (Mixco)', address: 'Boulevard Principal San Cristóbal 14-20, Mixco', zone: 'Mixco', coords: [14.5940, -90.5790] },
      { id: 'mc-amatitlan', name: 'Sucursal Calzada Asiole (Amatitlán)', address: 'Calzada Asiole, Km 26.5 CA-9 Ruta al Pacífico, Entrada a Amatitlán', zone: 'Amatitlán', coords: [14.4877, -90.6216] },
      { id: 'mc-amatitlan-metroplaza', name: 'Sucursal Metroplaza (Amatitlán)', address: 'C.C. Metroplaza Amatitlán, Km 28.5 Carretera al Pacífico', zone: 'Amatitlán', coords: [14.4635, -90.6210] },
      { id: 'mc-villanueva', name: 'Sucursal Metrocentro (Villa Nueva)', address: 'C.C. Metrocentro, 5ta Calle 5-47, Villa Nueva', zone: 'Villa Nueva', coords: [14.5240, -90.5890] },
      { id: 'mc-petapa', name: 'Sucursal Álamos (San Miguel Petapa)', address: 'Boulevard Los Álamos, Petapa', zone: 'San Miguel Petapa', coords: [14.5050, -90.5610] },
      { id: 'mc-antigua', name: 'Sucursal Calle del Arco (Antigua Guatemala)', address: '5ta Avenida Norte No. 22, Antigua Guatemala', zone: 'Antigua Guatemala', coords: [14.5580, -90.7340] }
    ],
    menu: [
      {
        id: 'mc-1',
        name: 'Big Mac',
        category: 'Hamburguesas',
        description: 'Doble carne y salsa especial',
        price: 45,
        image: 'css/Comercios/MC/2.png',
        popular: true
      },
      {
        id: 'mc-2',
        name: 'McPollo Crispy',
        category: 'Hamburguesas',
        description: 'Pollo crujiente y mayonesa',
        price: 40,
        image: 'css/Comercios/MC/3.png',
        popular: true
      },
      {
        id: 'mc-3',
        name: 'Cuarto de Libra',
        category: 'Hamburguesas',
        description: 'Carne de res con queso',
        price: 45,
        image: 'css/Comercios/MC/4.jpg',
        popular: true
      },
      {
        id: 'mc-4',
        name: 'McNuggets (10)',
        category: 'Pollo Frito',
        description: 'Trozos de pollo empanizados',
        price: 35,
        image: 'css/Comercios/MC/5.png',
        popular: true
      },
      {
        id: 'mc-5',
        name: 'Papas Medianas',
        category: 'Acompañamientos',
        description: 'Papas fritas clásicas',
        price: 15,
        image: 'css/Comercios/MC/6.png'
      },
      {
        id: 'mc-6',
        name: 'McFlurry de Oreo',
        category: 'Postres',
        description: 'Helado de vainilla y galleta',
        price: 20,
        image: 'css/Comercios/MC/7.png',
        popular: true
      }
    ]
  },

  // ========================================================
  // 2. PIZZA HUT
  // ========================================================
  {
    id: 'rest-pizzahut',
    name: 'Pizza Hut',
    category: 'pizzas',
    rating: 4.8,
    reviewsCount: 2150,
    deliveryTime: '25-35 min',
    deliveryFee: 15,
    minOrder: 50,
    discountBadge: 'Hut Lovers',
    coverImage: 'css/Comercios/Pizzah/1.png',
    logo: 'css/Comercios/Pizzah/1.png',
    address: 'Zona 10, Blvd. Los Próceres, Ciudad de Guatemala',
    isPromoted: true,
    branches: [
      { id: 'ph-z14',   name: 'Sucursal Las Américas (Zona 14)', address: 'Av. Las Américas 15-00, Zona 14', zone: 'Zona 14', coords: [14.5835, -90.5192] },
      { id: 'ph-z10',   name: 'Sucursal Zona Viva (Zona 10)', address: '12 Calle 4-20, Zona 10', zone: 'Zona 10', coords: [14.5980, -90.5100] },
      { id: 'ph-z11',   name: 'Sucursal Miraflores (Zona 11)', address: 'Calzada Roosevelt 22-00, Zona 11', zone: 'Zona 11', coords: [14.6225, -90.5515] },
      { id: 'ph-z16',   name: 'Sucursal Paseo Cayalá (Zona 16)', address: 'Paseo Cayalá Local 105, Zona 16', zone: 'Zona 16', coords: [14.6120, -90.4860] },
      { id: 'ph-z1',    name: 'Sucursal Centro Histórico (Zona 1)', address: '6ta Avenida 11-40, Zona 1', zone: 'Zona 1', coords: [14.6360, -90.5130] },
      { id: 'ph-z4',    name: 'Sucursal Cuatro Grados Norte (Zona 4)', address: 'Ruta 4 6-25, Zona 4', zone: 'Zona 4', coords: [14.6180, -90.5150] },
      { id: 'ph-ces',   name: 'Sucursal Pradera Concepción (Carretera a El Salvador)', address: 'Km 15.5 Carretera a El Salvador', zone: 'Carretera a El Salvador', coords: [14.5450, -90.4700] },
      { id: 'ph-z15',   name: 'Sucursal Vista Hermosa (Zona 15)', address: 'Blvd. Vista Hermosa 20-30, Zona 15', zone: 'Zona 15', coords: [14.5975, -90.4890] },
      { id: 'ph-z9',    name: 'Sucursal Plaza España (Zona 9)', address: '7ma Ave y 12 Calle, Zona 9', zone: 'Zona 9', coords: [14.6040, -90.5160] },
      { id: 'ph-z12',   name: 'Sucursal Aguilar Batres (Zona 12)', address: 'Calzada Aguilar Batres 30-15, Zona 12', zone: 'Zona 12', coords: [14.5920, -90.5520] },
      { id: 'ph-z7',    name: 'Sucursal Peri Roosevelt (Zona 7)', address: 'Calzada San Juan 15-30, Zona 7', zone: 'Zona 7', coords: [14.6310, -90.5520] },
      { id: 'ph-mixco', name: 'Sucursal San Cristóbal (Mixco)', address: 'Blvd. San Cristóbal 12-50, Mixco', zone: 'Mixco', coords: [14.5940, -90.5790] },
      { id: 'ph-amatitlan', name: 'Sucursal Autopista Amatitlán (Km 27.5)', address: 'Km 27.5 Autopista al Pacífico, Zona Sur, Amatitlán', zone: 'Amatitlán', coords: [14.4790, -90.6280] },
      { id: 'ph-villanueva', name: 'Sucursal Metrocentro (Villa Nueva)', address: 'C.C. Metrocentro Villa Nueva Local 102', zone: 'Villa Nueva', coords: [14.5245, -90.5885] },
      { id: 'ph-petapa', name: 'Sucursal Álamos (San Miguel Petapa)', address: 'Centro Comercial Los Álamos, Petapa', zone: 'San Miguel Petapa', coords: [14.5045, -90.5615] },
      { id: 'ph-antigua', name: 'Sucursal Calle del Arco (Antigua Guatemala)', address: '5ta Avenida Norte No. 15, Antigua Guatemala', zone: 'Antigua Guatemala', coords: [14.5575, -90.7345] }
    ],
    menu: [
      {
        id: 'ph-1',
        name: 'Pizza Pepperoni',
        category: 'Pizzas',
        description: 'Mediana con extra queso',
        price: 80,
        image: 'css/Comercios/Pizzah/2.jpg',
        popular: true
      },
      {
        id: 'ph-2',
        name: 'Pizza de Queso',
        category: 'Pizzas',
        description: 'Mediana clásica',
        price: 75,
        image: 'css/Comercios/Pizzah/3.jpg',
        popular: true
      },
      {
        id: 'ph-3',
        name: 'Pizza Hawaiana',
        category: 'Pizzas',
        description: 'Mediana con jamón y piña',
        price: 85,
        image: 'css/Comercios/Pizzah/4.jpg',
        popular: true
      },
      {
        id: 'ph-4',
        name: 'Lasaña',
        category: 'Pastas & Platos Fuertes',
        description: 'Lasaña de carne y queso',
        price: 45,
        image: 'css/Comercios/Pizzah/5.jpg',
        popular: true
      },
      {
        id: 'ph-5',
        name: 'Palitroques',
        category: 'Entradas',
        description: 'Palitos de pan con queso',
        price: 30,
        image: 'css/Comercios/Pizzah/6.jpg'
      },
      {
        id: 'ph-6',
        name: 'Rollos de Canela',
        category: 'Postres',
        description: 'Postre dulce horneado',
        price: 25,
        image: 'css/Comercios/Pizzah/7.jpg'
      }
    ]
  },

  // ========================================================
  // 3. BURGER KING
  // ========================================================
  {
    id: 'rest-burgerking',
    name: 'Burger King',
    category: 'hamburguesas',
    rating: 4.7,
    reviewsCount: 1840,
    deliveryTime: '20-30 min',
    deliveryFee: 15,
    minOrder: 40,
    discountBadge: 'A la Parrilla',
    coverImage: 'css/Comercios/BK/1.png',
    logo: 'css/Comercios/BK/1.png',
    address: 'Zona 10, Boulevard Los Próceres 14-10, Guatemala',
    isPromoted: true,
    branches: [
      { id: 'bk-z14',   name: 'Sucursal Las Américas (Zona 14)', address: 'Av. Las Américas 12-30, Zona 14', zone: 'Zona 14', coords: [14.5845, -90.5188] },
      { id: 'bk-z10',   name: 'Sucursal Los Próceres (Zona 10)', address: 'Blvd. Los Próceres 14-10, Zona 10', zone: 'Zona 10', coords: [14.5978, -90.5105] },
      { id: 'bk-z11',   name: 'Sucursal Roosevelt (Zona 11)', address: 'Calzada Roosevelt 24-10, Zona 11', zone: 'Zona 11', coords: [14.6230, -90.5520] },
      { id: 'bk-z16',   name: 'Sucursal Paseo Cayalá (Zona 16)', address: 'Paseo Cayalá, Zona 16', zone: 'Zona 16', coords: [14.6115, -90.4862] },
      { id: 'bk-z1',    name: 'Sucursal 6ta Avenida (Zona 1)', address: '6ta Ave 9-45, Zona 1', zone: 'Zona 1', coords: [14.6365, -90.5132] },
      { id: 'bk-z4',    name: 'Sucursal Cuatro Grados Norte (Zona 4)', address: 'Vía 4 1-00, Zona 4', zone: 'Zona 4', coords: [14.6182, -90.5148] },
      { id: 'bk-ces',   name: 'Sucursal Carretera a El Salvador (Km 14.5)', address: 'Km 14.5 Carr. a El Salvador', zone: 'Carretera a El Salvador', coords: [14.5455, -90.4695] },
      { id: 'bk-z15',   name: 'Sucursal Vista Hermosa (Zona 15)', address: 'Blvd. Vista Hermosa 22-10, Zona 15', zone: 'Zona 15', coords: [14.5982, -90.4895] },
      { id: 'bk-z9',    name: 'Sucursal Plaza España (Zona 9)', address: '7ma Avenida y 11 Calle, Zona 9', zone: 'Zona 9', coords: [14.6035, -90.5165] },
      { id: 'bk-z12',   name: 'Sucursal Aguilar Batres (Zona 12)', address: 'Calzada Aguilar Batres 33-20, Zona 12', zone: 'Zona 12', coords: [14.5915, -90.5525] },
      { id: 'bk-z7',    name: 'Sucursal San Juan (Zona 7)', address: 'Calzada San Juan 16-40, Zona 7', zone: 'Zona 7', coords: [14.6305, -90.5515] },
      { id: 'bk-mixco', name: 'Sucursal San Cristóbal (Mixco)', address: 'Blvd. San Cristóbal 10-20, Mixco', zone: 'Mixco', coords: [14.5945, -90.5785] },
      { id: 'bk-amatitlan', name: 'Sucursal Barrio El Hospital (Entrada Palín)', address: '7ª Calle 14-00, Barrio El Hospital (Frente a Maxi Despensa / La Esso, Entrada Palín - Amatitlán)', zone: 'Amatitlán', coords: [14.4820, -90.6285] },
      { id: 'bk-villanueva', name: 'Sucursal Santa Clara (Villa Nueva)', address: 'C.C. Santa Clara, Km 17.5 CA-9 Sur, Villa Nueva', zone: 'Villa Nueva', coords: [14.5235, -90.5895] },
      { id: 'bk-petapa', name: 'Sucursal Los Álamos (Petapa)', address: 'Boulevard Los Álamos, San Miguel Petapa', zone: 'San Miguel Petapa', coords: [14.5055, -90.5605] },
      { id: 'bk-antigua', name: 'Sucursal Antigua Centro', address: '4ta Calle Poniente No. 7, Antigua Guatemala', zone: 'Antigua Guatemala', coords: [14.5565, -90.7335] }
    ],
    menu: [
      {
        id: 'bk-1',
        name: 'Whopper',
        category: 'Hamburguesas',
        description: 'Carne a la parrilla y vegetales',
        price: 45,
        image: 'css/Comercios/BK/2.webp',
        popular: true
      },
      {
        id: 'bk-2',
        name: 'Hamburguesa con Queso',
        category: 'Hamburguesas',
        description: 'Clásica con queso derretido',
        price: 25,
        image: 'css/Comercios/BK/3.webp',
        popular: true
      },
      {
        id: 'bk-3',
        name: 'Doble Cheeseburger',
        category: 'Hamburguesas',
        description: 'Doble carne y queso',
        price: 35,
        image: 'css/Comercios/BK/4.webp',
        popular: true
      },
      {
        id: 'bk-4',
        name: 'Chicken Royale',
        category: 'Sándwiches & Pollo',
        description: 'Sándwich de pollo largo',
        price: 40,
        image: 'css/Comercios/BK/5.webp',
        popular: true
      },
      {
        id: 'bk-5',
        name: 'Papas Grandes',
        category: 'Acompañamientos',
        description: 'Porción grande de papas',
        price: 18,
        image: 'css/Comercios/BK/6.webp'
      },
      {
        id: 'bk-6',
        name: 'Sundae Chocolate',
        category: 'Postres',
        description: 'Helado con sirope',
        price: 15,
        image: 'css/Comercios/BK/7.webp'
      }
    ]
  },

  // ========================================================
  // 4. SUBWAY
  // ========================================================
  {
    id: 'rest-subway',
    name: 'Subway',
    category: 'sandwiches',
    rating: 4.8,
    reviewsCount: 1420,
    deliveryTime: '15-25 min',
    deliveryFee: 12,
    minOrder: 35,
    discountBadge: 'Come Fresco',
    coverImage: 'css/Comercios/SW/1.png',
    logo: 'css/Comercios/SW/1.png',
    address: 'Zona 14, 10ma Avenida 14-25, Ciudad de Guatemala',
    isPromoted: true,
    branches: [
      { id: 'sub-z14',   name: 'Sucursal Las Américas (Zona 14)', address: '10ma Ave 14-25, Zona 14', zone: 'Zona 14', coords: [14.5852, -90.5186] },
      { id: 'sub-z10',   name: 'Sucursal Zona Viva (Zona 10)', address: '1ra Ave 13-22, Zona 10', zone: 'Zona 10', coords: [14.5990, -90.5095] },
      { id: 'sub-z11',   name: 'Sucursal Miraflores (Zona 11)', address: 'C.C. Miraflores Local 210, Zona 11', zone: 'Zona 11', coords: [14.6215, -90.5505] },
      { id: 'sub-z16',   name: 'Sucursal Paseo Cayalá (Zona 16)', address: 'Paseo Cayalá, Zona 16', zone: 'Zona 16', coords: [14.6125, -90.4855] },
      { id: 'sub-z1',    name: 'Sucursal Portal del Comercio (Zona 1)', address: '8va Calle y 6ta Ave, Zona 1', zone: 'Zona 1', coords: [14.6370, -90.5130] },
      { id: 'sub-z4',    name: 'Sucursal Granat (Zona 4)', address: '4ta Grados Norte, Zona 4', zone: 'Zona 4', coords: [14.6180, -90.5155] },
      { id: 'sub-ces',   name: 'Sucursal Concepción (Carretera a El Salvador)', address: 'Km 15 Carretera a El Salvador', zone: 'Carretera a El Salvador', coords: [14.5445, -90.4705] },
      { id: 'sub-z15',   name: 'Sucursal Vista Hermosa (Zona 15)', address: 'Blvd. Vista Hermosa 19-50, Zona 15', zone: 'Zona 15', coords: [14.5970, -90.4885] },
      { id: 'sub-z9',    name: 'Sucursal Montúfar (Zona 9)', address: '12 Calle y 6ta Ave, Zona 9', zone: 'Zona 9', coords: [14.6030, -90.5170] },
      { id: 'sub-z12',   name: 'Sucursal Aguilar Batres (Zona 12)', address: 'Calzada Aguilar Batres 34-10, Zona 12', zone: 'Zona 12', coords: [14.5910, -90.5530] },
      { id: 'sub-z7',    name: 'Sucursal Peri Roosevelt (Zona 7)', address: 'Calzada Roosevelt 25-00, Zona 7', zone: 'Zona 7', coords: [14.6315, -90.5525] },
      { id: 'sub-mixco', name: 'Sucursal San Cristóbal (Mixco)', address: 'Plaza San Cristóbal Local 8, Mixco', zone: 'Mixco', coords: [14.5935, -90.5795] },
      { id: 'sub-amatitlan', name: 'Sucursal Flores del Lago (Amatitlán)', address: 'C.C. Flores del Lago, Km 29.6 CA-9 Sur, Locales 21-22, Amatitlán', zone: 'Amatitlán', coords: [14.4708, -90.6387] },
      { id: 'sub-amatitlan-metroplaza', name: 'Sucursal Metroplaza (Amatitlán)', address: 'C.C. Metroplaza Amatitlán, Km 28.5 Carretera al Pacífico', zone: 'Amatitlán', coords: [14.4635, -90.6210] },
      { id: 'sub-villanueva', name: 'Sucursal Metrocentro (Villa Nueva)', address: 'C.C. Metrocentro Local 215, Villa Nueva', zone: 'Villa Nueva', coords: [14.5242, -90.5888] },
      { id: 'sub-petapa', name: 'Sucursal Álamos (San Miguel Petapa)', address: 'Plaza Los Álamos Local 5, Petapa', zone: 'San Miguel Petapa', coords: [14.5048, -90.5612] },
      { id: 'sub-antigua', name: 'Sucursal Antigua Centro', address: '5ta Avenida Norte No. 10, Antigua Guatemala', zone: 'Antigua Guatemala', coords: [14.5578, -90.7342] }
    ],
    menu: [
      {
        id: 'sub-1',
        name: 'Italiano B.M.T.',
        category: 'Subs de Especialidad',
        description: 'Salami, pepperoni y jamón',
        price: 45,
        image: 'css/Comercios/SW/2.png',
        popular: true
      },
      {
        id: 'sub-2',
        name: 'Pollo Teriyaki',
        category: 'Subs de Especialidad',
        description: 'Trozos de pollo en salsa',
        price: 45,
        image: 'css/Comercios/SW/3.png',
        popular: true
      },
      {
        id: 'sub-3',
        name: 'Sub de Atún',
        category: 'Subs Clásicos',
        description: 'Mezcla clásica de atún',
        price: 40,
        image: 'css/Comercios/SW/4.png',
        popular: true
      },
      {
        id: 'sub-4',
        name: 'Subway Club',
        category: 'Subs de Especialidad',
        description: 'Pavo, jamón y res',
        price: 48,
        image: 'css/Comercios/SW/5.png',
        popular: true
      },
      {
        id: 'sub-5',
        name: 'Papas Chips',
        category: 'Snacks & Acompañamientos',
        description: 'Bolsa de frituras',
        price: 10,
        image: 'css/Comercios/SW/6.jpg'
      },
      {
        id: 'sub-6',
        name: 'Galleta Chocolate',
        category: 'Postres',
        description: 'Galleta recién horneada',
        price: 10,
        image: 'css/Comercios/SW/7.png'
      }
    ]
  },

  // ========================================================
  // 5. POLLO CAMPERO
  // ========================================================
  {
    id: 'rest-campero',
    name: 'Pollo Campero',
    category: 'pollo',
    rating: 4.9,
    reviewsCount: 3420,
    deliveryTime: '20-30 min',
    deliveryFee: 0,
    minOrder: 40,
    discountBadge: 'Envío Gratis',
    coverImage: 'css/Comercios/Pollo campero/1.png',
    logo: 'css/Comercios/Pollo campero/1.png',
    address: 'Red Metropolitana de Sucursales, Ciudad de Guatemala',
    isPromoted: true,
    branches: [
      { id: 'camp-z14',   name: 'Sucursal Las Américas (Zona 14)', address: 'Av. Las Américas 8-20, Zona 14', zone: 'Zona 14', coords: [14.5840, -90.5190] },
      { id: 'camp-z10',   name: 'Sucursal Los Próceres (Zona 10)', address: 'Blvd. Los Próceres 12-40, Zona 10', zone: 'Zona 10', coords: [14.59859, -90.510683] },
      { id: 'camp-z11',   name: 'Sucursal Miraflores / Roosevelt (Zona 11)', address: 'Calzada Roosevelt 22-00, Zona 11', zone: 'Zona 11', coords: [14.6220, -90.5510] },
      { id: 'camp-z16',   name: 'Sucursal Paseo Cayalá (Zona 16)', address: 'Paseo Cayalá, Zona 16', zone: 'Zona 16', coords: [14.6110, -90.4870] },
      { id: 'camp-z1',    name: 'Sucursal Paseo de la Sexta (Zona 1)', address: '6ta Ave 10-33, Zona 1', zone: 'Zona 1', coords: [14.6360, -90.5135] },
      { id: 'camp-z4',    name: 'Sucursal Cuatro Grados Norte (Zona 4)', address: 'Ruta 4 y 7ma Ave, Zona 4', zone: 'Zona 4', coords: [14.6180, -90.5140] },
      { id: 'camp-ces',   name: 'Sucursal Plaza Concepción (Carretera a El Salvador)', address: 'Km 14.5 Carretera a El Salvador, Plaza Concepción', zone: 'Carretera a El Salvador', coords: [14.5450, -90.4700] },
      { id: 'camp-z15',   name: 'Sucursal Vista Hermosa (Zona 15)', address: 'Boulevard Vista Hermosa 23-40, Zona 15', zone: 'Zona 15', coords: [14.5975, -90.4890] },
      { id: 'camp-z9',    name: 'Sucursal Plaza España (Zona 9)', address: '7ma Avenida 12-15, Zona 9, Plaza España', zone: 'Zona 9', coords: [14.6040, -90.5160] },
      { id: 'camp-z12',   name: 'Sucursal Aguilar Batres (Zona 12)', address: 'Calzada Aguilar Batres 32-00, Zona 12', zone: 'Zona 12', coords: [14.5920, -90.5520] },
      { id: 'camp-z7',    name: 'Sucursal Peri Roosevelt / San Juan (Zona 7)', address: 'Calzada San Juan 14-20, Zona 7', zone: 'Zona 7', coords: [14.6310, -90.5520] },
      { id: 'camp-mixco', name: 'Sucursal San Cristóbal (Mixco)', address: 'Boulevard Principal San Cristóbal 11-40, Mixco', zone: 'Mixco', coords: [14.5940, -90.5790] },
      { id: 'camp-amatitlan-centro', name: 'Sucursal Amatitlán Centro (Parque Central)', address: '7ª Calle 3-21, Cantón San Antonio, Amatitlán (a 1 cuadra del Parque)', zone: 'Amatitlán', coords: [14.4800, -90.6200] },
      { id: 'camp-amatitlan-flores', name: 'Sucursal Flores del Lago (Amatitlán)', address: 'Km 29.6 Autopista CA-9 Sur, C.C. Flores del Lago, Amatitlán', zone: 'Amatitlán', coords: [14.4708, -90.6387] },
      { id: 'camp-villanueva', name: 'Sucursal Metrocentro (Villa Nueva)', address: 'C.C. Metrocentro Villa Nueva, 5ta Calle 5-47', zone: 'Villa Nueva', coords: [14.5240, -90.5890] },
      { id: 'camp-petapa', name: 'Sucursal Álamos (San Miguel Petapa)', address: 'Boulevard Los Álamos, C.C. Los Álamos', zone: 'San Miguel Petapa', coords: [14.5050, -90.5610] },
      { id: 'camp-antigua', name: 'Sucursal Santa Lucía (Antigua Guatemala)', address: 'Calzada Santa Lucía No. 24, Antigua Guatemala', zone: 'Antigua Guatemala', coords: [14.5590, -90.7380] }
    ],
    menu: [
      {
        id: 'camp-101',
        name: 'Menú Individual',
        category: 'Combos Tradicionales',
        description: '2 piezas, papas y pan',
        price: 40,
        image: 'css/Comercios/Pollo campero/2.png',
        popular: true
      },
      {
        id: 'camp-102',
        name: 'Supercampero',
        category: 'Combos Tradicionales',
        description: '3 piezas, papas, ensalada',
        price: 55,
        image: 'css/Comercios/Pollo campero/3.png',
        popular: true
      },
      {
        id: 'camp-103',
        name: 'Menú de Alitas',
        category: 'Alitas & Extras',
        description: 'Alitas bañadas en salsa',
        price: 45,
        image: 'css/Comercios/Pollo campero/4.png',
        popular: true
      },
      {
        id: 'camp-104',
        name: 'Menú Camperitos',
        category: 'Combos Tradicionales',
        description: 'Trozos de pollo sin hueso',
        price: 40,
        image: 'css/Comercios/Pollo campero/5.png',
        popular: true
      },
      {
        id: 'camp-105',
        name: 'Flan',
        category: 'Postres',
        description: 'Postre tradicional',
        price: 15,
        image: 'css/Comercios/Pollo campero/6.png'
      },
      {
        id: 'camp-106',
        name: 'Sándwiches',
        category: 'Sándwiches & Pollo',
        description: 'Sándwich de pollo extra crujiente',
        price: 35,
        image: 'css/Comercios/Pollo campero/7.png',
        popular: true
      }
    ]
  },

  // ========================================================
  // 6. DOMINO'S
  // ========================================================
  {
    id: 'rest-dominos',
    name: "Domino's",
    category: 'pizzas',
    rating: 4.7,
    reviewsCount: 1980,
    deliveryTime: '25-35 min',
    deliveryFee: 12,
    minOrder: 50,
    discountBadge: 'Martes 2x1',
    coverImage: 'css/Comercios/Dominos/1.png',
    logo: 'css/Comercios/Dominos/1.png',
    address: 'Red Metropolitana de Pizzerías, Ciudad de Guatemala',
    isPromoted: false,
    branches: [
      { id: 'dom-z14',   name: 'Sucursal Las Américas (Zona 14)', address: 'Av. Las Américas 16-20, Zona 14', zone: 'Zona 14', coords: [14.5822, -90.5195] },
      { id: 'dom-z10',   name: 'Sucursal Los Próceres (Zona 10)', address: 'Blvd. Los Próceres 15-20, Zona 10', zone: 'Zona 10', coords: [14.5970, -90.5115] },
      { id: 'dom-z11',   name: 'Sucursal Majadas (Zona 11)', address: 'Parque Las Majadas, Zona 11', zone: 'Zona 11', coords: [14.6190, -90.5560] },
      { id: 'dom-z16',   name: 'Sucursal Paseo Cayalá (Zona 16)', address: 'Plaza Cayalá, Zona 16', zone: 'Zona 16', coords: [14.6115, -90.4865] },
      { id: 'dom-z4',    name: 'Sucursal Cuatro Grados Norte (Zona 4)', address: 'Vía 5 4-50, Zona 4', zone: 'Zona 4', coords: [14.6175, -90.5145] },
      { id: 'dom-z1',    name: 'Sucursal Centro Histórico (Zona 1)', address: '8va Ave y 10ma Calle, Zona 1', zone: 'Zona 1', coords: [14.6340, -90.5125] },
      { id: 'dom-ces',   name: 'Sucursal Carretera a El Salvador (Km 14.5)', address: 'Km 14.5 Carr. a El Salvador', zone: 'Carretera a El Salvador', coords: [14.5460, -90.4710] },
      { id: 'dom-z15',   name: 'Sucursal Vista Hermosa (Zona 15)', address: '15 Ave 3-20, Zona 15', zone: 'Zona 15', coords: [14.5960, -90.4900] },
      { id: 'dom-z9',    name: 'Sucursal Plaza España (Zona 9)', address: '7ma Ave y 12 Calle, Zona 9', zone: 'Zona 9', coords: [14.6040, -90.5160] },
      { id: 'dom-z12',   name: 'Sucursal Aguilar Batres (Zona 12)', address: 'Calzada Aguilar Batres 32-00, Zona 12', zone: 'Zona 12', coords: [14.5920, -90.5520] },
      { id: 'dom-z7',    name: 'Sucursal Peri Roosevelt (Zona 7)', address: 'Calzada San Juan 14-20, Zona 7', zone: 'Zona 7', coords: [14.6310, -90.5520] },
      { id: 'dom-mixco', name: 'Sucursal San Cristóbal (Mixco)', address: 'Boulevard Principal San Cristóbal 11-40, Mixco', zone: 'Mixco', coords: [14.5940, -90.5790] },
      { id: 'dom-amatitlan', name: 'Sucursal Flores del Lago (Amatitlán)', address: 'Km 29.5 Carretera al Pacífico, C.C. Flores del Lago, Amatitlán', zone: 'Amatitlán', coords: [14.4708, -90.6387] },
      { id: 'dom-amatitlan-centro', name: 'Sucursal Amatitlán Centro', address: '5ta Avenida y 4ta Calle, Barrio El Rosario, Amatitlán', zone: 'Amatitlán', coords: [14.4815, -90.6210] },
      { id: 'dom-villanueva', name: 'Sucursal Metrocentro (Villa Nueva)', address: 'C.C. Metrocentro Local 118, Villa Nueva', zone: 'Villa Nueva', coords: [14.5248, -90.5882] },
      { id: 'dom-petapa', name: 'Sucursal Álamos (San Miguel Petapa)', address: 'C.C. Los Álamos Local 12, Petapa', zone: 'San Miguel Petapa', coords: [14.5052, -90.5608] },
      { id: 'dom-antigua', name: 'Sucursal Calzada Santa Lucía (Antigua Guatemala)', address: 'Calzada Santa Lucía No. 18, Antigua Guatemala', zone: 'Antigua Guatemala', coords: [14.5585, -90.7375] }
    ],
    menu: [
      {
        id: 'dom-1',
        name: 'Pizza Mediana',
        category: 'Pizzas',
        description: '1 ingrediente a elección',
        price: 75,
        image: 'css/Comercios/Dominos/2.png',
        popular: true
      },
      {
        id: 'dom-2',
        name: 'Pizza Grande',
        category: 'Pizzas',
        description: 'Especialidad de la casa',
        price: 95,
        image: 'css/Comercios/Dominos/3.png',
        popular: true
      },
      {
        id: 'dom-3',
        name: 'Don Calzzone',
        category: 'Calzzones',
        description: 'Relleno de carne y queso',
        price: 45,
        image: 'css/Comercios/Dominos/4.png',
        popular: true
      },
      {
        id: 'dom-4',
        name: 'Menú de Alitas',
        category: 'Entradas & Extras',
        description: 'Alitas horneadas',
        price: 45,
        image: 'css/Comercios/Dominos/5.png',
        popular: true
      },
      {
        id: 'dom-5',
        name: 'Don Calzzone Nutella',
        category: 'Postres',
        description: 'Relleno dulce con fresas',
        price: 30,
        image: 'css/Comercios/Dominos/6.png'
      },
      {
        id: 'dom-6',
        name: 'Coca-Cola',
        category: 'Bebidas',
        description: 'Bebida de 1.25L',
        price: 15,
        image: 'css/Comercios/Dominos/7.png'
      }
    ]
  }
];

// Cálculo de distancia geográfica (Haversine) en Kilómetros
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Catálogo geográfico de localidades, municipios y cabeceras de Guatemala para asignación dinámica automática
const GUATEMALA_LOCALITIES = [
  // Municipios metropolitanos y aledaños
  {
    slug: 'amatitlan',
    name: 'Amatitlán',
    zoneName: 'Amatitlán (Parque Central / Centro)',
    bounds: { minLat: 14.440, maxLat: 14.515, minLng: -90.660, maxLng: -90.580 },
    hubCoords: [14.4793, -90.6198],
    hubAddress: '7ma Calle y 5ta Avenida, Parque Central, Amatitlán'
  },
  {
    slug: 'villanueva',
    name: 'Villa Nueva',
    zoneName: 'Villa Nueva (Metrocentro / Santa Clara)',
    bounds: { minLat: 14.505, maxLat: 14.550, minLng: -90.620, maxLng: -90.560 },
    hubCoords: [14.5240, -90.5890],
    hubAddress: 'C.C. Metrocentro, 5ta Calle 5-47, Villa Nueva'
  },
  {
    slug: 'petapa',
    name: 'San Miguel Petapa',
    zoneName: 'San Miguel Petapa (Álamos / Prados)',
    bounds: { minLat: 14.480, maxLat: 14.530, minLng: -90.560, maxLng: -90.520 },
    hubCoords: [14.5020, -90.5590],
    hubAddress: 'Boulevard Los Álamos, San Miguel Petapa'
  },
  {
    slug: 'villacanales',
    name: 'Villa Canales',
    zoneName: 'Villa Canales (Centro / Boca del Monte)',
    bounds: { minLat: 14.460, maxLat: 14.535, minLng: -90.535, maxLng: -90.470 },
    hubCoords: [14.4820, -90.5200],
    hubAddress: 'Avenida Principal 3-10, Villa Canales'
  },
  {
    slug: 'mixco',
    name: 'Mixco',
    zoneName: 'Mixco (San Cristóbal / El Naranjo)',
    bounds: { minLat: 14.575, maxLat: 14.650, minLng: -90.620, maxLng: -90.565 },
    hubCoords: [14.5940, -90.5790],
    hubAddress: 'Boulevard Principal San Cristóbal 14-20, Mixco'
  },
  {
    slug: 'santacatarina',
    name: 'Santa Catarina Pinula',
    zoneName: 'Santa Catarina Pinula (Carretera a El Salvador)',
    bounds: { minLat: 14.530, maxLat: 14.580, minLng: -90.510, maxLng: -90.450 },
    hubCoords: [14.5450, -90.4700],
    hubAddress: 'Plaza Concepción, Km 14.5 Carretera a El Salvador'
  },
  {
    slug: 'fraijanes',
    name: 'Fraijanes',
    zoneName: 'Fraijanes (Pavón / Olmeca)',
    bounds: { minLat: 14.440, maxLat: 14.520, minLng: -90.470, maxLng: -90.390 },
    hubCoords: [14.4650, -90.4400],
    hubAddress: 'Carretera a Fraijanes Km 20.5, Fraijanes'
  },
  {
    slug: 'sanjosepinula',
    name: 'San José Pinula',
    zoneName: 'San José Pinula (Hacienda Nueva)',
    bounds: { minLat: 14.510, maxLat: 14.580, minLng: -90.440, maxLng: -90.380 },
    hubCoords: [14.5450, -90.4120],
    hubAddress: 'Calle Real 2-15, San José Pinula'
  },
  {
    slug: 'sanlucas',
    name: 'San Lucas Sacatepéquez',
    zoneName: 'San Lucas Sacatepéquez (Monumento)',
    bounds: { minLat: 14.590, maxLat: 14.630, minLng: -90.680, maxLng: -90.630 },
    hubCoords: [14.6080, -90.6550],
    hubAddress: 'C.C. Las Puertas, Km 29.5 Carretera Interamericana, San Lucas'
  },
  {
    slug: 'antigua',
    name: 'Antigua Guatemala',
    zoneName: 'Antigua Guatemala (Centro / Arco de Santa Catalina)',
    bounds: { minLat: 14.520, maxLat: 14.590, minLng: -90.770, maxLng: -90.690 },
    hubCoords: [14.5580, -90.7340],
    hubAddress: '5ta Avenida Norte No. 22, Calle del Arco, Antigua Guatemala'
  },
  {
    slug: 'chimaltenango',
    name: 'Chimaltenango',
    zoneName: 'Chimaltenango (Pradera / Centro)',
    bounds: { minLat: 14.620, maxLat: 14.700, minLng: -90.870, maxLng: -90.780 },
    hubCoords: [14.6620, -90.8200],
    hubAddress: 'C.C. Pradera Chimaltenango, Km 55 Carretera Interamericana'
  },
  {
    slug: 'escuintla',
    name: 'Escuintla',
    zoneName: 'Escuintla (Pradera / Cabecera)',
    bounds: { minLat: 14.250, maxLat: 14.360, minLng: -90.830, maxLng: -90.730 },
    hubCoords: [14.3000, -90.7850],
    hubAddress: 'C.C. Pradera Escuintla, Km 60 Carretera al Pacífico'
  },
  {
    slug: 'xela',
    name: 'Quetzaltenango',
    zoneName: 'Quetzaltenango (Xela / Pradera / Parque Central)',
    bounds: { minLat: 14.800, maxLat: 14.890, minLng: -91.560, maxLng: -91.480 },
    hubCoords: [14.8350, -91.5180],
    hubAddress: 'C.C. Pradera Xela, Avenida Las Américas Zona 3, Quetzaltenango'
  },
  {
    slug: 'mazatenango',
    name: 'Mazatenango',
    zoneName: 'Mazatenango (Suchitepéquez / Las Américas)',
    bounds: { minLat: 14.500, maxLat: 14.560, minLng: -91.540, maxLng: -91.460 },
    hubCoords: [14.5340, -91.5030],
    hubAddress: 'C.C. Plaza Américas, Km 158 CA-2 Suroccidente, Mazatenango'
  },
  {
    slug: 'retalhuleu',
    name: 'Retalhuleu',
    zoneName: 'Retalhuleu (La Trinidad / Centro)',
    bounds: { minLat: 14.500, maxLat: 14.560, minLng: -91.700, maxLng: -91.640 },
    hubCoords: [14.5350, -91.6780],
    hubAddress: 'C.C. La Trinidad, Calzada Las Palmas, Retalhuleu'
  },
  {
    slug: 'coban',
    name: 'Cobán',
    zoneName: 'Cobán (Alta Verapaz / Magdalena)',
    bounds: { minLat: 15.440, maxLat: 15.510, minLng: -90.410, maxLng: -90.330 },
    hubCoords: [15.4700, -90.3700],
    hubAddress: 'C.C. Plaza Magdalena, 1ra Calle 15-20 Zona 2, Cobán'
  },
  {
    slug: 'puertobarrios',
    name: 'Puerto Barrios',
    zoneName: 'Puerto Barrios (Izabal / Pradera)',
    bounds: { minLat: 15.680, maxLat: 15.750, minLng: -88.620, maxLng: -88.550 },
    hubCoords: [15.7200, -88.5900],
    hubAddress: 'C.C. Pradera Puerto Barrios, 7ma Calle y Calzada Justo Rufino Barrios'
  },
  {
    slug: 'chiquimula',
    name: 'Chiquimula',
    zoneName: 'Chiquimula (Pradera / Centro)',
    bounds: { minLat: 14.760, maxLat: 14.820, minLng: -89.570, maxLng: -89.510 },
    hubCoords: [14.7900, -89.5450],
    hubAddress: 'C.C. Pradera Chiquimula, Km 167.5 CA-10'
  },

  // Zonas de la Ciudad de Guatemala
  { slug: 'z1',  name: 'Zona 1', zoneName: 'Zona 1 (Centro Histórico)', bounds: { minLat: 14.630, maxLat: 14.655, minLng: -90.525, maxLng: -90.505 }, hubCoords: [14.6390, -90.5120], hubAddress: '6ta Calle y 6ta Avenida, Centro Histórico, Zona 1' },
  { slug: 'z4',  name: 'Zona 4', zoneName: 'Zona 4 (Cuatro Grados Norte)', bounds: { minLat: 14.612, maxLat: 14.625, minLng: -90.522, maxLng: -90.510 }, hubCoords: [14.6185, -90.5152], hubAddress: 'Ruta 3 y Vía 4, Cuatro Grados Norte, Zona 4' },
  { slug: 'z7',  name: 'Zona 7', zoneName: 'Zona 7 (Peri Roosevelt / San Juan)', bounds: { minLat: 14.620, maxLat: 14.645, minLng: -90.575, maxLng: -90.540 }, hubCoords: [14.6310, -90.5520], hubAddress: 'Calzada San Juan 14-20, Zona 7' },
  { slug: 'z9',  name: 'Zona 9', zoneName: 'Zona 9 (Plaza España / Montúfar)', bounds: { minLat: 14.595, maxLat: 14.612, minLng: -90.525, maxLng: -90.512 }, hubCoords: [14.6040, -90.5160], hubAddress: '7ma Avenida 12-15, Plaza España, Zona 9' },
  { slug: 'z10', name: 'Zona 10', zoneName: 'Zona 10 (Zona Viva / Próceres)', bounds: { minLat: 14.590, maxLat: 14.610, minLng: -90.520, maxLng: -90.500 }, hubCoords: [14.5985, -90.5100], hubAddress: '16 Calle y 2da Avenida, Zona Viva, Zona 10' },
  { slug: 'z11', name: 'Zona 11', zoneName: 'Zona 11 (Miraflores / Roosevelt)', bounds: { minLat: 14.610, maxLat: 14.635, minLng: -90.570, maxLng: -90.530 }, hubCoords: [14.6220, -90.5520], hubAddress: 'C.C. Miraflores, 21 Calle 4-32, Zona 11' },
  { slug: 'z12', name: 'Zona 12', zoneName: 'Zona 12 (Aguilar Batres / USAC)', bounds: { minLat: 14.575, maxLat: 14.600, minLng: -90.565, maxLng: -90.540 }, hubCoords: [14.5920, -90.5520], hubAddress: 'Calzada Aguilar Batres 32-00, Zona 12' },
  { slug: 'z13', name: 'Zona 13', zoneName: 'Zona 13 (La Aurora / Aeropuerto)', bounds: { minLat: 14.570, maxLat: 14.590, minLng: -90.540, maxLng: -90.520 }, hubCoords: [14.5820, -90.5300], hubAddress: 'Avenida Hincapié 18-00, Zona 13' },
  { slug: 'z14', name: 'Zona 14', zoneName: 'Zona 14 (Las Américas / La Villa)', bounds: { minLat: 14.575, maxLat: 14.590, minLng: -90.530, maxLng: -90.510 }, hubCoords: [14.5825, -90.5198], hubAddress: 'Avenida Las Américas 18-02, Zona 14' },
  { slug: 'z15', name: 'Zona 15', zoneName: 'Zona 15 (Vista Hermosa)', bounds: { minLat: 14.590, maxLat: 14.605, minLng: -90.500, maxLng: -90.475 }, hubCoords: [14.5975, -90.4890], hubAddress: 'Boulevard Vista Hermosa 23-40, Zona 15' },
  { slug: 'z16', name: 'Zona 16', zoneName: 'Zona 16 (Paseo Cayalá)', bounds: { minLat: 14.605, maxLat: 14.625, minLng: -90.495, maxLng: -90.470 }, hubCoords: [14.6130, -90.4855], hubAddress: 'Paseo Cayalá, Boulevard Rafael Landívar, Zona 16' },
  { slug: 'z17', name: 'Zona 17', zoneName: 'Zona 17 (Lomas del Norte)', bounds: { minLat: 14.650, maxLat: 14.675, minLng: -90.480, maxLng: -90.450 }, hubCoords: [14.6620, -90.4670], hubAddress: 'Carretera al Atlántico Km 7.5, Zona 17' },
  { slug: 'z18', name: 'Zona 18', zoneName: 'Zona 18 (Atlántida)', bounds: { minLat: 14.665, maxLat: 14.700, minLng: -90.470, maxLng: -90.430 }, hubCoords: [14.6750, -90.4550], hubAddress: 'Boulevard Los Olivos, Zona 18' }
];

// Detecta con alta precisión la localidad, municipio o sector a partir de cualquier coordenada GPS
function detectLocalityFromCoords(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return GUATEMALA_LOCALITIES.find(l => l.slug === 'z10') || GUATEMALA_LOCALITIES[0];
  }

  // 1. Polígono de límites geográficos exactos (Bounding Box)
  for (const loc of GUATEMALA_LOCALITIES) {
    if (loc.bounds &&
        lat >= loc.bounds.minLat && lat <= loc.bounds.maxLat &&
        lng >= loc.bounds.minLng && lng <= loc.bounds.maxLng) {
      return loc;
    }
  }

  // 2. Proximidad a centros comerciales o cabeceras conocidas
  let closestLoc = GUATEMALA_LOCALITIES[0];
  let minD = 999999;
  for (const loc of GUATEMALA_LOCALITIES) {
    if (loc.hubCoords) {
      const d = calculateDistanceKm(lat, lng, loc.hubCoords[0], loc.hubCoords[1]);
      if (d < minD) {
        minD = d;
        closestLoc = loc;
      }
    }
  }

  if (minD <= 15.0) {
    return closestLoc;
  }

  // 3. Fallback inteligente universal: Cobertura departamental automática para cualquier punto del país
  return {
    slug: `loc-${Math.round(lat * 100)}-${Math.round(lng * 100)}`,
    name: 'Sector Local',
    zoneName: `Ubicación GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    hubCoords: [lat + 0.003, lng + 0.003],
    hubAddress: `Centro de Comercio Local (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    isUniversalGps: true
  };
}

// Resuelve inteligentemente cualquier texto, colonia o zona de Guatemala en coordenadas exactas
function resolveGuatemalaLocation(text) {
  if (!text || typeof text !== 'string') return null;
  const q = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (!q) return null;

  // 1. Búsqueda directa en catálogo geográfico de Guatemala
  for (const loc of GUATEMALA_LOCALITIES) {
    const locNameNorm = loc.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (q.includes(locNameNorm) || (loc.slug && q.includes(loc.slug))) {
      return {
        id: `loc-${loc.slug}`,
        name: loc.zoneName,
        address: loc.hubAddress,
        zone: loc.name,
        coords: loc.hubCoords
      };
    }
  }

  // 2. Sinónimos y términos frecuentes de búsqueda en Guatemala
  if (/\b(amatitlan|flores del lago|el rosario|lago amatitlan)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'amatitlan');
    return { id: 'loc-amatitlan', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(villa nueva|metrocentro|santa clara|frutal|metrosur)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'villanueva');
    return { id: 'loc-villanueva', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(san miguel petapa|petapa|alamos|los alamos|prados)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'petapa');
    return { id: 'loc-petapa', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(antigua|antigua guatemala|calle del arco|sacatepequez)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'antigua');
    return { id: 'loc-antigua', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(xela|quetzaltenango|parque centroamerica)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'xela');
    return { id: 'loc-xela', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(escuintla|palin|puerto san jose)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'escuintla');
    return { id: 'loc-escuintla', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(chimaltenango|parramos|el tejar)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'chimaltenango');
    return { id: 'loc-chimaltenango', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(carretera|el salvador|concepcion|fraijanes|santa catarina|km 14|km 15)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'santacatarina');
    return { id: 'loc-ces', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }
  if (/\b(mixco|san cristobal|el naranjo|naranjo mall)\b/.test(q)) {
    const loc = GUATEMALA_LOCALITIES.find(l => l.slug === 'mixco');
    return { id: 'loc-mixco', name: loc.zoneName, address: loc.hubAddress, zone: loc.name, coords: loc.hubCoords };
  }

  // 3. Patrón genérico para cualquier "Zona X"
  const genericZone = q.match(/\b(?:zona|z)\s*(\d{1,2})\b/);
  if (genericZone) {
    const zNum = parseInt(genericZone[1], 10);
    const existing = GUATEMALA_LOCALITIES.find(l => l.slug === `z${zNum}`);
    if (existing) {
      return { id: `loc-z${zNum}`, name: existing.zoneName, address: existing.hubAddress, zone: existing.name, coords: existing.hubCoords };
    }
    return {
      name: `Zona ${zNum} (Ciudad de Guatemala)`,
      address: `Avenida Principal, Zona ${zNum}, Guatemala`,
      zone: `Zona ${zNum}`,
      coords: [14.6200 + (Math.sin(zNum) * 0.035), -90.5150 + (Math.cos(zNum) * 0.035)]
    };
  }

  return null;
}

// Devuelve todas las sucursales de un restaurante ordenadas por cercanía al cliente,
// con MOTOR DE GENERACIÓN DINÁMICA que autogenera la sucursal local de la marca
// si el cliente se encuentra en un municipio o sector sin sucursal estática cercana
function getAllRestaurantBranchesSorted(restaurant, clientCoords) {
  if (!restaurant) return [];
  const coords = clientCoords || [14.5985, -90.5100];
  const userLat = coords[0];
  const userLng = coords[1];

  const locality = detectLocalityFromCoords(userLat, userLng);
  const staticBranches = Array.isArray(restaurant.branches) ? restaurant.branches : [];

  const evaluated = staticBranches.map(b => {
    const dist = calculateDistanceKm(userLat, userLng, b.coords[0], b.coords[1]);
    let fee = 0;
    if (dist <= 2.0) fee = 0;
    else if (dist <= 5.0) fee = 10;
    else if (dist <= 8.0) fee = 15;
    else fee = 20;

    let timeMin = Math.round(15 + dist * 3.5);
    let timeMax = timeMin + 10;

    return {
      ...b,
      distanceKm: dist,
      deliveryFee: (restaurant.id === 'rest-campero' && dist <= 3.5) ? 0 : fee,
      deliveryTime: `${timeMin}-${timeMax} min`,
      isDynamic: false
    };
  });

  evaluated.sort((a, b) => a.distanceKm - b.distanceKm);

  // MOTOR DINÁMICO: Si la sucursal física registrada más cercana está a más de 4.0 km
  // o si no hay ninguna registrada en la base de datos para esta localidad,
  // el sistema crea al vuelo una sucursal local de la marca para ese municipio/sector
  const closestExisting = evaluated[0];
  const needDynamicBranch = !closestExisting || closestExisting.distanceKm > 4.0;

  if (needDynamicBranch) {
    const hub = locality.hubCoords || [userLat + 0.015, userLng + 0.015];
    const dynDist = calculateDistanceKm(userLat, userLng, hub[0], hub[1]);

    const dynamicBranch = {
      id: `${restaurant.id}-dyn-${locality.slug}`,
      name: `Sucursal ${locality.name} (${restaurant.name})`,
      address: locality.hubAddress || `Centro Comercial / Cabecera de ${locality.name}`,
      zone: locality.name,
      coords: hub,
      distanceKm: dynDist,
      deliveryFee: 0, // Promoción de entrega local automática
      deliveryTime: '15-25 min',
      isDynamic: true,
      isAutoGenerated: true,
      localityName: locality.name
    };

    evaluated.unshift(dynamicBranch);
    evaluated.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  return evaluated;
}

// Encuentra la sucursal más cercana de un restaurante guiándose por las coordenadas exactas del mapa
function getNearestRestaurantBranch(restaurant, clientCoords) {
  const sorted = getAllRestaurantBranchesSorted(restaurant, clientCoords);
  return sorted[0];
}

// Helper functions for reactive restaurant data storage con soporte para agregar, editar y eliminar platillos
const RESTAURANTS_STORAGE_KEY = 'qgo_restaurants_gt_v18';

function getStoredRestaurants() {
  const stored = localStorage.getItem(RESTAURANTS_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Re-sincronizar con INITIAL_RESTAURANTS_BASE para conservar sucursales y metadatos base,
        // pero respetando al 100% el menú editado, eliminado o añadido por el comercio
        return INITIAL_RESTAURANTS_BASE.map(base => {
          const storedRest = parsed.find(p => p.id === base.id);
          if (!storedRest) return JSON.parse(JSON.stringify(base));
          return {
            ...base,
            ...storedRest,
            branches: base.branches, // Conservar las sucursales del mapa
            menu: Array.isArray(storedRest.menu) ? storedRest.menu : base.menu
          };
        });
      }
    } catch (e) {
      console.warn('Error al leer restaurantes almacenados:', e);
    }
  }
  const initial = JSON.parse(JSON.stringify(INITIAL_RESTAURANTS_BASE));
  localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveStoredRestaurants(restaurants) {
  localStorage.setItem(RESTAURANTS_STORAGE_KEY, JSON.stringify(restaurants));
}


// Cuentas precargadas con los roles del backend Java
const INITIAL_USERS = [
  {
    id: 1,
    nombre: 'Juan Carlos Castillo',
    correo: 'juan.guatemala@qgo.gt',
    contrasena: '123',
    rol: 'CLIENTE',
    direccion: '10ma Avenida 14-25, Zona 14, Ciudad de Guatemala',
    telefono: '+502 5555-1234'
  },
  {
    id: 10,
    nombre: 'Sofía Méndez',
    correo: 'sofia.mendez@qgo.gt',
    contrasena: '123',
    rol: 'CLIENTE',
    direccion: 'Paseo Cayalá, Zona 16, Ciudad de Guatemala',
    telefono: '+502 5555-9876'
  },
  {
    id: 2,
    nombre: 'Pollo Campero Zona 10',
    correo: 'pedidos@campero.com.gt',
    contrasena: '123',
    rol: 'COMERCIO',
    comercioId: 'rest-campero'
  },
  {
    id: 3,
    nombre: 'Erick Morales (Repartidor)',
    correo: 'erick.repartidor@qgo.gt',
    contrasena: '123',
    rol: 'REPARTIDOR',
    vehiculo: 'Pulsar NS 200 - Placa M-789XYZ',
    calificacion: 4.9,
    telefono: '+502 4444-9988'
  },
  {
    id: 4,
    nombre: 'Administrador General',
    correo: 'admin@qgo.gt',
    contrasena: 'admin',
    rol: 'ADMINISTRADOR'
  },
  {
    id: 5,
    nombre: "McDonald's Las Américas",
    correo: 'pedidos@mcdonalds.com.gt',
    contrasena: '123',
    rol: 'COMERCIO',
    comercioId: 'rest-mc'
  },
  {
    id: 6,
    nombre: 'Pizza Hut Zona Viva',
    correo: 'pedidos@pizzahut.com.gt',
    contrasena: '123',
    rol: 'COMERCIO',
    comercioId: 'rest-pizzahut'
  },
  {
    id: 7,
    nombre: 'Burger King Roosevelt',
    correo: 'pedidos@burgerking.com.gt',
    contrasena: '123',
    rol: 'COMERCIO',
    comercioId: 'rest-burgerking'
  },
  {
    id: 8,
    nombre: 'Subway Cayalá',
    correo: 'pedidos@subway.com.gt',
    contrasena: '123',
    rol: 'COMERCIO',
    comercioId: 'rest-subway'
  },
  {
    id: 9,
    nombre: "Domino's Pizza Las Américas",
    correo: 'pedidos@dominos.com.gt',
    contrasena: '123',
    rol: 'COMERCIO',
    comercioId: 'rest-dominos'
  }
];

// Pedido demo inicial de Guatemala con sucursal asignada más cercana y coordenadas de destino
const INITIAL_DEMO_ORDER = {
  id: 'QGO-7742',
  fecha: new Date().toISOString(),
  clienteId: 1,
  cliente: {
    id: 1,
    nombre: 'Juan Carlos Castillo',
    correo: 'juan.guatemala@qgo.gt',
    direccion: '10ma Avenida 14-25, Zona 14, Edificio Las Américas',
    telefono: '+502 5555-1234'
  },
  restaurante: {
    id: 'rest-campero',
    name: 'Pollo Campero',
    address: 'Av. Las Américas 8-20, Zona 14',
    coverImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800'
  },
  sucursal: {
    id: 'camp-z14',
    name: 'Sucursal Las Américas (Zona 14)',
    address: 'Av. Las Américas 8-20, Zona 14',
    zone: 'Zona 14',
    coords: [14.5840, -90.5190],
    distanceKm: 0.3,
    deliveryTime: '15-20 min'
  },
  clienteCoords: [14.585671, -90.518528],
  repartidor: {
    id: 3,
    nombre: 'Erick Morales (Repartidor Chapín)',
    vehiculo: 'Pulsar NS 200 - Placa M-789XYZ',
    calificacion: 4.9,
    telefono: '+502 4444-9988'
  },
  items: [
    { id: 'camp-101', name: 'Menú Individual', price: 40, quantity: 2 },
    { id: 'camp-104', name: 'Menú Camperitos', price: 40, quantity: 1 }
  ],
  subtotal: 120,
  deliveryFee: 0,
  serviceFee: 5,
  tip: 12,
  total: 137,
  metodoPago: 'Tarjeta BAC Credomatic',
  estado: 'EN_CAMINO',
  tiempoEstimadoMinutos: 12,
  posicionRepartidorPct: 55
};

window.QgoData = {
  getRestaurants: getStoredRestaurants,
  resolveLocation: resolveGuatemalaLocation
};
