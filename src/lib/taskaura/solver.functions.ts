import { createServerFn } from "@tanstack/react-start";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";

const SolverInput = z.object({ query: z.string().min(1) });

export const solveProblemWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SolverInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { createLovableAiGatewayProvider } = await import("@/lib/ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    const schema = z.object({
      summary: z.string(),
      steps: z.array(z.object({ title: z.string(), detail: z.string() })),
    });

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        output: Output.object({ schema }),
        prompt: `You are TaskAura's Daily Problem Solver. The user asks: "${data.query}"

Give a practical, step-by-step solution to this exact question.
- "summary": one sentence describing the overall fix.
- "steps": 4 to 6 ordered steps; each has a short "title" (2-6 words) and a "detail" (one or two concrete sentences).
Answer the actual question directly — do not give generic advice.`,
      });
      const output = await result.output;
      if (!output || !output.steps?.length) throw new Error("Empty AI response");
      return output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("The AI returned an unreadable answer. Please try again.");
      }
      throw error;
    }
  });
