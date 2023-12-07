$(document).ready(function () {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  const limit = 200;
  let offset = 0;

  function getPokemons() {
    $.get({
      url: `${apiUrl}?limit=${limit}&offset=${offset}`,
      success: function (data) {
        $('#pokemonContainer').empty();
        data.results.forEach(function (pokemon) {
          $.get({
            url: pokemon.url,
            success: function (pokemonData) {
              let card = `
                <div class="col-md-3 mb-3">
                  <div class="card">
                    <img src="${pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default}" class="card-img" alt="${pokemon.name}" style="width: ${'120px'}; height: ${'150px'};">
                    <div class="card-body">
                      <h5 class="card-title">${pokemon.name}</h5>
                      <p class="card-text"><strong>Tipo:</strong> ${getPokemonTipo(pokemonData.types)}</p>
                      <a href="#" class="btn btn-primary">Capturar</a>
                    </div>
                  </div>
                </div>
              `;
              $('#pokemonContainer').append(card);
            },
            error: function (error) {
              console.error('Erro ao obter detalhes do Pokémon:', error);
            }
          });
        });
      },
      error: function (error) {
        console.error('Erro ao obter Pokémon:', error);
      },
    });
  }

  function getPokemonTipo(types) {
    const tipo = types.map(type => type.type.name).join(', ');

    if (tipo.toLowerCase() === 'poison') {
      return `<span class="poison">${tipo}</span>`;
    }

    return tipo;
  }

  getPokemons();
});