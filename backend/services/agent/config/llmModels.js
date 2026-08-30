import dotenv from "dotenv"
dotenv.config()
import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";
const groq=new ChatGroq({
    model:"openai/gpt-oss-120b"
})

const gemini=new ChatGoogleGenerativeAI({
    model:"gemini-2.5-flash"
})

const openrouter=new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:4000
})


export const getModel=async (agent)=>{
    switch (agent) {
        case "chat":
            return groq;
        case "search" :    
           return groq;
        case "coding": 
           return openrouter; 
        case "intent":
           return groq;
        case "imageAnalyzer": 
           return gemini;
        case "translate":
           return openrouter;
        case "diagram":
        case "resume":
        case "data":
        case "video":
        case "ppt":
        case "pdf":
           return groq;
    
        default:
            return groq;
    }
}

