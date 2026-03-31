import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Transaction, User } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FinanceProps {
  user: User;
}

export default function Finance({ user }: FinanceProps) {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTrial = !user.isSubscribed;
  const [newTransaction, setNewTransaction] = useState({ 
    type: 'income' as 'income' | 'expense', 
    amount: 0, 
    description: '',
    status: 'completed' as 'completed' | 'scheduled',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setTransactions(StorageService.getTransactions());
  }, []);

  const completedTransactions = transactions.filter(t => t.status === 'completed' || !t.status);
  const scheduledTransactions = transactions.filter(t => t.status === 'scheduled');

  const totalIncome = completedTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = completedTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      id: Date.now().toString(),
      ...newTransaction,
      date: new Date(newTransaction.date).toISOString(),
      status: newTransaction.status
    };
    StorageService.saveTransaction(transaction);
    setTransactions(StorageService.getTransactions());
    setIsModalOpen(false);
    setNewTransaction({ 
      type: 'income', 
      amount: 0, 
      description: '', 
      status: 'completed',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleCompleteTransaction = (id: string) => {
    const allTransactions = StorageService.getTransactions();
    const updated = allTransactions.map(t => 
      t.id === id ? { ...t, status: 'completed' as const, date: new Date().toISOString() } : t
    );
    localStorage.setItem('fixmaster_transactions', JSON.stringify(updated));
    setTransactions(updated);
    toast.success('Pagamento confirmado com sucesso!');
  };

  const chartData = [
    { name: 'Entradas', value: totalIncome, color: '#10b981' },
    { name: 'Saídas', value: totalExpense, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financeiro</h2>
          <p className="text-slate-500">Controle suas receitas, despesas e lucros.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total de Entradas</p>
          <h3 className="text-2xl font-black mt-1 text-slate-900">R$ {totalIncome.toFixed(2)}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">-5%</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total de Saídas</p>
          <h3 className="text-2xl font-black mt-1 text-slate-900">R$ {totalExpense.toFixed(2)}</h3>
        </div>

        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 text-white p-3 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium">Saldo Líquido</p>
          <h3 className="text-2xl font-black mt-1">R$ {balance.toFixed(2)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
          <h3 className="font-bold text-lg mb-8">Fluxo de Caixa</h3>
          
          {isTrial ? (
            <div className="h-[300px] w-full flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Gráficos de Fluxo de Caixa</p>
                <p className="text-sm text-slate-500 max-w-[280px] mx-auto">Visualize a saúde financeira da sua assistência com gráficos detalhados no plano Pro.</p>
              </div>
              <button 
                onClick={() => navigate('/assinar')}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Assinar Pro
              </button>
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">Últimas Transações</h3>
            <Filter size={18} className="text-slate-400" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {completedTransactions.slice(-10).reverse().map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    t.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{t.description}</p>
                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-bold text-sm",
                  t.type === 'income' ? "text-green-600" : "text-red-600"
                )}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="p-12 text-center text-slate-400 italic text-sm">
                Nenhuma transação registrada.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scheduled Payments Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-bold">Pagamentos Agendados</h3>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {scheduledTransactions.length} Pendentes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledTransactions.map((t) => (
            <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                  t.type === 'income' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {t.type === 'income' ? 'Entrada' : 'Saída'}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div>
                <p className="font-bold text-slate-900 truncate">{t.description}</p>
                <p className="text-lg font-black text-slate-900">R$ {t.amount.toFixed(2)}</p>
              </div>

              <button 
                onClick={() => handleCompleteTransaction(t.id)}
                className="w-full py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                Confirmar Pagamento
              </button>
            </div>
          ))}
          {scheduledTransactions.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Nenhum pagamento agendado para o futuro.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Nova Transação</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setNewTransaction({...newTransaction, type: 'income'})}
                    className={cn(
                      "py-2 rounded-xl font-bold text-sm border-2 transition-all",
                      newTransaction.type === 'income' ? "bg-green-50 border-green-600 text-green-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    Entrada
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewTransaction({...newTransaction, type: 'expense'})}
                    className={cn(
                      "py-2 rounded-xl font-bold text-sm border-2 transition-all",
                      newTransaction.type === 'expense' ? "bg-red-50 border-red-600 text-red-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setNewTransaction({...newTransaction, status: 'completed'})}
                    className={cn(
                      "py-2 rounded-xl font-bold text-sm border-2 transition-all",
                      newTransaction.status === 'completed' ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    Concluído
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewTransaction({...newTransaction, status: 'scheduled'})}
                    className={cn(
                      "py-2 rounded-xl font-bold text-sm border-2 transition-all",
                      newTransaction.status === 'scheduled' ? "bg-purple-50 border-purple-600 text-purple-700" : "bg-white border-slate-100 text-slate-400"
                    )}
                  >
                    Agendado
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input 
                    required
                    type="date" 
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <input 
                  required
                  type="text" 
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: Compra de tela iPhone X"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
