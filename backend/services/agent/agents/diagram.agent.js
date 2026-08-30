import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

const NODE_TYPES = ["start", "process", "decision", "end"]

const parseDiagram = (raw) => {
    let text = String(raw).trim()
    text = text.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim()

    const firstBrace = text.indexOf("{")
    const lastBrace = text.lastIndexOf("}")
    if (firstBrace < 0 || lastBrace <= firstBrace) return null

    try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1))
    } catch {
        return null
    }
}

export const diagramAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "diagram")

        const llm = await getModel("diagram")
        const res = await llm.invoke(`
You are a professional flowchart designer. Convert the user request into a clean, well-structured directed graph.

Return STRICT JSON ONLY (no markdown fences, no explanation, no extra text) with this exact shape:

{
  "nodes": [
    { "id": "n1", "label": "Start", "type": "start" },
    { "id": "n2", "label": "User enters credentials", "type": "process" },
    { "id": "n3", "label": "Are credentials valid?", "type": "decision" },
    { "id": "n4", "label": "Grant access", "type": "end" }
  ],
  "edges": [
    { "source": "n1", "target": "n2", "label": "" },
    { "source": "n2", "target": "n3", "label": "" },
    { "source": "n3", "target": "n4", "label": "Yes" },
    { "source": "n3", "target": "n2", "label": "No" }
  ]
}

RULES:
1. Node "type" must be exactly one of: "start" | "process" | "decision" | "end"
   - start: the beginning of the flow (one node, label like "Start")
   - process: an action, task, or step (most nodes)
   - decision: a yes/no or branch point (diamond shape) - label should be a question
   - end: a terminal/outcome node (label like "End", "Done", result)
2. Use exactly ONE "start" node and at least ONE "end" node.
3. Labels must be concise (max ~6 words). Use title case for readability.
4. Every branch from a "decision" node needs its own edge with a short label ("Yes"/"No" or a condition).
5. Edges use the node ids. An edge can point backward (a loop back to an earlier step) - that is allowed for retry/redo flows.
6. Include ALL meaningful steps from the request. Do not add steps that were not asked for.
7. ids must be unique strings: "n1", "n2", ...
8. Output ONLY the JSON object, nothing before or after.

User Request:
${state.prompt}
`)

        const parsed = parseDiagram(res.content)
        const nodes = Array.isArray(parsed?.nodes) ? parsed.nodes : []
        const edges = Array.isArray(parsed?.edges) ? parsed.edges : []

        if (nodes.length === 0) {
            return {
                ...state,
                aiResponse: "I couldn't generate a valid diagram. Please try again with a clearer description."
            }
        }

        await deductCredits(state.userId, "diagram")

        const normalized = nodes.map((n) => ({
            id: String(n.id),
            label: String(n.label || ""),
            type: NODE_TYPES.includes(n.type) ? n.type : "process"
        }))

        const ids = new Set(normalized.map((n) => n.id))
        const normalizedEdges = edges
            .map((e) => ({
                source: String(e.source),
                target: String(e.target),
                label: e.label ? String(e.label) : ""
            }))
            .filter((e) => ids.has(e.source) && ids.has(e.target))

        return {
            ...state,
            aiResponse: "Here is the diagram you requested:",
            diagramData: { nodes: normalized, edges: normalizedEdges }
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to generate diagram"
        }
    }
}