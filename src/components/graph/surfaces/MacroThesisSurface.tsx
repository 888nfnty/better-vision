import { MACRO_THESIS_CONTENT } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { BetterCard } from "@/components/ui/BetterCard";

export function MacroThesisSurface() {
  return (
    <div className="space-y-6">
      <BetterCard className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <MaturityBadge status="live" />
          <EvidenceHook source={MACRO_THESIS_CONTENT.source} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          {MACRO_THESIS_CONTENT.title}
        </h3>
        <p className="mb-2 text-sm leading-relaxed text-white">
          {MACRO_THESIS_CONTENT.subtitle}
        </p>
        <p className="text-sm leading-relaxed text-white/80">
          {MACRO_THESIS_CONTENT.overview}
        </p>
      </BetterCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {MACRO_THESIS_CONTENT.claims.map((claim) => (
          <BetterCard key={claim.id} className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <MaturityBadge status={claim.status} />
              <EvidenceHook source={claim.source} />
            </div>

            <h4 className="mb-2 text-sm font-semibold text-foreground">
              {claim.title}
            </h4>
            <p className="text-xs leading-relaxed text-white">
              {claim.summary}
            </p>

            {claim.references && claim.references.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 font-terminal text-[11px] uppercase tracking-[-0.08em] text-white/70">
                  Reference frame
                </p>
                <ul className="space-y-1 text-xs text-white/80">
                  {claim.references.map((reference) => (
                    <li key={reference}>• {reference}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 grid gap-3">
              {claim.metrics.map((metric) => (
                <BetterCard key={metric.id} className="p-3">
                  <p className="font-terminal text-[11px] uppercase tracking-[-0.08em] text-white/70">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/80">
                    {metric.detail}
                  </p>
                </BetterCard>
              ))}
            </div>
          </BetterCard>
        ))}
      </div>
    </div>
  );
}
