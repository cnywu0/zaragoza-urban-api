// 1. INICIALIZAR MAPA (Configurado para evitar el fondo negro)
const map = L.map('map', {
    zoomControl: false // Ocultamos el zoom por defecto para moverlo luego
}).setView([41.6488, -0.8891], 13);

// Colocamos el zoom abajo a la derecha
L.control.zoom({ position: 'bottomright' }).addTo(map);

// CAPA BASE (Esri Dark Gray)
// IMPORTANTE: maxNativeZoom: 16 evita que se ponga negro al acercar más
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri, HERE, Garmin, FAO, NOAA, USGS',
    maxNativeZoom: 16, 
    maxZoom: 19
}).addTo(map);

// CAPA ETIQUETAS (Calles)
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    pane: 'shadowPane', // Esto hace que las letras se vean nítidas sobre el mapa
    maxNativeZoom: 16,
    maxZoom: 19
}).addTo(map);

// 2. LEYENDA
const legend = L.control({ position: 'topright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<strong style="color:#e3e3e3; font-size:11px; text-transform:uppercase; letter-spacing:1px;">Leyenda</strong><br>';
    div.innerHTML += '<div style="margin-top:8px;"><i style="background: #f28b82; border: 2px solid rgba(242,139,130,0.3);"></i> Tráfico</div>';
    div.innerHTML += '<div><i style="background: #fdc365; border: 1px solid #fff;"></i> Obras</div>';
    div.innerHTML += '<div><i style="background: #6dd58c; border: 1px solid #fff;"></i> Bici Disp.</div>';
    div.innerHTML += '<div><i style="border: 2px solid #666; background:transparent;"></i> Bici Vacía</div>';
    return div;
};
legend.addTo(map);

// 3. CARGA DE DATOS
async function loadDashboard() {
    
    // --- METEOROLOGÍA ---
    try {
        const res = await fetch('/api/weather/current');
        const data = await res.json();
        document.getElementById('temp').textContent = `${Math.round(data.temperature)}°`;
        document.getElementById('weather-desc').textContent = `${data.description} | 💧 ${data.humidity}%`;
    } catch(e) {}

    // --- MEDIO AMBIENTE ---
    try {
        const res = await fetch('/api/environment/current');
        const data = await res.json();
        
        // Aire
        const pmEl = document.getElementById('pm25');
        pmEl.textContent = `${data.air_quality.pm2_5} µg/m³`;
        pmEl.className = data.air_quality.pm2_5 > 15 ? 'value-highlight color-bad' : 'value-highlight color-good';
        
        // Radiación
        document.getElementById('radiation').textContent = `${data.solar.radiation} W/m²`;

        // Polen
        const pList = document.getElementById('pollen-list');
        pList.innerHTML = '';
        const items = [
            {n:'Gramíneas', v:data.pollen.grass},
            {n:'Olivo', v:data.pollen.olive},
            {n:'Abedul', v:data.pollen.birch}
        ];
        items.forEach(i => {
            const li = document.createElement('li');
            let colorClass = i.v > 20 ? 'color-bad' : (i.v > 5 ? 'color-mod' : 'color-good');
            li.innerHTML = `<span>${i.n}</span><span class="${colorClass}" style="font-weight:700;">${i.v}</span>`;
            pList.appendChild(li);
        });
    } catch(e) {}

    // --- PARKING ---
    try {
        const res = await fetch('/api/parking/current');
        const data = await res.json();
        const occ = data.average_occupancy;
        const el = document.getElementById('parking-occupancy');
        el.textContent = `${occ}%`;
        
        if (occ > 85) el.style.color = 'var(--danger)';
        else if (occ > 60) el.style.color = 'var(--warning)';
        else el.style.color = 'var(--success)';

    } catch(e) {}

    // --- TRÁFICO ---
    try {
        const res = await fetch('/api/traffic/current');
        const data = await res.json();
        const list = document.getElementById('traffic-list');
        list.innerHTML = '';
        
        const icon = L.divIcon({
            className: '',
            html: `<div style='
                background:#f28b82;
                width:12px; height:12px;
                border-radius:50%;
                border: 2px solid white;
                box-shadow: 0 0 10px rgba(242,139,130,0.6);'>
            </div>`,
            iconAnchor: [8, 8]
        });

        data.incidents.forEach(inc => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div style="display:flex; align-items:center;">
                    <span class="incident-badge">${inc.type}</span>
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px;">${inc.streetName}</span>
                </div>
            `;
            list.appendChild(li);
            L.marker([inc.coordinates[1], inc.coordinates[0]], {icon:icon}).bindPopup(`<b>${inc.type}</b><br>${inc.description}`).addTo(map);
        });
    } catch(e) {}

    // --- BIZI ---
    try {
        const res = await fetch('/api/bizi/current');
        const data = await res.json();
        document.getElementById('bikes-total').textContent = data.total_bikes_available;

        data.stations.forEach(st => {
            const hasBikes = st.bikes_available > 0;
            const markerOptions = hasBikes 
                ? { radius: 5, color: '#fff', weight: 1, fillColor: '#6dd58c', fillOpacity: 1 }
                : { radius: 3, color: '#666', weight: 2, fillColor: 'transparent', fillOpacity: 0 };

            L.circleMarker([st.coordinates[1], st.coordinates[0]], markerOptions)
                .bindPopup(`<b>${st.address}</b><br>Bicis: ${st.bikes_available}`)
                .addTo(map);
        });
    } catch(e) {}

    // --- OBRAS ---
    try {
        const res = await fetch('/api/works/current');
        const data = await res.json();
        const workIcon = L.divIcon({
            className: '',
            html: "<div style='font-size:18px; filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.5));'>🚧</div>",
            iconAnchor: [10, 10]
        });
        
        data.works.forEach(w => {
            L.marker([w.coordinates[1], w.coordinates[0]], {icon:workIcon})
             .bindPopup(`<b>Obras</b><br>${w.title}`)
             .addTo(map);
        });
    } catch(e) {}

    // --- ANALYTICS (Nombres cambiados en HTML, aquí solo lógica) ---
    try {
        const r1 = await fetch('/api/analytics/anomaly');
        const d1 = await r1.json();
        const box = document.getElementById('anomaly-status');
        box.textContent = d1.message;
        box.style.color = d1.status === 'ALERT' ? 'var(--danger)' : 'var(--success)';

        const r2 = await fetch('/api/analytics/correlation');
        const d2 = await r2.json();
        document.getElementById('correlation-text').textContent = d2.result.conclusion;
    } catch(e) {}
}

loadDashboard();