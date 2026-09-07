const BASE_URL = import.meta.env.VITE_API_URL;

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
    `${BASE_URL}/productos?${params}`
  );

  if (!respuesta.ok) {
    throw new Error("Error al consultar el backend");
  }

  const datos = await respuesta.json();

  return {
    productos: datos.slice(0, limit),
    haySiguiente: datos.length > limit
  };
}

export async function registrar(usuario) {
  const respuesta = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    if (respuesta.status === 400) {
      throw new Error("Ese correo ya está registrado.");
    }

    if (respuesta.status === 422) {
      throw new Error("Revisá los datos ingresados.");
    }

    throw new Error(datos.detail || "Error al registrarse.");
  }

  return datos;
}

export async function login(email, password) {
  const datosFormulario = new URLSearchParams();

  datosFormulario.append("username", email);
  datosFormulario.append("password", password);

  const respuesta = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: datosFormulario
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    throw new Error(
      datos.detail || "Error al iniciar sesión."
    );
  }

  return datos;
}

export function authHeaders() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}

export async function getMe() {
  const respuesta = await fetch(`${BASE_URL}/auth/me`, {
    headers: {
      ...authHeaders()
    }
  });

  if (!respuesta.ok) {
    throw new Error("Sesión no válida");
  }

  return await respuesta.json();
}