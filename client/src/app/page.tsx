import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Security from "@/components/landing/Security";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import LandingRedirect from "@/components/landing/LandingRedirect";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <LandingRedirect />
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}
