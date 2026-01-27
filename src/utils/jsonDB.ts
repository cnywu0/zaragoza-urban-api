import fs from 'fs';
import path from 'path';

const DB_FILE_PATH = path.join(__dirname, '../../data_storage.json');

export const saveToJSON = (data: any) => {
    let existingData = [];
    if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        try {
            existingData = JSON.parse(fileContent);
        } catch { existingData = []; }
    }
    existingData.push(data);
    // Guardamos con indentación de 2 espacios para que sea legible
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(existingData, null, 2));
    console.log('   💾 Persistido en data_storage.json');
};