// Lista de productos (podés editar, agregar o quitar sin tocar el HTML)
const productos = [
  { id: 1, nombre: "Galletitas", precio: 1200, imagen: "img/galletitas.jpg" },
  { id: 2, nombre: "Jugo", precio: 800, imagen: "img/jugo.jpg" },
  { id: 3, nombre: "Caramelos", precio: 500, imagen: "img/caramelos.jpg" },
  { id: 4, nombre: "Alfajores Maixanas x14u", precio: 23200, imagen: "img/maixanasDubai.jpg" },
];

// Carrito vacío al inicio
let carrito = [];

// Renderizar productos en la página
const contenedor = document.getElementById("productos");

function mostrarProductos() {
  contenedor.innerHTML = ""; // limpio por si se vuelve a renderizar

  productos.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h2>${prod.nombre}</h2>
      <p>$${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;

    contenedor.appendChild(card);
  });
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  carrito.push(producto);
  alert(`${producto.nombre} agregado al carrito ✅`);
}

// Generar link de WhatsApp
function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío 😅");
    return;
  }

  let mensaje = "Hola, quiero pedir estos productos:\n";

  carrito.forEach((p, i) => {
    mensaje += `${i + 1}. ${p.nombre} - $${p.precio}\n`;
  });

  // Número de WhatsApp al que querés recibir pedidos
  const telefono = "1559221201"; // <-- cambiá por tu número
  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

// Evento del botón de WhatsApp
document.getElementById("btn-whatsapp").addEventListener("click", enviarPedidoWhatsApp);

// Render inicial
mostrarProductos();

