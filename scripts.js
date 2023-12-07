document.addEventListener('DOMContentLoaded', function () {
    loadPokemons();
});

function loadPokemons() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=5')
        .then(response => response.json())
        .then(data => {
            const pokemonContainer = document.getElementById('pokemonContainer');
            pokemonContainer.innerHTML = '';
            data.results.forEach(pokemon => {
                fetchPokemonDetails(pokemon.url)
                    .then(details => {
                        const card = createPokemonCard(details);
                        pokemonContainer.appendChild(card);
                    });
            });
        });
}

function fetchPokemonDetails(url) {
    return fetch(url)
        .then(response => response.json());
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.className = 'card mb-4';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = pokemon.name;

    const cardImg = document.createElement('img');
    cardImg.className = 'card-img-top';
    cardImg.src = pokemon.sprites.front_default;
    cardImg.alt = pokemon.name;

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = `Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}`;

    const captureButton = document.createElement('button');
    captureButton.className = 'btn btn-primary';
    captureButton.textContent = 'Capturar';
    captureButton.addEventListener('click', function () {
        capturePokemon(pokemon.name);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardImg);
    cardBody.appendChild(cardText);
    cardBody.appendChild(captureButton);
    card.appendChild(cardBody);

    return card;
}

function capturePokemon(pokemonName) {
    
}