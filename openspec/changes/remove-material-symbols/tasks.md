## 1. Remove CSS block from index.html

- [ ] 1.1 Eliminar bloque `.material-symbols-outlined` de `apps/judge/index.html`

## 2. Remove @font-face from styles.css

- [ ] 2.1 Eliminar `@font-face` de MaterialSymbolsOutlined en `apps/judge/src/styles.css`

## 3. Remove WOFF2 font file

- [ ] 3.1 Eliminar `apps/judge/public/fonts/MaterialSymbolsOutlined.woff2` si existe

## 4. Verify no remaining references

- [ ] 4.1 Buscar referencias a `material-symbols` en apps/judge/
- [ ] 4.2 Ejecutar `npx nx typecheck judge`
- [ ] 4.3 Ejecutar `npx nx lint judge`

## 5. Commit

- [ ] 5.1 Commit con mensaje `perf(judge): remove unused Material Symbols font loading`
