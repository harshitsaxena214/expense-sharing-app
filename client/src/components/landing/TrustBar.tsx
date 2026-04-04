"use client";

import { motion } from "framer-motion";

const items = [
  "FAIR SPLITTING",
  "GROUP EXPENSES",
  "INSTANT SETTLEMENTS",
  "ZERO FEES",
  "SIMPLE & CLEAN",
];

const TrustBar = () => {
  return (
    <motion.div
      className="border-y border-border py-5 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex flex-wrap justify-center gap-6 md:gap-16">
        {items.map((item, i) => (
          <motion.div
            key={item}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-xs tracking-widest text-muted-foreground uppercase">{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrustBar;