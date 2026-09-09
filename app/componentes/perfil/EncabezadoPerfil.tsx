import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import BurbujaDestacada from './BurbujaDestacada';
import EstadisticaPerfil from './EstadisticaPerfil';
import Avatar from '../comunes/Avatar';
import BotonSecundario from '../comunes/BotonSecundario';
import { colores } from '../../constantes/colores';
import { medidas } from '../../constantes/medidas';
import type { PerfilUsuario } from '../../tipos';

type Props = {
  perfil: PerfilUsuario;
  /**
   * Cantidad real de publicaciones cargadas desde la API. Se pasa aparte
   * para que la métrica "Publicaciones" sea dinámica y no un número fijo.
   */
  cantidadPublicaciones: number;
  onEditarPerfil: () => void;
  onCompartirPerfil: () => void;
};

/**
 * Bloque superior del perfil: avatar y métricas, biografía, botones de
 * acción e historias destacadas. Se monta como `ListHeaderComponent` de la
 * cuadrícula para que todo scrollee junto en una sola FlatList.
 */
export default function EncabezadoPerfil({
  perfil,
  cantidadPublicaciones,
  onEditarPerfil,
  onCompartirPerfil,
}: Props) {
  return (
    <View style={estilos.contenedor}>
      <View style={estilos.filaSuperior}>
        <Avatar uri={perfil.avatar} tamano={medidas.avatarPerfil} anillo="degradado" />

        <View style={estilos.metricas}>
          <EstadisticaPerfil valor={cantidadPublicaciones} etiqueta="Publicaciones" />
          <EstadisticaPerfil valor={perfil.cantidadSeguidores} etiqueta="Seguidores" />
          <EstadisticaPerfil valor={perfil.cantidadSeguidos} etiqueta="Seguidos" />
        </View>
      </View>

      <View style={estilos.biografia}>
        <Text style={estilos.nombreCompleto}>{perfil.nombreCompleto}</Text>
        <Text style={estilos.categoria}>{perfil.categoria}</Text>
        <Text style={estilos.textoBiografia}>{perfil.biografia}</Text>

        <View style={estilos.filaEnlace}>
          <Ionicons name="link-outline" size={13} color={colores.textoPrincipal} />
          <Text style={estilos.enlace}>{perfil.enlace}</Text>
        </View>
      </View>

      <View style={estilos.filaBotones}>
        <BotonSecundario texto="Editar perfil" onPress={onEditarPerfil} estilo={estilos.botonAncho} />
        <BotonSecundario
          texto="Compartir perfil"
          onPress={onCompartirPerfil}
          estilo={estilos.botonAncho}
        />
        <View style={estilos.botonIcono}>
          <Ionicons name="person-add-outline" size={17} color={colores.textoPrincipal} />
        </View>
      </View>

      <FlatList
        data={perfil.destacadas}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(destacada) => destacada.id}
        contentContainerStyle={estilos.destacadas}
        ItemSeparatorComponent={() => <View style={estilos.separadorDestacadas} />}
        renderItem={({ item }) => <BurbujaDestacada destacada={item} />}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: colores.fondo,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: medidas.espaciadoMedio,
    paddingTop: 8,
  },
  metricas: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingLeft: 12,
  },
  biografia: {
    paddingHorizontal: medidas.espaciadoMedio,
    paddingTop: 12,
    gap: 1,
  },
  nombreCompleto: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoPrincipal,
  },
  categoria: {
    fontSize: 13,
    color: colores.textoSecundario,
  },
  textoBiografia: {
    fontSize: 13,
    color: colores.textoPrincipal,
    lineHeight: 18,
  },
  filaEnlace: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  enlace: {
    fontSize: 13,
    fontWeight: '600',
    color: colores.textoPrincipal,
  },
  filaBotones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: medidas.espaciadoMedio,
    paddingTop: 14,
  },
  botonAncho: {
    flex: 1,
  },
  botonIcono: {
    width: 32,
    height: 30,
    borderRadius: 8,
    backgroundColor: colores.botonSecundario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destacadas: {
    paddingHorizontal: medidas.espaciadoMedio,
    paddingTop: 18,
    paddingBottom: 14,
  },
  separadorDestacadas: {
    width: 14,
  },
});
