# Pokédex con React Native y Expo

## Descripción
Aplicación móvil que consulta la PokéAPI para mostrar Pokémon,
permitir búsquedas y consultar sus características.

## Tecnologías
- React Native
- Expo
- JavaScript
- PokéAPI
- Fetch y async/await
- useState y useEffect
- FlatList

## Archivos principales

### App.js
Contiene la interfaz de la aplicación, la lista de Pokémon,
el buscador, la selección y la visualización de detalles,
incluyendo tipos, altura, peso y estadísticas.

### services/pokemonApi.js
Contiene las funciones que consultan la PokéAPI:
- obtenerPokemonLista(): consulta una lista de Pokémon.
- obtenerPokemonDetalle(): obtiene los datos de un Pokémon.

## Funcionalidades
- Lista de Pokémon en dos columnas.
- Búsqueda por nombre o número.
- Carga progresiva al desplazarse.
- Detalles del Pokémon seleccionado.
- Tipos, altura y peso.
- Seis estadísticas con barras visuales.
- Mensaje cuando no hay resultados.
- Manejo básico de errores.

## Ejecución
1. Instalar dependencias con `npm install`.
2. Iniciar Expo con `npx expo start`.
3. Escanear el código QR desde Expo Go.