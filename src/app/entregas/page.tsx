"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/dashboard/Card";
import {
  FaClipboardCheck,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaDownload,
} from "react-icons/fa";

// Importação de dados
import entregasData from "../data/entregas.json";
import funcionariosData from "../data/funcionarios.json";
import casData from "../data/cas.json";

interface EntregaConcluida {
  id: number;
  funcionarioId: number;
  caId: number;
  dataEntrega: string;
  status: string;
  funcionarioNome: string;
  caTipo: string;
  caModelo: string;
}

export default function Entregas() {
  const [entregasConcluidas, setEntregasConcluidas] = useState<
    EntregaConcluida[]
  >([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroProduto, setFiltroProduto] = useState("");

  useEffect(() => {
    // Filtrar entregas concluídas e adicionar informações de funcionário e CA
    const concluidas = entregasData
      .filter(
        (entrega) =>
          entrega.status === "Entregue" && entrega.dataEntrega !== null
      )
      .map((entrega) => {
        const funcionario = funcionariosData.find(
          (f) => f.id === entrega.funcionarioId
        );
        const ca = casData.find((c) => c.id === entrega.caId);

        return {
          ...entrega,
          dataEntrega: entrega.dataEntrega as string,
          funcionarioNome: funcionario ? funcionario.nome : "Desconhecido",
          caTipo: ca ? ca.tipo : "Desconhecido",
          caModelo: ca ? ca.modelo : "Desconhecido",
        };
      });

    setEntregasConcluidas(concluidas);
  }, []);

  // Função para filtrar entregas
  const entregasFiltradas = entregasConcluidas.filter((entrega) => {
    const matchNome = entrega.funcionarioNome
      .toLowerCase()
      .includes(filtroNome.toLowerCase());
    const matchProduto = entrega.caTipo
      .toLowerCase()
      .includes(filtroProduto.toLowerCase());
    const matchData = !filtroData || entrega.dataEntrega.includes(filtroData);

    return matchNome && matchProduto && matchData;
  });

  // Dados para o gráfico (em formato de objeto para ser usado em uma implementação real)
  const dadosPorMes = entregasConcluidas.reduce((acc, entrega) => {
    if (entrega.dataEntrega) {
      const mes = entrega.dataEntrega.split("-")[1]; // Extrair mês da data
      acc[mes] = (acc[mes] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Dados para o gráfico de produtos por mês
  const dadosPorProduto = entregasConcluidas.reduce((acc, entrega) => {
    const tipo = entrega.caTipo;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaClipboardCheck className="text-[#9ab52d] mr-2" size={24} />
        <h1 className="text-2xl font-bold">Entregas Concluídas</h1>
      </div>

      {/* Filtros */}
      <Card title="Filtros" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <div>
            <label className="block mb-1 text-sm">Funcionário</label>
            <div className="relative">
              <input
                type="text"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                placeholder="Nome do funcionário"
                className="w-full border border-gray-300 rounded px-3 py-2 pl-9"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Produto</label>
            <div className="relative">
              <input
                type="text"
                value={filtroProduto}
                onChange={(e) => setFiltroProduto(e.target.value)}
                placeholder="Tipo de CA"
                className="w-full border border-gray-300 rounded px-3 py-2 pl-9"
              />
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Data</label>
            <div className="relative">
              <input
                type="text"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                placeholder="AAAA-MM-DD"
                className="w-full border border-gray-300 rounded px-3 py-2 pl-9"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabela de Entregas */}
      <Card
        title={`Entregas Concluídas (${entregasFiltradas.length})`}
        className="mb-6"
      >
        <div className="flex justify-end p-4">
          <button className="btn-primary flex items-center">
            <FaDownload className="mr-2" /> Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Funcionário</th>
                <th>Equipamento</th>
                <th>Modelo</th>
                <th>Data de Entrega</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entregasFiltradas.map((entrega) => (
                <tr key={entrega.id}>
                  <td>#{entrega.id}</td>
                  <td>{entrega.funcionarioNome}</td>
                  <td>{entrega.caTipo}</td>
                  <td>{entrega.caModelo}</td>
                  <td>{entrega.dataEntrega}</td>
                  <td>
                    <span className="badge badge-success">Entregue</span>
                  </td>
                </tr>
              ))}
              {entregasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Nenhuma entrega encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Entregas por Mês">
          <div className="p-4">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-center">
                Distribuição Mensal
              </h3>
              <div className="space-y-3">
                {Object.entries(dadosPorMes).map(([mes, quantidade]) => (
                  <div key={mes} className="flex items-center">
                    <span className="w-10 text-sm font-medium">
                      {mesToNome(mes)}
                    </span>
                    <div className="flex-1 ml-2">
                      <div
                        className="h-6 bg-[#2f47a2] rounded"
                        style={{ width: `${Math.min(100, quantidade * 10)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {quantidade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Entregas por Produto">
          <div className="p-4">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-center">
                Tipos de CA Entregues
              </h3>
              <div className="space-y-3">
                {Object.entries(dadosPorProduto).map(
                  ([produto, quantidade]) => (
                    <div key={produto} className="flex items-center">
                      <span
                        className="w-24 text-sm font-medium truncate"
                        title={produto}
                      >
                        {produto}
                      </span>
                      <div className="flex-1 ml-2">
                        <div
                          className="h-6 bg-[#c76f49] rounded"
                          style={{
                            width: `${Math.min(100, quantidade * 10)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {quantidade}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Função auxiliar para converter número do mês em nome
function mesToNome(mes: string): string {
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const mesNum = parseInt(mes, 10);
  return meses[mesNum - 1] || mes;
}
