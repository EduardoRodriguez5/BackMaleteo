function leerPedidos() {
  fetch("/pedidos")
    .then((respuesta) => {
      return respuesta.json();
    })
    .then((pedidos) => {
      pintarPedidos(pedidos);
    })
    .catch();
}





function actualizarEstado(pedido) {
  pedido.estaListo = "Para Servir";

  fetch(`/pedidos/${pedido._id}`, {
    method: "PUT",
    body: JSON.stringify(pedido),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((respuesta) => {
    if (respuesta.status !== 200) {
      alert("Ha habido algun error");
    } else {
      leerPedidos();
    }
  });
}






function pintarPedidos(pedidos) {
  const listadoPedidos = document.getElementById("listaPedidos");
  listadoPedidos.innerHTML = "";

  pedidos
    .filter((pedido) => {
      return pedido.estaListo === "En proceso";
    })
    .forEach((pedido) => {
      let listaPlatos = "";
      pedido.comanda.forEach((plato) => {
        listaPlatos += `<p> ${plato.nombre} </p>`;
      });

      let vistaPedido = `
        <li>
            <div>
                <p>Mesa : ${pedido.mesa}</p>
                <p>Estado : ${pedido.estaListo}</p>
            </div>
            <div> 
                <p>PLATOS: </p>
                ${listaPlatos}
            </div>
            <div> 
                <button id="boton_hecho_${pedido._id}" >HECHO</button>
            </div>
        </li>`;

      listadoPedidos.innerHTML += vistaPedido;

      const botonHecho = document.getElementById(`boton_hecho_${pedido._id}`);

      botonHecho.onclick = () => {
        actualizarEstado(pedido);
      };
    });
}






leerPedidos();
