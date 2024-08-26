let mapa;
let direccionesService;
let direccionesRenderer;

const datosMapa = {
    nodos: {
        'A': { lat: -15.8413, lng: -70.0200 },
        'B': { lat: -15.8437, lng: -70.0214 },
        'C': { lat: -15.8385, lng: -70.0223 },
        'D': { lat: -15.8420, lng: -70.0230 },
        'E': { lat: -15.8405, lng: -70.0240 },
        'F': { lat: -15.8440, lng: -70.0190 },
        'G': { lat: -15.8455, lng: -70.0250 }
    },
    aristas: {
        'A': { 'B': 200, 'C': 500 },
        'B': { 'A': 200, 'C': 300, 'D': 200 },
        'C': { 'A': 500, 'B': 300, 'E': 400 },
        'D': { 'B': 200, 'E': 300 },
        'E': { 'C': 400, 'D': 300, 'F': 600 },
        'F': { 'E': 600, 'G': 300 },
        'G': { 'F': 300 }
    }
};

function inicializarMapa() {
    mapa = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -15.8402, lng: -70.0219 },
        zoom: 14,
    });

    direccionesService = new google.maps.DirectionsService();
    direccionesRenderer = new google.maps.DirectionsRenderer();
    direccionesRenderer.setMap(mapa);

    const selectInicio = document.getElementById('start');
    const selectFin = document.getElementById('end');

    // Agregar marcadores y etiquetas en el mapa
    for (let nodo in datosMapa.nodos) {
        const posicion = datosMapa.nodos[nodo];
        const marcador = new google.maps.Marker({
            position: posicion,
            map: mapa,
            title: `Nodo ${nodo}`,
            label: nodo,
        });

        selectInicio.add(new Option(nodo, nodo));
        selectFin.add(new Option(nodo, nodo));
    }

    document.getElementById("route-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const inicio = selectInicio.value;
        const fin = selectFin.value;
        calcularRutaMasCortaDijkstra(inicio, fin);
    });
}

function calcularRutaMasCortaDijkstra(nodoInicio, nodoFin) {
    const distancias = {};
    const nodosAnteriores = {};
    const nodosNoVisitados = new Set(Object.keys(datosMapa.nodos));

    // Inicializar distancias
    nodosNoVisitados.forEach(nodo => {
        distancias[nodo] = Infinity;
        nodosAnteriores[nodo] = null;
    });
    distancias[nodoInicio] = 0;

    while (nodosNoVisitados.size > 0) {
        let nodoMasCercano = null;
        nodosNoVisitados.forEach(nodo => {
            if (nodoMasCercano === null || distancias[nodo] < distancias[nodoMasCercano]) {
                nodoMasCercano = nodo;
            }
        });

        if (distancias[nodoMasCercano] === Infinity) break;

        nodosNoVisitados.delete(nodoMasCercano);

        for (let vecino in datosMapa.aristas[nodoMasCercano]) {
            let distanciaAlternativa = distancias[nodoMasCercano] + datosMapa.aristas[nodoMasCercano][vecino];
            if (distanciaAlternativa < distancias[vecino]) {
                distancias[vecino] = distanciaAlternativa;
                nodosAnteriores[vecino] = nodoMasCercano;
            }
        }
    }

    const ruta = [];
    let nodoActual = nodoFin;
    while (nodoActual) {
        ruta.unshift(nodoActual);
        nodoActual = nodosAnteriores[nodoActual];
    }

    dibujarRuta(ruta);
    mostrarDistanciaRuta(ruta, distancias[nodoFin]);
}

function dibujarRuta(ruta) {
    const coordenadasRuta = ruta.map(nodo => datosMapa.nodos[nodo]);

    const rutaDibujada = new google.maps.Polyline({
        path: coordenadasRuta,
        geodesic: true,
        strokeColor: '#007bff',
        strokeOpacity: 0.6,
        strokeWeight: 5,
    });

    rutaDibujada.setMap(mapa);
}

function mostrarDistanciaRuta(ruta, distanciaTotal) {
    const distanciaEnMetros = distanciaTotal;
    alert(`Distancia total: ${distanciaEnMetros} metros`);
}

window.onload = inicializarMapa;
