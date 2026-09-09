import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from '../componentes/comunes/Avatar';
import EncabezadoSimple from '../componentes/comunes/EncabezadoSimple';
import { colores } from '../constantes/colores';
import { medidas } from '../constantes/medidas';
import { perfilPropio } from '../datos/perfilPropio';
import type { PropsPantallaStack } from '../navegacion/tiposNavegacion';

/** Campos editables del formulario, con su etiqueta y su valor inicial. */
const CAMPOS = [
  { clave: 'nombreCompleto', etiqueta: 'Nombre', valorInicial: perfilPropio.nombreCompleto },
  { clave: 'nombreUsuario', etiqueta: 'Nombre de usuario', valorInicial: perfilPropio.nombreUsuario },
  { clave: 'enlace', etiqueta: 'Sitio web', valorInicial: perfilPropio.enlace },
  { clave: 'biografia', etiqueta: 'Presentación', valorInicial: perfilPropio.biografia },
] as const;

/**
 * Pantalla modal de edición de perfil.
 *
 * Se abre desde el botón "Editar perfil" y demuestra el otro modo de
 * presentación del Stack Navigator (`presentation: 'modal'`), además del
 * push lateral que usa el detalle de la publicación.
 */
export default function PantallaEditarPerfil({ navigation }: PropsPantallaStack<'EditarPerfil'>) {
  // Estado LOCAL del formulario: se descarta al cerrar el modal, porque el
  // perfil emulado no se persiste en ningún lado.
  const [valores, setValores] = useState<Record<string, string>>(() =>
    Object.fromEntries(CAMPOS.map(({ clave, valorInicial }) => [clave, valorInicial])),
  );

  const actualizar = (clave: string, valor: string) =>
    setValores((anteriores) => ({ ...anteriores, [clave]: valor }));

  return (
    <SafeAreaView style={estilos.contenedor} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <EncabezadoSimple
        titulo="Editar perfil"
        onVolver={navigation.goBack}
        accionDerecha={
          <Pressable onPress={navigation.goBack} hitSlop={10} accessibilityRole="button">
            <Text style={estilos.botonListo}>Listo</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={estilos.cuerpo} keyboardShouldPersistTaps="handled">
        <View style={estilos.bloqueAvatar}>
          <Avatar uri={perfilPropio.avatar} tamano={92} />
          <Text style={estilos.enlaceFoto}>Editar foto o avatar</Text>
        </View>

        {CAMPOS.map(({ clave, etiqueta }) => (
          <View key={clave} style={estilos.campo}>
            <Text style={estilos.etiqueta}>{etiqueta}</Text>
            <TextInput
              value={valores[clave]}
              onChangeText={(texto) => actualizar(clave, texto)}
              style={estilos.entrada}
              multiline={clave === 'biografia'}
              placeholderTextColor={colores.textoDeshabilitado}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  botonListo: {
    fontSize: 15,
    fontWeight: '600',
    color: colores.azulAccion,
  },
  cuerpo: {
    paddingHorizontal: medidas.espaciadoMedio,
    paddingBottom: 32,
  },
  bloqueAvatar: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  enlaceFoto: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.azulAccion,
  },
  campo: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colores.borde,
  },
  etiqueta: {
    fontSize: 12,
    color: colores.textoSecundario,
    marginBottom: 4,
  },
  entrada: {
    fontSize: 15,
    color: colores.textoPrincipal,
    padding: 0,
    minHeight: 22,
  },
});
