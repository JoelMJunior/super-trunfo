const apiUrl = `https://pokeapi.co/api/v2/pokemon`;

async function getPokemon(list) {
    const pokemonList = [];
    
    for(let i=0; i < list.length; i++) {
        const response = await fetch(`${apiUrl}/${list[i]}`);
        const pokemon = await response.json();
        pokemonList.push(pokemon);
    }
    const pokemonListMapped = pokemonList.map((poke) => {
        const { id, name, height, sprites, stats, weight } = poke;
        const image = sprites.front_default;
        const attribs = stats.filter(st => {
            return stats.indexOf(st) === 1 || stats.indexOf(st) === 2 || stats.indexOf(st) === 5
        }).map(st => {
            return st.base_stat;
        });
        attribs.push(height/10, weight/10);
        return { id, name, image, attribs };
    }); 
    return pokemonListMapped;
}

export { getPokemon };
