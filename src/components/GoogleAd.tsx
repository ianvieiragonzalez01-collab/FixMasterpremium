import { useEffect } from 'react';
import { User } from '../types';

interface GoogleAdProps {
  user: User;
}

export default function GoogleAd({ user }: GoogleAdProps) {
  // Hide ads for subscribed users
  if (user.isSubscribed) return null;

  useEffect(() => {
    const initAd = () => {
      try {
        const uninitializedAds = document.querySelectorAll('.adsbygoogle:not([data-adsbygoogle-status])');
        
        uninitializedAds.forEach((ad) => {
          const element = ad as HTMLElement;
          // Only push if the element is visible and has width
          if (element.offsetWidth > 0) {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        });
      } catch (e) {
        console.error('AdSense initialization failed:', e);
      }
    };

    // Try multiple times with increasing delays to ensure layout is ready
    const timers = [
      setTimeout(initAd, 500),
      setTimeout(initAd, 2000),
      setTimeout(initAd, 5000)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full mb-6 overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-4 min-h-[120px] relative">
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-200/50 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest z-10 pointer-events-none">
        Anúncio
      </div>
      
      {/* Real Ad unit container */}
      <div className="w-full flex justify-center">
        <ins className="adsbygoogle"
             style={{ display: 'block', minWidth: '250px', minHeight: '90px' }}
             data-ad-client="ca-pub-2304641619224073"
             data-ad-slot="4110976914"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
      
      <div className="mt-3 text-center">
        <button 
          onClick={() => window.location.href = '/assinar'}
          className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
        >
          Remover anúncios com FixMaster Pro
        </button>
      </div>
    </div>
  );
}
