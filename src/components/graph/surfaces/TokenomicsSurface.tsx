/**
 * TokenomicsSurface — the "Tokenomics" graph surface content.
 * Renders tokenomics section when focused via the graph shell.
 */
import EvidenceHook from "@/components/EvidenceHook";
import MaturityBadge from "@/components/MaturityBadge";
import { BetterCard } from "@/components/ui/BetterCard";
import { TOKENOMICS_SURFACE_ENRICHMENTS } from "@/content";
import { TokenomicsSection } from "@/components/tokenomics";

export function TokenomicsSurface() {
  return (
    <div className="space-y-8">
      <p className="mb-8 text-sm text-white">
        Reconciled supply math, whale-first tier ladders, fee advantages,
        scenario projections, and agent-native utility. Content is
        exploration-only — not a live trading interface.
      </p>

      <div className="space-y-4" data-testid="tokenomics-enrichments">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Flywheel revenue additions
          </h3>
          <p className="text-sm text-white">
            BETTER&apos;s token layer now separates the live treasury tax rail
            from the planned arbitrage flywheel that eventually compounds into
            the TRUTH-PERP end state.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {TOKENOMICS_SURFACE_ENRICHMENTS.map((item) => (
            <BetterCard key={item.id} className="p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <MaturityBadge status={item.status} />
                <EvidenceHook source={item.source} />
              </div>

              <h4 className="mb-2 text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <p className="mb-3 text-sm leading-relaxed text-white">
                {item.body}
              </p>
              <ul className="space-y-2 text-sm text-white">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {item.ctaHref && item.ctaLabel && (
                <a
                  href={item.ctaHref}
                  className="mt-4 inline-flex text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                >
                  {item.ctaLabel}
                </a>
              )}
            </BetterCard>
          ))}
        </div>
      </div>

      <TokenomicsSection />
    </div>
  );
}
