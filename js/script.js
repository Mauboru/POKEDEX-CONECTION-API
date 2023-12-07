const pokemonName = document.querySelector('.nome');
const pokemonTipo = document.querySelector('.tipo');
const pokemonTipo2 = document.querySelector('.tipo2');
const pokemonNumber = document.querySelector('.numero');
const pokemonImagem = document.querySelector('.imagem');
const form = document.querySelector('.form');
const input = document.querySelector('.buscar');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const mostrarPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Carregando...';
  pokemonNumber.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImagem.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonTipo.innerHTML = data['types']['0']['type']['name'];
    pokemonTipo2.innerHTML = data['types']['1']['type']['name'];
    pokemonImagem.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImagem.style.display = 'none';
    pokemonName.innerHTML = 'Nenhum pókemon encontrado!';
    pokemonNumber.innerHTML = '';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  mostrarPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon -= 1;
    mostrarPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon += 1;
  mostrarPokemon(searchPokemon);
});

mostrarPokemon(searchPokemon);