import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    body: "MakeASite took our rough idea and turned it into a polished website that finally feels like a real business brand.",
    name: "Jack Wilson",
    role: "Startup Founder, USA",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Jack%20Wilson",
    rating: 5,
  },
  {
    body: "The team was responsive, practical, and very fast. We launched on time and the final UI looked much better than we expected.",
    name: "Harry Miller",
    role: "Consultant, UK",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Harry%20Miller",
    rating: 5,
  },
  {
    body: "Our service pages became clearer, cleaner, and much easier for clients to understand. It immediately improved trust.",
    name: "Mohit Kumar",
    role: "Agency Owner, India",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mohit%20Kumar",
    rating: 5,
  },
  {
    body: "They handled the design and flow very professionally. The website now looks modern and performs smoothly on mobile too.",
    name: "Rohit Sharma",
    role: "Business Manager, India",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Rohit%20Sharma",
    rating: 5,
  },
  {
    body: "The delivery was structured and reliable. Every revision request was handled clearly, without confusion or delay.",
    name: "Li Wei",
    role: "Operations Lead, China",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Li%20Wei",
    rating: 5,
  },
  {
    body: "We needed a clean business website with strong visuals, and MakeASite delivered exactly that with great attention to detail.",
    name: "Zhang Ming",
    role: "Product Director, China",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Zhang%20Ming",
    rating: 5,
  },
  {
    body: "The process was smooth from start to finish. Communication stayed clear and the final output felt premium.",
    name: "Rahim Ahmed",
    role: "Retail Owner, Bangladesh",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Rahim%20Ahmed",
    rating: 5,
  },
  {
    body: "We saw immediate improvement in how customers perceived our company. The site feels trustworthy and professionally built.",
    name: "Tanvir Hasan",
    role: "Marketing Lead, Bangladesh",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Tanvir%20Hasan",
    rating: 5,
  },
  {
    body: "The landing page structure, typography, and overall polish gave our brand the confidence boost it really needed.",
    name: "Sophia Carter",
    role: "Creative Strategist, Canada",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia%20Carter",
    rating: 5,
  },
  {
    body: "Professional work, strong design sense, and a very clean execution. It felt like working with a dependable product team.",
    name: "Daniel Brooks",
    role: "Service Founder, Australia",
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Daniel%20Brooks",
    rating: 5,
  },
];

const Card = ({ testimonial }) => (
  <article
    className="h-full rounded-[26px] p-6 sm:p-7 flex flex-col"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-card)",
    }}
  >
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-red-500 fill-red-500" />
        ))}
      </div>
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626" }}
      >
        <Quote className="w-4 h-4" />
      </div>
    </div>

    <p className="text-sm sm:text-[15px] leading-7 flex-grow" style={{ color: "var(--text-secondary)" }}>
      "{testimonial.body}"
    </p>

    <div className="mt-6 pt-4 flex items-center gap-3 border-t" style={{ borderColor: "var(--border)" }}>
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover border"
        style={{ borderColor: "var(--border-strong)", background: "var(--bg-card-inner)" }}
      />
      <div className="min-w-0">
        <div className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
          {testimonial.name}
        </div>
        <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
          {testimonial.role}
        </div>
      </div>
    </div>
  </article>
);

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);

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
      setIndex((current) => current + 1);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((current) => current - 1);
    }
  };

  return (
    <section className="py-24 sm:py-28" style={{ background: "var(--bg-base)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16">
          <div className="badge-red mb-4">Testimonials</div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
            Trusted by clients from <span className="gradient-text">different parts of the world</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-7" style={{ color: "var(--text-secondary)" }}>
            Real feedback from founders, business owners, and teams who wanted a cleaner, stronger online presence.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={prev}
            disabled={index === 0}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            aria-label="Previous testimonials"
          >
            <ChevronLeft />
          </button>

          <div className="overflow-hidden flex-1">
            <motion.div
              animate={{ x: `-${index * (100 / visible)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="flex"
            >
              {testimonials.map((testimonial, i) => (
                <div key={`${testimonial.name}-${i}`} style={{ minWidth: `${100 / visible}%` }} className="px-2 sm:px-3">
                  <Card testimonial={testimonial} />
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={next}
            disabled={index >= testimonials.length - visible}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white disabled:opacity-30"
            style={{ background: "linear-gradient(135deg, #dc2626, #f97316)" }}
            aria-label="Next testimonials"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
