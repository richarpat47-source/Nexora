# Nexora

Plataforma educativa para **perder el miedo a la IA y construir tu plan financiero personal** con lecciones interactivas, herramientas reales y prompts listos para usar.

- **`/`**: landing page de conversión.
- **`/app`**: app interna con la ruta de aprendizaje, las herramientas, el laboratorio de prompts, Mi plan y los recursos.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · React Router · Recharts · Lucide. Es una SPA estática lista para Vercel (`vercel.json` incluye las reescrituras).

## Scripts

```bash
npm install
npm run dev        # desarrollo
npm run typecheck  # tsc
npm test           # vitest (cálculos financieros)
npm run build      # build de producción en dist/
```

## Estructura

```
src/
  landing/          Landing: Hero (nav + hero animado) y Sections (resto de secciones)
  app/              App interna: AppLayout (sidebar) + pages/
  components/       UI compartida, herramientas financieras, íconos
  data/             Contenido: módulos/lecciones y biblioteca de prompts
  lib/finance.ts    Cálculos puros y testeados (50/30/20, deudas, interés compuesto…)
  lib/storage.ts    Perfil y progreso persistidos en localStorage
```

El contenido se edita en `src/data/`. Para agregar una lección basta con añadirla al array del módulo: la ruta, el progreso y la navegación se actualizan solos.

## Landing: secciones

Hero con chat de IA animado y tarjetas con parallax · marquee de temas · métricas · problema (alternador antes/después) · beneficios (bento con brillo que sigue al cursor) · cómo funciona (línea de progreso ligada al scroll) · termómetro del miedo (quiz) · demo en vivo de 3 herramientas · programa (acordeón) · testimonios · precios (mensual/anual) · FAQ · CTA con captura de email · footer.

## App interna

| Sección | Qué hace |
|---|---|
| Inicio | Progreso, siguiente lección, salud financiera, tip del día, logros |
| Mi ruta | 6 módulos y 16 lecciones con estado de completado |
| Lección | Contenido, prompt para copiar, herramienta integrada, quiz que bloquea el avance, celebración |
| Herramientas | Salud financiera, 50/30/20, fondo de emergencia, metas, deudas (avalancha vs. bola de nieve), interés compuesto |
| Laboratorio de prompts | Constructor guiado (rol + objetivo + contexto + formato) y biblioteca filtrable |
| Mi plan | Asistente de 3 pasos que genera un plan priorizado, imprimible o exportable a PDF |
| Recursos | Checklist de seguridad, señales de estafa, asistentes recomendados, glosario |

## Pendiente antes de lanzar (importante)

- **Testimonios**: los actuales son de ejemplo. Hay que reemplazarlos por testimonios reales con autorización.
- **Precios**: son provisionales y hay que validarlos.
- **Email del CTA**: no está conectado a ningún proveedor (ver `TODO(integración)`).
- **Cuentas de usuario**: el progreso vive en `localStorage`. No hay login ni sincronización entre dispositivos.
- **Imágenes**: los visuales son SVG y componentes propios. Para fotos o ilustraciones de marca hace falta definir la identidad visual.
- **Legal**: faltan las páginas de privacidad, términos y el aviso educativo.
