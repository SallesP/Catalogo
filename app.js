// Lista de productos con categoría
const productos = [
  { id: 1, nombre: "Galletitas", precio: 1200, imagen: "img/galletitas.jpg", categoria: "Golosinas" },
  { id: 2, nombre: "Jugo", precio: 800, imagen: "img/jugo.jpg", categoria: "Bebidas" },
  { id: 3, nombre: "Caramelos", precio: 500, imagen: "img/caramelos.jpg", categoria: "Golosinas" },
  { id: 4, nombre: "Alfajores Maixanas x14u", precio: 23200, imagen: "img/maixanasDubai.jpg", categoria: "Golosinas" },
];

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

    const cantidadActual = carrito.find(p => p.id === prod.id)?.cantidad || 0;

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h2>${prod.nombre}</h2>
      <p>$${prod.precio}</p>
      <div class="contador">
        <button onclick="modificarCantidad(${prod.id}, -1)">-</button>
        <span id="cantidad-${prod.id}">${cantidadActual}</span>
        <button onclick="modificarCantidad(${prod.id}, 1)">+</button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// Calcular total
function calcularTotal() {
  const total = carrito.reduce((acum, p) => acum + p.precio * p.cantidad, 0);
  spanTotal.textContent = total.toLocaleString();
  return total;
}

// Modificar cantidad
function modificarCantidad(id, cambio) {
  let item = carrito.find(p => p.id === id);

  if (!item && cambio > 0) {
    const producto = productos.find(p => p.id === id);
    item = { ...producto, cantidad: 0 };
    carrito.push(item);
  }

  if (item) {
    item.cantidad += cambio;
    if (item.cantidad < 0) item.cantidad = 0;
    document.getElementById(`cantidad-${id}`).textContent = item.cantidad;
    carrito = carrito.filter(p => p.cantidad > 0);
  }

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
    const subtotal = p.precio * p.cantidad;
    const nombreProd = p.nombre.padEnd(20, " ");
    const cantidad = p.cantidad.toString().padStart(2, " ");
    const totalProd = subtotal.toString().padStart(6, " ");
    return `${nombreProd} x${cantidad} = $${totalProd}`;
  }).join("\n");

  const total = carrito.reduce((acum, p) => acum + p.precio * p.cantidad, 0);

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
    `TOTAL: $${total}`
  );

  const telefono = "5491159221201"; // formato internacional
  window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");

  document.getElementById("modalCliente").style.display = "none";
});

// Render inicial
mostrarProductos();
