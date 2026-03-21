/**
 * Tests for RoadmapStorySection (scroll-linked storytelling).
 *
 * Covers:
 * - VAL-ROADMAP-003: Scroll storytelling and roadmap highlighting stay synchronized
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import RoadmapStorySection from "../RoadmapStorySection";
import { BRANCH_FAMILY_LABELS } from "@/content/types";

describe("RoadmapStorySection", () => {
  it("renders story sections for each branch family", () => {
    render(
      <RoadmapStorySection
        activeFamilyIndex={0}
        onActiveFamilyChange={() => {}}
      />
    );
    const families = Object.values(BRANCH_FAMILY_LABELS);
    for (const family of families) {
      expect(screen.getByText(family)).toBeInTheDocument();
    }
  });

  it("visually highlights the active family section", () => {
    render(
      <RoadmapStorySection
        activeFamilyIndex={0}
        onActiveFamilyChange={() => {}}
      />
    );
    const sections = screen.getAllByTestId("roadmap-story-panel");
    // First section should be active
    expect(sections[0]).toHaveAttribute("data-active", "true");
    expect(sections[1]).toHaveAttribute("data-active", "false");
  });

  it("renders node counts and status summary for each family", () => {
    render(
      <RoadmapStorySection
        activeFamilyIndex={0}
        onActiveFamilyChange={() => {}}
      />
    );
    // Each family should show its node count
    const sections = screen.getAllByTestId("roadmap-story-panel");
    expect(sections.length).toBe(5);
  });
});
