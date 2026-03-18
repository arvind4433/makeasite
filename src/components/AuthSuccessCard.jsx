import { CheckCircle2 } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

const pieces = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${(index * 17) % 100}%`,
  delay: `${(index % 7) * 0.15}s`,
  duration: `${3 + (index % 5) * 0.4}s`,
  rotate: `${index * 27}deg`,
  color: COLORS[index % COLORS.length]
}));

const AuthSuccessCard = ({ message = 'Login Successfully' }) => (
  <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/45 backdrop-blur-sm px-4">
    <style>{`
      @keyframes confettiFall {
        0% { transform: translate3d(0,-120vh,0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        100% { transform: translate3d(18px,120vh,0) rotate(540deg); opacity: 0; }
      }
      @keyframes floatGlow {
        0%,100% { transform: scale(1); opacity: 0.45; }
        50% { transform: scale(1.12); opacity: 0.8; }
      }
    `}</style>
    <div className="pointer-events-none absolute inset-0">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{
            left: piece.left,
            background: piece.color,
            animation: `confettiFall ${piece.duration} linear ${piece.delay} infinite`,
            transform: `rotate(${piece.rotate})`
          }}
        />
      ))}
      <span className="absolute left-1/4 top-1/4 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" style={{ animation: 'floatGlow 2.8s ease-in-out infinite' }} />
      <span className="absolute right-1/4 bottom-1/4 h-24 w-24 rounded-full bg-orange-400/20 blur-3xl" style={{ animation: 'floatGlow 3.2s ease-in-out infinite' }} />
    </div>
    <div className="relative w-full max-w-sm rounded-[28px] border bg-white px-8 py-9 text-center shadow-[0_35px_100px_rgba(15,23,42,0.28)]" style={{ borderColor: 'rgba(16,185,129,0.18)' }}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-11 w-11 text-emerald-500" strokeWidth={2.5} />
      </div>
      <h2 className="mt-5 text-2xl font-black text-slate-900">{message}</h2>
      <p className="mt-2 text-sm text-slate-500">Your account is ready and the session is active.</p>
    </div>
  </div>
);

export default AuthSuccessCard;
