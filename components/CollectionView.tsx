
import React, { useState, useEffect, useMemo } from 'react';
import { Card, PRESET_TAGS } from '../types';
import * as Storage from '../services/storage';
import Dashboard from './Dashboard';
import CardForm from './CardForm';
import CardItem from './CardItem';
import { Plus, Filter, Search } from 'lucide-react';

const CollectionView: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | undefined>(undefined);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Owned' | 'Sold'>('All');

  // Load initial data
  useEffect(() => {
    const loadedCards = Storage.loadCards();
    setCards(loadedCards);
  }, []);

  // Save data on change
  useEffect(() => {
    Storage.saveCards(cards);
  }, [cards]);

  const handleAddCard = (cardData: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(),
    };
    setCards(prev => [newCard, ...prev]);
    setIsFormOpen(false);
  };

  const handleEditCard = (cardData: Omit<Card, 'id'>) => {
    if (!editingCard) return;
    setCards(prev => prev.map(c => c.id === editingCard.id ? { ...cardData, id: c.id } : c));
    setEditingCard(undefined);
    setIsFormOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setCards(prev => prev.filter(c => c.id !== id));
    }
  };

  const openEditModal = (card: Card) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            card.set.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTagFilter === 'All' || card.tags.includes(selectedTagFilter);
      const matchesStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'Sold' 
          ? card.isSold 
          : !card.isSold;
      
      return matchesSearch && matchesTag && matchesStatus;
    });
  }, [cards, searchQuery, selectedTagFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-20">
        {/* Dashboard */}
        <section>
          <Dashboard cards={cards} />
        </section>

        {/* Filters */}
        <section className="sticky top-[73px] z-30 -mx-4 px-4 py-2 bg-slate-950/95 backdrop-blur shadow-sm border-b border-slate-800/50">
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
             <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0">
               <Search size={14} className="ml-2 text-slate-500"/>
               <input 
                 type="text" 
                 placeholder="Search..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-transparent border-none focus:ring-0 text-sm px-2 w-24 text-white placeholder-slate-600"
               />
             </div>
             
             <button
               onClick={() => setStatusFilter(prev => prev === 'All' ? 'Owned' : prev === 'Owned' ? 'Sold' : 'All')}
               className={`px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                 statusFilter !== 'All' 
                 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50' 
                 : 'bg-slate-900 text-slate-400 border-slate-800'
               }`}
             >
               {statusFilter}
             </button>

             <div className="w-[1px] h-8 bg-slate-800 mx-1 shrink-0"></div>

             <button
                onClick={() => setSelectedTagFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                  selectedTagFilter === 'All' 
                  ? 'bg-slate-100 text-slate-900 border-slate-100' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                All
              </button>
             {PRESET_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-colors ${
                    selectedTagFilter === tag
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {tag}
                </button>
             ))}
           </div>
        </section>

        {/* List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
               Your Collection ({filteredCards.length})
            </h2>
          </div>
          
          {filteredCards.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mb-3 text-slate-600">
                <Filter size={20} />
              </div>
              <p className="text-slate-500 text-sm">No cards found matching filters.</p>
              {cards.length === 0 && (
                 <p className="text-slate-600 text-xs mt-1">Tap the + button to add your first card.</p>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCards.map(card => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  onEdit={openEditModal} 
                  onDelete={handleDeleteCard} 
                />
              ))}
            </div>
          )}
        </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => {
            setEditingCard(undefined);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 transition-transform active:scale-90 flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <CardForm
          initialData={editingCard}
          onSubmit={editingCard ? handleEditCard : handleAddCard}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCard(undefined);
          }}
        />
      )}
    </div>
  );
}

export default CollectionView;
