import { LLM_PRODUCT_CONTENT } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { BetterCard } from "@/components/ui/BetterCard";

export function LlmProductSurface() {
  return (
    <div className="space-y-6">
      <BetterCard className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <MaturityBadge status="planned" />
          <EvidenceHook source={LLM_PRODUCT_CONTENT.source} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          {LLM_PRODUCT_CONTENT.title}
        </h3>
        <p className="mb-2 text-sm leading-relaxed text-white">
          {LLM_PRODUCT_CONTENT.subtitle}
        </p>
        <p className="text-sm leading-relaxed text-white">
          {LLM_PRODUCT_CONTENT.overview}
        </p>
      </BetterCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {LLM_PRODUCT_CONTENT.sections.map((section) => (
          <BetterCard key={section.id} className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <MaturityBadge status={section.status} />
              <EvidenceHook source={section.source} />
            </div>

            <h4 className="mb-2 text-sm font-semibold text-foreground">
              {section.title}
            </h4>
            <p className="text-xs leading-relaxed text-white">
              {section.summary}
            </p>

            <div className="mt-4 grid gap-3">
              {section.metrics.map((metric) => (
                <BetterCard key={metric.id} className="p-3">
                  <p className="font-terminal text-[11px] uppercase tracking-[-0.08em] text-white">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white">
                    {metric.detail}
                  </p>
                </BetterCard>
              ))}
            </div>

            {section.bullets && section.bullets.length > 0 && (
              <div className="mt-4 space-y-2">
                {section.bullets.map((bullet) => (
                  <p key={bullet} className="text-xs leading-relaxed text-white">
                    • {bullet}
                  </p>
                ))}
              </div>
            )}
          </BetterCard>
        ))}
      </div>
    </div>
  );
}
