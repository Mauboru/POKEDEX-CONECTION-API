const limitePokemons = 52;
const random = Math.floor(Math.random() * 1240) + 1;
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

// Função que irá criar os cards da forma certa
function criarCardPokemon(data) {
  // Criando o card
  const card = document.createElement('div');
  card.classList.add('col-md-3', 'mb-2', 'card');
  card.setAttribute('data-id', data.id);

  // Estrutura do card
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Imagem do card
  const img = document.createElement('img');
  img.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
  img.classList.add('card-img');
  img.style.height = '165px';

  // Titulo (nome do pokemon)
  const titulo = document.createElement('h5');
  titulo.classList.add('card-title');
  titulo.textContent = data.name;

  // Tipo de pokemon
  const tipo = document.createElement('p');
  tipo.classList.add('card-text');
  tipo.innerHTML = `${getPokemonTipo(data.types)}`;

  cardBody.appendChild(img);
  cardBody.appendChild(titulo);
  cardBody.appendChild(tipo);
  card.appendChild(cardBody);

  card.addEventListener('click', function () {
    selecionarCard(this);
  });

  return card;
}

// Função que permite a seleção dos cards
function selecionarCard(card) {
  const pokemonId = card.dataset.id;
  const isSelected = pokemonsSelecionados.includes(pokemonId);

  if (isSelected) {
    card.classList.remove('card-selected');
    pokemonsSelecionados = pokemonsSelecionados.filter(id => id !== pokemonId);
  } else {
    card.classList.add('card-selected');
    pokemonsSelecionados.push(pokemonId);
  }
}

document.querySelector('.floating-btn').addEventListener('click', function (data) {
  if (pokemonsSelecionados.length > 0) {
    const pokemonNames = data.name;
    console.log(pokemonNames)
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