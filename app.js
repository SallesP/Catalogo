// Lista de productos
const productos = [
  { id: 1, nombre: "Galletitas", precio: 1200, imagen: "img/galletitas.jpg" },
  { id: 2, nombre: "Jugo", precio: 800, imagen: "img/jugo.jpg" },
  { id: 3, nombre: "Caramelos", precio: 500, imagen: "img/caramelos.jpg" },
  { id: 4, nombre: "Alfajores Maixanas x14u", precio: 23200, imagen: "img/maixanasDubai.jpg" },
];

let carrito = [];
const contenedor = document.getElementById("productos");
const spanTotal = document.getElementById("total");

// Renderizar productos
function mostrarProductos() {
  contenedor.innerHTML = "";

  productos.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h2>${prod.nombre}</h2>
      <p>$${prod.precio}</p>
      <div class="contador">
        <button onclick="modificarCantidad(${prod.id}, -1)">-</button>
        <span id="cantidad-${prod.id}">0</span>
        <button onclick="modificarCantidad(${prod.id}, 1)">+</button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// Calcular total
function calcularTotal() {
  let total = carrito.reduce((acum, prod) => acum + prod.precio * prod.cantidad, 0);
  spanTotal.textContent = total;
  return total;
}

// Modificar cantidad
function modificarCantidad(id, cambio) {
  let item = carrito.find((p) => p.id === id);

  if (!item && cambio > 0) {
    const producto = productos.find((p) => p.id === id);
    item = { ...producto, cantidad: 0 };
    carrito.push(item);
  }

  if (item) {
    item.cantidad += cambio;
    if (item.cantidad < 0) item.cantidad = 0;

    document.getElementById(`cantidad-${id}`).textContent = item.cantidad;

    // Eliminar del carrito si cantidad = 0
    carrito = carrito.filter((p) => p.cantidad > 0);
  }

  calcularTotal();
}

// Generar mensaje de WhatsApp
function mensajeWhatsapp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío 😅");
    return "";
  }

  // Generar la “tabla” de productos
  const productosTexto = carrito.map(p => {
    let subtotal = p.precio * p.cantidad;
    // Ajustamos espacios para alinear un poco tipo tabla
    let nombre = p.nombre.padEnd(20, " "); // rellena hasta 20 caracteres
    let cantidad = p.cantidad.toString().padStart(2, " ");
    let totalProd = subtotal.toString().padStart(6, " ");
    return `${nombre} x${cantidad} = $${totalProd}`;
  }).join("\n");

  const total = calcularTotal();

  return encodeURIComponent(
    `Hola! Aquí está mi pedido:\n\n` +
    `Producto             Cant  Total\n` +  // cabecera
    `--------------------------------\n` +
    `${productosTexto}\n` +
    `--------------------------------\n` +
    `TOTAL: $${total}`
  );

}

// Enviar por WhatsApp
document.getElementById("btn-whatsapp").addEventListener("click", () => {
  const telefono = "1159221201"; // tu número
  const mensaje = mensajeWhatsapp();
  if (mensaje) {
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");
  }
});

// Render inicial
mostrarProductos();
