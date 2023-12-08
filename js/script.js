const limitePokemons = 100;
const random = Math.floor(Math.random() * 918) + 1;
let pokemonsSelecionados = [];

// Função que irá pegar as informações dos pókemons na API
async function getPokemons() {
  try {
    const response = await fetch(`${'https://pokeapi.co/api/v2/pokemon'}?limit=${limitePokemons}&offset=${random}`);
    const data = await response.json();

    for (const pokemon of data.results) {
      try {
        const pokemonData = await fetch(pokemon.url).then(response => response.json());
        const card = criarCardPokemon(pokemonData);

        $('#pokemonContainer').append(card);
      } catch (error) {
        console.error('Erro ao obter detalhes do Pokémon:', error);
      }
    }
  } catch (error) {
    console.error('Erro ao obter Pokémon:', error);
  }
}

function criarCardPokemon(pokemonData) {
  const card = document.createElement('div');
  card.classList.add('col-md-3', 'mb-2', 'card');
  card.setAttribute('data-id', pokemonData.id);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const img = document.createElement('img');
  img.src = pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default;
  img.alt = pokemonData.name;
  img.classList.add('card-img');
  img.style.height = '160px';

  const title = document.createElement('h5');
  title.classList.add('card-title');
  title.textContent = pokemonData.name;

  const type = document.createElement('p');
  type.classList.add('card-text');
  type.innerHTML = `${getPokemonTipo(pokemonData.types)}`;

  cardBody.appendChild(img);
  cardBody.appendChild(title);
  cardBody.appendChild(type);

  card.appendChild(cardBody);

  card.addEventListener('click', function () {
    toggleCardSelection(this);
  });

  return card;
}

function toggleCardSelection(card) {
  const pokemonId = card.dataset.id;
  const isSelected = pokemonsSelecionados.includes(pokemonId);

  if (isSelected) {
    card.classList.remove('card-selected');
    pokemonsSelecionados = pokemonsSelecionados.filter(id => id !== pokemonId);
  } else {
    card.classList.add('card-selected');
    pokemonsSelecionados.push(pokemonId);
  }

  document.querySelector('.floating-btn').style.display = pokemonsSelecionados.length > 0 ? 'block' : 'none';
}

document.querySelector('.floating-btn').addEventListener('click', function (data) {
  if (pokemonsSelecionados.length > 0) {
    const pokemonNames = pokemonsSelecionados.name;

    alert('Seus Pokémon são: ' + pokemonNames);
  }
});

function getPokemonTipo(types) {
  const typeMappings = {
    'poison': 'poison',
    'grass': 'grass',
    'fire': 'fire',
    'water': 'water',
    'electric': 'electric',
    'ground': 'ground',
    'rock': 'rock',
    'fighting': 'fighting',
    'ice': 'ice',
    'flying': 'flying',
    'bug': 'bug',
    'ghost': 'ghost',
    'steel': 'steel',
    'normal': 'normal',
    'fairy': 'fairy',
    'psychic': 'psychic',
    'dragon': 'dragon',
    'dark': 'dark',

  };

  const formattedTypes = types.map(type => {
    const typeName = type.type.name.toLowerCase();
    const formattedType = typeMappings[typeName] || typeName;
    return `<span class="${formattedType}">${formattedType}</span>`;
  });

  return formattedTypes.join(', ');
}

getPokemons();