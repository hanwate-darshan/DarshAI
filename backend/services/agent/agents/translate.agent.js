import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

const LANGUAGES = [
    { name: "english", aliases: ["english", "angrezi", "eng"] },
    { name: "marathi", aliases: ["marathi", "marati", "mr"] },
    { name: "hindi", aliases: ["hindi", "hindi"] },
    { name: "french", aliases: ["french", "french"] },
    { name: "spanish", aliases: ["spanish", "español", "espanol", "spanish"] },
    { name: "german", aliases: ["german", "deutsch"] },
    { name: "italian", aliases: ["italian", "italiano"] },
    { name: "portuguese", aliases: ["portuguese", "português", "portugues"] },
    { name: "japanese", aliases: ["japanese", "japanese"] },
    { name: "korean", aliases: ["korean", "korean"] },
    { name: "chinese", aliases: ["chinese", "mandarin", "chinese"] },
    { name: "russian", aliases: ["russian", "russian"] },
    { name: "arabic", aliases: ["arabic", "arabic"] },
    { name: "tamil", aliases: ["tamil", "tamil"] },
    { name: "telugu", aliases: ["telugu", "telugu"] },
    { name: "bengali", aliases: ["bengali", "bengali"] },
    { name: "gujarati", aliases: ["gujarati", "gujarati"] },
    { name: "kannada", aliases: ["kannada", "kannada"] },
    { name: "punjabi", aliases: ["punjabi", "punjabi"] },
    { name: "malayalam", aliases: ["malayalam", "malayalam"] },
    { name: "urdu", aliases: ["urdu", "urdu"] },
    { name: "nepali", aliases: ["nepali", "nepali"] },
    { name: "dutch", aliases: ["dutch", "dutch"] },
    { name: "swedish", aliases: ["swedish", "swedish"] },
    { name: "norwegian", aliases: ["norwegian", "norwegian"] },
    { name: "danish", aliases: ["danish", "danish"] },
    { name: "finnish", aliases: ["finnish", "finnish"] },
    { name: "polish", aliases: ["polish", "polish"] },
    { name: "turkish", aliases: ["turkish", "turkish"] },
    { name: "vietnamese", aliases: ["vietnamese", "vietnamese"] },
    { name: "thai", aliases: ["thai", "thai"] },
    { name: "greek", aliases: ["greek", "greek"] }
]

const detectTargetLanguage = (prompt) => {
    const lower = prompt.toLowerCase()
    for (const lang of LANGUAGES) {
        for (const alias of lang.aliases) {
            if (new RegExp(`\\b${alias}\\b`, "i").test(lower)) {
                return lang.name
            }
        }
    }
    return null
}

const stripInstruction = (prompt, language) => {
    const lower = prompt.toLowerCase()
    const instructions = [
        /(?:translate|convert|change|turn)\s+(?:this|it|the\s+(?:text|sentence|message|following))?\s*(?:into|to|in|to\s+the)\s+/i,
        /(?:translate|convert|change|turn)\s+(?:into|to|in)\s+/i,
        /^(?:in|to|into)\s+/i,
        /^(?:please\s+)?(?:translate|convert|change|turn)\s+/i
    ]

    let clean = prompt
    for (const pattern of instructions) {
        clean = clean.replace(pattern, "")
    }

    clean = clean
        .replace(new RegExp(`\\b${language}\\b`, "i"), "")
        .replace(/\s*(?:language|lang)\s*/i, "")
        .replace(/^[\s:.\-]+/, "")
        .trim()

    return clean
}

export const translateAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "translate")

        const language = detectTargetLanguage(state.prompt)
        if (!language) {
            return {
                ...state,
                aiResponse: `## Translation\n\nI couldn't detect a target language.\n\nUsage:\n\n\`translate to French: Hello, how are you?\`\n\n\`in Spanish: Good morning\`\n\n\`convert this into Marathi: Hello\``
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

Return ONLY valid JSON with this exact shape (no markdown fences, no explanation, nothing before or after):

{"translation": "the translated text", "backTranslation": "an English rendering of your translation", "notes": "short note about tone/meaning choices, or null"}

Rules:
- The "translation" value must be the FULL text translated into ${language}, and ONLY that.
- Preserve tone, meaning and nuance.
- No markdown.
- No extra text.

Source text:
${sourceText}
`)

        let data = null
        const raw = String(res.content).trim()
        const firstBrace = raw.indexOf("{")
        const lastBrace = raw.lastIndexOf("}")
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            try {
                data = JSON.parse(raw.slice(firstBrace, lastBrace + 1))
            } catch (e) {
                data = null
            }
        }
        if (!data || !data.translation) {
            data = { translation: raw.replace(/^```(?:json)?\s*/, "").replace(/```$/, "").trim(), backTranslation: null, notes: null }
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