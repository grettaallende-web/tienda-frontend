import { useNavigate } from "react-router-dom";

function ProductCard({ producto, onAgregar }) {
  const navigate = useNavigate();

  const precio = Number(producto.precio_final);
  const cuota = Number(producto.cuotas_valor);

  function abrirProducto() {
    navigate(`/producto/${producto.id}`);
  }

  function agregarAlCarrito(event) {
    event.stopPropagation();
    onAgregar(producto);
  }

  return (
    <article
      className="product-card"
      onClick={abrirProducto}
    >

      <div className="product-card-content">

        <h3>
          {producto.nombre}
        </h3>

        <div className="product-price">
          $
          {precio.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>

        <div className="product-info">

          <p>
            💳 {producto.cuotas_cantidad} cuotas de $
            {cuota.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>

          <p>
            🛡️ Garantía: {producto.garantia_meses} meses
          </p>

          <p>
            📦 Stock: {producto.stock}
          </p>

        </div>

      </div>

      <button
        type="button"
        className="add-cart-button"
        onClick={agregarAlCarrito}
        disabled={producto.stock <= 0}
      >
        {producto.stock > 0
          ? "🛒 Agregar al carrito"
          : "Sin stock"}
      </button>

    </article>
  );
}

export default ProductCard;