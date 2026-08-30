import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
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

export const pptAgent=async (state) => {
    try {
        await checkAgentLimit(state.userId,"ppt")
        const llm=await getModel("ppt")
        const prompt=`You are a professional presentation designer.

Generate a well-structured presentation on the given topic.

Return ONLY valid JSON with this exact shape (no markdown fences, no explanation, nothing before or after):

{
  "title": "presentation title",
  "subtitle": "short subtitle",
  "slides": [
    {
      "title": "slide title",
      "points": ["bullet point 1", "bullet point 2", "bullet point 3"]
    }
  ]
}

Rules:
- Generate exactly 5 content slides. A cover slide and a thank-you slide are added automatically — do NOT include them.
- Slide order: 1) Introduction, 2) Overview, 3) Key Features, 4) Benefits, 5) Conclusion.
- Each slide should have 3-4 short, concise bullet points (max 12 words each).
- Keep text brief and factual. No placeholders.
- No markdown, no explanation, no code block.
- Output ONLY JSON.

Topic:

${state.prompt}`

const res=await llm.invoke(prompt)
const data=parseJson(res.content)
await deductCredits(state.userId,"ppt")

if (!data || !data.title || !Array.isArray(data.slides)) {
    return {
        ...state,
        aiResponse: "I couldn't generate the presentation. Please try again with a clearer topic."
    }
}

const ppt=await generatePpt(data)
const buffer=await ppt.write({
    outputType:"nodebuffer"
})

const filename=`ppt-${Date.now()}.pptx`

await uploadToS3(filename,buffer,"application/vnd.openxmlformats-officedocument.presentationml.presentation")
const downloadUrl=await getFromS3(filename,24*60*60)

return {
    ...state,
    aiResponse:`# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 10 minutes._`
}

    } catch (error) {
        console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate ppt"
        }
       

       
    }
}