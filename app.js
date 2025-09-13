let productos = {}; // JSON por categorías
let carrito = [];

const contenedor = document.getElementById("productos");
const spanTotal = document.getElementById("total");
const selectCategoria = document.getElementById('categoria');
const tituloCategoria = document.getElementById('titulo-categoria');
const inputBusqueda = document.getElementById("busqueda");

// ------------------------
// Actualizar título al cambiar categoría
// ------------------------
selectCategoria.addEventListener('change', () => {
  const categoriaSeleccionada = selectCategoria.value;
  tituloCategoria.textContent = categoriaSeleccionada;
  mostrarProductos(categoriaSeleccionada, inputBusqueda.value);
});

// ------------------------
// Mostrar productos filtrados por categoría y búsqueda
// ------------------------
function mostrarProductos(filtroCategoria = "Todas", textoBusqueda = "") {
  contenedor.innerHTML = "";

  function renderProducto(prod) {
    if (!prod.nombre.toLowerCase().includes(textoBusqueda.toLowerCase())) return;

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
        <button class="menos">-</button>
        <span id="cantidad-${prod.id}">${cantidadActual}</span>
        <button class="mas">+</button>
      </div>
    `;

    card.querySelector(".menos").addEventListener("click", () => modificarCantidad(prod.id, -1));
    card.querySelector(".mas").addEventListener("click", () => modificarCantidad(prod.id, 1));

    contenedor.appendChild(card);
  }

  for (let cat in productos) {
    if (filtroCategoria !== "Todas" && cat !== filtroCategoria) continue;

    let lista = productos[cat];

    // Si es objeto (tiene subcategorías)
    if (!Array.isArray(lista)) {
      for (let sub in lista) {
        lista[sub].forEach(prod => renderProducto(prod));
      }
    } else {
      // Categoría sin subcategorías
      lista.forEach(prod => renderProducto(prod));
    }
  }

  calcularTotal();
}

// ------------------------
// Modificar cantidad del carrito
// ------------------------
function modificarCantidad(id, cambio) {
  let prodOriginal;
  for (let cat in productos) {
    let lista = productos[cat];
    if (Array.isArray(lista)) {
      prodOriginal = lista.find(p => p.id === id);
    } else {
      for (let sub in lista) {
        prodOriginal = lista[sub].find(p => p.id === id);
        if (prodOriginal) break;
      }
    }
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

  const spanCant = document.getElementById(`cantidad-${id}`);
  if (spanCant) spanCant.textContent = carrito.find(p => p.id === id)?.cantidad || 0;

  mostrarProductos(selectCategoria.value, inputBusqueda.value);
}

// ------------------------
// Calcular total del carrito
// ------------------------
function calcularTotal() {
  let total = 0;
  for (let cat in productos) {
    let lista = productos[cat];
    if (Array.isArray(lista)) {
      lista.forEach(p => {
        const item = carrito.find(c => c.id === p.id);
        if (item) {
          const factor = p.minimo > 1 ? p.minimo : 1;
          total += p.precioUnitario * factor * item.cantidad;
        }
      });
    } else {
      for (let sub in lista) {
        lista[sub].forEach(p => {
          const item = carrito.find(c => c.id === p.id);
          if (item) {
            const factor = p.minimo > 1 ? p.minimo : 1;
            total += p.precioUnitario * factor * item.cantidad;
          }
        });
      }
    }
  }
  spanTotal.textContent = total.toLocaleString();
  return total;
}

// ------------------------
// Filtrar por búsqueda en tiempo real
// ------------------------
inputBusqueda.addEventListener("input", (e) => {
  mostrarProductos(selectCategoria.value, e.target.value);
});

// ------------------------
// Modal y WhatsApp con opción cliente nuevo / existente
// ------------------------
const modal = document.getElementById("modalCliente");
const radioNuevo = document.getElementById("cliente-nuevo");
const radioExistente = document.getElementById("cliente-existente");
const seccionNuevo = document.getElementById("datos-nuevo");
const seccionExistente = document.getElementById("datos-existente");

document.getElementById("btn-whatsapp").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío 😅");
    return;
  }
  modal.style.display = "flex";
});

document.getElementById("cancelarCliente").addEventListener("click", () => {
  modal.style.display = "none";
});

// Alternar secciones según tipo de cliente
radioNuevo.addEventListener("change", () => {
  seccionNuevo.style.display = "block";
  seccionExistente.style.display = "none";
});

radioExistente.addEventListener("change", () => {
  seccionNuevo.style.display = "none";
  seccionExistente.style.display = "block";
});

// Enviar mensaje
document.getElementById("enviarCliente").addEventListener("click", () => {
  let nombre, direccion, localidad, horarios, idCliente;

  if (radioNuevo.checked) {
    nombre = document.getElementById("nombre").value.trim();
    direccion = document.getElementById("direccion").value.trim();
    localidad = document.getElementById("localidad").value.trim();
    horarios = document.getElementById("horarios").value.trim();

    if (!nombre || !direccion || !localidad || !horarios) {
      alert("Completa todos los datos del cliente nuevo.");
      return;
    }
  } else if (radioExistente.checked) {
    idCliente = document.getElementById("id-cliente").value.trim();
    if (!idCliente) {
      alert("Ingresa el ID del cliente existente.");
      return;
    }
    nombre = `Cliente #${idCliente}`;
    direccion = localidad = horarios = "-";
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

  modal.style.display = "none";
});

// ------------------------
// Cargar productos desde JSON
// ------------------------
fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(selectCategoria.value, inputBusqueda.value);
  })
  .catch(err => console.error("Error cargando productos:", err));

