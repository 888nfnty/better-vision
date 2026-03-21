/**
 * Tests for the interactive RoadmapAtlas component.
 *
 * Covers:
 * - VAL-ROADMAP-001: Roadmap is identifiable as interactive with focal point
 * - VAL-ROADMAP-002: Wayfinding stays recoverable
 * - VAL-ROADMAP-004: Expand/collapse behaves predictably
 * - VAL-ROADMAP-005: Node details show correct content and status
 * - VAL-ROADMAP-006: Valid deep links restore state and scroll/focus into view
 * - VAL-ROADMAP-007: Invalid deep links fail gracefully with visible fallback
 * - VAL-ROADMAP-008: Keyboard accessible
 * - VAL-ROADMAP-010: Covers required BETTER domains
 */
import React from "react";
import { render, screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoadmapAtlas from "../RoadmapAtlas";
import { BRANCH_FAMILY_LABELS } from "@/content/types";

beforeEach(() => {
  // Reset hash before each test
  window.location.hash = "";
  // Reset history state
  history.replaceState(null, "", window.location.pathname);
});

describe("RoadmapAtlas", () => {
  // VAL-ROADMAP-001: Identifiable as interactive
  it("renders as identifiable interactive surface with legend and prompt", () => {
    render(<RoadmapAtlas />);
    // Should have an interactive affordance / prompt
    expect(
      screen.getByText(/explore the roadmap/i)
    ).toBeInTheDocument();
    // Should show at least one branch family (may appear multiple times due to story panels)
    expect(screen.getAllByText("Product Evolution").length).toBeGreaterThanOrEqual(1);
  });

  // VAL-ROADMAP-010: Covers required BETTER domains
  it("covers all five required branch families", () => {
    render(<RoadmapAtlas />);
    const families = Object.values(BRANCH_FAMILY_LABELS);
    for (const family of families) {
      // Each family appears in both the branch explorer and story panel, so use getAllByText
      expect(screen.getAllByText(family).length).toBeGreaterThanOrEqual(1);
    }
  });

  // VAL-ROADMAP-004: Expand/collapse behaves predictably
  it("expands and collapses branches predictably", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Find the Product Evolution branch toggle
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });

    // Initially collapsed
    expect(productBranch).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");

    // Should now show child nodes
    expect(screen.getByText("BETTER Terminal (Closed Beta)")).toBeInTheDocument();

    // Click to collapse
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "false");
  });

  // VAL-ROADMAP-004: Changing one branch doesn't corrupt unrelated state
  it("does not corrupt unrelated branch state when toggling", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    const tokenBranch = screen.getByRole("button", {
      name: /token utility/i,
    });

    // Expand product
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "false");

    // Expand token — product should stay expanded
    await user.click(tokenBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "true");

    // Collapse product — token should stay expanded
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "false");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "true");
  });

  // VAL-ROADMAP-005: Node details show correct content and status
  it("shows correct detail panel with title, status, and summary when a node is selected", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand product branch
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    // Click on the Terminal node
    const terminalNode = screen.getByRole("button", {
      name: /better terminal.*closed beta/i,
    });
    await user.click(terminalNode);

    // Detail panel should be visible
    const detailPanel = screen.getByTestId("roadmap-node-detail");
    expect(detailPanel).toBeInTheDocument();
    expect(within(detailPanel).getByText("BETTER Terminal (Closed Beta)")).toBeInTheDocument();
    expect(within(detailPanel).getByTestId("maturity-badge")).toBeInTheDocument();
    expect(
      within(detailPanel).getByText(/ai-powered signal discovery/i)
    ).toBeInTheDocument();
  });

  // VAL-ROADMAP-005: Future-facing nodes show dependency/confidence framing
  it("shows confidence framing for future-facing nodes", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand product branch and select a planned node
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    const agentNode = screen.getByRole("button", {
      name: /autonomous strategy agents/i,
    });
    await user.click(agentNode);

    const detailPanel = screen.getByTestId("roadmap-node-detail");
    expect(within(detailPanel).getByTestId("caveat-frame")).toBeInTheDocument();
  });

  // VAL-ROADMAP-006: Valid deep links restore state
  it("restores node detail state from a valid URL hash", () => {
    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    const detailPanel = screen.getByTestId("roadmap-node-detail");
    expect(
      within(detailPanel).getByText("BETTER Terminal (Closed Beta)")
    ).toBeInTheDocument();
  });

  // VAL-ROADMAP-007: Invalid deep links fail gracefully
  it("falls back gracefully for invalid deep link hash", () => {
    window.location.hash = "#node-nonexistent-id";
    render(<RoadmapAtlas />);

    // Should not crash, should show fallback message
    expect(screen.getByTestId("roadmap-invalid-link-fallback")).toBeInTheDocument();
  });

  // VAL-ROADMAP-007: No deep link — normal state
  it("renders normally without any deep link hash", () => {
    window.location.hash = "";
    render(<RoadmapAtlas />);

    // Should not have a detail panel open
    expect(screen.queryByTestId("roadmap-node-detail")).not.toBeInTheDocument();
  });

  // VAL-ROADMAP-008: Keyboard accessible
  it("allows keyboard navigation through branch toggles", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Focus the first branch toggle directly
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    productBranch.focus();
    expect(document.activeElement).toBe(productBranch);

    // Press Enter to expand
    await user.keyboard("{Enter}");
    expect(productBranch).toHaveAttribute("aria-expanded", "true");

    // Press Escape should be handleable
    await user.keyboard("{Escape}");
  });

  // VAL-ROADMAP-002: Wayfinding recoverable
  it("provides a recenter/reset control for wayfinding", () => {
    render(<RoadmapAtlas />);
    // There should be a way to reset/recenter the roadmap view
    const resetButton = screen.getByRole("button", { name: /collapse all|reset|recenter/i });
    expect(resetButton).toBeInTheDocument();
  });

  // Close detail panel
  it("closes the detail panel when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand and select a node
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    const terminalNode = screen.getByRole("button", {
      name: /better terminal.*closed beta/i,
    });
    await user.click(terminalNode);

    expect(screen.getByTestId("roadmap-node-detail")).toBeInTheDocument();

    // Close the detail panel
    const closeButton = within(screen.getByTestId("roadmap-node-detail")).getByRole(
      "button",
      { name: /close/i }
    );
    await user.click(closeButton);

    expect(screen.queryByTestId("roadmap-node-detail")).not.toBeInTheDocument();
  });

  // Deep link opens correct branch
  it("auto-expands the parent branch when deep linking to a node", () => {
    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    // Product Evolution should be expanded since pe-terminal-beta is in it
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
  });

  // ---------------------------------------------------------------------------
  // Deep-link visibility regression (scroll/focus on first load)
  // VAL-ROADMAP-006 + VAL-ROADMAP-007 visibility gap fix
  // ---------------------------------------------------------------------------

  // VAL-ROADMAP-006: Valid deep link scrolls the detail panel into view on first load
  it("scrolls the detail panel into view when a valid deep link loads", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    // Detail panel should be rendered
    expect(screen.getByTestId("roadmap-node-detail")).toBeInTheDocument();

    // Wait for the effect to fire
    await screen.findByTestId("roadmap-node-detail");

    // scrollIntoView should have been called on the detail panel or the roadmap atlas container
    expect(scrollSpy).toHaveBeenCalled();
  });

  // VAL-ROADMAP-007: Invalid deep link scrolls the fallback banner into view on first load
  it("scrolls the invalid deep-link fallback into view on first load", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    window.location.hash = "#node-nonexistent-id";
    render(<RoadmapAtlas />);

    // Fallback banner should be rendered
    expect(screen.getByTestId("roadmap-invalid-link-fallback")).toBeInTheDocument();

    // Wait for the effect to fire
    await screen.findByTestId("roadmap-invalid-link-fallback");

    // scrollIntoView should have been called to bring the fallback into view
    expect(scrollSpy).toHaveBeenCalled();
  });

  // VAL-ROADMAP-006: Valid deep link detail panel receives focus for accessibility
  it("focuses the detail panel on valid deep link load for screen readers", async () => {
    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    const detailPanel = screen.getByTestId("roadmap-node-detail");
    // The detail panel (or a wrapper) should have tabIndex for programmatic focus
    await screen.findByTestId("roadmap-node-detail");
    expect(detailPanel.closest("[tabindex]") ?? detailPanel).toHaveAttribute("tabindex");
  });

  // VAL-ROADMAP-007: Invalid fallback shows a clear recovery path (explore roadmap)
  it("provides an explicit recovery action in the invalid deep-link fallback", () => {
    window.location.hash = "#node-nonexistent-id";
    render(<RoadmapAtlas />);

    const fallback = screen.getByTestId("roadmap-invalid-link-fallback");
    // Should contain a button or link to help the user recover
    const recoveryAction = within(fallback).queryByRole("button") ?? within(fallback).queryByRole("link");
    expect(recoveryAction).toBeInTheDocument();
  });

  // VAL-ROADMAP-006: hashchange to valid node also scrolls into view
  it("scrolls detail into view when hash changes to a valid node after initial load", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    // Start with no hash
    window.location.hash = "";
    render(<RoadmapAtlas />);
    scrollSpy.mockClear();

    // Simulate hashchange to a valid node
    await act(async () => {
      window.location.hash = "#node-pe-terminal-beta";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Detail panel should appear
    await screen.findByTestId("roadmap-node-detail");

    // scrollIntoView should be called for the newly-visible detail
    expect(scrollSpy).toHaveBeenCalled();
  });
});
