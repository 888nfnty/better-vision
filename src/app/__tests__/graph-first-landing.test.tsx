/**
 * Tests for graph-first default landing.
 *
 * The root load should land on a genuinely graph-first workspace
 * with the interactive graph as the primary visible surface,
 * not a hero-first landing.
 *
 * VAL-ROADMAP-014: Default loaded state is a pure graph workspace
 * VAL-CROSS-014: Graph workspace with investor-path entry, no separate handoff
 */
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Graph-first default landing", () => {
  it("renders the graph workspace as the first major content section, before the hero", () => {
    render(<Home />);
    const graphShell = screen.getByTestId("graph-shell");
    const hero = screen.getByTestId("hero-section");

    // The graph shell should appear before the hero in DOM order
    // (graph-first means graph comes first in the visual layout)
    const position = graphShell.compareDocumentPosition(hero);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("the atlas/graph workspace is the topmost content section", () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    const hero = screen.getByTestId("hero-section");

    expect(atlas).toBeInTheDocument();
    // Atlas should come before the hero section in DOM order
    const position = atlas!.compareDocumentPosition(hero);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("investor-path entry affordance is visible in the first graph workspace", () => {
    render(<Home />);
    const startAffordance = screen.getByTestId("investor-path-start");
    expect(startAffordance).toBeInTheDocument();
  });
});
