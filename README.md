# Clon móvil de Instagram — React Native + Expo

Trabajo práctico de migración del TP anterior (Instagram Web en React) hacia **React Native** sobre el ecosistema de **Expo SDK 54**. La app replica la interfaz de la aplicación móvil de Instagram y consume imágenes en tiempo real desde **The Cat API** para simular los posteos del feed.

| | |
|---|---|
| **SDK** | Expo `~54.0.35` (React Native `0.81.5`, React `19.1.0`) |
| **Navegación** | React Navigation v7 (Native Stack + Bottom Tabs) |
| **HTTP** | Axios |
| **API de imágenes** | [The Cat API](https://thecatapi.com) (feed) y [Cataas](https://cataas.com) (destacadas y reels) |
| **Lenguaje** | TypeScript en modo `strict` |

---

## 1. Cómo levantar el proyecto

```bash
npm install
npx expo start
```

Después se abre con la app **Expo Go** escaneando el QR, o con `a` / `i` para lanzar el emulador de Android / iOS.

Scripts disponibles:

| Script | Qué hace |
|---|---|
| `npm start` | Levanta el bundler de Expo |
| `npm run android` / `npm run ios` | Compila y abre en el emulador |
| `npm run lint` | ESLint con la config de Expo |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run generar-iconos` | Regenera el icono, el splash y el favicon (ver §7) |

---

## 2. Árbol de directorios de `app/`

Toda la aplicación vive dentro de `app/`. `App.tsx` en la raíz es el único archivo fuera: es el punto de entrada que monta los proveedores globales.

```
app/
├── componentes/            → Piezas de UI reutilizables (nunca piden datos por su cuenta)
│   ├── comunes/            → Átomos compartidos por más de una pantalla
│   │   ├── Avatar.tsx
│   │   ├── BotonSecundario.tsx
│   │   ├── EncabezadoSimple.tsx
│   │   ├── FilaNotificacion.tsx
│   │   ├── LogoInstagram.tsx
│   │   └── MiniaturaCuadricula.tsx
│   ├── inicio/             → Piezas propias del feed
│   │   ├── BarraAcciones.tsx
│   │   ├── BurbujaHistoria.tsx
│   │   ├── CarruselHistorias.tsx
│   │   ├── EncabezadoInicio.tsx
│   │   ├── EncabezadoPublicacion.tsx
│   │   ├── PiePublicacion.tsx
│   │   └── TarjetaPublicacion.tsx
│   ├── perfil/             → Piezas propias del perfil
│   │   ├── BurbujaDestacada.tsx
│   │   ├── EncabezadoPerfil.tsx
│   │   ├── EstadisticaPerfil.tsx
│   │   └── SelectorPestanasPerfil.tsx
│   └── detalle/
│       └── FilaComentario.tsx
├── constantes/             → Sistema de diseño (sin "números mágicos" sueltos)
│   ├── colores.ts          → Paleta oficial + degradado de historias
│   └── medidas.ts          → Espaciados, tamaños, tipografías y cálculo de la grilla
├── contexto/
│   └── ContextoPublicaciones.tsx   → ÚNICO estado global de la app
├── datos/                  → Contenido simulado (lo que la API no devuelve)
│   ├── historiasSimuladas.ts
│   ├── notificacionesSimuladas.ts
│   ├── perfilPropio.ts
│   ├── reelsSimulados.ts
│   ├── textosSimulados.ts
│   └── usuariosSimulados.ts
├── navegacion/
│   ├── NavegadorPrincipal.tsx      → Stack raíz
│   ├── NavegadorPestanas.tsx       → Bottom Tabs
│   └── tiposNavegacion.ts          → Params tipados de cada ruta
├── pantallas/
│   ├── PantallaInicio.tsx
│   ├── PantallaBuscar.tsx
│   ├── PantallaReels.tsx
│   ├── PantallaNotificaciones.tsx
│   ├── PantallaPerfil.tsx
│   ├── PantallaDetallePublicacion.tsx
│   └── PantallaEditarPerfil.tsx
├── servicios/
│   └── apiGatos.ts         → Cliente Axios + mapeo de la respuesta al modelo
├── tipos/
│   └── index.ts            → Modelos de dominio (Publicacion, Usuario, Comentario…)
└── utilidades/
    └── formato.ts          → Helpers de presentación de números y etiquetas
```

**Criterio de la separación:** los archivos de `componentes/` son *tontos* — reciben todo por props y avisan hacia arriba con callbacks. Los de `pantallas/` son los *contenedores*: leen el estado global, arman los handlers y se los pasan a los componentes. Así cualquier componente se puede reutilizar en otra pantalla sin arrastrar dependencias.

---

## 3. Arquitectura de navegación

```
NavigationContainer
└── NavegadorPrincipal (Native Stack)
    ├── "Pestanas" ─────────► NavegadorPestanas (Bottom Tabs)
    │                          ├── Inicio
    │                          ├── Buscar
    │                          ├── Reels
    │                          ├── Notificaciones
    │                          └── Perfil
    ├── "DetallePublicacion" (push lateral)   ← params: { idPublicacion }
    └── "EditarPerfil"       (presentación modal)
```

- **Stack raíz** (`NavegadorPrincipal.tsx`): debajo de todo están las pestañas; encima se apilan las pantallas que se abren desde ellas. El detalle entra empujado desde la derecha (`animation: 'slide_from_right'`) y "Editar perfil" se presenta como **modal** (`presentation: 'modal'`), cubriendo las dos formas de presentación que pide la consigna.
- **Tabs** (`NavegadorPestanas.tsx`): las 5 pestañas de Instagram. Los headers propios de React Navigation están apagados porque cada pantalla dibuja su propia cabecera (el feed usa el isologotipo, no un título de texto).
- **Params tipados** (`tiposNavegacion.ts`): se declaran `ParametrosStackPrincipal` y `ParametrosPestanas`, y se extiende el tipo global `ReactNavigation.RootParamList`. Gracias a eso TypeScript verifica cada `navigate()` y `route.params` llega ya tipado a la pantalla destino.

### Paso de parámetros al detalle

Desde el feed y desde la cuadrícula del perfil:

```tsx
navegacion.navigate('DetallePublicacion', { idPublicacion: item.id });
```

Y en el destino:

```tsx
const { idPublicacion } = route.params;
const publicacion = buscarPublicacion(idPublicacion);   // se lee del contexto global
```

> **Por qué se manda sólo el `id` y no el objeto entero:** si se enviara una copia del posteo, el "Me gusta" que el usuario toca en el detalle quedaría aislado en esa copia y al volver atrás el feed mostraría el contador viejo. Mandando el id, el detalle siempre lee el dato **vivo** del contexto y las tres vistas quedan sincronizadas.

---

## 4. Componentes atómicos y herencia de datos por props

### 4.1 Comunes

| Componente | Props que recibe | Para qué existe |
|---|---|---|
| **`Avatar`** | `uri`, `tamano`, `anillo?`, `estilo?` | Foto de perfil circular. El prop `anillo` (`'ninguno' \| 'degradado' \| 'visto'`) decide si dibuja el borde con degradado de historias, el borde gris o nada. Es el átomo más reutilizado: aparece en el feed, historias, comentarios, notificaciones, reels y perfil. |
| **`BotonSecundario`** | `texto`, `onPress?`, `destacado?`, `estilo?` | Botón gris redondeado de Instagram. Con `destacado` pasa a azul (acción primaria). Evita repetir el mismo `StyleSheet` en cada pantalla. |
| **`EncabezadoSimple`** | `titulo`, `onVolver?`, `accionDerecha?` | Barra superior de las pantallas internas. Los dos laterales tienen el mismo ancho mínimo para que el título quede ópticamente centrado aunque de un lado no haya ícono. |
| **`MiniaturaCuadricula`** | `uri`, `lado`, `onPress?`, `esCarrusel?`, `esReel?` | Celda cuadrada de las grillas. Recibe el **lado por props** (calculado con `ladoCeldaCuadricula()`), así el mismo componente sirve para la grilla de Buscar y para la del perfil. |
| **`FilaNotificacion`** | `notificacion`, `siguiendo`, `onAlternarSeguir` | Renglón de actividad. Según `notificacion.tipo` cierra con la miniatura del posteo o con el botón "Seguir"/"Siguiendo". |
| **`LogoInstagram`** | `tamano?`, `color?` | Isologotipo tipográfico. Usa **Grand Hotel** (Google Fonts, OFL), la fuente libre más parecida a la Billabong original. |

### 4.2 Feed

| Componente | Props que recibe | Para qué existe |
|---|---|---|
| **`EncabezadoInicio`** | `notificacionesSinLeer?`, `onAbrirNotificaciones`, `onAbrirMensajes` | Barra superior del feed: logo + corazón (con globito de conteo) + avión. |
| **`CarruselHistorias`** | `historias: Historia[]` | Lista horizontal de historias. También usa `FlatList` (con `horizontal`) en vez de un ScrollView con `.map()`. |
| **`BurbujaHistoria`** | `historia`, `onPress?` | Una burbuja. Recibe la historia completa y decide sola qué anillo dibujar y si mostrar el botón "+" (`historia.esPropia`). |
| **`TarjetaPublicacion`** | `publicacion`, `onAbrirDetalle`, `onMeGusta`, `onGuardar` | **Ítem que renderiza la FlatList del feed.** Es 100% controlado: no guarda estado propio, sólo compone las tres piezas de la tarjeta y avisa hacia arriba qué botón se tocó. Va envuelto en `memo()` para que al cambiar un like sólo se redibuje esa tarjeta y no la lista entera. |
| **`EncabezadoPublicacion`** | `autor`, `ubicacion`, `onAbrirOpciones?` | Avatar + usuario (con tilde de verificado) + localización simulada + los tres puntitos. |
| **`BarraAcciones`** | `meGusta`, `guardada`, `onMeGusta`, `onComentar`, `onCompartir`, `onGuardar` | Barra interactiva. **Componente controlado**: recibe el estado actual y emite eventos; no decide nada por sí mismo. Por eso se puede reutilizar tal cual en el detalle. |
| **`PiePublicacion`** | `publicacion`, `mostrarEnlaceComentarios?`, `onVerComentarios?` | Contador de "Me gusta", descripción con el usuario en negrita, etiquetas y antigüedad. En el detalle se le pasa `mostrarEnlaceComentarios={false}` porque ahí los comentarios ya se ven completos. |

### 4.3 Perfil y detalle

| Componente | Props que recibe | Para qué existe |
|---|---|---|
| **`EncabezadoPerfil`** | `perfil`, `cantidadPublicaciones`, `onEditarPerfil`, `onCompartirPerfil` | Bloque superior del perfil. La métrica "Publicaciones" llega **por prop separado** para que sea dinámica (cuenta las que devolvió la API) en vez de un número fijo. |
| **`EstadisticaPerfil`** | `valor`, `etiqueta` | Una métrica. Se instancia tres veces con distintas props en lugar de repetir el markup. |
| **`BurbujaDestacada`** | `destacada`, `onPress?` | Historia destacada: portada circular con borde gris y título. |
| **`SelectorPestanasPerfil`** | `activa`, `onCambiar` | Tira de solapas (cuadrícula / reels / etiquetadas) con el subrayado negro en la activa. |
| **`FilaComentario`** | `comentario`, `meGusta`, `onMeGusta` | Renglón de comentario con su corazoncito. También controlado: el estado de qué comentarios tienen like vive en la pantalla de detalle. |

---

## 5. Estados: qué es global y qué es local

### 5.1 Estado GLOBAL — `ContextoPublicaciones`

Es el **único** estado global de la app. Vive en `app/contexto/ContextoPublicaciones.tsx` y se expone con el hook `usePublicaciones()`.

| Hook usado | Qué guarda / hace |
|---|---|
| `useState<Publicacion[]>` | La lista de publicaciones traída de la API |
| `useState<boolean>` | `cargando` — si la primera petición sigue en curso |
| `useState<string \| null>` | `error` — mensaje si la petición falló |
| `useEffect` | Dispara **la única petición automática de la app** al montar el proveedor |
| `useCallback` | `recargar`, `alternarMeGusta`, `alternarGuardada`, `buscarPublicacion` — con referencias estables para no romper el `memo()` de las tarjetas |
| `useMemo` | Arma el objeto `value` del provider una sola vez por cambio real |

**Por qué es global:** el feed, la cuadrícula del perfil, la pestaña Buscar y el detalle muestran **las mismas publicaciones**. Si el "Me gusta" viviera en cada pantalla, los contadores quedarían desincronizados al navegar. Centralizándolo, tocar el corazón en cualquier lado se refleja en todos.

`alternarMeGusta` cambia el booleano y ajusta el contador en la misma operación inmutable:

```ts
publicacion.id === idPublicacion
  ? {
      ...publicacion,
      meGusta: !publicacion.meGusta,
      cantidadMeGusta: publicacion.cantidadMeGusta + (publicacion.meGusta ? -1 : 1),
    }
  : publicacion
```

### 5.2 Estado LOCAL — por pantalla

| Pantalla | Estado local (`useState`) | Por qué no es global |
|---|---|---|
| `PantallaInicio` | `refrescando` | Sólo dura lo que dura el gesto de *pull to refresh* |
| `PantallaBuscar` | `busqueda` (texto tipeado) | No le sirve a ninguna otra pantalla. El filtrado se envuelve en `useMemo` para no recorrer la lista en cada re-render |
| `PantallaPerfil` | `pestanaActiva` | Qué solapa del portafolio se está mirando; se resetea al salir y no afecta a nadie más |
| `PantallaDetallePublicacion` | `comentariosConMeGusta`, `comentarioNuevo`, `comentariosPropios` | Interacciones de la sesión de lectura; no se persisten |
| `PantallaReels` | `altoDisponible`, `reelsConMeGusta` | Medición del contenedor y likes de reels, exclusivos de esa vista |
| `PantallaNotificaciones` | `cuentasSeguidas` | A qué cuentas de la lista se apretó "Seguir" |
| `PantallaEditarPerfil` | `valores` (formulario) | El perfil emulado no se persiste; se descarta al cerrar el modal |
| `App.tsx` | `feedListo` + `useFonts` | Coordinan cuándo ocultar el SplashScreen |

---

## 6. Consumo de la API

`app/servicios/apiGatos.ts`:

1. **Instancia de Axios** reutilizable con `baseURL` y `timeout` centralizados.
2. Se piden **12 imágenes** (`CANTIDAD_PUBLICACIONES`, por encima del mínimo de 10 que pide la consigna) a `GET /images/search`.
3. `mapearAPublicacion()` convierte la respuesta cruda en el modelo `Publicacion`: le agrega autor, ubicación, descripción, etiquetas, antigüedad y comentarios, porque The Cat API sólo devuelve la foto.
4. La simulación es **determinística**: en vez de `Math.random()` se usa un hash del `id` que devuelve la API como semilla (`semillaDesde()`). Así los "Me gusta" y la ubicación de un posteo son siempre los mismos y no cambian en cada re-render.
5. La `relacionAspecto` se calcula con el `width`/`height` reales que manda la API y se acota entre `0.8` y `1.91`, igual que hace Instagram, para que ninguna foto muy alargada rompa la altura de la tarjeta.

La petición se dispara **una sola vez**, dentro del `useEffect` de `ProveedorPublicaciones`, al renderizar la app por primera vez.

### Rendimiento: FlatList, nunca `.map()`

Ninguna lista de la app se arma con `.map()` dentro de un `ScrollView`. Todas usan `FlatList`:

| Lista | Configuración |
|---|---|
| Feed | `initialNumToRender={3}`, `maxToRenderPerBatch={4}`, `windowSize={7}`, `removeClippedSubviews` |
| Historias | `horizontal` |
| Buscar y Perfil | `numColumns={3}` |
| Reels | `pagingEnabled` + `snapToInterval` |
| Comentarios y Notificaciones | listas verticales simples |

En el perfil, el bloque de datos y las solapas van como `ListHeaderComponent` de la propia grilla: así se evita anidar una lista dentro de un ScrollView (que rompe el reciclado de vistas) y el scroll queda continuo entre la biografía y el portafolio.

**Grilla exacta de 3 columnas:** `ladoCeldaCuadricula(3)` en `constantes/medidas.ts` calcula el lado descontando las separaciones internas del ancho real de pantalla, de modo que las tres columnas queden simétricas y no haya desbordamiento horizontal:

```ts
export function ladoCeldaCuadricula(columnas: number, separacion = medidas.separacionCuadricula) {
  return (anchoPantalla - separacion * (columnas - 1)) / columnas;
}
```

---

## 7. Identidad del sistema

### SplashScreen

- Configurado con el plugin **`expo-splash-screen`** en `app.json` (`image`, `imageWidth: 180`, `resizeMode: contain`, fondo blanco y variante oscura).
- En `App.tsx` se llama a `SplashScreen.preventAutoHideAsync()` y recién se oculta con `hideAsync()` cuando **la tipografía del logo y la primera respuesta de la API ya están listas**, así el usuario nunca ve una pantalla en blanco entre el splash y el feed.

### Icono de la app

Configurado en `app.json` (`icon` para iOS/genérico y `android.adaptiveIcon` con capas de frente, fondo y monocroma para Android).

Los PNG **se generan por código** con `npm run generar-iconos` (`herramientas/generarIconos.js`): el script dibuja el isotipo de la cámara calculando la distancia de cada píxel a un rectángulo redondeado, un círculo y un punto — eso le da el antialiasing — pinta el degradado oficial en diagonal y escribe el PNG a mano con `zlib`, sin ninguna dependencia externa.

### StatusBar

Se estiliza **por pantalla** con `expo-status-bar`, buscando siempre contraste con la cabecera:

- `style="dark"` en Inicio, Buscar, Perfil, Notificaciones, Detalle y Editar perfil (cabeceras blancas).
- `style="light"` en Reels, que es la única pantalla con fondo negro.

### SafeAreaView

`App.tsx` monta `SafeAreaProvider`, y **cada pantalla** se envuelve en `SafeAreaView` de `react-native-safe-area-context` con `edges={['top', 'left', 'right']}`. El borde inferior se deja libre a propósito, porque de esa zona ya se ocupa la barra de pestañas. Así ningún elemento colisiona con el notch, la isla dinámica ni la barra de gestos.

---

## 8. Referencia visual

> ⚠️ **Completar antes de la entrega:** pegar acá el enlace al archivo de Figma usado como guía.
>
> **Figma:** `<pegar link acá>`

Capturas de referencia utilizadas durante el desarrollo (guardarlas en `docs/referencias/` y enlazarlas):

| Vista | Captura |
|---|---|
| Feed | `docs/referencias/feed.png` |
| Perfil | `docs/referencias/perfil.png` |

Decisiones de fidelidad visual tomadas a partir de esa referencia:

- Paleta exacta en `constantes/colores.ts`: fondo `#FFFFFF`, texto secundario `#737373`, bordes `#DBDBDB`, botón gris `#EFEFEF`, azul de acción `#0095F6`, rojo del like `#FF3040`.
- Padding horizontal de contenido de **12 px**, cabeceras de **44 px** de alto y barra de pestañas de **52 px**.
- Anillo de historias con el degradado oficial (`#FDCB5C → #F76C1C → #DA1B60 → #A63EBB`) resuelto con `expo-linear-gradient`.
- Separación de **1.5 px** entre celdas de la grilla, como en el portafolio del perfil.
- El globo de comentario y el ícono de carrusel de Ionicons vienen espejados respecto a los de Instagram: se corrigen con `transform: [{ scaleX: -1 }]`.

---

## 9. Checklist de la consigna

| Requisito | Dónde se cumple |
|---|---|
| Proyecto inicializado con Expo CLI | Expo SDK 54, `npx expo start` |
| Navegación con React Navigation | `app/navegacion/` (Stack + Tabs) |
| Detalle por Stack o modal con params | `DetallePublicacion` (push) y `EditarPerfil` (modal) |
| Organización modular de navegadores | Navegadores, tipos y pantallas en archivos separados |
| SplashScreen propia | `app.json` + control manual en `App.tsx` |
| Icono nativo configurado | `app.json` (`icon` + `adaptiveIcon`) |
| StatusBar estilizada | `expo-status-bar` por pantalla |
| SafeAreaView en cada vista | Todas las pantallas de `app/pantallas/` |
| Petición con Axios dentro de `useEffect` | `ProveedorPublicaciones` + `apiGatos.ts` |
| Mínimo 10 elementos mapeados | `CANTIDAD_PUBLICACIONES = 12` |
| Feed con FlatList (prohibido `.map()`) | `PantallaInicio` |
| Ítem modular con props | `TarjetaPublicacion` |
| Avatar, usuario, ubicación, imagen, acciones, contador, caption | `EncabezadoPublicacion`, `BarraAcciones`, `PiePublicacion` |
| Detalle con imagen HD, comentarios, etiquetas y like funcional | `PantallaDetallePublicacion` |
| Perfil con avatar, bio, métricas y botón de editar | `EncabezadoPerfil` |
| Cuadrícula con `numColumns={3}` | `PantallaPerfil` y `PantallaBuscar` |
| README técnico | Este archivo |

---

## 10. Créditos

- Imágenes: [The Cat API](https://thecatapi.com) y [Cataas](https://cataas.com).
- Avatares: [Pravatar](https://pravatar.cc).
- Tipografía del logo: [Grand Hotel](https://fonts.google.com/specimen/Grand+Hotel) (SIL Open Font License).
- Iconografía: [Ionicons](https://ionic.io/ionicons) vía `@expo/vector-icons`.
