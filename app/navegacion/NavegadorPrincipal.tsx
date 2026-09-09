import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NavegadorPestanas from './NavegadorPestanas';
import type { ParametrosStackPrincipal } from './tiposNavegacion';
import { colores } from '../constantes/colores';
import PantallaDetallePublicacion from '../pantallas/PantallaDetallePublicacion';
import PantallaEditarPerfil from '../pantallas/PantallaEditarPerfil';

const Stack = createNativeStackNavigator<ParametrosStackPrincipal>();

/**
 * Stack raíz de la aplicación.
 *
 * Debajo de todo están las pestañas; encima se apilan las pantallas que se
 * abren desde ellas. El detalle entra empujado desde la derecha (como en
 * Instagram) y "Editar perfil" se presenta como modal.
 */
export default function NavegadorPrincipal() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Stack.Screen name="Pestanas" component={NavegadorPestanas} />

      <Stack.Screen
        name="DetallePublicacion"
        component={PantallaDetallePublicacion}
        options={{ animation: 'slide_from_right' }}
      />

      <Stack.Screen
        name="EditarPerfil"
        component={PantallaEditarPerfil}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
