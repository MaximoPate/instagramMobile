import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { obtenerPublicaciones } from '../servicios/apiGatos';
import type { Publicacion } from '../tipos';

/**
 * Estado GLOBAL de la aplicación.
 *
 * El feed, la cuadrícula del perfil y el detalle muestran las mismas
 * publicaciones, así que si el "Me gusta" viviera en cada pantalla los
 * contadores quedarían desincronizados al volver atrás. Por eso la lista y
 * las interacciones se centralizan en este contexto y las pantallas sólo
 * consumen `usePublicaciones()`.
 */
type ValorContextoPublicaciones = {
  publicaciones: Publicacion[];
  cargando: boolean;
  error: string | null;
  /** Vuelve a pedir el feed (pull to refresh y botón de reintentar). */
  recargar: () => Promise<void>;
  /** Marca o desmarca "Me gusta" y ajusta el contador en el mismo paso. */
  alternarMeGusta: (idPublicacion: string) => void;
  /** Marca o desmarca la publicación como guardada. */
  alternarGuardada: (idPublicacion: string) => void;
  /** Busca una publicación por id; lo usa el detalle para leer siempre el dato vivo. */
  buscarPublicacion: (idPublicacion: string) => Publicacion | undefined;
};

const ContextoPublicaciones = createContext<ValorContextoPublicaciones | null>(null);

type Props = {
  children: ReactNode;
  /** Se ejecuta cuando termina la primera carga; App.tsx la usa para ocultar el splash. */
  alTerminarPrimeraCarga?: () => void;
};

export function ProveedorPublicaciones({ children, alTerminarPrimeraCarga }: Props) {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setError(null);

    try {
      setPublicaciones(await obtenerPublicaciones());
    } catch {
      setError('No pudimos cargar el feed. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  }, []);

  // Única petición automática de la app: se dispara al montar el proveedor.
  useEffect(() => {
    let montado = true;

    recargar().finally(() => {
      if (montado) alTerminarPrimeraCarga?.();
    });

    return () => {
      montado = false;
    };
  }, [recargar, alTerminarPrimeraCarga]);

  const alternarMeGusta = useCallback((idPublicacion: string) => {
    setPublicaciones((anteriores) =>
      anteriores.map((publicacion) =>
        publicacion.id === idPublicacion
          ? {
              ...publicacion,
              meGusta: !publicacion.meGusta,
              cantidadMeGusta: publicacion.cantidadMeGusta + (publicacion.meGusta ? -1 : 1),
            }
          : publicacion,
      ),
    );
  }, []);

  const alternarGuardada = useCallback((idPublicacion: string) => {
    setPublicaciones((anteriores) =>
      anteriores.map((publicacion) =>
        publicacion.id === idPublicacion
          ? { ...publicacion, guardada: !publicacion.guardada }
          : publicacion,
      ),
    );
  }, []);

  const buscarPublicacion = useCallback(
    (idPublicacion: string) => publicaciones.find(({ id }) => id === idPublicacion),
    [publicaciones],
  );

  const valor = useMemo(
    () => ({
      publicaciones,
      cargando,
      error,
      recargar,
      alternarMeGusta,
      alternarGuardada,
      buscarPublicacion,
    }),
    [publicaciones, cargando, error, recargar, alternarMeGusta, alternarGuardada, buscarPublicacion],
  );

  return <ContextoPublicaciones.Provider value={valor}>{children}</ContextoPublicaciones.Provider>;
}

/** Hook de acceso al estado global. Falla temprano si falta el proveedor. */
export function usePublicaciones() {
  const contexto = useContext(ContextoPublicaciones);

  if (!contexto) {
    throw new Error('usePublicaciones() debe usarse dentro de <ProveedorPublicaciones>.');
  }

  return contexto;
}
