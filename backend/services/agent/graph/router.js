import { getModel } from "../config/llmModels.js"
import { agent } from "../controllers/agent.controller.js"

export const router = async (state) => {

  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent
    }
  }

  if(state.file){
if(state.file.mimetype==="application/pdf"){
    return {
      ...state,
      agent:"pdfRag"
    }
  }

    if(state.file.mimetype.startsWith("image/")){
    return {
      ...state,
      agent:"imageAnalyzer"
    }
  }

    if(state.file.mimetype==="text/csv" ||
       state.file.mimetype==="application/vnd.ms-excel" ||
       state.file.originalname.toLowerCase().endsWith(".csv")){
    return {
      ...state,
      agent:"data"
    }
  }
  }

  


  const llm = await getModel("router")
  const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision
- codeRunner
- data
- diagram
- resume
- translate
- video

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
  Generate image,
  create image

codeRunner:
  Run code,
  execute code,
  test code,
  what does this code output,
  compile and run

data:
  Analyze csv,
  analyze data,
  data analysis,
  statistics,
  charts from data

diagram:
  Flowchart,
  architecture diagram,
  sequence diagram,
  er diagram,
  mindmap,
  mermaid

resume:
  Analyze resume,
  ATS score,
  resume review

translate:
  Translate text to another language,
  translation

video:
  Generate video,
  make a video,
  video slideshow,
  storyboard video

Return ONLY one word:

chat
search
coding
pdf
ppt
vision
codeRunner
data
diagram
resume
translate
video

User Query:
 ${state.prompt}
`

  const response = await llm.invoke(prompt)

  return {
    ...state,
    agent: response.content
      .trim()
      .toLowerCase()
  }



}