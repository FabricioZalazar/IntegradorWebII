import fetch from 'node-fetch';

let paisesCache = [];

async function cargarPaises() {
  if (paisesCache.length === 0) {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    paisesCache = data;
  }
  return paisesCache;
}

export async function generarPregunta() {
  const paises = await cargarPaises();
  let tipo = Math.floor(Math.random() * 3); // Con esto se elije que pregunta tipo se envia 0=Capital 1=Bandera 2=Fronteras

  const pais = paises[Math.floor(Math.random() * paises.length)]; //Pais pie
  const opciones = [pais];

  while (opciones.length < 4) {
    const candidato = paises[Math.floor(Math.random() * paises.length)];
    if (!opciones.includes(candidato)) { //Se completan las opciones
      opciones.push(candidato);
    }
  }

  opciones.sort(() => Math.random() - 0.5); // Mezclar opciones

  if (tipo === 0 && (!pais.capital || !pais.capital[0])) {
    tipo = Math.floor(Math.random() * 2);
  }

  if (tipo === 0) {
    return {
      tipo: 'capital',
      pregunta: `¿Cuál es el país de la capital ${pais.capital?.[0]}?`,
      opciones: opciones.map(p => p.name.common),
      respuesta: pais.name.common
    };
  } else if (tipo === 1) {
    return {
      tipo: 'bandera',
      pregunta: `¿A qué país pertenece esta bandera?`,
      imagen: pais.flags.png,
      opciones: opciones.map(p => p.name.common),
      respuesta: pais.name.common
    };
  } else {
    return {
      tipo: 'fronteras',
      pregunta: `¿Cuántos países limítrofes tiene ${pais.name.common}?`,
      opciones: rellenarOpciones(pais.borders?.length || 0),
      respuesta: pais.borders?.length || 0
    };
  }

  function rellenarOpciones(x) {

    const rangoMax = Math.min(10, x + 4); // Limita a 10 como máximo
  
    let opciones = [x];
    while (opciones.length < 4) {
      const num = Math.floor(Math.random() * rangoMax);
      if (!opciones.includes(num)) {
        opciones.push(num)
      }
    }

    return opciones.sort(() => Math.random() - 0.5); //mezclamos antes de enviar

  }
}