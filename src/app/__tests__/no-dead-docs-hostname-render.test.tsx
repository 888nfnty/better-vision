/**
 * Render-level regression: the dead `docs.betteragent.ai` hostname must never
 * appear in rendered hrefs or visible hostname copy on the landing page.
 *
 * Fulfills: VAL-NARR-008 blocker (dead BETTER Docs links)
 */

import { render } from "@testing-library/react";
import Home from "../page";

const DEAD_HOSTNAME = "docs.betteragent.ai";

describe("No dead BETTER Docs hostname in rendered page", () => {
  it("no anchor href contains the dead hostname", () => {
    const { container } = render(<Home />);
    const links = container.querySelectorAll("a[href]");
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      expect(href).not.toContain(DEAD_HOSTNAME);
    }
  });

  it("no visible text content renders the dead hostname", () => {
    const { container } = render(<Home />);
    const textContent = container.textContent ?? "";
    expect(textContent).not.toContain(DEAD_HOSTNAME);
  });

  it("BETTER Docs links point to the live domain", () => {
    const { container } = render(<Home />);
    const links = Array.from(container.querySelectorAll("a[href]"));
    const docsLinks = links.filter(
      (l) =>
        (l.getAttribute("href") ?? "").includes("docs.tradebetter.app") ||
        (l.textContent ?? "").toLowerCase().includes("docs")
    );
    // There should be docs links and all should use the live domain
    expect(docsLinks.length).toBeGreaterThan(0);
    for (const link of docsLinks) {
      expect(link.getAttribute("href")).toContain("docs.tradebetter.app");
    }
  });
});
