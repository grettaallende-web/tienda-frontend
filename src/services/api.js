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