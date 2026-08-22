import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const PISTON_URL = process.env.PISTON_URL || "http://localhost:2000/api/v2/piston/execute"

const LANGUAGE_MAP = {
    python: "python",
    py: "python",
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    java: "java",
    c: "c",
    cpp: "c++",
    "c++": "c++",
    go: "go",
    rust: "rust",
    ruby: "ruby",
    php: "php",
    bash: "bash",
    sh: "bash"
}

export const extractCode = (content) => {
    const fence = content.match(/```(?:\w+)?\n([\s\S]*?)```/)
    if (fence && fence[1].trim()) return fence[1].trim()
    return content.trim()
}

export const detectLanguage = (code, prompt = "") => {
    const fenceMatch = code.startsWith("```") ? code.match(/```(\w+)/) : null
    if (fenceMatch && fenceMatch[1]) {
        const mapped = LANGUAGE_MAP[fenceMatch[1].toLowerCase()]
        if (mapped) return mapped
    }

    for (const [key, value] of Object.entries(LANGUAGE_MAP)) {
        if (new RegExp(`\\b${key.replace(/\+/g, "\\+")}\\b`, "i").test(prompt)) return value
    }

    return "python"
}

export const runCode = async ({ language, code, stdin = "" }) => {
    const { data } = await axios.post(PISTON_URL, {
        language,
        version: "*",
        files: [{ content: code }],
        stdin
    })
    return data
}
