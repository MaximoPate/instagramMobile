import type { Usuario } from '../tipos';

/**
 * Cuentas ficticias que se le asignan a las imágenes que llegan de la API.
 * The Cat API sólo devuelve la foto, así que el "autor" del posteo lo
 * completamos desde acá para que el feed se vea como el de Instagram.
 */
export const usuariosSimulados: Usuario[] = [
  { nombreUsuario: 'gato_lover', avatar: 'https://i.pravatar.cc/150?img=1', verificado: true },
  { nombreUsuario: 'michi.diario', avatar: 'https://i.pravatar.cc/150?img=5' },
  { nombreUsuario: 'juanita.ok', avatar: 'https://i.pravatar.cc/150?img=7' },
  { nombreUsuario: 'carlos.dev', avatar: 'https://i.pravatar.cc/150?img=8' },
  { nombreUsuario: 'sol.rodriguez', avatar: 'https://i.pravatar.cc/150?img=20', verificado: true },
  { nombreUsuario: 'refugio_patitas', avatar: 'https://i.pravatar.cc/150?img=12' },
  { nombreUsuario: 'martin.foto', avatar: 'https://i.pravatar.cc/150?img=13' },
  { nombreUsuario: 'lu.vet', avatar: 'https://i.pravatar.cc/150?img=25' },
  { nombreUsuario: 'nico_bsas', avatar: 'https://i.pravatar.cc/150?img=33' },
  { nombreUsuario: 'cami.ilustra', avatar: 'https://i.pravatar.cc/150?img=44' },
  { nombreUsuario: 'the.cat.club', avatar: 'https://i.pravatar.cc/150?img=15', verificado: true },
  { nombreUsuario: 'agus.pereyra', avatar: 'https://i.pravatar.cc/150?img=52' },
];
