import axios from 'axios';
import type { Post } from '../types';

const catApi = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
});

const ubicacionesFake = [
  'Buenos Aires, Argentina', 'Córdoba, Argentina', 'Mendoza, Argentina',
  'Rosario, Argentina', 'Bariloche, Argentina', 'Salta, Argentina',
  'Mar del Plata, Argentina', 'La Plata, Argentina', 'Ushuaia, Argentina',
  'Neuquén, Argentina', 'Villa Alsina, Argentina'
];

export const getPosts = async (): Promise<Post[]> => {
  const response = await catApi.get('/images/search', {
    params: { limit: 10, has_breeds: 1 },
  });

  return response.data.map((cat: any, index: number) => ({
    id: cat.id,
    usuario: {
      username: `usuario_${index}`,
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
    },
    imagen: cat.url,
    ubicacion: ubicacionesFake[index % ubicacionesFake.length],
    likes: Math.floor(Math.random() * 900) + 100,
    caption: cat.breeds?.[0]?.description ?? '🐱',
  }));
};