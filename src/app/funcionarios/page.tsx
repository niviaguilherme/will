"use client";

import React, { useState, useEffect } from "react";
import Card from "../components/dashboard/Card";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaHardHat,
} from "react-icons/fa";

// Importação de dados
import funcionariosData from "../data/funcionarios.json";
import casData from "../data/cas.json";

// Interface para o tipo de funcionário
interface Funcionario {
  id: number;
  nome: string;
  setor: string;
  cargo: string;
  dataAdmissao: string;
  status: string;
  valorPago: number;
  cas: number[];
}

export default function Funcionarios() {
  // Estado para a lista de funcionários
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  // Estado para o formulário
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Funcionario, "id">>({
    nome: "",
    setor: "",
    cargo: "",
    dataAdmissao: "",
    status: "Ativo",
    valorPago: 0,
    cas: [],
  });

  // Estado para visualização detalhada
  const [viewingFuncionario, setViewingFuncionario] =
    useState<Funcionario | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    setFuncionarios(funcionariosData);
  }, []);

  // Manipuladores de formulário
  const handleOpenForm = (funcionario?: Funcionario) => {
    if (funcionario) {
      setFormData({
        nome: funcionario.nome,
        setor: funcionario.setor,
        cargo: funcionario.cargo,
        dataAdmissao: funcionario.dataAdmissao,
        status: funcionario.status,
        valorPago: funcionario.valorPago,
        cas: funcionario.cas,
      });
      setEditingId(funcionario.id);
    } else {
      setFormData({
        nome: "",
        setor: "",
        cargo: "",
        dataAdmissao: "",
        status: "Ativo",
        valorPago: 0,
        cas: [],
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "valorPago" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      // Atualizar funcionário existente
      setFuncionarios((prev) =>
        prev.map((f) =>
          f.id === editingId ? { ...formData, id: editingId } : f
        )
      );
    } else {
      // Adicionar novo funcionário
      const newId = Math.max(0, ...funcionarios.map((f) => f.id)) + 1;
      setFuncionarios((prev) => [...prev, { ...formData, id: newId }]);
    }

    handleCloseForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleViewDetails = (funcionario: Funcionario) => {
    setViewingFuncionario(funcionario);
  };

  const handleCloseDetails = () => {
    setViewingFuncionario(null);
  };

  // Função para obter os CAs de um funcionário
  const getFuncionarioCAs = (casIds: number[]) => {
    return casData.filter((ca) => casIds.includes(ca.id));
  };

  return (
    <div className="p-3 md:p-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h1 className="text-lg md:text-2xl font-bold">Funcionários</h1>
        <button
          className="btn-primary flex items-center text-xs md:text-sm py-2 px-3 md:py-2 md:px-4 rounded-md"
          onClick={() => handleOpenForm()}
        >
          <FaPlus className="mr-1 md:mr-2" size={12} />{" "}
          <span className="hidden xs:inline">Novo Funcionário</span>
          <span className="xs:hidden">Novo</span>
        </button>
      </div>

      {/* Lista de Funcionários */}
      <Card title="Lista de Funcionários">
        <div className="table-responsive">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th className="hidden md:table-cell">Setor</th>
                <th>Status</th>
                <th className="hidden sm:table-cell">Valor Pago</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td>{funcionario.nome}</td>
                  <td>{funcionario.cargo}</td>
                  <td className="hidden md:table-cell">{funcionario.setor}</td>
                  <td>
                    <span
                      className={`badge ${
                        funcionario.status === "Ativo"
                          ? "badge-success"
                          : "badge-danger"
                      }`}
                    >
                      {funcionario.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell">
                    R$ {funcionario.valorPago.toFixed(2)}
                  </td>
                  <td className="flex space-x-1 md:space-x-2">
                    <button
                      className="text-blue-600"
                      onClick={() => handleViewDetails(funcionario)}
                      title="Ver detalhes"
                    >
                      <FaHardHat size={14} />
                    </button>
                    <button
                      className="text-yellow-600"
                      onClick={() => handleOpenForm(funcionario)}
                      title="Editar"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(funcionario.id)}
                      title="Excluir"
                    >
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {funcionarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Nenhum funcionário cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Formulário */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">
                {editingId !== null ? "Editar Funcionário" : "Novo Funcionário"}
              </h2>
              <button onClick={handleCloseForm} className="text-gray-500">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                <div>
                  <label className="block mb-1">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Setor</label>
                  <input
                    type="text"
                    name="setor"
                    value={formData.setor}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Cargo</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Data de Admissão</label>
                  <input
                    type="date"
                    name="dataAdmissao"
                    value={formData.dataAdmissao}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Valor Pago</label>
                  <input
                    type="number"
                    name="valorPago"
                    value={formData.valorPago}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex items-center">
                  <FaSave className="mr-2" /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {viewingFuncionario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                CAs do Funcionário: {viewingFuncionario.nome}
              </h2>
              <button onClick={handleCloseDetails} className="text-gray-500">
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Modelo</th>
                    <th>Vencimento</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getFuncionarioCAs(viewingFuncionario.cas).map((ca) => (
                    <tr key={ca.id}>
                      <td>{ca.tipo}</td>
                      <td>{ca.modelo}</td>
                      <td>{ca.dataVencimento}</td>
                      <td>
                        <span
                          className={`badge ${
                            ca.status === "Ativo"
                              ? "badge-success"
                              : "badge-danger"
                          }`}
                        >
                          {ca.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {viewingFuncionario.cas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        Nenhum CA atribuído
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button onClick={handleCloseDetails} className="btn-primary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
