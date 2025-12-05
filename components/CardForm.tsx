import React, { useState, useEffect } from 'react';
import { Card, PRESET_TAGS, TagOption } from '../types';
import { X, Check } from 'lucide-react';

interface CardFormProps {
  initialData?: Card;
  onSubmit: (card: Omit<Card, 'id'>) => void;
  onCancel: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear().toString());
  const [set, setSet] = useState(initialData?.set || '');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice?.toString() || '');
  const [purchaseDate, setPurchaseDate] = useState(initialData?.purchaseDate || new Date().toISOString().split('T')[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [isSold, setIsSold] = useState(initialData?.isSold || false);
  const [soldPrice, setSoldPrice] = useState(initialData?.soldPrice?.toString() || '');
  const [soldDate, setSoldDate] = useState(initialData?.soldDate || new Date().toISOString().split('T')[0]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchasePrice) return;

    onSubmit({
      name,
      year,
      set,
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
      tags: selectedTags,
      isSold,
      soldPrice: isSold && soldPrice ? parseFloat(soldPrice) : undefined,
      soldDate: isSold ? soldDate : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            {initialData ? 'Edit Card' : 'Add New Card'}
          </h2>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Player / Card Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Michael Jordan"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 1986"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Set / Brand</label>
                <input
                  type="text"
                  value={set}
                  onChange={(e) => setSet(e.target.value)}
                  placeholder="e.g. Fleer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purchase Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Sale Status */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="sold-check"
                checked={isSold}
                onChange={(e) => setIsSold(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
              />
              <label htmlFor="sold-check" className="text-sm font-medium text-white cursor-pointer">
                Mark as Sold
              </label>
            </div>

            {isSold && (
               <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Sold Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required={isSold}
                    value={soldPrice}
                    onChange={(e) => setSoldPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Sold Date</label>
                  <input
                    type="date"
                    required={isSold}
                    value={soldDate}
                    onChange={(e) => setSoldDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

        </form>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Check size={18} />
            {initialData ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardForm;