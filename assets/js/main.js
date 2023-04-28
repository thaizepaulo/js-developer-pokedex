const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="pesquisarPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number.toString().padStart(3,'0')}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

const pesquisarPokemon = async (id) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(url)
    const pokeDetail = await res.json()
    mostrarDetalhes(pokeDetail)
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.species = pokeDetail.species.name
    pokemon.height = pokeDetail.height/10;
    pokemon.weight = pokeDetail.weight/10;

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    pokemon.abilities = abilities.join(', ');


    return pokemon
    
}

const mostrarDetalhes = (pokeDetail) =>{

    const pokemon = convertPokeApiDetailToPokemon(pokeDetail)
   
    const htmlString = `
   
    <div id="popup">
        <div class="pokemonDetail ${pokemon.type}">
            <div class="botoes">
                <button class="botaoRetornar" onClick="fecharPopup()">
                    <i class="material-icons" style="color:white">arrow_back</i>
                </button>
                <i class="fa fa-heart" style="font-size:24px;color:white"></i>
            </div>

            <div class="geral">
                <div class="dadosPrincipais">
                    <span class="nome">${pokemon.name}</span>
                    <ol class="tipos">
                        ${pokemon.types.map((type) =>`<li class="tipo ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
                <span class="numero">#${pokemon.number.toString().padStart(3,"0")}</span>
            </div>

            <div class="div-imagem">
                <img class="imagem" src="${pokemon.photo}" alt="${pokemon.name}">
            </div>

            <div class="informacoes">
                <h4>Sobre</h4>
                <table>
                    <tr>
                        <td class="campo">Espécie</td>
                        <td class="descricao">${pokemon.species}</td>
                    </tr>
                    <tr>
                        <td class="campo">Altura</td>
                        <td class="descricao">${pokemon.height}cm</td>
                    </tr>
                    <tr>
                        <td class="campo">Peso</td>
                        <td class="descricao">${pokemon.weight}kg</td>
                    </tr>
                    <tr>
                        <td class="campo">Habilidades</td>
                        <td class="descricao">${pokemon.abilities}</td>
                    </tr>
                </table>
            </div>

        </div>
    </div>
    `
   
    pokemonList.innerHTML = htmlString + pokemonList.innerHTML
}

const fecharPopup = () =>{
    const popup = document.getElementById('popup')
    popup.parentElement.removeChild(popup)
}