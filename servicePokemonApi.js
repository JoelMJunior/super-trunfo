const apiUrl = `https://pokeapi.co/api/v2/pokemon`;

async function getPokemon(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const pokemon = await response.json();

    return pokemon;
}

export { getPokemon };
