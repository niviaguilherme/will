"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaHardHat,
  FaChartBar,
  FaFileAlt,
  FaCalendarAlt,
  FaUserShield,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Verificar no carregamento inicial
    checkScreenSize();

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome size={18} /> },
    { name: "Funcionários", path: "/funcionarios", icon: <FaUser size={18} /> },
    {
      name: "Entregas Pendentes",
      path: "/entregas-pendentes",
      icon: <FaClipboardList size={18} />,
    },
    {
      name: "Entregas",
      path: "/entregas",
      icon: <FaClipboardList size={18} />,
    },
    {
      name: "CAs Vencidos",
      path: "/cas-vencidos",
      icon: <FaHardHat size={18} />,
    },
    { name: "Relatórios", path: "/relatorios", icon: <FaChartBar size={18} /> },
    { name: "Documentos", path: "/documentos", icon: <FaFileAlt size={18} /> },
    {
      name: "Treinamentos",
      path: "/treinamentos",
      icon: <FaCalendarAlt size={18} />,
    },
    { name: "EPCs", path: "/epcs", icon: <FaUserShield size={18} /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fechar sidebar ao clicar em um link em dispositivos móveis
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Botão para toggle do menu em dispositivos móveis */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-azul-primary text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay para fechar o menu quando clicado fora (apenas mobile) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`sidebar z-20 transition-all duration-300 ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        <div className="sidebar-logo">
          <h1 className="text-xl font-bold">Dashboard CA</h1>
        </div>

        <nav className="sidebar-menu">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.path}
                className={pathname === item.path ? "active" : ""}
                onClick={handleLinkClick}
              >
                <Link href={item.path} className="flex items-center w-full">
                  <span className="icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
