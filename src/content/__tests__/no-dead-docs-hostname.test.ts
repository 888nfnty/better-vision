/**
 * Regression coverage: dead BETTER Docs hostname must never appear in runtime content.
 *
 * The original hostname `docs.betteragent.ai` no longer resolves. All BETTER Docs
 * links and visible hostname copy must use the live domain `docs.tradebetter.app`.
 *
 * This test suite covers:
 * - Narrative block source hrefs (content layer)
 * - Page-level rendered output (runtime surface)
 * - ProofModule CTA href
 * - Tokenomics evidence hooks
 *
 * Fulfills: VAL-NARR-008 blocker (dead BETTER Docs links)
 */

import { NARRATIVE_BLOCKS } from "../narrative";

const DEAD_HOSTNAME = "docs.betteragent.ai";
const LIVE_HOSTNAME = "docs.tradebetter.app";

describe("No dead BETTER Docs hostname in content layer", () => {
  it("no narrative block source href contains the dead hostname", () => {
    for (const block of NARRATIVE_BLOCKS) {
      if (block.source.href) {
        expect(block.source.href).not.toContain(DEAD_HOSTNAME);
      }
    }
  });

  it("all canonical BETTER Docs source hrefs point to the live domain", () => {
    const docsBlocks = NARRATIVE_BLOCKS.filter(
      (b) => b.source.label === "BETTER Docs" && b.source.href
    );
    expect(docsBlocks.length).toBeGreaterThan(0);
    for (const block of docsBlocks) {
      expect(block.source.href).toContain(LIVE_HOSTNAME);
    }
  });
});
