let respuestaCorrecta = null;
let tipoPregunta = null;
let preguntaActual = 0;
let puntajeTotal = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let tiempos = [];
let tiempoInicioPregunta = null;
let datosPartida = [];

const jsConfetti = new JSConfetti();



async function cargarPregunta() {
    if (preguntaActual === 10) {
        terminarPartida();
        return;
    }

    const res = await fetch('/api/pregunta');
    const data = await res.json();
    tipoPregunta = data.tipo;
    respuestaCorrecta = data.respuesta;

    document.getElementById('pregunta').textContent = data.pregunta;
    const bandera = document.getElementById('bandera-img');
    const opcionesDiv = document.getElementById('opciones');
    const Respuesta = document.getElementById('Respuesta');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const cajaImg = document.getElementById('cajaImg');

    opcionesDiv.innerHTML = '';
    Respuesta.textContent = '';
    btnSiguiente.style.display = 'none';
    bandera.style.display = 'none';
        Respuesta.style.display= 'none'

    if (tipoPregunta === 'bandera' && data.imagen) {
        bandera.src = data.imagen;
        bandera.style.display = 'block';
        cajaImg.style.display = 'block';
    } else {
        bandera.src = '';
        bandera.style.display = 'none';
        cajaImg.style.display = 'none';
    }

    tiempoInicioPregunta = Date.now();

    data.opciones.forEach(op => {
        const btn = document.createElement('button');
        btn.textContent = op;
        btn.className = 'opciones';
        btn.onclick = () => {
            const tiempoFin = Date.now();
            const tiempoPregunta = ((tiempoFin - tiempoInicioPregunta) / 1000).toFixed(2);
            tiempos.push(parseFloat(tiempoPregunta));

            let puntajePregunta = 0;
            if (tipoPregunta === 'capital') puntajePregunta = 3;
            if (tipoPregunta === 'bandera') puntajePregunta = 5;
            if (tipoPregunta === 'fronteras') puntajePregunta = 3;

            const correcta = op == respuestaCorrecta;
            Respuesta.style.display = 'block'
            if (correcta) {
                jsConfetti.addConfetti({
                    emojis: ['🎉', '🎊', '✨', '🥳'],
                    confettiNumber: 30,
                  });
                respuestasCorrectas++;
                puntajeTotal += puntajePregunta;
                Respuesta.textContent = '¡Correcto!';
                Respuesta.style.color = 'green';
            } else {
                respuestasIncorrectas++;
                Respuesta.textContent = `Incorrecto. La respuesta correcta era: ${respuestaCorrecta}`;
                Respuesta.style.color = 'red';
            }
            btnSiguiente.style.display = 'inline-block';

            datosPartida.push({
                numero: preguntaActual + 1,
                tipo: tipoPregunta,
                correcta,
                tiempo: parseFloat(tiempoPregunta),
                puntaje: correcta ? puntajePregunta : 0
            });

            document.querySelectorAll('.opciones').forEach(b => b.disabled = true);
        };
        opcionesDiv.appendChild(btn);

    });

    preguntaActual++;
}



function terminarPartida() {
    const totalTiempo = tiempos.reduce((a, b) => a + b, 0);
    const promedio = (totalTiempo / tiempos.length).toFixed(2);

    const partida = {
        fecha: new Date().toISOString(),
        puntaje: puntajeTotal,
        correctas: respuestasCorrectas,
        incorrectas: respuestasIncorrectas,
        duracionTotal: totalTiempo.toFixed(2),
        tiempoPromedio: promedio,
        respuestas: datosPartida
    };

    fetch('/api/partida', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(partida)
    }).then(() => {
        document.body.innerHTML = `
        <div class="cajaResultado">
          <h2>¡Juego finalizado!</h2>
          <hr>
          <p>Puntaje total: <strong>${puntajeTotal}</strong></p>
          <p>Correctas: ${respuestasCorrectas}</p>
          <p>Incorrectas: ${respuestasIncorrectas}</p>
          <p>Duración total: ${totalTiempo.toFixed(2)} segundos</p>
          <p>Promedio por pregunta: ${promedio} segundos</p>
          <a href="/">🔄 Volver a jugar</a>
        
        </div>
      `;
    });
}


document.getElementById('btnSiguiente').addEventListener('click', cargarPregunta);

cargarPregunta();