# Tecnoticias 🚀

Aplicación web de consulta de noticias tecnológicas que permite explorar información actualizada del mundo de la tecnología mediante el consumo de la API pública **GNews API**.

## Objetivo

Tecnoticias permite a los usuarios buscar noticias tecnológicas por temas específicos, visualizar los resultados de forma dinámica mediante tarjetas, guardar noticias favoritas y recuperar información almacenada mediante el navegador.

## API utilizada

**GNews API** — API pública gratuita que proporciona acceso a noticias de diversas fuentes internacionales. Permite realizar búsquedas por palabras clave y filtrar resultados por idioma, país y categoría.

## Organización modular

El código JavaScript está estructurado en módulos ES con responsabilidades bien definidas:

```
js/
├── api.js      → Conexión con GNews API (fetch, async/await, JSON)
├── ui.js       → Renderizado de tarjetas, mensajes, actualización del DOM
├── storage.js  → Persistencia en localStorage (favoritos, última consulta, historial)
└── main.js     → Control de eventos, coordinación entre módulos, inicialización
```

## Tecnologías utilizadas

- **HTML5** — Estructura semántica de la interfaz
- **CSS3** — Diseño adaptable (responsive) con variables CSS, grid y flexbox
- **JavaScript (ES Modules)** — Lógica de la aplicación con arquitectura modular
- **GNews API** — Fuente de datos de noticias tecnológicas
- **localStorage** — Persistencia de datos en el navegador

## Funcionalidades

- Búsqueda de noticias tecnológicas por palabras clave
- Filtrado por categorías (IA, Móviles, Hardware, Gaming, Ciberseguridad)
- Visualización dinámica mediante tarjetas con imagen, título, descripción, fuente y fecha
- Sistema de favoritos con persistencia (agregar, eliminar individual, eliminar todos)
- Almacenamiento de la última consulta realizada
- Historial de consultas (hasta 10 búsquedas)
- Manejo de errores con mensajes informativos
- Diseño responsive (computadoras, tablets, teléfonos)

## Cómo usar

1. Obtén una API key gratuita en [gnews.io](https://gnews.io/)
2. Abre `js/api.js` y reemplaza `TU_API_KEY_DE_GNEWS` con tu API key
3. Abre `index.html` en tu navegador o despliega con GitHub Pages

## Despliegue

El proyecto está preparado para publicarse mediante **GitHub Pages** desde la rama principal del repositorio.

## Capturas

*(Agregar capturas de la interfaz principal, búsqueda y favoritos)*
