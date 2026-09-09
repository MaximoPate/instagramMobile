# Documentación técnica — Clon móvil de Instagram

## 1. Árbol de directorios de `app/`

```
app/
├── componentes/
│   ├── comunes/
│   │   ├── Avatar.tsx
│   │   ├── BotonSecundario.tsx
│   │   ├── EncabezadoSimple.tsx
│   │   ├── FilaNotificacion.tsx
│   │   ├── LogoInstagram.tsx
│   │   └── MiniaturaCuadricula.tsx
│   ├── inicio/
│   │   ├── BarraAcciones.tsx
│   │   ├── BurbujaHistoria.tsx
│   │   ├── CarruselHistorias.tsx
│   │   ├── EncabezadoInicio.tsx
│   │   ├── EncabezadoPublicacion.tsx
│   │   ├── PiePublicacion.tsx
│   │   └── TarjetaPublicacion.tsx
│   ├── perfil/
│   │   ├── BurbujaDestacada.tsx
│   │   ├── EncabezadoPerfil.tsx
│   │   ├── EstadisticaPerfil.tsx
│   │   └── SelectorPestanasPerfil.tsx
│   └── detalle/
│       └── FilaComentario.tsx
├── constantes/
│   ├── colores.ts
│   └── medidas.ts
├── contexto/
│   └── ContextoPublicaciones.tsx
├── datos/
│   ├── historiasSimuladas.ts
│   ├── notificacionesSimuladas.ts
│   ├── perfilPropio.ts
│   ├── reelsSimulados.ts
│   ├── textosSimulados.ts
│   └── usuariosSimulados.ts
├── navegacion/
│   ├── NavegadorPrincipal.tsx
│   ├── NavegadorPestanas.tsx
│   └── tiposNavegacion.ts
├── pantallas/
│   ├── PantallaInicio.tsx
│   ├── PantallaBuscar.tsx
│   ├── PantallaReels.tsx
│   ├── PantallaNotificaciones.tsx
│   ├── PantallaPerfil.tsx
│   ├── PantallaDetallePublicacion.tsx
│   └── PantallaEditarPerfil.tsx
├── servicios/
│   └── apiGatos.ts
├── tipos/
│   └── index.ts
└── utilidades/
    └── formato.ts
```

**Criterio de la separación:** `componentes/` son piezas *tontas* que reciben todo por props y avisan hacia arriba con callbacks. `pantallas/` son los contenedores: leen el estado (global o local), arman los handlers y se los pasan a los componentes.

---

## 2. Componentes atómicos y herencia de datos por props

### Comunes

| Componente | Props que recibe | Para qué existe |
|---|---|---|
| `Avatar` | `uri`, `tamano`, `anillo?`, `estilo?` | Foto de perfil circular. `anillo` decide si dibuja el borde degradado de historias, el borde gris de "visto" o ninguno. Se reutiliza en feed, historias, comentarios, notificaciones, reels y perfil. |
| `BotonSecundario` | `texto`, `onPress?`, `destacado?`, `estilo?` | Botón gris redondeado de Instagram. Con `destacado` pasa a azul (acción primaria). Evita repetir el mismo estilo en cada pantalla. |
| `EncabezadoSimple` | `titulo`, `onVolver?`, `accionDerecha?` | Barra superior de pantallas internas, con los laterales del mismo ancho para centrar el título. |
| `MiniaturaCuadricula` | `uri`, `lado`, `onPress?`, `esCarrusel?`, `esReel?` | Celda cuadrada de las grillas. Recibe el `lado` por props (calculado según el ancho real de pantalla), así el mismo componente sirve para la grilla de Buscar y la del perfil. |
| `FilaNotificacion` | `notificacion`, `siguiendo`, `onAlternarSeguir` | Renglón de actividad. Según `notificacion.tipo` cierra con la miniatura del posteo o con el botón "Seguir"/"Siguiendo". |
| `LogoInstagram` | `tamano?`, `color?` | Isologotipo tipográfico reutilizado en headers. |

### Feed

| Componente | Props que recibe | Para qué existe |
|---|---|---|
| `EncabezadoInicio` | `notificacionesSinLeer?`, `onAbrirNotificaciones`, `onAbrirMensajes` | Barra superior del feed: logo + notificaciones + mensajes. |
| `CarruselHistorias` | `historias: Historia[]` | Lista horizontal de historias (`FlatList horizontal`, no `.map()`). |
| `BurbujaHistoria` | `historia`, `onPress?` | Una burbuja de historia; decide sola qué anillo dibujar y si mostrar el botón "+" según `historia.esPropia`. |
| `TarjetaPublicacion` | `publicacion`, `onAbrirDetalle`, `onMeGusta`, `onGuardar` | Ítem que renderiza la `FlatList` del feed. No guarda estado propio: compone las piezas de la tarjeta y avisa hacia arriba qué se tocó. |
| `EncabezadoPublicacion` | `autor`, `ubicacion`, `onAbrirOpciones?` | Avatar + usuario + ubicación simulada + menú de opciones. |
| `BarraAcciones` | `meGusta`, `guardada`, `onMeGusta`, `onComentar`, `onCompartir`, `onGuardar` | Barra de acciones. Componente controlado: recibe estado, emite eventos, no decide nada por sí solo (por eso se reutiliza igual en el detalle). |
| `PiePublicacion` | `publicacion`, `mostrarEnlaceComentarios?`, `onVerComentarios?` | Contador de likes, caption con el usuario en negrita, etiquetas y antigüedad. |

### Perfil y detalle

| Componente | Props que recibe | Para qué existe |
|---|---|---|
| `EncabezadoPerfil` | `perfil`, `cantidadPublicaciones`, `onEditarPerfil`, `onCompartirPerfil` | Bloque superior del perfil. `cantidadPublicaciones` llega por prop separado para que sea dinámico según lo que devolvió la API, no un número fijo. |
| `EstadisticaPerfil` | `valor`, `etiqueta` | Una métrica (Publicaciones/Seguidores/Seguidos); se instancia tres veces con props distintas. |
| `BurbujaDestacada` | `destacada`, `onPress?` | Historia destacada del perfil. |
| `SelectorPestanasPerfil` | `activa`, `onCambiar` | Tira de solapas (cuadrícula/reels/etiquetadas) con el subrayado en la activa. |
| `FilaComentario` | `comentario`, `meGusta`, `onMeGusta` | Renglón de comentario con su like. Controlado: el estado de qué comentarios tienen like vive en la pantalla, no en el componente. |

---

## 3. Estados: global vs. local

### Global — `ContextoPublicaciones` (único estado global de la app)

| Hook | Qué guarda |
|---|---|
| `useState<Publicacion[]>` | Lista de publicaciones traída de la API |
| `useState<boolean>` | `cargando` |
| `useState<string \| null>` | `error` |
| `useEffect` | Dispara la petición a la API una sola vez, al montar el proveedor |
| `useCallback` | `recargar`, `alternarMeGusta`, `alternarGuardada`, `buscarPublicacion` |

**Por qué es global:** el feed, la grilla del perfil, Buscar y el detalle muestran las mismas publicaciones. Si el "Me gusta" viviera en cada pantalla por separado, los contadores quedarían desincronizados al navegar entre ellas.

### Local — por pantalla

| Pantalla | Estado local (`useState`) |
|---|---|
| `PantallaInicio` | `refrescando` (pull to refresh) |
| `PantallaBuscar` | `busqueda` (texto tipeado) |
| `PantallaPerfil` | `pestanaActiva` (qué solapa se mira) |
| `PantallaDetallePublicacion` | `comentariosConMeGusta`, `comentarioNuevo`, `comentariosPropios` |
| `PantallaReels` | `altoDisponible`, `reelsConMeGusta` |
| `PantallaNotificaciones` | `cuentasSeguidas` |
| `PantallaEditarPerfil` | `valores` del formulario |
| `App.tsx` | `feedListo` (coordina cuándo ocultar el SplashScreen) |

---

## 4. Referencia visual

**Figma:** [Instagram Web UI Recreated](https://www.figma.com/es-es/comunidad/file/1235135369163092252/instagram-web-ui-recreated)

> ⚠️ Este Figma es de la versión *web* de Instagram, no mobile. Se usó como referencia de paleta y proporciones; el layout de pantallas (tabs, cabeceras, grilla) se adaptó a los patrones estándar de la app mobile oficial porque el archivo no tiene esas vistas.
