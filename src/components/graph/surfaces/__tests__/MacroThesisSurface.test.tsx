import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphExplorer } from "../../GraphExplorer";

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

function getNodeButton(name: RegExp) {
  const nodeButtons = screen.getAllByTestId("graph-node-button");
  const match = nodeButtons.find((element) =>
    element.getAttribute("aria-label")?.match(name)
  );

  if (!match) {
    throw new Error(`No graph node button matching ${name}`);
  }

  return match;
}

describe("MacroThesisSurface", () => {
  it("opens from the graph and renders the exact thesis figures, badges, attribution, and shadcn cards", async () => {
    const user = userEvent.setup();
    render(<GraphExplorer />);

    await user.click(getNodeButton(/macro thesis/i));

    const focusedSurface = await screen.findByTestId("graph-focused-surface");

    expect(focusedSurface).toHaveTextContent("Macro Thesis");
    expect(focusedSurface).toHaveTextContent("Feb 28, 2026");
    expect(focusedSurface).toHaveTextContent("20%");
    expect(focusedSurface).toHaveTextContent("Morgan Stanley");
    expect(focusedSurface).toHaveTextContent("97,939");
    expect(focusedSurface).toHaveTextContent("31.5%");
    expect(focusedSurface).toHaveTextContent("0.55");
    expect(focusedSurface).toHaveTextContent("$150B");
    expect(focusedSurface).toHaveTextContent("82.8%");
    expect(focusedSurface).toHaveTextContent("0.0565");
    expect(focusedSurface).toHaveTextContent("91.2%");
    expect(focusedSurface).toHaveTextContent("97%");
    expect(focusedSurface).toHaveTextContent("130x");
    expect(focusedSurface).toHaveTextContent("$13B/month");
    expect(focusedSurface).toHaveTextContent("$140.63B");
    expect(focusedSurface).toHaveTextContent("@tradebetterapp");

    expect(within(focusedSurface).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(3);
    expect(within(focusedSurface).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(3);
    expect(focusedSurface.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(4);
  });
});
