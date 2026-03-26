// Inicializar mapa
const map = L.map('map').setView([23.5, -102], 5);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Colores según tasa de homicidios dolosos
function getHomicideColor(rate) {
    return rate > 85 ? '#800026' :
           rate > 70 ? '#BD0026' :
           rate > 50 ? '#E31A1C' :
           rate > 30 ? '#FC4E2A' :
                       '#2ECC71';
}

// Colores de eventos
function getEventColor(type) {
    return type === "crime" ? "red" :
           type === "incident" ? "orange" :
           type === "investment" ? "green" :
           "blue";
}

// Icono pulsante para eventos
function createPulseIcon(color) {
    return L.divIcon({
        className: '',
        html: `<div class="pulse" style="background:${color}"></div>`,
        iconSize: [0,0]
    });
}

// ==========================
// Cargar datos INEGI y GeoJSON de estados
// ==========================
Promise.all([
    fetch('data/inegi.json').then(res => res.json()),
    fetch('data/edos2.geojson').then(res => res.json())
]).then(([inegiData, geoData]) => {

    // Crear diccionario rápido de INEGI
    const ineDict = {};
    inegiData.forEach(d => { ineDict[d.estado] = d; });

    // Dibujar estados
    const geoLayer = L.geoJSON(geoData, {
        style: feature => {
            const estado = feature.properties.NOMGEO;
            const ine = ineDict[estado];
            const rate = ine ? ine.tasa_homicidios_dolosos_2023 : 0;
            return {
                fillColor: getHomicideColor(rate),
                weight: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        },
        onEachFeature: (feature, layer) => {
            const estado = feature.properties.NOMGEO;
            const ine = ineDict[estado];

            let popupContent = `<strong>${estado}</strong>`;
            if (ine) {
                popupContent += `<br>PIB: ${ine.PIB_participacion_pct_2023}%`;
                popupContent += `<br>Homicidios dolosos: ${ine.tasa_homicidios_dolosos_2023} por 100k`
            }

            layer.bindPopup(popupContent);
        }
    }).addTo(map);

    // Ajustar vista a todos los estados
    map.fitBounds(geoLayer.getBounds());
});

// ==========================
// EVENTOS INTERACTIVOS
// ==========================
fetch('data/events.json')
.then(res => res.json())
.then(events => {
    events.forEach(ev => {
        const marker = L.marker([ev.lat, ev.lng], {
            icon: createPulseIcon(getEventColor(ev.type))
        }).addTo(map);

        marker.bindPopup(`
            <strong>${ev.name}</strong><br>
            Type: ${ev.type}<br>
            ${ev.description}
        `);

        marker.on('mouseover', function () { this.openPopup(); });
        marker.on('mouseout', function () { this.closePopup(); });
    });
});