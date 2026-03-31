import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Database, 
  Trash2, 
  Download, 
  Upload,
  ShieldCheck,
  Info,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types';
import { cn } from '../lib/utils';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export default function Settings({ user, onUpdateUser }: SettingsProps) {
  const clearData = () => {
    if (confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      customers: localStorage.getItem('fixmaster_customers'),
      repairs: localStorage.getItem('fixmaster_repairs'),
      transactions: localStorage.getItem('fixmaster_transactions'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-slate-500">Gerencie as preferências e dados do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Database size={18} />
            </div>
            <h3 className="text-lg font-bold">Dados e Backup</h3>
          </div>

          <div className="space-y-4">
            <button 
              onClick={exportData}
              className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-slate-400 group-hover:text-blue-600" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Exportar Backup</p>
                  <p className="text-xs text-slate-500">Baixe todos os seus dados em um arquivo JSON.</p>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Upload size={20} className="text-slate-400" />
                <div className="text-left">
                  <p className="font-bold text-slate-900">Importar Backup</p>
                  <p className="text-xs text-slate-500">Restaure dados de um arquivo anterior.</p>
                </div>
              </div>
            </button>

            <button 
              onClick={clearData}
              className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-red-400 group-hover:text-red-600" />
                <div className="text-left">
                  <p className="font-bold text-red-900">Limpar Tudo</p>
                  <p className="text-xs text-red-500">Apague permanentemente todos os registros.</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-lg font-bold">Segurança</h3>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Info size={16} className="text-blue-600" />
              Armazenamento Local
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Seus dados estão sendo salvos apenas neste navegador. Para maior segurança, recomendamos fazer backups regulares ou utilizar uma conta em nuvem futuramente.
            </p>
          </div>
        </section>

        {user && (
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Zap size={18} />
              </div>
              <h3 className="text-lg font-bold">Assinatura e Plano</h3>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
              {user.isSubscribed && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-1 rounded-bl-2xl font-bold text-[10px] uppercase tracking-widest">
                  Plano Ativo
                </div>
              )}
              
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105",
                  user.isSubscribed ? "bg-blue-600 shadow-blue-200" : "bg-orange-500 shadow-orange-200"
                )}>
                  {user.isSubscribed ? <CheckCircle2 size={40} /> : <Clock size={40} />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-2xl font-black text-slate-900">
                      FixMaster {user.isSubscribed ? 'Pro' : 'Trial'}
                    </h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      user.isSubscribed ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {user.isSubscribed ? 'Mensal' : 'Gratuito'}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium max-w-md">
                    {user.isSubscribed 
                      ? 'Sua assinatura Pro está ativa. Você tem acesso ilimitado a todas as ferramentas.' 
                      : 'Você está aproveitando o período de teste. Assine para não perder o acesso.'}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Clock size={14} className="text-slate-400" />
                      {user.isSubscribed ? 'Próxima renovação:' : 'Expira em:'}
                      <span className={cn(
                        "ml-1",
                        user.isSubscribed ? "text-blue-600" : "text-orange-600"
                      )}>
                        {(() => {
                          if (user.isSubscribed && user.subscriptionDate) {
                            const date = new Date(user.subscriptionDate);
                            date.setMonth(date.getMonth() + 1);
                            return date.toLocaleDateString('pt-BR');
                          } else if (user.trialStartDate) {
                            const date = new Date(user.trialStartDate);
                            date.setDate(date.getDate() + 3);
                            return date.toLocaleDateString('pt-BR');
                          }
                          return 'N/A';
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3">
                <Link 
                  to="/assinar"
                  className={cn(
                    "px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl hover:-translate-y-1 active:scale-95",
                    user.isSubscribed 
                      ? "bg-white text-slate-700 border-2 border-slate-100 hover:border-blue-100 hover:text-blue-600 shadow-slate-100" 
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                  )}
                >
                  {user.isSubscribed ? 'Gerenciar Assinatura' : 'Assinar Agora - R$ 29,99'}
                </Link>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user.isSubscribed ? 'Pagamento via PIX' : 'Sem compromisso'}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="text-center pt-8">
        <p className="text-slate-400 text-sm">FixMaster Pro v1.0.0 • Desenvolvido com ❤️ para técnicos</p>
      </div>
    </div>
  );
}
