import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home page", () => {
  it("renders the hero heading with BETTER branding", () => {
    render(<Home />);
    expect(screen.getByText("BETTER")).toBeInTheDocument();
    expect(
      screen.getByText(/prediction-market intelligence/i)
    ).toBeInTheDocument();
  });

  it("renders all major section placeholders", () => {
    render(<Home />);
    expect(screen.getByText("Ecosystem Roadmap")).toBeInTheDocument();
    expect(screen.getByText("Whale-First Tokenomics")).toBeInTheDocument();
    expect(screen.getByText("Technical Architecture")).toBeInTheDocument();
  });

  it("renders navigation CTAs", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: /explore the roadmap/i })
    ).toHaveAttribute("href", "#roadmap");
    expect(
      screen.getByRole("link", { name: /view tokenomics/i })
    ).toHaveAttribute("href", "#tokenomics");
  });
});
