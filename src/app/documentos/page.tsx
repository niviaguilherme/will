"use client";

import React, { useState } from "react";
import Card from "../components/dashboard/Card";
import {
  FaFileAlt,
  FaDownload,
  FaSearch,
  FaEye,
  FaPrint,
} from "react-icons/fa";

// Importação de dados
import documentosData from "../data/documentos.json";

interface Documento {
  id: number;
  nome: string;
  tipo: string;
  dataPublicacao: string;
  url: string;
}

export default function Documentos() {
  const [documentos] = useState<Documento[]>(documentosData);
  const [busca, setBusca] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("");

  // Obter tipos únicos de documentos para o filtro
  const tiposDocumentos = [
    "Todos",
    ...new Set(documentos.map((doc) => doc.tipo)),
  ];

  // Filtrar documentos com base na busca e no tipo selecionado
  const documentosFiltrados = documentos.filter((doc) => {
    const matchBusca = doc.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo =
      tipoSelecionado === "Todos" ||
      tipoSelecionado === "" ||
      doc.tipo === tipoSelecionado;
    return matchBusca && matchTipo;
  });

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaFileAlt className="text-[#2f47a2] mr-2" size={24} />
        <h1 className="text-2xl font-bold">Documentos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <Card title="Buscar Documentos">
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar documento..."
                  className="w-full border border-gray-300 rounded px-3 py-2 pl-9"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Filtrar por Tipo">
            <div className="p-4">
              <select
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Todos os tipos</option>
                {tiposDocumentos.map(
                  (tipo, index) =>
                    tipo !== "Todos" && (
                      <option key={index} value={tipo}>
                        {tipo}
                      </option>
                    )
                )}
              </select>
            </div>
          </Card>
        </div>
      </div>

      <Card title={`Documentos (${documentosFiltrados.length})`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {documentosFiltrados.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="bg-[#2f47a2] bg-opacity-10 p-2 rounded mr-3">
                  <FaFileAlt className="text-[#2f47a2]" />
                </div>
                <div>
                  <h3 className="font-medium">{doc.nome}</h3>
                  <span className="text-sm text-gray-500">{doc.tipo}</span>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                Publicado em: {formatarData(doc.dataPublicacao)}
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex items-center text-sm text-[#2f47a2]"
                  title="Visualizar"
                >
                  <FaEye className="mr-1" /> Ver
                </button>

                <button
                  className="flex items-center text-sm text-[#2f47a2]"
                  title="Baixar"
                >
                  <FaDownload className="mr-1" /> Baixar
                </button>

                <button
                  className="flex items-center text-sm text-[#2f47a2]"
                  title="Imprimir"
                >
                  <FaPrint className="mr-1" /> Imprimir
                </button>
              </div>
            </div>
          ))}

          {documentosFiltrados.length === 0 && (
            <div className="col-span-3 p-8 text-center text-gray-500">
              <FaFileAlt className="mx-auto mb-3 text-gray-300" size={32} />
              <p>Nenhum documento encontrado. Tente ajustar os filtros.</p>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6">
        <Card title="Documentos Recentes">
          <div className="p-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {documentos
                  .sort(
                    (a, b) =>
                      new Date(b.dataPublicacao).getTime() -
                      new Date(a.dataPublicacao).getTime()
                  )
                  .slice(0, 5)
                  .map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.nome}</td>
                      <td>{doc.tipo}</td>
                      <td>{formatarData(doc.dataPublicacao)}</td>
                      <td>
                        <button className="btn-primary text-xs py-1 px-2 flex items-center">
                          <FaDownload className="mr-1" size={12} /> Baixar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Função auxiliar para formatar data
function formatarData(dataStr: string): string {
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR");
}
