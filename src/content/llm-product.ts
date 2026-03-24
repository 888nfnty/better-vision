import type { MaturityStatus, SourceCue } from "./types";

export interface LlmProductMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface LlmProductSection {
  id: string;
  title: string;
  status: MaturityStatus;
  summary: string;
  source: SourceCue;
  metrics: LlmProductMetric[];
  bullets?: string[];
}

export interface LlmProductContent {
  title: string;
  subtitle: string;
  overview: string;
  source: SourceCue;
  sections: LlmProductSection[];
}

const llmProductSource: SourceCue = {
  type: "external",
  label: "@tradebetterapp — LLM Product thesis",
  note:
    "LLM Product figures and positioning are sourced from the @tradebetterapp X article digest in .factory/library/x-article-content.md.",
};

export const LLM_PRODUCT_CONTENT: LlmProductContent = {
  title: "LLM Product",
  subtitle:
    "A prediction-market-native model product with BRAID reasoning built in and sold as a standalone API subscription",
  overview:
    "BETTER positions the LLM Product as its own revenue line: a prediction-market-focused model tuned via reinforcement learning, parameterization, and quantizing, packaged as a $29/mo standalone API subscription with scaling discounts for larger $BETTER holders and OpenRouter credits sold on top.",
  source: llmProductSource,
  sections: [
    {
      id: "model-tuning",
      title: "Prediction-market model tuning",
      status: "planned",
      summary:
        "The model is being shaped specifically for prediction-market workflows rather than generic chat. @tradebetterapp frames the stack as reinforcement learning, parameterization, and quantizing tuned around trading-strategy iteration, market reading, and faster decision support for operators building their own systems.",
      source: llmProductSource,
      metrics: [
        {
          id: "tuning-stack",
          label: "Fine-tuning stack",
          value: "reinforcement learning + parameterization + quantizing",
          detail:
            "The methodology is explicitly prediction-market-focused instead of a generic assistant layer.",
        },
        {
          id: "product-shape",
          label: "Form factor",
          value: "standalone API subscription",
          detail:
            "The LLM is sold as its own product, not bundled only through Terminal access.",
        },
      ],
      bullets: [
        "Built to help users build and improve their own trading strategies.",
        "Framed as a separate product line that can sell outside BETTER's native trading shell.",
      ],
    },
    {
      id: "braid-dag",
      title: "BRAID reasoning DAG",
      status: "in_progress",
      summary:
        "BETTER's strongest in-progress claim is that the BRAID reasoning DAG gets built directly into the model product. That means the LLM is not just answering prompts — it is supposed to inherit the structured multi-step reasoning path BETTER already uses in broader agent workflows.",
      source: llmProductSource,
      metrics: [
        {
          id: "reasoning-core",
          label: "Reasoning core",
          value: "BRAID reasoning DAG",
          detail:
            "The decision graph is treated as a product capability, not only an internal orchestration trick.",
        },
        {
          id: "maturity",
          label: "Current maturity",
          value: "In Progress",
          detail:
            "BRAID integration is the active build frontier while the monetization packaging remains planned.",
        },
      ],
      bullets: [
        "BRAID is the only claim block on this surface marked In Progress.",
        "The rest of the subscription packaging remains Planned until the product ships.",
      ],
    },
    {
      id: "revenue-rails",
      title: "Monetization and holder pricing",
      status: "planned",
      summary:
        "The LLM Product is positioned as a separate revenue stream from Terminal and Vault: anyone can subscribe for $29/mo, larger $BETTER holders earn scaling discounts, and OpenRouter credits create usage-based revenue on top of the baseline subscription.",
      source: llmProductSource,
      metrics: [
        {
          id: "subscription-price",
          label: "Base subscription",
          value: "$29/mo",
          detail:
            "This is the explicit entry price for the standalone API subscription.",
        },
        {
          id: "holder-discounts",
          label: "Holder pricing",
          value: "scaling discounts for larger $BETTER holders",
          detail:
            "Token ownership improves pricing without collapsing the product into a Terminal-only gate.",
        },
        {
          id: "openrouter-credits",
          label: "Usage revenue",
          value: "OpenRouter credits",
          detail:
            "Access can also be sold through API-call credits instead of only a flat monthly plan.",
        },
        {
          id: "revenue-positioning",
          label: "Revenue posture",
          value: "separate revenue stream",
          detail:
            "The surface explicitly keeps LLM monetization distinct from Terminal and Vault economics.",
        },
      ],
      bullets: [
        "Terminal and Vault stay as separate product lines with their own gates and economics.",
        "The LLM can monetize both direct subscribers and downstream API usage.",
      ],
    },
  ],
};
