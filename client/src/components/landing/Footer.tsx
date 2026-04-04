import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-bold">
          Split<span className="text-primary">Ease</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          © 2026 SplitEase. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
