const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data_storage.json');

const saveToJSON = (newData) => {
    let currentData = [];
    
    if (fs.existsSync(DB_FILE)) {
        try {
            const raw = fs.readFileSync(DB_FILE, 'utf-8');
            currentData = JSON.parse(raw);
        } catch (error) {
            console.error("Error leyendo DB:", error);
        }
    }

    currentData.push(newData);

    // Guardamos
    fs.writeFileSync(DB_FILE, JSON.stringify(currentData, null, 2));
    console.log(`   💾 Guardado dato de: ${newData.source}`);
};

module.exports = { saveToJSON };