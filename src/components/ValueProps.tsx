"use client";

import { motion } from "framer-motion";

export default function ValueProps() {
  const features = [
    {
      icon: "✨",
      title: "Expert-curated picks",
      desc: "Only the 7 products that actually matter.",
    },
    {
      icon: "⚡",
      title: "Save hours of research",
      desc: "Skip the noise — get fast, confident picks.",
    },
    {
      icon: "🛡️",
      title: "Trustworthy & unbiased",
      desc: "Real evaluation. No fake reviews.",
    },
    {
      icon: "📊",
      title: "Clear comparisons",
      desc: "Value, performance, and reliability simplified.",
    },
  ];

  return (
    <section className="w-full py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Centered heading (premium touch) */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-bold text-3xl md:text-4xl text-gray-900 mb-20 tracking-tight"
        >
          Why people trust <span className="text-[var(--green)]">The Find 7</span>
        </motion.h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="
                bg-white border rounded-2xl p-8 
                shadow-[0_2px_6px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                transition-all duration-300 
                hover:-translate-y-[6px]
                text-center
              "
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{f.icon}</div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}