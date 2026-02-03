const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');

const fetchWorks = async () => {
    if (!canFetch('ZaragozaWorks')) return null;
    try {
        console.log('🚧 Consultando Obras...');
        const res = await axios.get('https://www.zaragoza.es/sede/servicio/transporte/accidentalidad-trafico/accidente?rf=html&srsname=wgs84&start=0&rows=50&distance=500', { headers: { 'Accept': 'application/json' }});
        if(!res.data.result) return null;

        const works = res.data.result.map(w => ({
            id: w.id,
            title: w.title || "Obra",
            description: w.description || "Afección",
            link: w.uri,
            coordinates: w.geometry && w.geometry.coordinates ? (Array.isArray(w.geometry.coordinates[0]) ? w.geometry.coordinates[0] : w.geometry.coordinates) : [0,0]
        })).filter(w => w.coordinates[0] !== 0);

        console.log(`   🚧 ${works.length} obras activas.`);
        return { source: 'ZaragozaWorks', count: works.length, works: works, timestamp: new Date() };
    } catch(e) { console.error('Error Obras:', e.message); return null; }
};
module.exports = { fetchWorks };