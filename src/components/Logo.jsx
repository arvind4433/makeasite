const Logo = ({ showText = true, size = 28 }) => {
  const px = `${size}px`;

  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xl flex items-center justify-center shadow-sm"
        style={{
          width: px,
          height: px,
          background:
            'conic-gradient(from 200deg, #f97316, #dc2626, #7c3aed, #2563eb, #f97316)',
        }}
      >
        <div className="w-[70%] h-[70%] rounded-lg bg-slate-950/95 dark:bg-slate-950 flex items-center justify-center">
          <svg
            viewBox="0 0 40 40"
            className="w-[80%] h-[80%]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ms-cloud" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Cloud base */}
            <path
              d="M11 23c0-3.3 2.7-6 6-6 .5-3.2 3.3-5.5 6.6-5.5 3.7 0 6.8 3 6.8 6.8 2.4.5 4.2 2.6 4.2 5.1 0 2.9-2.4 5.3-5.3 5.3H15.5C12.8 28.7 11 26.3 11 23z"
              fill="url(#ms-cloud)"
            />
            {/* Cursor / angle brackets */}
            <path
              d="M16 16.5 12.5 20 16 23.5"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 16.5 27.5 20 24 23.5"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">
            Make
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400">
              A
            </span>
            Site
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            High-performance web builds
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

