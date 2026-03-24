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

describe("LlmProductSurface", () => {
  it("opens from the graph and renders the LLM pricing, BRAID DAG, revenue framing, badges, and shadcn cards", async () => {
    const user = userEvent.setup();
    render(<GraphExplorer />);

    await user.click(getNodeButton(/llm product/i));

    const focusedSurface = await screen.findByTestId("graph-focused-surface");

    expect(focusedSurface).toHaveTextContent("LLM Product");
    expect(focusedSurface).toHaveTextContent("reinforcement learning");
    expect(focusedSurface).toHaveTextContent("parameterization");
    expect(focusedSurface).toHaveTextContent("quantizing");
    expect(focusedSurface).toHaveTextContent("BRAID");
    expect(focusedSurface).toHaveTextContent("reasoning DAG");
    expect(focusedSurface).toHaveTextContent("$29/mo");
    expect(focusedSurface).toHaveTextContent("standalone API subscription");
    expect(focusedSurface).toHaveTextContent("scaling discounts");
    expect(focusedSurface).toHaveTextContent("$BETTER");
    expect(focusedSurface).toHaveTextContent("OpenRouter");
    expect(focusedSurface).toHaveTextContent("separate revenue stream");
    expect(focusedSurface).toHaveTextContent("Terminal");
    expect(focusedSurface).toHaveTextContent("Vault");
    expect(focusedSurface).toHaveTextContent("@tradebetterapp");

    expect(within(focusedSurface).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(4);
    expect(within(focusedSurface).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(4);
    expect(focusedSurface.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(5);
  });
});
