
# IntegradorWebII
Juego de Banderas - Trabajo Integrador - Fabricio Zalazar

# Juego de Preguntas con API de Países

Trabajo Práctico Integrador - Programación Web II  
Tecnicatura en Desarrollo de Software - ULP

## Video Presentacion

https://youtu.be/yDEjXvOjwS0

## Descripción

Aplicación web desarrollada en Node.js que genera un juego de preguntas basado en la API de países [https://restcountries.com](https://restcountries.com).

El usuario debe responder 10 preguntas aleatorias sobre capitales, banderas y países limítrofes. Se calcula un puntaje, tiempo total y promedio. Al finalizar, la partida se guarda en el servidor y se muestra un ranking de las mejores 20 partidas.

## Funcionalidades (User Stories implementadas)

- **US1**: 3 tipos de preguntas:
  - ¿Cuál es el país de la siguiente ciudad capital? (3 puntos)
  - ¿El país XX está representado por esta bandera? (5 puntos)
  - ¿Cuántos países limítrofes tiene el país XX? (3 puntos)

- **US2**: Todas las preguntas tienen 4 opciones a elegir.

- **US3**: Si responde bien, se le informa y puede continuar.

- **US4**: Si responde mal, se le informa la respuesta correcta y puede continuar.

- **US5**: Al finalizar:
  - Total de preguntas correctas e incorrectas
  - Puntaje total
  - Tiempo total y promedio por pregunta

- **US6**: Ranking de las 20 mejores partidas guardadas en el servidor, ordenadas por puntaje.

## Tecnologías utilizadas

- Node.js + Express
- HTML + CSS (Bootstrap)
- Vanilla JavaScript
- API pública: [restcountries.com](https://restcountries.com/)
- Almacenamiento en archivo JSON plano (`partidas.json`)
- Render como servidor gratuito para despliegue

## Cómo ejecutar localmente

1. Cloná el proyecto
2. npm install
