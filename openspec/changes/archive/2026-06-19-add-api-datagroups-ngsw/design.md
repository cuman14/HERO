## Context

La app Judge usa Angular Service Worker (`@angular/service-worker`) con un `ngsw-config.json` que actualmente solo tiene `assetGroups` para cachear archivos estáticos. No hay `dataGroups`, por lo que las requests GET a la API Supabase no se cachean, y la app no funciona offline para datos ya cargados.

Supabase expone dos endpoints principales para la app Judge:
- REST API: `https://<project>.supabase.co/rest/v1/**`
- Realtime API: `https://<project>.supabase.co/realtime/v1/**`

## Goals / Non-Goals

**Goals:**
- Cachear respuestas GET de Supabase REST + Realtime en el Service Worker
- Usar estrategia `freshness` para priorizar datos actualizados cuando hay conexión
- Permitir que la app funcione offline con datos previamente cacheados

**Non-Goals:**
- No se modifica la lógica de negocio ni stores
- No se implementa cola offline (eso es Fase 4 del PIP-001)
- No se cachean requests POST/PATCH/DELETE
- No se añaden nuevas dependencias

## Decisions

- **Estrategia `freshness`**: Prioriza la red pero usa caché como fallback cuando no hay conexión. Es la adecuada para datos de API que cambian con frecuencia pero donde vale la pena tener una copia offline.
- **`maxSize: 100`**: Límite conservador para evitar llenar el almacenamiento del Service Worker. Ajustable si se necesitan más entradas en caché.
- **`maxAge: 1d`**: Las entradas expiran después de 1 día, forzando una recarga fresca periódicamente.
- **Urls `/rest/v1/**` y `/realtime/v1/**`**: Patrones glob que cubren todos los endpoints de Supabase usados por la app Judge sin necesidad de listar rutas individuales.

## Risks / Trade-offs

- **Datos obsoletos**: Con `freshness`, si el usuario está offline, verá datos cacheados que pueden estar desactualizados → Mitigación: `maxAge: 1d` evita datos muy viejos.
- **Consumo de almacenamiento**: El Service Worker tiene límites de almacenamiento en cada navegador → Mitigación: `maxSize: 100` mantiene el caché acotado.
