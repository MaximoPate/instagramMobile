import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FUENTE_LOGO } from './app/componentes/comunes/LogoInstagram';
import { ProveedorPublicaciones } from './app/contexto/ContextoPublicaciones';
import NavegadorPrincipal from './app/navegacion/NavegadorPrincipal';

// Se le pide al sistema que NO oculte el splash automáticamente: lo cerramos
// nosotros recién cuando la tipografía del logo y el primer feed están listos,
// así el usuario nunca ve una pantalla en blanco.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 400, fade: true });

export default function App() {
  const [fuentesListas] = useFonts({
    [FUENTE_LOGO]: require('./assets/fuentes/GrandHotel-Regular.ttf'),
  });

  // Estado GLOBAL de arranque: marca si ya terminó la primera petición a la API.
  const [feedListo, setFeedListo] = useState(false);

  const marcarFeedListo = useCallback(() => setFeedListo(true), []);

  useEffect(() => {
    if (fuentesListas && feedListo) {
      SplashScreen.hideAsync();
    }
  }, [fuentesListas, feedListo]);

  return (
    // SafeAreaProvider habilita los insets que después consume el
    // SafeAreaView de cada pantalla (notch, isla dinámica, barra de gestos).
    <SafeAreaProvider>
      <ProveedorPublicaciones alTerminarPrimeraCarga={marcarFeedListo}>
        <NavigationContainer>
          <NavegadorPrincipal />
        </NavigationContainer>
      </ProveedorPublicaciones>
    </SafeAreaProvider>
  );
}
