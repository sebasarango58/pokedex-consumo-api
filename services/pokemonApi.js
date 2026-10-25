const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export async function obtenerPokemonLista(offset = 0, limite = 20) {
  const respuesta = await fetch(
    `${API_URL}?offset=${offset}&limit=${limite}`
  );

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar la lista de Pokémon.');
  }

  return await respuesta.json();
}

export async function obtenerPokemonDetalle(id) {
  const respuesta = await fetch(`${API_URL}/${id}`);

  if (!respuesta.ok) {
    throw new Error('No se pudo cargar el Pokémon.');
  }

  return await respuesta.json();
}