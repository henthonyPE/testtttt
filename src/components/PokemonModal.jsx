// Janela com os detalhes completos.
// Não precisa buscar nada na API: o objeto "pokemon" já veio completo da lista.
function PokemonModal({ pokemon, onFechar }) {
  return (
    // Clicar no fundo escuro fecha o modal
    <div className="fundo" onClick={onFechar}>
      {/* stopPropagation: clicar dentro da janela NÃO fecha */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="fechar" onClick={onFechar}>
          X
        </button>

        <h2>
          #{pokemon.id} {pokemon.name}
        </h2>

        <div className="sprites">
          <img src={pokemon.sprites.front_default} alt="frente" />
          <img src={pokemon.sprites.back_default} alt="costas" />
        </div>

        {/* A API manda altura em decímetros e peso em hectogramas */}
        <p>Altura: {pokemon.height / 10} m</p>
        <p>Peso: {pokemon.weight / 10} kg</p>

        <h4>Habilidades</h4>
        <ul>
          {pokemon.abilities.map((a) => (
            <li key={a.ability.name}>{a.ability.name}</li>
          ))}
        </ul>

        <h4>Estatísticas base</h4>
        <ul>
          {pokemon.stats.map((s) => (
            <li key={s.stat.name}>
              {s.stat.name}: {s.base_stat}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PokemonModal;
