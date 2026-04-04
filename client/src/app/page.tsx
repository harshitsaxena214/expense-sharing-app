import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <span className="font-bold text-lg">
          Split<span className="text-indigo-400">Ease</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Get Started →
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex items-center px-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-gray-400 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            EXPENSE SPLITTING APP
          </div>
          <h1 className="text-6xl font-bold leading-tight">
            Split expenses{" "}
            <span className="text-indigo-400">with ease</span>, settle with
            clarity.
          </h1>
          <p className="text-gray-400 text-lg">
            SplitEase helps groups track shared expenses effortlessly. Add what
            you paid, and we calculate who owes whom — simple, fair, and
            transparent.
          </p>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Create Free Account →
            </Link>
            <Link
              href="/login"
              className="border border-white/20 hover:border-white/40 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}