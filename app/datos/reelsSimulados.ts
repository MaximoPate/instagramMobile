import type { Reel } from '../tipos';

/**
 * Contenido de la pestaña Reels. Como la consigna trabaja con imágenes y no
 * con video, cada reel se representa con su portada a pantalla completa.
 */
export const reelsSimulados: Reel[] = [
  {
    id: 'r1',
    autor: { nombreUsuario: 'gato_lover', avatar: 'https://i.pravatar.cc/150?img=1', verificado: true },
    portada: 'https://cataas.com/cat?width=720&height=1280&r=1',
    descripcion: 'El ritual de todas las mañanas 🐱☕',
    cantidadMeGusta: 18420,
    cantidadComentarios: 312,
    audio: 'sonido original · gato_lover',
  },
  {
    id: 'r2',
    autor: { nombreUsuario: 'michi.diario', avatar: 'https://i.pravatar.cc/150?img=5' },
    portada: 'https://cataas.com/cat?width=720&height=1280&r=2',
    descripcion: 'Cuando escucha el abrelatas desde la otra punta de la casa',
    cantidadMeGusta: 9345,
    cantidadComentarios: 128,
    audio: 'Tema del verano · Trending',
  },
  {
    id: 'r3',
    autor: { nombreUsuario: 'refugio_patitas', avatar: 'https://i.pravatar.cc/150?img=12' },
    portada: 'https://cataas.com/cat?width=720&height=1280&r=3',
    descripcion: 'Hoy Manchita encontró su hogar definitivo ❤️ #adoptanocompres',
    cantidadMeGusta: 54210,
    cantidadComentarios: 1874,
    audio: 'sonido original · refugio_patitas',
  },
  {
    id: 'r4',
    autor: { nombreUsuario: 'lu.vet', avatar: 'https://i.pravatar.cc/150?img=25' },
    portada: 'https://cataas.com/cat?width=720&height=1280&r=4',
    descripcion: '3 señales de que tu gato está sano 🩺',
    cantidadMeGusta: 27680,
    cantidadComentarios: 604,
    audio: 'sonido original · lu.vet',
  },
];
