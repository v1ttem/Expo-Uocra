// Importar los datos desde data.js
import { DATOS } from "./data.js";

// Utilidades
const utilidades = {
  // Selector DOM optimizado con cache
  obtenerElemento(selector) {
    return document.querySelector(selector);
  },

  // Selector múltiple DOM optimizado con cache
  obtenerElementos(selector) {
    return document.querySelectorAll(selector);
  },

  // Genera un UUID v4
  generarUUID() {
    var d = new Date().getTime();
    var d2 =
      (typeof performance !== "undefined" &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  },

  // Guarda en localStorage
  guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
  },

  // Recupera de localStorage
  recuperarDatos(clave, valorPredeterminado = []) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : valorPredeterminado;
  },
};

// Controlador de secciones
const controladorSecciones = {
  // Muestra una sección y oculta las demás
  mostrarSeccion(id) {
    utilidades.obtenerElementos(".section").forEach((section) => {
      section.classList.remove("activa");
    });

    const seccion = utilidades.obtenerElemento(`#${id}`);
    if (!seccion) return;

    seccion.classList.add("activa");

    // Acciones específicas por sección
    if (id === "charlas") {
      // Se elimina la llamada a this.actualizarEstadoCharlas();
    } else if (id === "empresas") {
      controladorEmpresas.mostrarEmpresasPorCategoria("todas");
    } else if (id === "muestras") {
      controladorMuestras.actualizarMuestras();
    }
  },

  // Muestra el formulario y hace scroll hacia él
  mostrarFormulario() {
    this.mostrarSeccion("inscripcion");
    setTimeout(() => {
      utilidades
        .obtenerElemento(".form-container")
        .scrollIntoView({ behavior: "smooth" });
    }, 10);
  },

  // Alterna el menú en dispositivos móviles
  alternarMenu() {
    utilidades.obtenerElemento("#main-nav").classList.toggle("active");
  },
};

// Controlador de charlas
const controladorCharlas = {
  // Inicializa y carga las charlas
  async inicializar() {
    try {
      // Obtener charlas del servidor
      const response = await fetch("/api/inscripcion/charlas");

      if (!response.ok) {
        throw new Error("No se pudieron cargar las charlas");
      }

      const charlas = await response.json();

      // Si no hay charlas, usar las predefinidas
      if (!charlas || charlas.length === 0) {
        // Agregar IDs a las charlas predefinidas
        const charlasConIDs = DATOS.charlas.map((charla) => ({
          ...charla,
          id: utilidades.generarUUID(),
        }));

        this.actualizarInterfazCharlas(charlasConIDs);
        return charlasConIDs;
      }

      this.actualizarInterfazCharlas(charlas);
      return charlas;
    } catch (error) {
      console.error("Error al cargar charlas:", error);

      // En caso de error, usar las charlas predefinidas
      const charlasLocales = DATOS.charlas.map((charla) => ({
        ...charla,
        id: utilidades.generarUUID(),
      }));

      this.actualizarInterfazCharlas(charlasLocales);
      return charlasLocales;
    }
  },

  // Actualiza toda la UI relacionada con charlas
  actualizarInterfazCharlas(charlas) {
    this.actualizarTablaCharlas(charlas);
    this.actualizarSelectoresCharlas(charlas);
    // Se elimina la llamada a this.actualizarContadoresInscriptos();
  },

  // Actualiza la tabla de charlas
  actualizarTablaCharlas(charlas) {
    const cuerpoTabla = utilidades.obtenerElemento("#charlas-lista");
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = "";

    charlas.forEach((charla) => {
      const fila = document.createElement("tr");

      ["horario", "titulo", "empresa", "ubicacion"].forEach((campo) => {
        const celda = document.createElement("td");
        celda.textContent = charla[campo];
        fila.appendChild(celda);
      });

      cuerpoTabla.appendChild(fila);
    });
  },

  // Actualiza los selectores de charlas en formularios
  actualizarSelectoresCharlas(charlas) {
    const selectores = utilidades.obtenerElementos('select[id="charla"]');

    selectores.forEach((selector) => {
      const valorActual = selector.value;
      selector.innerHTML = "";

      // Opción por defecto
      const opcionPredeterminada = document.createElement("option");
      opcionPredeterminada.value = "";
      opcionPredeterminada.textContent = "Selecciona una charla";
      opcionPredeterminada.selected = true;
      opcionPredeterminada.disabled = true;
      selector.appendChild(opcionPredeterminada);

      // Opciones de charlas
      charlas.forEach((charla) => {
        const opcion = document.createElement("option");
        opcion.value = charla.id;
        opcion.textContent = `${charla.horario} - ${charla.titulo}`;
        selector.appendChild(opcion);
      });

      // Restaurar selección previa si existe
      if (valorActual) {
        selector.value = valorActual;
      }
    });
  },
};

// Controlador de empresas
const controladorEmpresas = {
  // Muestra empresas por categoría
  mostrarEmpresasPorCategoria(categoria = "todas") {
    // Actualizar botón activo
    utilidades.obtenerElementos(".btn-categoria").forEach((boton) => {
      boton.classList.remove("active");
    });

    const botonActivo = utilidades.obtenerElemento(
      `.btn-categoria[onclick="mostrarEmpresas('${categoria}')"]`
    );
    if (botonActivo) {
      botonActivo.classList.add("active");
    }

    const contenedor = utilidades.obtenerElemento("#empresas-lista");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (categoria === "todas") {
      // Mostrar todas las empresas
      Object.values(DATOS.empresas).forEach((empresasCategoria) => {
        empresasCategoria.forEach((empresa) => {
          contenedor.appendChild(this.crearTarjetaEmpresa(empresa));
        });
      });
    } else {
      // Mostrar por categoría específica
      const empresas = DATOS.empresas[categoria] || [];
      empresas.forEach((empresa) => {
        contenedor.appendChild(this.crearTarjetaEmpresa(empresa));
      });
    }
  },

  // Crea una tarjeta de empresa
  crearTarjetaEmpresa(empresa) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "empresa-card";

    tarjeta.innerHTML = `
      <img src="${empresa.logo}" alt="Logo de ${
      empresa.nombre
    }" class="empresa-logo" />
      <p><strong>${empresa.nombre}</strong></p>
      <p>${empresa.descripcion}</p>
      ${
        empresa.url
          ? `<a href="${empresa.url}" target="_blank" class="btn-visitar">Visitar sitio web</a>`
          : ""
      }
    `;

    // Hacer la tarjeta clickeable si hay URL
    if (empresa.url) {
      tarjeta.style.cursor = "pointer";
      tarjeta.addEventListener("click", () =>
        window.open(empresa.url, "_blank")
      );
    }

    return tarjeta;
  },
};

// Controlador de inscripciones
const controladorInscripciones = {
  // Maneja la inscripción desde el formulario
  async procesarInscripcion(evento) {
    evento.preventDefault();

    const selectCharla = utilidades.obtenerElemento("#charla");
    let charlaId = selectCharla.value;

    // Si no hay una charla seleccionada, usa un ID generado
    if (!charlaId) {
      charlaId = utilidades.generarUUID();
    }

    // Recuperando datos del formulario agregando id y fecha
    const datosFormulario = {
      id: utilidades.generarUUID(),
      nombre: utilidades.obtenerElemento("#nombre").value,
      apellido: utilidades.obtenerElemento("#apellido").value,
      dni: utilidades.obtenerElemento("#dni").value,
      email: utilidades.obtenerElemento("#email").value,
      como_te_enteraste: utilidades.obtenerElemento("#como-te-enteraste").value,
      charla: charlaId,
      fecha: new Date().toISOString(),
    };

    try {
      // Envío al servidor usando fetch
      document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("btnEnviar").addEventListener("click", () => {
          const nombre = document.getElementById("nombre").value;
          const apellido = document.getElementById("apellido").value;
          const dni = document.getElementById("dni").value;
          const email = document.getElementById("email").value;
          const charla = document.getElementById("charla").value; // Aquí es donde se obtiene la charla seleccionada

          const inscripcion = {
            nombre: nombre,
            apellido: apellido,
            dni: dni,
            email: email,
            charla: charla,
          };

          fetch("http://localhost:3306/api/inscriptos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inscripcion),
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
        });
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.mensaje || errorData.error || "Error en la inscripción"
        );
      }

      const responseData = await response.json();

      // Mostrar mensaje de éxito más específico
      alert(`¡Inscripción exitosa! Tu registro ha sido confirmado.`);

      // Si la charla fue creada automáticamente, actualizar la lista de charlas
      if (responseData.idCharla && responseData.idCharla !== charlaId) {
        // Recargar charlas para reflejar la nueva charla
        controladorCharlas.inicializar();
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message || "No se pudo completar la inscripción"}`);
    }

    // Resetear formulario
    evento.target.reset();
  },
};

// Controlador de muestras/stands
const controladorMuestras = {
  // Inicializar y mostrar muestras/stands
  inicializar() {
    this.actualizarMuestras();
  },

  // Actualiza la visualización de muestras
  actualizarMuestras() {
    const contenedorStands = utilidades.obtenerElemento("#stands-container");
    if (!contenedorStands) return;

    contenedorStands.innerHTML = "";

    // Crear elementos HTML para cada stand
    DATOS.muestras.forEach((stand) => {
      const standElement = this.crearElementoStand(stand);
      contenedorStands.appendChild(standElement);
    });
  },

  // Crea un elemento HTML para un stand
  crearElementoStand(stand) {
    const standItem = document.createElement("div");
    standItem.className = "stand-item";

    standItem.innerHTML = `
      <div class="stand-number">${stand.numero}</div>
      <div class="stand-info">
        <h4>${stand.muestra}</h4>
        <p>${stand.ubicacion}</p>
      </div>
    `;

    return standItem;
  },
};

// Inicializar la aplicación
window.onload = function () {
  // Inicializar charlas
  controladorCharlas.inicializar();

  // Inicializar muestras
  controladorMuestras.inicializar();

  // Mostrar sección inicial
  controladorSecciones.mostrarSeccion("inicio");

  // Configurar event listeners
  const formularioInscripcion = utilidades.obtenerElemento("#btn-formulario");
  if (formularioInscripcion) {
    formularioInscripcion.addEventListener("click", (evento) =>
      controladorInscripciones.procesarInscripcion(evento)
    );
  }
};

// Exponer funciones al ámbito global para uso en HTML
window.mostrarSeccion = (id) => controladorSecciones.mostrarSeccion(id);
window.mostrarFormulario = () => controladorSecciones.mostrarFormulario();
window.alternarMenu = () => controladorSecciones.alternarMenu();
window.mostrarEmpresas = (categoria) =>
  controladorEmpresas.mostrarEmpresasPorCategoria(categoria);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnEnviar").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const dni = document.getElementById("dni").value;
    const email = document.getElementById("email").value;
    const charla = document.getElementById("charla").value; // Aquí es donde se obtiene la charla seleccionada

    const inscripcion = {
      nombre: nombre,
      apellido: apellido,
      dni: dni,
      email: email,
      charla: charla,
    };

    fetch("http://localhost:3000/api/inscripcion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcion),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  });
});
