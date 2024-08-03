const agregar = async (pid) => {
    let h3Usuario = document.getElementById("h3Usuario");
    if (!h3Usuario) {
        console.error("Elemento h3Usuario no encontrado");
        return;
    }

    let cid = h3Usuario.dataset.carrito;
    if (!cid) {
        console.error("Cart ID no encontrado en dataset de h3Usuario");
        return;
    }
    
    try {
        let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "PUT"
        });

        let datos = await respuesta.json();
        if (respuesta.ok) {
            alert("Producto agregado al carrito...!!!");
        } else {
            alert("Error al agregar producto al carrito");
        }
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
    }
}
