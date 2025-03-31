"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/dashboard/Card";
import { FaClipboardList, FaCheck, FaCalendarAlt } from "react-icons/fa";

// Importação de dados
import entregasData from "../data/entregas.json";
import funcionariosData from "../data/funcionarios.json";
import casData from "../data/cas.json";

interface EntregaPendente {
  id: number;
  funcionarioId: number;
  caId: number;
  dataEntrega: string | null;
  status: string;
  funcionarioNome: string;
  funcionarioCargo: string;
  caTipo: string;
  caModelo: string;
}

export default function EntregasPendentes() {
  const [entregasPendentes, setEntregasPendentes] = useState<EntregaPendente[]>(
    []
  );
  const [entregasConcluidas, setEntregasConcluidas] = useState<number[]>([]);

  useEffect(() => {
    // Filtrar entregas pendentes e adicionar informações de funcionário e CA
    const pendentes = entregasData
      .filter((entrega) => entrega.status === "Pendente")
      .map((entrega) => {
        const funcionario = funcionariosData.find(
          (f) => f.id === entrega.funcionarioId
        );
        const ca = casData.find((c) => c.id === entrega.caId);

        return {
          ...entrega,
          funcionarioNome: funcionario ? funcionario.nome : "Desconhecido",
          funcionarioCargo: funcionario ? funcionario.cargo : "Desconhecido",
          caTipo: ca ? ca.tipo : "Desconhecido",
          caModelo: ca ? ca.modelo : "Desconhecido",
        };
      });

    setEntregasPendentes(pendentes);
  }, []);

  // Função para marcar uma entrega como concluída
  const handleMarcarConcluida = (id: number) => {
    // Em um cenário real, essa função enviaria dados para um backend
    // Aqui, apenas adicionamos ao estado local para simular o comportamento
    setEntregasConcluidas((prev) => [...prev, id]);
  };

  // Filtra entregas que não foram marcadas como concluídas na UI
  const entregasExibidas = entregasPendentes.filter(
    (entrega) => !entregasConcluidas.includes(entrega.id)
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaClipboardList className="text-[#e2c736] mr-2" size={24} />
        <h1 className="text-2xl font-bold">Entregas Pendentes</h1>
      </div>

      <Card title={`Entregas Pendentes (${entregasExibidas.length})`}>
        {entregasExibidas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Cargo</th>
                  <th>Equipamento</th>
                  <th>Modelo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entregasExibidas.map((entrega) => (
                  <tr key={entrega.id}>
                    <td>{entrega.funcionarioNome}</td>
                    <td>{entrega.funcionarioCargo}</td>
                    <td>{entrega.caTipo}</td>
                    <td>{entrega.caModelo}</td>
                    <td>
                      <span className="badge badge-warning">Pendente</span>
                    </td>
                    <td>
                      <button
                        className="btn-success flex items-center text-sm"
                        onClick={() => handleMarcarConcluida(entrega.id)}
                      >
                        <FaCheck className="mr-1" /> Concluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-gray-500 mb-2">Nenhuma entrega pendente</p>
            <FaClipboardList className="text-gray-400 mx-auto" size={32} />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Instruções para Entrega">
          <div className="p-4 bg-[#2f47a2] bg-opacity-10 rounded-lg">
            <h3 className="font-medium text-[#2f47a2] mb-2">
              Procedimento de Entrega
            </h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>Verifique se o equipamento está em boas condições</li>
              <li>
                Certifique-se que o funcionário esteja presente para recebimento
              </li>
              <li>Solicite assinatura do termo de recebimento</li>
              <li>Forneça orientações básicas de uso e conservação</li>
              <li>Registre a entrega no sistema clicando em "Concluir"</li>
            </ol>
          </div>
        </Card>

        <Card title="Próximas Entregas Programadas">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-[#e2c736] bg-opacity-20 mr-3">
                <FaCalendarAlt className="text-[#e2c736]" />
              </div>
              <div>
                <h4 className="font-medium">
                  Treinamento: Uso correto de EPIs
                </h4>
                <p className="text-sm text-gray-500">10 a 12 de Maio, 2024</p>
                <p className="text-sm">
                  Entregas de novos EPIs serão feitas após o treinamento
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 rounded-lg bg-[#9ab52d] bg-opacity-20 mr-3">
                <FaCalendarAlt className="text-[#9ab52d]" />
              </div>
              <div>
                <h4 className="font-medium">Renovação de CAs</h4>
                <p className="text-sm text-gray-500">Junho, 2024</p>
                <p className="text-sm">
                  Programação de substituição dos CAs vencidos
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
