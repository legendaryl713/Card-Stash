import React from 'react';
import { Card } from '../types';
import { Tag, Calendar, Edit2, Trash2, Trophy } from 'lucide-react';

interface CardItemProps {
  card: Card;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onEdit, onDelete }) => {
  const profit = card.isSold ? (card.soldPrice || 0) - card.purchasePrice : 0;
  const profitPercent = card.purchasePrice > 0 
    ? ((profit / card.purchasePrice) * 100).toFixed(1) 
    : '0';

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-black/20">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-lg ${card.isSold ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base leading-tight">{card.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{card.year} • {card.set}</p>
          </div>
        </div>
        
        {card.isSold ? (
            <div className={`text-right ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className="block font-bold text-sm">
                   {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                </span>
                <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/50">
                    {profitPercent}%
                </span>
            </div>
        ) : (
             <div className="text-right">
                <span className="block font-bold text-slate-300 text-sm">
                   ${card.purchasePrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                    Cost
                </span>
            </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {card.tags.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
           <Calendar size={12} />
           <span>{card.isSold ? `Sold: ${card.soldDate}` : `Bought: ${card.purchaseDate}`}</span>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
           <button 
             onClick={() => onEdit(card)}
             className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
           >
              <Edit2 size={16} />
           </button>
           <button 
             onClick={() => onDelete(card.id)}
             className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
           >
              <Trash2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default CardItem;