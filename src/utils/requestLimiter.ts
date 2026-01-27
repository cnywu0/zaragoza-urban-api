import fs from 'fs';
import path from 'path';

// NOTA: Usamos '../' para subir a src y otro '../' para subir a la raíz del proyecto.
const LOG_FILE_PATH = path.join(__dirname, '../../request_logs.json');

// 10 minutos de espera
const WAIT_TIME = 10 * 60 * 1000; 

interface LogData {
    [key: string]: number;
}

export const canFetch = (apiName: string): boolean => {
    let logs: LogData = {};

    // 1. INTENTO DE LECTURA (A prueba de fallos)
    try {
        if (fs.existsSync(LOG_FILE_PATH)) {
            const rawData = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
            // Si el archivo está vacío, JSON.parse falla, así que controlamos eso
            if (rawData.trim() !== "") {
                logs = JSON.parse(rawData);
            }
        }
    } catch (error) {
        console.warn('⚠️ Archivo de logs corrupto o inaccesible. Creando uno nuevo...');
        logs = {}; // Si falla algo, empezamos de cero sin romper el programa
    }

    const lastTime = logs[apiName] || 0;
    const now = Date.now();
    const timePassed = now - lastTime;
    const timeRemaining = Math.ceil((WAIT_TIME - timePassed) / 1000 / 60);

    // 2. COMPROBACIÓN DE TIEMPO
    if (timePassed < WAIT_TIME) {
        console.warn(`🛡️ THROTTLE: [${apiName}] bloqueado. Espera ${timeRemaining} min.`);
        return false;
    }

    // 3. INTENTO DE ESCRITURA (A prueba de fallos)
    try {
        logs[apiName] = now;
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error guardando logs (pero la petición continuará):', error);
        // Devolvemos true para que el programa siga funcionando aunque no pueda guardar el log
        return true; 
    }
};