import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext(null);


function normalizarItem(item) {
    return {
        producto_id: Number(item.producto_id ?? item.id),
        nombre: item.nombre,
        precio: Number(
            item.precio ?? item.precio_final ?? 0
        ),
        stock: Number(item.stock ?? 0),
        cantidad: Number(item.cantidad ?? 1),
    };
}


export function CarritoProvider({ children }) {

    const [items, setItems] = useState(() => {

        try {

            const guardado =
                localStorage.getItem("carrito");

            if (!guardado) {
                return [];
            }

            const datos = JSON.parse(guardado);

            if (!Array.isArray(datos)) {
                return [];
            }

            return datos.map(normalizarItem);

        } catch (error) {

            console.error(
                "Error leyendo carrito:",
                error
            );

            return [];

        }
    });


    // =========================================
    // GUARDAR CARRITO
    // =========================================

    useEffect(() => {

        localStorage.setItem(
            "carrito",
            JSON.stringify(items)
        );

    }, [items]);


    // =========================================
    // AGREGAR PRODUCTO
    // =========================================

    function agregar(producto) {

        setItems((actual) => {

            const id = Number(producto.id);

            const existente =
                actual.find(
                    (item) =>
                        Number(item.producto_id) === id
                );


            // Si ya existe
            if (existente) {

                if (
                    existente.cantidad >=
                    Number(producto.stock)
                ) {

                    alert(
                        "No hay más stock disponible."
                    );

                    return actual;
                }


                return actual.map((item) => {

                    if (
                        Number(item.producto_id) === id
                    ) {

                        return {
                            ...item,
                            cantidad:
                                Number(item.cantidad) + 1
                        };

                    }

                    return item;

                });

            }


            // Producto nuevo
            return [
                ...actual,
                {
                    producto_id: id,
                    nombre: producto.nombre,
                    precio: Number(
                        producto.precio_final
                    ),
                    stock: Number(
                        producto.stock
                    ),
                    cantidad: 1
                }
            ];

        });

    }


    // =========================================
    // AUMENTAR
    // =========================================

    function aumentar(productoId) {

        const id = Number(productoId);

        setItems((actual) => {

            return actual.map((item) => {

                if (
                    Number(item.producto_id) !== id
                ) {
                    return item;
                }


                if (
                    Number(item.cantidad) >=
                    Number(item.stock)
                ) {

                    alert(
                        `Solo quedan ${item.stock} unidades.`
                    );

                    return item;
                }


                return {
                    ...item,
                    cantidad:
                        Number(item.cantidad) + 1
                };

            });

        });

    }


    // =========================================
    // DISMINUIR
    // =========================================

    function disminuir(productoId) {

        const id = Number(productoId);

        setItems((actual) => {

            return actual
                .map((item) => {

                    if (
                        Number(item.producto_id) !== id
                    ) {
                        return item;
                    }


                    return {
                        ...item,
                        cantidad:
                            Number(item.cantidad) - 1
                    };

                })
                .filter(
                    (item) =>
                        Number(item.cantidad) > 0
                );

        });

    }


    // =========================================
    // QUITAR
    // =========================================

    function quitar(productoId) {

        const id = Number(productoId);

        setItems((actual) =>
            actual.filter(
                (item) =>
                    Number(item.producto_id) !== id
            )
        );

    }


    // =========================================
    // VACIAR
    // =========================================

    function vaciar() {

        setItems([]);

    }


    // =========================================
    // TOTAL
    // =========================================

    const total = items.reduce(
        (acumulado, item) => {

            return (
                acumulado +
                Number(item.precio) *
                Number(item.cantidad)
            );

        },
        0
    );


    // =========================================
    // CANTIDAD TOTAL
    // =========================================

    const cantidadTotal = items.reduce(
        (acumulado, item) => {

            return (
                acumulado +
                Number(item.cantidad)
            );

        },
        0
    );


    return (
        <CarritoContext.Provider
            value={{
                items,
                agregar,
                aumentar,
                disminuir,
                quitar,
                vaciar,
                total,
                cantidadTotal
            }}
        >
            {children}
        </CarritoContext.Provider>
    );
}


export function useCarrito() {

    const contexto =
        useContext(CarritoContext);

    if (!contexto) {

        throw new Error(
            "useCarrito debe utilizarse dentro de CarritoProvider"
        );

    }

    return contexto;
}