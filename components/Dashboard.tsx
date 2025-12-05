import React, { useMemo } from 'react';
import { Card, DashboardStats } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine
} from 'recharts';
import { TrendingUp, DollarSign, Wallet, Layers, BarChart3 } from 'lucide-react';

interface DashboardProps {
  cards: Card[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'];

const Dashboard: React.FC<DashboardProps> = ({ cards }) => {
  const stats: DashboardStats = useMemo(() => {
    let totalInvested = 0;
    let realizedProfit = 0;
    let soldCount = 0;

    cards.forEach(card => {
      if (card.isSold) {
        soldCount++;
        const profit = (card.soldPrice || 0) - card.purchasePrice;
        realizedProfit += profit;
      } else {
        totalInvested += card.purchasePrice;
      }
    });

    return {
      totalCards: cards.length,
      totalInvested,
      portfolioValue: totalInvested, // Simplified: Value = Cost for unsold
      realizedProfit,
      soldCount
    };
  }, [cards]);

  const chartData = useMemo(() => {
    const distribution: Record<string, number> = {};
    cards.forEach(card => {
      if (card.isSold) return;
      const primaryTag = card.tags[0] || 'Uncategorized';
      distribution[primaryTag] = (distribution[primaryTag] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [cards]);

  const profitTrendData = useMemo(() => {
    const soldCards = cards.filter(c => c.isSold && c.soldDate);
    if (soldCards.length === 0) return [];

    const grouped: Record<string, number> = {};
    
    soldCards.forEach(card => {
      // Expecting YYYY-MM-DD
      const dateParts = card.soldDate!.split('-');
      if (dateParts.length < 2) return;
      const key = `${dateParts[0]}-${dateParts[1]}`; // YYYY-MM
      
      const profit = (card.soldPrice || 0) - card.purchasePrice;
      grouped[key] = (grouped[key] || 0) + profit;
    });

    return Object.entries(grouped)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => {
        const [year, month] = key.split('-');
        // Construct date object
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          profit: value
        };
      });
  }, [cards]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  const formatYAxis = (val: number) => {
    if (val === 0) return '$0';
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-xl text-xs">
          <p className="text-slate-300 font-medium mb-1">{label}</p>
          <p className={`${payload[0].value >= 0 ? 'text-emerald-400' : 'text-red-400'} font-bold`}>
            {payload[0].value >= 0 ? '+' : ''}{formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Realized Profit */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <TrendingUp size={48} />
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Realized Profit</span>
          <div className={`text-2xl font-bold mt-1 ${stats.realizedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {stats.realizedProfit > 0 ? '+' : ''}{formatCurrency(stats.realizedProfit)}
          </div>
          <span className="text-xs text-slate-500 mt-1">{stats.soldCount} cards sold</span>
        </div>

        {/* Portfolio Cost */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Wallet size={48} />
          </div>
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Portfolio Cost</span>
          <div className="text-2xl font-bold text-white mt-1">
            {formatCurrency(stats.totalInvested)}
          </div>
          <span className="text-xs text-slate-500 mt-1">{stats.totalCards - stats.soldCount} active cards</span>
        </div>
      </div>

      {/* Profit Trend Chart */}
      {profitTrendData.length > 0 && (
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 size={14} /> Monthly Realized Profit
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                <ReferenceLine y={0} stroke="#475569" />
                <Bar dataKey="profit" radius={[4, 4, 4, 4]} maxBarSize={40}>
                  {profitTrendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2 flex items-center gap-2">
            <Layers size={14} /> Collection Distribution (Active)
          </h3>
          <div className="h-40 w-full flex items-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col gap-1 ml-4 text-xs max-h-36 overflow-y-auto no-scrollbar w-32">
                {chartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-slate-300 truncate">{entry.name}</span>
                    <span className="text-slate-500 ml-auto">{entry.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;