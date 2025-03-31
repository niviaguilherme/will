import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "azul" | "laranja" | "amarelo" | "verde";
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    azul: "bg-[#2f47a2] text-white",
    laranja: "bg-[#c76f49] text-white",
    amarelo: "bg-[#e2c736] text-black",
    verde: "bg-[#9ab52d] text-white",
  };

  return (
    <div className={`dashboard-card flex items-center`}>
      <div className={`p-4 rounded-lg mr-4 ${colorClasses[color]}`}>{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
