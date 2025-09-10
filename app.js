let productos = [];
let carrito = [];

const contenedor = document.getElementById("productos");
const spanTotal = document.getElementById("total");

// Renderizar productos con filtro de categoría
function mostrarProductos(categoria = "Todas") {
  contenedor.innerHTML = "";

  let lista = productos;
  if (categoria !== "Todas") {
    lista = productos.filter(p => p.categoria === categoria);
  }

  lista.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("card");

    const itemEnCarrito = carrito.find(p => p.id === prod.id);
    const cantidadActual = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    // Total real según cantidad y mínimo
    const totalProducto = prod.precioUnitario * (prod.minimo > 1 ? prod.minimo : 1) * cantidadActual;

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h2>${prod.nombre}</h2>
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

// Calcular total del carrito
function calcularTotal() {
  const total = carrito.reduce((acum, p) => {
    const factor = p.minimo > 1 ? p.minimo : 1;
    return acum + p.precioUnitario * factor * p.cantidad;
  }, 0);

  spanTotal.textContent = total.toLocaleString();
  return total;
}

// Modificar cantidad respetando unidad de compra
function modificarCantidad(id, cambio) {
  let item = carrito.find(p => p.id === id);
  const producto = productos.find(p => p.id === id);

  if (!item && cambio > 0) {
    item = { ...producto, cantidad: 1 }; // 1 unidad de compra = mínimo real o 1
    carrito.push(item);
  } else if (item) {
    item.cantidad += cambio;
    if (item.cantidad < 1) carrito = carrito.filter(p => p.id !== id);
  }

  const cantidadActual = carrito.find(p => p.id === id)?.cantidad || 0;
  document.getElementById(`cantidad-${id}`).textContent = cantidadActual;

  mostrarProductos(document.getElementById("categoria").value); // refresca cards con total
  calcularTotal();
}

// Evento cambio de categoría
document.getElementById("categoria").addEventListener("change", (e) => {
  mostrarProductos(e.target.value);
});

// Abrir modal al presionar botón WhatsApp
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

  // Generar tabla de productos
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

  const telefono = "5491159221201"; // formato internacional
  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");

  document.getElementById("modalCliente").style.display = "none";
});

// 🔹 Cargar productos desde JSON y render inicial
fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos();
  })
  .catch(err => console.error("Error cargando productos:", err));