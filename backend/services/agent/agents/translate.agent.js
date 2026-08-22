import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

const detectTargetLanguage = (prompt) => {
    const patterns = [
        /translate\s+(?:to|into|in)\s+([a-zA-Z]{2,20})/i,
        /(?:translate|say|write)\s+this\s+in\s+([a-zA-Z]{2,20})/i,
        /^in\s+([a-zA-Z]{2,20})\s*:/i,
        /^to\s+([a-zA-Z]{2,20})\s*:/i
    ]
    for (const pattern of patterns) {
        const match = prompt.match(pattern)
        if (match && match[1]) return match[1].toLowerCase()
    }
    return null
}

const stripInstruction = (prompt, language) => {
    return prompt
        .replace(new RegExp(`^in\\s+${language}\\s*:\\s*`, "i"), "")
        .replace(new RegExp(`^to\\s+${language}\\s*:\\s*`, "i"), "")
        .replace(new RegExp(`translate\\s+(?:to|into|in)\\s+${language}\\s*[:.-]?\\s*`, "i"), "")
        .replace(/^(?:translate|say|write)\s+this\s+in\s+\w+\s*[:.-]?\s*/i, "")
        .trim()
}

export const translateAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "translate")

        const language = detectTargetLanguage(state.prompt)
        if (!language) {
            return {
                ...state,
                aiResponse: `## Translation\n\nI couldn't detect a target language.\n\nUsage:\n\n\`translate to French: Hello, how are you?\`\n\n\`in Spanish: Good morning\``
            }
        }

        const sourceText = stripInstruction(state.prompt, language)
        if (!sourceText) {
            return {
                ...state,
                aiResponse: "Please include the text to translate after the language, e.g. `translate to French: Hello world`."
            }
        }

        const llm = await getModel("translate")
        const res = await llm.invoke(`
You are a professional translator.

Translate the source text into ${language}.

Return ONLY valid JSON:

{
  "translation": "the translated text",
  "backTranslation": "an English rendering of your translation",
  "notes": "short note about tone/meaning choices, or null"
}

Rules:
- Preserve tone, meaning and nuance.
- No markdown.
- No extra text.

Source text:
${sourceText}
`)

        let data = null
        try {
            data = JSON.parse(res.content)
        } catch (e) {
            data = { translation: String(res.content).trim(), backTranslation: null, notes: null }
        }

        await deductCredits(state.userId, "translate")

        let response = `## Translation (${language})\n\n`
        response += `> ${data.translation}\n\n`
        if (data.backTranslation) {
            response += `### Back Translation\n\n${data.backTranslation}\n\n`
        }
        if (data.notes) {
            response += `### Notes\n\n${data.notes}\n`
        }

        return {
            ...state,
            aiResponse: response
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to translate"
        }
    }
}
