import type { Notificacion } from '../tipos';

/**
 * Actividad simulada de la pestaña del corazón. Las de tipo "seguimiento"
 * no llevan miniatura porque en Instagram muestran el botón "Seguir".
 */
export const notificacionesSimuladas: Notificacion[] = [
  {
    id: 'n1',
    tipo: 'meGusta',
    autor: { nombreUsuario: 'gato_lover', avatar: 'https://i.pravatar.cc/150?img=1', verificado: true },
    texto: 'le gustó tu publicación.',
    hace: '2 h',
    miniatura: 'https://cataas.com/cat?width=120&height=120&n=1',
  },
  {
    id: 'n2',
    tipo: 'comentario',
    autor: { nombreUsuario: 'michi.diario', avatar: 'https://i.pravatar.cc/150?img=5' },
    texto: 'comentó: "Qué buena foto 😻"',
    hace: '5 h',
    miniatura: 'https://cataas.com/cat?width=120&height=120&n=2',
  },
  {
    id: 'n3',
    tipo: 'seguimiento',
    autor: { nombreUsuario: 'refugio_patitas', avatar: 'https://i.pravatar.cc/150?img=12' },
    texto: 'empezó a seguirte.',
    hace: '9 h',
  },
  {
    id: 'n4',
    tipo: 'mencion',
    autor: { nombreUsuario: 'juanita.ok', avatar: 'https://i.pravatar.cc/150?img=7' },
    texto: 'te mencionó en un comentario.',
    hace: '1 d',
    miniatura: 'https://cataas.com/cat?width=120&height=120&n=3',
  },
  {
    id: 'n5',
    tipo: 'meGusta',
    autor: { nombreUsuario: 'carlos.dev', avatar: 'https://i.pravatar.cc/150?img=8' },
    texto: 'y 42 personas más les gustó tu publicación.',
    hace: '1 d',
    miniatura: 'https://cataas.com/cat?width=120&height=120&n=4',
  },
  {
    id: 'n6',
    tipo: 'seguimiento',
    autor: { nombreUsuario: 'lu.vet', avatar: 'https://i.pravatar.cc/150?img=25' },
    texto: 'empezó a seguirte.',
    hace: '2 d',
  },
  {
    id: 'n7',
    tipo: 'comentario',
    autor: { nombreUsuario: 'the.cat.club', avatar: 'https://i.pravatar.cc/150?img=15', verificado: true },
    texto: 'comentó: "Lo compartimos en nuestra cuenta 🙌"',
    hace: '3 d',
    miniatura: 'https://cataas.com/cat?width=120&height=120&n=5',
  },
  {
    id: 'n8',
    tipo: 'meGusta',
    autor: { nombreUsuario: 'cami.ilustra', avatar: 'https://i.pravatar.cc/150?img=44' },
    texto: 'le gustó tu comentario.',
    hace: '1 sem',
    miniatura: 'https://cataas.com/cat?width=120&height=120&n=6',
  },
];
