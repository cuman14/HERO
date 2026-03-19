# Proceso de Extracción de Datos de Wodbuster Arena

## Objetivo
Obtener la lista completa de equipos e integrantes de la competición "2º ANIVERSARIO PRIME" desde el portal [Wodbuster Arena](https://arena.wodbuster.com/competition.aspx?id=3823&idd=16597&idw=).

## Metodología y Herramientas
Para este proceso se utilizó un **Subagente de Navegación Inteligente** con capacidad de interactuar con el DOM y analizar el tráfico de red.

### Pasos Seguidos:

1. **Análisis Inicial de la URL**:
   - Identificación de los parámetros `id=3823` (competición) e `idd` (división).
   - Navegación a la página principal de la competición para detectar las categorías disponibles en el menú desplegable.

2. **Exploración de la Interfaz (UI)**:
   - Se recorrió el selector de categorías, identificando los IDs internos (`idd`) para cada una:
     - **RX MM**: 16597
     - **RX FM**: 16598
     - **INTER MM**: 16599
     - **INTER FF**: 16600
     - **INTER FM**: 16601
     - **SCALED FF**: 16602
     - **SCALED FM**: 16603

3. **Estrategia de Extracción de Miembros**:
   - **Click Secuencial**: Se interactuó con cada tarjeta de equipo para abrir el panel lateral de detalles.
   - **Análisis de API**: Al detectar que algunos nombres se cargaban mediante peticiones dinámicas que tardaban en reflejarse visualmente, se monitorizó el tráfico de red de la sesión.
   - **Captura de Respuestas**: Se identificaron endpoints internos de la API (como `https://arena.wodbuster.com/api/CompeticionUI/GetInfoAtleta/[ID_EQUIPO]`) para extraer los nombres de los atletas de forma 100% fiable, incluso si la UI no los mostraba inmediatamente.

4. **Consolidación de Datos**:
   - Los datos brutos recolectados por el subagente se estructuraron por divisiones.
   - Se realizó una depuración para evitar duplicidades entre los equipos mostrados en la clasificación general y los de listados específicos.

## Resultados
Los resultados con todos los nombres de los integrantes se guardaron inicialmente en un listado consolidado para el usuario y se documentaron aquí para referencia futura.

---
*Este documento fue generado el 18 de marzo de 2026 como registro técnico de la tarea.*
