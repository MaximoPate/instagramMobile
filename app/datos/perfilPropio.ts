import type { PerfilUsuario } from '../tipos';

/**
 * Perfil emulado del usuario activo. La consigna no pide registro ni login
 * real, así que los datos personales son fijos; las publicaciones de la
 * cuadrícula sí salen de la API y se leen desde el contexto global.
 */
export const perfilPropio: PerfilUsuario = {
  nombreUsuario: 'feli.feldman',
  nombreCompleto: 'Felipe Feldman',
  avatar: 'https://i.pravatar.cc/300?img=68',
  categoria: 'Fotografía digital',
  biografia: 'Junto michis de todo el país 🐈\nEstudiante de Ing. en Sistemas · Buenos Aires',
  enlace: 'linktr.ee/feli.feldman',
  cantidadPublicaciones: 128,
  cantidadSeguidores: 4312,
  cantidadSeguidos: 389,
  // Las portadas salen de Cataas: cada URL lleva un parámetro distinto para
  // que el servicio devuelva una imagen diferente por historia destacada.
  destacadas: [
    { id: 'd1', titulo: 'Michis', portada: 'https://cataas.com/cat?width=200&height=200&d=1' },
    { id: 'd2', titulo: 'Viajes', portada: 'https://cataas.com/cat?width=200&height=200&d=2' },
    { id: 'd3', titulo: 'Refugio', portada: 'https://cataas.com/cat?width=200&height=200&d=3' },
    { id: 'd4', titulo: '2025', portada: 'https://cataas.com/cat?width=200&height=200&d=4' },
  ],
};
