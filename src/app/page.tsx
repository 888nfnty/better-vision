import dynamic from "next/dynamic";
import { HeroVisualSystem } from "@/components/visual";
import { Section } from "@/components/ui";
import { CompactBrandBand } from "@/components/graph/CompactBrandBand";
import { LazyGraphExplorer } from "@/components/graph/LazyGraphExplorer";
import { ProofModuleSkeleton } from "@/components/skeletons";

/**
 * Dynamic imports for below-fold content — aggressive bundle splitting.
 *
 * VAL-VISUAL-027: ProofModule (below-fold content) is dynamically imported
 * so it does not block first meaningful paint. The GraphExplorer is loaded
 * via LazyGraphExplorer (a client component that uses next/dynamic with
 * ssr:false) to ensure the graph workspace and its heavy dependencies
 * load entirely on the client after first paint.
 */
const ProofModule = dynamic(
  () => import("@/components/ProofModule"),
  {
    loading: () => <ProofModuleSkeleton />,
  }
);

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ---------------------------------------------------------------- */}
      {/* Graph-First Workspace — DEFAULT loaded exploration state         */}
      {/* VAL-ROADMAP-014: Pure graph workspace is primary visible surface */}
      {/* VAL-ROADMAP-015: Guided investor pitch path through ordered gates*/}
      {/* VAL-ROADMAP-017: Start affordance + resumable progress          */}
      {/* VAL-CROSS-014: Investor-path entry from default graph workspace */}
      {/* VAL-VISUAL-026: Single hero/brand surface inside graph workspace*/}
      {/*                                                                  */}
      {/* The graph workspace is the FIRST and ONLY above-the-fold section.*/}
      {/* A compact brand band (logotype + tagline) is server-rendered     */}
      {/* directly at the top of the atlas for content-first display, then */}
      {/* the graph explorer loads below it. No full hero section exists.  */}
      {/* The HeroVisualSystem wraps the entire atlas for immersive bg.    */}
      {/* ---------------------------------------------------------------- */}
      <Section id="atlas" divider="none" container="wide" spacing="hero">
        <HeroVisualSystem>
          <div>
            {/* Compact brand treatment — server-rendered for content-first */}
            <CompactBrandBand />

            {/* Graph explorer — the explorable mindmap (lazy-loaded) */}
            <LazyGraphExplorer />
          </div>
        </HeroVisualSystem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof / Trust Surface — VAL-NARR-013, VAL-CROSS-009            */}
      {/* Appears below the atlas as supplementary proof.                 */}
      {/* Users who select the Proof graph node get proof content inline  */}
      {/* via the graph shell; this module provides additional trust       */}
      {/* context for users who scroll past the atlas.                    */}
      {/* ---------------------------------------------------------------- */}
      <ProofModule />
    </div>
  );
}
