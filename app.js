let productos = {};
let carrito = [];

const contenedor = document.getElementById("productos");
const spanTotal = document.getElementById("total");

// Renderizar productos con filtro de categoría
function mostrarProductos(filtroCategoria = "Todas") {
  contenedor.innerHTML = "";

  for (let cat in productos) {
    if (filtroCategoria !== "Todas" && cat !== filtroCategoria) continue;

    // Encabezado de categoría
    const h2 = document.createElement("h2");
    h2.textContent = cat;
    contenedor.appendChild(h2);

    productos[cat].forEach(prod => {
      const card = document.createElement("div");
      card.classList.add("card");

      const itemEnCarrito = carrito.find(p => p.id === prod.id);
      const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;
      const factor = prod.minimo > 1 ? prod.minimo : 1;
      const totalProducto = prod.precioUnitario * factor * cantidadActual;

      card.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p>Precio unitario: $${prod.precioUnitario.toLocaleString()}</p>
        ${prod.minimo > 1 ? `<p>Mínimo (${prod.minimo}u): $${(prod.precioUnitario * prod.minimo).toLocaleString()}</p>` : ""}
        <p>Total: $${totalProducto.toLocaleString()}</p>
        <div class="contador">
          <button onclick="modificarCantidad(${prod.id}, -1)">-</button>
          <span id="cantidad-${prod.id}">${cantidadActual}</span>
          <button onclick="modificarCantidad(${prod.id}, 1)">+</button>
        </div>
      `;

      contenedor.appendChild(card);
    });
  }
}

// Calcular total del carrito
function calcularTotal() {
  const total = Object.values(productos).flat().reduce((acum, p) => {
    const item = carrito.find(c => c.id === p.id);
    if (!item) return acum;
    const factor = p.minimo > 1 ? p.minimo : 1;
    return acum + p.precioUnitario * factor * item.cantidad;
  }, 0);

  spanTotal.textContent = total.toLocaleString();
  return total;
}

// Modificar cantidad respetando unidad de compra
function modificarCantidad(id, cambio) {
  // Buscar el producto original
  let prodOriginal;
  for (let cat in productos) {
    prodOriginal = productos[cat].find(p => p.id === id);
    if (prodOriginal) break;
  }

  if (!prodOriginal) return;

  let item = carrito.find(p => p.id === id);

  if (!item && cambio > 0) {
    item = { ...prodOriginal, cantidad: 1 };
    carrito.push(item);
  } else if (item) {
    item.cantidad += cambio;
    if (item.cantidad < 1) carrito = carrito.filter(p => p.id !== id);
  }

  const cantidadActual = carrito.find(p => p.id === id)?.cantidad || 0;
  const spanCant = document.getElementById(`cantidad-${id}`);
  if (spanCant) spanCant.textContent = cantidadActual;

  mostrarProductos(document.getElementById("categoria").value);
  calcularTotal();
}

// Evento cambio de categoría
document.getElementById("categoria").addEventListener("change", (e) => {
  mostrarProductos(e.target.value);
});

// Abrir modal WhatsApp
document.getElementById("btn-whatsapp").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío 😅");
    return;
  }
  document.getElementById("modalCliente").style.display = "flex";
});

// Cancelar modal
document.getElementById("cancelarCliente").addEventListener("click", () => {
  document.getElementById("modalCliente").style.display = "none";
});

// Enviar mensaje por WhatsApp
document.getElementById("enviarCliente").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const localidad = document.getElementById("localidad").value.trim();
  const horarios = document.getElementById("horarios").value.trim();

  if (!nombre || !direccion || !localidad || !horarios) {
    alert("Por favor, completa todos los datos del cliente.");
    return;
  }

  const productosTexto = carrito.map(p => {
    const factor = p.minimo > 1 ? p.minimo : 1;
    const subtotal = p.precioUnitario * factor * p.cantidad;
    return `${p.nombre} x${p.cantidad} = $${subtotal.toLocaleString()}`;
  }).join("\n");

  const total = carrito.reduce((acum, p) => {
    const factor = p.minimo > 1 ? p.minimo : 1;
    return acum + p.precioUnitario * factor * p.cantidad;
  }, 0);

  const mensaje = encodeURIComponent(
    `Hola! Aquí está mi pedido:\n\n` +
    `Cliente: ${nombre}\n` +
    `Dirección: ${direccion}\n` +
    `Localidad: ${localidad}\n` +
    `Horarios: ${horarios}\n\n` +
    `Producto             Cant  Total\n` +
    `--------------------------------\n` +
    `${productosTexto}\n` +
    `--------------------------------\n` +
    `TOTAL: $${total.toLocaleString()}`
  );

  const telefono = "5491159221201";
  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");

  document.getElementById("modalCliente").style.display = "none";
});

// Cargar productos desde JSON y render inicial
fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos();
  })
  .catch(err => console.error("Error cargando productos:", err));
