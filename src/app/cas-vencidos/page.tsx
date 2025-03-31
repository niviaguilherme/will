"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/dashboard/Card";
import { FaExclamationTriangle, FaUser } from "react-icons/fa";

// Importação de dados
import casData from "../data/cas.json";
import funcionariosData from "../data/funcionarios.json";

interface CA {
  id: number;
  tipo: string;
  modelo: string;
  dataVencimento: string;
  status: string;
}

interface Funcionario {
  id: number;
  nome: string;
  cas: number[];
}

interface CAComFuncionario extends CA {
  funcionarios: string[];
}

export default function CAsVencidos() {
  const [casVencidos, setCasVencidos] = useState<CAComFuncionario[]>([]);

  useEffect(() => {
    // Encontra todos os CAs vencidos
    const vencidos = casData
      .filter((ca) => ca.status === "Vencido")
      .map((ca) => {
        // Encontra os funcionários que possuem este CA
        const funcionariosComEsteCA = funcionariosData.filter((func) =>
          func.cas.includes(ca.id)
        );

        return {
          ...ca,
          funcionarios: funcionariosComEsteCA.map((f) => f.nome),
        };
      });

    setCasVencidos(vencidos);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaExclamationTriangle className="text-[#c76f49] mr-2" size={24} />
        <h1 className="text-2xl font-bold">CAs Vencidos</h1>
      </div>

      <Card title={`CAs Vencidos (${casVencidos.length})`}>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Modelo</th>
                <th>Data de Vencimento</th>
                <th>Funcionários</th>
              </tr>
            </thead>
            <tbody>
              {casVencidos.map((ca) => (
                <tr key={ca.id}>
                  <td>{ca.tipo}</td>
                  <td>{ca.modelo}</td>
                  <td className="text-red-600 font-medium">
                    {ca.dataVencimento}
                  </td>
                  <td>
                    {ca.funcionarios.length > 0 ? (
                      <div className="flex flex-col">
                        {ca.funcionarios.map((nome, index) => (
                          <span key={index} className="flex items-center">
                            <FaUser className="mr-1 text-xs" /> {nome}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Nenhum funcionário</span>
                    )}
                  </td>
                </tr>
              ))}
              {casVencidos.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Nenhum CA vencido
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6">
        <Card title="Informações Importantes">
          <div className="p-4 bg-[#e2c736] bg-opacity-20 rounded-lg">
            <p className="mb-3">
              CAs vencidos precisam ser substituídos o mais rápido possível para
              garantir a segurança dos funcionários.
            </p>
            <p className="font-medium">Ações recomendadas:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Notificar departamento de Segurança do Trabalho</li>
              <li>Iniciar processo de aquisição de novos equipamentos</li>
              <li>Programar entrega de novos CAs aos funcionários afetados</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
