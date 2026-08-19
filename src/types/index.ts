export type Usuario = {
  username: string;
  avatar: string;
};

export type Post = {
  id: string;
  usuario: Usuario;
  imagen: string;
  ubicacion: string;
  likes: number;
  caption: string;
};

export type Historia = {
  id: string;
  username: string;
  avatar: string;
};