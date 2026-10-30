import PokemonCard from "./PokemonCard";

// Recebe a lista e desenha um card para cada Pokémon.
function PokemonList({ pokemons, onSelecionar }) {
  return (
    <div className="lista">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id} // "key" ajuda o React a identificar cada item
          pokemon={pokemon}
          onClick={() => onSelecionar(pokemon)}
        />
      ))}
    </div>
  );
}

export default PokemonList;
