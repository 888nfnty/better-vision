/**
 * Tests for visible on-chain citation links in allocation rows.
 *
 * Feature: correction-on-chain-citations-visible-links-fix
 *
 * Validates that:
 * - Every allocation row has a DIRECT, VISIBLE clickable basescan or Dune link
 *   (not just hidden in SourceCue.note metadata)
 * - Allocation-specific evidence details (wallet addresses, verification method)
 *   are surfaced as visible hook copy in the rendered UI
 * - Users can click through to verify each allocation's on-chain source directly
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import SupplyAllocation from "../SupplyAllocation";
import { TOKEN_ALLOCATIONS } from "@/content";

describe("On-Chain Citations — Visible Links Fix", () => {
  beforeEach(() => {
    render(<SupplyAllocation />);
  });

  it("every allocation row contains a directly visible clickable link to basescan or Dune", () => {
    const rows = screen.getAllByTestId("allocation-row");
    expect(rows.length).toBe(TOKEN_ALLOCATIONS.length);

    for (const row of rows) {
      const links = within(row).getAllByRole("link");
      const onChainLinks = links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
      expect(onChainLinks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every allocation row surfaces allocation-specific evidence details as visible text", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (const row of rows) {
      // The source.note contains evidence details (wallet addresses, verification)
      // These must be visible in the row, not hidden in metadata
      const evidenceDetail = within(row).queryByTestId("allocation-evidence-detail");
      expect(evidenceDetail).not.toBeNull();
      // The evidence detail should contain some text content
      expect(evidenceDetail!.textContent!.trim().length).toBeGreaterThan(0);
    }
  });

  it("each allocation's visible link href matches the allocation source href", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const alloc = TOKEN_ALLOCATIONS[i];
      if (alloc.source.href) {
        const links = within(row).getAllByRole("link");
        const matchingLink = links.find(
          (l) => l.getAttribute("href") === alloc.source.href,
        );
        expect(matchingLink).toBeDefined();
      }
    }
  });

  it("visible evidence details mention wallet addresses from source.note", () => {
    const rows = screen.getAllByTestId("allocation-row");

    // Check at least the top allocations (Team, Treasury, SERV) which have specific addresses
    for (let i = 0; i < Math.min(3, rows.length); i++) {
      const row = rows[i];
      const alloc = TOKEN_ALLOCATIONS[i];
      // Extract address fragment from note
      const addressMatch = alloc.source.note?.match(/0x[a-fA-F0-9]{4,}/);
      if (addressMatch) {
        const shortAddr = addressMatch[0].slice(0, 8);
        const evidenceDetail = within(row).getByTestId("allocation-evidence-detail");
        expect(evidenceDetail.textContent).toContain(shortAddr);
      }
    }
  });

  it("every allocation link opens in a new tab (target=_blank)", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (const row of rows) {
      const links = within(row).getAllByRole("link");
      const onChainLinks = links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
      for (const link of onChainLinks) {
        expect(link.getAttribute("target")).toBe("_blank");
      }
    }
  });

  it("visible link text includes verification method hint (Basescan or Dune)", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (const row of rows) {
      const links = within(row).getAllByRole("link");
      const onChainLinks = links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
      for (const link of onChainLinks) {
        const text = link.textContent ?? "";
        const mentionsSource =
          text.toLowerCase().includes("basescan") ||
          text.toLowerCase().includes("dune") ||
          text.includes("↗");
        expect(mentionsSource).toBe(true);
      }
    }
  });
});
