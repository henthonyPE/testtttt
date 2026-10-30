import { useState, useEffect } from "react";
import { API, buscarJson } from "./api";
import SearchBar from "./components/SearchBar";
import PokemonList from "./components/PokemonList";
import PokemonModal from "./components/PokemonModal";
import "./App.css";

const POR_PAGINA = 20; // quantos Pokémon aparecem por página

function App() {
  // ---------- ESTADOS ----------
  const [pokemons, setPokemons] = useState([]); // Pokémon da página atual (com detalhes)
  const [tipos, setTipos] = useState([]); // lista de tipos para o <select>
  const [tipoSelecionado, setTipoSelecionado] = useState(""); // "" = todos
  const [pagina, setPagina] = useState(0); // página atual (começa em 0)
  const [total, setTotal] = useState(0); // total de Pokémon da lista atual
  const [busca, setBusca] = useState(""); // texto digitado na busca
  const [selecionado, setSelecionado] = useState(null); // Pokémon aberto no modal
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // ---------- EFEITO 1: buscar os tipos (roda só uma vez) ----------
  useEffect(() => {
    buscarJson(`${API}/type`)
      .then((dados) => setTipos(dados.results))
      .catch(() => setErro("Não foi possível carregar os tipos."));
  }, []); // [] = executa apenas quando o componente aparece pela 1ª vez

  // ---------- EFEITO 2: buscar os Pokémon ----------
  // Roda de novo sempre que a página ou o tipo mudar.
  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");

      try {
        const offset = pagina * POR_PAGINA;
        let lista; // itens com { name, url }

        if (tipoSelecionado === "") {
          // Sem filtro: a própria API pagina com limit e offset
          const dados = await buscarJson(
            `${API}/pokemon?limit=${POR_PAGINA}&offset=${offset}`
          );
          lista = dados.results;
          setTotal(dados.count);
        } else {
          // Com filtro: a API devolve TODOS os Pokémon do tipo de uma vez,
          // então nós mesmos "cortamos" a página com slice
          const dados = await buscarJson(`${API}/type/${tipoSelecionado}`);
          const todos = dados.pokemon.map((item) => item.pokemon);
          lista = todos.slice(offset, offset + POR_PAGINA);
          setTotal(todos.length);
        }

        // A lista só traz nome e url. Para ter imagem, tipos e status,
        // fazemos uma requisição extra para cada Pokémon (todas ao mesmo tempo).
        const detalhes = await Promise.all(
          lista.map((item) => buscarJson(item.url))
        );
        setPokemons(detalhes);
      } catch (e) {
        console.log(e);
        setErro("Erro ao carregar os Pokémon. Verifique sua conexão e tente de novo.");
      } finally {
        setCarregando(false); // roda com sucesso ou com erro
      }
    }

    carregar();
  }, [pagina, tipoSelecionado]);

  // ---------- FUNÇÕES DE EVENTO ----------
  function mudarTipo(novoTipo) {
    setTipoSelecionado(novoTipo);
    setPagina(0); // volta para a primeira página
    setBusca("");
  }

  // ---------- BUSCA POR NOME (client-side) ----------
  // Não chama a API: só filtra o que já está na tela.
  const pokemonsFiltrados = pokemons.filter((p) =>
    p.name.includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="app">
      <h1>Pokédex</h1>

      <SearchBar
        busca={busca}
        onBuscaChange={setBusca}
        tipos={tipos}
        tipoSelecionado={tipoSelecionado}
        onTipoChange={mudarTipo}
      />

      {/* Informa quantos Pokémon existem no tipo escolhido */}
      {tipoSelecionado !== "" && (
        <p className="info">
          Tipo <strong>{tipoSelecionado}</strong>: {total} Pokémon{" "}
          <button onClick={() => mudarTipo("")}>Ver todos</button>
        </p>
      )}

      {carregando && <p className="mensagem">Carregando...</p>}
      {erro && <p className="mensagem erro">{erro}</p>}

      {!carregando && !erro && (
        <>
          {pokemonsFiltrados.length === 0 ? (
            <p className="mensagem">Nenhum Pokémon encontrado.</p>
          ) : (
            <PokemonList pokemons={pokemonsFiltrados} onSelecionar={setSelecionado} />
          )}

          <div className="paginacao">
            <button disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}>
              Anterior
            </button>
            <span>
              Página {pagina + 1} de {totalPaginas}
            </span>
            <button
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}

      {/* O modal só aparece quando há um Pokémon selecionado */}
      {selecionado && (
        <PokemonModal pokemon={selecionado} onFechar={() => setSelecionado(null)} />
      )}
    </div>
  );
}

export default App;
