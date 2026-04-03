import { User } from '../types';

interface GoogleAdProps {
  user: User;
}

export default function GoogleAd({ user }: GoogleAdProps) {
  // Hide ads for subscribed users
  if (user.isSubscribed) return null;

  return (
    <div className="w-full mb-6 overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-4 min-h-[60px] relative flex items-center justify-center">
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-200/50 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest z-10 pointer-events-none">
        Anúncio
      </div>
      
      <div className="text-center">
        <button 
          onClick={() => window.location.href = '/assinar'}
          className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
        >
          Remover anúncios com FixMaster Pro
        </button>
      </div>
    </div>
  );
}
