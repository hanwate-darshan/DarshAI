import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { visionAgent } from "../agents/vision.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";
import { codeRunnerAgent } from "../agents/codeRunner.agent.js";
import { dataAnalyzer } from "../agents/dataAnalyzer.agent.js";
import { diagramAgent } from "../agents/diagram.agent.js";
import { resumeAnalyzer } from "../agents/resumeAnalyzer.agent.js";
import { translateAgent } from "../agents/translate.agent.js";
import { videoAgent } from "../agents/video.agent.js";

const workflow=new StateGraph(agentState)

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("vision",visionAgent)
workflow.addNode("pdfRag",pdfRag)
workflow.addNode("imageAnalyzer",imageAnalyzer)
workflow.addNode("codeRunner",codeRunnerAgent)
workflow.addNode("data",dataAnalyzer)
workflow.addNode("diagram",diagramAgent)
workflow.addNode("resume",resumeAnalyzer)
workflow.addNode("translate",translateAgent)
workflow.addNode("video",videoAgent)

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>{
   switch (state.agent) {
    case "chat":
     return "chat";
    case "search":
     return "search";
    case "coding":
     return "coding";
    case "pdf":
     return "pdf";
    case "ppt":
     return "ppt";
    case "vision":
     return "vision";
    case "pdfRag":
     return "pdfRag";
     case "imageAnalyzer":
     return "imageAnalyzer";
    case "codeRunner":
     return "codeRunner";
    case "data":
     return "data";
    case "diagram":
     return "diagram";
    case "resume":
     return "resume";
    case "translate":
     return "translate";
    case "video":
     return "video";
    default:
     return "chat"
   }
},{
   chat:"chat",
   search:"search",
   coding:"coding",
   pdf:"pdf" ,
   ppt:"ppt" ,
   vision:"vision",
   pdfRag:"pdfRag",
   imageAnalyzer :"imageAnalyzer",
   codeRunner:"codeRunner",
   data:"data",
   diagram:"diagram",
   resume:"resume",
   translate:"translate",
   video:"video"
})


workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("vision","__end__")
workflow.addEdge("pdfRag","__end__")
workflow.addEdge("imageAnalyzer","__end__")
workflow.addEdge("codeRunner","__end__")
workflow.addEdge("data","__end__")
workflow.addEdge("diagram","__end__")
workflow.addEdge("resume","__end__")
workflow.addEdge("translate","__end__")
workflow.addEdge("video","__end__")

export const graph=workflow.compile()