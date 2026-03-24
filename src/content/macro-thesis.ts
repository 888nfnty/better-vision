import type { MaturityStatus, SourceCue } from "./types";

export interface MacroThesisMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface MacroThesisClaim {
  id: string;
  title: string;
  status: MaturityStatus;
  summary: string;
  source: SourceCue;
  references?: string[];
  metrics: MacroThesisMetric[];
}

export interface MacroThesisContent {
  title: string;
  subtitle: string;
  overview: string;
  source: SourceCue;
  claims: MacroThesisClaim[];
}

const macroShockSource: SourceCue = {
  type: "external",
  label: "@tradebetterapp — A World at War",
  note:
    "Macro thesis framing built from @tradebetterapp's Iran strikes thesis, citing Morgan Stanley research, JP Morgan mid-year outlook, and Stimson Center Top 10 Risks 2026.",
};

const marketStructureSource: SourceCue = {
  type: "external",
  label: "@tradebetterapp — The world is shifting beneath your feet",
  note:
    "BTC, memecoin, and prediction-market figures are synthesized from @tradebetterapp's macro article, with Nansen, academic studies, and Polymarket data cited inside the thread.",
};

export const MACRO_THESIS_CONTENT: MacroThesisContent = {
  title: "Macro Thesis",
  subtitle: "Why capital rotates toward prediction markets when legacy hedges fail",
  overview:
    "BETTER frames prediction markets as the cleanest answer to a world where war shocks, broken diversification, high-beta crypto, and memecoin fraud all expose how quickly old playbooks decay.",
  source: {
    type: "external",
    label: "@tradebetterapp Macro Thesis",
    note:
      "Surface synthesizes the macro-thesis X articles published by @tradebetterapp. Every figure below is preserved exactly from the source digest in .factory/library/x-article-content.md.",
  },
  claims: [
    {
      id: "macro-shock",
      title: "War shocks broke the old hedging script",
      status: "live",
      summary:
        "On Feb 28, 2026, US/Israeli strikes hit Iranian military and nuclear targets; Iran retaliated against Kuwait bases and Saudi/Qatar energy infrastructure while ~20% of global oil supply sat exposed at the Strait of Hormuz. Morgan Stanley, JP Morgan, and the Stimson Center all map the same regime shift: 60/40 diversification cracked as asset correlations converged toward 1.0.",
      source: macroShockSource,
      references: [
        "Morgan Stanley research",
        "JP Morgan mid-year outlook",
        "Stimson Center Top 10 Risks 2026",
      ],
      metrics: [
        {
          id: "strait-of-hormuz",
          label: "Strait of Hormuz exposure",
          value: "20%",
          detail: "Approximate share of global oil supply flowing through the chokepoint.",
        },
        {
          id: "correlation-collapse",
          label: "60/40 failure mode",
          value: "1.0",
          detail: "Asset correlations converged toward 1.0 instead of diversifying risk.",
        },
      ],
    },
    {
      id: "crypto-beta-reality",
      title: "BTC and memecoins stopped working as escape valves",
      status: "live",
      summary:
        "Spot ETF institutionalization pushed BTC to 97,939 before a 31.5% crash back into the 60-66k range, while BTC's correlation with the S&P 500 climbed to 0.55. At the same time, memecoin market cap fell from $150B to $38-42B, a 61% collapse, trading volume dropped 85%, rug-farming hit 82.8%, and 89% of retail Polymarket traders still lost money once public alpha decayed.",
      source: marketStructureSource,
      metrics: [
        {
          id: "btc-peak",
          label: "BTC peak",
          value: "97,939",
          detail: "Spot ETF institutionalization pulled BTC to a new macro-sensitive high.",
        },
        {
          id: "btc-crash",
          label: "BTC drawdown",
          value: "31.5%",
          detail: "The move retraced into the 60-66k range instead of behaving like a safe haven.",
        },
        {
          id: "btc-correlation",
          label: "BTC-S&P 500 correlation",
          value: "0.55",
          detail: "High-beta linkage rose instead of providing diversification.",
        },
        {
          id: "memecoin-collapse",
          label: "Memecoin market cap",
          value: "$150B → $38-42B",
          detail: "A 61% collapse alongside 85% lower trading volume.",
        },
        {
          id: "rug-farming",
          label: "Rug-farming rate",
          value: "82.8%",
          detail: "Nansen and academic studies show the fraud rate was structurally high.",
        },
        {
          id: "retail-loss-rate",
          label: "Retail loss rate",
          value: "89%",
          detail: "Most retail Polymarket traders still lost money after speed-based alpha decay.",
        },
      ],
    },
    {
      id: "prediction-market-edge",
      title: "Prediction markets price reality faster than narratives",
      status: "live",
      summary:
        "Polymarket's Brier score landed at 0.0565, or 77% more accurate than a coin flip, while accuracy reached 91.2% one month out and 97% in the final hours. In the highest-volume markets, Brier tightened to 0.0256 twelve hours before resolution and 0.0159 one day before. Scale followed: prediction-market volume expanded 130x from roughly $100M to $13B/month, cumulative volume reached $140.63B, and open interest hit $847M.",
      source: marketStructureSource,
      metrics: [
        {
          id: "brier-score",
          label: "Polymarket Brier score",
          value: "0.0565",
          detail: "Equivalent to a 77% accuracy edge versus a coin flip baseline.",
        },
        {
          id: "one-month-accuracy",
          label: "Accuracy one month out",
          value: "91.2%",
          detail: "Prediction markets kept their edge well before the final resolution window.",
        },
        {
          id: "final-hour-accuracy",
          label: "Accuracy in final hours",
          value: "97%",
          detail: "The market converged even harder as event resolution approached.",
        },
        {
          id: "high-volume-market-brier",
          label: "High-volume market Brier",
          value: "0.0256 / 0.0159",
          detail: "Observed 12 hours before resolution and 1 day before in the highest-volume markets.",
        },
        {
          id: "volume-growth",
          label: "Volume growth",
          value: "130x",
          detail: "Expanded from roughly $100M in early 2024 to $13B/month by late 2025.",
        },
        {
          id: "cumulative-volume",
          label: "Cumulative volume",
          value: "$140.63B",
          detail: "Prediction markets accumulated internet-scale volume, not niche hobbyist flow.",
        },
        {
          id: "open-interest",
          label: "Open interest",
          value: "$847M",
          detail: "Open positioning confirmed that liquidity depth followed the volume step-change.",
        },
      ],
    },
  ],
};
