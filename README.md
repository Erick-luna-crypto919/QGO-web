# 🇬🇹 Qgo Delivery - Plataforma Web 100% Chapina

Plataforma de delivery web moderna y reactiva diseñada para el mercado de Guatemala, con arquitectura SPA (Single Page Application) e integración híbrida con backend **Spring Boot + PostgreSQL**.

---

## 🌟 Características Principales

1. **🍽️ Experiencia del Cliente**:
   - Catálogo de restaurantes aliados de Guatemala (*Pollo Campero, McDonald's, Pizza Hut, Burger King, Subway, Domino's*).
   - Menú interactivo con filtrado de categorías (*Pollo, Hamburguesas, Pizza, Tacos, Postres, etc.*).
   - Personalización de platillos, selección de sucursal más cercana y cálculo dinámico de envío según kilometraje.
   - Pasarela de compra con cupones de descuento interactivos (`QGOCHAPIN`, `ENVIOGRATIS`, `GUATE502`, `BIENVENIDO`).
   - Carrito persistente con barra flotante y acceso responsive optimizado para móviles y tablets.

2. **🗺️ Rastreo en Tiempo Real con Leaflet**:
   - Mapa GPS interactivo con coordenadas reales de la Ciudad de Guatemala.
   - Animación y seguimiento de la ruta del motorista desde la cocina asignada hasta la dirección del cliente.
   - Stepper de progreso (*Recibido ➔ En Preparación ➔ En Camino ➔ Entregado*).

3. **🧾 Facturación Legal SAT FEL**:
   - Generación de comprobantes y facturas electrónicas con cálculo de IVA, propina de motorista, tarifa de servicio y NIT Consumidor Final (C/F).

4. **👥 Sistema Multi-Rol de Acceso Rápido**:
   - **Cliente**: Exploración, carrito, pedido y tracking en vivo.
   - **Comercio (Cocina)**: Tablero de órdenes entrantes, despacho y gestión de menú (agregar platillos con foto, edición y eliminación).
   - **Repartidor**: Monitor de pedidos asignados, coordenadas GPS y confirmación de entrega.
   - **Administrador General**: Centro de control total (KPIs de ventas e ingresos, monitor global de órdenes, directorio y edición de usuarios, control de comercios y generador de cupones).

5. **⚡ Arquitectura Híbrida Inteligente**:
   - Conexión transparente con **Spring Boot REST API** en `http://localhost:8080`.
   - Soporte automático para URLs de producción en la nube.
   - Modo local autónomo (*fallback* en almacenamiento reactivo) que garantiza que la plataforma **nunca se quede inaccesible**.


---

## 💻 Desarrollo Local

Para probarlo localmente, puedes:
- Abrir [`index.html`](index.html) directamente con doble clic o con la extensión **Live Server** de VS Code.
- Para conectar el backend Spring Boot, ejecuta [`Qgo-backend/iniciar_servidor.bat`](../Qgo-backend/iniciar_servidor.bat). El semáforo superior cambiará automáticamente a `🟢 Spring Boot Conectado`.
