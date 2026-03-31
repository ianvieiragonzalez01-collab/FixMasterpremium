import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ArrowRight,
  Wrench,
  Smartphone,
  BarChart3,
  Users,
  QrCode,
  Copy,
  RefreshCw,
  ChevronLeft,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { User } from '../types';
import { differenceInHours } from 'date-fns';

interface SubscriptionProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export default function Subscription({ user, onUpdateUser }: SubscriptionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'plan' | 'pix'>('plan');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const isPixPending = !user.isSubscribed && user.pixPaymentInitiatedAt;
  const hoursSincePixInitiated = isPixPending 
    ? differenceInHours(new Date(), new Date(user.pixPaymentInitiatedAt!)) 
    : 0;
  const showPendingNotification = isPixPending && hoursSincePixInitiated >= 24;

  useEffect(() => {
    if (showPendingNotification) {
      toast.warning('Pagamento PIX Pendente', {
        description: 'Seu pagamento foi iniciado há mais de 24 horas. Verifique o status agora.',
        action: {
          label: 'Verificar',
          onClick: () => setPaymentMethod('pix')
        },
        duration: 10000
      });
    }
  }, [showPendingNotification]);

  // Chave PIX fornecida pelo usuário: 13988415819
  const pixKey = "13988415819";
  const pixPayload = `00020126360014BR.GOV.BCB.PIX0111${pixKey}520400005303986540529.995802BR5920FixMaster Tecnologia6009SAO PAULO62070503***6304E2B1`;

  const trialEndDate = new Date(user.trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + 3);
  const isTrialExpired = user.trialStarted && new Date() > trialEndDate;
  const daysLeft = Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  const handleStartTrial = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedUser = { 
        ...user, 
        trialStarted: true, 
        trialStartDate: new Date().toISOString() 
      };
      localStorage.setItem('fixmaster_user', JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);
      setIsLoading(false);
      toast.success('Seu teste de 3 dias começou! Aproveite o FixMaster Pro.');
      navigate('/');
    }, 1000);
  };

  const handleSubscribe = () => {
    setPaymentMethod('pix');
    // Armazenar o momento em que o pagamento foi iniciado
    if (!user.pixPaymentInitiatedAt) {
      const updatedUser = { 
        ...user, 
        pixPaymentInitiatedAt: new Date().toISOString() 
      };
      localStorage.setItem('fixmaster_user', JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixPayload);
    toast.success('Código PIX copiado para a área de transferência!');
  };

  const handleVerifyPayment = () => {
    setIsVerifying(true);
    // Simular verificação de pagamento
    setTimeout(() => {
      const updatedUser = { 
        ...user, 
        isSubscribed: true,
        subscriptionDate: new Date().toISOString(),
        pixPaymentInitiatedAt: undefined // Limpar o timestamp ao confirmar
      };
      localStorage.setItem('fixmaster_user', JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);
      setIsVerifying(false);
      toast.success('Pagamento PIX confirmado! Sua conta Pro está ativa.');
      navigate('/');
    }, 2500);
  };

  return (
    <div className="min-h-full bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {showPendingNotification && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3 text-amber-800">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Pagamento PIX Pendente</p>
                <p className="text-xs opacity-80">Seu pagamento foi iniciado há mais de 24 horas. Verifique o status para ativar sua conta.</p>
              </div>
            </div>
            <button 
              onClick={() => setPaymentMethod('pix')}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all whitespace-nowrap"
            >
              Verificar Status Agora
            </button>
          </motion.div>
        )}

        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100 mb-6"
          >
            <Zap size={32} />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            {!user.trialStarted 
              ? 'Bem-vindo ao FixMaster Pro' 
              : isTrialExpired 
                ? 'Seu período de teste expirou' 
                : 'Eleve sua assistência ao próximo nível'}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {!user.trialStarted
              ? 'Experimente todas as funcionalidades premium gratuitamente por 3 dias.'
              : isTrialExpired 
                ? 'Para continuar acessando suas ordens de serviço e clientes, assine o plano Pro.' 
                : `Você ainda tem ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'} de teste gratuito. Assine agora para garantir acesso ilimitado.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <AnimatePresence mode="wait">
            {paymentMethod === 'plan' ? (
              <motion.div 
                key="plan-benefits"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">O que você ganha com o Pro:</h2>
                
                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Ordens de Serviço Ilimitadas</h3>
                    <p className="text-sm text-slate-500">Crie e gerencie quantos reparos precisar, sem limites mensais.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Relatórios Financeiros</h3>
                    <p className="text-sm text-slate-500">Controle total de entradas, saídas e lucros da sua assistência.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Gestão de Clientes</h3>
                    <p className="text-sm text-slate-500">Histórico completo de cada cliente e seus dispositivos.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Suporte Prioritário</h3>
                    <p className="text-sm text-slate-500">Atendimento especializado para ajudar você a crescer.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="pix-instructions"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <button 
                  onClick={() => setPaymentMethod('plan')}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-4"
                >
                  <ChevronLeft size={20} />
                  Voltar para os planos
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">Instruções de Pagamento PIX</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</div>
                    <p className="text-slate-600 font-medium">Abra o aplicativo do seu banco e escolha a opção <span className="font-bold text-slate-900">PIX</span>.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</div>
                    <p className="text-slate-600 font-medium">Selecione <span className="font-bold text-slate-900">Ler QR Code</span> ou use a opção <span className="font-bold text-slate-900">PIX Copia e Cola</span>.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</div>
                    <p className="text-slate-600 font-medium">Confirme o valor de <span className="font-bold text-slate-900 text-lg">R$ 29,99</span> e o destinatário <span className="font-bold text-slate-900">FixMaster Tecnologia</span>.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">4</div>
                    <p className="text-slate-600 font-medium">Após o pagamento, clique no botão <span className="font-bold text-slate-900">Verificar Status</span> para liberar seu acesso.</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mt-8">
                  <div className="flex items-center gap-3 text-blue-700 font-bold mb-2">
                    <ShieldCheck size={20} />
                    Pagamento Seguro
                  </div>
                  <p className="text-sm text-blue-600">Sua assinatura será ativada instantaneamente após a confirmação do PIX pelo sistema bancário.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card de Preço / QR Code */}
          <AnimatePresence mode="wait">
            {paymentMethod === 'plan' ? (
              <motion.div 
                key="plan-card"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 border-4 border-blue-600 p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm uppercase tracking-widest">
                  Plano Único
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">FixMaster Pro</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">R$ 29,99</span>
                    <span className="text-slate-500 font-bold">/mês</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10">
                  {[
                    'Diagnósticos com IA ilimitados',
                    'Geração de PDF profissional',
                    'Backup em nuvem automático',
                    'Acesso em múltiplos dispositivos',
                    'Sem taxas de cancelamento'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="space-y-4">
                  <button 
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Assinar Agora
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {!user.trialStarted && (
                    <button 
                      onClick={handleStartTrial}
                      disabled={isLoading}
                      className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      Começar 3 dias grátis
                    </button>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 text-slate-400">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                    <CreditCard size={14} />
                    Cartão
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                    <Zap size={14} />
                    PIX
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                    <ShieldCheck size={14} />
                    Seguro
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="pix-card"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100 border-4 border-blue-600 p-8 flex flex-col items-center"
              >
                <div className="w-full flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900">Pagamento PIX</h3>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    R$ 29,99
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 mb-6 relative group">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`}
                    alt="QR Code PIX"
                    className="w-48 h-48 rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                    <QrCode size={48} className="text-blue-600" />
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Código PIX Copia e Cola</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        readOnly 
                        value={pixPayload}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-4 pr-12 text-xs font-mono text-slate-500 truncate"
                      />
                      <button 
                        onClick={handleCopyPix}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copiar código"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleVerifyPayment}
                    disabled={isVerifying}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        Verificar Status do Pagamento
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Aguardando confirmação do pagamento...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Dúvidas? Entre em contato com nosso suporte: <span className="text-blue-600 font-bold">suporte@fixmaster.com.br</span>
          </p>
        </div>
      </div>
    </div>
  );
}
