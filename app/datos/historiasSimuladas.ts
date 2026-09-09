import type { Historia } from '../tipos';
import { perfilPropio } from './perfilPropio';

/**
 * Burbujas del carrusel superior del feed. La primera siempre es la del
 * usuario logueado ("Tu historia"), que se dibuja con el botón "+".
 */
export const historiasSimuladas: Historia[] = [
  {
    id: 'propia',
    nombreUsuario: 'Tu historia',
    avatar: perfilPropio.avatar,
    sinVer: false,
    esPropia: true,
  },
  { id: 'h1', nombreUsuario: 'gato_lover', avatar: 'https://i.pravatar.cc/150?img=1', sinVer: true },
  { id: 'h2', nombreUsuario: 'michi.diario', avatar: 'https://i.pravatar.cc/150?img=5', sinVer: true },
  { id: 'h3', nombreUsuario: 'juanita.ok', avatar: 'https://i.pravatar.cc/150?img=7', sinVer: true },
  { id: 'h4', nombreUsuario: 'carlos.dev', avatar: 'https://i.pravatar.cc/150?img=8', sinVer: true },
  { id: 'h5', nombreUsuario: 'sol.rodriguez', avatar: 'https://i.pravatar.cc/150?img=20', sinVer: false },
  { id: 'h6', nombreUsuario: 'lu.vet', avatar: 'https://i.pravatar.cc/150?img=25', sinVer: true },
  { id: 'h7', nombreUsuario: 'nico_bsas', avatar: 'https://i.pravatar.cc/150?img=33', sinVer: false },
  { id: 'h8', nombreUsuario: 'cami.ilustra', avatar: 'https://i.pravatar.cc/150?img=44', sinVer: true },
];
