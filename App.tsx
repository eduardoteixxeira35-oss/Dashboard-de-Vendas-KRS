import React, { useState, useMemo, useRef } from 'react';
import PremisesForm from './components/PremisesForm';
import SalesTable from './components/SalesTable';
import GaugeChart from './components/GaugeChart';
import { DailySale, FinancialPremises, DEFAULT_PREMISES } from './types';

const App: React.FC = () => {
  const [premises, setPremises] = useState<FinancialPremises>(DEFAULT_PREMISES);
  const [sales, setSales] = useState<DailySale[]>([]);
  // Store sales history indexed by month string (YYYY-MM)
  const [salesHistory, setSalesHistory] = useState<Record<string, DailySale[]>>({});
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRevenue = useMemo(() => {
    return sales.reduce((acc, curr) => acc + curr.value, 0);
  }, [sales]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePremisesChange = (newPremises: FinancialPremises) => {
    // If the month changes, we need to swap the sales data
    if (newPremises.referenceMonth !== premises.referenceMonth) {
      const oldMonth = premises.referenceMonth;
      const newMonth = newPremises.referenceMonth;

      // Save current sales to history for the old month
      setSalesHistory((prev) => ({
        ...prev,
        [oldMonth]: sales,
      }));

      // Load sales for the new month from history (or empty if new)
      // We access salesHistory directly here. Since setSalesHistory is async,
      // we are reading the state as it was at the beginning of this render,
      // which contains the saved data for 'newMonth' if we visited it before.
      const loadedSales = salesHistory[newMonth] || [];
      setSales(loadedSales);
    }

    setPremises(newPremises);
  };

  // Logic to determine current status based on Gauge Zones
  // Essencial -> Necessário -> Bom -> Ótimo
  const getStatus = () => {
      const fixedVal = premises.monthlyRevenueGoal * premises.fixedCostPct / 100;
      const varVal = premises.monthlyRevenueGoal * premises.variableCostPct / 100;
      const proLaboreVal = premises.monthlyRevenueGoal * premises.proLaborePct / 100;
      const breakEven = fixedVal + varVal + proLaboreVal;

      if (totalRevenue < fixedVal) return { label: 'ESSENCIAL', color: 'text-red-500' };
      if (totalRevenue < fixedVal + varVal) return { label: 'NECESSÁRIO', color: 'text-yellow-600' };
      if (totalRevenue < breakEven) return { label: 'BOM', color: 'text-blue-600' };
      if (totalRevenue < premises.monthlyRevenueGoal) return { label: 'QUASE LÁ (LUCRO)', color: 'text-green-500' };
      return { label: 'ÓTIMO (META ATINGIDA)', color: 'text-green-700 font-black' };
  };

  const status = getStatus();

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
             </div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard de Vendas KRS</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-md transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                {logoUrl ? 'Alterar Logo' : 'Insira aqui o logotipo da sua empresa'}
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/png, image/jpeg" 
                className="hidden" 
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <PremisesForm premises={premises} onChange={handlePremisesChange} />
          <SalesTable sales={sales} setSales={setSales} />
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-8 space-y-6">
            {/* Main Gauge Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 via-blue-500 to-green-500"></div>
                
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Meta de Vendas</h2>
                    <p className="text-gray-500">Acompanhamento em Tempo Real</p>
                </div>

                <GaugeChart 
                    premises={premises}
                    currentRevenue={totalRevenue}
                    logoUrl={logoUrl}
                />

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wide mb-1">Status Atual</p>
                    <p className={`text-3xl font-bold ${status.color}`}>{status.label}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Faturamento Atual</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Média Diária</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                        {sales.length > 0 
                            ? (totalRevenue / sales.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            : 'R$ 0,00'
                        }
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Dias Trabalhados</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">{sales.length}</p>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;