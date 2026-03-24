/**
 * Tests that ALL card surfaces across the site use the BetterCard
 * cursor-tracking treatment (shadcn Card wrapper) — no remaining
 * LiquidMetalCard or glass-card CSS-only cards.
 *
 * VAL-SHADCN-002: Zero production components import LiquidMetalCard.
 * VAL-VISUAL-030: Cards across the graph workspace and content surfaces use
 * glass-morphism with a liquid metal interactive finish (cursor-tracking
 * metallic sheen). Every card/module should use the same glass-card +
 * liquid-metal treatment via BetterCard.
 */
import fs from "fs";
import path from "path";

/**
 * Recursively find all .tsx files in a directory
 */
function findTsxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "__tests__" && entry.name !== "node_modules") {
      results.push(...findTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      results.push(fullPath);
    }
  }
  return results;
}

describe("BetterCard everywhere — VAL-SHADCN-002 / VAL-VISUAL-030", () => {
  it("no component files reference the glass-card CSS class", () => {
    const componentsDir = path.resolve(__dirname, "..");
    const tsxFiles = findTsxFiles(componentsDir);

    const filesUsingGlassCard: string[] = [];
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Match className="...glass-card..." patterns in JSX
      if (/glass-card/.test(content)) {
        filesUsingGlassCard.push(path.relative(componentsDir, file));
      }
    }

    expect(filesUsingGlassCard).toEqual([]);
  });

  it("globals.css does not define the .glass-card utility class as a CSS rule", () => {
    const globalsPath = path.resolve(__dirname, "../../app/globals.css");
    const content = fs.readFileSync(globalsPath, "utf-8");
    // Ensure no .glass-card CSS rule exists (not just a comment mentioning it)
    expect(content).not.toMatch(/\.glass-card\s*\{/);
    expect(content).not.toMatch(/\.glass-card:hover\s*\{/);
  });

  it("zero production components import LiquidMetalCard — VAL-SHADCN-002", () => {
    const componentsDir = path.resolve(__dirname, "..");
    const tsxFiles = findTsxFiles(componentsDir);

    const filesImportingLiquidMetal: string[] = [];
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, "utf-8");
      if (/import\s*\{[^}]*LiquidMetalCard[^}]*\}\s*from/.test(content)) {
        filesImportingLiquidMetal.push(path.relative(componentsDir, file));
      }
    }

    expect(filesImportingLiquidMetal).toEqual([]);
  });

  it("all card-like surfaces import and use BetterCard for cursor tracking", () => {
    // Key component files must import BetterCard for cursor-tracking metallic sheen
    const expectedFiles = [
      "tokenomics/ReferralIncentives.tsx",
      "tokenomics/NonLinearAllocation.tsx",
      "tokenomics/TokenUtilitySurface.tsx",
      "tokenomics/FeeStackValueFlow.tsx",
      "tokenomics/ValuationCorridors.tsx",
      "tokenomics/ScarcityExplainer.tsx",
      "tokenomics/ScenarioSwitcher.tsx",
      "tokenomics/FirstVaultPolicy.tsx",
      "tokenomics/ProductFamilyRevenueModel.tsx",
      "tokenomics/VaultCapacityModel.tsx",
      "tokenomics/TierLadder.tsx",
      "tokenomics/ModeledWhaleLadder.tsx",
      "tokenomics/SupplyAllocation.tsx",
      "tokenomics/FdvRatchetExplainer.tsx",
      "roadmap/ExecutionPlanPanel.tsx",
      "roadmap/RoadmapNodeDetail.tsx",
      "roadmap/RoadmapAtlas.tsx",
      "architecture/CostBandExplorer.tsx",
      "architecture/FlywheelExplorer.tsx",
      "CaveatFrame.tsx",
      "graph/GraphShell.tsx",
      "graph/surfaces/EvidenceSurface.tsx",
    ];

    const componentsDir = path.resolve(__dirname, "..");
    const missingImports: string[] = [];
    for (const relPath of expectedFiles) {
      const fullPath = path.join(componentsDir, relPath);
      if (!fs.existsSync(fullPath)) continue;
      const content = fs.readFileSync(fullPath, "utf-8");
      if (!content.includes("BetterCard")) {
        missingImports.push(relPath);
      }
    }

    expect(missingImports).toEqual([]);
  });

  it("no visible card/panel surfaces use raw border+bg patterns bypassing BetterCard", () => {
    const filesToCheck = [
      "CaveatFrame.tsx",
      "tokenomics/FdvRatchetExplainer.tsx",
      "architecture/CostBandExplorer.tsx",
    ];

    const componentsDir = path.resolve(__dirname, "..");
    const violations: string[] = [];

    for (const relPath of filesToCheck) {
      const fullPath = path.join(componentsDir, relPath);
      if (!fs.existsSync(fullPath)) continue;
      const content = fs.readFileSync(fullPath, "utf-8");

      if (!content.includes("BetterCard")) {
        violations.push(`${relPath}: does not import BetterCard`);
      }
    }

    expect(violations).toEqual([]);
  });

  it("BetterCard imports come from @/components/ui/BetterCard", () => {
    const componentsDir = path.resolve(__dirname, "..");
    const tsxFiles = findTsxFiles(componentsDir);

    const wrongImports: string[] = [];
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Check for BetterCard imports that don't come from the ui directory
      if (content.includes("BetterCard") && !file.includes("ui/BetterCard")) {
        const importMatch = content.match(/import\s*\{[^}]*BetterCard[^}]*\}\s*from\s*["']([^"']+)["']/);
        if (importMatch && !importMatch[1].includes("ui/BetterCard")) {
          wrongImports.push(path.relative(componentsDir, file));
        }
      }
    }

    expect(wrongImports).toEqual([]);
  });
});
