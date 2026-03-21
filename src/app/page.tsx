export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        id="vision"
        className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-24 text-center"
      >
        <div className="scanline-overlay absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 font-terminal text-sm font-medium uppercase tracking-widest text-accent">
            Ecosystem Vision &amp; Roadmap
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="glow-accent text-accent">BETTER</span>{" "}
            <span className="text-foreground">
              is building the future of prediction-market intelligence
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-secondary">
            AI-native trading, whale-first tokenomics, and a full-stack
            ecosystem spanning prediction markets, social vaults, and
            autonomous agents — from live product to long-range infrastructure.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#roadmap"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              Explore the Roadmap
            </a>
            <a
              href="#tokenomics"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-foreground"
            >
              View Tokenomics
            </a>
          </div>
        </div>
      </section>

      {/* Roadmap placeholder */}
      <section
        id="roadmap"
        className="border-t border-border px-4 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Roadmap"
            title="Ecosystem Roadmap"
            description="Interactive exploration of BETTER's product, infrastructure, and token utility evolution."
          />
          <div className="mt-12 rounded-lg border border-border bg-surface p-12 text-center">
            <p className="font-terminal text-sm text-muted">
              [ Roadmap atlas coming soon ]
            </p>
          </div>
        </div>
      </section>

      {/* Tokenomics placeholder */}
      <section
        id="tokenomics"
        className="border-t border-border px-4 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Tokenomics"
            title="Whale-First Tokenomics"
            description="Access priority, allocation ladders, fee advantages, and agent-native utility."
          />
          <div className="mt-12 rounded-lg border border-border bg-surface p-12 text-center">
            <p className="font-terminal text-sm text-muted">
              [ Tokenomics explorer coming soon ]
            </p>
          </div>
        </div>
      </section>

      {/* Architecture placeholder */}
      <section
        id="architecture"
        className="border-t border-border px-4 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Architecture"
            title="Technical Architecture"
            description="Hyperliquid, HyperEVM, OpenServ, proprietary AI/RL, and phased infrastructure evolution."
          />
          <div className="mt-12 rounded-lg border border-border bg-surface p-12 text-center">
            <p className="font-terminal text-sm text-muted">
              [ Architecture explorer coming soon ]
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <p className="mb-2 font-terminal text-xs font-medium uppercase tracking-widest text-accent">
        {label}
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary">
        {description}
      </p>
    </div>
  );
}
