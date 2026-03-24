/**
 * ArchitectureSurface — the "Architecture" graph surface content.
 * Renders architecture section when focused via the graph shell.
 */
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { BetterCard } from "@/components/ui/BetterCard";
import { ARCHITECTURE_SURFACE_ENRICHMENTS } from "@/content";
import { ArchitectureSection } from "@/components/architecture";

export function ArchitectureSurface() {
  return (
    <div className="space-y-8">
      <p className="mb-8 text-sm text-white">
        Hyperliquid/HyperEVM, OpenServ/BRAID, proprietary AI/RL, Polygon
        validators, and phased low-latency execution — the BETTER stack, its
        cost bands, and the compounding flywheel. Content is informational — not
        operational.
      </p>

      <div className="space-y-4" data-testid="architecture-enrichments">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Execution moat additions
          </h3>
          <p className="text-sm text-white">
            The architecture layer now calls out the Rust execution path and the
            BRAID consensus gate that BETTER uses to turn model agreement into a
            deterministic trading stack.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ARCHITECTURE_SURFACE_ENRICHMENTS.map((item) => (
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
            </BetterCard>
          ))}
        </div>
      </div>

      <ArchitectureSection />
    </div>
  );
}
