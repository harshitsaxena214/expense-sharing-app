"use client";

import { Users, Receipt, BarChart3, Shield, Sliders, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Group Expenses",
    description: "Create groups, add members, and track every shared expense in one place.",
  },
  {
    icon: Receipt,
    title: "Easy Splitting",
    description: "Add an expense with a description and amount — it splits evenly across all members automatically.",
  },
  {
    icon: BarChart3,
    title: "Smart Settlements",
    description: "One click to generate who owes whom. Minimized transactions for maximum clarity.",
  },
  {
    icon: Shield,
    title: "Admin Controls",
    description: "Group admins can edit or delete any expense. Full control over your group's finances.",
  },
  {
    icon: Sliders,
    title: "Real-time Tracking",
    description: "See balances update instantly as expenses are added. Always know where you stand.",
  },
  {
    icon: MessageSquare,
    title: "Descriptions",
    description: "Add context to every expense — food, travel, tickets. Know exactly what was paid for.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Features</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Built for speed.</h2>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-muted-foreground mb-12 md:mb-16">Designed for clarity.</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-card p-6 md:p-8 hover:bg-secondary/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;