
import React, { useState } from 'react';
import CollectionView from './components/CollectionView';
import GrailGallery from './components/GrailGallery';
import { Boxes, LayoutGrid, Star } from 'lucide-react';

type View = 'collection' | 'grails';

function App() {
  const [currentView, setCurrentView] = useState<View>('collection');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Boxes size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Card Stash
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-6">
        {currentView === 'collection' ? <CollectionView /> : <GrailGallery />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 safe-area-bottom">
        <div className="max-w-xl mx-auto flex justify-around items-center">
          <button
            onClick={() => setCurrentView('collection')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              currentView === 'collection' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutGrid size={20} strokeWidth={currentView === 'collection' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Collection</span>
          </button>
          
          <button
            onClick={() => setCurrentView('grails')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              currentView === 'grails' ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Star size={20} strokeWidth={currentView === 'grails' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Grails</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
