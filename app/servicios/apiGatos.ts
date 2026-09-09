import axios from 'axios';

import {
  comentariosSimulados,
  descripcionesSimuladas,
  etiquetasSimuladas,
  tiemposSimulados,
  ubicacionesSimuladas,
} from '../datos/textosSimulados';
import { usuariosSimulados } from '../datos/usuariosSimulados';
import type { Comentario, Publicacion } from '../tipos';

/** Cantidad de publicaciones que se piden al iniciar la app (la consigna pide 10 como mínimo). */
export const CANTIDAD_PUBLICACIONES = 12;

/** Instancia de Axios reutilizable: centraliza baseURL y timeout. */
// eslint-disable-next-line import/no-named-as-default-member
const clienteGatos = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
  timeout: 10000,
});

/** Forma cruda de cada elemento que devuelve The Cat API. */
type ImagenDeGato = {
  id: string;
  url: string;
  width: number;
  height: number;
};

/**
 * Hash simple y estable a partir del id que devuelve la API.
 * Se usa como semilla para que los datos simulados (usuario, ubicación,
 * cantidad de "Me gusta") sean siempre los mismos para una misma imagen y
 * no cambien en cada re-render, como pasaría con `Math.random()`.
 */
function semillaDesde(texto: string): number {
  let acumulado = 0;
  for (let i = 0; i < texto.length; i++) {
    acumulado = (acumulado * 31 + texto.charCodeAt(i)) % 100000;
  }
  return acumulado;
}

function elegirDe<T>(lista: T[], semilla: number): T {
  return lista[semilla % lista.length];
}

function enteroEntre(semilla: number, minimo: number, maximo: number): number {
  return minimo + (semilla % (maximo - minimo + 1));
}

/** Arma entre 2 y 4 comentarios ficticios para el detalle de la publicación. */
function armarComentarios(idPublicacion: string, semilla: number): Comentario[] {
  const cantidad = enteroEntre(semilla, 2, 4);

  return Array.from({ length: cantidad }, (_, indice) => {
    const semillaComentario = semilla + indice * 17;

    return {
      id: `${idPublicacion}-c${indice}`,
      autor: elegirDe(usuariosSimulados, semillaComentario + 3),
      texto: elegirDe(comentariosSimulados, semillaComentario),
      hace: elegirDe(tiemposSimulados, semillaComentario + 1),
      meGusta: enteroEntre(semillaComentario, 0, 48),
    };
  });
}

/**
 * Convierte la respuesta cruda de la API en el modelo `Publicacion` que
 * consume la interfaz. Toda la simulación (autor, ubicación, texto) vive acá
 * para que los componentes reciban datos ya listos para mostrar.
 */
function mapearAPublicacion(imagen: ImagenDeGato, indice: number): Publicacion {
  const semilla = semillaDesde(imagen.id) + indice;

  return {
    id: imagen.id,
    autor: usuariosSimulados[indice % usuariosSimulados.length],
    imagen: imagen.url,
    // Se limita la relación de aspecto para que ninguna foto muy alargada
    // rompa la altura de la tarjeta, igual que hace Instagram.
    relacionAspecto: Math.min(Math.max(imagen.width / imagen.height, 0.8), 1.91),
    ubicacion: elegirDe(ubicacionesSimuladas, semilla),
    cantidadMeGusta: enteroEntre(semilla, 120, 9800),
    descripcion: elegirDe(descripcionesSimuladas, semilla + 2),
    etiquetas: elegirDe(etiquetasSimuladas, semilla + 5),
    hace: elegirDe(tiemposSimulados, semilla + 7),
    comentarios: armarComentarios(imagen.id, semilla),
    meGusta: false,
    guardada: false,
  };
}

/**
 * Petición asincrónica principal de la app.
 * La dispara `ProveedorPublicaciones` dentro de un `useEffect` al montar.
 */
export async function obtenerPublicaciones(
  cantidad = CANTIDAD_PUBLICACIONES,
): Promise<Publicacion[]> {
  const { data } = await clienteGatos.get<ImagenDeGato[]>('/images/search', {
    params: { limit: cantidad, size: 'med', order: 'RANDOM' },
  });

  return data.map(mapearAPublicacion);
}
