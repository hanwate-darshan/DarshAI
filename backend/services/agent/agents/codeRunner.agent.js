import { checkAgentLimit } from "../config/agentLimit.js"
import { deductCredits } from "../utils/deductCredits.js"
import { detectLanguage, extractCode, runCode } from "../utils/piston.js"

export const codeRunnerAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "codeRunner")

        const code = extractCode(state.prompt)
        if (!code) {
            return {
                ...state,
                aiResponse: "Please provide the code to run in a code block, e.g.:\n\n```python\nprint('hello')\n```"
            }
        }

        const language = detectLanguage(code, state.prompt)
        const result = await runCode({ language, code })
        await deductCredits(state.userId, "codeRunner")

        const output = result?.run?.output || result?.run?.stdout || ""
        const stderr = result?.run?.stderr || ""
        const exitCode = result?.run?.code ?? "?"

        let response = `## Execution Output\n\n`
        response += `- **Language:** ${language}\n`
        response += `- **Exit Code:** ${exitCode}\n\n`
        response += output ? `\`\`\`\n${output.slice(0, 4000)}\n\`\`\`\n` : "_(no output)_\n"
        if (stderr) {
            response += `\n### stderr\n\n\`\`\`\n${stderr.slice(0, 2000)}\n\`\`\`\n`
        }

        return {
            ...state,
            aiResponse: response
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to run code"
        }
    }
}
