"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/dashboard/Card";
import {
  FaCalendarAlt,
  FaUser,
  FaUsers,
  FaCheckCircle,
  FaInfoCircle,
  FaBook,
} from "react-icons/fa";

// Importação de dados
import treinamentosData from "../data/treinamentos.json";
import funcionariosData from "../data/funcionarios.json";

interface Treinamento {
  id: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  participantes: number[];
}

interface TreinamentoComParticipantes extends Treinamento {
  nomesParticipantes: string[];
  percentualParticipacao: number;
  status: "Agendado" | "Em Andamento" | "Concluído";
}

export default function Treinamentos() {
  const [treinamentos, setTreinamentos] = useState<
    TreinamentoComParticipantes[]
  >([]);

  useEffect(() => {
    // Processar os dados de treinamentos
    const hoje = new Date();

    const treinamentosProcessados = treinamentosData.map((treinamento) => {
      const dataInicio = new Date(treinamento.dataInicio);
      const dataFim = new Date(treinamento.dataFim);

      // Determinar o status com base nas datas
      let status: "Agendado" | "Em Andamento" | "Concluído";
      if (hoje < dataInicio) {
        status = "Agendado";
      } else if (hoje >= dataInicio && hoje <= dataFim) {
        status = "Em Andamento";
      } else {
        status = "Concluído";
      }

      // Buscar nomes dos participantes
      const nomesParticipantes = treinamento.participantes.map(
        (participanteId) => {
          const funcionario = funcionariosData.find(
            (f) => f.id === participanteId
          );
          return funcionario ? funcionario.nome : "Desconhecido";
        }
      );

      // Calcular percentual de participação
      const percentualParticipacao = Math.round(
        (treinamento.participantes.length / funcionariosData.length) * 100
      );

      return {
        ...treinamento,
        nomesParticipantes,
        percentualParticipacao,
        status,
      };
    });

    setTreinamentos(treinamentosProcessados);
  }, []);

  // Separar os treinamentos por status
  const treinamentosAgendados = treinamentos.filter(
    (t) => t.status === "Agendado"
  );
  const treinamentosEmAndamento = treinamentos.filter(
    (t) => t.status === "Em Andamento"
  );
  const treinamentosConcluidos = treinamentos.filter(
    (t) => t.status === "Concluído"
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaCalendarAlt className="text-[#9ab52d] mr-2" size={24} />
        <h1 className="text-2xl font-bold">Treinamentos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Agendados">
          <div className="p-4 text-center">
            <div className="text-[#e2c736] mb-2">
              <FaCalendarAlt size={32} className="mx-auto" />
            </div>
            <div className="text-3xl font-bold">
              {treinamentosAgendados.length}
            </div>
            <div className="text-sm text-gray-500">Treinamentos Agendados</div>
          </div>
        </Card>

        <Card title="Em Andamento">
          <div className="p-4 text-center">
            <div className="text-[#2f47a2] mb-2">
              <FaBook size={32} className="mx-auto" />
            </div>
            <div className="text-3xl font-bold">
              {treinamentosEmAndamento.length}
            </div>
            <div className="text-sm text-gray-500">Treinamentos Ativos</div>
          </div>
        </Card>

        <Card title="Concluídos">
          <div className="p-4 text-center">
            <div className="text-[#9ab52d] mb-2">
              <FaCheckCircle size={32} className="mx-auto" />
            </div>
            <div className="text-3xl font-bold">
              {treinamentosConcluidos.length}
            </div>
            <div className="text-sm text-gray-500">Treinamentos Realizados</div>
          </div>
        </Card>
      </div>

      <Card title="Próximos Treinamentos" className="mb-6">
        {treinamentosAgendados.length > 0 ? (
          <div className="space-y-4 p-4">
            {treinamentosAgendados.map((treinamento) => (
              <div
                key={treinamento.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="bg-[#e2c736] bg-opacity-20 p-2 rounded mr-3">
                      <FaCalendarAlt className="text-[#e2c736]" />
                    </div>
                    <div>
                      <h3 className="font-medium">{treinamento.nome}</h3>
                      <span className="text-sm text-gray-500">
                        {formatarData(treinamento.dataInicio)} a{" "}
                        {formatarData(treinamento.dataFim)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaUsers className="text-gray-400 mr-2" />
                    <span className="text-sm">
                      {treinamento.participantes.length} participantes
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {treinamento.descricao}
                </p>

                <div className="flex flex-wrap gap-2">
                  {treinamento.nomesParticipantes.map((nome, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs"
                    >
                      <FaUser className="text-gray-500 mr-1 text-xs" />
                      {nome}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <FaInfoCircle className="mx-auto mb-2" size={24} />
            <p>Não há treinamentos agendados no momento.</p>
          </div>
        )}
      </Card>

      <Card title="Treinamentos Concluídos">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Período</th>
                <th>Participantes</th>
                <th>Participação</th>
              </tr>
            </thead>
            <tbody>
              {treinamentosConcluidos.map((treinamento) => (
                <tr key={treinamento.id}>
                  <td>
                    <div className="font-medium">{treinamento.nome}</div>
                    <div className="text-xs text-gray-500">
                      {treinamento.descricao.substring(0, 50)}...
                    </div>
                  </td>
                  <td>
                    {formatarData(treinamento.dataInicio)} a{" "}
                    {formatarData(treinamento.dataFim)}
                  </td>
                  <td>{treinamento.participantes.length}</td>
                  <td>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-[#9ab52d] h-2.5 rounded-full"
                        style={{
                          width: `${treinamento.percentualParticipacao}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {treinamento.percentualParticipacao}% dos funcionários
                    </span>
                  </td>
                </tr>
              ))}
              {treinamentosConcluidos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Nenhum treinamento concluído
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Função auxiliar para formatar data
function formatarData(dataStr: string): string {
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR");
}
