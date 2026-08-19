// src/data/postsFake.ts

import type { Post } from '../types';

export const postsFake: Post[] = [
  {
    id: '1',
    usuario: { username: 'gato_lover', avatar: 'https://i.pravatar.cc/150?img=1' },
    imagen: 'https://muyinteresante.okdiario.com/wp-content/uploads/sites/5/2022/10/12/634616ee6f89a.jpeg',
    ubicacion: 'Buenos Aires, Argentina',
    likes: 245,
    caption: 'Mi gato durmiendo la siesta 🐱',
  },
  {
    id: '2',
    usuario: { username: 'mkbhd', avatar: 'https://i.pravatar.cc/150?img=6' },
    imagen: 'https://phantom-marca.unidadeditorial.es/dbbc1c6570d8633e2247c03aa4fbee93/resize/1320/f/jpg/assets/multimedia/imagenes/2024/01/04/17044034534763.jpg',
    ubicacion: 'Córdoba, Argentina',
    likes: 1893,
    caption: 'Setup nuevo, ¿qué opinan?',
  },
  {
    id: '3',
    usuario: { username: 'juanita.ok', avatar: 'https://i.pravatar.cc/150?img=7' },
    imagen: 'https://roket.com/wp-content/uploads/2024/10/14.webp',
    ubicacion: 'Bariloche, Argentina',
    likes: 87,
    caption: 'Viaje a Bariloche 🏔️',
  },
];