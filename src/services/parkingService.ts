import axios from 'axios';
import { canFetch } from '../utils/requestLimiter'; 

export interface Parking {
    id: number;
    name: string;
    address: string;
    spots_total: number;
    spots_free: number;
    occupancy_percentage: number; // % de ocupación (0% vacio, 100% lleno)
    updated: string;
}

export interface ParkingData {
    source: string;
    timestamp: Date;
    total_parkings: number;
    average_occupancy: number; // Ocupación media de la ciudad
    parkings: Parking[];
}

export const fetchParking = async (): Promise<ParkingData | null> => {
    if (!canFetch('ZaragozaParking')) return null;

    try {
        console.log('🅿️ Consultando Parkings Públicos Zaragoza...');
        // API Oficial de Zaragoza (Datos Abiertos)
        const url = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/equipamiento/aparcamiento-publico.json?rows=50';
        
        const response = await axios.get(url, { headers: { 'Accept': 'application/json' } });

        if (!response.data || !response.data.result) return null;

        const rawList = response.data.result;
        
        // Procesamos
        const cleanList: Parking[] = rawList.map((p: any) => {
            const total = parseInt(p.plazas) || 0;
            const libres = parseInt(p.libres) || 0; // Ojo: A veces este campo es null si no tienen datos
            // Si libres es mayor que total (error de datos), lo ajustamos
            const free = libres > total ? total : libres; 
            
            // Calculamos ocupación
            let occupancy = 0;
            if (total > 0) {
                occupancy = ((total - free) / total) * 100;
            }

            return {
                id: p.id,
                name: p.title,
                address: p.calle || "Dirección desconocida",
                spots_total: total,
                spots_free: free,
                occupancy_percentage: parseFloat(occupancy.toFixed(1)),
                updated: p.lastUpdated || new Date().toISOString()
            };
        });

        // Filtramos parkings que tengan 0 plazas totales (errores de API)
        const validParkings = cleanList.filter(p => p.spots_total > 0);

        // Calculamos la media de la ciudad
        const avgOccupancy = validParkings.reduce((sum, p) => sum + p.occupancy_percentage, 0) / validParkings.length || 0;

        console.log(`   🅿️ ${validParkings.length} parkings monitorizados. Ocupación media: ${avgOccupancy.toFixed(1)}%`);

        return {
            source: 'ZaragozaParking',
            timestamp: new Date(),
            total_parkings: validParkings.length,
            average_occupancy: parseFloat(avgOccupancy.toFixed(1)),
            parkings: validParkings
        };

    } catch (error) {
        console.error('❌ Error Parking:', error instanceof Error ? error.message : error);
        return null;
    }
};