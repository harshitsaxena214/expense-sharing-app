"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-6">Get Started Today</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
            Your group expenses
          </h2>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-8">
            sorted in seconds.
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10">
            No setup fees. No sign up. Create a group, add expenses, and settle up — all from your browser.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="bg-gradient-primary text-primary-foreground px-10 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Start Splitting →
            </Link>
            <Link
              href="/login"
              className="border border-border px-10 py-4 rounded-lg font-medium hover:bg-secondary transition-colors text-center"
            >
              I have groups
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;