import axios from 'axios';
import { canFetch } from '../utils/requestLimiter'; 
import dotenv from 'dotenv';

dotenv.config();

// Definimos incidencias compatibles con TomTom
export interface TrafficIncident {
    streetName: string;
    type: string;        // "Atasco", "Accidente", "Obras"
    description: string; // Detalles del evento
    severity: string;    // "Baja", "Menor", "Moderada", "Mayor", "Desconocida"
    coordinates: [number, number]; // Dónde ocurre
}

export interface TrafficData {
    source: string;
    timestamp: Date;
    total_incidents: number;
    incidents: TrafficIncident[];
}

export const fetchTraffic = async (): Promise<TrafficData | null> => {
    // 1. Permiso del Throttle
    if (!canFetch('TomTomTraffic')) return null;

    const API_KEY = process.env.TOMTOM_API_KEY;
    if (!API_KEY) {
        console.error('❌ Error: Falta TOMTOM_API_KEY en el archivo .env');
        return null;
    }

    try {
        console.log('🚗 Consultando TomTom Traffic (Zaragoza)...');

        // COORDENADAS DE ZARAGOZA (Un cuadrado que cubre la ciudad)
        // bbox = minLon, minLat, maxLon, maxLat
        const BBOX = '-0.975,41.605,-0.800,41.700';
        
        // URL de la API de Incidentes de TomTom
        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${API_KEY}&bbox=${BBOX}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description},from,to}}}`;
        
        const response = await axios.get(url);

        if (!response.data || !response.data.incidents) {
            console.log('   ✅ No hay incidencias de tráfico reportadas por TomTom ahora mismo.');
            return null;
        }

        const rawIncidents = response.data.incidents;
        console.log(`📡 [DEBUG] TomTom ha encontrado ${rawIncidents.length} incidencias.`);

        // 2. TRADUCCIÓN DE CÓDIGOS TOMTOM
        // TomTom usa números para los tipos de iconos, aquí los traducimos
        const getCategory = (code: number) => {
            switch(code) {
                case 1: return "Accidente";
                case 2: return "Niebla/Visibilidad";
                case 3: return "Peligro";
                case 4: return "Lluvia";
                case 5: return "Hielo";
                case 6: return "Incidencia";
                case 7: return "Carril Cerrado";
                case 8: return "Deslizamiento";
                case 9: return "Obras";
                case 10: return "Vehículo averiado";
                case 11: return "Atasco";
                default: return "Incidencia de tráfico";
            }
        };

        const getSeverity = (magnitude: number) => {
            switch(magnitude) {
                case 0: return "Desconocida";
                case 1: return "Menor";
                case 2: return "Moderada";
                case 3: return "Mayor";
                case 4: return "Indefinida";
                default: return "Moderada";
            }
        };

        // 3. MAPEO DE DATOS
        const incidents: TrafficIncident[] = rawIncidents.map((item: any) => {
            const props = item.properties;
            const geo = item.geometry;
            
            return {
                streetName: `${props.from || '?'} -> ${props.to || '?'}`, // Tramo afectado
                type: getCategory(props.iconCategory),
                description: props.events ? props.events[0].description : "Sin descripción",
                severity: getSeverity(props.magnitudeOfDelay),
                // TomTom devuelve las coordenadas de la línea del atasco, cogemos el punto inicial
                coordinates: geo.coordinates[0] 
            };
        });

        // Opcional: Filtramos solo las que sean "Mayor" o "Moderada" si hay muchas
        // const seriousIncidents = incidents.filter(i => i.severity !== 'Menor');

        console.log(`✅ [EXITO] Guardando ${incidents.length} incidencias de tráfico reales.`);

        return {
            source: 'TomTomTraffic',
            timestamp: new Date(),
            total_incidents: incidents.length,
            incidents: incidents
        };

    } catch (error) {
        console.error('❌ Error TomTom:', error instanceof Error ? error.message : error);
        return null;
    }
};