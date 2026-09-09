import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import type { ParametrosPestanas } from './tiposNavegacion';
import { colores } from '../constantes/colores';
import { medidas } from '../constantes/medidas';
import { perfilPropio } from '../datos/perfilPropio';
import PantallaBuscar from '../pantallas/PantallaBuscar';
import PantallaInicio from '../pantallas/PantallaInicio';
import PantallaNotificaciones from '../pantallas/PantallaNotificaciones';
import PantallaPerfil from '../pantallas/PantallaPerfil';
import PantallaReels from '../pantallas/PantallaReels';

const Pestanas = createBottomTabNavigator<ParametrosPestanas>();

/**
 * Barra inferior de 5 pestañas de Instagram.
 *
 * Los encabezados propios de React Navigation se apagan porque cada pantalla
 * dibuja su propia cabecera (el feed usa el isologotipo, no un título).
 * Los íconos se pasan rellenos cuando la pestaña está activa, igual que en
 * la app oficial.
 */
export default function NavegadorPestanas() {
  return (
    <Pestanas.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colores.textoPrincipal,
        tabBarInactiveTintColor: colores.textoPrincipal,
        tabBarStyle: estilos.barra,
        // El área segura la maneja cada pantalla con SafeAreaView.
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Pestanas.Screen
        name="Inicio"
        component={PantallaInicio}
        options={{
          tabBarAccessibilityLabel: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={medidas.iconoPestana} color={color} />
          ),
        }}
      />

      <Pestanas.Screen
        name="Buscar"
        component={PantallaBuscar}
        options={{
          tabBarAccessibilityLabel: 'Buscar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={medidas.iconoPestana}
              color={color}
            />
          ),
        }}
      />

      <Pestanas.Screen
        name="Reels"
        component={PantallaReels}
        options={{
          tabBarAccessibilityLabel: 'Reels',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'play-circle' : 'play-circle-outline'}
              size={medidas.iconoPestana + 2}
              color={color}
            />
          ),
        }}
      />

      <Pestanas.Screen
        name="Notificaciones"
        component={PantallaNotificaciones}
        options={{
          tabBarAccessibilityLabel: 'Notificaciones',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={medidas.iconoPestana + 1}
              color={color}
            />
          ),
        }}
      />

      <Pestanas.Screen
        name="Perfil"
        component={PantallaPerfil}
        options={{
          tabBarAccessibilityLabel: 'Perfil',
          // La última pestaña muestra la foto del usuario, no un ícono.
          tabBarIcon: ({ focused }) => (
            <View style={[estilos.avatarPestana, focused && estilos.avatarPestanaActivo]}>
              <Image source={{ uri: perfilPropio.avatar }} style={estilos.avatarImagen} contentFit="cover" />
            </View>
          ),
        }}
      />
    </Pestanas.Navigator>
  );
}

const estilos = StyleSheet.create({
  barra: {
    height: medidas.altoBarraPestanas,
    backgroundColor: colores.fondo,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
  },
  avatarPestana: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  avatarPestanaActivo: {
    borderColor: colores.textoPrincipal,
  },
  avatarImagen: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
});
