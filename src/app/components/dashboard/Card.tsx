import React, { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`dashboard-card p-3 md:p-5 ${className}`}>
      <h2 className="card-title text-base md:text-lg mb-3 md:mb-4">{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  );
}
