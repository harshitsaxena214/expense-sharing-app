"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-glow" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(230 15% 18% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(230 15% 18% / 0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
        }}
      />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 mb-6 md:mb-8">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                Expense Splitting App
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 md:mb-6">
              Split expenses <span className="text-gradient">with ease,</span>{" "}
              settle with clarity.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-6 md:mb-8">
              SplitEase helps groups track shared expenses effortlessly. Add
              what you paid, and we calculate who owes whom — simple, fair, and
              transparent.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="bg-gradient-primary text-primary-foreground px-8 py-3.5 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                Create Free Account →
              </Link>
              <Link
                href="/login"
                className="border border-border px-8 py-3.5 rounded-lg font-medium hover:bg-secondary transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Mock wallet card */}
          <motion.div
            className="mt-8 lg:mt-0"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-glow">
                {/* Incoming notification */}
                <div className="flex items-center justify-between bg-secondary rounded-xl p-3 md:p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-success text-sm">↓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">From @professor</p>
                      <p className="text-xs text-muted-foreground">2 min ago</p>
                    </div>
                  </div>
                  <span className="text-success font-bold">+₹1,200</span>
                </div>

                <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                  Group Balance
                </p>
                <p className="text-3xl md:text-4xl font-display font-bold mb-4">
                  ₹24,850
                  <span className="text-muted-foreground">.00</span>
                </p>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">
                    Total expenses
                  </span>
                  <span className="text-xs">₹4,200 / ₹10,000</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full mb-4">
                  <motion.div
                    className="h-full bg-gradient-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "42%" }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider uppercase">
                      Group
                    </p>
                    <p className="font-medium">Weekend Trip</p>
                  </div>
                </div>
              </div>

              {/* Outgoing notification */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="text-destructive text-xs">↑</span>
                </div>
                <div>
                  <p className="text-xs font-medium">To @berlin</p>
                  <p className="text-[10px] text-muted-foreground">Just now</p>
                </div>
                <span className="text-destructive font-bold text-sm">
                  −₹500
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
