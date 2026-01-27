import axios from 'axios';
import { canFetch } from '../utils/requestLimiter'; 

export interface BiziStation {
    id: number;
    address: string;
    bikes_available: number;
    docks_available: number;
    coordinates: [number, number];
}

export interface BiziData {
    source: string;
    timestamp: Date;
    total_stations: number;
    total_bikes_available: number;
    stations: BiziStation[];
}

export const fetchBizi = async (): Promise<BiziData | null> => {
    // Usamos una clave nueva para el Throttle
    if (!canFetch('ZaragozaBizi')) return null;

    try {
        console.log('🚲 Consultando API Bizi Zaragoza...');
        const url = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/estacion-bicicleta.json?rows=150';
        
        const response = await axios.get(url, { headers: { 'Accept': 'application/json' } });

        if (!response.data || !response.data.result) return null;

        const rawStations = response.data.result;
        let totalBikes = 0;

        const cleanStations: BiziStation[] = rawStations.map((st: any) => {
            const bikes = parseInt(st.bicisDisponibles) || 0;
            totalBikes += bikes;
            return {
                id: parseInt(st.id),
                address: st.title,
                bikes_available: bikes,
                docks_available: parseInt(st.anclajesDisponibles) || 0,
                coordinates: st.geometry ? st.geometry.coordinates : [0, 0] 
            };
        });

        return {
            source: 'ZaragozaBizi', // Source específico
            timestamp: new Date(),
            total_stations: cleanStations.length,
            total_bikes_available: totalBikes,
            stations: cleanStations
        };

    } catch (error) {
        console.error('❌ Error Bizi:', error instanceof Error ? error.message : error);
        return null;
    }
};