"use client";

/**
 * Architecture Section — Technical stack, cost bands, and BETTER flywheel.
 *
 * Satisfies:
 * - VAL-VISUAL-005: Surfaces required BETTER stack layers and their roles
 * - VAL-VISUAL-006: Layers show maturity and dependency sequencing
 * - VAL-VISUAL-007: Cost bands show assumption hooks and capability unlocks
 * - VAL-VISUAL-008: DOM-first content degrades gracefully
 * - VAL-VISUAL-009: Infrastructure evolution and flywheel are explorable
 */

import React from "react";
import StackLayers from "./StackLayers";
import CostBandExplorer from "./CostBandExplorer";
import FlywheelExplorer from "./FlywheelExplorer";

export default function ArchitectureSection() {
  return (
    <div className="space-y-16" data-testid="architecture-section">
      {/* VAL-VISUAL-005, VAL-VISUAL-006: Stack layers with maturity and dependencies */}
      <StackLayers />

      {/* VAL-VISUAL-007: Cost bands with assumption hooks and capability unlocks */}
      <CostBandExplorer />

      {/* VAL-VISUAL-009: Explorable BETTER flywheel */}
      <FlywheelExplorer />
    </div>
  );
}
