import React from 'react';
import { Inbox, Clock, PlayCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { AdminStats } from '../../types';

interface AdminStatsCardsProps {
  stats: AdminStats;
  onFilterChange: (status: string) => void;
  activeFilter: string;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  stats,
  onFilterChange,
  activeFilter,
}) => {
  const cards = [
    {
      label: 'Todos os Envios',
      value: stats.total,
      filter: 'TODOS',
      icon: <Inbox className="w-5 h-5 text-teal-400" />,
      color: 'border-slate-800 hover:border-teal-500/30',
      activeColor: 'border-teal-500/50 bg-teal-500/10',
    },
    {
      label: 'Novos',
      value: stats.novo,
      filter: 'NOVO',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'border-slate-800 hover:border-amber-500/30',
      activeColor: 'border-amber-500/50 bg-amber-500/10',
    },
    {
      label: 'Em Análise',
      value: stats.emAnalise,
      filter: 'EM_ANALISE',
      icon: <PlayCircle className="w-5 h-5 text-blue-400" />,
      color: 'border-slate-800 hover:border-blue-500/30',
      activeColor: 'border-blue-500/50 bg-blue-500/10',
    },
    {
      label: 'Em Andamento',
      value: stats.emAndamento,
      filter: 'EM_ANDAMENTO',
      icon: <PlayCircle className="w-5 h-5 text-purple-400" />,
      color: 'border-slate-800 hover:border-purple-500/30',
      activeColor: 'border-purple-500/50 bg-purple-500/10',
    },
    {
      label: 'Concluídos',
      value: stats.concluido,
      filter: 'CONCLUIDO',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'border-slate-800 hover:border-emerald-500/30',
      activeColor: 'border-emerald-500/50 bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {cards.map((card) => {
        const isActive = activeFilter === card.filter;

        return (
          <button
            key={card.filter}
            type="button"
            onClick={() => onFilterChange(card.filter)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 glass-card flex flex-col justify-between ${
              isActive ? card.activeColor : card.color
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{card.label}</span>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-white font-mono">{card.value}</div>
          </button>
        );
      })}
    </div>
  );
};

