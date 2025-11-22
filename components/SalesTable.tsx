
import React, { useState, useEffect } from 'react';
import { DailySale } from '../types';

interface SalesTableProps {
  sales: DailySale[];
  setSales: React.Dispatch<React.SetStateAction<DailySale[]>>;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, setSales }) => {
  const [day, setDay] = useState<number>(1);
  const [value, setValue] = useState<string>('');

  // Automatically update day when sales list changes (e.g. month switch or item added)
  useEffect(() => {
    const nextDay = sales.length > 0 ? Math.max(...sales.map(s => s.day)) + 1 : 1;
    setDay(nextDay);
  }, [sales]);

  const addSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    const numValue = parseFloat(value);
    const newSale: DailySale = {
      id: crypto.randomUUID(),
      day: day,
      value: numValue,
    };

    setSales([...sales, newSale].sort((a, b) => a.day - b.day));
    setValue('');
  };

  const removeSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        Vendas Diárias
      </h2>

      <form onSubmit={addSale} className="flex gap-2 mb-4">
        <div className="w-20">
           <input
            type="number"
            placeholder="Dia"
            value={day}
            onChange={(e) => setDay(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md text-center"
            min={1}
            max={31}
            required
          />
        </div>
        <div className="flex-1">
           <input
            type="number"
            placeholder="Valor (R$)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            step="0.01"
            required
          />
        </div>
        <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
            +
        </button>
      </form>

      <div className="overflow-y-auto flex-1 max-h-[300px] pr-2 custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 rounded-tl-md">Dia</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2 rounded-tr-md text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-400 italic">Nenhuma venda registrada</td>
                </tr>
            )}
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{sale.day}</td>
                <td className="px-4 py-2">R$ {sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => removeSale(sale.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remover"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Acumulado:</span>
          <span className="text-lg font-bold text-slate-800">
              {sales.reduce((acc, curr) => acc + curr.value, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
      </div>
    </div>
  );
};

export default SalesTable;
