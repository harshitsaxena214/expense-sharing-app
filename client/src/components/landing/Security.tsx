"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const checks = [
  "Quick sign-up, seamless experience",
  "Secure cloud storage for your data",
  "Sync across devices effortlessly",
  "Full control over your groups and expenses",
  "Clear, transparent calculations",
  "Smart and fair expense splitting",
];

const securityItems = [
  { title: "Data Storage", detail: "Secure cloud", status: "Private" },
  { title: "Splitting Logic", detail: "Equal share", status: "Fair" },
  { title: "Settlements", detail: "Minimized transfers", status: "Optimal" },
  { title: "Group Control", detail: "Admin edits", status: "Secure" },
  { title: "History", detail: "Full audit trail", status: "Complete" },
];

const Security = () => {
  return (
    <section id="security" className="py-16 md:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Security</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              Your data is{" "}
              <span className="text-muted-foreground">always private.</span>
            </h2>
            <p className="text-muted-foreground mt-6 mb-8 max-w-lg">
              SplitEase runs entirely in your browser. No servers, no accounts, no tracking. Your expense data never leaves your device.
            </p>
            <div className="space-y-4">
              {checks.map((c, i) => (
                <motion.div
                  key={c}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{c}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="bg-card border border-border rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {securityItems.map((item, i) => (
              <div
                key={item.title}
                className={`flex items-center justify-between p-4 md:p-5 ${i !== securityItems.length - 1 ? "border-b border-border" : ""}`}
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {item.status}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Security;