import { Link } from "react-router";
import { CodeBlock } from "../components/shared/CodeBlock";
import {
  Code,
  MessageSquare,
  Users,
  Zap,
  Github,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useTheme } from "../hooks/useTheme";
import { useNavigate } from "react-router";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
const sampleCode = `function calculateFibonacci(n: number): number {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

const result = calculateFibonacci(10);`;

const sampleComments = [
  {
    line: 3,
    author: "Sarah Chen",
    avatar: "",
    text: "Consider memoization here — exponential time complexity O(2ⁿ) will hurt at scale.",
    timestamp: "2 hours ago",
  },
];

const features = [
  {
    icon: Code,
    title: "Line-by-line feedback",
    description:
      "Comment on specific lines with full context. Amber indicators show exactly where reviewers left notes.",
  },
  {
    icon: MessageSquare,
    title: "Threaded discussions",
    description:
      "Each comment anchors to its line number. Track conversations about specific implementation details.",
  },
  {
    icon: Users,
    title: "Peer review network",
    description:
      "Request reviews from specific developers. Track average response times and review quality scores.",
  },
];

/* ─── Theme Toggle ───────────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center w-[72px] h-[36px] rounded-full p-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{
        background: isDark ? "#1a1917" : "#e2e0db",
        border: "1px solid var(--border)",
      }}
    >
      {/* Sun icon — left side */}
      <span
        className="absolute left-2.5 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: isDark ? 0.45 : 1 }}
      >
        <Sun
          className="w-4 h-4"
          style={{ color: isDark ? "#8a8880" : "#d97b4f" }}
          strokeWidth={1.8}
        />
      </span>

      {/* Moon icon — right side */}
      <span
        className="absolute right-2.5 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: isDark ? 1 : 0.45 }}
      >
        <Moon
          className="w-[14px] h-[14px]"
          style={{ color: isDark ? "#ffffff" : "#8a8880" }}
          strokeWidth={1.8}
        />
      </span>

      {/* Sliding pill */}
      <span
        className="absolute top-[3px] w-[28px] h-[28px] rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-in-out"
        style={{
          left: isDark ? "calc(100% - 31px)" : "3px",
          background: isDark ? "#2563eb" : "#ffffff",
          boxShadow: isDark
            ? "0 2px 8px rgba(37,99,235,0.5)"
            : "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        ) : (
          <Sun className="w-3.5 h-3.5 text-[#d97b4f]" strokeWidth={2} />
        )}
      </span>
    </button>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-[var(--surface)] sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-mono-display">Critiq</h1>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme toggle */}
            <ThemeToggle />

            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0"
                  >
                    Start reviewing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono-display mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Peer Code Reviews
          </div>
          <h1 className="font-mono-display mb-6 text-foreground">
            Your code,
            <br />
            reviewed.
          </h1>
          <p className="text-base sm:text-lg text-[var(--muted)] mb-10 max-w-2xl leading-relaxed">
            A developer-focused platform for peer code reviews. Submit snippets,
            request feedback, and leave inline comments on specific lines.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0">
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Sign in</Button>
            </Link>
          </div>
        </div>

        {/* Code preview */}
        <div className="mt-14 max-w-3xl">
          <CodeBlock
            code={sampleCode}
            language="typescript"
            comments={sampleComments}
            maxHeight="none"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="mb-10">
          <p className="text-xs font-mono-display uppercase tracking-widest text-[var(--muted)] mb-3">
            Features
          </p>
          <h2 className="text-foreground">Built for code quality</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 bg-[var(--surface)] border border-border rounded-md hover:border-[var(--accent)]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-[var(--secondary)] flex items-center justify-center mb-4 border border-border">
                <f.icon className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h3 className="text-base font-medium mb-2 text-foreground">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="bg-[var(--surface)] border border-[var(--accent)]/20 rounded-md p-8 sm:p-14 text-center">
          <Zap className="w-10 h-10 mx-auto mb-4 text-[var(--accent)]" />
          <h2 className="mb-4 text-foreground">Ready to improve your code?</h2>
          <p className="text-[var(--muted)] mb-8 max-w-md mx-auto text-sm">
            Join developers who trust Critiq with their code reviews.
          </p>
          <Link to="/register">
            <Button className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0">
              Start reviewing
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--surface)] border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-base font-mono-display mb-1">Critiq</h2>
              <p className="text-xs text-[var(--muted)]">
                Precise code reviews for developers.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-[var(--muted)] hover:text-foreground transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-sm text-[var(--muted)] hover:text-foreground transition-colors"
              >
                API
              </a>
              <a
                href="#"
                className="text-[var(--muted)] hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-xs text-[var(--muted)]">
            © 2026 Critiq. Built for developers who care about code quality.
          </div>
        </div>
      </footer>
    </div>
  );
}
