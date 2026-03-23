import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Hero composition tests for the tradebetter-led redesign.
 *
 * Updated for graph-first ordering: the old hero-section is replaced by
 * a compact brand band (data-testid="compact-brand-band") that integrates
 * logotype, tagline, status framing, and CTAs without being a full hero.
 *
 * VAL-NARR-011: The first viewport reads as one poster-like composition.
 * VAL-NARR-012: BETTER brand is dominant above the fold.
 * VAL-NARR-001: Hero explains BETTER in plain language.
 * VAL-NARR-002: Hero separates live product reality from future vision
 *               without relying on split-card pattern.
 * VAL-NARR-010: CTAs honest about destination with live path prominent.
 */
describe("Hero poster-like composition (VAL-NARR-011)", () => {
  it("compact brand band exists as one composition container", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    expect(brand).toBeInTheDocument();
  });

  it("brand band does NOT contain split side-by-side card panels", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const splitCards = brand.querySelectorAll(
      '[data-testid="hero-split-card"]'
    );
    expect(splitCards.length).toBe(0);
  });

  it("brand band contains a single dominant brand heading with logotype", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const heading = within(brand).getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    // The heading now contains the logotype image instead of text
    const logotype = heading.querySelector('img[data-testid="hero-logotype"]');
    expect(logotype).toBeInTheDocument();
  });

  it("hero visual system wraps the composition", () => {
    render(<Home />);
    const visualSystem = screen.getByTestId("hero-visual-system");
    expect(visualSystem).toBeInTheDocument();
    // Content should be inside the visual system
    const heroContent = within(visualSystem).getByTestId("hero-content");
    expect(heroContent).toBeInTheDocument();
  });
});

describe("BETTER brand dominance (VAL-NARR-012)", () => {
  it("BETTER logotype is the dominant above-the-fold brand signal", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const h1 = within(brand).getByRole("heading", { level: 1 });
    // The h1 should contain the BETTER logotype image (VAL-VISUAL-019)
    const logotypeImg = h1.querySelector('img[data-testid="hero-logotype"]');
    expect(logotypeImg).toBeInTheDocument();
    expect(logotypeImg!.getAttribute("alt")).toContain("BETTER");
  });

  it("brand band has a tagline below the brand mark", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const tagline = within(brand).getByTestId("hero-tagline");
    expect(tagline).toBeInTheDocument();
    expect(tagline.textContent!.length).toBeGreaterThan(10);
  });
});

describe("Plain-language definition (VAL-NARR-001)", () => {
  it("brand band contains a plain-language definition of BETTER", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    // Should contain the definition text
    expect(brand.textContent).toMatch(/prediction-market intelligence/i);
  });
});

describe("Live vs future framing without split cards (VAL-NARR-002)", () => {
  it("brand band conveys live product reality with honest availability qualifier", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    // Live framing should be present in the brand band
    const liveIndicator = within(brand).getByTestId("hero-live-status");
    expect(liveIndicator).toBeInTheDocument();
    expect(liveIndicator.textContent).toMatch(/closed beta|early access|limited access|beta/i);
  });

  it("hero live-status does NOT use generic shipping-now phrasing without qualifier", () => {
    render(<Home />);
    const liveIndicator = screen.getByTestId("hero-live-status");
    const text = liveIndicator.textContent ?? "";
    const hasQualifier = /closed beta|early access|limited access|beta/i.test(text);
    if (/shipping now|available now/i.test(text)) {
      expect(hasQualifier).toBe(true);
    }
  });

  it("brand band conveys future vision", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const futureIndicator = within(brand).getByTestId("hero-future-status");
    expect(futureIndicator).toBeInTheDocument();
    expect(futureIndicator.textContent).toMatch(/vision|roadmap|planned|ahead|building/i);
  });

  it("live and future framing use inline/condensed layout, not split cards", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const framingContainer = within(brand).getByTestId("hero-status-framing");
    expect(framingContainer).toBeInTheDocument();
    const oldSplitCards = framingContainer.querySelectorAll('[data-testid="hero-split-card"]');
    expect(oldSplitCards.length).toBe(0);
  });
});

describe("Evidence and caveats in brand band (VAL-NARR-008, VAL-NARR-009)", () => {
  it("brand band contains at least one evidence hook", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const hooks = brand.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });

  it("brand band contains caveat framing for future-facing claims", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const caveats = brand.querySelectorAll('[data-testid="caveat-frame"]');
    expect(caveats.length).toBeGreaterThan(0);
  });
});

describe("CTA hierarchy and honesty (VAL-NARR-010)", () => {
  it("primary CTA leads to live product or proof surface", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta).toBeInTheDocument();
    const href = primaryCta.getAttribute("href");
    expect(href).toMatch(/#(graph-)?(live-now|proof)|https:\/\/.*betteragent|#evidence/);
  });

  it("secondary CTA leads to roadmap exploration", () => {
    render(<Home />);
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta).toBeInTheDocument();
    const href = secondaryCta.getAttribute("href");
    expect(href).toMatch(/#(graph-)?roadmap/);
  });

  it("CTA labels are honest about their destinations", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(primaryCta.textContent).toMatch(/live|product|see|try/i);
    expect(secondaryCta.textContent).toMatch(/explore|roadmap|vision/i);
  });
});

describe("Maturity badges in brand band (VAL-NARR-006 regression)", () => {
  it("brand band renders maturity badges", () => {
    render(<Home />);
    const brand = screen.getByTestId("compact-brand-band");
    const badges = brand.querySelectorAll('[data-testid="maturity-badge"]');
    expect(badges.length).toBeGreaterThan(0);
    const statuses = Array.from(badges).map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("live");
  });
});
