import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

function ProductCard({ producto }) {
  const navigate = useNavigate();
  const { agregar } = useCarrito();

  const precio = Number(producto.precio_final);
  const cuota = Number(producto.cuotas_valor);
  const stock = Number(producto.stock);

  function abrirProducto() {
    navigate(`/producto/${producto.id}`);
  }

  function agregarAlCarrito(event) {
    event.stopPropagation();
    agregar(producto);
    alert(`"${producto.nombre}" se agregó al carrito.`);
  }

  return (
    <article
      className="product-card"
      onClick={abrirProducto}
    >
      <div className="product-card-content">
        <h3>{producto.nombre}</h3>

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
            📦 Stock: {stock}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="add-cart-button"
        onClick={agregarAlCarrito}
        disabled={stock <= 0}
      >
        {stock > 0
          ? "🛒 Agregar al carrito"
          : "Sin stock"}
      </button>
    </article>
  );
}

export default ProductCard;