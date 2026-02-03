const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');

const fetchWorks = async () => {
    // Throttle: Evita saturar la API (respeta el tiempo de espera)
    if (!canFetch('ZaragozaWorks')) return null;

    try {
        console.log('🚧 Consultando Obras en vía pública...');
        // API oficial de Zaragoza de Afecciones
        // CAMBIA ESTA LÍNEA (Línea 10 aprox):
        const url = 'https://www.zaragoza.es/sede/servicio/trafico/afeccion.json?rows=50';
        
        // Zaragoza a veces devuelve XML si no especificas JSON
        const response = await axios.get(url, { headers: { 'Accept': 'application/json' } });

        if (!response.data || !response.data.result) return null;

        const works = response.data.result.map((w) => {
            // LÓGICA DE GEOMETRÍA:
            // Las obras a veces son puntos [lon, lat] y a veces líneas [[lon, lat], [lon, lat]]
            let coords = [0, 0];
            
            if (w.geometry && w.geometry.coordinates) {
                const raw = w.geometry.coordinates;
                // Si es un array de arrays (línea), cogemos el primer punto para poner el icono
                // Si es un array simple (punto), lo usamos tal cual
                coords = (Array.isArray(raw[0])) ? raw[0] : raw;
            }

            return {
                id: w.id,
                title: w.title || "Obra en calzada",
                description: w.description || "Afección al tráfico",
                link: w.uri, // Enlace a la web municipal
                coordinates: coords // [lon, lat]
            };
        });

        // Filtrar obras que no tengan coordenadas válidas (0,0)
        const activeWorks = works.filter(w => w.coordinates && w.coordinates[0] !== 0);

        console.log(`   🚧 Obras activas encontradas: ${activeWorks.length}`);

        return {
            source: 'ZaragozaWorks',
            timestamp: new Date(),
            count: activeWorks.length,
            works: activeWorks
        };

    } catch (error) {
        console.error('❌ Error Obras:', error.message);
        return null;
    }
};

module.exports = { fetchWorks };