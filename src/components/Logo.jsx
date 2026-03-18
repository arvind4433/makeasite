import { motion } from "framer-motion";

const Logo = ({ size = 44, showText = true }) => {

  const totalDots = 28;
  const center = 50;
  const radius = 26;

  const dots = Array.from({ length: totalDots }).map((_, i) => {
    const angle = (i / totalDots) * Math.PI * 2;

    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  });

  return (
    <div className="flex items-center gap-2 select-none">

      {/* animated logo */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      >

        {dots.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r="3"
            fill="#ef4444"
            animate={{
              cx: [dot.x, 50, dot.x],
              cy: [dot.y, 50, dot.y],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.circle
          cx="50"
          cy="50"
          r="4"
          fill="#dc2626"
          animate={{
            scale: [0.6, 1.3, 0.6]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

      </motion.svg>

      {/* text */}
      {showText && (
        <div className="leading-tight">
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-gray-900">
            Make<span className="text-red-600">A</span>Site
          </span>
          <div className="text-[10px] uppercase tracking-widest text-gray-500">
            Freelance Studio
          </div>
        </div>
      )}

    </div>
  );
};

export default Logo;
