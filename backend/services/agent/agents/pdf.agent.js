import { getModel } from "../config/llmModels.js"
import { generatePdf } from "../utils/generatePdf.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"

const parseJson = (raw) => {
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

export const pdfAgent=async (state) => {
    try {
        const rate=await checkAgentLimit(state.userId,"pdf")
        
        
        const llm=await getModel("pdf")
        const prompt=`
        You are an expert document writer.

Generate a well-structured PDF document on the given topic.

Return ONLY valid JSON with this exact shape (no markdown fences, no explanation, nothing before or after):

{
  "title": "document title",
  "subtitle": "short subtitle",
  "sections": [
    {
      "heading": "section heading",
      "points": ["concise point 1", "concise point 2"]
    }
  ]
}

Rules:
- Generate 4-8 sections.
- Each section should have 3-6 concise, informative bullet points.
- Include an "Introduction" section and a "Conclusion" section.
- Use only facts, no placeholders.
- Output ONLY the JSON object.

Topic:

${state.prompt}
        `

        const res=await llm.invoke(prompt)
        const data=parseJson(res.content)
       await deductCredits(state.userId,"pdf")

       if (!data || !data.title || !Array.isArray(data.sections)) {
           return {
               ...state,
               aiResponse:"I couldn't generate the document. Please try again with a clearer topic."
           }
       }
        
        const pdfBuffer=await generatePdf(data)

        const filename=`pdf-${Date.now()}.pdf`
        await uploadToS3(filename,pdfBuffer,"application/pdf")

        const downloadUrl=await getFromS3(filename,24*60)

        return {
          ...state,
          aiResponse:`# PDF Generated

**${data.title}**

📥 [Download PDF](${downloadUrl})

_Link expires in 10 minutes._`
        }

    } catch (error) {
       console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate pdf"
        }
    }
}
