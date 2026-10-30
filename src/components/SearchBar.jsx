// Barra com a busca por nome e o filtro por tipo.
// Não guarda estado: tudo vem do App por props (componente "controlado").
function SearchBar({ busca, onBuscaChange, tipos, tipoSelecionado, onTipoChange }) {
  return (
    <div className="barra">
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={busca}
        onChange={(e) => onBuscaChange(e.target.value)}
      />

      <select value={tipoSelecionado} onChange={(e) => onTipoChange(e.target.value)}>
        <option value="">Todos os tipos</option>
        {tipos.map((tipo) => (
          <option key={tipo.name} value={tipo.name}>
            {tipo.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SearchBar;
