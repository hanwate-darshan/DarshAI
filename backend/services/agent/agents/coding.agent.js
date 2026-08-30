import { checkAgentLimit } from "../config/agentLimit.js"
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

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

export const codingAgent=async (state) => {
try {
   await checkAgentLimit(state.userId,"coding")
   const intentLlm=await getModel("intent")
   const llm=await getModel("coding")
   const intentRes=await intentLlm.invoke(`
    You are an intent classifier for a coding assistant.

Classify the user's request into EXACTLY ONE of these categories:

CODE_GENERATION - user wants to build, create, or generate a program/app/website/script
CODE_REVIEW - user wants their code reviewed
CODE_EXPLANATION - user wants code explained
DEBUGGING - user reports a bug or asks to fix an error
OPTIMIZATION - user wants performance/quality improvements
CONVERSION - user wants code translated to another language
DOCUMENTATION - user wants docs/comments/readme

Return ONLY the category word. No explanation, no punctuation.

User Request:
${state.prompt}
    `)
    const intent=String(intentRes.content).trim().toUpperCase()
    if(intent=="CODE_GENERATION"){
        const prompt=`
        You are DarshAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

IMAGES
=========================

Always use real Unsplash images (https://images.unsplash.com/...).

Never use placeholders.

Return ONLY valid JSON.

Schema:

{
  "files":[
    {
      "name":"index.html",
      "content":"..."
    },
    {
      "name":"style.css",
      "content":"..."
    },
    {
      "name":"script.js",
      "content":"..."
    }
  ]
}

Rules:

- The files must be complete, working code. No placeholder comments like "// add logic here".
- index.html must include the stylesheet and script links.
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
${state.prompt}
        ` 
        const res=await llm.invoke(prompt)
        const data=parseJson(res.content)
        await deductCredits(state.userId,"coding")

        if (!data || !Array.isArray(data.files) || data.files.length === 0) {
            return {
                ...state,
                aiResponse: "I couldn't generate the code. Please try again with a clearer description.",
                artifacts: []
            }
        }

        const fileNames = data.files.map(f => f?.name).join(", ")
        
        return {
            ...state,
            aiResponse:`## Code Generated

Generated **${data.files.length} files**: ${fileNames}

The code is available in the **artifact panel** on the right — switch to the **Preview** tab to see it live.`,
            artifacts:[
                {
                    id:Date.now(),
                    type:"Project",
                    files:data.files || [],
                    title:state.prompt
                }
            ]
        }
    }

    const res=await llm.invoke(`
        The user's request is:

${state.prompt}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}
        `)

   const data=res.content   
   await deductCredits(state.userId,"coding")
   
   return {
    ...state,
    aiResponse:data,
    artifacts:[]
   }  
} catch (error) {
   console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate code",
            artifacts:[]
        }
}
  
}
