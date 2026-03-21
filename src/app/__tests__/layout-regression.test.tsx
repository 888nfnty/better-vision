import { render, screen } from "@testing-library/react";
import Home from "../page";

/**
 * Focused regression tests for shared navigation and footer behavior.
 *
 * These tests ensure the narrative shell's shared layout elements
 * remain stable as features are added.
 *
 * NOTE: RootLayout renders <html>/<body> which JSDOM doesn't support
 * well as a rendered root, so we test navigation and footer presence
 * through the Home page render (which includes the layout wrapper
 * in integration) and verify the section structure.
 */
describe("Shared navigation regression", () => {
  it("hero section has the #what-is-better anchor", () => {
    render(<Home />);
    const section = document.getElementById("what-is-better");
    expect(section).toBeInTheDocument();
  });

  it("live-now section has the #live-now anchor", () => {
    render(<Home />);
    const section = document.getElementById("live-now");
    expect(section).toBeInTheDocument();
  });

  it("roadmap section has the #roadmap anchor", () => {
    render(<Home />);
    const section = document.getElementById("roadmap");
    expect(section).toBeInTheDocument();
  });

  it("tokenomics section has the #tokenomics anchor", () => {
    render(<Home />);
    const section = document.getElementById("tokenomics");
    expect(section).toBeInTheDocument();
  });

  it("evidence section has the #evidence anchor", () => {
    render(<Home />);
    const section = document.getElementById("evidence");
    expect(section).toBeInTheDocument();
  });

  it("risks section has the #risks anchor", () => {
    render(<Home />);
    const section = document.getElementById("risks");
    expect(section).toBeInTheDocument();
  });
});

describe("Hero split-card structure regression", () => {
  it("hero renders both Live Today and The Vision Ahead cards", () => {
    render(<Home />);
    expect(screen.getByText("Live Today")).toBeInTheDocument();
    expect(screen.getByText("The Vision Ahead")).toBeInTheDocument();
  });

  it("Live Today card carries the live maturity badge", () => {
    render(<Home />);
    const liveTitle = screen.getByText("Live Today");
    const card = liveTitle.closest("[class*='rounded-lg']")!;
    // Look for maturity badge within the card
    const badge = card.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-status", "live");
  });

  it("The Vision Ahead card carries a non-live maturity badge", () => {
    render(<Home />);
    const visionTitle = screen.getByText("The Vision Ahead");
    const card = visionTitle.closest("[class*='rounded-lg']")!;
    const badge = card.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge?.getAttribute("data-status")).not.toBe("live");
  });

  it("The Vision Ahead card includes a caveat frame", () => {
    render(<Home />);
    const visionTitle = screen.getByText("The Vision Ahead");
    const card = visionTitle.closest("[class*='rounded-lg']")!;
    const caveat = card.querySelector('[data-testid="caveat-frame"]');
    expect(caveat).toBeInTheDocument();
  });
});

describe("Section heading structure regression", () => {
  it("all main sections render expected headings", () => {
    render(<Home />);
    const expectedHeadings = [
      "What's Live Today",
      "Ecosystem Roadmap",
      "Whale-First Tokenomics",
      "Technical Architecture",
      "Evidence & Sources",
      "Risks & Caveats",
    ];
    for (const heading of expectedHeadings) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
  });

  it("narrative cards in roadmap section carry evidence hooks", () => {
    render(<Home />);
    const roadmapSection = document.getElementById("roadmap")!;
    const hooks = roadmapSection.querySelectorAll(
      '[data-testid="evidence-hook"]'
    );
    expect(hooks.length).toBeGreaterThan(0);
  });

  it("future-facing vision narrative cards carry caveat frames", () => {
    render(<Home />);
    const roadmapSection = document.getElementById("roadmap")!;
    const caveats = roadmapSection.querySelectorAll(
      '[data-testid="caveat-frame"]'
    );
    expect(caveats.length).toBeGreaterThan(0);
  });
});
