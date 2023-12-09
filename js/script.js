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
  verificarCardsSelecionados();
}

// Função para deselecionar os cards
function deselecionarCards() {
  const cardsSelecionados = document.querySelectorAll('.card-selected');
  cardsSelecionados.forEach(card => {
    card.classList.remove('card-selected');
  });
}

// Função para mostrar ou ocultar botão de criar pókedex
function verificarCardsSelecionados() {
  const floatingBtn = document.querySelector('.floating-btn');

  if (pokemonsSelecionados.length > 0) {
    floatingBtn.style.display = 'block';
  } else {
    floatingBtn.style.display = 'none';
  }
}

// Função que simula uma pókedex
function criarPokedex() {
  const pokedexNumber = getPokedexNumber(); // Obtém o número da pokedex atual
  const pokedexKey = `Pokedex-${pokedexNumber}`;
  
  if (pokemonsSelecionados.length > 0) {
    const selecionados = pokemonsSelecionados.map(pokemonId => {
      const pokemonCard = document.querySelector(`[data-id="${pokemonId}"]`);
      return pokemonCard.querySelector('.card-title').textContent;
    });

    // Salva os nomes dos Pokémon selecionados na variável Pokedex
    const pokedexAnterior = JSON.parse(localStorage.getItem(pokedexKey)) || [];
    const novosNomes = [...pokedexAnterior, ...selecionados];
    localStorage.setItem(pokedexKey, JSON.stringify(novosNomes));

    // Limpa os valores do localstorage dos selecionados
    localStorage.removeItem('selecionados');
    // Limpa a variável pokemonsSelecionados
    pokemonsSelecionados = [];

    deselecionarCards();
    location.reload();

    console.log(`Nomes dos Pokémon selecionados na Pokedex-${pokedexNumber}:`, novosNomes);
  } else {
    console.log('Nenhum Pokémon selecionado.');
  }
}

// Função para obter o número da pokedex atual
function getPokedexNumber() {
  const pokedexNumber = parseInt(localStorage.getItem('pokedexNumber')) || 1;
  localStorage.setItem('pokedexNumber', pokedexNumber + 1);
  return pokedexNumber;
}

// Função que retorna a cor para o tipo do pokemon
function getPokemonTipo(tipos) {
  const tiposMap = {
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

  const tiposFormatados = tipos.map(tipos => {
    const typeName = tipos.type.name.toLowerCase();
    const tipoFormatado = tiposMap[typeName] || typeName;
    return `<span class="${tipoFormatado}">${tipoFormatado}</span>`;
  });

  return tiposFormatados.join(' ');
}

// Função para carregar e exibir Pokedex
function carregarPokedex() {
  for (let i = 1; i <= localStorage.getItem('pokedexNumber'); i++) {
    const pokedexKey = `Pokedex-${i}`;
    const pokedexData = JSON.parse(localStorage.getItem(pokedexKey));

    if (pokedexData && pokedexData.length > 0) {
      const pokedexList = document.getElementById('pokedexList');

      // Cria um item de lista para cada Pokedex
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      listItem.textContent = `Pokedex-${i}: ${pokedexData.join(', ')}`;

      // Cria um botão de deletar para cada Pokedex
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
      deleteButton.textContent = 'Deletar';
      deleteButton.addEventListener('click', function () {
        deletarPokedex(pokedexKey);
      });

      // Adiciona o botão ao item da lista
      listItem.appendChild(deleteButton);

      // Adiciona o item da lista à lista de Pokedex
      pokedexList.appendChild(listItem);
    }
  }
}

// Função para deletar Pokedex
function deletarPokedex(pokedexKey) {
  localStorage.removeItem(pokedexKey);
  location.reload();
}

document.addEventListener('DOMContentLoaded', carregarPokedex);

document.addEventListener('DOMContentLoaded', function () {
  getPokemons();
  verificarCardsSelecionados();
});

document.querySelector('.floating-btn').addEventListener('click', function () {
  criarPokedex();
});