const apiUrl = "https://pokeapi.co/api/v2/pokemon/"
const listPokemons = document.querySelector("#listPokemon");

const inputSearch = document.querySelector('#inputSearch');
const searchButton = document.querySelector('#searchButton');
const pokemonInfo = document.querySelector('#pokemonInfo');
let pokemonStats = null;

function handleRequestSearch(event) {
    /* Saneamiento de entrada: convertimos a minusculas */
    const pokemonName = inputSearch.value.toLowerCase();
    fetch(`${apiUrl}${pokemonName}`)
        .then(response => {
            console.log("Respuesta: ", response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayPokemon(data)
        })
        .catch(err => {
            console.error(err)
            showErrorMessage();
        });
}

function displayPokemon(pokemon) {
    pokemonInfo.innerHTML = `
        <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
        <img src="${pokemon.sprites.front_default}">
        <p>Peso: ${pokemon.weight} lbs</p>
        <p>Altura: ${pokemon.height} In</p>
        <h3>Habilidades</h3>
        <ul>
        ${pokemon.abilities
            .map(element => `<li>${capitalizeFirstLetter(element.ability.name)}</li>`)
            .join("")
        }
        </ul>
        <h3>Movimientos</h3>
        <ul>
        ${pokemon.moves
            .slice(0, 5)
            .map(element => `<li>${capitalizeFirstLetter(element.move.name)}</li>`)
            .join("")
        }
        </ul>
    `
    const arrayStats = pokemon.stats.map(element => element.base_stat);
    /* Mockup data */
    const data = {
        labels: [
            'HP',
            'ATTACK',
            'DEFENSE',
            'SPECIAL-ATTACK',
            'SPECIAL-DEFENSE',
            'SPEED',
        ],
        datasets: [{
            label: pokemon?.name ?? "", /* Debe ser dinámico */
            data: [...arrayStats], /* Debe ser dinámico */
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#FFFFFF',
            pointHoverBackgroundColor: '#FFFFFF',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };

    /* Config  */
    const config = {
        type: 'radar',
        data: data,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };
    if (pokemonStats) {
        pokemonStats.destroy();
    }
    pokemonStats = new Chart(document.querySelector('#graphic'), config, data)
}

const showErrorMessage = () => pokemonInfo.innerHTML = `<p>No se encontró información para el Pokémon ingresado. Intente nuevamente.</p>`

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

searchButton.addEventListener('click', handleRequestSearch)

for (let i = 1; i <= 151; i++) {
    fetch(apiUrl + i)
        .then((response) => response.json())
        .then(data => mostrarPokemons(data))
}

function mostrarPokemons(pokemon) {
    const div = document.createElement('button');
    div.classList.add("pokemon");
    div.innerHTML = `
    <div class="d-flex flex-column align-self-center" id="contenidoPokemon">
        <p id="idPokemon">#${pokemon.id}</p>
        <p id="nombrePokemon">${pokemon.name}</p>
        <div id="imagenPokemon">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <div id="informacionPokemon">
            <p id="tipoPokemon1">Electrico</p>
            <p id="tipoPokemon2">Pelea</p>
        </div>
        <div id="estadisticasPokemon">
            <p id="alturaPokemon">${pokemon.height}m</p>
            <p id="pesoPokemon">${pokemon.weight}kg</p>
        </div>
    </div>
    `;
    listPokemons.append(div);
}