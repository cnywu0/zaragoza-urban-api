# 📸 Guía de Capturas de Pantalla para el README

Este documento explica qué capturas de pantalla necesitas tomar y dónde colocarlas para completar el README.md de tu proyecto **Zaragoza Urban Brain**.

---

## 📁 Estructura de Carpetas para Imágenes

Crea la siguiente estructura en tu proyecto:

```
zaragoza-urban-api/
├── docs/
│   └── images/
│       ├── dashboard-main.png         # Captura completa del dashboard
│       ├── map-view.png               # Vista detallada del mapa interactivo
│       ├── analytics-panel.png        # Panel de análisis urbano
│       ├── mobile-view.png            # Vista en dispositivo móvil
│       ├── weather-section.png        # Sección de meteorología (opcional)
│       ├── traffic-incidents.png      # Incidencias de tráfico (opcional)
│       └── logo.png                   # Logo del proyecto (opcional)
```

---

## 📸 Capturas Requeridas

### 1. **dashboard-main.png** (OBLIGATORIA)
**Qué capturar:** Vista completa del dashboard con todos los paneles visibles

**Cómo hacerlo:**
1. Abre `http://localhost:3000` en tu navegador
2. Espera a que carguen todos los datos (15-30 segundos)
3. Asegúrate de que la ventana esté en tamaño completo (1920x1080 recomendado)
4. Usa una herramienta de captura de pantalla completa:
   - Windows: `Windows + Shift + S` o `PrtScn`
   - Mac: `Cmd + Shift + 3`
   - Linux: `PrtScn` o `gnome-screenshot`
5. Guarda como `dashboard-main.png` en `docs/images/`

**Elementos que deben verse:**
- ✅ Header con "Zaragoza Urban Brain" y estado "Online"
- ✅ Panel izquierdo: temperatura, calidad del aire, polen
- ✅ Mapa central con marcadores de tráfico, Bizi y obras
- ✅ Panel derecho: análisis, parking, Bizi, tráfico

---

### 2. **map-view.png** (OBLIGATORIA)
**Qué capturar:** Vista ampliada del mapa con marcadores

**Cómo hacerlo:**
1. Haz zoom en el mapa hasta nivel 14-15
2. Centra en una zona con varios marcadores (ej: centro de Zaragoza)
3. Asegúrate de que se vean:
   - 🔴 Marcadores rojos de tráfico
   - 🚧 Emojis naranjas de obras
   - 🟢 Círculos verdes de Bizi con bicis
   - ⚪ Círculos grises de estaciones vacías
4. Captura solo el área del mapa (sin los paneles laterales)
5. Guarda como `map-view.png`

**Herramientas recomendadas:**
- Windows: Snipping Tool (`Win + Shift + S`)
- Mac: Screenshot (`Cmd + Shift + 4`)
- Extensión navegador: Awesome Screenshot

---

### 3. **analytics-panel.png** (OBLIGATORIA)
**Qué capturar:** Panel de "Análisis Urbano" en el sidebar derecho

**Cómo hacerlo:**
1. Localiza el panel morado con título "🧠 Análisis Urbano"
2. Captura únicamente esa tarjeta, incluyendo:
   - El título con icono
   - La sección "Anomalía Aire" con el mensaje de estado
   - La sección "Patrón Bici/Clima" con la conclusión
3. Usa una herramienta de recorte para capturar solo esa card
4. Guarda como `analytics-panel.png`

**Consejo:** Espera a que los datos se carguen para que aparezca información real en lugar de "Calculando..."

---

### 4. **mobile-view.png** (RECOMENDADA)
**Qué capturar:** Vista del dashboard en dispositivo móvil

**Cómo hacerlo:**

**Opción A: Usar DevTools del navegador (recomendado)**
1. Abre `http://localhost:3000`
2. Presiona `F12` para abrir DevTools
3. Haz clic en el icono de dispositivo móvil (Toggle device toolbar) o presiona `Ctrl + Shift + M`
4. Selecciona un dispositivo (ej: iPhone 12 Pro, Samsung Galaxy S20)
5. Toma captura con la herramienta de DevTools:
   - Chrome: Botón "Captura de pantalla" en DevTools
   - Firefox: Clic derecho → "Tomar captura de pantalla"
6. Guarda como `mobile-view.png`

**Opción B: Usar tu smartphone real**
1. Encuentra la IP local de tu PC: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)
2. En el móvil, abre navegador y visita `http://[TU-IP]:3000`
3. Toma captura de pantalla normal del móvil
4. Transfiere la imagen a tu PC

---

## 🎨 Capturas Opcionales (Mejoran la documentación)

### 5. **weather-section.png**
Captura únicamente el panel de meteorología del sidebar izquierdo

### 6. **traffic-incidents.png**
Captura un popup del mapa mostrando detalles de una incidencia de tráfico

### 7. **logo.png**
Si diseñas un logo para el proyecto, añádelo aquí

---

## 🛠️ Herramientas Recomendadas para Editar Capturas

### Para Recortar y Redimensionar
- **Windows:** Paint, Paint 3D, Snip & Sketch
- **Mac:** Preview
- **Linux:** GIMP, Pinta
- **Online:** Photopea.com, Canva.com

### Para Añadir Anotaciones (flechas, texto)
- **Windows:** Snagit, ShareX (gratis)
- **Mac:** Skitch, Monosnap (gratis)
- **Multiplataforma:** Greenshot (gratis), Lightshot

### Extensiones de Navegador
- **Awesome Screenshot** (Chrome/Firefox)
- **Nimbus Screenshot** (Chrome)
- **Fireshot** (Chrome/Firefox)

---

## 📐 Especificaciones Técnicas

### Resoluciones Recomendadas

| Imagen | Ancho (px) | Altura (px) | Formato |
|--------|------------|-------------|---------|
| dashboard-main.png | 1920 | 1080 | PNG/JPG |
| map-view.png | 800-1200 | 600-900 | PNG |
| analytics-panel.png | 400-600 | 300-500 | PNG |
| mobile-view.png | 375-428 | 667-926 | PNG |

### Optimización
- Usa formato **PNG** para capturas con texto nítido
- Usa formato **JPG** para capturas grandes (reduce tamaño)
- Comprime las imágenes con:
  - [TinyPNG](https://tinypng.com/)
  - [Compressor.io](https://compressor.io/)
  - [ImageOptim](https://imageoptim.com/) (Mac)

---

## 📝 Checklist Final

Antes de considerar el README completo, verifica:

- [ ] **docs/images/** carpeta creada
- [ ] **dashboard-main.png** capturado y guardado
- [ ] **map-view.png** capturado con marcadores visibles
- [ ] **analytics-panel.png** capturado del panel morado
- [ ] **mobile-view.png** capturado (opcional pero recomendado)
- [ ] Todas las imágenes optimizadas (<500KB cada una)
- [ ] README.md actualizado con las rutas correctas
- [ ] Imágenes subidas al repositorio de GitHub

---

## 🚀 Subir Imágenes a GitHub

Una vez tengas todas las capturas:

```bash
# Crear carpeta
mkdir -p docs/images

# Mover tus capturas a la carpeta
# (ejemplo en Windows)
move dashboard-main.png docs/images/
move map-view.png docs/images/
move analytics-panel.png docs/images/
move mobile-view.png docs/images/

# Añadir al repositorio
git add docs/images/
git commit -m "📸 Añadir capturas de pantalla al README"
git push origin main
```

---

## ❓ Preguntas Frecuentes

**P: ¿Debo incluir datos reales en las capturas?**
R: Sí, pero puedes difuminar información sensible si es necesario.

**P: ¿Qué hago si el dashboard no carga datos?**
R: Verifica que las APIs estén configuradas correctamente en `.env` y espera al menos un ciclo de cronjob (15 min).

**P: ¿Puedo usar capturas de ejemplo de internet?**
R: No es recomendable. Las capturas deben ser de TU proyecto funcionando.

**P: ¿Necesito todas las capturas opcionales?**
R: No, pero mejoran significativamente la presentación del proyecto.

---

## 📞 Contacto

Si tienes dudas sobre qué capturar o cómo optimizar las imágenes, abre un issue en GitHub o contacta al mantenedor del proyecto.

---

**¡Buena suerte con tus capturas! 📸**
