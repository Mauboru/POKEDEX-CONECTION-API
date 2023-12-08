document.addEventListener('DOMContentLoaded', function () {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  const limitePokemons = 200;
  let offset = 0;
  let selectedPokemons = [];

  function getPokemons() {
    fetch(`${apiUrl}?limit=${limitePokemons}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        $('#pokemonContainer').empty();
        data.results.forEach(pokemon => {
          fetch(pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
              let card = `
                <div class="col-md-3 mb-3" data-id="${pokemonData.id}">
                  <div class="card">
                    <img src="${pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default}" class="card-img" alt="${pokemon.name}" style="width: ${'120px'}; height: ${'150px'};">
                    <div class="card-body">
                      <h5 class="card-title">${pokemon.name}</h5>
                      <p class="card-text"><strong>Tipo:</strong> ${getPokemonTipo(pokemonData.types)}</p>
                    </div>
                  </div>
                </div>
              `;
              $('#pokemonContainer').append(card);
            })
            .catch(error => {
              console.error('Erro ao obter detalhes do Pokémon:', error);
            });
        });
      })
      .catch(error => {
        console.error('Erro ao obter Pokémon:', error);
      });
  }

  // Adicionar configuração de todos os tipos
  function getPokemonTipo(types) {
    const tipo = types.map(type => type.type.name).join(', ');

    if (tipo.toLowerCase() === 'poison') {
      return `<span class="poison">${tipo}</span>`;
    }
    if (tipo.toLowerCase() === 'grass') {
      return `<span class="grass">${tipo}</span>`;
    }

    return tipo;
  }

  // Selecionando pokemons e guardando em um array
  $('#pokemonContainer').on('click', '.card', function (event) {
    event.stopPropagation();
    const pokemonId = $(this).data('id');
    const isSelected = selectedPokemons.includes(pokemonId);

    if (isSelected) {
      $(this).removeClass('card-selected');
      selectedPokemons = selectedPokemons.filter(id => id !== pokemonId);
    } else {
      $(this).addClass('card-selected');
      selectedPokemons.push(pokemonId);
    }

    $('.floating-btn').toggle(selectedPokemons.length > 0);
  });

  getPokemons();
});