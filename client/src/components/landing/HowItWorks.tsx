"use client";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Create a Group",
    description:
      "Start a new group and add all the members who'll be sharing expenses.",
  },
  {
    num: "02",
    title: "Add Expenses",
    description:
      "Each member adds what they paid — amount, description, and it splits automatically.",
  },
  {
    num: "03",
    title: "Generate Settlements",
    description:
      "Hit generate and see exactly who owes whom. Simple, fair, done.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">
            How It Works
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            Three steps to{" "}
            <span className="text-muted-foreground">
              your first settlement.
            </span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 md:mt-16">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-3xl font-bold text-primary/60">
                  {s.num}
                </span>
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
