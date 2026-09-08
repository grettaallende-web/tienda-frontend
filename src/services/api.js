const BASE_URL = import.meta.env.VITE_API_URL;


/* =========================================
   PRODUCTOS
========================================= */

export async function getProductos({
  page = 0,
  limit = 2,
  nombre = ""
} = {}) {
  const params = new URLSearchParams({
    skip: page * limit,
    limit: limit + 1
  });

  if (nombre) {
    params.append("nombre", nombre);
  }

  const respuesta = await fetch(
    `${BASE_URL}/productos?${params.toString()}`
  );

  if (!respuesta.ok) {
    throw new Error("Error al consultar los productos.");
  }

  const datos = await respuesta.json();

  return {
    productos: datos.slice(0, limit),
    haySiguiente: datos.length > limit
  };
}


export async function getProducto(id) {
  const respuesta = await fetch(
    `${BASE_URL}/productos/${id}`
  );

  if (!respuesta.ok) {
    if (respuesta.status === 404) {
      throw new Error("Producto no encontrado.");
    }

    throw new Error("Error al consultar el producto.");
  }

  return await respuesta.json();
}


/* =========================================
   REGISTRO
========================================= */

export async function registrar(usuario) {
  const respuesta = await fetch(
    `${BASE_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(usuario)
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    if (respuesta.status === 400) {
      throw new Error(
        "Ese correo ya está registrado."
      );
    }

    if (respuesta.status === 422) {
      throw new Error(
        "Revisá los datos ingresados."
      );
    }

    throw new Error(
      datos.detail || "Error al registrarse."
    );
  }

  return datos;
}


/* =========================================
   LOGIN
========================================= */

export async function login(email, password) {
  const datosFormulario = new URLSearchParams();

  datosFormulario.append("username", email);
  datosFormulario.append("password", password);

  const respuesta = await fetch(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      },

      body: datosFormulario
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error(
        "Correo o contraseña incorrectos."
      );
    }

    throw new Error(
      datos.detail ||
      "Error al iniciar sesión."
    );
  }

  return datos;
}


/* =========================================
   AUTENTICACIÓN
========================================= */

export function authHeaders() {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}


export async function getMe() {
  const respuesta = await fetch(
    `${BASE_URL}/auth/me`,
    {
      headers: {
        ...authHeaders()
      }
    }
  );

  if (!respuesta.ok) {
    throw new Error("Sesión no válida.");
  }

  return await respuesta.json();
}


/* =========================================
   REFRESH TOKEN
========================================= */

export async function refreshToken() {
  const refresh_token =
    localStorage.getItem("refresh_token");

  if (!refresh_token) {
    throw new Error("No hay sesión.");
  }

  const respuesta = await fetch(
    `${BASE_URL}/auth/refresh`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        refresh_token
      })
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail ||
      "La sesión venció."
    );
  }

  localStorage.setItem(
    "access_token",
    datos.access_token
  );

  localStorage.setItem(
    "refresh_token",
    datos.refresh_token
  );

  return datos;
}


/* =========================================
   CREAR PEDIDO
========================================= */

export async function crearPedido(items) {
  const respuesta = await fetch(
    `${BASE_URL}/pedidos/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },

      body: JSON.stringify({
        items: items.map((item) => ({
          producto_id: item.id,
          cantidad: item.cantidad
        }))
      })
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {

    if (respuesta.status === 401) {
      throw new Error(
        "Tenés que iniciar sesión para realizar la compra."
      );
    }

    if (respuesta.status === 409) {
      throw new Error(
        datos.detail ||
        "No hay stock suficiente."
      );
    }

    if (respuesta.status === 404) {
      throw new Error(
        datos.detail ||
        "Producto inexistente."
      );
    }

    throw new Error(
      datos.detail ||
      "Error al realizar la compra."
    );
  }

  return datos;
}


/* =========================================
   MIS PEDIDOS
========================================= */

export async function getMisPedidos() {
  const respuesta = await fetch(
    `${BASE_URL}/pedidos/mios`,
    {
      headers: {
        ...authHeaders()
      }
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail ||
      "No se pudieron cargar tus pedidos."
    );
  }

  return datos;
}


/* =========================================
   DETALLE DE PEDIDO
========================================= */

export async function getPedido(id) {
  const respuesta = await fetch(
    `${BASE_URL}/pedidos/${id}`,
    {
      headers: {
        ...authHeaders()
      }
    }
  );

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      datos.detail ||
      "No se pudo cargar el pedido."
    );
  }

  return datos;
}