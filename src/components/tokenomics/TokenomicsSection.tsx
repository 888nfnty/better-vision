/**
 * Tokenomics Section — Main assembly component.
 *
 * Combines all tokenomics sub-components into the full whale-first
 * tokenomics experience. Satisfies VAL-TOKEN-001 through VAL-TOKEN-014.
 */

import SupplyAllocation from "./SupplyAllocation";
import TierLadder from "./TierLadder";
import FirstVaultPolicy from "./FirstVaultPolicy";
import ModeledWhaleLadder from "./ModeledWhaleLadder";
import ScarcityExplainer from "./ScarcityExplainer";
import FdvRatchetExplainer from "./FdvRatchetExplainer";
import NonLinearAllocation from "./NonLinearAllocation";
import ScenarioSwitcher from "./ScenarioSwitcher";
import TokenUtilitySurface from "./TokenUtilitySurface";
import FeeStackValueFlow from "./FeeStackValueFlow";
import ReferralIncentives from "./ReferralIncentives";
import ProductFamilyRevenueModel from "./ProductFamilyRevenueModel";

export default function TokenomicsSection() {
  return (
    <div className="space-y-16" data-testid="tokenomics-section">
      {/* VAL-TOKEN-001: Supply and allocation arithmetic (minted supply) */}
      <SupplyAllocation />

      {/* VAL-TOKEN-002, VAL-TOKEN-003: Tier ladder with whale-first structure */}
      <TierLadder />

      {/* VAL-TOKEN-012: Q1 2026 first-vault policy with worked examples */}
      <FirstVaultPolicy />

      {/* VAL-TOKEN-002: Modeled whale product ladder (social vaults, AI vaults) */}
      <ModeledWhaleLadder />

      {/* VAL-TOKEN-005: FDV ratchet with worked examples */}
      <FdvRatchetExplainer />

      {/* VAL-TOKEN-006: Non-linear allocation with worked examples */}
      <NonLinearAllocation />

      {/* VAL-TOKEN-004: Scarcity and oversubscription rules */}
      <ScarcityExplainer />

      {/* VAL-TOKEN-007, VAL-TOKEN-008: Scenario switching with assumption panel */}
      <ScenarioSwitcher />

      {/* VAL-TOKEN-010: Agent-native token utility surface */}
      <TokenUtilitySurface />

      {/* VAL-TOKEN-009: Fee-stack examples and value-flow mapping */}
      <FeeStackValueFlow />

      {/* VAL-TOKEN-013: Sustainable referral incentives */}
      <ReferralIncentives />

      {/* VAL-TOKEN-014: Product-family revenue/value-return model */}
      <ProductFamilyRevenueModel />
    </div>
  );
}
