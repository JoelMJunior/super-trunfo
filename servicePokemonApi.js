const apiUrl = `https://pokeapi.co/api/v2/pokemon`;

async function getPokemon() {
    const pokemonList = [];

    for(let i=1; i <= 151; i++) {
        const response = await fetch(`${apiUrl}/${i}`);
        const pokemon = await response.json();
        pokemonList.push(pokemon);
    }
    const pokemonListMapped = pokemonList
    .map((poke) => {
        const { id, name, sprites, stats, weight } = poke;
        const image = sprites.front_default;
        const attribs = stats.filter(st => {
            return stats.indexOf(st) === 0 || stats.indexOf(st) === 1 || stats.indexOf(st) === 2 || stats.indexOf(st) === 5
        }).map(st => {
            return st.base_stat;
        });
        attribs.push(weight);
        return { id, name, image, attribs };
    });
    console.log(pokemonList);
    return pokemonListMapped;
}

export { getPokemon };
