// Lista de productos
const productos = [
  { id: 1, nombre: "Galletitas", precio: 1200, imagen: "img/galletitas.jpg" },
  { id: 2, nombre: "Jugo", precio: 800, imagen: "img/jugo.jpg" },
  { id: 3, nombre: "Caramelos", precio: 500, imagen: "img/caramelos.jpg" },
  { id: 4, nombre: "Alfajores Maixanas x14u", precio: 23200, imagen: "img/maixanasDubai.jpg" },
];

// Carrito vacío al inicio
let carrito = [];

// Contenedor de productos
const contenedor = document.getElementById("productos");

// Renderizar productos
function mostrarProductos() {
  contenedor.innerHTML = ""; // limpio por si se vuelve a renderizar

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

// Función para calcular el total
function calcularTotal() {
    let total = carrito.reduce((acum, prod) => acum + prod.precio, 0);
    document.getElementById("total").textContent = total;
    return total;
}

// Función para modificar cantidad
function modificarCantidad(id, cambio) {
  let item = carrito.find((p) => p.id === id);

  if (!item) {
    // Si no está en el carrito y cambio > 0, lo agregamos
    if (cambio > 0) {
      const producto = productos.find((p) => p.id === id);
      item = { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 0 };
      carrito.push(item);
    } else {
      return; // no se puede restar si no está
    }
  }

  item.cantidad += cambio;
  if (item.cantidad < 0) item.cantidad = 0;

  // Actualizamos el contador en la tarjeta
  document.getElementById(`cantidad-${id}`).textContent = item.cantidad;

  // Opcional: eliminar del carrito si cantidad = 0
  carrito = carrito.filter((p) => p.cantidad > 0);
}

// Generar link de WhatsApp
function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío 😅");
    return;
  }

  function mensajeWhatsapp() {
    let total = calcularTotal();
    let productosTexto = carrito.map(p => `${p.nombre}: $${p.precio}`).join("\n");
    let mensaje = `Hola! Aquí está mi pedido:\n${productosTexto}\nTotal: $${total}`;
    return encodeURIComponent(mensaje); // Para que sea compatible con URL
}


  const telefono = "1159221201"; // <-- tu número
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsapp)}`;

  window.open(url, "_blank");
}

// Evento del botón de WhatsApp
document.getElementById("enviarWhatsapp").addEventListener("click", () => {
    let mensaje = mensajeWhatsapp();
    // Abrir WhatsApp Web o la app
    window.open(`https://wa.me/?text=${mensaje}`, "_blank");
});

// Render inicial
mostrarProductos();

