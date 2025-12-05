import React, { forwardRef, Ref } from "react";
import Link from "next/link";

type CTAProps = {
  visible: boolean;
};

const CTA = forwardRef<HTMLDivElement, CTAProps>(({ visible }, ref) => {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={ref}
          className={`
              relative overflow-hidden rounded-2xl p-10 bg-white border shadow-sm
              flex flex-col md:flex-row md:items-center md:justify-between
              gap-12 md:gap-16
              transition-all duration-[900ms] ease-out
              ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }
            `}
        >
          {/* Background glow */}
          <div
            className={`
                absolute inset-0 opacity-0 
                bg-[radial-gradient(circle_at_center,rgba(0,200,120,0.12),transparent)]
                transition-opacity duration-[1200ms]
                ${visible ? "opacity-100" : "opacity-0"}
              `}
          />

          {/* Text */}
          <div
            className={`
                relative z-[5] max-w-xl space-y-3
                transition-all duration-[1000ms] delay-[150ms]
                ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }
              `}
          >
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Want curated picks delivered?
            </h3>

            <p className="text-neutral-600 text-base leading-relaxed">
              Get expert-picked shortlists and weekly recommendations — no spam,
              just value.
            </p>

            <div className="flex items-center gap-4 pt-2 text-neutral-500 text-sm">
              <span className="text-lg">🛡️</span> No spam ever
              <span className="text-lg">🔒</span> Unsubscribe anytime
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/signup"
            className={`
                relative z-[5] inline-block px-8 py-4 rounded-xl
                bg-[var(--green)] text-white font-semibold shadow-md
                hover:bg-[var(--green-dark)] transition-all duration-300
                ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }
              `}
          >
            Get shortlists →
          </Link>
        </div>
      </div>
    </section>
  );
})

export default CTA;