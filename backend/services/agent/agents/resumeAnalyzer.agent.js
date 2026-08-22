import fs from "fs"
import { PDFParse } from "pdf-parse"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

export const resumeAnalyzer = async (state) => {
    try {
        await checkAgentLimit(state.userId, "resume")

        const buffer = fs.readFileSync(state.file.path)
        const pdf = new PDFParse({ data: buffer })
        const result = await pdf.getText()
        const resumeText = result.text

        if (!resumeText || resumeText.trim().length < 50) {
            return {
                ...state,
                aiResponse: "Could not extract enough text from the resume. Please upload a clear text-based PDF."
            }
        }

        const llm = await getModel("resume")
        const messages = [
            new SystemMessage(`You are DarshAI Resume Analyzer, an expert ATS resume reviewer.

Analyze the candidate's resume and return a detailed markdown report with exactly these sections:

# Resume Analysis
## ATS Score
- Score out of 100 + 1 line justification

## Extracted Skills
- bullet list grouped into Technical / Soft skills

## Strengths
- bullet list

## Gaps & Improvements
- bullet list (specific, actionable)

## Summary
- 2-3 line verdict

Be honest, specific, and constructive.`),
            new HumanMessage(`Resume text:

${resumeText.slice(0, 12000)}

${state.prompt && !/analyze|resume|review/i.test(state.prompt) ? `Additional user context:\n${state.prompt}` : ""}`)
        ]

        const response = await llm.invoke(messages)
        await deductCredits(state.userId, "resume")

        return {
            ...state,
            aiResponse: response.content
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to analyze resume"
        }
    } finally {
        try { fs.unlinkSync(state.file.path) } catch (e) { }
    }
}
