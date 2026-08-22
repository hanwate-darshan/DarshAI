import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

const safeJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c")

const buildMermaidHtml = (code) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Diagram</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #0d1117; padding: 24px; display: flex; justify-content: center; }
  .diagram { max-width: 100%; overflow: auto; }
  pre { display: none; }
</style>
</head>
<body>
<pre class="mermaid">${code}</pre>
<script>
mermaid.initialize({ startOnLoad: true, theme: "dark", securityLevel: "loose" });
</script>
</body>
</html>`

export const diagramAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "diagram")

        const llm = await getModel("diagram")
        const res = await llm.invoke(`
You are a diagram expert using Mermaid.js.

Generate a Mermaid diagram from the user request.

Allowed diagram types:
- flowchart (default)
- sequenceDiagram
- classDiagram
- erDiagram
- mindmap
- gantt
- pie

Rules:
- Return ONLY the mermaid code.
- No markdown fences.
- No explanation.
- No extra text.
- Choose the best diagram type for the request.

User Request:
${state.prompt}
`)

        let code = String(res.content).trim()
        code = code.replace(/^```(?:mermaid)?\s*/, "").replace(/```$/, "").trim()

        if (!code) {
            return {
                ...state,
                aiResponse: "I couldn't generate the diagram. Please try again with a clearer description."
            }
        }

        await deductCredits(state.userId, "diagram")

        const html = buildMermaidHtml(code)

        return {
            ...state,
            aiResponse: `## Diagram Generated\n\n\`\`\`mermaid\n${code}\n\`\`\`\n\nPreview is available in the artifact panel.`,
            artifacts: [
                {
                    id: Date.now(),
                    type: "Diagram",
                    files: [{ name: "index.html", content: html }],
                    title: state.prompt.slice(0, 60)
                }
            ]
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to generate diagram"
        }
    }
}
