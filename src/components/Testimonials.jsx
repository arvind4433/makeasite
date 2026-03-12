import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

/* testimonials data */
const testimonials = [
  {
    body: "Working with MakeASite was a game-changer.",
    name: "Sarah Jenkins",
    role: "CEO",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    rating: 5,
  },
  {
    body: "Excellent communication and amazing result.",
    name: "Michael Chen",
    role: "Founder",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=200",
    rating: 5,
  },
  {
    body: "Beautiful UI and clean code.",
    name: "Emily Rodriguez",
    role: "Product Manager",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
    rating: 5,
  },
  {
    body: "Our conversion rate increased 40%.",
    name: "Rahul Sharma",
    role: "Marketing Head",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    rating: 5,
  },
  {
    body: "Premium design and bug-free delivery.",
    name: "Priya Mehta",
    role: "CTO",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    rating: 5,
  },
];

/* card component */

const Card = ({ t }) => (
  <div className="bg-white rounded-2xl p-6 shadow-md h-full flex flex-col">
    <Quote className="text-red-500 mb-3" />

    <div className="flex mb-3">
      {[...Array(t.rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-red-500 fill-red-500" />
      ))}
    </div>

    <p className="text-gray-600 text-sm mb-6 flex-grow">"{t.body}"</p>

    <div className="flex items-center gap-3 border-t pt-4">
      <img src={t.avatar} className="w-10 h-10 rounded-full" />
      <div>
        <div className="font-semibold text-sm">{t.name}</div>
        <div className="text-xs text-gray-500">{t.role}</div>
      </div>
    </div>
  </div>
);

/* main component */

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  /* responsive cards */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(2);
      else setVisible(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => {
    if (index < testimonials.length - visible) {
      setIndex(index + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          Trusted by <span className="text-red-600">businesses</span>
        </h2>

        <div className="flex items-center gap-4">

          {/* left button */}
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-12 h-12 border rounded-full flex items-center justify-center disabled:opacity-30"
          >
            <ChevronLeft />
          </button>

          {/* slider */}
        <div className="overflow-hidden flex-1">

  <motion.div
    animate={{ x: `-${index * (100 / visible)}%` }}
    transition={{ type: "spring", stiffness: 120, damping: 20 }}
    className="flex"
  >
    {testimonials.map((t, i) => (
      <div
        key={i}
        style={{ minWidth: `${100 / visible}%` }}
        className="px-3"
      >
        <Card t={t} />
      </div>
    ))}
  </motion.div>

</div>

          {/* right button */}
          <button
            onClick={next}
            disabled={index >= testimonials.length - visible}
            className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center disabled:opacity-30"
          >
            <ChevronRight />
          </button>

        </div>

      </div>
    </section>
  );
}