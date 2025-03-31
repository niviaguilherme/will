"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaHardHat,
  FaChartBar,
  FaFileAlt,
  FaCalendarAlt,
  FaUserShield,
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

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

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1 className="text-xl font-bold">Dashboard CA</h1>
      </div>

      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={pathname === item.path ? "active" : ""}
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
  );
}
