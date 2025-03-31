"use client";

import React, { useEffect, useState } from "react";
import Card from "./components/dashboard/Card";
import StatCard from "./components/dashboard/StatCard";
import {
  FaUser,
  FaClipboardList,
  FaHardHat,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Importação de dados (simulando fetch de uma API)
import funcionariosData from "./data/funcionarios.json";
import casData from "./data/cas.json";
import entregasData from "./data/entregas.json";
import treinamentosData from "./data/treinamentos.json";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Home() {
  const [stats, setStats] = useState({
    funcionarios: 0,
    entregasPendentes: 0,
    casVencidos: 0,
    treinamentos: 0,
  });

  const [casVencidosData, setCasVencidosData] = useState({
    labels: ["Vencidos", "Ativos"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#c76f49", "#9ab52d"],
      },
    ],
  });

  const [entregasPorFuncionario, setEntregasPorFuncionario] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Entregas por Funcionário",
        data: [] as number[],
        backgroundColor: "#2f47a2",
      },
    ],
  });

  useEffect(() => {
    // Processar dados de estatísticas
    const entregasPendentes = entregasData.filter(
      (entrega) => entrega.status === "Pendente"
    ).length;
    const casVencidos = casData.filter((ca) => ca.status === "Vencido").length;

    setStats({
      funcionarios: funcionariosData.length,
      entregasPendentes,
      casVencidos,
      treinamentos: treinamentosData.length,
    });

    // Dados para gráfico de CAs vencidos
    setCasVencidosData({
      labels: ["Vencidos", "Ativos"],
      datasets: [
        {
          data: [casVencidos, casData.length - casVencidos],
          backgroundColor: ["#c76f49", "#9ab52d"],
        },
      ],
    });

    // Dados para gráfico de entregas por funcionário
    const entregasPorFunc: Record<number, number> = {};
    entregasData.forEach((entrega) => {
      if (entrega.status === "Entregue") {
        const funcionarioId = entrega.funcionarioId;
        entregasPorFunc[funcionarioId] =
          (entregasPorFunc[funcionarioId] || 0) + 1;
      }
    });

    const labels = Object.keys(entregasPorFunc).map((id) => {
      const funcionario = funcionariosData.find((f) => f.id === parseInt(id));
      return funcionario ? funcionario.nome : `Funcionário ${id}`;
    });

    setEntregasPorFuncionario({
      labels,
      datasets: [
        {
          label: "Entregas por Funcionário",
          data: Object.values(entregasPorFunc),
          backgroundColor: "#2f47a2",
        },
      ],
    });
  }, []);

  // Obter lista de funcionários que estão pagando mais
  const funcionariosPagantes = [...funcionariosData]
    .sort((a, b) => b.valorPago - a.valorPago)
    .slice(0, 3);

  // Obter lista de entregas pendentes recentes
  const entregasPendentes = entregasData
    .filter((entrega) => entrega.status === "Pendente")
    .map((entrega) => {
      const funcionario = funcionariosData.find(
        (f) => f.id === entrega.funcionarioId
      );
      const ca = casData.find((c) => c.id === entrega.caId);
      return {
        ...entrega,
        funcionarioNome: funcionario ? funcionario.nome : "Desconhecido",
        caTipo: ca ? ca.tipo : "Desconhecido",
        caModelo: ca ? ca.modelo : "Desconhecido",
      };
    });

  return (
    <div className="p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
        <StatCard
          title="Funcionários"
          value={stats.funcionarios}
          icon={<FaUser size={24} />}
          color="azul"
        />

        <StatCard
          title="Entregas Pendentes"
          value={stats.entregasPendentes}
          icon={<FaClipboardList size={24} />}
          color="amarelo"
        />

        <StatCard
          title="CAs Vencidos"
          value={stats.casVencidos}
          icon={<FaExclamationTriangle size={24} />}
          color="laranja"
        />

        <StatCard
          title="Treinamentos"
          value={stats.treinamentos}
          icon={<FaCalendarAlt size={24} />}
          color="verde"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
        <Card title="CAs por Status">
          <div className="chart-container flex justify-center items-center">
            <Pie
              data={casVencidosData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </Card>

        <Card title="Entregas por Funcionário">
          <div className="chart-container">
            <Bar
              data={entregasPorFuncionario}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card title="Funcionários que Mais Pagaram">
          <div className="table-responsive">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Valor Pago</th>
                </tr>
              </thead>
              <tbody>
                {funcionariosPagantes.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <td>{funcionario.nome}</td>
                    <td>{funcionario.cargo}</td>
                    <td>R$ {funcionario.valorPago.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Entregas Pendentes">
          <div className="table-responsive">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Funcionário</th>
                  <th>Tipo</th>
                  <th>Modelo</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {entregasPendentes.slice(0, 5).map((entrega) => (
                  <tr key={entrega.id}>
                    <td>{entrega.funcionarioNome}</td>
                    <td>{entrega.caTipo}</td>
                    <td>{entrega.caModelo}</td>
                    <td>
                      {entrega.dataEntrega
                        ? new Date(entrega.dataEntrega).toLocaleDateString()
                        : "Pendente"}
                    </td>
                    <td>
                      <span className="badge badge-warning">
                        {entrega.status}
                      </span>
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
