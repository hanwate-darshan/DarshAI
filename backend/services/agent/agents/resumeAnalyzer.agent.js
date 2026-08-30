import fs from "fs"
import { PDFParse } from "pdf-parse"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"
import { generateResumePdf } from "../utils/generateResumePdf.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"

const parseResumeJson = (raw) => {
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

const generateResume = async (state) => {
    const llm = await getModel("resume")
    const prompt = `
You are an expert resume writer. Build a clean, ATS-friendly resume from the candidate's details below.

Return STRICT JSON ONLY (no markdown fences, no explanation) with this exact shape:

{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+91-0000000000",
  "location": "City, Country",
  "summary": "2-3 line professional summary with keywords from the details.",
  "skills": [
    { "category": "Technical", "items": ["skill1", "skill2"] },
    { "category": "Soft Skills", "items": ["skill1", "skill2"] }
  ],
  "experience": [
    { "title": "Job Title", "company": "Company Name", "dates": "2022 - Present", "points": ["achievement bullet 1", "achievement bullet 2"] }
  ],
  "education": [
    { "degree": "Degree Name", "institution": "Institution", "year": "2020" }
  ],
  "certifications": [
    { "name": "Certification Name", "issuer": "Issuing Org" }
  ],
  "projects": [
    { "name": "Project Name", "description": "Short description with tech keywords" }
  ]
}

RULES:
- Use ONLY the details provided by the candidate. If something is missing, omit that field (empty array).
- Write achievement-based bullet points starting with strong action verbs.
- Include relevant keywords for ATS scanning.
- Keep bullet points concise and specific.
- Do NOT invent facts that were not provided.
- Output ONLY the JSON object.

Candidate Details:
${state.prompt}
`

    const res = await llm.invoke(prompt)
    const data = parseResumeJson(res.content)

    if (!data || !data.name) {
        return {
            ...state,
            aiResponse: "I couldn't generate a resume from the details you provided. Please include your name, skills, and experience."
        }
    }

    await deductCredits(state.userId, "resume")

    const pdfBuffer = await generateResumePdf(data)
    const filename = `resume-${Date.now()}.pdf`
    await uploadToS3(filename, pdfBuffer, "application/pdf")
    const downloadUrl = await getFromS3(filename, 60 * 60)

    const sections = []

    if (data.summary) {
        sections.push(`**${data.summary}**`)
    }

    if (data.skills?.length > 0) {
        const skillsText = data.skills
            .map((s) => `**${s.category || "Skills"}:** ${s.items?.join(", ") || ""}`)
            .join("\n\n")
        sections.push(skillsText)
    }

    if (data.experience?.length > 0) {
        const expText = data.experience
            .map((exp) => {
                const header = `### ${exp.title}${exp.company ? ` — ${exp.company}` : ""}${exp.dates ? `  \n_${exp.dates}_` : ""}`
                const points = exp.points?.map((p) => `- ${p}`).join("\n") || ""
                return `${header}\n${points}`
            })
            .join("\n\n")
        sections.push(expText)
    }

    if (data.education?.length > 0) {
        const eduText = data.education
            .map((edu) => `- ${edu.degree}${edu.institution ? `, ${edu.institution}` : ""}${edu.year ? ` (${edu.year})` : ""}`)
            .join("\n")
        sections.push(`### Education\n${eduText}`)
    }

    if (data.certifications?.length > 0) {
        const certText = data.certifications
            .map((c) => `- ${c.name || c}${c.issuer ? ` — ${c.issuer}` : ""}`)
            .join("\n")
        sections.push(`### Certifications\n${certText}`)
    }

    if (data.projects?.length > 0) {
        const projText = data.projects
            .map((p) => `- **${p.name}**${p.description ? ` — ${p.description}` : ""}`)
            .join("\n")
        sections.push(`### Projects\n${projText}`)
    }

    return {
        ...state,
        aiResponse: `# ${data.name}\n\n${sections.join("\n\n")}\n\n---\n\n📥 **[Download Resume PDF](${downloadUrl})**\n\n_Link expires in 1 hour._`
    }
}

const analyzeResume = async (state) => {
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
}

export const resumeAnalyzer = async (state) => {
    try {
        await checkAgentLimit(state.userId, "resume")
        if (state.file) {
            return await analyzeResume(state)
        }
        return await generateResume(state)
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to process resume request"
        }
    } finally {
        try { fs.unlinkSync(state.file?.path) } catch (e) { }
    }
}