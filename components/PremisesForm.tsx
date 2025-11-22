
import React from 'react';
import { FinancialPremises } from '../types';

interface PremisesFormProps {
  premises: FinancialPremises;
  onChange: (newPremises: FinancialPremises) => void;
}

const PremisesForm: React.FC<PremisesFormProps> = ({ premises, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onChange({
      ...premises,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value,
    });
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Premissas Financeiras (DRE)
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mês de Referência</label>
          <input
            type="month"
            name="referenceMonth"
            value={premises.referenceMonth}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Faturamento Meta (Mês)</label>
          <input
            type="number"
            name="monthlyRevenueGoal"
            value={premises.monthlyRevenueGoal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900"
          />
           <p className="text-xs text-gray-500 mt-1">
            Valor em R$: {formatCurrency(premises.monthlyRevenueGoal)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-red-500 mb-1">ESSENCIAL (% TOTAL DOS CUSTOS FIXOS)</label>
            <div className="flex items-center">
              <input
                type="number"
                name="fixedCostPct"
                value={premises.fixedCostPct}
                onChange={handleChange}
                className="w-full p-2 border border-red-200 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
              />
              <span className="ml-2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">R$ {formatCurrency(premises.monthlyRevenueGoal * premises.fixedCostPct / 100)}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-yellow-600 mb-1">NECESSÁRIO (% TOTAL DOS CUSTOS VARIÁVEIS)</label>
            <div className="flex items-center">
              <input
                type="number"
                name="variableCostPct"
                value={premises.variableCostPct}
                onChange={handleChange}
                className="w-full p-2 border border-yellow-200 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
              />
              <span className="ml-2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">R$ {formatCurrency(premises.monthlyRevenueGoal * premises.variableCostPct / 100)}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-blue-600 mb-1">BOM (% TOTAL DO PRÓ-LABORE DO(S) SÓCIO(S))</label>
            <div className="flex items-center">
              <input
                type="number"
                name="proLaborePct"
                value={premises.proLaborePct}
                onChange={handleChange}
                className="w-full p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="ml-2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">R$ {formatCurrency(premises.monthlyRevenueGoal * premises.proLaborePct / 100)}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-green-600 mb-1">META (% DO LUCRO QUE A EMPRESA ALMEJA ATINGIR)</label>
            <div className="flex items-center">
              <input
                type="number"
                name="profitGoalPct"
                value={premises.profitGoalPct}
                onChange={handleChange}
                className="w-full p-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              />
              <span className="ml-2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">R$ {formatCurrency(premises.monthlyRevenueGoal * premises.profitGoalPct / 100)}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Ponto de Equilíbrio:</span>
            <span className="font-bold">{formatCurrency(premises.monthlyRevenueGoal * (premises.fixedCostPct + premises.variableCostPct + premises.proLaborePct) / 100)}</span>
          </div>
           <div className="flex justify-between">
            <span>Total Meta (Receita):</span>
            <span className="font-bold text-green-600">{formatCurrency(premises.monthlyRevenueGoal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremisesForm;
