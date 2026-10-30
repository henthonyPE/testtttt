// Funções que conversam com a PokéAPI.
// Ficam num arquivo separado para os componentes não ficarem cheios de fetch.

export const API = "https://pokeapi.co/api/v2";

// Faz um GET e devolve o JSON.
// Se o servidor responder com erro (ex.: 404 ou 500), lança um erro
// para o "catch" de quem chamou tratar.
export async function buscarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Erro na requisição: " + resposta.status);
  }
  return resposta.json();
}
