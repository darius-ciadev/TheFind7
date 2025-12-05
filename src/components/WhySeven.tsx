"use client";

import { motion } from "framer-motion";

export default function WhySeven() {
  const features = [
    {
      icon: "🧠",
      title: "The science of less",
      desc: "Research shows fewer options reduce cognitive load and improve purchase confidence.",
    },
    {
      icon: "📈",
      title: "10,000+ items analyzed",
      desc: "We score durability, performance, price, expertise, and user trust to find the standouts.",
    },
    {
      icon: "🏆",
      title: "Only winners, no filler",
      desc: "No sponsored junk, no weak contenders. Just the top 7 — every time.",
    },
    {
      icon: "✔️",
      title: "Transparent methodology",
      desc: "Our scoring is clear, repeatable, and bias-free — built to earn your trust.",
    },
  ];

  const miniFramework = [
    "Durability",
    "Performance",
    "Price fairness",
    "User trust",
    "Longevity",
    "Brand credibility",
    "Expert evaluation",
  ];

  return (
    <section className="relative py-32 overflow-hidden">

      {/* 🌟 Ambient Glow Behind Section */}
      <div
        className="
          absolute top-[10%] left-1/2 -translate-x-1/2 
          w-[900px] h-[900px]
          bg-[radial-gradient(circle,rgba(0,255,174,0.16),transparent_70%)]
          blur-3xl opacity-60 pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl md:text-4xl font-extrabold tracking-tight text-[--find7-color-neutral]"
        >
          Why we choose <span className="text-[--find7-color-primary]">7 Picks</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center text-neutral-600 max-w-2xl mx-auto mt-4 text-[--find7-color-neutral]"
        >
          Decision science proves it: fewer options → smarter choices.  
          We analyze thousands of products so you only see the 7 that matter.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="
                relative bg-white border rounded-2xl p-8 shadow-sm 
                hover:-translate-y-2
                transition-all duration-300 group cursor-default
                hover:border-[var(--green)]
              "
            >
              {/* Icon Glow Aura */}
              <div
                className="
                  absolute -top-6 left-1/2 -translate-x-1/2 
                  w-20 h-20 opacity-0 group-hover:opacity-60
                  bg-[radial-gradient(circle,var(--green),transparent_70%)]
                  blur-xl rounded-full transition-all duration-500
                "
              />

              {/* Icon */}
              <div className="text-4xl mb-4 relative z-10 transition-transform group-hover:scale-110">
                {f.icon}
              </div>

              <h3 className="font-semibold text-lg text-[--find7-color-primary] mb-2 relative z-10">
                {f.title}
              </h3>

              <p className="text-[--find7-color-neutral] text-sm leading-relaxed relative z-10">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mini Framework */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h4 className="text-center text-[--find7-color-primary] font-medium mb-6">
            Our 7-point evaluation framework
          </h4>

          <div className="
            grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-[--find7-color-primary]
          ">
            {miniFramework.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-2"
              >
                <span className="text-[var(--green)] text-base drop-shadow-[0_0_6px_var(--green)]">
                  ✔
                </span>
                {point}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}