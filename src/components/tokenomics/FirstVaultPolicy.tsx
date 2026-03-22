/**
 * First-Vault Policy — VAL-TOKEN-012
 *
 * Explicitly states Q1 2026 first-vault rules:
 * - 100,000 BETTER minimum holding
 * - $25,000 per-wallet initial-deposit cap
 * - Worked examples that distinguish deposit cap from modeled allocation weight
 */

import {
  FIRST_VAULT_POLICY,
  FIRST_VAULT_WORKED_EXAMPLES,
} from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import MaturityBadge from "@/components/MaturityBadge";
import type { ConfidenceFrame } from "@/content";

/** Format a large number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

const vaultCaveat: ConfidenceFrame = {
  caveat:
    "The per-wallet $25,000 initial-deposit cap is the Q1 2026 policy. Modeled allocation weights illustrate how whale-first priority would rank wallets if vault space is oversubscribed — they do not change the deposit cap itself.",
  dependencies: [
    "Social Vaults & vBETTER",
    "Whale-First Tier Ladder",
  ],
};

export default function FirstVaultPolicy() {
  return (
    <div data-testid="first-vault-policy">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Q1 2026 First-Vault Policy
        </h3>
        <MaturityBadge status="in_progress" />
      </div>
      <p className="mb-4 text-sm text-secondary">
        The first social vault launch requires a minimum BETTER holding and
        applies a per-wallet initial-deposit cap. These are <strong>policy
        rules</strong> — distinct from the modeled allocation weights used for
        whale-first priority ranking.
      </p>

      <div className="mb-4">
        <EvidenceHook source={FIRST_VAULT_POLICY.source} />
      </div>

      {/* Policy rules */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
            Minimum Holding
          </span>
          <div className="mt-1 font-terminal text-2xl font-bold text-foreground" data-testid="first-vault-minimum">
            {formatNumber(FIRST_VAULT_POLICY.minimumBetter)} BETTER
          </div>
          <p className="mt-1 text-xs text-secondary">
            Standard tier or above required to participate.
          </p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
            Per-Wallet Deposit Cap
          </span>
          <div className="mt-1 font-terminal text-2xl font-bold text-foreground" data-testid="first-vault-cap">
            ${formatNumber(FIRST_VAULT_POLICY.perWalletDepositCapUsd)}
          </div>
          <p className="mt-1 text-xs text-secondary">
            Initial deposit per qualifying wallet. This is a hard cap, not a modeled weight.
          </p>
        </div>
      </div>

      {/* Cap vs. weight distinction */}
      <div className="mb-6 rounded-lg border border-border bg-surface p-4" data-testid="cap-vs-weight-distinction">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          Deposit Cap ≠ Allocation Weight
        </h4>
        <p className="text-sm text-secondary">
          The <span className="font-semibold text-foreground">$25,000 deposit cap</span> is
          the maximum any wallet can deposit into the first vault regardless of
          tier. The <span className="font-semibold text-accent">modeled allocation weight</span> (deposit × tier weight)
          is a separate concept used to rank wallets when vault space is
          oversubscribed. A Whale-tier wallet with $40,000 allocation weight still
          deposits a maximum of $25,000 — the weight only determines priority, not
          the cap.
        </p>
      </div>

      {/* Worked examples */}
      <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
        Worked Examples
      </h4>
      <div className="space-y-3" data-testid="first-vault-worked-examples">
        {FIRST_VAULT_WORKED_EXAMPLES.map((ex) => (
          <div
            key={ex.label}
            className={`rounded-lg border p-4 ${
              ex.qualifies
                ? "border-accent/20 bg-accent/5"
                : "border-border bg-surface"
            }`}
            data-testid="first-vault-example"
            data-qualifies={String(ex.qualifies)}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{ex.tierName}</span>
              <span className="font-terminal text-xs text-secondary">
                {formatNumber(ex.betterHolding)} BETTER
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-terminal text-xs ${
                  ex.qualifies
                    ? "bg-accent/10 text-accent"
                    : "bg-surface text-muted"
                }`}
              >
                {ex.qualifies ? "✓ Qualifies" : "✗ Does not qualify"}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-border/50 bg-background px-3 py-2">
                <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                  Deposit Cap (Policy)
                </span>
                <span className="font-terminal font-semibold text-foreground">
                  ${formatNumber(ex.depositCapUsd)}
                </span>
              </div>
              <div className="rounded border border-border/50 bg-background px-3 py-2">
                <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                  Tier Weight
                </span>
                <span className="font-terminal text-secondary">
                  {ex.tierWeight}×
                </span>
              </div>
              <div className="rounded border border-border/50 bg-background px-3 py-2">
                <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                  Allocation Weight (Modeled)
                </span>
                <span className="font-terminal font-semibold text-accent">
                  ${formatNumber(ex.effectiveAllocationWeight)}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">{ex.explanation}</p>
          </div>
        ))}
      </div>

      <CaveatFrame confidence={vaultCaveat} className="mt-4" />
    </div>
  );
}
