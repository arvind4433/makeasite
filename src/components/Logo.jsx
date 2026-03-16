/**
 * MakeASite Logo — inline SVG, no external file dependency.
 * Props:
 *   showText {boolean} — show "MakeASite" wordmark (default true)
 *   size {number}      — icon size in px (default 32)
 */
const Logo = ({ showText = true, size = 32 }) => {
  const px = `${size}px`;

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Icon mark */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{ width: px, height: px }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
        >
          <defs>
            <linearGradient id="mas-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
            <linearGradient id="mas-grad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Browser / window frame */}
          <rect x="2" y="6" width="36" height="28" rx="5" fill="url(#mas-grad)" />
          {/* Top bar */}
          <rect x="2" y="6" width="36" height="10" rx="5" fill="url(#mas-grad2)" />
          {/* Window buttons */}
          <circle cx="9" cy="11" r="1.8" fill="rgba(255,255,255,0.5)" />
          <circle cx="14.5" cy="11" r="1.8" fill="rgba(255,255,255,0.35)" />
          <circle cx="20" cy="11" r="1.8" fill="rgba(255,255,255,0.2)" />

          {/* Code lines in the window body */}
          <rect x="8" y="21" width="10" height="2" rx="1" fill="rgba(255,255,255,0.9)" />
          <rect x="8" y="25.5" width="16" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
          <rect x="8" y="30" width="7" height="2" rx="1" fill="rgba(255,255,255,0.4)" />

          {/* Cursor / caret */}
          <rect x="20" y="21" width="1.8" height="7" rx="0.9" fill="rgba(255,255,255,0.85)" />

          {/* Shine */}
          <rect x="2" y="6" width="36" height="5" rx="4" fill="rgba(255,255,255,0.12)" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">
            Make
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              A
            </span>
            Site
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Web Development
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
