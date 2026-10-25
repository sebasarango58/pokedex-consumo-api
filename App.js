import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import {
  obtenerPokemonLista,
  obtenerPokemonDetalle,
} from './services/pokemonApi';

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [offset, setOffset] = useState(151);
const [cargandoMas, setCargandoMas] = useState(false);
const [hayMas, setHayMas] = useState(true);
const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
const [detallePokemon, setDetallePokemon] = useState(null);
const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    cargarPokemon();
  }, []);

  async function cargarPokemon() {
    try {
      setCargando(true);
      setError('');

      const datos = await obtenerPokemonLista(0, 150);

      const lista = datos.results.map((item) => {
        const id = Number(item.url.split('/').filter(Boolean).pop());

        return {
          id,
          nombre: item.name,
          imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });

      setPokemon(lista);
    } catch (e) {
      setError('No se pudieron cargar los Pokémon.');
    } finally {
      setCargando(false);
    }
  }
  async function cargarDetallePokemon(id) {
  try {
    setCargandoDetalle(true);
    setDetallePokemon(null);

    const datos = await obtenerPokemonDetalle(id);
    setDetallePokemon(datos);
  } catch (error) {
  setDetallePokemon(null);
  setError('No se pudieron cargar los detalles.');
} finally {
    setCargandoDetalle(false);
  }
}
  async function cargarMasPokemon() {
  if (cargandoMas || !hayMas || busqueda.trim() !== '') {
    return;
  }

  try {
    setCargandoMas(true);

    const datos = await obtenerPokemonLista(offset, 20);

    const nuevosPokemon = datos.results.map((item) => {
      const id = Number(item.url.split('/').filter(Boolean).pop());

      return {
        id,
        nombre: item.name,
        imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      };
    });

    setPokemon((actuales) => [...actuales, ...nuevosPokemon]);
    setOffset((actual) => actual + datos.results.length);
    setHayMas(datos.next !== null);
  } catch (e) {
    setError('No se pudieron cargar más Pokémon.');
  } finally {
    setCargandoMas(false);
  }
}
  const pokemonFiltrados = pokemon.filter((item) => {
  const texto = busqueda.trim().toLowerCase();

  return (
    item.nombre.toLowerCase().includes(texto) ||
    String(item.id).includes(texto)
  );
});

  function renderPokemon({ item }) {
    return (
  <View
    style={styles.tarjeta}
    onTouchEnd={() => {
  setPokemonSeleccionado(item);
  cargarDetallePokemon(item.id);
}}
  >
        <Image
          source={{ uri: item.imagen }}
          style={styles.imagen}
          resizeMode="contain"
        />
        <Text style={styles.numero}>
          N.º {String(item.id).padStart(3, '0')}
        </Text>
        <Text style={styles.nombre}>{item.nombre}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar style="dark" />
      {pokemonSeleccionado && (
  <View style={styles.detalle}>
    <Text style={styles.nombre}>
      {pokemonSeleccionado.nombre}
    </Text>

    <Text style={styles.numero}>
      N.º {String(pokemonSeleccionado.id).padStart(3, '0')}
    </Text>

    <Image
      source={{ uri: pokemonSeleccionado.imagen }}
      style={styles.imagenDetalle}
      resizeMode="contain"
    />
    {cargandoDetalle ? (
  <ActivityIndicator size="large" color="#e53935" />
) : detallePokemon ? (
  <>
    <Text style={styles.nombre}>
      Tipos: {detallePokemon.types.map((t) => t.type.name).join(', ')}
    </Text>

    <Text style={styles.numero}>
      Altura: {detallePokemon.height / 10} m
    </Text>

    <Text style={styles.numero}>
      Peso: {detallePokemon.weight / 10} kg
    </Text>
    {detallePokemon.stats.map((estadistica) => (
  <View key={estadistica.stat.name} style={{ width: '100%', marginTop: 10 }}>
    <Text>
      {estadistica.stat.name}: {estadistica.base_stat}
    </Text>

    <View
      style={{
        height: 10,
        backgroundColor: '#dddddd',
        borderRadius: 5,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: 10,
          width: `${(estadistica.base_stat / 255) * 100}%`,
          backgroundColor: '#e53935',
        }}
      />
    </View>
  </View>
))}
  </>
) : null}

    <Text
      style={styles.reintentar}
      onPress={() => setPokemonSeleccionado(null)}
    >
      Volver a la lista
    </Text>
  </View>
)}

   {!pokemonSeleccionado && (
  <>
    <Text style={styles.titulo}>Pokédex</Text>

    <TextInput
      style={styles.busqueda}
      placeholder="Buscar por nombre o número..."
      value={busqueda}
      onChangeText={setBusqueda}
      autoCapitalize="none"
    />

    {cargando ? (
      <ActivityIndicator size="large" color="#e53935" />
    ) : error ? (
      <View style={styles.mensaje}>
        <Text>{error}</Text>
        <Text onPress={cargarPokemon} style={styles.reintentar}>
          Reintentar
        </Text>
      </View>
    ) : pokemonFiltrados.length === 0 ? (
  <View style={styles.mensaje}>
    <Text>No se encontraron Pokémon.</Text>
  </View>
) : (
      <FlatList
        data={pokemonFiltrados}
        renderItem={renderPokemon}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.lista}
        onEndReached={cargarMasPokemon}
        onEndReachedThreshold={0.5}
      />
    )}
  </>
)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f4f5f7',
    paddingHorizontal: 12,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#d32f2f',
  },
  lista: {
    paddingBottom: 20,
  },
  tarjeta: {
    flex: 1,
    margin: 6,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  imagen: {
    width: 120,
    height: 120,
  },
  numero: {
    color: '#777777',
    marginTop: 5,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  mensaje: {
    alignItems: 'center',
    marginTop: 30,
    gap: 12,
  },
  reintentar: {
    color: '#d32f2f',
    fontWeight: 'bold',
    padding: 10,
  },
  detalle: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 20,
},
imagenDetalle: {
  width: 220,
  height: 220,
},
});