import { openai } from "@ai-sdk/openai";
import {
  streamText,
  generateText,
  tool,
  convertToModelMessages,
  stepCountIs,
  Output,
} from "ai";
import { z } from "zod";
import client from "@/sanity/lib/client";
import { PRODUCTS_FOR_CHAT_QUERY } from "@/sanity/queries/products";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/** Reply in the same language the user writes in (any language). */
const LANGUAGE_REPLY_RULE = `LANGUAGE: The user may write in any language (Bulgarian, English, German, French, Spanish, Turkish, Arabic, etc.). Write your full reply in the same language as the user's latest message. If they switch language, follow the new one. Keep catalog product names as in the data; translate prices, descriptions, and explanations to the user's language. Do not default to English unless the user wrote in English.`;

const CRITICAL_RULES = `CRITICAL RULES:
- ALWAYS call search_products for product questions (anything about products, catalog, prices, discounts, brands, recommendations, stock, or what to buy).
- NEVER answer product/catalog questions from your own knowledge—only from search_products tool results.
- NEVER say "I don't have information", "I can't access that", or similar for catalog topics; call search_products first and then answer from its output.
- NEVER invent prices, discounts, or product details; ONLY use values from tool results (and injected ORDER DATA for orders).
- ONLY use tool results for facts about products and orders.
- If search_products returns an empty list or no matching products, say "No products found" (or the equivalent phrase in the user's language per LANGUAGE above).`;

// Intent detection schema
const intentSchema = z.object({
  intent: z
    .enum([
      "product_search",
      "order_status",
      "general",
      "order_return",
      "out_of_scope",
    ])
    .describe(
      "product_search: user asks about products, categories, brands, colors, sizes, prices, etc.order_status: user asks about order tracking. general: greetings, FAQ, other. order_return: returns, refunds. out_of_scope: unrelated topics, off-topic, not store-related.",
    ),
  searchQuery: z
    .string()
    .describe(
      "Extracted search term when intent is product_search; empty string otherwise",
    ),
  orderNumber: z
    .string()
    .describe(
      "Extracted order number when intent is order_status; empty string otherwise",
    ),
});

export type IntentResult = z.infer<typeof intentSchema>;

/** UIMessage uses `parts`; older shapes use `content` — intent needs real text. */
function extractUIMessageText(msg: unknown): string {
  if (!msg || typeof msg !== "object") return "";
  const m = msg as {
    content?: unknown;
    parts?: Array<{ type: string; text?: string }>;
  };

  if (Array.isArray(m.parts) && m.parts.length > 0) {
    return m.parts
      .filter(
        (p): p is { type: "text"; text: string } =>
          p.type === "text" && typeof p.text === "string",
      )
      .map((p) => p.text)
      .join(" ");
  }

  if (typeof m.content === "string") return m.content;

  if (Array.isArray(m.content)) {
    return m.content
      .map((p: { type: string; text?: string }) =>
        p.type === "text" ? (p.text ?? "") : "",
      )
      .join(" ");
  }

  return "";
}

function messagesToConversationText(msgs: unknown[]): string {
  return msgs
    .map((m) => {
      const role =
        typeof m === "object" &&
        m &&
        "role" in m &&
        typeof (m as { role: unknown }).role === "string"
          ? (m as { role: string }).role
          : "unknown";
      return `${role}: ${extractUIMessageText(m)}`;
    })
    .join("\n");
}

/** Fix obvious mislabels when the LLM sees empty history or ambiguous phrasing. */
function applyIntentHeuristics(
  intent: IntentResult,
  lastUserText: string,
): IntentResult {
  const t = lastUserText.trim();
  if (!t) return intent;

  const onlyOrderNum = t.match(/^(\d{3,})$/);
  if (onlyOrderNum) {
    return {
      intent: "order_status",
      searchQuery: "",
      orderNumber: onlyOrderNum[1]!,
    };
  }

  const orderStrong =
    /\b(order|tracking|tracking number|delivery|shipment|where is my|поръчк|доставк|тракинг|къде е поръчк|къде е доставк|номер на поръчка|статус на поръчк)\b/i.test(
      t,
    );
  if (orderStrong && intent.intent !== "order_return") {
    const numMatch = t.match(/\b(\d{3,})\b/);
    return {
      intent: "order_status",
      searchQuery: "",
      orderNumber: numMatch?.[1] ?? intent.orderNumber,
    };
  }

  const productStrong =
    /\b(продукт|продукти|крем|шампоан|козметик|лак|червил|цена|имате ли|препоръч|какво да куп|липстик|отстъпк|намален|намаление|промо|product|shampoo|cream|lipstick|makeup|cosmetic|skincare|brand|price|buy|recommend|discount|sale|promo)\b/i.test(
      t,
    );
  if (
    productStrong &&
    (intent.intent === "general" || intent.intent === "out_of_scope")
  ) {
    return {
      intent: "product_search",
      searchQuery: t,
      orderNumber: "",
    };
  }

  return intent;
}

async function detectIntent(
  conversationHistory: string,
): Promise<IntentResult> {
  const { output } = await generateText({
    model: openai("gpt-4o-mini"),
    output: Output.object({ schema: intentSchema }),
    system: `You classify intent for Adora Cosmetics (beauty e-commerce). The conversation uses "user:" / "assistant:" lines. User messages may be in any language—apply the same rules regardless of language.

Rules (last user message is primary; earlier lines are context):
- product_search: wants to find/buy/compare products, prices, brands, categories, discounts/sales/promotions, "what do you have", recommendations, ingredients, sizes, colors.
- order_status: order tracking, "where is my order", delivery status, shipping, order number mentioned for tracking (BG: поръчка, доставка, тракинг).
- order_return: returns, refunds, exchange, damaged item (not "where is my order").
- general: hello/thanks/bye, store hours, contact, generic FAQ not covered above.
- out_of_scope: not about shopping, beauty, orders, or this store (e.g. coding, weather, politics).

If unsure between product_search and general, prefer product_search when the user names a product type or asks "do you have…".

searchQuery: for product_search, short keywords from the user (or last question). Empty if not product_search.
orderNumber: digits only when user gave an order number for tracking; empty otherwise.`,
    prompt: conversationHistory.trim() || "user: Hello",
  });
  return output as IntentResult;
}

const NO_TOOLS_INTENTS: IntentResult["intent"][] = [
  "out_of_scope",
  "order_return",
];

const DISCOUNT_QUERY_RE =
  /(отстъпк|намален|намаление|промо|изгодн|discount|sale|promo|deals?|percent|процент|rabatt|remise|descuento|sconto|soldes|rebaja|акци|reducere|alennus)/i;

function stripDiscountMarketingTerms(q: string): string {
  return q
    .toLowerCase()
    .replace(
      /\b(отстъпк\w*|намален\w*|намаление|промо|изгодн\w*|discounts?|sales?|promo|deals?|rabatts?|remises?|descuentos?|sconti?|soldes?|rebajas?|продукти?|products?|items?|кои|какви|имате\s+ли|има\s+ли)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

type ChatProductRow = {
  name?: string;
  description?: string;
  brand?: string;
  productDetails?: string[];
  category?: { name?: string };
  slug?: { current?: string };
  price?: number;
  discount?: { isActive?: boolean; amount?: number; type?: string };
  tags?: Array<{ type?: string; label?: string }>;
};

function searchableProductText(p: ChatProductRow): string {
  const name = p.name?.toLowerCase() ?? "";
  const cat = p.category?.name?.toLowerCase() ?? "";
  const brand = (p.brand && p.brand.toLowerCase()) ?? "";
  const desc = (p.description && p.description.toLowerCase()) ?? "";
  const details = (p.productDetails ?? []).join(" ").toLowerCase();
  const tagLabels = (p.tags ?? [])
    .map((x) => x.label?.toLowerCase() ?? "")
    .join(" ");
  return [name, cat, brand, desc, details, tagLabels].join(" ");
}

function priceAfterDiscount(p: ChatProductRow): number {
  const price = p.price ?? 0;
  const d = p.discount;
  if (!d?.isActive || d.amount == null) return price;
  if (d.type === "percentage") return price - (price * d.amount) / 100;
  if (d.type === "fixed") return Math.max(price - d.amount, 0);
  return price;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessages = await convertToModelMessages(messages);

  // Step 1: Intent detection – пълен текст от parts/content (UIMessage)
  const conversationText = messagesToConversationText(messages);
  let intent = await detectIntent(conversationText);
  const lastUserMsg = messages
    .filter((m: { role: string }) => m.role === "user")
    .pop();
  const lastUserText = extractUIMessageText(lastUserMsg);
  intent = applyIntentHeuristics(intent, lastUserText);

  console.log("[chat] intent detection", {
    intent: intent.intent,
    searchQuery: intent.searchQuery,
    orderNumber: intent.orderNumber,
  });

  const useTools = !NO_TOOLS_INTENTS.includes(intent.intent);

  const orderNumbers = conversationText.match(/\b\d{3,}\b/g) ?? [];
  const orderNumFromHistory = orderNumbers[orderNumbers.length - 1] ?? "";

  const trimmed = lastUserText.trim();
  const isOrderRelated =
    intent.intent === "order_status" ||
    /^\d{3,}$/.test(trimmed) ||
    /order|tracking|delivery|поръчка|доставка|status|tracking number/i.test(
      trimmed,
    );

  let injectedOrderData = "";
  if (isOrderRelated && orderNumFromHistory) {
    try {
      const res = await fetch(
        `${baseUrl}/api/orders/by-number?orderNumber=${orderNumFromHistory}`,
      );
      if (res.ok) {
        const data = await res.json();
        injectedOrderData = `\n\n--- ORDER DATA (order #${orderNumFromHistory}) ---\nUse this data to answer. Never say "I don't have access" or "check your email".\n${JSON.stringify(data)}`;
      } else {
        injectedOrderData = `\n\n--- ORDER DATA ---\nOrder #${orderNumFromHistory} not found.`;
      }
    } catch {
      injectedOrderData = `\n\n--- ORDER DATA ---\nOrder #${orderNumFromHistory}: Could not fetch.`;
    }
  }

  if (useTools) {
    const productSearchTool = tool({
      description:
        "Search products by name, description, category, brand, productDetails, tags. For discounts/sales/promotions (отстъпки, намаление, discount, sale), pass the user's words or 'discount'. For shampoo, lipstick, etc. pass that keyword. Use 'all' to list products.",
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            "User search: product type (shampoo, lipstick), or 'discount' / 'отстъпка' for on-sale items, or 'all'",
          ),
      }),
      execute: async ({ query }) => {
        const products = (await client.fetch(
          PRODUCTS_FOR_CHAT_QUERY,
        )) as ChatProductRow[];

        const rawQ = query.trim();
        const lower = rawQ.toLowerCase();
        const listAll = !rawQ || lower === "all";
        const asksAboutDiscounts = DISCOUNT_QUERY_RE.test(rawQ);
        const keywordAfterStrip = stripDiscountMarketingTerms(rawQ);
        const hasKeyword = keywordAfterStrip.length >= 2;

        let filtered: ChatProductRow[];

        if (asksAboutDiscounts) {
          let withDisc = products.filter(
            (p) => p.discount?.isActive && p.discount.amount != null,
          );
          if (hasKeyword) {
            withDisc = withDisc.filter((p) =>
              searchableProductText(p).includes(keywordAfterStrip),
            );
          }
          filtered = withDisc;
        } else if (!listAll) {
          filtered = products.filter((p) =>
            searchableProductText(p).includes(lower),
          );
        } else {
          filtered = products;
        }

        return JSON.stringify(
          filtered.slice(0, 15).map((p) => {
            const original = p.price ?? 0;
            const after = priceAfterDiscount(p);
            const d = p.discount;
            const hasDisc = Boolean(d?.isActive && d.amount != null);
            const discountLabel = hasDisc
              ? d!.type === "percentage"
                ? `${d!.amount}%`
                : `${d!.amount}€`
              : null;

            return {
              name: p.name,
              slug: p.slug?.current,
              priceEUR: original,
              ...(hasDisc
                ? {
                    priceAfterDiscountEUR: after,
                    discount: discountLabel,
                    discountType: d!.type,
                  }
                : {}),
              category: p.category?.name,
              brand: p.brand,
            };
          }),
        );
      },
    });

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `${LANGUAGE_REPLY_RULE}

${CRITICAL_RULES}

You are a helpful assistant for Adora Cosmetics.${injectedOrderData}

${
  injectedOrderData
    ? `
ORDER INSTRUCTION: The --- ORDER DATA --- block above contains real order info. Use only that data or check_order_status results—never invent order details. Answer in the user's language. Report status, tracking, shipping_method, created_at.
`
    : ""
}

PRODUCTS: For lipstick, cream, shampoo, discounts, sales, etc., always use search_products first. Pass a keyword like "discount" or the user's word for sale (e.g. отстъпка, Rabatt, soldes). Use "all" to list products. List results with bullets; if priceAfterDiscountEUR is present, show original and discounted price from the tool only.

ORDERS: If ORDER DATA is above, use it. Otherwise call check_order_status with the order number from the conversation. Do not invent tracking or status.

Tool outputs may be JSON—explain to the user in their language using only those facts.

skip_search: ONLY for pure greetings, thanks, or goodbye with no product/order question.`,
      messages: modelMessages,
      stopWhen: stepCountIs(3),
      tools: {
        search_products: productSearchTool,
        check_order_status: tool({
          description:
            "Get real order data from backend. Call when: user sends a number (1001, 1002) as order number, or asks about order/delivery/tracking. Pass the number. Never skip this—always call for order-related messages.",
          inputSchema: z.object({
            orderNumber: z
              .string()
              .describe(
                "Order number from user (e.g. 1001), or empty if not provided",
              ),
          }),
          execute: async ({ orderNumber }) => {
            const num = orderNumber?.trim();
            if (!num) {
              return JSON.stringify({
                error: "missing_order_number",
                hint: "Ask the user for their order number in their language.",
              });
            }
            const res = await fetch(
              `${baseUrl}/api/orders/by-number?orderNumber=${num}`,
            );
            if (!res.ok) {
              return JSON.stringify({
                found: false,
                orderNumber: num,
              });
            }
            const data = await res.json();
            return JSON.stringify(data);
          },
        }),
        skip_search: tool({
          description:
            "Call ONLY when user says hello, thanks, goodbye—NOT for product or order questions.",
          inputSchema: z.object({
            reason: z.string().describe("e.g. greeting, thanks, goodbye"),
          }),
          execute: async () => "OK",
        }),
      },
    });
    return result.toUIMessageStreamResponse();
  }

  // No tools: само за out_of_scope и order_return (policy prompt)
  const policyPrompt =
    intent.intent === "order_return"
      ? "The user is asking about returns or refunds. Answer with typical store return/refund policy: conditions, time limits, how to start a return. Be clear and helpful."
      : "The user's question is off-topic for this shop. Politely redirect to Adora Cosmetics (products, orders, delivery, returns). Do not answer unrelated topics.";

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `${LANGUAGE_REPLY_RULE}

You are the assistant for Adora Cosmetics. You have no tools; answer only from your knowledge of typical store policies and instructions.
${policyPrompt}`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
