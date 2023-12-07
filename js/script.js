$(document).ready(function () {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  const limit = 200;
  let offset = 0;
  let selectedPokemons = [];

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

  function createPokemonCard(pokemonData) {
    return `
      <div class="col-md-3 mb-3">
        <div class="card">
          <img src="${pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default}" class="card-img" alt="${pokemonData.name}" style="width: ${'120px'}; height: ${'150px'};">
          <div class="card-body">
            <h5 class="card-title">${pokemonData.name}</h5>
            <p class="card-text"><strong>Tipo:</strong> ${getPokemonTipo(pokemonData.types)}</p>
            <button class="btn btn-primary add-to-pokedex" data-name="${pokemonData.name}">Adicionar à Pokédex</button>
          </div>
        </div>
      </div>
    `;
  }

  function createPokedex() {
    const pokedexName = 'Pokédex-001'; // Nome padrão
    console.log(`Pokédex criada: ${pokedexName}`);
    console.log('Pokémons selecionados:', selectedPokemons);
  }

  function updateSelectedPokemonContainer() {
    $('#selectedPokemonContainer').empty();
    selectedPokemons.forEach(pokemon => {
      let card = createPokemonCard(pokemon);
      $('#selectedPokemonContainer').append(card);
    });
  }

  $(document).on('click', '.add-to-pokedex', function () {
    const pokemonName = $(this).data('name');
    const pokemon = selectedPokemons.find(p => p.name === pokemonName);

    if (!pokemon) {
      selectedPokemons.push({
        name: pokemonName,
        types: $(this).closest('.card-body').find('.card-text span').text()
      });
      updateSelectedPokemonContainer();
    }
  });

  $('#createPokedexBtn').click(function () {
    createPokedex();
  });

  getPokemons();
});